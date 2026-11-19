import { NextResponse } from 'next/server';
import { passwordResetEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mail';
import { getPublicSiteUrl } from '@/lib/public-site-url';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Body = {
  email?: string;
};

/**
 * Always returns a generic success message so callers cannot probe which emails exist.
 * When the account exists and SMTP is configured, a Supabase recovery link is emailed.
 */
export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  const genericOk = {
    ok: true as const,
    message: 'If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.',
  };

  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    console.error('[reset-password] Supabase admin is not configured');
    return NextResponse.json({
      ...genericOk,
      warning: 'Password reset is temporarily unavailable. Please try again later or contact an administrator.',
    });
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({
      ...genericOk,
      warning: 'Password reset is temporarily unavailable. Please try again later or contact an administrator.',
    });
  }

  const { data: listed, error: listError } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (listError) {
    console.error('[reset-password] listUsers', listError.message);
    return NextResponse.json(genericOk);
  }

  const user = listed.users.find((u) => (u.email || '').toLowerCase() === email);
  if (!user) {
    // Do not reveal that the account is missing
    return NextResponse.json(genericOk);
  }

  if (user.banned_until && new Date(user.banned_until).getTime() > Date.now()) {
    console.warn('[reset-password] banned user requested reset', email);
    return NextResponse.json(genericOk);
  }

  const siteUrl = getPublicSiteUrl();
  const redirectTo = `${siteUrl}/update-password`;

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[reset-password] generateLink', linkError?.message || 'missing action_link');
    return NextResponse.json(
      { ok: false, error: 'Could not create a reset link. Please try again shortly.' },
      { status: 500 },
    );
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle();

  // Email scanners (Gmail, HostGator, antivirus) open links to check them, which burns Supabase's
  // one-time action_link before the person clicks it. Link to our own page with the token hash
  // instead: the page verifies it in the browser (scanners do not run JavaScript).
  const hashedToken = linkData.properties.hashed_token;
  const resetUrl = hashedToken
    ? `${siteUrl}/update-password?token_hash=${encodeURIComponent(hashedToken)}&type=recovery`
    : linkData.properties.action_link;

  const mail = passwordResetEmail({
    fullName: profile?.full_name || user.user_metadata?.full_name || undefined,
    email,
    resetUrl,
  });

  try {
    const sent = await sendMail({ to: email, ...mail });
    if (!sent.ok) {
      console.error('[reset-password] SMTP skipped or failed for', email);
      return NextResponse.json(
        {
          ok: false,
          error:
            'Email could not be sent. SMTP is not configured on the server. Ask an administrator to set SMTP_HOST, SMTP_USER, and SMTP_PASS.',
        },
        { status: 503 },
      );
    }
  } catch (err) {
    console.error('[reset-password] sendMail', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: 'Email could not be sent. Please try again later.' },
      { status: 500 },
    );
  }

  return NextResponse.json(genericOk);
}

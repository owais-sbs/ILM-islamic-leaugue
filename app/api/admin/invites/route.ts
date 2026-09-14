import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { staffInviteAdminNoticeEmail, staffInviteEmail } from '@/lib/email-templates';
import { sendMail, staffInboxEmails } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { roleLabels, type Role } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

const INVITE_HOURS = 48;

type Body = {
  name?: string;
  email?: string;
  role?: Role;
  bio?: string;
  madhhab?: string;
  resendForEmail?: string;
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function toDbRole(role: Role): 'author' | 'editor' | 'admin' {
  if (role === 'administrator') return 'admin';
  if (role === 'editor') return 'editor';
  return 'author';
}

function newToken() {
  return randomBytes(32).toString('hex');
}

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (payload.name || '').trim().slice(0, 120);
  const email = (payload.email || payload.resendForEmail || '').trim().toLowerCase().slice(0, 200);
  const role: Role =
    payload.role === 'editor' || payload.role === 'administrator' || payload.role === 'author'
      ? payload.role
      : 'author';
  const bio = payload.bio?.trim().slice(0, 2000) || null;
  const madhhab = payload.madhhab?.trim().slice(0, 80) || null;
  const isResend = Boolean(payload.resendForEmail);

  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }
  if (!isResend && !name) {
    return NextResponse.json({ ok: false, error: 'Name is required' }, { status: 400 });
  }

  const token = newToken();
  const expiresAt = new Date(Date.now() + INVITE_HOURS * 60 * 60 * 1000);
  const inviteUrl = `${siteUrl()}/author/set-password?token=${token}`;
  const roleLabel = roleLabels[role];
  let inviteName = name;

  if (isSupabaseConfigured()) {
    const db = tryCreateServiceClient();
    if (!db) {
      return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
    }

    if (isResend) {
      const { data: existing, error: findError } = await db
        .from('staff_invites')
        .select('id, full_name, role, bio, madhhab')
        .eq('email', email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) {
        return NextResponse.json({ ok: false, error: findError.message }, { status: 500 });
      }
      if (!existing) {
        return NextResponse.json({ ok: false, error: 'No pending invite found for this email' }, { status: 404 });
      }

      inviteName = String(existing.full_name || email);
      const { error: updateError } = await db
        .from('staff_invites')
        .update({
          token,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
      }
    } else {
      await db
        .from('staff_invites')
        .update({ status: 'revoked', updated_at: new Date().toISOString() })
        .eq('email', email)
        .eq('status', 'pending');

      const { error: insertError } = await db.from('staff_invites').insert({
        email,
        full_name: name,
        role: toDbRole(role),
        bio,
        madhhab,
        token,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) {
        return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
      }
    }
  }

  const inviteMail = staffInviteEmail({
    name: inviteName || email,
    roleLabel,
    inviteUrl,
    expiresHours: INVITE_HOURS,
  });
  const adminMail = staffInviteAdminNoticeEmail({
    name: inviteName || email,
    email,
    roleLabel,
  });

  let emailOk = true;
  try {
    const results = await Promise.allSettled([
      sendMail({ to: email, ...inviteMail }),
      ...staffInboxEmails().map((to) => sendMail({ to, ...adminMail })),
    ]);
    emailOk = results.some((r) => r.status === 'fulfilled' && r.value && 'ok' in r.value && r.value.ok);
    if (results[0]?.status === 'rejected') emailOk = false;
    if (results[0]?.status === 'fulfilled' && results[0].value.skipped) emailOk = false;
  } catch (err) {
    console.error('[invites] email failed', err);
    emailOk = false;
  }

  return NextResponse.json({
    ok: true,
    token,
    expiresAt: expiresAt.getTime(),
    inviteUrl,
    emailOk,
    warning: emailOk ? undefined : 'Author created but invite email failed to send',
  });
}

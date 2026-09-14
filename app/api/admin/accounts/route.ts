import { NextResponse } from 'next/server';
import { accountWelcomeEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { siteConfig } from '@/lib/site';
import type { Role } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

/** Temporary password for newly created accounts — never stored in app tables. */
const TEMP_PASSWORD = '123456';

type Body = {
  fullName?: string;
  email?: string;
  roleId?: number;
  role?: Role;
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function roleIdFromUi(role: Role | undefined, roleId: number | undefined): number {
  if (typeof roleId === 'number' && roleId >= 1 && roleId <= 3) return roleId;
  if (role === 'editor') return 2;
  if (role === 'administrator') return 3;
  return 1;
}

function toProfileRole(roleName: string): 'author' | 'editor' | 'admin' {
  const n = roleName.toLowerCase();
  if (n === 'administrator' || n === 'admin') return 'admin';
  if (n === 'editor') return 'editor';
  return 'author';
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'user'
  );
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const fullName = (payload.fullName || '').trim().slice(0, 120);
  const email = (payload.email || '').trim().toLowerCase().slice(0, 200);
  const roleId = roleIdFromUi(payload.role, payload.roleId);

  if (!fullName || !email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'Full name and a valid email are required' }, { status: 400 });
  }

  const { data: roleRow, error: roleError } = await admin
    .from('role_master')
    .select('id, role_name')
    .eq('id', roleId)
    .maybeSingle();

  if (roleError) {
    return NextResponse.json(
      {
        ok: false,
        error:
          roleError.message.includes('role_master') || roleError.message.includes('schema cache')
            ? 'role_master missing — run migration 20260314000003_account_role_mapping.sql'
            : roleError.message,
      },
      { status: 500 },
    );
  }
  if (!roleRow) {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const roleName = String(roleRow.role_name);
  const profileRole = toProfileRole(roleName);

  const { data: listed } = await admin.auth.admin.listUsers({ perPage: 200 });
  const existing = listed?.users?.find((u) => u.email?.toLowerCase() === email);
  let authUserId = existing?.id;

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: profileRole },
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    authUserId = data.user.id;
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: TEMP_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: profileRole },
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    authUserId = data.user.id;
  }

  if (!authUserId) {
    return NextResponse.json({ ok: false, error: 'Could not create auth user' }, { status: 500 });
  }

  const { data: account, error: accountError } = await admin
    .from('account')
    .upsert(
      {
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        must_change_password: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'auth_user_id' },
    )
    .select('id, email, full_name, must_change_password')
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      {
        ok: false,
        error:
          accountError?.message.includes('account') || accountError?.message.includes('schema cache')
            ? 'account table missing — run migration 20260314000003_account_role_mapping.sql'
            : accountError?.message || 'Account create failed',
      },
      { status: 500 },
    );
  }

  await admin.from('role_mapping').delete().eq('account_id', account.id);

  const { error: mappingError } = await admin.from('role_mapping').insert({
    account_id: account.id,
    role_id: roleRow.id,
  });

  if (mappingError) {
    return NextResponse.json({ ok: false, error: mappingError.message }, { status: 500 });
  }

  // Keep existing profiles / RLS workflow in sync (role still required by articles helpers)
  const slug = slugify(fullName);
  await admin.from('profiles').upsert({
    id: authUserId,
    email,
    full_name: fullName,
    slug,
    role: profileRole,
    is_active: true,
    email_public: email,
    credentials: roleName,
  });

  const mail = accountWelcomeEmail({
    appName: siteConfig.fullName,
    fullName,
    email,
    roleName,
    loginUrl: `${siteUrl()}/login`,
    temporaryPassword: TEMP_PASSWORD,
  });

  let emailOk = false;
  let emailWarning: string | undefined;
  try {
    const sent = await sendMail({ to: email, ...mail });
    emailOk = Boolean(sent.ok);
    if (!emailOk) {
      emailWarning = 'Account created successfully, but the welcome email could not be sent.';
      console.error('[accounts] welcome email failed or SMTP skipped for', email);
    }
  } catch (err) {
    emailOk = false;
    emailWarning = 'Account created successfully, but the welcome email could not be sent.';
    console.error('[accounts] welcome email error', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({
    ok: true,
    accountId: account.id,
    authUserId,
    email,
    fullName,
    roleId: roleRow.id,
    roleName,
    mustChangePassword: true,
    emailOk,
    warning: emailWarning,
  });
}

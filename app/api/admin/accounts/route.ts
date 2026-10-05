import { NextResponse } from 'next/server';
import {
  accountWelcomeEmail,
  accountDeactivatedEmail,
  accountDeletedEmail,
  accountReactivatedEmail,
} from '@/lib/email-templates';
import { sendMail } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { requireAdminWrite } from '@/lib/supabase/admin-bridge';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { siteConfig } from '@/lib/site';
import { getPublicSiteUrl } from '@/lib/public-site-url';
import type { Role } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

/** Temporary password for newly created accounts — never stored in app tables. */
const TEMP_PASSWORD = '123456';

type Body = {
  fullName?: string;
  email?: string;
  roleId?: number;
  role?: Role;
  madhhab?: string;
  bio?: string;
  staffTitle?: string;
};


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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, contributors: [] });
  }

  const access = await requireAdminWrite({ allowEditor: true, allowDemoBridge: true });
  if (!access.ok) return access.response;
  const { admin } = access;

  const { data, error } = await admin
    .from('profiles')
    .select('id, email, full_name, role, is_active, madhhab, bio, avatar_url, credentials')
    .order('full_name', { ascending: true });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const contributors = (data || []).map((profile) => ({
    id: profile.id,
    name: profile.full_name || profile.email,
    email: profile.email,
    role: profile.role === 'admin' ? 'administrator' : profile.role,
    active: profile.is_active,
    madhhab: profile.madhhab || '',
    bio: profile.bio || '',
    staffTitle: profile.credentials || '',
    image: profile.avatar_url || '',
  }));

  return NextResponse.json({ ok: true, contributors });
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
  const madhhab = String(payload.madhhab || '').trim().slice(0, 80) || null;
  const bio = String(payload.bio || '').trim().slice(0, 2000) || null;
  const staffTitle = String(payload.staffTitle || '').trim().slice(0, 300) || roleName;
  await admin.from('profiles').upsert({
    id: authUserId,
    email,
    full_name: fullName,
    slug,
    role: profileRole,
    is_active: true,
    email_public: email,
    credentials: staffTitle,
    madhhab,
    bio,
  });

  const mail = accountWelcomeEmail({
    appName: siteConfig.fullName,
    fullName,
    email,
    roleName,
    loginUrl: `${getPublicSiteUrl()}/login`,
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

type PatchBody = {
  id?: string;
  email?: string;
  active?: boolean;
  action?: 'activate' | 'deactivate' | 'delete';
};

export async function PATCH(req: Request) {
  const access = await requireAdminWrite({ allowEditor: false, allowDemoBridge: true });
  if (!access.ok) return access.response;
  const { admin } = access;

  let payload: PatchBody;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = payload.action || (payload.active === false ? 'deactivate' : payload.active === true ? 'activate' : '');
  if (!action || !['activate', 'deactivate', 'delete'].includes(action)) {
    return NextResponse.json({ ok: false, error: 'action must be activate, deactivate, or delete' }, { status: 400 });
  }

  let profileQuery = admin.from('profiles').select('id, email, full_name, is_active');
  if (payload.id) profileQuery = profileQuery.eq('id', payload.id);
  else if (payload.email) profileQuery = profileQuery.ilike('email', payload.email.trim().toLowerCase());
  else return NextResponse.json({ ok: false, error: 'id or email required' }, { status: 400 });

  const { data: profile, error: findError } = await profileQuery.maybeSingle();
  if (findError) return NextResponse.json({ ok: false, error: findError.message }, { status: 500 });
  if (!profile) return NextResponse.json({ ok: false, error: 'Account not found' }, { status: 404 });

  const loginUrl = `${getPublicSiteUrl()}/login`;
  let emailOk = false;

  if (action === 'delete') {
    // Soft-delete: deactivate profile and ban auth user so articles FK stay valid
    await admin.from('profiles').update({ is_active: false }).eq('id', profile.id);
    try {
      await admin.auth.admin.updateUserById(profile.id, { ban_duration: '876000h' });
    } catch {
      /* ban optional */
    }
    try {
      const mail = accountDeletedEmail({ fullName: profile.full_name || '', email: profile.email });
      const sent = await sendMail({ to: profile.email, ...mail });
      emailOk = Boolean(sent.ok);
    } catch {
      emailOk = false;
    }
    return NextResponse.json({ ok: true, action: 'delete', id: profile.id, emailOk });
  }

  const nextActive = action === 'activate';
  const { error: updateError } = await admin.from('profiles').update({ is_active: nextActive }).eq('id', profile.id);
  if (updateError) return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });

  try {
    if (nextActive) {
      await admin.auth.admin.updateUserById(profile.id, { ban_duration: 'none' });
    } else {
      await admin.auth.admin.updateUserById(profile.id, { ban_duration: '876000h' });
    }
  } catch {
    /* auth ban optional if user missing */
  }

  try {
    const mail = nextActive
      ? accountReactivatedEmail({ fullName: profile.full_name || '', email: profile.email, loginUrl })
      : accountDeactivatedEmail({ fullName: profile.full_name || '', email: profile.email });
    const sent = await sendMail({ to: profile.email, ...mail });
    emailOk = Boolean(sent.ok);
  } catch {
    emailOk = false;
  }

  return NextResponse.json({ ok: true, action, id: profile.id, active: nextActive, emailOk });
}

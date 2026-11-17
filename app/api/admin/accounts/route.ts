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
  showInDirectory?: boolean;
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

  // New authors are murabbiyūn: list them on the public directory unless the form opted out.
  if (payload.showInDirectory && profileRole === 'author') {
    const { data: current } = await admin.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle();
    const entries = Array.isArray(current?.value) ? (current!.value as Array<Record<string, unknown>>) : [];
    const entry = {
      id: authUserId,
      staffTitle: payload.staffTitle ? staffTitle : '',
      bio: bio || '',
      biography: bio ? [bio] : [],
      focus: null,
      accent: 'bg-sky-100 text-sky-700',
      image: '',
      showInDirectory: true,
      directoryId: '',
    };
    const index = entries.findIndex((e) => e.id === authUserId);
    if (index < 0) entries.push(entry);
    else entries[index] = { ...entries[index], showInDirectory: true };
    const { error: dirError } = await admin
      .from('site_settings')
      .upsert({ key: 'staff_profiles', value: entries }, { onConflict: 'key' });
    if (dirError) console.error('[accounts] could not add directory profile', dirError.message);
  }

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
  action?: 'activate' | 'deactivate' | 'delete' | 'update';
  fullName?: string;
  bio?: string;
  madhhab?: string;
  credentials?: string;
  staffTitle?: string;
  role?: Role;
  roleId?: number;
  avatarUrl?: string | null;
  showInDirectory?: boolean;
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
  if (!action || !['activate', 'deactivate', 'delete', 'update'].includes(action)) {
    return NextResponse.json({ ok: false, error: 'action must be activate, deactivate, delete, or update' }, { status: 400 });
  }

  let profileQuery = admin.from('profiles').select('id, email, full_name, is_active, role, bio, madhhab, credentials, avatar_url');
  if (payload.id) profileQuery = profileQuery.eq('id', payload.id);
  else if (payload.email) profileQuery = profileQuery.ilike('email', payload.email.trim().toLowerCase());
  else return NextResponse.json({ ok: false, error: 'id or email required' }, { status: 400 });

  const { data: profile, error: findError } = await profileQuery.maybeSingle();
  if (findError) return NextResponse.json({ ok: false, error: findError.message }, { status: 500 });
  if (!profile) return NextResponse.json({ ok: false, error: 'Account not found' }, { status: 404 });

  const loginUrl = `${getPublicSiteUrl()}/login`;
  let emailOk = false;

  if (action === 'update') {
    const fullName = (payload.fullName || profile.full_name || '').trim().slice(0, 120);
    if (!fullName) {
      return NextResponse.json({ ok: false, error: 'Full name is required' }, { status: 400 });
    }

    const roleId = roleIdFromUi(payload.role, payload.roleId);
    const { data: roleRow } = await admin.from('role_master').select('id, role_name').eq('id', roleId).maybeSingle();
    const profileRole = roleRow ? toProfileRole(String(roleRow.role_name)) : toProfileRole(String(profile.role || 'author'));

    const patch: Record<string, unknown> = {
      full_name: fullName,
      bio: typeof payload.bio === 'string' ? payload.bio.trim() : profile.bio,
      madhhab: typeof payload.madhhab === 'string' ? payload.madhhab.trim() : profile.madhhab,
      credentials:
        typeof payload.credentials === 'string'
          ? payload.credentials.trim()
          : typeof payload.staffTitle === 'string'
            ? payload.staffTitle.trim()
            : profile.credentials,
      role: profileRole,
      slug: slugify(fullName),
      updated_at: new Date().toISOString(),
    };
    if (typeof payload.avatarUrl === 'string') {
      patch.avatar_url = payload.avatarUrl.trim() || null;
    } else if (payload.avatarUrl === null) {
      patch.avatar_url = null;
    }

    const { error: updateError } = await admin.from('profiles').update(patch).eq('id', profile.id);
    if (updateError) return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });

    await admin
      .from('account')
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', profile.id);

    if (roleRow) {
      const { data: accountRow } = await admin.from('account').select('id').eq('auth_user_id', profile.id).maybeSingle();
      if (accountRow?.id) {
        await admin.from('role_mapping').delete().eq('account_id', accountRow.id);
        await admin.from('role_mapping').insert({ account_id: accountRow.id, role_id: roleRow.id });
      }
    }

    // Optional directory visibility via staff_profiles CMS document
    if (typeof payload.showInDirectory === 'boolean' || typeof payload.staffTitle === 'string' || typeof payload.bio === 'string') {
      const { data: staffSetting } = await admin.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle();
      const current = Array.isArray(staffSetting?.value) ? ([...(staffSetting!.value as Array<Record<string, unknown>>)] as Array<Record<string, unknown>>) : [];
      const idx = current.findIndex((entry) => {
        const entryId = String(entry.id || '');
        const entryEmail = String(entry.email || '').toLowerCase();
        return entryId === profile.id || entryEmail === String(profile.email || '').toLowerCase();
      });
      const nextEntry = {
        ...(idx >= 0 ? current[idx] : {}),
        id: profile.id,
        name: fullName,
        email: profile.email,
        role: profileRole === 'admin' ? 'administrator' : profileRole,
        madhhab: patch.madhhab,
        bio: patch.bio,
        staffTitle: typeof payload.staffTitle === 'string' ? payload.staffTitle.trim() : (idx >= 0 ? current[idx].staffTitle : undefined),
        showInDirectory:
          typeof payload.showInDirectory === 'boolean'
            ? payload.showInDirectory
            : idx >= 0
              ? current[idx].showInDirectory !== false
              : true,
        active: true,
        image: typeof patch.avatar_url === 'string' ? patch.avatar_url : idx >= 0 ? current[idx].image : undefined,
      };
      if (idx >= 0) current[idx] = nextEntry;
      else current.push(nextEntry);
      await admin.from('site_settings').upsert({ key: 'staff_profiles', value: current }, { onConflict: 'key' });
    }

    return NextResponse.json({
      ok: true,
      action: 'update',
      id: profile.id,
      fullName,
      role: profileRole,
    });
  }

  if (action === 'delete') {
    // Hard-delete: reassign owned articles, drop account mapping, then remove auth user
    // (profiles cascade from auth.users). Articles.author_id is ON DELETE RESTRICT.
    if (access.userId && access.userId === profile.id) {
      return NextResponse.json(
        { ok: false, error: 'You cannot delete the account you are signed in with.' },
        { status: 400 },
      );
    }

    const { data: fallback } = await admin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .eq('is_active', true)
      .neq('id', profile.id)
      .order('full_name', { ascending: true })
      .limit(1)
      .maybeSingle();

    let fallbackAuthorId = fallback?.id || access.userId || null;
    if (!fallbackAuthorId) {
      const { data: anyOther } = await admin
        .from('profiles')
        .select('id')
        .neq('id', profile.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      fallbackAuthorId = anyOther?.id || null;
    }

    if (fallbackAuthorId) {
      const { error: reassignError } = await admin
        .from('articles')
        .update({ author_id: fallbackAuthorId })
        .eq('author_id', profile.id);
      if (reassignError) {
        return NextResponse.json(
          { ok: false, error: `Could not reassign articles before delete: ${reassignError.message}` },
          { status: 500 },
        );
      }
    } else {
      const { count } = await admin
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', profile.id);
      if ((count || 0) > 0) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'This account still has articles and no other active staff member exists to reassign them to.',
          },
          { status: 409 },
        );
      }
    }

    // Clear optional FKs that might still block deletion on older schemas
    await admin.from('questions').update({ assigned_to: null }).eq('assigned_to', profile.id);
    await admin.from('media').update({ uploaded_by: null }).eq('uploaded_by', profile.id);
    await admin.from('activity_log').update({ actor_id: null }).eq('actor_id', profile.id);
    await admin.from('articles').update({ approved_by: null }).eq('approved_by', profile.id);

    const { data: accountRow } = await admin
      .from('account')
      .select('id')
      .eq('auth_user_id', profile.id)
      .maybeSingle();
    if (accountRow?.id) {
      await admin.from('role_mapping').delete().eq('account_id', accountRow.id);
      await admin.from('account').delete().eq('id', accountRow.id);
    }

    // Remove from staff_profiles CMS document if present
    const { data: staffSetting } = await admin
      .from('site_settings')
      .select('value')
      .eq('key', 'staff_profiles')
      .maybeSingle();
    const staffProfiles = staffSetting?.value;
    if (Array.isArray(staffProfiles)) {
      const currentProfiles = staffProfiles as Array<Record<string, unknown>>;
      const nextProfiles = currentProfiles.filter((entry) => {
        const entryId = String(entry.id || '');
        const entryEmail = String(entry.email || '').toLowerCase();
        return entryId !== profile.id && entryEmail !== String(profile.email || '').toLowerCase();
      });
      if (nextProfiles.length !== currentProfiles.length) {
        await admin.from('site_settings').upsert(
          { key: 'staff_profiles', value: nextProfiles },
          { onConflict: 'key' },
        );
      }
    }

    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(profile.id);
    if (deleteAuthError) {
      // Fallback: if auth user already gone, try deleting the orphaned profile row
      const { error: profileDeleteError } = await admin.from('profiles').delete().eq('id', profile.id);
      if (profileDeleteError) {
        return NextResponse.json(
          {
            ok: false,
            error: deleteAuthError.message || profileDeleteError.message || 'Could not delete account',
          },
          { status: 500 },
        );
      }
    }

    try {
      const mail = accountDeletedEmail({ fullName: profile.full_name || '', email: profile.email });
      const sent = await sendMail({ to: profile.email, ...mail });
      emailOk = Boolean(sent.ok);
    } catch {
      emailOk = false;
    }
    return NextResponse.json({ ok: true, action: 'delete', id: profile.id, emailOk, hardDeleted: true });
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

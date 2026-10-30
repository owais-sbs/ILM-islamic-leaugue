/**
 * Create / reset ILM staff Auth users + profiles + account role mapping.
 * Credentials come from .env only (never bundled into the client).
 *
 *   ILM_ADMIN_EMAIL / ILM_ADMIN_PASSWORD
 *   ILM_EDITOR_EMAIL / ILM_EDITOR_PASSWORD
 *   ILM_AUTHOR_EMAIL / ILM_AUTHOR_PASSWORD
 *
 * Run: node scripts/ensure-demo-users.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile(filename) {
  const envPath = resolve(process.cwd(), filename);
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const i = trimmed.indexOf('=');
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const required = [
  'ILM_ADMIN_EMAIL',
  'ILM_ADMIN_PASSWORD',
  'ILM_EDITOR_EMAIL',
  'ILM_EDITOR_PASSWORD',
  'ILM_AUTHOR_EMAIL',
  'ILM_AUTHOR_PASSWORD',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  {
    email: process.env.ILM_ADMIN_EMAIL,
    password: process.env.ILM_ADMIN_PASSWORD,
    role: 'admin',
    roleName: 'Administrator',
    name: 'Shaykh Ibrahim Al-Fadl',
    slug: 'ibrahim-al-fadl',
    madhhab: 'Hanafi',
    credentials: 'Imam & Educator',
    bio: 'Director of the league, stewarding publishing, people, and the public voice of ILM.',
    avatar:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    email: process.env.ILM_EDITOR_EMAIL,
    password: process.env.ILM_EDITOR_PASSWORD,
    role: 'editor',
    roleName: 'Editor',
    name: 'Ustadh Omar Khalid',
    slug: 'omar-khalid',
    madhhab: 'Hanafi',
    credentials: 'MA Arabic & Islamic Studies',
    bio: 'Editor shaping the ILM library with care for language, sources, and the reader’s heart.',
    avatar:
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&h=800&q=80',
  },
  {
    email: process.env.ILM_AUTHOR_EMAIL,
    password: process.env.ILM_AUTHOR_PASSWORD,
    role: 'author',
    roleName: 'Author',
    name: 'Ustadh Bilal Rahman',
    slug: 'bilal-rahman',
    madhhab: 'Maliki',
    credentials: 'Traditional studies · Fiqh',
    bio: 'Educator and writer focused on spiritual growth and community building.',
    avatar:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&h=800&q=80',
  },
];

async function resolveRoleId(roleName) {
  const { data, error } = await admin
    .from('role_master')
    .select('id, role_name')
    .ilike('role_name', roleName)
    .maybeSingle();
  if (error) throw error;
  if (!data?.id) throw new Error(`role_master missing role: ${roleName}`);
  return data.id;
}

async function ensureUser(u) {
  const { data: listed } = await admin.auth.admin.listUsers({ perPage: 200 });
  const existing = listed?.users?.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());
  let userId = existing?.id;

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.name, role: u.role },
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.name, role: u.role },
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    email: u.email,
    full_name: u.name,
    slug: u.slug,
    role: u.role,
    is_active: true,
    email_public: u.email,
    credentials: u.credentials || u.roleName,
    madhhab: u.madhhab || null,
    bio: u.bio || null,
    avatar_url: u.avatar || null,
  });
  if (profileError) throw profileError;

  const { data: account, error: accountError } = await admin
    .from('account')
    .upsert(
      {
        auth_user_id: userId,
        full_name: u.name,
        email: u.email,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'auth_user_id' },
    )
    .select('id')
    .single();

  if (accountError) {
    // Older DBs may not have account/role_mapping yet — profiles.role still works for login.
    console.warn(`  ⚠ account sync skipped for ${u.email}: ${accountError.message}`);
    return userId;
  }

  const roleId = await resolveRoleId(u.roleName);
  await admin.from('role_mapping').delete().eq('account_id', account.id);
  const { error: mappingError } = await admin.from('role_mapping').insert({
    account_id: account.id,
    role_id: roleId,
  });
  if (mappingError) {
    console.warn(`  ⚠ role_mapping skipped for ${u.email}: ${mappingError.message}`);
  }

  return userId;
}

async function main() {
  console.log('\n=== ILM staff users ===\n');
  console.log(`Supabase: ${url}\n`);
  for (const u of USERS) {
    const id = await ensureUser(u);
    console.log(`  ✅ ${u.role.padEnd(6)} ${u.email}  (${id.slice(0, 8)}…)`);
  }
  console.log('\nDone. Passwords stay in .env only — login form is empty.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

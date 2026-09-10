/**
 * Create / reset ILM demo Auth users + profiles.role
 * Run after SQL setup: node scripts/ensure-demo-users.mjs
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
    const value = trimmed.slice(i + 1).trim();
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

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  { email: 'adminops@gmail.com', password: 'admin123', role: 'admin', name: 'Admin Director' },
  { email: 'author.smoke@ilm.test', password: 'author123', role: 'author', name: 'Smoke Author' },
  { email: 'editor.smoke@ilm.test', password: 'editor123', role: 'editor', name: 'Smoke Editor' },
];

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

  const slug = u.email.split('@')[0].replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    email: u.email,
    full_name: u.name,
    slug,
    role: u.role,
    is_active: true,
    email_public: u.email,
    credentials: u.role === 'admin' ? 'Administrator' : u.role === 'editor' ? 'Editor' : 'Murabbī',
  });
  if (profileError) throw profileError;
  return userId;
}

async function main() {
  console.log('\n=== ILM demo users ===\n');
  console.log(`Supabase: ${url}\n`);
  for (const u of USERS) {
    const id = await ensureUser(u);
    console.log(`  ✅ ${u.role.padEnd(6)} ${u.email} / ${u.password}  (${id.slice(0, 8)}…)`);
  }
  console.log('\nDone. Use these on /login for client demo.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

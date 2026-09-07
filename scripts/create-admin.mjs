import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const i = trimmed.indexOf('=');
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const value = trimmed.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const EMAIL = 'adminops@gmail.com';
const PASSWORD = 'admin123';

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('Creating / updating admin user...');

  const { data: listed } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const existing = listed?.users?.find((u) => u.email?.toLowerCase() === EMAIL);

  let userId = existing?.id;

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'Admin', role: 'admin' },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log('Updated existing user:', EMAIL);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'Admin', role: 'admin' },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log('Created user:', EMAIL);
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: EMAIL,
    full_name: 'Admin',
    slug: 'admin',
    role: 'admin',
    is_active: true,
    credentials: 'Site Administrator',
    bio: 'ILM editorial workspace administrator.',
    avatar_url: 'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80',
    email_public: EMAIL,
  });

  if (profileError) {
    console.warn('Profile upsert failed (run supabase/schema.sql first):', profileError.message);
  } else {
    console.log('Profile set to admin role.');
  }

  console.log('\nTest login:');
  console.log('  Email:   ', EMAIL);
  console.log('  Password:', PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

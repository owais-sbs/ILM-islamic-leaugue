/**
 * Verify .env connects to the linked Supabase project.
 * Run: node scripts/test-connection.mjs
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
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n=== ILM Supabase connection (.env) ===\n');
console.log(`URL: ${url || '(missing)'}`);
console.log(`ANON: ${anon ? anon.slice(0, 20) + '…' : '(missing)'}`);
console.log(`SERVICE: ${service ? service.slice(0, 20) + '…' : '(missing)'}`);

if (!url || !anon || !service) {
  console.error('\nMissing env keys. Fill .env / .env.local first.');
  process.exit(1);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const anonClient = createClient(url, anon, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let ok = true;

try {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1 });
  if (error) throw error;
  console.log(`\n✅ Auth API OK (users visible: ${data.users?.length ?? 0}+)`);
} catch (e) {
  ok = false;
  console.error('\n❌ Auth API failed:', e.message || e);
}

try {
  const { error } = await anonClient.from('profiles').select('id').limit(1);
  if (error) {
    if (error.code === 'PGRST205' || /Could not find the table/.test(error.message)) {
      console.log('⚠️  profiles table missing — run supabase/reset-and-setup.sql in SQL Editor');
    } else {
      ok = false;
      console.error('❌ profiles query failed:', error.message);
    }
  } else {
    console.log('✅ profiles table reachable');
  }
} catch (e) {
  ok = false;
  console.error('❌ profiles query error:', e.message || e);
}

try {
  const { error } = await anonClient.from('categories').select('id').limit(1);
  if (error) {
    if (error.code === 'PGRST205' || /Could not find the table/.test(error.message)) {
      console.log('⚠️  categories table missing — apply schema SQL first');
    } else {
      console.log('⚠️  categories:', error.message);
    }
  } else {
    console.log('✅ categories table reachable');
  }
} catch (e) {
  console.log('⚠️  categories:', e.message || e);
}

console.log(ok ? '\nConnection to project from .env works.\n' : '\nConnection has errors — fix env / schema.\n');
process.exit(ok ? 0 : 1);

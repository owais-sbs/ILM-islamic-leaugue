/**
 * Smoke-test public APIs + optional publish sync against a running Next server.
 *
 * Usage:
 *   node scripts/smoke-flow.mjs
 *   BASE_URL=https://your-app.vercel.app node scripts/smoke-flow.mjs
 */
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });
config({ path: path.join(__dirname, '..', '.env') });

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function ok(label) {
  console.log(`✅ ${label}`);
}
function fail(label, detail) {
  console.error(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
  process.exitCode = 1;
}

async function getJson(pathname) {
  const res = await fetch(`${BASE}${pathname}`, { cache: 'no-store' });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  return { res, json, text };
}

async function main() {
  console.log(`\nILM smoke flow → ${BASE}\n`);

  // 1) Health
  try {
    const { res, json } = await getJson('/api/health');
    if (!res.ok || !json?.ok) fail('GET /api/health', json?.error || res.status);
    else {
      ok(`GET /api/health (supabase.public=${json.supabase?.public}, serviceRole=${json.supabase?.serviceRole})`);
      if (!json.supabase?.public) {
        console.warn('⚠️  Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY on the host, then redeploy.');
      }
    }
  } catch (e) {
    fail('GET /api/health', e instanceof Error ? e.message : String(e));
  }

  // 2) Published articles API
  try {
    const { res, json } = await getJson('/api/articles/published');
    if (res.status === 503) {
      console.warn('⚠️  GET /api/articles/published → 503 (Supabase not configured). Local demo store still works.');
    } else if (!res.ok) {
      fail('GET /api/articles/published', json?.error || res.status);
    } else {
      ok(`GET /api/articles/published (${json?.articles?.length ?? 0} articles)`);
    }
  } catch (e) {
    fail('GET /api/articles/published', e instanceof Error ? e.message : String(e));
  }

  // 3) Home HTML
  try {
    const res = await fetch(`${BASE}/`, { cache: 'no-store' });
    if (!res.ok) fail('GET /', String(res.status));
    else ok('GET / home');
  } catch (e) {
    fail('GET /', e instanceof Error ? e.message : String(e));
  }

  // 4) About + login pages
  for (const p of ['/about', '/login', '/articles', '/admin']) {
    try {
      const res = await fetch(`${BASE}${p}`, { cache: 'no-store', redirect: 'manual' });
      if (res.status >= 500) fail(`GET ${p}`, String(res.status));
      else ok(`GET ${p} (${res.status})`);
    } catch (e) {
      fail(`GET ${p}`, e instanceof Error ? e.message : String(e));
    }
  }

  // 5) Questions API (soft)
  try {
    const res = await fetch(`${BASE}/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Tester',
        email: 'smoke@ilm.test',
        subject: 'Smoke question',
        body: 'Is the questions API reachable?',
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 503) {
      console.warn('⚠️  POST /api/questions → 503 (expected without Supabase).');
    } else if (!res.ok || !json.ok) {
      fail('POST /api/questions', json.error || res.status);
    } else {
      ok(`POST /api/questions (id=${json.id})`);
    }
  } catch (e) {
    fail('POST /api/questions', e instanceof Error ? e.message : String(e));
  }

  console.log(process.exitCode ? '\nSmoke finished with failures.\n' : '\nSmoke finished OK.\n');
}

main();

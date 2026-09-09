/**
 * Strong ILM smoke — roles + API routes + URL helpers
 * Run: node scripts/smoke-full.mjs
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

const DEMO_ACCOUNTS = {
  admin: { email: 'adminops@gmail.com', password: 'admin123', label: 'Administrator' },
  author: { email: 'author.smoke@ilm.test', password: 'author123', label: 'Author / Murabbī' },
  editor: { email: 'editor.smoke@ilm.test', password: 'editor123', label: 'Editor' },
};

function parseRoleFromPath(pathname) {
  const match = pathname.match(/^\/admin\/as\/(author|editor|admin)(?=\/|$)/);
  return match ? match[1] : null;
}

function stripRolePrefix(pathname) {
  const match = pathname.match(/^\/admin\/as\/(author|editor|admin)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] ? `/admin${match[2]}` : '/admin';
}

function withRolePath(href, role) {
  const [rawPath, query = ''] = href.split('?');
  let path = rawPath || '/admin';
  if (!path.startsWith('/')) path = `/${path}`;
  if (!(path === '/admin' || path.startsWith('/admin/'))) {
    path = `/admin${path.startsWith('/') ? path : `/${path}`}`;
  }
  const logical = stripRolePrefix(path);
  const suffix = logical === '/admin' ? '' : logical.replace(/^\/admin/, '');
  const next = `/admin/as/${role}${suffix}`;
  return query ? `${next}?${query}` : next;
}

function roleHomePath(role) {
  return `/admin/as/${role}`;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = process.env.SMOKE_SITE_URL || 'http://localhost:3000';

if (!url || !anon || !serviceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const adminApi = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = {
  admin: DEMO_ACCOUNTS.admin,
  author: DEMO_ACCOUNTS.author,
  editor: DEMO_ACCOUNTS.editor,
};

let passed = 0;
let failed = 0;

function ok(label) {
  passed += 1;
  console.log(`  ✅ ${label}`);
}

function fail(label, detail) {
  failed += 1;
  console.log(`  ❌ ${label}`);
  if (detail) console.log(`     → ${detail}`);
}

async function ensureUser({ email, password, label }, role) {
  const name = label;
  const { data: listed } = await adminApi.auth.admin.listUsers({ perPage: 200 });
  const existing = listed?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  let userId = existing?.id;

  if (existing) {
    const { data, error } = await adminApi.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role },
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { data, error } = await adminApi.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role },
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const slug = email.split('@')[0].replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const { error: profileError } = await adminApi.from('profiles').upsert({
    id: userId,
    email,
    full_name: name,
    slug,
    role,
    is_active: true,
    email_public: email,
  });
  if (profileError) throw profileError;
  return userId;
}

async function clientAs(email, password) {
  const client = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Login failed for ${email}: ${error.message}`);
  return { client, user: data.user, session: data.session };
}

async function apiGet(path, accessToken) {
  const res = await fetch(`${SITE}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

async function apiJson(method, path, accessToken, body) {
  const res = await fetch(`${SITE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

async function main() {
  console.log('\n=== ILM strong smoke (roles + APIs + URL) ===\n');
  console.log(`Supabase: ${url}`);
  console.log(`Site:     ${SITE}\n`);

  // A) URL helpers (no server needed)
  console.log('A) Role URL helpers');
  {
    const cases = [
      ['/admin', 'author', '/admin/as/author'],
      ['/admin/articles', 'editor', '/admin/as/editor/articles'],
      ['/admin/articles?status=draft', 'admin', '/admin/as/admin/articles?status=draft'],
      ['/admin/as/admin/review', 'author', '/admin/as/author/review'],
    ];
    let allGood = true;
    for (const [href, role, expected] of cases) {
      const got = withRolePath(href, role);
      if (got !== expected) {
        allGood = false;
        fail(`withRolePath(${href}, ${role})`, `got ${got} expected ${expected}`);
      }
    }
    if (parseRoleFromPath('/admin/as/editor/articles') !== 'editor') {
      allGood = false;
      fail('parseRoleFromPath editor');
    }
    if (stripRolePrefix('/admin/as/author/media') !== '/admin/media') {
      allGood = false;
      fail('stripRolePrefix');
    }
    if (roleHomePath('admin') !== '/admin/as/admin') {
      allGood = false;
      fail('roleHomePath');
    }
    if (allGood) ok('role URL helpers');
  }

  // B) Ensure users + DB workflow (reuse core of smoke-roles)
  console.log('\nB) Ensure users + login roles');
  let author, editor, admin;
  try {
    await ensureUser(USERS.admin, 'admin');
    await ensureUser(USERS.author, 'author');
    await ensureUser(USERS.editor, 'editor');
    author = await clientAs(USERS.author.email, USERS.author.password);
    editor = await clientAs(USERS.editor.email, USERS.editor.password);
    admin = await clientAs(USERS.admin.email, USERS.admin.password);
    ok('Author/Editor/Admin login sessions');
  } catch (e) {
    fail('login setup', e.message);
    process.exit(1);
  }

  // C) Full article workflow
  console.log('\nC) Article workflow Author → Editor → Admin');
  const { data: cats } = await admin.client.from('categories').select('id').limit(1);
  const categoryId = cats?.[0]?.id || null;
  const slug = `smoke-full-${Date.now()}`;
  let articleId = null;

  {
    const { data, error } = await author.client
      .from('articles')
      .insert({
        title: 'Strong Smoke Article',
        slug,
        excerpt: 'API + role strong smoke',
        body_html: '<p>Strong smoke body</p>',
        author_id: author.user.id,
        category_id: categoryId,
        status: 'draft',
        reading_minutes: 3,
      })
      .select('id,status')
      .single();
    if (error) fail('create draft', error.message);
    else {
      articleId = data.id;
      ok(`draft ${articleId.slice(0, 8)}…`);
    }
  }

  if (articleId) {
    const { error: subErr } = await author.client
      .from('articles')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', articleId);
    if (subErr) fail('submit', subErr.message);
    else ok('submitted');

    const { data: pubTry, error: pubErr } = await author.client
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
      .select('status')
      .maybeSingle();
    if (pubErr || !pubTry || pubTry.status !== 'published') ok('author publish blocked');
    else fail('author publish not blocked');

    const { error: apprErr } = await editor.client
      .from('articles')
      .update({ status: 'approved', approved_by: editor.user.id })
      .eq('id', articleId);
    if (apprErr) fail('editor approve', apprErr.message);
    else ok('editor approved');

    const { data: edPub, error: edPubErr } = await editor.client
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
      .select('status')
      .maybeSingle();
    if (edPubErr || !edPub || edPub.status !== 'published') ok('editor publish blocked');
    else fail('editor publish not blocked');

    const { data: published, error: admErr } = await admin.client
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
      .select('status,published_at')
      .single();
    if (admErr || published.status !== 'published' || !published.published_at) {
      fail('admin publish', admErr?.message || JSON.stringify(published));
    } else ok('admin published');
  }

  // D) HTTP API routes (Bearer)
  console.log('\nD) Admin/Author API routes (Bearer auth)');
  const endpoints = [
    { role: 'admin', token: admin.session.access_token, path: '/api/admin/dashboard', expect: 200 },
    { role: 'admin', token: admin.session.access_token, path: '/api/admin/articles', expect: 200 },
    { role: 'admin', token: admin.session.access_token, path: '/api/admin/meta', expect: 200 },
    { role: 'admin', token: admin.session.access_token, path: '/api/admin/media', expect: 200 },
    { role: 'author', token: author.session.access_token, path: '/api/author/dashboard', expect: 200 },
    { role: 'author', token: author.session.access_token, path: '/api/admin/articles?scope=mine', expect: 200 },
    { role: 'editor', token: editor.session.access_token, path: '/api/admin/dashboard', expect: 200 },
    { role: 'editor', token: editor.session.access_token, path: '/api/admin/articles', expect: 200 },
    { role: 'anon', token: '', path: '/api/admin/dashboard', expect: 401 },
  ];

  for (const ep of endpoints) {
    try {
      const { status, json } = await apiGet(ep.path, ep.token);
      if (status === ep.expect) ok(`${ep.role} GET ${ep.path} → ${status}`);
      else fail(`${ep.role} GET ${ep.path}`, `status=${status} body=${JSON.stringify(json)?.slice(0, 180)}`);
    } catch (e) {
      fail(`${ep.role} GET ${ep.path}`, e.message);
    }
  }

  // E) API create article as author
  console.log('\nE) API POST article + revisions');
  {
    const { status, json } = await apiJson('POST', '/api/admin/articles', author.session.access_token, {
      title: `API Smoke ${Date.now()}`,
      slug: `api-smoke-${Date.now()}`,
      excerpt: 'Created via API',
      body_html: '<p>API body</p>',
      status: 'draft',
      reading_minutes: 2,
      category_id: categoryId,
    });
    if (status === 200 && json?.article?.id) {
      ok(`author POST /api/admin/articles → ${json.article.id.slice(0, 8)}…`);
      const rev = await apiGet(
        `/api/admin/articles/${json.article.id}/revisions`,
        author.session.access_token,
      );
      if (rev.status === 200) ok('GET revisions');
      else fail('GET revisions', `status=${rev.status}`);
    } else {
      fail('author POST article', `status=${status} ${JSON.stringify(json)?.slice(0, 200)}`);
    }
  }

  // F) Portal pages respond
  console.log('\nF) Role portal pages');
  for (const role of ['author', 'editor', 'admin']) {
    try {
      const res = await fetch(`${SITE}/admin/as/${role}`, { redirect: 'manual' });
      if (res.status === 200 || res.status === 307 || res.status === 302) {
        ok(`GET /admin/as/${role} → ${res.status}`);
      } else {
        fail(`GET /admin/as/${role}`, `status=${res.status}`);
      }
    } catch (e) {
      fail(`GET /admin/as/${role}`, e.message);
    }
  }

  console.log('\n=== RESULT ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('\nDemo logins:');
  console.log(`  Admin  ${USERS.admin.email} / ${USERS.admin.password}  → /admin/as/admin`);
  console.log(`  Editor ${USERS.editor.email} / ${USERS.editor.password} → /admin/as/editor`);
  console.log(`  Author ${USERS.author.email} / ${USERS.author.password} → /admin/as/author`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

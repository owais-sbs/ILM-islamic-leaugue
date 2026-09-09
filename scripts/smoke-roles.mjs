/**
 * ILM smoke test — Author → Editor → Admin publish + negative cases
 * Run: node scripts/smoke-roles.mjs
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !serviceKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const adminApi = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = {
  admin: { email: 'adminops@gmail.com', password: 'admin123', role: 'admin', name: 'Admin Director' },
  author: { email: 'author.smoke@ilm.test', password: 'author123', role: 'author', name: 'Smoke Author' },
  editor: { email: 'editor.smoke@ilm.test', password: 'editor123', role: 'editor', name: 'Smoke Editor' },
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

async function ensureUser({ email, password, role, name }) {
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
    credentials: role === 'admin' ? 'Administrator' : role === 'editor' ? 'Editor' : 'Murabbī',
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

async function main() {
  console.log('\n=== ILM smoke test ===\n');
  console.log(`Supabase: ${url}\n`);

  // 0) Ensure users
  console.log('0) Ensure Author / Editor / Admin users');
  let authorId, editorId, adminId;
  try {
    adminId = await ensureUser(USERS.admin);
    authorId = await ensureUser(USERS.author);
    editorId = await ensureUser(USERS.editor);
    ok(`users ready (admin=${adminId.slice(0, 8)}…)`);
  } catch (e) {
    fail('ensure users', e.message);
    process.exit(1);
  }

  // 1) Login + profile roles
  console.log('\n1) Login + profiles.role');
  let author, editor, admin;
  try {
    author = await clientAs(USERS.author.email, USERS.author.password);
    const { data: ap } = await author.client.from('profiles').select('role,is_active').eq('id', author.user.id).single();
    if (ap?.role === 'author' && ap.is_active) ok('Author login + role=author');
    else fail('Author role', JSON.stringify(ap));
  } catch (e) {
    fail('Author login', e.message);
  }

  try {
    editor = await clientAs(USERS.editor.email, USERS.editor.password);
    const { data: ep } = await editor.client.from('profiles').select('role').eq('id', editor.user.id).single();
    if (ep?.role === 'editor') ok('Editor login + role=editor');
    else fail('Editor role', JSON.stringify(ep));
  } catch (e) {
    fail('Editor login', e.message);
  }

  try {
    admin = await clientAs(USERS.admin.email, USERS.admin.password);
    const { data: adp } = await admin.client.from('profiles').select('role').eq('id', admin.user.id).single();
    if (adp?.role === 'admin') ok('Admin login + role=admin');
    else fail('Admin role', JSON.stringify(adp));
  } catch (e) {
    fail('Admin login', e.message);
  }

  if (!author || !editor || !admin) {
    console.log('\nCannot continue without all three logins.');
    process.exit(1);
  }

  // Pick a category
  const { data: cats } = await admin.client.from('categories').select('id,name').limit(1);
  const categoryId = cats?.[0]?.id || null;

  const slug = `smoke-article-${Date.now()}`;
  let articleId = null;

  // 2) Author creates draft
  console.log('\n2) Author creates draft');
  {
    const { data, error } = await author.client
      .from('articles')
      .insert({
        title: 'Smoke Test: The work of becoming',
        slug,
        excerpt: 'Automated smoke article for role workflow.',
        body_html: '<p>Smoke test body from Author.</p>',
        author_id: author.user.id,
        category_id: categoryId,
        status: 'draft',
        reading_minutes: 4,
      })
      .select('id,status,author_id')
      .single();
    if (error) fail('Author create draft', error.message);
    else {
      articleId = data.id;
      ok(`draft created (${data.id.slice(0, 8)}… status=${data.status})`);
    }
  }

  if (!articleId) {
    console.log('\nStopped — no article.');
    process.exit(1);
  }

  // 3) Author submits
  console.log('\n3) Author submits for review');
  {
    const { data, error } = await author.client
      .from('articles')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', articleId)
      .select('status')
      .single();
    if (error) fail('Author submit', error.message);
    else if (data.status === 'submitted') ok('status → submitted');
    else fail('Author submit status', data.status);
  }

  // 4) NEGATIVE: Author cannot publish
  console.log('\n4) NEGATIVE — Author cannot publish');
  {
    const { data, error } = await author.client
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
      .select('status')
      .maybeSingle();
    if (error || !data || data.status !== 'published') {
      ok(`blocked (error=${error?.message || 'no row / RLS'} status=${data?.status || 'n/a'})`);
      // ensure still submitted
      const { data: check } = await adminApi.from('articles').select('status').eq('id', articleId).single();
      if (check?.status === 'submitted') ok('article still submitted after author publish attempt');
      else fail('status after author publish attempt', check?.status);
    } else {
      fail('Author was able to publish — RLS/trigger broken');
    }
  }

  // 5) Editor approves
  console.log('\n5) Editor approves');
  {
    const { data, error } = await editor.client
      .from('articles')
      .update({ status: 'approved', approved_by: editor.user.id, review_notes: '' })
      .eq('id', articleId)
      .select('status')
      .single();
    if (error) fail('Editor approve', error.message);
    else if (data.status === 'approved') ok('status → approved');
    else fail('Editor approve status', data.status);
  }

  // 6) NEGATIVE: Editor cannot publish
  console.log('\n6) NEGATIVE — Editor cannot publish');
  {
    const { data, error } = await editor.client
      .from('articles')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', articleId)
      .select('status')
      .maybeSingle();
    if (error || !data || data.status !== 'published') {
      ok(`blocked (error=${error?.message || 'no row / RLS'} status=${data?.status || 'n/a'})`);
      const { data: check } = await adminApi.from('articles').select('status').eq('id', articleId).single();
      if (check?.status === 'approved') ok('article still approved after editor publish attempt');
      else fail('status after editor publish attempt', check?.status);
    } else {
      fail('Editor was able to publish — RLS/trigger broken');
    }
  }

  // 7) NEGATIVE: Editor cannot change roles
  console.log('\n7) NEGATIVE — Editor cannot change roles');
  {
    const { error } = await editor.client
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', author.user.id);
    const { data: check } = await adminApi.from('profiles').select('role').eq('id', author.user.id).single();
    if (check?.role === 'author') ok(`author role unchanged (update error=${error?.message || 'none'})`);
    else fail('Editor changed author role', check?.role);
  }

  // 8) Admin publishes
  console.log('\n8) Admin publishes');
  {
    const { data, error } = await admin.client
      .from('articles')
      .update({ status: 'published' })
      .eq('id', articleId)
      .select('status,published_at')
      .single();
    if (error) fail('Admin publish', error.message);
    else if (data.status === 'published' && data.published_at) ok(`status → published at ${data.published_at}`);
    else fail('Admin publish result', JSON.stringify(data));
  }

  // 9) Public anonymous can read published only
  console.log('\n9) Public (anon) can read published article');
  {
    const anonClient = createClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await anonClient
      .from('articles')
      .select('id,slug,status,title')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) fail('Anon read published', error.message);
    else if (data?.id === articleId) ok(`anon sees published: "${data.title}"`);
    else fail('Anon did not see published article', JSON.stringify(data));

    // Draft should not be visible as draft via public select of non-published
    const { data: drafts } = await anonClient.from('articles').select('id').eq('status', 'draft').limit(5);
    if (!drafts || drafts.length === 0) ok('anon cannot list drafts');
    else fail('anon listed drafts', `${drafts.length} rows`);
  }

  // 10) Editor return path (on a second article)
  console.log('\n10) Editor return-to-author loop');
  {
    const slug2 = `smoke-return-${Date.now()}`;
    const { data: a2, error: e1 } = await author.client
      .from('articles')
      .insert({
        title: 'Smoke Return Loop',
        slug: slug2,
        excerpt: 'Return test',
        body_html: '<p>Return</p>',
        author_id: author.user.id,
        category_id: categoryId,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (e1) fail('create submitted for return', e1.message);
    else {
      const { data: ret, error: e2 } = await editor.client
        .from('articles')
        .update({ status: 'returned', review_notes: 'Please expand the footnotes.' })
        .eq('id', a2.id)
        .select('status,review_notes')
        .single();
      if (e2) fail('Editor return', e2.message);
      else if (ret.status === 'returned' && ret.review_notes) ok('status → returned with notes');
      else fail('return result', JSON.stringify(ret));
    }
  }

  // Summary
  console.log('\n=== RESULT ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('\nLogin credentials used:');
  console.log(`  Admin  ${USERS.admin.email} / ${USERS.admin.password}`);
  console.log(`  Author ${USERS.author.email} / ${USERS.author.password}`);
  console.log(`  Editor ${USERS.editor.email} / ${USERS.editor.password}`);
  console.log(`\nPublished smoke article slug: ${slug}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

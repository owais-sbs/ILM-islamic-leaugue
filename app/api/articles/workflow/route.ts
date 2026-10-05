import { NextResponse } from 'next/server';
import { requireAdminWrite } from '@/lib/supabase/admin-bridge';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mapRemoteArticle } from '@/lib/map-article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUSES = new Set(['draft', 'submitted', 'approved', 'published', 'returned']);

type Body = {
  action?: 'submit' | 'approve' | 'return' | 'unpublish' | 'save';
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  footnotes?: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  image?: string;
  readingMinutes?: number;
  authorEmail?: string;
  reviewNotes?: string;
  status?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function resolveAuthorId(admin: NonNullable<ReturnType<typeof tryCreateServiceClient>>, email?: string) {
  if (email) {
    const { data } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();
    if (data?.id) return data.id as string;
  }
  const { data: anyAdmin } = await admin.from('profiles').select('id').eq('role', 'admin').limit(1).maybeSingle();
  return (anyAdmin?.id as string | undefined) || null;
}

async function resolveCategoryId(admin: NonNullable<ReturnType<typeof tryCreateServiceClient>>, category?: string) {
  if (!category) return null;
  const { data: byName } = await admin.from('categories').select('id').ilike('name', category).maybeSingle();
  if (byName?.id) return byName.id as string;
  const { data: bySlug } = await admin.from('categories').select('id').eq('slug', slugify(category)).maybeSingle();
  return (bySlug?.id as string | undefined) || null;
}

/** List non-published workflow articles for admin/editor queues. */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, articles: [], error: 'Supabase not configured' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, articles: [], error: 'Service role unavailable' }, { status: 503 });

  const { data, error } = await admin
    .from('articles')
    .select(
      `
      *,
      profiles:author_id ( full_name, slug, avatar_url, email ),
      categories:category_id ( name, slug )
    `,
    )
    .neq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ ok: false, articles: [], error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    articles: (data ?? []).map((row) => mapRemoteArticle(row as never, false)),
  });
}

export async function POST(req: Request) {
  const access = await requireAdminWrite({ allowEditor: true, allowDemoBridge: true });
  if (!access.ok) return access.response;
  const { admin } = access;

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const action = body.action || 'save';
  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ ok: false, error: 'title and slug are required' }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    submit: 'submitted',
    approve: 'approved',
    return: 'returned',
    unpublish: 'approved',
    save: body.status && STATUSES.has(body.status) ? body.status : 'draft',
  };
  const nextStatus = statusMap[action] || 'draft';

  // Editors cannot publish via this route; admins use /api/articles/publish
  if (nextStatus === 'published') {
    return NextResponse.json({ ok: false, error: 'Use the publish API for published status' }, { status: 400 });
  }

  const slug = slugify(body.slug || body.title);
  const authorId = await resolveAuthorId(admin, body.authorEmail);
  if (!authorId) return NextResponse.json({ ok: false, error: 'No author profile found' }, { status: 400 });
  const categoryId = await resolveCategoryId(admin, body.category);
  const reading = Math.max(1, Number(body.readingMinutes) || 5);
  const html = body.body || `<p>${body.excerpt || body.title}</p>`;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const { data: existing } = await admin.from('articles').select('id').eq('slug', slug).maybeSingle();

  const payload = {
    title: body.title.trim(),
    slug,
    excerpt: body.excerpt || '',
    body_html: html,
    body_text: text,
    footnotes: body.footnotes || '',
    author_id: authorId,
    category_id: categoryId,
    status: nextStatus,
    featured_image_url: body.image || null,
    seo_title: body.seoTitle || body.title,
    seo_description: body.seoDescription || body.excerpt || '',
    reading_minutes: reading,
    review_notes: action === 'return' ? body.reviewNotes || '' : action === 'approve' || action === 'submit' ? null : body.reviewNotes ?? null,
    submitted_at: action === 'submit' ? new Date().toISOString() : undefined,
    published_at: action === 'unpublish' ? null : undefined,
  };

  // Remove undefined keys so we don't wipe columns accidentally
  const clean = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));

  let rowId = existing?.id as string | undefined;
  if (!rowId) {
    const { data: inserted, error } = await admin.from('articles').insert(clean).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    rowId = inserted.id;
  } else {
    const { error } = await admin.from('articles').update(clean).eq('id', rowId);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: rowId, status: nextStatus, slug });
}

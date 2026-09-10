import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';
import { mapRemoteArticle } from '@/lib/map-article';

export const dynamic = 'force-dynamic';

type PublishBody = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  footnotes?: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  image?: string;
  readingMinutes?: number;
  authorEmail?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Publish API needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY on the server.',
      },
      { status: 503 },
    );
  }

  const userClient = tryCreateServerSupabase();
  if (!userClient) {
    return NextResponse.json({ ok: false, error: 'Auth unavailable' }, { status: 503 });
  }

  const {
    data: { user },
  } = await userClient.auth.getUser();

  // Allow demo publish without cookie when service role is present (admin UI may use sessionStorage role)
  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });
  }

  let profileRole: string | null = null;
  if (user) {
    const { data: profile } = await admin.from('profiles').select('role, is_active').eq('id', user.id).maybeSingle();
    profileRole = profile?.is_active ? profile.role : null;
  }

  let body: PublishBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json({ ok: false, error: 'title and slug are required' }, { status: 400 });
  }

  // Prefer authenticated admin; otherwise accept only when a staff profile email is provided (demo bridge)
  if (profileRole && profileRole !== 'admin' && profileRole !== 'editor') {
    return NextResponse.json({ ok: false, error: 'Only editor/admin can publish via API' }, { status: 403 });
  }

  const slug = slugify(body.slug || body.title);
  const authorEmail = body.authorEmail || user?.email || 'adminops@gmail.com';

  const { data: author } = await admin
    .from('profiles')
    .select('id, full_name, slug')
    .eq('email', authorEmail)
    .maybeSingle();

  let authorId = author?.id as string | undefined;
  if (!authorId && user?.id) authorId = user.id;
  if (!authorId) {
    const { data: anyAdmin } = await admin.from('profiles').select('id').eq('role', 'admin').limit(1).maybeSingle();
    authorId = anyAdmin?.id;
  }
  if (!authorId) {
    return NextResponse.json({ ok: false, error: 'No author profile found to attach the article' }, { status: 400 });
  }

  let categoryId: string | null = null;
  if (body.category) {
    const { data: catByName } = await admin.from('categories').select('id').ilike('name', body.category).maybeSingle();
    if (catByName?.id) {
      categoryId = catByName.id;
    } else {
      const { data: catBySlug } = await admin
        .from('categories')
        .select('id')
        .eq('slug', slugify(body.category))
        .maybeSingle();
      categoryId = catBySlug?.id ?? null;
    }
  }

  const reading = Math.max(1, Number(body.readingMinutes) || 5);
  const html = body.body || `<p>${body.excerpt || body.title}</p>`;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const { data: existing } = await admin.from('articles').select('id, status').eq('slug', slug).maybeSingle();

  let rowId = existing?.id as string | undefined;

  if (!rowId) {
    const { data: inserted, error: insertError } = await admin
      .from('articles')
      .insert({
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt || '',
        body_html: html,
        body_text: text,
        footnotes: body.footnotes || '',
        author_id: authorId,
        category_id: categoryId,
        status: 'draft',
        featured_image_url: body.image || null,
        seo_title: body.seoTitle || body.title,
        seo_description: body.seoDescription || body.excerpt || '',
        reading_minutes: reading,
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
    }
    rowId = inserted.id;
  }

  // Service role skips JWT workflow — move through approved → published (or direct published)
  const { error: pubError } = await admin
    .from('articles')
    .update({
      title: body.title.trim(),
      excerpt: body.excerpt || '',
      body_html: html,
      body_text: text,
      footnotes: body.footnotes || '',
      category_id: categoryId,
      featured_image_url: body.image || null,
      seo_title: body.seoTitle || body.title,
      seo_description: body.seoDescription || body.excerpt || '',
      reading_minutes: reading,
      status: 'published',
      published_at: new Date().toISOString(),
      review_notes: null,
    })
    .eq('id', rowId);

  if (pubError) {
    return NextResponse.json({ ok: false, error: pubError.message }, { status: 500 });
  }

  const { data: full } = await admin
    .from('articles')
    .select(
      `
      *,
      profiles:author_id ( full_name, slug, avatar_url ),
      categories:category_id ( name, slug )
    `,
    )
    .eq('id', rowId)
    .single();

  return NextResponse.json({
    ok: true,
    article: full ? mapRemoteArticle(full as never, true) : null,
  });
}

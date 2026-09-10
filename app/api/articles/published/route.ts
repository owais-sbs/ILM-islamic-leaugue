import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { mapRemoteArticle } from '@/lib/map-article';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        articles: [],
        error: 'Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel.',
      },
      { status: 503 },
    );
  }

  const admin = tryCreateServiceClient();
  const client = admin ?? tryCreateServerSupabase();
  if (!client) {
    return NextResponse.json({ ok: false, articles: [], error: 'Supabase client unavailable' }, { status: 503 });
  }

  const { data, error } = await client
    .from('articles')
    .select(
      `
      *,
      profiles:author_id ( full_name, slug, avatar_url ),
      categories:category_id ( name, slug )
    `,
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, articles: [], error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  const articles = rows.map((row, i) => mapRemoteArticle(row as never, i === 0));

  return NextResponse.json({ ok: true, articles });
}

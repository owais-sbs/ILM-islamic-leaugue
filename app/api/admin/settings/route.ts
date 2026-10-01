import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const KEY_MAP = {
  siteTitle: 'site_title',
  contactEmail: 'contact_email',
  disclaimerText: 'disclaimer_text',
  featuredArticleId: 'featured_article_id',
  announcementBanner: 'announcement_banner',
} as const;

function unwrap(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return value;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });

  const { data, error } = await admin.from('site_settings').select('key, value');
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const map = new Map((data ?? []).map((row) => [row.key, unwrap(row.value)]));
  return NextResponse.json({
    ok: true,
    settings: {
      siteTitle: String(map.get('site_title') ?? 'Islamic League of Murabbiyūn'),
      contactEmail: String(map.get('contact_email') ?? ''),
      disclaimerText: String(map.get('disclaimer_text') ?? map.get('disclaimer') ?? ''),
      featuredArticleId: map.get('featured_article_id') == null ? '' : String(map.get('featured_article_id')),
      announcementBanner: String(map.get('announcement_banner') ?? ''),
    },
  });
}

export async function PUT(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase admin not configured on Vercel' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });

  let body: Partial<Record<keyof typeof KEY_MAP, string>>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const rows = Object.entries(KEY_MAP)
    .filter(([field]) => body[field as keyof typeof KEY_MAP] !== undefined)
    .map(([field, key]) => {
      const raw = body[field as keyof typeof KEY_MAP] ?? '';
      // jsonb: store plain JSON values (string / null), matching seed format
      const value =
        key === 'featured_article_id'
          ? raw === '' || raw == null
            ? null
            : raw
          : raw;
      return { key, value };
    });

  if (!rows.length) return NextResponse.json({ ok: false, error: 'No settings provided' }, { status: 400 });

  const { error } = await admin.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_KEYS = new Set(['homepage', 'pages']);

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Public read — used by the live site on Vercel. */
export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured', documents: {} }, { status: 503 });
  }

  const admin = tryCreateServiceClient();
  const client = admin ?? tryCreateServerSupabase();
  if (!client) return NextResponse.json({ ok: false, error: 'Client unavailable', documents: {} }, { status: 503 });

  const key = new URL(req.url).searchParams.get('key');
  if (key) {
    if (!ALLOWED_KEYS.has(key)) return bad('Invalid key');
    const { data, error } = await client.from('cms_documents').select('key, payload, updated_at').eq('key', key).maybeSingle();
    if (error) {
      // Table may not exist yet — return empty so UI keeps defaults
      return NextResponse.json({ ok: false, error: error.message, payload: null }, { status: 200 });
    }
    return NextResponse.json({
      ok: true,
      key,
      payload: data?.payload ?? null,
      updatedAt: data?.updated_at ?? null,
    });
  }

  const { data, error } = await client.from('cms_documents').select('key, payload, updated_at');
  if (error) {
    return NextResponse.json({ ok: false, error: error.message, documents: {} }, { status: 200 });
  }

  const documents: Record<string, unknown> = {};
  for (const row of data ?? []) {
    documents[row.key] = row.payload;
  }
  return NextResponse.json({ ok: true, documents });
}

/** Staff write — Content Manager Save. Uses service role when available (Vercel admin demo bridge). */
export async function PUT(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return bad(
      'CMS write needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
      503,
    );
  }

  const admin = tryCreateServiceClient();
  if (!admin) return bad('Service role unavailable', 503);

  let body: { key?: string; payload?: unknown; updatedBy?: string };
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON');
  }

  const key = String(body.key || '').trim();
  if (!ALLOWED_KEYS.has(key)) return bad('key must be homepage or pages');
  if (body.payload == null || typeof body.payload !== 'object') return bad('payload object required');

  const { data, error } = await admin
    .from('cms_documents')
    .upsert(
      {
        key,
        payload: body.payload,
        updated_at: new Date().toISOString(),
        updated_by: body.updatedBy || 'admin',
      },
      { onConflict: 'key' },
    )
    .select('key, payload, updated_at')
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        hint: 'If the table is missing, run supabase/migrations/20260401000001_cms_live_documents.sql in the Supabase SQL Editor.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, key: data.key, payload: data.payload, updatedAt: data.updated_at });
}

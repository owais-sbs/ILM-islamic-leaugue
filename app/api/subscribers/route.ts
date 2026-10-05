import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapRow(row: Record<string, unknown>) {
  const created = row.created_at ? new Date(String(row.created_at)) : new Date();
  return {
    id: String(row.id),
    email: String(row.email || '').toLowerCase(),
    date: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    active: row.is_active !== false,
  };
}

function requireDb() {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) return null;
  return tryCreateServiceClient();
}

/** Admin + dashboard read — service role so entries always appear without cookie auth. */
export async function GET() {
  const db = requireDb();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        subscribers: [],
        error: 'Supabase service role is required for subscribers. Set SUPABASE_SERVICE_ROLE_KEY on Vercel.',
      },
      { status: 503 },
    );
  }

  const { data, error } = await db
    .from('subscribers')
    .select('id, email, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    return NextResponse.json({ ok: false, subscribers: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscribers: (data || []).map(mapRow) });
}

/** Public newsletter signup — always writes through service role (upsert needs update). */
export async function POST(req: Request) {
  let payload: { email?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || !email.includes('@') || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  const db = requireDb();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        localOnly: true,
        error: 'Newsletter storage is not configured on the server.',
      },
      { status: 503 },
    );
  }

  const { data, error } = await db
    .from('subscribers')
    .upsert({ email, is_active: true }, { onConflict: 'email' })
    .select('id, email, is_active, created_at')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscriber: mapRow(data as Record<string, unknown>) });
}

export async function PATCH(req: Request) {
  let payload: { email?: string; active?: boolean };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || typeof payload.active !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'email and active are required' }, { status: 400 });
  }

  const db = requireDb();
  if (!db) {
    return NextResponse.json({ ok: false, localOnly: true, error: 'Database unavailable' }, { status: 503 });
  }

  const { error } = await db.from('subscribers').update({ is_active: payload.active }).eq('email', email);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

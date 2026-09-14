import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

function mapRow(row: Record<string, unknown>) {
  const created = row.created_at ? new Date(String(row.created_at)) : new Date();
  return {
    id: String(row.id),
    email: String(row.email || '').toLowerCase(),
    date: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    active: row.is_active !== false,
  };
}

function client() {
  return tryCreateServiceClient() ?? tryCreateServerSupabase();
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, subscribers: [] });
  }
  const db = client();
  if (!db) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  const { data, error } = await db
    .from('subscribers')
    .select('id, email, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscribers: (data || []).map(mapRow) });
}

export async function POST(req: Request) {
  let payload: { email?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, id: `local-${Date.now()}`, email, localOnly: true });
  }

  const db = client();
  if (!db) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
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

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, localOnly: true });
  }

  const db = client();
  if (!db) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  const { error } = await db.from('subscribers').update({ is_active: payload.active }).eq('email', email);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

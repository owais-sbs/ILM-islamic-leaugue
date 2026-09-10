import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  body?: string;
  category?: string;
};

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Supabase is not configured on this deployment.' },
      { status: 503 },
    );
  }

  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (payload.name || 'Anonymous').trim().slice(0, 120);
  const email = (payload.email || 'visitor@ilm.local').trim().slice(0, 200);
  const subject = (payload.subject || 'Question from the site').trim().slice(0, 200);
  const body = (payload.body || '').trim().slice(0, 8000);
  const category = payload.category?.trim() || null;

  if (!body) {
    return NextResponse.json({ ok: false, error: 'Question body is required' }, { status: 400 });
  }

  const admin = tryCreateServiceClient();
  const client = admin ?? tryCreateServerSupabase();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  const { data, error } = await client
    .from('questions')
    .insert({
      name,
      email,
      subject,
      body,
      category,
      status: 'new',
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}

import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

export async function GET() {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function DELETE(request: Request) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';

export async function GET() {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase } = auth.ctx;
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('*').order('display_order'),
    supabase.from('tags').select('*').order('name'),
  ]);

  return NextResponse.json({
    categories: categories ?? [],
    tags: tags ?? [],
  });
}

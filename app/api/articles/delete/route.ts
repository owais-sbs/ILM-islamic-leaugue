import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { tryCreateServerSupabase } from '@/lib/supabase/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, localOnly: true, error: 'Supabase is not configured' }, { status: 503 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase service role is not configured' }, { status: 503 });
  }

  const slug = new URL(req.url).searchParams.get('slug')?.trim();
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'slug is required' }, { status: 400 });
  }

  const admin = tryCreateServiceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });
  }

  const userClient = tryCreateServerSupabase();
  if (userClient) {
    const {
      data: { user },
    } = await userClient.auth.getUser();

    if (user) {
      const { data: profile, error: profileError } = await admin
        .from('profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .maybeSingle();
      if (profileError) {
        return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 });
      }
      if (profile && (!profile.is_active || (profile.role !== 'admin' && profile.role !== 'editor'))) {
        return NextResponse.json({ ok: false, error: 'Only editor/admin can delete articles' }, { status: 403 });
      }
    }
  }

  const { error } = await admin.from('articles').delete().eq('slug', slug);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

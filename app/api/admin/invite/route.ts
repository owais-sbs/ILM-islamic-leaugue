import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/admin';
import { getSiteUrl } from '@/lib/site-url';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const role = body.role === 'editor' || body.role === 'admin' ? body.role : 'author';
    const fullName = String(body.full_name || '').trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can invite users' }, { status: 403 });
    }

    const admin = createServiceClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName || email.split('@')[0], role },
      redirectTo: `${getSiteUrl()}/login`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await admin.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName || email.split('@')[0],
        role,
        is_active: true,
        email_public: email,
      });

      await admin.from('activity_log').insert({
        actor_id: user.id,
        actor_name: 'Admin',
        action: 'invited contributor',
        entity_type: 'profile',
        entity_id: data.user.id,
        entity_label: email,
        metadata: { role },
      });
    }

    return NextResponse.json({ ok: true, userId: data.user?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invite failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

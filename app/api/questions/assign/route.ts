import { NextResponse } from 'next/server';
import { assignedToAuthorEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

type Body = {
  id?: string;
  assigneeName?: string;
  assigneeEmail?: string;
  asker?: string;
  subject?: string;
  question?: string;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const assigneeName = (payload.assigneeName || '').trim();
  const assigneeEmail = (payload.assigneeEmail || '').trim();
  const id = payload.id;

  if (!assigneeName || !assigneeEmail) {
    return NextResponse.json({ ok: false, error: 'Assignee name and email required' }, { status: 400 });
  }

  if (isSupabaseConfigured() && id && !id.startsWith('local-') && !id.startsWith('q')) {
    const admin = tryCreateServiceClient();
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'Database service role unavailable' }, { status: 503 });
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id, is_active')
      .eq('email', assigneeEmail)
      .maybeSingle();
    if (profileError) {
      return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 });
    }
    if (!profile || !profile.is_active) {
      return NextResponse.json({ ok: false, error: 'Selected staff profile is missing or inactive' }, { status: 404 });
    }

    const assigned = await admin
      .from('questions')
      .update({
        status: 'assigned',
        assigned_to: profile.id,
        assigned_to_name: assigneeName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (assigned.error?.message.includes('assigned_to_name')) {
      const fallback = await admin
        .from('questions')
        .update({ status: 'assigned', assigned_to: profile.id, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .maybeSingle();
      if (fallback.error) {
        return NextResponse.json({ ok: false, error: fallback.error.message }, { status: 500 });
      }
      if (!fallback.data) {
        return NextResponse.json({ ok: false, error: 'Question not found' }, { status: 404 });
      }
    } else if (assigned.error) {
      return NextResponse.json({ ok: false, error: assigned.error.message }, { status: 500 });
    } else if (!assigned.data) {
      return NextResponse.json({ ok: false, error: 'Question not found' }, { status: 404 });
    }
  }

  const mail = assignedToAuthorEmail({
    authorName: assigneeName,
    asker: payload.asker || 'A seeker',
    subject: payload.subject || 'Question from ILM',
    question: payload.question || '',
  });
  const sent = await sendMail({ to: assigneeEmail, ...mail });

  return NextResponse.json({ ok: true, emailSent: sent.ok });
}

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
    if (admin) {
      const { error } = await admin
        .from('questions')
        .update({
          status: 'assigned',
          assigned_to_name: assigneeName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error && !error.message.includes('assigned_to_name')) {
        const fallback = await admin
          .from('questions')
          .update({ status: 'assigned', updated_at: new Date().toISOString() })
          .eq('id', id);
        if (fallback.error) {
          return NextResponse.json({ ok: false, error: fallback.error.message }, { status: 500 });
        }
      }
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

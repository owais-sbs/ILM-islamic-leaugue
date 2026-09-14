import { NextResponse } from 'next/server';
import { answerToSeekerEmail } from '@/lib/email-templates';
import { sendMail } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

type Body = {
  id?: string;
  email?: string;
  name?: string;
  question?: string;
  answer?: string;
  assignee?: string;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const answer = (payload.answer || '').trim();
  const email = (payload.email || '').trim();
  const name = (payload.name || 'Friend').trim();
  const question = (payload.question || '').trim();
  const id = payload.id;

  if (!answer) {
    return NextResponse.json({ ok: false, error: 'Answer text is required' }, { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'Seeker email is required' }, { status: 400 });
  }

  if (isSupabaseConfigured() && id && !id.startsWith('local-') && !id.startsWith('q')) {
    const admin = tryCreateServiceClient();
    if (admin) {
      const { error } = await admin
        .from('questions')
        .update({
          status: 'answered',
          answer_notes: answer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
    }
  }

  const mail = answerToSeekerEmail({ name, question, answer });
  const sent = await sendMail({ to: email, ...mail });

  return NextResponse.json({ ok: true, emailSent: sent.ok });
}

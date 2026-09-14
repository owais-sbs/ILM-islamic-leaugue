import { NextResponse } from 'next/server';
import { authorAnswerReadyEmail } from '@/lib/email-templates';
import { sendMail, staffInboxEmails } from '@/lib/mail';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

type Body = {
  id?: string;
  authorName?: string;
  asker?: string;
  subject?: string;
  draft?: string;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const draft = (payload.draft || '').trim();
  const authorName = (payload.authorName || 'Author').trim();
  const id = payload.id;

  if (!draft) {
    return NextResponse.json({ ok: false, error: 'Draft answer is required' }, { status: 400 });
  }

  if (isSupabaseConfigured() && id && !id.startsWith('local-') && !id.startsWith('q')) {
    const admin = tryCreateServiceClient();
    if (admin) {
      const { error } = await admin
        .from('questions')
        .update({
          status: 'author_ready',
          author_draft: draft,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error && !error.message.includes('author_draft') && !error.message.includes('author_ready')) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
    }
  }

  const mail = authorAnswerReadyEmail({
    authorName,
    asker: payload.asker || 'Seeker',
    subject: payload.subject || 'Question',
    draft,
  });

  await Promise.allSettled(staffInboxEmails().map((to) => sendMail({ to, ...mail })));

  return NextResponse.json({ ok: true });
}

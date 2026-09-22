import { NextResponse } from 'next/server';
import { answerToSeekerEmail, staffNewSubmissionEmail, submissionReceivedEmail } from '@/lib/email-templates';
import { sendMail, staffInboxEmails } from '@/lib/mail';
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
  preferredAuthor?: string;
  source?: 'ask' | 'contact';
};

function inferSource(row: Record<string, unknown>): 'ask' | 'contact' {
  if (row.source === 'contact') return 'contact';
  const cat = String(row.category || '').toLowerCase();
  if (cat === 'contact') return 'contact';
  return 'ask';
}

function mapRow(row: Record<string, unknown>) {
  const created = row.created_at ? new Date(String(row.created_at)) : new Date();
  return {
    id: String(row.id),
    asker: String(row.name || 'Anonymous'),
    email: String(row.email || ''),
    subject: String(row.subject || ''),
    question: String(row.body || ''),
    category: row.category ? String(row.category) : undefined,
    preferredAuthor: row.preferred_author ? String(row.preferred_author) : undefined,
    source: inferSource(row),
    date: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdAt: created.getTime(),
    status: String(row.status || 'new') as 'new' | 'assigned' | 'author_ready' | 'answered',
    assignedTo: row.assigned_to_name ? String(row.assigned_to_name) : undefined,
    authorDraft: row.author_draft ? String(row.author_draft) : undefined,
    answerNotes: row.answer_notes ? String(row.answer_notes) : undefined,
  };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, questions: [] });
  }
  const admin = tryCreateServiceClient();
  const client = admin ?? tryCreateServerSupabase();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }

  let data: Record<string, unknown>[] | null = null;
  let error: { message: string } | null = null;

  const full = await client
    .from('questions')
    .select('id, name, email, subject, body, category, source, status, answer_notes, author_draft, assigned_to_name, preferred_author, created_at, assigned_to')
    .order('created_at', { ascending: false })
    .limit(200);
  data = full.data;
  error = full.error;

  if (
    error?.message?.includes('source') ||
    error?.message?.includes('author_draft') ||
    error?.message?.includes('assigned_to_name') ||
    error?.message?.includes('preferred_author')
  ) {
    const fallback = await client
      .from('questions')
      .select('id, name, email, subject, body, category, status, answer_notes, created_at, assigned_to')
      .order('created_at', { ascending: false })
      .limit(200);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, questions: (data || []).map(mapRow) });
}

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (payload.name || 'Anonymous').trim().slice(0, 120);
  const email = (payload.email || '').trim().slice(0, 200);
  const subject = (payload.subject || 'Message from the site').trim().slice(0, 200);
  const body = (payload.body || '').trim().slice(0, 8000);
  const category = payload.category?.trim() || null;
  const preferredAuthor = payload.preferredAuthor?.trim().slice(0, 160) || null;
  const source: 'ask' | 'contact' = payload.source === 'contact' ? 'contact' : 'ask';

  if (!body) {
    return NextResponse.json({ ok: false, error: 'Message body is required' }, { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  let id = `local-${Date.now()}`;

  if (isSupabaseConfigured()) {
    const admin = tryCreateServiceClient();
    const client = admin ?? tryCreateServerSupabase();
    if (client) {
      const baseRow = {
        name,
        email,
        subject,
        body,
        category: category || (source === 'contact' ? 'Contact' : category),
        status: 'new' as const,
      };
      let { data, error } = await client
        .from('questions')
        .insert({ ...baseRow, source, preferred_author: preferredAuthor })
        .select('id')
        .single();
      if (error?.message?.includes('preferred_author')) {
        ({ data, error } = await client.from('questions').insert({ ...baseRow, source }).select('id').single());
      }
      if (error?.message?.includes('source')) {
        ({ data, error } = await client.from('questions').insert(baseRow).select('id').single());
      }
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      if (data?.id) id = data.id;
    }
  }

  const staffMail = staffNewSubmissionEmail({
    source,
    name,
    email,
    subject,
    body,
    category,
    preferredAuthor,
  });
  const userMail = submissionReceivedEmail(source, name);

  await Promise.allSettled([
    sendMail({ to: email, ...userMail }),
    ...staffInboxEmails().map((to) => sendMail({ to, ...staffMail })),
  ]);

  return NextResponse.json({ ok: true, id, source });
}

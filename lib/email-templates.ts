const navy = '#0B1152';
const gold = '#C79A3D';

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f1ea;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1ea;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2d8;">
        <tr>
          <td style="background:${navy};padding:28px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${gold};">ILM</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:400;color:#ffffff;line-height:1.35;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;color:#1a2466;font-size:15px;line-height:1.7;">${body}</td>
        </tr>
        <tr>
          <td style="padding:0 32px 28px;color:#8a8f9f;font-size:12px;line-height:1.6;">
            Islamic League of Murabbiyūn · Thoughtful learning with adab
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function submissionReceivedEmail(source: 'ask' | 'contact', name: string) {
  const channel = source === 'contact' ? 'contact message' : 'question';
  return {
    subject: `We received your ${channel} — ILM`,
    html: shell(
      'Thank you — we received your message',
      `<p>Dear ${name || 'friend'},</p>
       <p>Your ${channel} has been sent to the ILM team successfully. An editor or murabbi will review it with care.</p>
       <p>Please allow a little time for a thoughtful reply. We appreciate your patience and trust.</p>
       <p style="margin-top:24px;color:${navy};">With warmth,<br/>The ILM team</p>`,
    ),
  };
}

export function staffNewSubmissionEmail(opts: {
  source: 'ask' | 'contact';
  name: string;
  email: string;
  subject: string;
  body: string;
  category?: string | null;
}) {
  const label = opts.source === 'contact' ? 'Contact form' : 'Ask a question';
  return {
    subject: `[ILM ${label}] ${opts.subject}`,
    html: shell(
      `New ${label.toLowerCase()}`,
      `<p><strong>From:</strong> ${opts.name} &lt;${opts.email}&gt;</p>
       <p><strong>Subject:</strong> ${opts.subject}</p>
       ${opts.category ? `<p><strong>Category:</strong> ${opts.category}</p>` : ''}
       <p><strong>Message:</strong></p>
       <p style="white-space:pre-wrap;background:#f8f6f2;padding:16px;border-radius:12px;">${opts.body}</p>
       <p>Open the admin portal → Questions to assign and reply.</p>`,
    ),
  };
}

export function assignedToAuthorEmail(opts: { authorName: string; asker: string; subject: string; question: string }) {
  return {
    subject: `[ILM] Question assigned to you`,
    html: shell(
      'A question needs your care',
      `<p>Dear ${opts.authorName},</p>
       <p>An administrator assigned you the following question from <strong>${opts.asker}</strong>.</p>
       <p><strong>Subject:</strong> ${opts.subject}</p>
       <p style="white-space:pre-wrap;background:#f8f6f2;padding:16px;border-radius:12px;">${opts.question}</p>
       <p>Please sign in to the ILM admin portal → <strong>Assigned to me</strong>, write your response, and submit it for review.</p>`,
    ),
  };
}

export function authorAnswerReadyEmail(opts: { authorName: string; asker: string; subject: string; draft: string }) {
  return {
    subject: `[ILM] Author response ready — ${opts.subject}`,
    html: shell(
      'Author submitted a draft answer',
      `<p><strong>${opts.authorName}</strong> submitted a draft response for review.</p>
       <p><strong>Seeker:</strong> ${opts.asker}</p>
       <p><strong>Subject:</strong> ${opts.subject}</p>
       <p style="white-space:pre-wrap;background:#f8f6f2;padding:16px;border-radius:12px;">${opts.draft}</p>
       <p>Open Questions in the admin portal to review and send the final reply to the seeker.</p>`,
    ),
  };
}

export function answerToSeekerEmail(opts: { name: string; question: string; answer: string }) {
  return {
    subject: 'Your ILM question — a response',
    html: shell(
      'A response to your question',
      `<p>Dear ${opts.name || 'friend'},</p>
       <p>A murabbi has reviewed your question and shared the following response:</p>
       <p style="white-space:pre-wrap;background:#f8f6f2;padding:16px;border-radius:12px;color:#333;">${opts.answer}</p>
       <p style="margin-top:16px;color:#666;font-size:13px;"><em>Your original question:</em><br/>${opts.question}</p>
       <p style="margin-top:24px;color:${navy};">With peace and clarity,<br/>The ILM team</p>`,
    ),
  };
}

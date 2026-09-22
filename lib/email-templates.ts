const navy = '#0B1152';
const gold = '#C79A3D';
const cream = '#FBFAF7';

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function logoUrl() {
  return `${siteUrl()}/ILM_Final_Logo_Design.webp`;
}

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${cream};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${cream};padding:36px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e8e2d8;box-shadow:0 12px 40px rgba(11,17,82,0.06);">
        <tr>
          <td style="background:${navy};padding:26px 32px;">
            <table role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                <td style="vertical-align:middle;padding-right:14px;">
                  <img src="${logoUrl()}" width="52" height="52" alt="ILM" style="display:block;border-radius:10px;background:#ffffff;object-fit:contain;"/>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:22px;letter-spacing:-0.04em;color:${gold};font-family:Georgia,serif;">ilm</p>
                  <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.78);font-family:Arial,Helvetica,sans-serif;line-height:1.35;">
                    Islamic League of Murabbiyūn
                  </p>
                </td>
              </tr>
            </table>
            <h1 style="margin:18px 0 0;font-size:24px;font-weight:400;color:#ffffff;line-height:1.35;font-family:Georgia,serif;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:30px 32px;color:#1a2466;font-size:15px;line-height:1.75;">${body}</td>
        </tr>
        <tr>
          <td style="padding:0 32px 28px;">
            <div style="border-top:1px solid #eee8df;padding-top:18px;color:#8a8f9f;font-size:12px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
              Islamic League of Murabbiyūn · Thoughtful learning with adab<br/>
              <a href="${siteUrl()}" style="color:${gold};text-decoration:none;">${siteUrl().replace(/^https?:\/\//, '')}</a>
            </div>
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
       <p style="margin-top:24px;color:${navy};">With warmth,<br/><strong>The ILM team</strong></p>`,
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
  preferredAuthor?: string | null;
}) {
  const label = opts.source === 'contact' ? 'Contact form' : 'Ask a question';
  return {
    subject: `[ILM ${label}] ${opts.subject}`,
    html: shell(
      `New ${label.toLowerCase()}`,
      `<p><strong>From:</strong> ${opts.name} &lt;${opts.email}&gt;</p>
       <p><strong>Subject:</strong> ${opts.subject}</p>
       ${opts.category ? `<p><strong>Category:</strong> ${opts.category}</p>` : ''}
       ${opts.preferredAuthor ? `<p><strong>Preferred Murabbī:</strong> ${opts.preferredAuthor}</p>` : ''}
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
       <p style="margin-top:24px;color:${navy};">With peace and clarity,<br/><strong>The ILM team</strong></p>`,
    ),
  };
}

export function staffInviteEmail(opts: {
  name: string;
  roleLabel: string;
  inviteUrl: string;
  expiresHours: number;
}) {
  return {
    subject: `You're invited to ILM as ${opts.roleLabel}`,
    html: shell(
      `Welcome to the ILM team`,
      `<p>Dear ${opts.name},</p>
       <p>You have been invited to join the Islamic League of Murabbiyūn as <strong>${opts.roleLabel}</strong>.</p>
       <p>Set your password to activate your account. This invite link expires in <strong>${opts.expiresHours} hours</strong>.</p>
       <p style="margin:28px 0;">
         <a href="${opts.inviteUrl}" style="display:inline-block;background:${navy};color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.04em;">
           Set your password
         </a>
       </p>
       <p style="font-size:13px;color:#666;">If the button does not work, copy and paste this link:<br/>
         <a href="${opts.inviteUrl}" style="color:${gold};word-break:break-all;">${opts.inviteUrl}</a>
       </p>
       <p style="margin-top:24px;color:${navy};">With warmth,<br/><strong>The ILM team</strong></p>`,
    ),
  };
}

export function staffInviteAdminNoticeEmail(opts: { name: string; email: string; roleLabel: string }) {
  return {
    subject: `[ILM] New ${opts.roleLabel} invited — ${opts.name}`,
    html: shell(
      'New staff invite sent',
      `<p>A new team member was invited:</p>
       <p><strong>Name:</strong> ${opts.name}<br/>
       <strong>Email:</strong> ${opts.email}<br/>
       <strong>Role:</strong> ${opts.roleLabel}</p>
       <p>They will set their own password via the invite link.</p>`,
    ),
  };
}

export function accountWelcomeEmail(opts: {
  appName: string;
  fullName: string;
  email: string;
  roleName: string;
  loginUrl: string;
  temporaryPassword: string;
}) {
  return {
    subject: `Welcome to ${opts.appName} – Your Account Has Been Created`,
    html: shell(
      `Welcome to ${opts.appName}`,
      `<p>Assalamu Alaikum ${opts.fullName},</p>
       <p>Your account has been successfully created.</p>
       <p><strong>Account Details:</strong></p>
       <p style="background:#f8f6f2;padding:16px;border-radius:12px;line-height:1.8;">
         <strong>Name:</strong> ${opts.fullName}<br/>
         <strong>Email:</strong> ${opts.email}<br/>
         <strong>Role:</strong> ${opts.roleName}<br/>
         <strong>Temporary Password:</strong> ${opts.temporaryPassword}
       </p>
       <p>Please use these credentials to log in and change your password after your first login.</p>
       <p style="margin:28px 0;">
         <a href="${opts.loginUrl}" style="display:inline-block;background:${navy};color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.04em;">
           LOGIN
         </a>
       </p>
       <p style="margin-top:24px;color:${navy};">Regards,<br/><strong>${opts.appName}</strong></p>`,
    ),
  };
}

import nodemailer from 'nodemailer';

function smtpPass() {
  return process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && smtpPass());
}

function transporter() {
  const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass(),
    },
  });
}

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  if (!smtpConfigured()) {
    console.warn('[mail] SMTP not configured — skipped:', opts.subject);
    return { ok: false as const, skipped: true };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  await transporter().sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html });
  return { ok: true as const };
}

export function staffInboxEmails(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAILS || process.env.SMTP_USER || '';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

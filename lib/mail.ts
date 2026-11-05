import nodemailer from 'nodemailer';
import { siteConfig } from '@/lib/site';

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

function emailDomain(address: string) {
  const at = address.lastIndexOf('@');
  return at >= 0 ? address.slice(at + 1).toLowerCase() : '';
}

function parseFrom(raw: string | undefined): { name?: string; address?: string } {
  if (!raw?.trim()) return {};
  const match = raw.trim().match(/^(?:"?([^"<]*)"?\s*)?<?([^<>@\s]+@[^<>@\s]+)>?$/);
  if (!match) return {};
  const name = match[1]?.trim();
  const address = match[2]?.trim();
  return { name: name || undefined, address: address || undefined };
}

/**
 * Gmail (and most providers) mark mail as spam when the visible From domain
 * does not match the authenticated SMTP mailbox / SPF-aligned domain.
 * Keep display name branded, but force the mailbox to SMTP_USER when domains diverge.
 */
function resolveFrom() {
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const parsed = parseFrom(process.env.SMTP_FROM);
  const preferredName =
    process.env.SMTP_FROM_NAME?.trim() ||
    parsed.name ||
    siteConfig.fullName ||
    'ILM';

  const requestedAddress = parsed.address || smtpUser;
  const aligned =
    smtpUser &&
    emailDomain(requestedAddress) &&
    emailDomain(requestedAddress) === emailDomain(smtpUser)
      ? requestedAddress
      : smtpUser;

  if (requestedAddress && aligned !== requestedAddress) {
    console.warn(
      `[mail] SMTP_FROM domain (${emailDomain(requestedAddress)}) does not match SMTP_USER (${emailDomain(smtpUser)}). Using ${aligned} to protect deliverability.`,
    );
  }

  return {
    name: preferredName,
    address: aligned,
  };
}

function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!smtpConfigured()) {
    console.warn('[mail] SMTP not configured — skipped:', opts.subject);
    return { ok: false as const, skipped: true };
  }

  const from = resolveFrom();
  const replyTo = process.env.SMTP_REPLY_TO?.trim() || from.address;
  const text = opts.text || htmlToText(opts.html);

  await transporter().sendMail({
    from: { name: from.name, address: from.address },
    replyTo,
    to: opts.to,
    subject: opts.subject,
    text,
    html: opts.html,
    headers: {
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Mailer': 'ILM Mailer',
    },
  });
  return { ok: true as const };
}

export function staffInboxEmails(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAILS || process.env.SMTP_USER || '';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

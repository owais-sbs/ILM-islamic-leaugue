import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'supabase');
const migDir = path.join(root, 'migrations');

const files = [
  ...fs.readdirSync(migDir).filter((f) => f.endsWith('.sql')).map((f) => path.join(migDir, f)),
  path.join(root, 'schema.sql'),
  path.join(root, 'reset-and-setup.sql'),
];

const badSeq = ['Ä«', 'Å«', 'â†’', 'â€”', 'â€“', 'â€™', 'â€œ', 'â€\u009d'];

function fixText(text) {
  return text
    .replaceAll('Ä«', 'ī')
    .replaceAll('Å«', 'ū')
    .replaceAll('â†’', '→')
    .replaceAll('â€”', '—')
    .replaceAll('â€“', '–')
    .replaceAll('â€™', "'")
    .replaceAll('â€œ', '"')
    .replaceAll('â€\u009d', '"')
    .replaceAll('â€¦', '…');
}

// Cursor prompt: "[REPLACE WITH YOUR ACTUAL ADMIN EMAIL]"
// This project's actual admin email (from .env / demo login) is:
const ADMIN_EMAIL = 'adminops@gmail.com';

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let buf = fs.readFileSync(file);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) buf = buf.subarray(3);
  let text = buf.toString('utf8');
  const before = text;
  text = fixText(text);
  text = text.replaceAll('adminops@gmail.com', ADMIN_EMAIL);
  fs.writeFileSync(file, Buffer.from(text, 'utf8'));
  const remaining = badSeq.filter((s) => text.includes(s));
  console.log(
    path.basename(file),
    before !== text ? 'FIXED' : 'ok',
    'remainingBad=' + remaining.length,
  );
}

const migFiles = fs
  .readdirSync(migDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .map((f) => path.join(migDir, f));

const header = [
  '-- =============================================================================',
  '-- ILM — FULL SCHEMA (Developer Spec) — run once in Supabase SQL Editor',
  '-- After this succeeds, run locally: npm run db:demo-users',
  '-- Demo logins:',
  `--   Admin  ${ADMIN_EMAIL} / admin123`,
  '--   Editor editor.smoke@ilm.test / editor123',
  '--   Author author.smoke@ilm.test / author123',
  '-- =============================================================================',
  '',
].join('\n');

let combined = header + '\n';
for (const f of migFiles) {
  combined += `\n-- >>> ${path.basename(f)}\n`;
  let t = fs.readFileSync(f);
  if (t[0] === 0xef && t[1] === 0xbb && t[2] === 0xbf) t = t.subarray(3);
  combined += t.toString('utf8').replace(/\s+$/, '') + '\n';
}

fs.writeFileSync(path.join(root, 'schema.sql'), Buffer.from(combined, 'utf8'));
fs.writeFileSync(path.join(root, 'reset-and-setup.sql'), Buffer.from(combined, 'utf8'));
console.log('\nRebuilt schema.sql + reset-and-setup.sql (UTF-8 no BOM)');

const trig = fs.readFileSync(path.join(migDir, '20260310000008_triggers_workflow.sql'), 'utf8');
const seed = fs.readFileSync(path.join(migDir, '20260310000011_seed_taxonomy_settings.sql'), 'utf8');
const prof = fs.readFileSync(path.join(migDir, '20260310000002_profiles.sql'), 'utf8');

const caseBlock = trig.match(/case\n[\s\S]*?end,/);
const updateBlock = seed.match(/-- Promote[\s\S]*?;\n/);
const siteBlock = seed.match(/\('site_title',[\s\S]*?::jsonb\)/);
const commentBlock = prof.match(/comment on table public\.profiles is '[^']*';/);

console.log('\n===== 1) handle_new_user() role case =====');
console.log(caseBlock?.[0] || '(not found)');
console.log('\n===== 2) seed update =====');
console.log(updateBlock?.[0] || '(not found)');
console.log('\n===== 3) site_title =====');
console.log(siteBlock?.[0] || '(not found)');
console.log('\n===== 4) profiles comment =====');
console.log(commentBlock?.[0] || '(not found)');

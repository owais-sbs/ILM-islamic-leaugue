/**
 * One-time data fix for the Murabbiyūn directory.
 *  - Links the existing login accounts to their built-in profiles (so editing them in
 *    Admin → Staff Profiles updates the public card instead of creating a duplicate).
 *  - Shows Khalid's account on the directory and sets the name to "Khalid Green".
 * Saves a backup of the current `staff_profiles` setting first.
 *
 * Run: node scripts/link-murabbiyun.mjs
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const backup = `staff_profiles.backup.${Date.now()}.json`;

const { data: cur, error } = await s.from('site_settings').select('value').eq('key', 'staff_profiles').maybeSingle();
if (error) throw error;
writeFileSync(backup, JSON.stringify(cur?.value ?? null, null, 2));

const entries = Array.isArray(cur?.value) ? cur.value : [];
const links = {
  'b39bc95d-aa3b-4e1f-8e75-17332a839e2d': 'abu-abbaad', // "Abu Abbaad"
  '589df52a-99fa-4a69-8e7c-bc880c7d22c8': 'aqil-ingram', // "Aqil Ingram"
  'b26d3bdb-3be4-42d9-921f-db6e4b4452af': 'hanif-fouse', // "hfouse"
  'f384a28f-a71a-448b-870d-03ff68e5bbbd': 'ilir-aliji', // "Illr213"
  '765868f6-da73-47cc-be7b-f1b6587f51b6': 'mujahid-keith', // "Ibnkeith"
  'c1b6e06e-58f2-44a1-9db8-1b35893bc79b': '', // "Khalid" → new card
};

for (const [id, directoryId] of Object.entries(links)) {
  const i = entries.findIndex((e) => e.id === id);
  const base = { id, staffTitle: '', bio: '', biography: [], focus: null, accent: 'bg-sky-100 text-sky-700', image: '' };
  const next = { ...(i >= 0 ? entries[i] : base), showInDirectory: true, directoryId };
  if (i >= 0) entries[i] = next;
  else entries.push(next);
}

const { error: saveError } = await s
  .from('site_settings')
  .upsert({ key: 'staff_profiles', value: entries }, { onConflict: 'key' });
if (saveError) throw saveError;

const { error: nameError } = await s
  .from('profiles')
  .update({ full_name: 'Khalid Green' })
  .eq('id', 'c1b6e06e-58f2-44a1-9db8-1b35893bc79b');
if (nameError) throw nameError;

console.log(`Updated ${entries.length} directory entries. Backup saved to ${backup}`);

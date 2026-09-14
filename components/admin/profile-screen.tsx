'use client';

import { useEffect, useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { Reveal } from './reveal';
import type { Role } from '@/lib/admin-data';
import { roleLabels } from '@/lib/admin-data';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';

export function ProfileScreen({ role = 'author' }: { role?: Role }) {
  const { profiles, updateProfile, articles } = useIlm();
  const profile = profiles[role];
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [madhhab, setMadhhab] = useState(profile.madhhab);
  const [credentials, setCredentials] = useState(profile.credentials);
  const [image, setImage] = useState(profile.image);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setBio(profile.bio);
    setMadhhab(profile.madhhab);
    setCredentials(profile.credentials);
    setImage(profile.image);
  }, [profile, role]);

  const publishedCount = articles.filter((a) => a.author === profile.name && a.status === 'published').length;
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'IL';

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!name.trim() || !email.trim()) {
      await adminSwal.error('Missing fields', 'Name and email are required.');
      return;
    }
    updateProfile(role, {
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      madhhab,
      credentials: credentials.trim(),
      image,
    });
    await adminSwal.success('Profile saved', 'Your details are updated across the portal.');
  };

  return (
    <Reveal>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6 text-center">
          <div className="relative mb-4 inline-block">
            {image ? (
              <img src={image} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" />
            ) : (
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-ilm-navy text-3xl font-serif text-ilm-gold-light">
                {initials}
              </div>
            )}
            <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-ilm-gold text-ilm-navy-deep transition-colors hover:bg-ilm-gold-light">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>
          <h3 className="text-lg font-semibold text-ilm-navy">{name}</h3>
          <p className="text-sm text-ilm-navy/40">
            {roleLabels[role]} · {madhhab}
          </p>
          <div className="mt-4 border-t border-ilm-navy/5 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-ilm-navy/50">Articles published</span>
              <span className="font-bold text-ilm-navy">{publishedCount}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ilm-navy/8 bg-white p-8">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-ilm-navy/40">Profile Details</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-ilm-navy/60">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-ilm-navy/60">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-ilm-navy/60">Madhhab</label>
                <select
                  value={madhhab}
                  onChange={(e) => setMadhhab(e.target.value)}
                  className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
                >
                  <option>Hanafi</option>
                  <option>Maliki</option>
                  <option>Shafi&apos;i</option>
                  <option>Hanbali</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-ilm-navy/60">Credentials</label>
                <input
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => void save()}
              className="flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-ilm-navy-soft"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

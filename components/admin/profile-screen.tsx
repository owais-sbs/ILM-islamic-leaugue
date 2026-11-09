'use client';

import { useEffect, useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { Reveal } from './reveal';
import { articleOwnedBy, type Role } from '@/lib/admin-data';
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
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setBio(profile.bio);
    setMadhhab(profile.madhhab);
    setCredentials(profile.credentials);
    setImage(profile.image);
  }, [profile, role]);

  const publishedCount = articles.filter(
    (a) => a.status === 'published' && articleOwnedBy(a, { ...profile, name, email, id: profile.id }),
  ).length;
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'IL';

  const fileToJpegDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const max = 1024;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not process image'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Could not process image'));
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not read that image. Try JPG or PNG.'));
      };
      img.src = objectUrl;
    });

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4.5 * 1024 * 1024) {
      void adminSwal.error('Image too large', 'Please choose an image under 4.5 MB.');
      return;
    }

    // Convert AVIF/HEIC (and large photos) to JPEG so Supabase Storage accepts them
    const needsConvert = /avif|heic|heif/i.test(file.type) || file.size > 1.5 * 1024 * 1024;
    void (async () => {
      try {
        if (needsConvert) {
          setImage(await fileToJpegDataUrl(file));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') setImage(reader.result);
        };
        reader.onerror = () => {
          void adminSwal.error('Could not read image', 'Try JPG or PNG instead.');
        };
        reader.readAsDataURL(file);
      } catch (err) {
        await adminSwal.error(
          'Image not supported',
          err instanceof Error ? err.message : 'Try JPG or PNG instead of AVIF.',
        );
      }
    })();
  };

  const save = async () => {
    if (!name.trim() || !email.trim()) {
      await adminSwal.error('Missing fields', 'Name and email are required.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          bio: bio.trim(),
          madhhab,
          credentials: credentials.trim(),
          avatarUrl: image || null,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        profile?: {
          id?: string;
          name?: string;
          email?: string;
          bio?: string;
          madhhab?: string;
          credentials?: string;
          image?: string;
        };
      };

      if (!res.ok || !json.ok || !json.profile) {
        await adminSwal.error('Could not save profile', json.error || 'Supabase update failed.');
        return;
      }

      updateProfile(role, {
        id: json.profile.id || profile.id,
        name: json.profile.name || name.trim(),
        email: json.profile.email || email.trim(),
        bio: json.profile.bio || '',
        madhhab: json.profile.madhhab || madhhab,
        credentials: json.profile.credentials || '',
        image: json.profile.image || undefined,
      });
      if (json.profile.image) setImage(json.profile.image);
      await adminSwal.success('Profile saved', 'Your details are stored in Supabase and will persist after reload.');
    } catch (err) {
      await adminSwal.error('Network error', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
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
              disabled={busy}
              onClick={() => void save()}
              className="flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-ilm-navy-soft disabled:opacity-60"
            >
              <Save size={14} /> {busy ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

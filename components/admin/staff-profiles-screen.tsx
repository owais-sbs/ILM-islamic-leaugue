'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown, ChevronUp, Eye, EyeOff,
  Globe, Pencil, Plus, Save, Trash2, Upload, X,
} from 'lucide-react';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';
import { safeScholarImage } from '@/lib/images';
import { roleLabels, type Contributor, type Role } from '@/lib/admin-data';
import { Reveal } from './reveal';
import { cn } from '@/lib/utils';

const ACCENT_OPTIONS = [
  { label: 'Sky',     value: 'bg-sky-100 text-sky-700' },
  { label: 'Emerald', value: 'bg-emerald-100 text-emerald-700' },
  { label: 'Gold',    value: 'bg-amber-100 text-amber-800' },
  { label: 'Indigo',  value: 'bg-indigo-100 text-indigo-700' },
  { label: 'Orange',  value: 'bg-orange-100 text-orange-700' },
  { label: 'Rose',    value: 'bg-rose-100 text-rose-700' },
];

const FOCUS_OPTIONS: Array<Contributor['focus']> = ['Studies', 'Fiqh', 'Spiritual', 'Arabic'];

type EditState = {
  staffTitle: string;
  bio: string;
  biography: string[];  // paragraphs
  focus: Contributor['focus'];
  accent: string;
  image: string;
  showInDirectory: boolean;
};

function defaultEdit(c: Contributor): EditState {
  return {
    staffTitle: c.staffTitle ?? '',
    bio: c.bio ?? '',
    biography: c.biography?.length ? c.biography : [c.bio ?? ''],
    focus: c.focus ?? undefined,
    accent: c.accent ?? ACCENT_OPTIONS[0].value,
    image: c.image ?? '',
    showInDirectory: c.showInDirectory ?? false,
  };
}

export function StaffProfilesScreen() {
  const { contributors, updateContributorProfile } = useIlm();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditState | null>(null);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [remoteAccounts, setRemoteAccounts] = useState<Contributor[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<Record<string, Partial<Contributor>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [accountsResponse, profilesResponse] = await Promise.all([
          fetch('/api/admin/accounts', { cache: 'no-store' }),
          fetch('/api/admin/staff-profiles', { cache: 'no-store' }),
        ]);
        const accounts = accountsResponse.ok
          ? (await accountsResponse.json()) as {
              ok?: boolean;
              contributors?: Array<{ id: string; name: string; email: string; role: Role; active: boolean }>;
            }
          : null;
        const profiles = profilesResponse.ok
          ? (await profilesResponse.json()) as { ok?: boolean; profiles?: Array<Partial<Contributor> & { id: string }> }
          : null;
        if (cancelled) return;

        if (accounts?.ok && Array.isArray(accounts.contributors)) {
          setRemoteAccounts(accounts.contributors.map((person) => ({
            ...person,
            initials: person.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
            madhhab: 'Hanafi',
            articles: 0,
            image: safeScholarImage(''),
          })));
        }
        if (profiles?.ok && Array.isArray(profiles.profiles)) {
          setSavedProfiles(Object.fromEntries(profiles.profiles.map((profile) => [profile.id, profile])));
        }
      } catch {
        /* locally saved profiles remain editable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const staffProfiles = useMemo(() => {
    const byId = new Map(contributors.map((person) => [person.id, person]));
    for (const remote of remoteAccounts) {
      const existing = Array.from(byId.values()).find(
        (person) => person.email && person.email.toLowerCase() === remote.email.toLowerCase(),
      );
      if (existing && existing.id !== remote.id) byId.delete(existing.id);
      byId.set(remote.id, { ...existing, ...remote, image: existing?.image || remote.image });
    }
    return Array.from(byId.values()).map((person) => ({
      ...person,
      ...savedProfiles[person.id],
      image: savedProfiles[person.id]?.image || person.image,
    }));
  }, [contributors, remoteAccounts, savedProfiles]);

  const openEdit = (c: Contributor) => {
    setEditing(c.id);
    setDraft(defaultEdit(c));
  };

  const closeEdit = () => { setEditing(null); setDraft(null); };

  const handleSave = async (c: Contributor) => {
    if (!draft || saving) return;
    setSaving(true);
    const patch = {
      staffTitle: draft.staffTitle,
      bio: draft.bio,
      biography: draft.biography.filter((paragraph) => paragraph.trim()),
      focus: draft.focus,
      accent: draft.accent,
      image: draft.image,
      showInDirectory: draft.showInDirectory,
    };
    const result = await updateContributorProfile(c.id, patch, c);
    setSaving(false);
    if (!result.ok) {
      await adminSwal.error('Could not save profile', result.error || 'Please try again.');
      return;
    }
    setSavedProfiles((prev) => ({ ...prev, [c.id]: patch }));
    closeEdit();
    await adminSwal.success(
      'Profile updated',
      result.localOnly ? `${c.name} was saved in this browser only. Sign in with an editor or administrator account and configure Supabase for live updates.` : `${c.name} was saved locally and to the live site.`,
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((d) => d ? { ...d, image: reader.result as string } : d);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateBioParagraph = (idx: number, value: string) => {
    if (!draft) return;
    const next = [...draft.biography];
    next[idx] = value;
    setDraft({ ...draft, biography: next });
  };

  const addBioParagraph = () => {
    if (!draft) return;
    setDraft({ ...draft, biography: [...draft.biography, ''] });
  };

  const removeBioParagraph = (idx: number) => {
    if (!draft) return;
    setDraft({ ...draft, biography: draft.biography.filter((_, i) => i !== idx) });
  };

  return (
    <Reveal>
      <div className="mb-5">
        <p className="text-sm text-ilm-navy/55">
          Manage the public-facing profiles of all staff members. Enabling <strong>Show in Directory</strong> makes a staff member visible in the Murabbiyūn section. Live updates require an authenticated editor or administrator session and Supabase service-role configuration; otherwise, changes are saved in this browser only.
        </p>
      </div>

      <div className="space-y-3">
        {staffProfiles.map((c) => {
          const isEditing = editing === c.id;
          const isExpanded = expandedBio === c.id;

          return (
            <div
              key={c.id}
              className="overflow-hidden rounded-2xl border border-ilm-navy/8 bg-white transition-shadow hover:shadow-sm"
            >
              {/* ── Row header ── */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={safeScholarImage(c.image)}
                    alt={c.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-ilm-cream"
                  />
                  {c.showInDirectory && (
                    <span
                      title="Visible in directory"
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white shadow"
                    >
                      <Globe size={9} />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ilm-navy">{c.name}</p>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      c.role === 'administrator' ? 'bg-ilm-gold text-ilm-navy-deep' :
                      c.role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                    )}>
                      {c.directoryOnly ? 'Directory profile' : roleLabels[c.role]}
                    </span>
                    {c.showInDirectory && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                        In directory
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ilm-navy/45">
                    {c.staffTitle || c.email}
                    {c.madhhab ? ` · ${c.madhhab}` : ''}
                  </p>
                  {c.bio && !isEditing && (
                    <p className="mt-1 line-clamp-1 text-xs text-ilm-navy/50">{c.bio}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {!isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedBio(isExpanded ? null : c.id)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-ilm-navy/10 text-ilm-navy/40 hover:border-ilm-navy/25 hover:text-ilm-navy"
                        title={isExpanded ? 'Collapse' : 'View profile'}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ilm-navy px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                    </>
                  )}
                  {isEditing && (
                    <button type="button" onClick={closeEdit} className="grid h-8 w-8 place-items-center rounded-full border border-ilm-navy/10 text-ilm-navy/40 hover:text-ilm-navy">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Collapsed bio preview ── */}
              {isExpanded && !isEditing && (
                <div className="border-t border-ilm-navy/6 bg-ilm-cream/30 px-5 py-4">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <img
                      src={safeScholarImage(c.image)}
                      alt=""
                      className="h-28 w-28 rounded-2xl object-cover sm:h-[120px] sm:w-[120px]"
                    />
                    <div>
                      {c.staffTitle && <p className="text-sm font-semibold text-ilm-gold-deep">{c.staffTitle}</p>}
                      <div className="mt-1 space-y-2">
                        {(c.biography?.length ? c.biography : c.bio ? [c.bio] : []).map((para, i) => (
                          <p key={i} className="text-sm leading-relaxed text-ilm-navy/65">{para}</p>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-ilm-navy/45">
                        {c.madhhab && <span>Madhhab: {c.madhhab}</span>}
                        {c.focus && <span>· Focus: {c.focus}</span>}
                        <span>· {c.articles} article{c.articles !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Edit form ── */}
              {isEditing && draft && (
                <div className="border-t border-ilm-navy/6 px-5 py-5">
                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Image upload */}
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Profile Image</p>
                      <div className="flex items-end gap-4">
                        <img
                          src={safeScholarImage(draft.image)}
                          alt=""
                          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-ilm-cream"
                        />
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={draft.image}
                            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                            placeholder="Paste image URL…"
                            className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-xs outline-none focus:border-ilm-gold sm:w-72"
                          />
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="inline-flex items-center gap-1.5 self-start rounded-full border border-ilm-navy/15 px-3 py-1.5 text-[11px] font-semibold text-ilm-navy hover:bg-ilm-cream"
                          >
                            <Upload size={12} /> Upload photo
                          </button>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">
                        Display title / role
                      </label>
                      <input
                        type="text"
                        value={draft.staffTitle}
                        onChange={(e) => setDraft({ ...draft, staffTitle: e.target.value })}
                        placeholder="e.g. Imām, Masjid al-Nur · Cambridge, MD"
                        className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none focus:border-ilm-gold"
                      />
                    </div>

                    {/* Focus */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Focus area</label>
                      <select
                        value={draft.focus ?? ''}
                        onChange={(e) => setDraft({ ...draft, focus: (e.target.value as Contributor['focus']) || undefined })}
                        className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3 py-2 text-sm outline-none"
                      >
                        <option value="">— none —</option>
                        {FOCUS_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    {/* Short bio */}
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">
                        Short bio <span className="font-normal text-ilm-navy/30">(card excerpt — 1–2 sentences)</span>
                      </label>
                      <textarea
                        value={draft.bio}
                        onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                        rows={4}
                        className="min-h-28 w-full resize-y rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-3 text-base leading-relaxed outline-none transition-colors focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                      />
                    </div>

                    {/* Full biography paragraphs */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">
                        Full biography <span className="font-normal text-ilm-navy/30">(shown on profile page)</span>
                      </label>
                      <div className="space-y-2">
                        {draft.biography.map((para, idx) => (
                          <div key={idx} className="flex gap-2">
                            <textarea
                              value={para}
                              onChange={(e) => updateBioParagraph(idx, e.target.value)}
                              rows={5}
                              placeholder={`Paragraph ${idx + 1}…`}
                              className="min-h-36 flex-1 resize-y rounded-xl border border-ilm-navy/10 bg-ilm-cream px-3.5 py-3 text-base leading-relaxed outline-none transition-colors focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/15"
                            />
                            <button
                              type="button"
                              onClick={() => removeBioParagraph(idx)}
                              className="mt-1 self-start text-ilm-navy/25 hover:text-red-500"
                              title="Remove paragraph"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addBioParagraph}
                          className="flex items-center gap-1.5 rounded-lg border border-dashed border-ilm-navy/15 px-3 py-2 text-xs font-semibold text-ilm-navy/40 hover:border-ilm-gold hover:text-ilm-navy"
                        >
                          <Plus size={12} /> Add paragraph
                        </button>
                      </div>
                    </div>

                    {/* Accent colour */}
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ilm-navy/40">Card accent colour</label>
                      <div className="flex flex-wrap gap-2">
                        {ACCENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDraft({ ...draft, accent: opt.value })}
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-semibold ring-2 transition',
                              opt.value,
                              draft.accent === opt.value ? 'ring-ilm-navy' : 'ring-transparent',
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Show in directory toggle */}
                    <div className="flex items-center gap-3 rounded-xl border border-ilm-navy/8 bg-ilm-cream/50 p-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ilm-navy">Show in Murabbiyūn Directory</p>
                        <p className="mt-0.5 text-xs text-ilm-navy/45">
                          Makes this person visible in the Murabbiyūn section on the public website.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, showInDirectory: !draft.showInDirectory })}
                        className={cn(
                          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                          draft.showInDirectory ? 'bg-green-500' : 'bg-gray-300',
                        )}
                        aria-pressed={draft.showInDirectory}
                        aria-label="Toggle directory visibility"
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                            draft.showInDirectory ? 'translate-x-5' : 'translate-x-0.5',
                          )}
                        />
                      </button>
                    </div>

                    {/* Save row */}
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 border-t border-ilm-navy/6 pt-4">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleSave(c)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ilm-navy px-5 py-2 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-60"
                      >
                        <Save size={13} /> {saving ? 'Saving…' : 'Save profile'}
                      </button>
                      <button
                        type="button"
                        onClick={closeEdit}
                        className="rounded-full border border-ilm-navy/15 px-5 py-2 text-xs font-bold uppercase tracking-wide text-ilm-navy"
                      >
                        Cancel
                      </button>
                      <span className="ml-auto flex items-center gap-1 text-[11px] text-ilm-navy/35">
                        {draft.showInDirectory
                          ? <><Globe size={11} className="text-green-500" /> Visible on website</>
                          : <><EyeOff size={11} /> Hidden from website</>
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {staffProfiles.length === 0 && (
          <div className="rounded-2xl border border-ilm-navy/8 bg-white py-16 text-center text-sm text-ilm-navy/35">
            No staff members yet. Add them in the Authors screen.
          </div>
        )}
      </div>
    </Reveal>
  );
}

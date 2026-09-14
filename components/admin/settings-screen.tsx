'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Reveal } from './reveal';
import { useIlm } from '@/lib/ilm-store';
import { adminSwal } from '@/lib/admin-swal';

export function SettingsScreen({ actorName = 'Administrator' }: { actorName?: string }) {
  const { siteSettings, updateSiteSettings, publishedArticles } = useIlm();
  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [disclaimerText, setDisclaimerText] = useState(siteSettings.disclaimerText);
  const [featuredArticleId, setFeaturedArticleId] = useState(siteSettings.featuredArticleId);
  const [announcementBanner, setAnnouncementBanner] = useState(siteSettings.announcementBanner);

  useEffect(() => {
    setSiteTitle(siteSettings.siteTitle);
    setContactEmail(siteSettings.contactEmail);
    setDisclaimerText(siteSettings.disclaimerText);
    setFeaturedArticleId(siteSettings.featuredArticleId);
    setAnnouncementBanner(siteSettings.announcementBanner);
  }, [siteSettings]);

  const save = async () => {
    updateSiteSettings(
      {
        siteTitle: siteTitle.trim() || siteSettings.siteTitle,
        contactEmail: contactEmail.trim(),
        disclaimerText: disclaimerText.trim(),
        featuredArticleId,
        announcementBanner: announcementBanner.trim(),
      },
      actorName,
    );
    await adminSwal.success('Settings saved', 'Site settings are live for this workspace.');
  };

  return (
    <Reveal>
      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ilm-navy/40">Site Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Site Title</label>
              <input
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Contact Email</label>
              <input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ilm-navy/60">Disclaimer Text</label>
              <textarea
                value={disclaimerText}
                onChange={(e) => setDisclaimerText(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ilm-navy/40">Featured Content</h3>
          <div>
            <label className="mb-1.5 block text-sm text-ilm-navy/60">Featured Article</label>
            <select
              value={featuredArticleId}
              onChange={(e) => setFeaturedArticleId(e.target.value)}
              className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
            >
              <option value="">None</option>
              {publishedArticles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-ilm-navy/8 bg-white p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ilm-navy/40">Announcement Banner</h3>
          <div>
            <label className="mb-1.5 block text-sm text-ilm-navy/60">Banner Text</label>
            <input
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              placeholder="Announcement message…"
              className="w-full rounded-lg border border-ilm-navy/10 bg-ilm-cream px-3.5 py-2.5 text-sm text-ilm-navy outline-none transition-colors focus:border-ilm-gold"
            />
            <p className="mt-2 text-xs text-ilm-navy/40">Shown on the public site header when set.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void save()}
          className="flex items-center gap-2 rounded-full bg-ilm-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-ilm-navy-soft"
        >
          <Save size={14} /> Save All Settings
        </button>
      </div>
    </Reveal>
  );
}

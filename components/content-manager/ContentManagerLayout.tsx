'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  getHomepageContent,
  updateSection,
  resetSection,
  loadHomepageLive,
  loadPagesLive,
  saveHomepageLive,
  savePagesLive,
  type CMHomepageContent,
} from '@/lib/content-manager/repository';
import { readCMPages, updateCMPage, resetCMPage } from '@/lib/content-manager/page-storage';
import type { CMPagesContent } from '@/lib/content-manager/types';
import { adminSwal } from '@/lib/admin-swal';
import { type CMActiveSection, ContentManagerSidebar } from './ContentManagerSidebar';
import { HeaderEditor } from './editors/HeaderEditor';
import { HeroEditor } from './editors/HeroEditor';
import { AboutEditor } from './editors/AboutEditor';
import { FeaturedArticlesEditor } from './editors/FeaturedArticlesEditor';
import { DirectoryEditor } from './editors/DirectoryEditor';
import { LearningJourneyEditor } from './editors/LearningJourneyEditor';
import { QuoteEditor } from './editors/QuoteEditor';
import { NewsletterEditor } from './editors/NewsletterEditor';
import { FooterEditor } from './editors/FooterEditor';
import { AboutPageEditor } from './editors/AboutPageEditor';
import { MissionVisionEditor } from './editors/MissionVisionEditor';

const sectionTitles: Record<CMActiveSection, string> = {
  header: 'Header',
  hero: 'Hero',
  about: 'About Us (Homepage section)',
  'featured-articles': 'Featured Articles',
  directory: 'Directory (Murabbiyūn & Categories)',
  'learning-journey': 'Learning Journey',
  quote: 'Quote',
  newsletter: 'Newsletter',
  footer: 'Footer',
  'about-page': 'About Us Page',
  'mission-vision-page': 'Mission & Vision Page',
};

export function ContentManagerLayout() {
  const [active, setActive] = useState<CMActiveSection>('hero');
  const [content, setContent] = useState<CMHomepageContent | null>(null);
  const [pages, setPages] = useState<CMPagesContent | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'loading' | 'live' | 'local'>('loading');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setContent(getHomepageContent());
      setPages(readCMPages());
      const [home, pageData] = await Promise.all([loadHomepageLive(), loadPagesLive()]);
      if (cancelled) return;
      setContent(home);
      setPages(pageData);
      // Probe whether writes can reach Supabase
      try {
        const res = await fetch('/api/cms?key=homepage', { cache: 'no-store' });
        const json = (await res.json()) as { ok?: boolean };
        setLiveStatus(json.ok ? 'live' : 'local');
      } catch {
        setLiveStatus('local');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async <K extends keyof CMHomepageContent>(
    section: K,
    value: CMHomepageContent[K],
  ) => {
    const updated = updateSection(section, value);
    setContent({ ...updated });
    setSyncing(true);
    const result = await saveHomepageLive(updated);
    setSyncing(false);
    if (result.ok) {
      setLiveStatus('live');
      await adminSwal.success('Saved live', `${String(section)} is live on the public site.`);
    } else {
      setLiveStatus('local');
      await adminSwal.error(
        'Saved locally only',
        result.error ||
          'Could not sync to Supabase. Run the cms_documents SQL migration and check Vercel env vars.',
      );
    }
  };

  const handleReset = async (section: keyof CMHomepageContent) => {
    const updated = resetSection(section);
    setContent({ ...updated });
    setSyncing(true);
    const result = await saveHomepageLive(updated);
    setSyncing(false);
    if (result.ok) {
      setLiveStatus('live');
      await adminSwal.success('Reset live', `${String(section)} restored and published.`);
    } else {
      await adminSwal.error('Reset locally only', result.error || 'Live sync failed.');
    }
  };

  const handleSavePage = async <K extends keyof CMPagesContent>(
    section: K,
    value: CMPagesContent[K],
  ) => {
    const updated = updateCMPage(section, value);
    setPages({ ...updated });
    setSyncing(true);
    const result = await savePagesLive(updated);
    setSyncing(false);
    if (result.ok) {
      setLiveStatus('live');
      await adminSwal.success('Saved live', `${String(section)} is live on the public site.`);
    } else {
      setLiveStatus('local');
      await adminSwal.error('Saved locally only', result.error || 'Live sync failed.');
    }
  };

  const handleResetPage = async (section: keyof CMPagesContent) => {
    const updated = resetCMPage(section);
    setPages({ ...updated });
    setSyncing(true);
    const result = await savePagesLive(updated);
    setSyncing(false);
    if (result.ok) {
      setLiveStatus('live');
      await adminSwal.success('Reset live', `${String(section)} restored and published.`);
    } else {
      await adminSwal.error('Reset locally only', result.error || 'Live sync failed.');
    }
  };

  if (!content || !pages) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ilm-navy/40">
        Loading Content Manager…
      </div>
    );
  }

  const renderEditor = () => {
    switch (active) {
      case 'header':
        return (
          <HeaderEditor data={content.header} onSave={(v) => void handleSave('header', v)} onReset={() => void handleReset('header')} />
        );
      case 'hero':
        return <HeroEditor data={content.hero} onSave={(v) => void handleSave('hero', v)} onReset={() => void handleReset('hero')} />;
      case 'about':
        return <AboutEditor data={content.about} onSave={(v) => void handleSave('about', v)} onReset={() => void handleReset('about')} />;
      case 'featured-articles':
        return (
          <FeaturedArticlesEditor
            data={content.featuredArticles}
            onSave={(v) => void handleSave('featuredArticles', v)}
            onReset={() => void handleReset('featuredArticles')}
          />
        );
      case 'directory':
        return (
          <DirectoryEditor
            data={content.directory}
            onSave={(v) => void handleSave('directory', v)}
            onReset={() => void handleReset('directory')}
          />
        );
      case 'learning-journey':
        return (
          <LearningJourneyEditor
            data={content.learningJourney}
            onSave={(v) => void handleSave('learningJourney', v)}
            onReset={() => void handleReset('learningJourney')}
          />
        );
      case 'quote':
        return <QuoteEditor data={content.quote} onSave={(v) => void handleSave('quote', v)} onReset={() => void handleReset('quote')} />;
      case 'newsletter':
        return (
          <NewsletterEditor
            data={content.newsletter}
            onSave={(v) => void handleSave('newsletter', v)}
            onReset={() => void handleReset('newsletter')}
          />
        );
      case 'footer':
        return <FooterEditor data={content.footer} onSave={(v) => void handleSave('footer', v)} onReset={() => void handleReset('footer')} />;
      case 'about-page':
        return (
          <AboutPageEditor
            data={pages.aboutPage}
            onSave={(v) => void handleSavePage('aboutPage', v)}
            onReset={() => void handleResetPage('aboutPage')}
          />
        );
      case 'mission-vision-page':
        return (
          <MissionVisionEditor
            data={pages.missionVisionPage}
            onSave={(v) => void handleSavePage('missionVisionPage', v)}
            onReset={() => void handleResetPage('missionVisionPage')}
          />
        );
      default:
        return null;
    }
  };

  const statusLabel =
    liveStatus === 'loading'
      ? 'Connecting…'
      : liveStatus === 'live'
        ? syncing
          ? 'Saving to live…'
          : 'Live on Vercel / Supabase'
        : 'Local cache only — run SQL migration';

  return (
    <div className="-mx-3 -mt-5 sm:-mx-6 sm:-mt-8">
      <div className="flex items-center justify-between border-b border-ilm-navy/8 bg-ilm-cream/60 px-4 py-2 sm:px-6">
        <p className="text-[11px] text-ilm-navy/45">
          <span
            className={`mr-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              liveStatus === 'live'
                ? 'bg-emerald-100 text-emerald-800'
                : liveStatus === 'loading'
                  ? 'bg-ilm-navy/10 text-ilm-navy/50'
                  : 'bg-amber-100 text-amber-700'
            }`}
          >
            {liveStatus === 'live' ? 'Live' : liveStatus === 'loading' ? '…' : 'Local'}
          </span>
          {statusLabel}
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ilm-navy/50 transition hover:text-ilm-navy"
        >
          <ExternalLink size={11} /> Preview site
        </a>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 130px)' }}>
        <ContentManagerSidebar active={active} onChange={setActive} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <div className="shrink-0 border-b border-ilm-navy/8 px-5 py-2.5 sm:px-6">
            <h2 className="text-sm font-semibold text-ilm-navy">{sectionTitles[active]}</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">{renderEditor()}</div>
        </div>
      </div>
    </div>
  );
}

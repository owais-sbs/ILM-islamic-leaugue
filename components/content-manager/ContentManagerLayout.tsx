'use client';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  getHomepageContent, updateSection, resetSection,
  type CMHomepageContent,
} from '@/lib/content-manager/repository';
import { readCMPages, updateCMPage, resetCMPage } from '@/lib/content-manager/page-storage';
import type { CMPagesContent } from '@/lib/content-manager/types';
import { type CMActiveSection, ContentManagerSidebar } from './ContentManagerSidebar';
import { HeaderEditor }           from './editors/HeaderEditor';
import { HeroEditor }             from './editors/HeroEditor';
import { AboutEditor }            from './editors/AboutEditor';
import { FeaturedArticlesEditor } from './editors/FeaturedArticlesEditor';
import { DirectoryEditor }        from './editors/DirectoryEditor';
import { LearningJourneyEditor }  from './editors/LearningJourneyEditor';
import { QuoteEditor }            from './editors/QuoteEditor';
import { NewsletterEditor }       from './editors/NewsletterEditor';
import { FooterEditor }           from './editors/FooterEditor';
import { AboutPageEditor }        from './editors/AboutPageEditor';
import { MissionVisionEditor }    from './editors/MissionVisionEditor';

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

  useEffect(() => {
    setContent(getHomepageContent());
    setPages(readCMPages());
  }, []);

  const handleSave = <K extends keyof CMHomepageContent>(
    section: K,
    value: CMHomepageContent[K],
  ) => {
    const updated = updateSection(section, value);
    setContent({ ...updated });
  };

  const handleReset = (section: keyof CMHomepageContent) => {
    const updated = resetSection(section);
    setContent({ ...updated });
  };

  const handleSavePage = <K extends keyof CMPagesContent>(
    section: K,
    value: CMPagesContent[K],
  ) => {
    const updated = updateCMPage(section, value);
    setPages({ ...updated });
  };

  const handleResetPage = (section: keyof CMPagesContent) => {
    const updated = resetCMPage(section);
    setPages({ ...updated });
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
        return <HeaderEditor data={content.header} onSave={(v) => handleSave('header', v)} onReset={() => handleReset('header')} />;
      case 'hero':
        return <HeroEditor data={content.hero} onSave={(v) => handleSave('hero', v)} onReset={() => handleReset('hero')} />;
      case 'about':
        return <AboutEditor data={content.about} onSave={(v) => handleSave('about', v)} onReset={() => handleReset('about')} />;
      case 'featured-articles':
        return <FeaturedArticlesEditor data={content.featuredArticles} onSave={(v) => handleSave('featuredArticles', v)} onReset={() => handleReset('featuredArticles')} />;
      case 'directory':
        return (
          <DirectoryEditor
            data={content.directory}
            onSave={(v) => handleSave('directory', v)}
            onReset={() => handleReset('directory')}
          />
        );
      case 'learning-journey':
        return <LearningJourneyEditor data={content.learningJourney} onSave={(v) => handleSave('learningJourney', v)} onReset={() => handleReset('learningJourney')} />;
      case 'quote':
        return <QuoteEditor data={content.quote} onSave={(v) => handleSave('quote', v)} onReset={() => handleReset('quote')} />;
      case 'newsletter':
        return <NewsletterEditor data={content.newsletter} onSave={(v) => handleSave('newsletter', v)} onReset={() => handleReset('newsletter')} />;
      case 'footer':
        return <FooterEditor data={content.footer} onSave={(v) => handleSave('footer', v)} onReset={() => handleReset('footer')} />;
      case 'about-page':
        return <AboutPageEditor data={pages.aboutPage} onSave={(v) => handleSavePage('aboutPage', v)} onReset={() => handleResetPage('aboutPage')} />;
      case 'mission-vision-page':
        return <MissionVisionEditor data={pages.missionVisionPage} onSave={(v) => handleSavePage('missionVisionPage', v)} onReset={() => handleResetPage('missionVisionPage')} />;
      default:
        return null;
    }
  };

  return (
    /* Sits inside AdminShell main — use negative margin to break out of the default padding */
    <div className="-mx-3 -mt-5 sm:-mx-6 sm:-mt-8">
      {/* Phase notice banner */}
      <div className="flex items-center justify-between border-b border-ilm-navy/8 bg-ilm-cream/60 px-4 py-2 sm:px-6">
        <p className="text-[11px] text-ilm-navy/45">
          <span className="mr-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">Phase 1</span>
          Changes are saved to local storage only. Supabase sync coming in Phase 2.
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

      {/* Two-panel layout */}
      <div className="flex" style={{ height: 'calc(100vh - 130px)' }}>
        {/* Left sidebar */}
        <ContentManagerSidebar active={active} onChange={setActive} />

        {/* Right editor */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
          {/* Section title bar */}
          <div className="shrink-0 border-b border-ilm-navy/8 px-5 py-2.5 sm:px-6">
            <h2 className="text-sm font-semibold text-ilm-navy">{sectionTitles[active]}</h2>
          </div>

          {/* Scrollable editor area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}

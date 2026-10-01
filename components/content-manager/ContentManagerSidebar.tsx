'use client';

import { cn } from '@/lib/utils';
import {
  Layout, Globe, Layers, Star, Users,
  GraduationCap, Quote, Mail, AlignJustify,
  BookOpen, Info, Target,
} from 'lucide-react';

export type CMActiveSection =
  | 'header' | 'hero' | 'about' | 'featured-articles'
  | 'learning-journey' | 'quote' | 'newsletter' | 'footer'
  | 'directory'
  | 'about-page' | 'mission-vision-page';

interface SidebarItem {
  key: CMActiveSection;
  label: string;
  icon: React.ReactNode;
  indent?: boolean;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

const groups: SidebarGroup[] = [
  {
    label: 'Homepage',
    items: [
      { key: 'header',            label: 'Header',            icon: <Layout size={13} /> },
      { key: 'hero',              label: 'Hero',              icon: <Globe size={13} /> },
      { key: 'about',             label: 'About Us',          icon: <Layers size={13} /> },
      { key: 'featured-articles', label: 'Featured Articles', icon: <Star size={13} /> },
      { key: 'directory',         label: 'Directory',         icon: <BookOpen size={13} /> },
      { key: 'learning-journey',  label: 'Learning Journey',  icon: <GraduationCap size={13} /> },
      { key: 'quote',             label: 'Quote',             icon: <Quote size={13} /> },
      { key: 'newsletter',        label: 'Newsletter',        icon: <Mail size={13} /> },
      { key: 'footer',            label: 'Footer',            icon: <AlignJustify size={13} /> },
    ],
  },
  {
    label: 'About Us',
    items: [
      { key: 'about-page',           label: 'About Us',       icon: <Info size={13} />, indent: true },
      { key: 'mission-vision-page',  label: 'Mission & Vision', icon: <Target size={13} />, indent: true },
    ],
  },
];

export function ContentManagerSidebar({
  active,
  onChange,
}: {
  active: CMActiveSection;
  onChange: (s: CMActiveSection) => void;
}) {
  return (
    <aside className="flex h-full w-48 shrink-0 flex-col overflow-y-auto border-r border-ilm-navy/8 bg-ilm-cream/50">
      <div className="px-2.5 pb-3 pt-3">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ilm-navy/35">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onChange(item.key)}
                  className={cn(
                    'mb-0.5 flex w-full items-center gap-2 rounded-lg py-1.5 text-[12px] font-medium transition-colors text-left',
                    item.indent ? 'pl-5 pr-2.5' : 'px-2.5',
                    isActive
                      ? 'bg-ilm-navy text-white'
                      : 'text-ilm-navy/55 hover:bg-ilm-navy/5 hover:text-ilm-navy',
                  )}
                >
                  <span className="shrink-0 opacity-60">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

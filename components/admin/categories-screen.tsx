'use client';

import { Plus, Tag, ArrowUpDown, Merge } from 'lucide-react';
import { categories } from '@/lib/admin-data';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';

export function CategoriesScreen() {
  return (
    <Reveal>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ilm-navy tracking-tight">Categories & Tags</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">
          <Plus size={14} /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Categories</h3>
          <StaggerContainer className="space-y-3">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <div className="bg-white rounded-xl border border-ilm-navy/8 p-4 flex items-center gap-3 hover:border-ilm-gold transition-colors">
                  <Tag size={16} className="text-ilm-gold-deep shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-ilm-navy">{cat.name}</h4>
                    <p className="text-xs text-ilm-navy/40">{cat.articleCount} articles · /{cat.slug}</p>
                  </div>
                  <button className="text-ilm-navy/30 hover:text-ilm-navy transition-colors"><ArrowUpDown size={15} /></button>
                  <button className="text-ilm-navy/30 hover:text-ilm-navy transition-colors"><Merge size={15} /></button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ilm-navy/40 mb-4">Popular Tags</h3>
          <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6 flex flex-wrap gap-2">
            {['spirituality', 'growth', 'patience', 'education', 'youth', 'mentorship', 'community', 'belonging', 'leadership', 'listening', 'communication', 'mindfulness', 'mercy', 'curiosity', 'sustainability'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-ilm-cream text-xs text-ilm-navy/60 border border-ilm-navy/8 hover:border-ilm-gold hover:text-ilm-navy cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-ilm-navy/8 p-6 mt-4">
            <h4 className="text-sm font-semibold text-ilm-navy mb-3">Add a new tag</h4>
            <div className="flex gap-2">
              <input placeholder="tag name" className="flex-1 px-3.5 py-2 rounded-lg border border-ilm-navy/10 bg-ilm-cream text-sm text-ilm-navy outline-none focus:border-ilm-gold transition-colors" />
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full bg-ilm-navy text-white hover:bg-ilm-navy-soft transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

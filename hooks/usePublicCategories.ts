'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/data';
import { categories as fallbackCategories } from '@/lib/data';

/** Client-side categories for header/search (synced with admin Categories). */
export function usePublicCategories() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    const supabase = createClient();
    void (async () => {
      const [{ data: cats }, { data: published }] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('articles').select('category_id').eq('status', 'published'),
      ]);
      if (!cats?.length) return;

      const counts = new Map<string, number>();
      for (const row of published || []) {
        if (row.category_id) {
          counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
        }
      }

      setCategories(
        cats.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          color: c.color,
          articleCount: counts.get(c.id) || 0,
        })),
      );
    })();
  }, []);

  return categories;
}

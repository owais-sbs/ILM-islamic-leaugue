'use client';

import { Reveal } from '@/components/Reveal';
import { ArticleCard } from '@/components/ArticleCard';
import type { Article } from '@/lib/data';

export function ArticleGrid({
  articles,
  compact = true,
  columns = 3,
}: {
  articles: Article[];
  compact?: boolean;
  columns?: 2 | 3;
}) {
  const colClass = columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {articles.map((article, i) => (
        <Reveal key={article.id} delay={`delay-${(i % 4) + 1}`}>
          <ArticleCard article={article} compact={compact} />
        </Reveal>
      ))}
    </div>
  );
}

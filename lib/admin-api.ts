import type { ArticleRow, DbArticleStatus } from '@/lib/supabase/types';

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`,
    );
  }
  return data as T;
}

export async function fetchAdminArticles(scope?: 'mine' | 'all') {
  const qs = scope === 'mine' ? '?scope=mine' : '';
  const res = await fetch(`/api/admin/articles${qs}`, { credentials: 'include' });
  const data = await parseJson<{ articles: ArticleRow[] }>(res);
  return data.articles;
}

export async function fetchAdminArticle(id: string) {
  const res = await fetch(`/api/admin/articles/${id}`, { credentials: 'include' });
  const data = await parseJson<{ article: ArticleRow; tagNames: string[] }>(res);
  return data;
}

export async function saveAdminArticle(
  payload: Record<string, unknown>,
  articleId?: string,
  tagNames?: string[],
) {
  const res = await fetch(
    articleId ? `/api/admin/articles/${articleId}` : '/api/admin/articles',
    {
      method: articleId ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, tagNames }),
    },
  );
  return parseJson<{ article: ArticleRow; status: DbArticleStatus }>(res);
}

export async function deleteAdminArticle(id: string) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function uploadAdminMedia(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  return parseJson<{ publicUrl: string; path: string }>(res);
}

export async function fetchAdminDashboard() {
  const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
  return parseJson<{
    articles: ArticleRow[];
    questions: unknown[];
    authors: unknown[];
  }>(res);
}

export async function fetchAdminMedia() {
  const res = await fetch('/api/admin/media', { credentials: 'include' });
  const data = await parseJson<{ items: unknown[] }>(res);
  return data.items;
}

export async function fetchAdminMeta() {
  const res = await fetch('/api/admin/meta', { credentials: 'include' });
  return parseJson<{ categories: unknown[]; tags: unknown[] }>(res);
}

export async function deleteAdminMedia(id: string) {
  const res = await fetch('/api/admin/media', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return parseJson<{ ok: boolean }>(res);
}

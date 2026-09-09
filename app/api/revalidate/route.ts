import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireStaff } from '@/lib/supabase/route-handler';

/**
 * POST /api/revalidate
 * Body: { paths?: string[], tags?: string[] }
 *
 * Called by the admin when publishing/unpublishing an article to
 * immediately revalidate the public website pages — no waiting for
 * the 60-second revalidate window.
 *
 * Only authenticated staff can trigger revalidation.
 */
export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const paths: string[] = Array.isArray(body.paths) ? body.paths : [];
  const tags: string[]  = Array.isArray(body.tags)  ? body.tags  : [];

  // Always revalidate the core public routes on any publish/unpublish
  const defaultPaths = ['/', '/articles', '/categories'];

  const allPaths = Array.from(new Set([...defaultPaths, ...paths]));

  for (const path of allPaths) {
    revalidatePath(path);
  }
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    ok: true,
    revalidated: { paths: allPaths, tags },
  });
}

import { NextResponse } from 'next/server';
import { isSupabaseAdminConfigured, isSupabaseConfigured, getSiteUrl } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    siteUrl: getSiteUrl(),
    supabase: {
      public: isSupabaseConfigured(),
      serviceRole: isSupabaseAdminConfigured(),
    },
    time: new Date().toISOString(),
  });
}

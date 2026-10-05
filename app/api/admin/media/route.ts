import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'file';
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, media: [], error: 'Supabase not configured' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, media: [], error: 'Service role unavailable' }, { status: 503 });

  const { data, error } = await admin
    .from('media')
    .select('id, url, filename, size_bytes, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ ok: false, media: [], error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    media: (data ?? []).map((row) => ({
      id: row.id,
      name: row.filename,
      size: formatBytes(Number(row.size_bytes || 0)),
      src: row.url,
      createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
    })),
  });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase admin not configured on Vercel' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'file required' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ ok: false, error: 'Images only' }, { status: 400 });
  }
  if (file.size > 4.5 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'File exceeds 4.5 MB' }, { status: 400 });
  }

  const filename = safeName(file.name);
  const path = `library/${Date.now()}-${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await admin.storage.from('media').upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (upload.error) {
    // Auto-create bucket if missing, then retry once
    const missingBucket = /bucket|not found|does not exist/i.test(upload.error.message);
    if (missingBucket) {
      await admin.storage.createBucket('media', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
      });
      const retry = await admin.storage.from('media').upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });
      if (retry.error) {
        return NextResponse.json({ ok: false, error: retry.error.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ ok: false, error: upload.error.message }, { status: 500 });
    }
  }

  const { data: pub } = admin.storage.from('media').getPublicUrl(path);
  const url = pub.publicUrl;

  const { data, error } = await admin
    .from('media')
    .insert({
      url,
      path,
      filename,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select('id, url, filename, size_bytes, created_at')
    .single();

  if (error) {
    await admin.storage.from('media').remove([path]);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    item: {
      id: data.id,
      name: data.filename,
      size: formatBytes(Number(data.size_bytes || 0)),
      src: data.url,
      createdAt: data.created_at ? new Date(data.created_at).toISOString().slice(0, 10) : '',
    },
  });
}

export async function DELETE(req: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Supabase admin not configured on Vercel' }, { status: 503 });
  }
  const admin = tryCreateServiceClient();
  if (!admin) return NextResponse.json({ ok: false, error: 'Service role unavailable' }, { status: 503 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });

  const { data: row } = await admin.from('media').select('id, path').eq('id', id).maybeSingle();
  if (row?.path) {
    await admin.storage.from('media').remove([row.path]);
  }
  const { error } = await admin.from('media').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

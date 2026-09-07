import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/route-handler';
import { createServiceClient } from '@/lib/supabase/admin';

const BUCKET = 'media';
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth.ok) return auth.response;

  const { supabase, user } = auth.ctx;
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be 5MB or smaller' }, { status: 400 });
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, '-');
  const path = `articles/${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let uploadError: { message: string } | null = null;

  const userUpload = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });

  if (userUpload.error) {
    try {
      const service = createServiceClient();
      const serviceUpload = await service.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });
      if (serviceUpload.error) {
        uploadError = serviceUpload.error;
      }
    } catch (err) {
      uploadError = {
        message: err instanceof Error ? err.message : userUpload.error.message,
      };
    }
  }

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  await supabase.from('media').insert({
    file_name: file.name,
    file_path: path,
    file_url: publicUrl,
    mime_type: file.type || 'image/jpeg',
    size_bytes: file.size,
    alt_text: safeName.replace(/\.[^.]+$/, ''),
    uploaded_by: user.id,
  });

  return NextResponse.json({ publicUrl, path });
}

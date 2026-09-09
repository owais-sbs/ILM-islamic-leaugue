import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Gradient placeholder when an article has no featured image. */
export function ArticleImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn('object-cover', className)}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400',
        className,
      )}
      role="img"
      aria-label={alt}
    >
      <ImageIcon size={28} strokeWidth={1.25} aria-hidden />
      <span className="text-[10px] font-medium uppercase tracking-[.12em]">No image</span>
    </div>
  );
}

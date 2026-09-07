import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Gradient placeholder when an article has no featured image. */
export function ArticleImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} />;
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

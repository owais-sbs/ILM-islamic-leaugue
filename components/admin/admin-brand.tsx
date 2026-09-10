'use client';

export function AdminBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative font-serif text-[26px] leading-none tracking-tighter text-ilm-gold-light pl-2">
        <span className="absolute left-0 top-[-2px] w-[7px] h-[7px] rounded-full bg-ilm-gold" />
        ilm
      </div>
      {!collapsed && (
        <div className="pl-3 border-l border-white/25 text-[9px] uppercase tracking-wide leading-tight text-white/85">
          <strong className="font-semibold">Islamic League</strong><br />of Murabbiyūn
        </div>
      )}
    </div>
  );
}

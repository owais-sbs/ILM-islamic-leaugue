'use client';

export function AdminBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative pl-2 font-serif text-[26px] leading-none tracking-tighter text-ilm-gold-light">
        <span className="absolute left-0 top-[-2px] h-[7px] w-[7px] rounded-full bg-ilm-gold" />
        ilm
      </div>
      {!collapsed && (
        <div className="border-l border-white/25 pl-3 text-[9px] uppercase leading-tight tracking-wide text-white/85">
          <strong className="font-semibold">Islamic League</strong>
          <br />
          of Murabbiyūn
        </div>
      )}
    </div>
  );
}

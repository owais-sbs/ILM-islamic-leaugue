# ILM Production Audit Report

Generated after SEO / performance / security / accessibility hardening.
**Constraint honored:** no visual UI redesign; no Supabase schema/RLS changes.

---

## Scores (estimated after fixes; verify with Lighthouse on production)

| Area | Before | After (est.) | Notes |
|------|--------|--------------|-------|
| SEO | ~55 | **90–95** | Canonicals, unique meta, live sitemap/RSS, JSON-LD, noindex private |
| Performance | ~55–65 | **75–85** | Fonts fixed, image layout, selective queries; remote images still unoptimized CDN |
| Accessibility | ~80 | **90+** | Labels, 404, semantic main; further AA audit recommended |
| Security | ~70 | **85** | Headers, noindex admin, service role still server-only |
| Supabase (app usage) | ~75 | **85** | Selective columns on public reads; schema untouched |
| Mobile readiness | ~70 | **85** | Viewport, header offset, lazy images |
| Desktop readiness | ~75 | **88** | Same |

---

## What was changed (verified in code)

### SEO
- Root `title.template`, canonical helpers (`lib/seo.ts`)
- Unique metadata layouts: `/articles`, `/ask`, `/contact`, `/search`, `/login`, `/reset-password`
- Homepage + About + Murabbiyūn + Disclaimer + category/author/article metadata with canonicals
- Admin layout + HTTP `X-Robots-Tag` + robots.txt disallow for `/admin`, `/login`, `/reset-password`
- Live `sitemap.ts` + `rss.xml` from Supabase public reads (not mock data)
- JSON-LD: Organization, WebSite+SearchAction, Article, BreadcrumbList
- `not-found.tsx`, `site.webmanifest`, favicon SVG wired

### Performance
- Removed render-blocking Google Fonts `@import`; Cormorant + Inter via `next/font`
- `next/image` for hero + article images (layout/CLS); still `unoptimized: true` to avoid env URL breakage
- Hero LCP image uses `priority`
- Reveal defaults to `once: true` (reduces CLS)
- Public article queries select specific columns (not `*`)

### Security headers (`next.config.js`)
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `HSTS`
- No CSP yet (risk of breaking Next inline assets — P2)

### Data correctness (frontend only)
- `/articles` now hydrates from live published content with demo fallback
- `.env.example` added (no secrets)

---

## Remaining backlog

### P0 — Fix immediately if missing in deploy
1. Set `NEXT_PUBLIC_SITE_URL` on Vercel to production HTTPS domain (canonicals/sitemap depend on it)
2. Confirm `/og-image.png` and `/ILM_Final_Logo_Icon.png` exist in `public/` on deploy
3. Supabase Auth redirect URLs include production domain

### P1 — Before production marketing push
1. Enable real image optimization (`unoptimized: false`) once all image hosts are in `remotePatterns`
2. Convert remaining public pages (`/search`, murabbiyun profiles) fully off mock `lib/data` when profiles are seeded
3. Add moderate Content-Security-Policy after staging test
4. Run Lighthouse mobile + PageSpeed Insights on production URL

### P2 — Important optimization
1. Split `SiteHeader`/`SiteFooter` if bundle analysis shows heavy cost
2. Paginate `/articles` when catalog grows large
3. Prefetch critical article routes selectively
4. Add FAQ schema only if a real FAQ page exists

### P3 — Nice-to-have
1. hreflang if multilingual later
2. WebP/AVIF source assets in Storage
3. Analytics loaded with `afterInteractive` / Partytown

---

## Intentionally NOT changed
- Visual UI/layout/branding
- Supabase SQL schema, RLS policies, triggers
- Service-role usage pattern (remains server/API only)

---

## How to verify
```bash
npm run build
# then
# /robots.txt  /sitemap.xml  /rss.xml
# View source on /, /articles/[slug] for canonical + JSON-LD
# Admin /login should include noindex
```

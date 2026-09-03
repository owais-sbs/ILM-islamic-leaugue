# Deploying ILM (Islamic League of Murabbiyūn)

## Environment variables

| Variable | Netlify / Vercel | Purpose |
|----------|------------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Share-link preview image + canonical URLs |

Use your live URL with **no trailing slash**, e.g. `https://ilm-library.netlify.app`.

Set the variable → **redeploy** so Open Graph picks up the correct domain.

## Share link preview (OG image)

- Image file: `public/og-image.png` (1200×630)
- Favicon: `public/ILM_Final_Logo_Icon.png`
- Configured in `app/layout.tsx` via Next.js `metadata`

After deploy, verify:

1. Open `https://your-site/og-image.png` in the browser
2. Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → **Scrape Again** if an old preview is cached

## Netlify

`netlify.toml` uses `@netlify/plugin-nextjs` — no extra redirects needed for Next.js App Router.

## Vercel

Import the repo; Vercel detects Next.js automatically. Add `NEXT_PUBLIC_SITE_URL` in project settings.

## Local dev

```bash
cp .env.example .env.local
# edit NEXT_PUBLIC_SITE_URL if testing OG locally
npm run dev
```

## Cache issues

If share previews show an old image, social platforms cache OG data. Use each platform’s debugger to refresh the cache after redeploying.

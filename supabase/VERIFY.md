# How to verify Supabase is working (ILM)

## Quick checklist (5 minutes)

1. **SQL ran** — `supabase/reset-and-setup.sql` completed with no errors in SQL Editor.
2. **Admin user** — locally: `npm run db:create-admin`
3. **Login** — open `/login` → `adminops@gmail.com` / `admin123` → lands on `/admin`
4. **Role smoke test** — `node scripts/smoke-roles.mjs` → expect **16 passed / 0 failed**
5. **Public site** — homepage shows published articles; `/articles/<slug>` loads for a published piece
6. **Ask form** — submit `/ask` → row appears in Admin → Questions
7. **Subscribe** — homepage email → row in Admin → Subscribers

## Exact content flow to click-test in UI

```
Author login (author.smoke@ilm.test / author123)
  → Create Article → Save draft → Submit for review

Editor login (editor.smoke@ilm.test / editor123)
  → Review Queue → Approve
  → Try Publish → must FAIL (blocked)

Admin login (adminops@gmail.com / admin123)
  → Review / Articles → Publish
  → Open public site → article visible
```

## Vercel env vars (required for live)

In Vercel → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server/admin APIs only — never expose to browser)

Also set Site URL / redirect URLs in Supabase Auth to your Vercel domain.

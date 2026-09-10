# ILM Supabase backend (Developer Spec)

## Deploy (live / staging)

### Option A — SQL Editor (recommended once)

1. Open Supabase → **SQL Editor**
2. Paste and run **`supabase/schema.sql`** (all migrations concatenated)
3. Locally run:

```bash
node scripts/ensure-demo-users.mjs
```

### Option B — Migration files

Apply in order under `supabase/migrations/`:

1. `20260310000001_extensions_enums.sql`
2. `20260310000002_profiles.sql`
3. `20260310000003_taxonomy.sql`
4. `20260310000004_articles.sql`
5. `20260310000005_article_revisions_tags.sql`
6. `20260310000006_engagement_system.sql`
7. `20260310000007_helpers_updated_at_search.sql`
8. `20260310000008_triggers_workflow.sql`
9. `20260310000009_rls_policies.sql`
10. `20260310000010_storage.sql`
11. `20260310000011_seed_taxonomy_settings.sql`

Then create demo users with the script above.

## Demo logins (client walkthrough)

| Role | Email | Password |
|------|--------|----------|
| Admin | `adminops@gmail.com` | `admin123` |
| Editor | `editor.smoke@ilm.test` | `editor123` |
| Author | `author.smoke@ilm.test` | `author123` |

## Env

Copy `.env.example` → `.env.local` (already filled for this project).

Required keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server / scripts only)
- `NEXT_PUBLIC_SITE_URL`

## Workflow enforced in DB

```text
draft → submitted → approved → published
              ↘ returned (requires review_notes) ↗
published → approved  (unpublish; published_at kept)
```

- Author: own draft/returned only; submit only; no publish
- Editor: approve/return; **cannot publish**
- Admin: publish/unpublish + taxonomy/users/settings/activity

Types: `types/database.ts`

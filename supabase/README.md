# Supabase setup — ILM

## Fresh start (delete old tables & rebuild)

Run these **in order** in [Supabase SQL Editor](https://supabase.com/dashboard/project/tfigmkhchtvuhtqeeciq/sql/new):

| Step | File | What it does |
|------|------|----------------|
| 1 | `supabase/reset-database.sql` | Drops all ILM tables (⚠️ deletes data) |
| 2 | `supabase/schema.sql` | Creates tables, RLS, seeds categories/tags |
| 3 | `supabase/admin-bootstrap.sql` | Backfills profiles + promotes admin |

Then create the auth user (local terminal):

```bash
npm run db:create-admin
```

- Email: `adminops@gmail.com`
- Password: `admin123`

Restart dev server, sign out, sign in at `/login`.

---

## First-time setup only

If the database is empty, skip step 1 and run **schema.sql** → **admin-bootstrap.sql** → **db:create-admin**.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `403 Forbidden` on `/api/admin/*` | Run `admin-bootstrap.sql`, sign out/in |
| `more than one relationship articles/profiles` | Fixed in code — use `profiles!author_id(...)` |
| Article editor text resets while typing | Fixed — content editor no longer re-injects placeholder HTML |

## Admin routes

See routes table in project docs — `/admin`, `/admin/articles`, `/admin/articles/new`, etc.

# Supabase setup — ILM

## Fresh start (delete old tables & rebuild)

Run **one file** in [Supabase SQL Editor](https://supabase.com/dashboard/project/tfigmkhchtvuhtqeeciq/sql/new):

### `supabase/reset-and-setup.sql`

This script:

1. Drops all old ILM tables / triggers / helpers  
2. Recreates the full schema (profiles, articles, revisions, questions, …)  
3. Enables **strong RLS** for Author / Editor / Administrator (PDF §7)  
4. Adds a workflow trigger so Editors **cannot publish** and Authors cannot approve  
5. Seeds categories, tags, settings  
6. Promotes `adminops@gmail.com` to Administrator if that Auth user already exists  

Then in your local terminal:

```bash
npm run db:create-admin
```

- Email: `adminops@gmail.com`
- Password: `admin123`

Sign out, sign in at `/login`. Your role comes from `profiles.role` — there is no client “view as” switch.

---

## Role matrix (enforced in UI + RLS + trigger)

| Capability | Author | Editor | Admin |
|---|---|---|---|
| Create / edit own draft | Yes | Yes | Yes |
| Edit another author’s article | No | Yes | Yes |
| Submit for review | Yes | Yes | Yes |
| Approve / return | No | Yes | Yes |
| Publish / unpublish | No | **No** | Yes |
| Categories / tags | No | No | Yes |
| Invite / change roles | No | No | Yes |
| Questions | Assigned only | Yes | Yes |
| Subscribers / settings / activity | No | No | Yes |

---

## Patch without wiping data

If the database is already set up and you only need the latest role guards:

Run `supabase/fix-role-guards.sql` in the SQL Editor (does **not** delete tables).

This blocks non-admins from changing `role` / `is_active`, and keeps the Author/Editor/Admin publish workflow trigger.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `403 Forbidden` on `/api/admin/*` | Re-run reset script or promote admin, then sign out/in |
| Homepage cards empty after reset | Publish articles as Admin, or homepage shows demo cards until DB has published content |
| Editor can publish | Should be blocked by RLS + `enforce_article_workflow` — re-run `reset-and-setup.sql` |

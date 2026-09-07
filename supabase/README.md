# Supabase setup — ILM (Developer Spec v1.0)

## 1. Run schema (required)

Open [SQL Editor](https://supabase.com/dashboard/project/tfigmkhchtvuhtqeeciq/sql/new) → paste `supabase/schema.sql` → **Run**.

This creates all tables from the client PDF: profiles, articles, article_revisions, categories, tags, questions, subscribers, media, site_settings, activity_log + RLS + seeds.

**If you already ran an older schema**, drop public tables first or use a fresh Supabase project, then run the new script.

## 2. Create admin user

```bash
npm run db:create-admin
```

- Email: `adminops@gmail.com`
- Password: `admin123`

## 3. Restart & sign in

Restart `npm run dev`, then open `/login`.

## Admin screens (per PDF §5)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard + monthly author contributions |
| `/admin/articles` | List + status filters |
| `/admin/articles/new` · `/edit` | Full editor (title, slug, excerpt, body, footnotes, SEO, image) |
| `/admin/review/[id]` | Approve / Return / Publish / Unpublish |
| `/admin/categories` | Add, edit, reorder, merge |
| `/admin/tags` | Add / delete |
| `/admin/authors` | Invite by email, edit profile, deactivate |
| `/admin/media` | Upload, copy URL, delete |
| `/admin/questions` | Assign, answer, convert to draft, archive |
| `/admin/subscribers` | List + CSV export |
| `/admin/settings` | Site copy, featured article, banner, disclaimer |
| `/admin/activity` | Audit trail |

# Bloom Desk POS — Supabase setup

## One-time bootstrap

1. Open your Supabase project → **SQL Editor**
2. Paste and run [`bootstrap.sql`](./bootstrap.sql)
3. Confirm tables `pos_products`, `pos_orders`, `pos_articles` have seed rows
4. Copy **Project URL** and **anon public** key from **Settings → API**
5. In the app root, create `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

6. Restart `npm run dev` and open `/admin`

## Reset demo data

Dashboard → **Reset demo** calls RPC `reset_pos_demo()`, which truncates POS tables and re-seeds presentation data (relative to `current_date`).

You can also run in SQL Editor:

```sql
select public.reset_pos_demo();
```

## Files

| File | Purpose |
|------|---------|
| `bootstrap.sql` | Schema + RLS + RPC + initial seed (paste once) |
| `schema.sql` | Tables + demo-open RLS only |
| `seed.sql` | Seed inserts (standalone) |
| `reset_demo.sql` | `reset_pos_demo()` function only |

## Security note

RLS policies are **demo-open** (`anon` can read/write). Fine for presentation; tighten before real shop use.

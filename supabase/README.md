# Bloom Desk POS — Supabase setup

Products, orders, articles, **locations**, and **ribbon/wrapper options** live in the database. The React app loads them at runtime. SQL seeders populate the demo catalog — they are not hardcoded in the UI as the live shop list.

## Fresh project (one-time)

1. Supabase → **SQL Editor**
2. Paste and run [`bootstrap.sql`](./bootstrap.sql)
3. Confirm tables: `pos_products`, `pos_orders`, `pos_articles`, `pos_locations`, `pos_options`
4. Copy **Project URL** + **anon** key → `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

5. Restart `npm run dev` → `/admin` → header should say **Data: Supabase**

## Existing project (already bootstrapped earlier)

Run [`migrate_shop_options.sql`](./migrate_shop_options.sql) once to add locations/options and refresh `reset_pos_demo()`.

Then Dashboard → **Reset demo** (or `select public.reset_pos_demo();`).

## Reset demo data

Dashboard → **Reset demo** calls RPC `reset_pos_demo()`, which truncates POS tables and re-seeds:

- 8 sample products (incl. one sold-out imported SKU)
- 3 sample orders
- Flower reference articles
- Delivery/pickup locations
- Ribbon + wrapper options

## Files

| File | Purpose |
|------|---------|
| `bootstrap.sql` | Full schema + RLS + RPC + initial seed |
| `migrate_shop_options.sql` | Add locations/options to an existing DB + update RPC |
| `schema.sql` | Tables + RLS only |
| `seed.sql` | Standalone seed inserts |
| `reset_demo.sql` | `reset_pos_demo()` only |

## Security note

RLS policies are **demo-open** (`anon` can read/write). Fine for presentation; tighten before real shop use.

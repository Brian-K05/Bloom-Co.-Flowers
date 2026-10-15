-- Bloom Desk POS schema
-- Demo-open RLS (presentation only). Tighten before production.

create extension if not exists pgcrypto;

drop table if exists public.pos_orders cascade;
drop table if exists public.pos_articles cascade;
drop table if exists public.pos_products cascade;
drop table if exists public.pos_locations cascade;
drop table if exists public.pos_options cascade;

create table public.pos_products (
  id text primary key,
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  category text not null,
  stock_qty integer not null default 0 check (stock_qty >= 0),
  available boolean not null default true,
  image text not null,
  is_imported boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.pos_orders (
  id text primary key,
  created_at timestamptz not null default now(),
  source text not null check (source in ('messenger', 'walk-in', 'call')),
  status text not null check (
    status in ('pending', 'confirmed', 'preparing', 'ready_out', 'completed', 'cancelled')
  ),
  customer_name text not null,
  customer_phone text not null default '',
  recipient_name text not null default '',
  recipient_phone text not null default '',
  location text not null,
  fulfillment text not null check (fulfillment in ('delivery', 'pickup')),
  schedule_date date not null,
  items jsonb not null default '[]'::jsonb,
  customization jsonb not null default '{}'::jsonb,
  is_preorder boolean not null default false,
  supplier_note text not null default '',
  reminder_due date null,
  reminder_done boolean not null default false,
  history jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  stock_applied boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.pos_articles (
  id text primary key,
  title text not null,
  category text not null check (category in ('flower', 'color', 'tip')),
  body text not null,
  updated_at timestamptz not null default now()
);

create table public.pos_locations (
  id text primary key,
  label text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.pos_options (
  id text primary key,
  kind text not null check (kind in ('ribbon', 'wrapper')),
  label text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index pos_orders_schedule_date_idx on public.pos_orders (schedule_date);
create index pos_orders_status_idx on public.pos_orders (status);
create index pos_orders_is_preorder_idx on public.pos_orders (is_preorder);

alter table public.pos_products enable row level security;
alter table public.pos_orders enable row level security;
alter table public.pos_articles enable row level security;
alter table public.pos_locations enable row level security;
alter table public.pos_options enable row level security;

-- Presentation demo: open policies for anon + authenticated
drop policy if exists pos_products_demo_all on public.pos_products;
create policy pos_products_demo_all on public.pos_products
  for all to anon, authenticated using (true) with check (true);

drop policy if exists pos_orders_demo_all on public.pos_orders;
create policy pos_orders_demo_all on public.pos_orders
  for all to anon, authenticated using (true) with check (true);

drop policy if exists pos_articles_demo_all on public.pos_articles;
create policy pos_articles_demo_all on public.pos_articles
  for all to anon, authenticated using (true) with check (true);

drop policy if exists pos_locations_demo_all on public.pos_locations;
create policy pos_locations_demo_all on public.pos_locations
  for all to anon, authenticated using (true) with check (true);

drop policy if exists pos_options_demo_all on public.pos_options;
create policy pos_options_demo_all on public.pos_options
  for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant all on public.pos_products to anon, authenticated;
grant all on public.pos_orders to anon, authenticated;
grant all on public.pos_articles to anon, authenticated;
grant all on public.pos_locations to anon, authenticated;
grant all on public.pos_options to anon, authenticated;

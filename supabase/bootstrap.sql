-- Bloom Desk POS — paste this once in Supabase SQL Editor
-- Includes: schema, RLS (demo-open), seed data, reset_pos_demo() RPC
-- Catalog lives in the database. App loads products/orders/articles/locations/options from here.

-- ========== SCHEMA ==========
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
    status in ('not_paid', 'paid', 'partial', 'cancelled')
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
  delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
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

-- ========== RESET RPC (seed body — single source of demo data) ==========
create or replace function public.reset_pos_demo()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  truncate table public.pos_orders, public.pos_articles, public.pos_products,
    public.pos_locations, public.pos_options restart identity cascade;

  insert into public.pos_locations (id, label, sort_order) values
    ('makati-poblacion', 'Makati – Poblacion', 1),
    ('san-jose', 'San Jose', 2),
    ('quezon-city', 'Quezon City', 3),
    ('pasig', 'Pasig', 4),
    ('mandaluyong', 'Mandaluyong', 5),
    ('studio-pickup', 'Studio Pickup', 6);

  insert into public.pos_options (id, kind, label, sort_order) values
    ('ribbon-pink', 'ribbon', 'Pink', 1),
    ('ribbon-yellow', 'ribbon', 'Yellow', 2),
    ('ribbon-red', 'ribbon', 'Red', 3),
    ('ribbon-ivory', 'ribbon', 'Ivory', 4),
    ('ribbon-sage', 'ribbon', 'Sage', 5),
    ('ribbon-gold', 'ribbon', 'Gold', 6),
    ('wrapper-kraft', 'wrapper', 'Kraft', 1),
    ('wrapper-ivory', 'wrapper', 'Ivory tissue', 2),
    ('wrapper-blush', 'wrapper', 'Blush wrap', 3),
    ('wrapper-cello', 'wrapper', 'Clear cellophane', 4),
    ('wrapper-black', 'wrapper', 'Black matte', 5);

  insert into public.pos_products (id, name, price, category, stock_qty, available, image, is_imported) values
    ('classic-red-roses', 'Classic Red Roses', 1500, 'Roses', 40, true, 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1200&q=80', false),
    ('blush-romance', 'Blush Romance', 1800, 'Roses', 28, true, 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=1200', false),
    ('white-elegance', 'White Elegance', 2000, 'Bouquets', 18, true, 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1200&q=80', false),
    ('pastel-dreams', 'Pastel Dreams', 1650, 'Bouquets', 22, true, 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200', false),
    ('imported-tulips', 'Dutch Tulip Bundle', 2800, 'Imported', 8, true, 'https://images.unsplash.com/photo-1494336877155-7fb9c6984f0a?auto=format&fit=crop&w=1200&q=80', true),
    ('sweet-birthday', 'Sweet Birthday Bloom', 1450, 'Bouquets', 30, true, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80', false),
    ('love-grace', 'Love & Grace', 2200, 'Boxes', 12, true, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80', false),
    ('orchid-accent', 'Orchid Accent', 3200, 'Imported', 0, false, 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80', true);

  insert into public.pos_articles (id, title, category, body) values
    ('rose-red', 'Red roses', 'flower', 'Classic symbol of deep romantic love and passion. Best for anniversaries, Valentine’s, and serious gestures.'),
    ('tulip', 'Tulips', 'flower', 'Tulips suggest perfect love and elegant simplicity. Imported stems often need advance sourcing — use pre-order.'),
    ('color-pink', 'Pink', 'color', 'Grace, admiration, and gentle affection. Safer choice when the relationship is new or friendly.'),
    ('color-yellow', 'Yellow', 'color', 'Friendship, cheer, and celebration. Ideal for birthdays and “just because” gifts.'),
    ('tip-messenger', 'Encoding a Messenger order', 'tip', 'Confirm product, date, location, ribbon/wrapper, and card message in chat, then create the POS order immediately so stock and calendar stay accurate.');

  insert into public.pos_orders (
    id, created_at, source, status,
    customer_name, customer_phone, recipient_name, recipient_phone,
    location, fulfillment, schedule_date, items, customization,
    is_preorder, supplier_note, reminder_due, reminder_done, history,
    subtotal, delivery_fee, total, stock_applied
  ) values
  (
    'POS-1001', now(), 'messenger', 'paid',
    'Isabelle Cruz', '+63 917 555 1024', 'Marco Cruz', '+63 918 555 2200',
    'Makati – Poblacion', 'delivery', current_date,
    '[{"productId":"classic-red-roses","name":"Classic Red Roses","price":1500,"quantity":1}]'::jsonb,
    '{"ribbon":"Pink","wrapper":"Ivory tissue","cardMessage":"Happy anniversary — forever yours.","addOns":"","notes":"From Messenger chat this morning"}'::jsonb,
    false, '', null, false,
    jsonb_build_array(
      jsonb_build_object('at', now(), 'by', 'Ana (staff)', 'text', 'Order encoded from Messenger (stock deducted)'),
      jsonb_build_object('at', now(), 'by', 'Ana (staff)', 'text', 'Payment → paid')
    ),
    1500, 100, 1600, true
  ),
  (
    'POS-1002', now(), 'messenger', 'not_paid',
    'Lara Mendoza', '+63 927 111 8899', 'Lara Mendoza', '+63 927 111 8899',
    'Studio Pickup', 'pickup', (current_date + 1),
    '[{"productId":"imported-tulips","name":"Dutch Tulip Bundle","price":2800,"quantity":1}]'::jsonb,
    '{"ribbon":"Sage","wrapper":"Kraft","cardMessage":"","addOns":"Baby’s breath","notes":"Customer asked about tulip meaning"}'::jsonb,
    true, 'Need to confirm tulip shipment with importer', (current_date + 1), false,
    jsonb_build_array(
      jsonb_build_object('at', now(), 'by', 'Owner', 'text', 'Pre-order logged from Messenger')
    ),
    2800, 0, 2800, false
  ),
  (
    'POS-1003', now(), 'walk-in', 'partial',
    'Walk-in Guest', '+63 900 000 0000', 'Sofia Reyes', '+63 916 222 3344',
    'San Jose', 'delivery', current_date,
    '[{"productId":"pastel-dreams","name":"Pastel Dreams","price":1650,"quantity":1},{"productId":"sweet-birthday","name":"Sweet Birthday Bloom","price":1450,"quantity":1}]'::jsonb,
    '{"ribbon":"Yellow","wrapper":"Blush wrap","cardMessage":"Happy Birthday!","addOns":"","notes":""}'::jsonb,
    false, '', null, false,
    jsonb_build_array(
      jsonb_build_object('at', now(), 'by', 'Ana (staff)', 'text', 'Walk-in order created (stock deducted)'),
      jsonb_build_object('at', now(), 'by', 'Ana (staff)', 'text', 'Payment → partial')
    ),
    3100, 150, 3250, true
  );

  return jsonb_build_object('ok', true, 'message', 'POS demo data reset');
end;
$$;

grant execute on function public.reset_pos_demo() to anon, authenticated;

-- ========== INITIAL SEED ==========
select public.reset_pos_demo();

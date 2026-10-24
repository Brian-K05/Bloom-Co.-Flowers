-- Peak tally: product recipes + order time slots (run on existing projects)
alter table public.pos_products add column if not exists kind text;
alter table public.pos_products add column if not exists size integer;
alter table public.pos_products add column if not exists color text;
alter table public.pos_products add column if not exists recipe jsonb not null default '[]'::jsonb;
alter table public.pos_orders add column if not exists slot_time text not null default '08:00';

update public.pos_products set kind = 'other' where kind is null;
alter table public.pos_products alter column kind set default 'other';
alter table public.pos_products alter column kind set not null;

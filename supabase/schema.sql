-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Tickers Table
create table if not exists tickers (
    id uuid primary key default uuid_generate_v4(),
    symbol text not null unique,
    name text not null,
    exchange text,
    type text check (type in ('stock', 'etf')),
    sector text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. Daily Prices Table
create table if not exists prices_daily (
    id uuid primary key default uuid_generate_v4(),
    symbol text not null references tickers(symbol) on delete cascade,
    date date not null,
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    volume bigint,
    source text default 'cron',
    created_at timestamptz default now(),
    unique(symbol, date)
);
create index idx_prices_symbol_date on prices_daily(symbol, date desc);

-- 4. Dividends Table
create table if not exists dividends (
    id uuid primary key default uuid_generate_v4(),
    symbol text not null references tickers(symbol) on delete cascade,
    ex_date date not null,
    pay_date date,
    amount numeric not null,
    currency text default 'USD',
    frequency text,
    created_at timestamptz default now(),
    unique(symbol, ex_date, amount)
);
create index idx_dividends_symbol on dividends(symbol);

-- 5. ETF Holdings (Optional)
create table if not exists etf_holdings (
    id uuid primary key default uuid_generate_v4(),
    etf_symbol text not null references tickers(symbol) on delete cascade,
    holding_symbol text not null,
    weight numeric,
    as_of date default current_date,
    created_at timestamptz default now(),
    unique(etf_symbol, holding_symbol, as_of)
);

-- 6. News Items
create table if not exists news_items (
    id uuid primary key default uuid_generate_v4(),
    source text not null,
    title text not null,
    url text unique not null,
    published_at timestamptz not null,
    summary text,
    sentiment text check (sentiment in ('positive', 'negative', 'neutral')),
    tickers text[], -- Array of text for denormalized search
    created_at timestamptz default now()
);
create index idx_news_published on news_items(published_at desc);
create index idx_news_tickers on news_items using gin(tickers);

-- 7. Tool Runs (Caching/History)
create table if not exists tool_runs (
    id uuid primary key default uuid_generate_v4(),
    tool_slug text not null,
    params_hash text not null,
    params_json jsonb,
    result_json jsonb,
    created_at timestamptz default now(),
    unique(tool_slug, params_hash)
);

-- 8. RLS Policies
alter table tickers enable row level security;
alter table prices_daily enable row level security;
alter table dividends enable row level security;
alter table etf_holdings enable row level security;
alter table news_items enable row level security;
alter table tool_runs enable row level security;

-- Public Read Policies
create policy "Allow public read types" on tickers for select using (true);
create policy "Allow public read prices" on prices_daily for select using (true);
create policy "Allow public read dividends" on dividends for select using (true);
create policy "Allow public read etf_holdings" on etf_holdings for select using (true);
create policy "Allow public read news" on news_items for select using (true);
create policy "Allow public read tool results" on tool_runs for select using (true);

-- Service Role Write Policies (implicitly allowed for service_role, but explicit for clarity if needed, though usually service_role bypasses RLS)
-- We only need to ensure no public writes

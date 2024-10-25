-- user_settingsテーブルの作成
create table public.user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  ai_service text default 'dify',
  openai_key text,
  dify_key text,
  dify_api_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id)
);

-- RLSポリシーの設定
alter table public.user_settings enable row level security;

create policy "ユーザーは自分の設定のみ参照可能"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分の設定のみ作成可能"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "ユーザーは自分の設定のみ更新可能"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- 更新日時を自動更新するトリガーの作成
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on public.user_settings
  for each row
  execute function public.handle_updated_at();
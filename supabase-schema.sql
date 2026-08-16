-- Supabase Dashboard > SQL Editor에서 한 번 실행하세요.
create table if not exists public.proposal_records (
  id uuid primary key default gen_random_uuid(),
  groom_name text not null check (char_length(groom_name) between 1 and 12),
  bride_name text not null check (char_length(bride_name) between 1 and 12),
  wedding_date date not null,
  service_used_on date not null default current_date,
  days_until_wedding integer not null,
  created_at timestamptz not null default now()
);

-- 날짜 차이는 서버에서 재계산해 저장합니다. 클라이언트 값은 신뢰하지 않습니다.
create or replace function public.set_proposal_record_dates()
returns trigger
language plpgsql
as $$
begin
  new.service_used_on := coalesce(new.service_used_on, current_date);
  new.days_until_wedding := new.wedding_date - new.service_used_on;
  return new;
end;
$$;

drop trigger if exists proposal_record_dates on public.proposal_records;
create trigger proposal_record_dates
before insert or update of wedding_date, service_used_on on public.proposal_records
for each row execute function public.set_proposal_record_dates();

alter table public.proposal_records enable row level security;
grant insert on table public.proposal_records to anon;

-- 방문자는 기록만 할 수 있고, 저장된 개인 데이터는 읽거나 수정할 수 없습니다.
create policy "Anyone can create a proposal record"
on public.proposal_records
for insert
to anon
with check (
  char_length(groom_name) between 1 and 12
  and char_length(bride_name) between 1 and 12
);

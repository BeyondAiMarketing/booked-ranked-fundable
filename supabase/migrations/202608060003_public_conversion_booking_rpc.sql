create or replace function public.get_strategy_call_availability(
  p_start_date date default current_date,
  p_business_days integer default 14,
  p_timezone text default 'America/Los_Angeles'
)
returns table (starts_at timestamptz, timezone text)
language sql stable security definer set search_path = public, pg_temp
as $$
  with business_dates as (
    select day::date as local_day
    from generate_series(p_start_date::timestamp, (p_start_date + 45)::timestamp, interval '1 day') as day
    where extract(isodow from day) between 1 and 5
    order by day
    limit greatest(1, least(p_business_days, 30))
  ), candidate_slots as (
    select make_timestamptz(
      extract(year from local_day)::integer,
      extract(month from local_day)::integer,
      extract(day from local_day)::integer,
      slot_hour, 0, 0, p_timezone
    ) as slot_start
    from business_dates
    cross join unnest(array[9, 10, 11, 13, 14, 15, 16]) as slot_hour
  )
  select slot_start, p_timezone
  from candidate_slots
  where slot_start > now() + interval '30 minutes'
    and not exists (
      select 1 from public.strategy_call_bookings booking
      where booking.status in ('held', 'confirmed')
        and tstzrange(booking.starts_at, booking.ends_at, '[)')
          && tstzrange(slot_start, slot_start + interval '30 minutes', '[)')
    )
  order by slot_start;
$$;

create or replace function public.book_strategy_call(
  p_contact_name text,
  p_business_name text,
  p_email text,
  p_phone text,
  p_niche text,
  p_starts_at timestamptz,
  p_timezone text default 'America/Los_Angeles',
  p_source text default 'book_demo_modal',
  p_notes jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public, private, pg_temp
as $$
declare
  v_local timestamp;
  v_booking_id uuid;
  v_lead_result jsonb;
  v_lead_id uuid;
  v_email text := private.normalize_public_email(p_email);
  v_phone text := private.normalize_public_phone(p_phone);
begin
  if nullif(btrim(p_contact_name), '') is null
     or nullif(btrim(p_business_name), '') is null
     or v_email is null
     or nullif(btrim(p_niche), '') is null then
    return jsonb_build_object('ok', false, 'outcome', 'invalid', 'error', 'Name, business, email, and niche are required.');
  end if;

  if p_starts_at <= now() + interval '30 minutes' then
    return jsonb_build_object('ok', false, 'outcome', 'invalid_slot', 'error', 'Choose a future time slot.');
  end if;

  v_local := p_starts_at at time zone p_timezone;
  if extract(isodow from v_local) not between 1 and 5
     or extract(minute from v_local) <> 0
     or extract(hour from v_local)::integer not in (9, 10, 11, 13, 14, 15, 16) then
    return jsonb_build_object('ok', false, 'outcome', 'invalid_slot', 'error', 'Choose one of the available strategy-call times.');
  end if;

  begin
    insert into public.strategy_call_bookings (
      starts_at, ends_at, duration_minutes, timezone, contact_name,
      business_name, email, phone, normalized_email, normalized_phone,
      niche, status, source, notes
    ) values (
      p_starts_at, p_starts_at + interval '30 minutes', 30, p_timezone,
      btrim(p_contact_name), btrim(p_business_name), btrim(p_email),
      nullif(btrim(p_phone), ''), v_email, v_phone, btrim(p_niche),
      'confirmed', p_source, coalesce(p_notes, '{}'::jsonb)
    ) returning id into v_booking_id;
  exception
    when exclusion_violation or unique_violation then
      return jsonb_build_object('ok', false, 'outcome', 'slot_conflict', 'error', 'That time was just booked. Please choose another available time.');
  end;

  v_lead_result := public.capture_public_lead(
    p_contact_name => p_contact_name,
    p_business_name => p_business_name,
    p_email => p_email,
    p_phone => p_phone,
    p_website => null,
    p_service_area => null,
    p_niche => lower(p_niche),
    p_source => p_source,
    p_status => 'appointment_scheduled',
    p_notes => coalesce(p_notes, '{}'::jsonb) || jsonb_build_object(
      'bookingId', v_booking_id,
      'startsAt', p_starts_at,
      'timezone', p_timezone
    )
  );

  if coalesce((v_lead_result ->> 'ok')::boolean, false) then
    v_lead_id := (v_lead_result ->> 'leadId')::uuid;
    update public.strategy_call_bookings set lead_id = v_lead_id, updated_at = now() where id = v_booking_id;
  end if;

  return jsonb_build_object(
    'ok', true, 'outcome', 'confirmed', 'bookingId', v_booking_id,
    'leadId', v_lead_id, 'startsAt', p_starts_at, 'timezone', p_timezone
  );
end;
$$;

revoke all on function public.get_strategy_call_availability(date, integer, text) from public, anon, authenticated;
revoke all on function public.book_strategy_call(text, text, text, text, text, timestamptz, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.get_strategy_call_availability(date, integer, text) to service_role;
grant execute on function public.book_strategy_call(text, text, text, text, text, timestamptz, text, text, jsonb) to service_role;

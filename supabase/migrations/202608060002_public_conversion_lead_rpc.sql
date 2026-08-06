create or replace function public.capture_public_lead(
  p_contact_name text,
  p_business_name text,
  p_email text default null,
  p_phone text default null,
  p_website text default null,
  p_service_area text default null,
  p_niche text default 'general',
  p_source text default 'public_form',
  p_status text default 'new_lead',
  p_notes jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_email text := private.normalize_public_email(p_email);
  v_phone text := private.normalize_public_phone(p_phone);
  v_website text := private.normalize_public_website(p_website);
  v_ids uuid[];
  v_lead_id uuid;
  v_matched_on text[] := '{}';
  v_payload jsonb;
begin
  if nullif(btrim(p_contact_name), '') is null then
    raise exception 'Contact name is required.' using errcode = '22023';
  end if;
  if nullif(btrim(p_business_name), '') is null then
    raise exception 'Business name is required.' using errcode = '22023';
  end if;
  if v_email is null and v_phone is null and v_website is null then
    raise exception 'At least one of email, phone, or website is required.' using errcode = '22023';
  end if;

  if v_email is not null then perform pg_advisory_xact_lock(hashtextextended('public-lead:email:' || v_email, 0)); end if;
  if v_phone is not null then perform pg_advisory_xact_lock(hashtextextended('public-lead:phone:' || v_phone, 0)); end if;
  if v_website is not null then perform pg_advisory_xact_lock(hashtextextended('public-lead:website:' || v_website, 0)); end if;

  select array_agg(distinct id order by id)
  into v_ids
  from public.public_leads
  where (v_email is not null and normalized_email = v_email)
     or (v_phone is not null and normalized_phone = v_phone)
     or (v_website is not null and normalized_website = v_website);

  if coalesce(array_length(v_ids, 1), 0) > 1 then
    return jsonb_build_object('ok', false, 'outcome', 'identity_conflict', 'error', 'The submitted identifiers match more than one existing lead.');
  end if;

  v_payload := jsonb_build_object(
    'contactName', btrim(p_contact_name),
    'businessName', btrim(p_business_name),
    'email', p_email,
    'phone', p_phone,
    'website', p_website,
    'serviceArea', p_service_area,
    'niche', p_niche,
    'source', p_source,
    'notes', coalesce(p_notes, '{}'::jsonb)
  );

  if coalesce(array_length(v_ids, 1), 0) = 1 then
    v_lead_id := v_ids[1];
    if v_email is not null and exists (select 1 from public.public_leads where id = v_lead_id and normalized_email = v_email) then v_matched_on := array_append(v_matched_on, 'email'); end if;
    if v_phone is not null and exists (select 1 from public.public_leads where id = v_lead_id and normalized_phone = v_phone) then v_matched_on := array_append(v_matched_on, 'phone'); end if;
    if v_website is not null and exists (select 1 from public.public_leads where id = v_lead_id and normalized_website = v_website) then v_matched_on := array_append(v_matched_on, 'website'); end if;

    update public.public_leads
    set contact_name = coalesce(nullif(btrim(p_contact_name), ''), contact_name),
        business_name = coalesce(nullif(btrim(p_business_name), ''), business_name),
        email = coalesce(nullif(btrim(p_email), ''), email),
        phone = coalesce(nullif(btrim(p_phone), ''), phone),
        website = coalesce(nullif(btrim(p_website), ''), website),
        normalized_email = coalesce(v_email, normalized_email),
        normalized_phone = coalesce(v_phone, normalized_phone),
        normalized_website = coalesce(v_website, normalized_website),
        service_area = coalesce(nullif(btrim(p_service_area), ''), service_area),
        niche = coalesce(nullif(btrim(p_niche), ''), niche),
        source = coalesce(nullif(btrim(p_source), ''), source),
        status = coalesce(nullif(btrim(p_status), ''), status),
        notes = notes || coalesce(p_notes, '{}'::jsonb),
        submission_count = submission_count + 1,
        last_submitted_at = now(),
        updated_at = now()
    where id = v_lead_id;

    insert into public.public_lead_submissions (lead_id, was_duplicate, matched_on, source, niche, payload)
    values (v_lead_id, true, v_matched_on, p_source, p_niche, v_payload);

    return jsonb_build_object('ok', true, 'outcome', 'duplicate', 'leadId', v_lead_id, 'matchedOn', to_jsonb(v_matched_on));
  end if;

  insert into public.public_leads (
    contact_name, business_name, email, phone, website,
    normalized_email, normalized_phone, normalized_website,
    service_area, niche, source, status, notes
  ) values (
    btrim(p_contact_name), btrim(p_business_name), nullif(btrim(p_email), ''),
    nullif(btrim(p_phone), ''), nullif(btrim(p_website), ''), v_email, v_phone,
    v_website, nullif(btrim(p_service_area), ''),
    coalesce(nullif(btrim(p_niche), ''), 'general'),
    coalesce(nullif(btrim(p_source), ''), 'public_form'),
    coalesce(nullif(btrim(p_status), ''), 'new_lead'),
    coalesce(p_notes, '{}'::jsonb)
  ) returning id into v_lead_id;

  insert into public.public_lead_submissions (lead_id, was_duplicate, matched_on, source, niche, payload)
  values (v_lead_id, false, '{}', p_source, p_niche, v_payload);

  return jsonb_build_object('ok', true, 'outcome', 'created', 'leadId', v_lead_id, 'matchedOn', '[]'::jsonb);
end;
$$;

revoke all on function public.capture_public_lead(text, text, text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.capture_public_lead(text, text, text, text, text, text, text, text, text, jsonb) to service_role;

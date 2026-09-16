import { supabase } from './client';

/**
 * Fetch all published/active events
 */
export const fetchEventsFromSupabase = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .or('status.eq.approved,status.is.null')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Fetch Events Error]:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Create a new event in Supabase
 * @param {Object} eventData 
 */
export const createEventInSupabase = async (eventData) => {
  if (!supabase) return { success: true, localOnly: true };
  try {
    const payload = {
      title: eventData.title,
      title_kz: eventData.titleKz || eventData.title,
      short_desc: eventData.shortDesc,
      short_desc_kz: eventData.shortDescKz || eventData.shortDesc,
      description: eventData.description,
      image_url: eventData.imageUrl || null,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      location_short: eventData.locationShort,
      category_name: eventData.categoryName || 'Pizza Pitch',
      has_projects: !!eventData.hasProjects,
      status: eventData.status || 'approved',
      is_featured: !!eventData.isFeatured,
      created_by: eventData.createdBy ? String(eventData.createdBy) : null
    };

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('[Create Event Error]:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Register attendee or pitching project for an event
 * @param {Object} regData 
 */
export const registerForEventInSupabase = async (regData) => {
  if (!supabase) return { success: true, localOnly: true };
  try {
    if (regData.user_id) {
      await supabase.from('profiles').upsert({
        id: String(regData.user_id),
        first_name: regData.attendee_name || 'Innovator',
        phone: regData.attendee_phone || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }

    const payload = {
      event_id: (regData.event_id && String(regData.event_id).length === 36) ? regData.event_id : null,
      event_title: regData.event_title || '',
      user_id: String(regData.user_id),
      attendee_name: regData.attendee_name,
      attendee_phone: regData.attendee_phone || '',
      telegram_username: regData.telegram_username || '',
      registration_type: regData.registration_type || 'listener',
      project_id: (regData.project_id && String(regData.project_id).length === 36) ? regData.project_id : null,
      project_name: regData.project_name || null,
      project_desc: regData.project_desc || null,
      team_members: regData.team_members || null,
      project_stage: regData.project_stage || null,
      project_category: regData.project_category || null,
      demo_or_github_url: regData.demo_or_github_url || null,
      pdf_deck_url: regData.pdf_deck_url || null,
      status: regData.status || 'confirmed'
    };

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[Event Registration Supabase Error]:', error.message, error.details);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Event Registration Exception]:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch registrations for specific user
 * @param {string|number} userId 
 */
export const fetchUserEventRegistrationsFromSupabase = async (userId) => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('user_id', String(userId))
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Fetch Registrations Error]:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

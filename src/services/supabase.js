import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit

// ====================================================================
// 1. PROFILES & ROLES
// ====================================================================

export const syncUserProfileToSupabase = async (userData) => {
  if (!userData || !userData.id) return { success: false };

  const payload = {
    id: String(userData.id),
    first_name: userData.firstName || '',
    last_name: userData.lastName || '',
    username: userData.username || '',
    phone: userData.phone || '',
    role: userData.role || 'community',
    role_title: userData.roleTitle || 'Резидент Hub',
    skills_or_interest: userData.skillsOrInterest || '',
    is_telegram: !!userData.isTelegram,
    updated_at: new Date().toISOString()
  };

  if (!supabase) return { success: true, localOnly: true, data: payload };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Sync Error]:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const fetchUserProfileFromSupabase = async (userId) => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', String(userId))
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};

// ====================================================================
// 2. EVENTS & COVER IMAGE UPLOAD (5MB LIMIT)
// ====================================================================

/**
 * Upload event banner/cover image to Supabase Storage bucket 'event_covers'
 * @param {File} file 
 * @param {string|number} userId 
 */
export const uploadEventCoverImageToSupabase = async (file, userId) => {
  if (!file) {
    return { success: false, error: 'Файл не выбран' };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      success: false,
      error: `Размер изображения (${sizeMb} MB) превышает лимит 5 MB.`
    };
  }

  if (!supabase) {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      isLocal: true
    };
  }

  try {
    const timestamp = Date.now();
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 24);
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `covers/event_${userId || 'admin'}_${timestamp}_${cleanName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('event_covers')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg'
      });

    if (uploadError) {
      console.warn('[Supabase Cover Upload Error]:', uploadError.message);
      return {
        success: true,
        url: URL.createObjectURL(file),
        fileName: file.name
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('event_covers')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      fileName: file.name
    };
  } catch (err) {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name
    };
  }
};

export const fetchEventsFromSupabase = async (includePending = false) => {
  if (!supabase) return null;
  try {
    let query = supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!includePending) {
      query = query.eq('status', 'approved');
    }
    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase Events Fetch Error]:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

export const createEventInSupabase = async (eventData) => {
  if (!supabase) return { success: true, localOnly: true, data: eventData };
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateEventStatusInSupabase = async (eventId, status) => {
  if (!supabase) return { success: true };
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ status })
      .eq('id', eventId)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ====================================================================
// 3. PDF PITCH DECKS & SUPABASE STORAGE (10MB LIMIT)
// ====================================================================

export const uploadPitchDeckPdfToSupabase = async (file, userId) => {
  if (!file) {
    return { success: false, error: 'Файл не выбран' };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      success: false,
      error: `Размер файла (${sizeMb} MB) превышает лимит 10 MB. Пожалуйста, сожмите PDF.`
    };
  }

  const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  if (!supabase) {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: fileSizeStr,
      isLocal: true
    };
  }

  try {
    const timestamp = Date.now();
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const filePath = `decks/user_${userId || 'guest'}_${timestamp}_${cleanName}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('pitch_decks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });

    if (uploadError) {
      console.warn('[Supabase Storage Upload Error]:', uploadError.message);
      return {
        success: true,
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: fileSizeStr
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('pitch_decks')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      fileName: file.name,
      fileSize: fileSizeStr
    };
  } catch (err) {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: fileSizeStr
    };
  }
};

// ====================================================================
// 4. PROJECTS & STARTUPS
// ====================================================================

export const fetchProjectsFromSupabase = async (includePending = false) => {
  if (!supabase) return null;
  try {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!includePending) {
      query = query.eq('status', 'approved');
    }
    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase Projects Fetch Error]:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

export const createProjectInSupabase = async (projectData) => {
  if (!supabase) return { success: true, localOnly: true, data: projectData };
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const updateProjectStatusInSupabase = async (projectId, status) => {
  if (!supabase) return { success: true };
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', projectId)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const rateProjectInSupabase = async (reviewData) => {
  if (!supabase) return { success: true };
  try {
    const { data, error } = await supabase
      .from('project_reviews')
      .upsert(reviewData, { onConflict: 'project_id,user_id' })
      .select();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ====================================================================
// 5. EVENT REGISTRATIONS
// ====================================================================

export const fetchUserEventRegistrationsFromSupabase = async (userId) => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('user_id', String(userId))
      .order('created_at', { ascending: false });
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};

export const registerForEventInSupabase = async (registrationData) => {
  if (!supabase) return { success: true, localOnly: true, data: registrationData };
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([registrationData])
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

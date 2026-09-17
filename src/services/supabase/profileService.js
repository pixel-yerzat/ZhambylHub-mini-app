import { supabase } from './client';

/**
 * Synchronize user profile with Supabase 'profiles' table
 * @param {Object} userData 
 */
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

/**
 * Fetch profile data by user ID
 * @param {string|number} userId 
 */
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

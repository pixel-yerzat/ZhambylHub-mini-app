import { createClient } from '@supabase/supabase-js';

// Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize client if credentials are configured
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save / Upsert user profile & role to Supabase
 * @param {Object} userData 
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const syncUserProfileToSupabase = async (userData) => {
  if (!userData || !userData.id) {
    return { success: false, error: 'User ID is missing' };
  }

  const payload = {
    id: String(userData.id),
    first_name: userData.firstName || '',
    last_name: userData.lastName || '',
    username: userData.username || '',
    role: userData.role || 'community', // 'developer' | 'founder' | 'investor' | 'community'
    role_title: userData.roleTitle || '',
    skills_or_interest: userData.skillsOrInterest || '',
    points: userData.points || 0,
    is_telegram: !!userData.isTelegram,
    updated_at: new Date().toISOString()
  };

  // If Supabase is connected, upsert into 'profiles' table
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('[Supabase Sync Error]:', error.message);
        return { success: false, error: error.message };
      }

      console.log('[Supabase Sync Success]: Profile synced', data);
      return { success: true, data };
    } catch (err) {
      console.warn('[Supabase Connection Exception]:', err);
      return { success: false, error: err.message };
    }
  } else {
    // Graceful fallback for local development or until user fills .env keys
    console.info('[Supabase]: Client not initialized with credentials. Saved to local storage.', payload);
    return { success: true, localOnly: true, data: payload };
  }
};

/**
 * Fetch profile from Supabase by Telegram ID
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

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

import { supabase } from './client';

/**
 * Fetch all published startup projects from Supabase
 */
export const fetchProjectsFromSupabase = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Fetch Projects Error]:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Fetch registry of past hackathon winners directly from Supabase
 */
export const fetchWinningProjectsFromSupabase = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('winning_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Fetch Winning Projects Error]:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Create a new startup project with PDF pitch deck in Supabase
 * @param {Object} projectData 
 */
export const createProjectInSupabase = async (projectData) => {
  if (!supabase) return { success: true, localOnly: true };
  try {
    // 1. Ensure founder profile exists in 'profiles' table to satisfy Foreign Key constraint
    if (projectData.founder_id) {
      try {
        await supabase.from('profiles').upsert({
          id: String(projectData.founder_id),
          first_name: projectData.founder_name || 'Innovator',
          phone: projectData.founder_phone || '',
          role: 'founder',
          role_title: projectData.founder_role || 'Основатель стартапа',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('[Profile Upsert Warning]:', profileErr);
      }
    }

    const payload = {
      name: projectData.name,
      category: projectData.category || 'AI & IT Solutions',
      tag: projectData.tag || 'Startup',
      stage: projectData.stage || 'MVP / Prototype',
      short_desc: projectData.short_desc || '',
      short_desc_kz: projectData.short_desc_kz || projectData.short_desc || '',
      founder_id: projectData.founder_id ? String(projectData.founder_id) : null,
      founder_name: projectData.founder_name || 'Innovator',
      founder_phone: projectData.founder_phone || '',
      founder_role: projectData.founder_role || 'Founder & Team Lead',
      team_members: projectData.team_members || '',
      demo_url: projectData.demo_url || '',
      logo_icon: projectData.logo_icon || '🚀',
      pdf_deck_url: projectData.pdf_deck_url || null,
      pdf_deck_name: projectData.pdf_deck_name || 'pitch_deck.pdf',
      pdf_deck_size: projectData.pdf_deck_size || '2.4 MB',
      status: projectData.status || 'approved',
      is_past_winner: !!projectData.is_past_winner,
      winning_event_title: projectData.winning_event_title || null,
      rejection_reason: projectData.rejection_reason || null,
      similarity_score: projectData.similarity_score || 0.00,
      matched_entity_title: projectData.matched_entity_title || null,
      ai_analysis: projectData.ai_analysis || {},
      rating: 5.0,
      reviews_count: 1
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('[Create Project Warning, trying core columns]:', error.message);

      // Fallback: insert core columns in case optional AI columns have not been migrated yet
      const corePayload = {
        name: projectData.name,
        category: projectData.category || 'AI & IT Solutions',
        tag: projectData.tag || 'Startup',
        stage: projectData.stage || 'MVP / Prototype',
        short_desc: projectData.short_desc || '',
        founder_id: projectData.founder_id ? String(projectData.founder_id) : null,
        founder_name: projectData.founder_name || 'Innovator',
        founder_phone: projectData.founder_phone || '',
        founder_role: projectData.founder_role || 'Founder & Team Lead',
        team_members: projectData.team_members || '',
        demo_url: projectData.demo_url || '',
        logo_icon: projectData.logo_icon || '🚀',
        pdf_deck_url: projectData.pdf_deck_url || null,
        pdf_deck_name: projectData.pdf_deck_name || 'pitch_deck.pdf',
        pdf_deck_size: projectData.pdf_deck_size || '2.4 MB',
        status: projectData.status || 'approved'
      };

      const { data: retryData, error: retryError } = await supabase
        .from('projects')
        .insert([corePayload])
        .select()
        .single();

      if (retryError) {
        console.error('[Create Project Fallback Failed]:', retryError.message);
        return { success: false, error: retryError.message };
      }

      return { success: true, data: retryData };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[Create Project Exception]:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Save expert pitch rating to Supabase 'project_reviews'
 * @param {Object} ratingData 
 */
export const rateProjectInSupabase = async (ratingData) => {
  if (!supabase) return { success: true, localOnly: true };
  try {
    if (ratingData.user_id) {
      await supabase.from('profiles').upsert({
        id: String(ratingData.user_id),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }

    const payload = {
      project_id: ratingData.project_id,
      user_id: ratingData.user_id ? String(ratingData.user_id) : null,
      problem_score: Number(ratingData.problem_score) || 5,
      solution_score: Number(ratingData.solution_score) || 5,
      market_score: Number(ratingData.market_score) || 5,
      pitch_score: Number(ratingData.pitch_score) || 5,
      avg_score: Number(ratingData.avg_score) || 5.0,
      comment: ratingData.comment || ''
    };

    const { data, error } = await supabase
      .from('project_reviews')
      .upsert([payload], { onConflict: 'project_id,user_id' })
      .select()
      .single();

    if (error) {
      console.warn('[Rating Error]:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

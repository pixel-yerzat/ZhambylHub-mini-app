import { supabase } from './client';
import { FILE_LIMITS } from '@/constants/app';

/**
 * Upload event banner/cover image to Supabase Storage bucket 'event_covers'
 * @param {File} file 
 * @param {string|number} userId 
 */
export const uploadEventCoverImageToSupabase = async (file, userId) => {
  if (!file) {
    return { success: false, error: 'Файл не выбран' };
  }

  if (file.size > FILE_LIMITS.MAX_IMAGE_SIZE_BYTES) {
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
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `events/${userId || 'public'}_${timestamp}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from('event_covers')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('[Supabase Image Upload Warning]:', uploadError.message);
      return {
        success: true,
        url: URL.createObjectURL(file),
        fileName: file.name,
        isLocal: true,
        note: 'Saved locally (Supabase bucket may need public policy)'
      };
    }

    const { data: publicData } = supabase.storage
      .from('event_covers')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicData?.publicUrl || URL.createObjectURL(file),
      fileName: file.name,
      filePath
    };
  } catch (err) {
    console.error('[Image Upload Exception]:', err);
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      isLocal: true
    };
  }
};

/**
 * Upload PDF pitch deck to Supabase Storage bucket 'pitch_decks'
 * @param {File} file 
 * @param {string|number} userId 
 */
export const uploadPitchDeckPdfToSupabase = async (file, userId) => {
  if (!file) {
    return { success: false, error: 'Файл не выбран' };
  }

  if (file.size > FILE_LIMITS.MAX_PDF_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      success: false,
      error: `Размер файла (${sizeMb} MB) превышает лимит 10 MB.`
    };
  }

  if (!supabase) {
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      isLocal: true
    };
  }

  try {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${userId || 'anon'}/${timestamp}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from('pitch_decks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });

    if (uploadError) {
      console.warn('[Supabase Storage Warning]:', uploadError.message);
      return {
        success: true,
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        isLocal: true,
        note: 'Saved locally (Supabase bucket may need public policy)'
      };
    }

    const { data: publicData } = supabase.storage
      .from('pitch_decks')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicData?.publicUrl || URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      filePath
    };
  } catch (err) {
    console.error('[Upload Exception]:', err);
    return {
      success: true,
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      isLocal: true
    };
  }
};

/**
 * Zhambyl Hub Backend API Service
 * Integrates with Google Gemini AI Verification Service & Supabase backend.
 * Reference: INTEGRATION_GUIDE.md
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000';

/**
 * Standard request headers with Telegram WebApp initData authorization
 */
function getHeaders(userId = null) {
  const initData = window.Telegram?.WebApp?.initData || '';
  const headers = {
    'Content-Type': 'application/json',
  };

  if (initData) {
    headers['x-telegram-init-data'] = initData;
  } else if (userId) {
    // Development fallback when running in browser outside Telegram
    headers['x-telegram-user-id'] = String(userId);
  } else {
    headers['x-telegram-user-id'] = '682910412';
  }

  return headers;
}

export const hubApi = {
  /**
   * Submit project application for instant Google Gemini AI verification and registration
   * Checks against duplicate submissions and past hackathon winners.
   * @param {Object} projectData
   * @param {string|number} userId
   * @returns {Promise<{success: boolean, message: string, data: Object}>}
   */
  async submitProject(projectData, userId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/submit`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(projectData),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || result.message || 'Ошибка при отправке проекта',
          data: result.data || null
        };
      }
      return result;
    } catch (err) {
      console.warn('[hubApi.submitProject] Backend offline or network error, using fallback:', err.message);
      return {
        success: false,
        isNetworkError: true,
        error: err.message
      };
    }
  },

  /**
   * Fetch user's submitted projects with AI verification statuses
   * @param {string|number} userId
   * @returns {Promise<Array>}
   */
  async getMyProjects(userId = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/my`, {
        method: 'GET',
        headers: getHeaders(userId),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Не удалось загрузить проекты');
      }
      return result.data || [];
    } catch (err) {
      console.warn('[hubApi.getMyProjects] Backend unreachable:', err.message);
      return null;
    }
  },

  /**
   * Fetch registry of past hackathon winners
   * @returns {Promise<Array>}
   */
  async getPastWinners() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/winners`);
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.warn('[hubApi.getPastWinners] Backend unreachable:', err.message);
      return null;
    }
  },
};

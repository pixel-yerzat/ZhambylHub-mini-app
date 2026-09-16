import { useContext } from 'react';
import { AppContext } from '@/context/AppContextInstance';

/**
 * Custom hook to access global AppContext state and actions
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

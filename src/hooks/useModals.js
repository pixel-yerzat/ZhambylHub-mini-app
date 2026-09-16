import { useState, useCallback } from 'react';
import { hapticFeedback } from '@/utils/telegram';

/**
 * Custom React hook for controlling modal sheets & overlays
 */
export const useModals = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((type, data = null) => {
    hapticFeedback.impact('light');
    setActiveModal(type);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    hapticFeedback.impact('light');
    setActiveModal(null);
    setModalData(null);
  }, []);

  return {
    activeModal,
    modalData,
    openModal,
    closeModal
  };
};

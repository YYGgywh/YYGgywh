import { useState, useCallback } from 'react';

/**
 * 弹窗管理Hook
 * @returns {Object} 弹窗管理相关数据和方法
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  // 打开弹窗
  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);
  
  // 关闭弹窗
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    document.body.style.overflow = '';
  }, []);
  
  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};
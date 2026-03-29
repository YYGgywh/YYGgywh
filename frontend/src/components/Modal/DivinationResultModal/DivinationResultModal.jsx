/*
 * @file            frontend/src/components/Modal/DivinationResultModal/DivinationResultModal.jsx
 * @description     移动端六爻排盘结果弹窗组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-29 10:00:00
 * @lastModified    2026-03-29 10:00:00
 * Copyright © All rights reserved
*/

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styles from './DivinationResultModal.mobile.module.css';
import LiuYaoReault from '../../LiuYao/LiuYaoReault/LiuYaoReault';

const DivinationResultModal = ({ 
  isOpen, 
  onClose, 
  formData = {}, 
  divinationData = {} 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent}>
          <LiuYaoReault 
            formData={formData} 
            divinationData={divinationData}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

DivinationResultModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object,
  divinationData: PropTypes.object
};

export default DivinationResultModal;
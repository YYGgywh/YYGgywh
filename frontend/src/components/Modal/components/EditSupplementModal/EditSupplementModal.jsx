/*
 * @file            frontend/src/components/Modal/components/EditSupplementModal/EditSupplementModal.jsx
 * @description     编辑补充信息弹窗组件
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-20 13:15:00
 * @lastModified    2026-03-20 13:15:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { updatePan } from '../../../../api/panApi';
import desktopStyles from './EditSupplementModal.desktop.module.css';
import mobileStyles from './EditSupplementModal.mobile.module.css';

const EditSupplementModal = ({ isOpen, onClose, data, onSuccess, isMobile = false }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // 根据屏幕尺寸选择样式
  const styles = isMobile ? mobileStyles : desktopStyles;

  useEffect(() => {
    if (isOpen && data) {
      setContent(data.supplement || '');
      setError(null);
    }
  }, [isOpen, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data?.id) {
      setError('记录ID不存在');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updatePan(data.id, { supplement: content });
      
      if (onSuccess) {
        onSuccess(content);
      }
      onClose();
    } catch (err) {
      console.error('更新补充信息失败:', err);
      setError(err.message || '保存失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>编辑补充信息</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入补充说明..."
              rows={6}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className={styles.charCount}>
              {content.length}/500
            </div>
            {error && (
              <div className={styles.error}>{error}</div>
            )}
          </div>
          
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || content === data?.supplement}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplementModal;

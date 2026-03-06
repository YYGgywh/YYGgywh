import React, { useState } from 'react';
import './PanImageViewer.css';

/**
 * 图片查看器组件
 * @param {Object} props 组件属性
 * @param {Array} props.images 图片数组
 * @param {number} props.initialIndex 初始索引
 * @param {Function} props.onClose 关闭回调
 */
const PanImageViewer = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // 处理关闭
  const handleClose = () => {
    onClose && onClose();
  };
  
  // 处理点击遮罩层
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // 处理上一张
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // 处理下一张
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  if (!images.length) return null;
  
  return (
    <div className="image-viewer-overlay" onClick={handleOverlayClick}>
      <div className="image-viewer-content">
        <button className="viewer-close-button" onClick={handleClose}>
          ×
        </button>
        
        {images.length > 1 && (
          <button className="viewer-nav-button prev" onClick={handlePrev}>
            ‹
          </button>
        )}
        
        <div className="viewer-image-container">
          <img
            src={images[currentIndex]}
            alt={`图片 ${currentIndex + 1}`}
            className="viewer-image"
          />
        </div>
        
        {images.length > 1 && (
          <button className="viewer-nav-button next" onClick={handleNext}>
            ›
          </button>
        )}
        
        {images.length > 1 && (
          <div className="viewer-indicator">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanImageViewer;
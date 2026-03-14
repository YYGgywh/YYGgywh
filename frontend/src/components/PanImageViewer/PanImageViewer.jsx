/*
 * @file            frontend/src/components/PanImageViewer/PanImageViewer.jsx
 * @description     图片查看器组件，支持多张图片浏览、切换和关闭功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-11 10:00:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

// 导入 React 核心库和必要的 hooks
import React, { useState } from 'react';
// 导入组件样式文件
import styles from './PanImageViewer.desktop.module.css';

/**
 * 图片查看器组件
 * 功能：展示图片数组，支持图片切换、关闭和指示器
 * @param {Object} props 组件属性
 * @param {Array} props.images 图片数组
 * @param {number} props.initialIndex 初始索引
 * @param {Function} props.onClose 关闭回调
 */
const PanImageViewer = ({ images = [], initialIndex = 0, onClose }) => {
  // 状态管理：当前显示的图片索引
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // 处理关闭图片查看器
  const handleClose = () => {
    // 调用关闭回调函数（如果存在）
    onClose && onClose();
  };
  
  // 处理点击遮罩层关闭
  const handleOverlayClick = (e) => {
    // 只有点击遮罩层本身时才关闭（避免点击内容区也关闭）
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // 处理上一张图片
  const handlePrev = (e) => {
    // 阻止事件冒泡，避免触发遮罩层的点击事件
    e.stopPropagation();
    // 计算上一张图片的索引，循环切换
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // 处理下一张图片
  const handleNext = (e) => {
    // 阻止事件冒泡，避免触发遮罩层的点击事件
    e.stopPropagation();
    // 计算下一张图片的索引，循环切换
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // 如果图片数组为空，不渲染任何内容
  if (!images.length) return null;
  
  // 渲染图片查看器
  return (
    // 遮罩层容器，点击时触发关闭
    <div className={styles.imageViewerOverlay} onClick={handleOverlayClick}>
      <div className={styles.imageViewerContent}>
        {/* 关闭按钮 */}
        <button className={styles.viewerCloseButton} onClick={handleClose}>
          × {/* 关闭符号 */}
        </button>
        
        {/* 上一张按钮（只有多张图片时显示） */}
        {images.length > 1 && (
          <button className={styles.viewerNavButton + ' ' + styles.viewerNavButtonPrev} onClick={handlePrev}>
            ‹ {/* 左箭头符号 */}
          </button>
        )}
        
        {/* 图片容器 */}
        <div className={styles.viewerImageContainer}>
          <img
            src={images[currentIndex]} // 当前显示的图片路径
            alt={`图片 ${currentIndex + 1}`} // 图片描述
            className={styles.viewerImage} // 图片样式
          />
        </div>
        
        {/* 下一张按钮（只有多张图片时显示） */}
        {images.length > 1 && (
          <button className={styles.viewerNavButton + ' ' + styles.viewerNavButtonNext} onClick={handleNext}>
            › {/* 右箭头符号 */}
          </button>
        )}
        
        {/* 图片指示器（只有多张图片时显示） */}
        {images.length > 1 && (
          <div className={styles.viewerIndicator}>
            {/* 为每张图片创建一个指示器点 */}
            {images.map((_, index) => (
              <span
                key={index} // 唯一键
                className={`${styles.indicatorDot} ${index === currentIndex ? styles.indicatorDotActive : ''}`} // 激活状态
                onClick={(e) => {
                  // 阻止事件冒泡，避免触发遮罩层的点击事件
                  e.stopPropagation();
                  // 直接跳转到点击的图片索引
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

// 导出图片查看器组件
export default PanImageViewer;

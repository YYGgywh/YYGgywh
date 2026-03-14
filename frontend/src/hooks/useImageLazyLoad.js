import { useEffect, useRef, useState } from 'react';

/**
 * 图片懒加载Hook
 * @param {string} src 图片源地址
 * @param {string} placeholder 占位图地址
 * @returns {Object} 图片懒加载相关数据和方法
 */
export const useImageLazyLoad = (src, placeholder = '') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  
  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // 处理交叉观察
  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      observer.disconnect(); // 完全断开观察器
    };
  }, []);
  
  return {
    imgRef,
    src: isInView ? src : placeholder,
    isLoaded,
    handleLoad
  };
};
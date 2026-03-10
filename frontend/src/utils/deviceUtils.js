/*
 * @file            frontend/src/utils/deviceUtils.js
 * @description     设备检测和响应式样式加载工具
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-09 15:30:00
 * @lastModified    2026-03-09 15:30:00
 * Copyright © All rights reserved
*/

/**
 * 设备检测工具函数
 * 用于判断当前设备类型（桌面端/移动端）并提供响应式样式加载支持
 */

/**
 * 判断是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobileDevice = () => {
  // 检查是否有 touch 事件支持
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  // 检查用户代理字符串
  const userAgent = navigator.userAgent || navigator.vendor || (window.opera ? navigator.opera.version() : null);
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  // 检查屏幕宽度
  const isSmallScreen = window.innerWidth <= 768;
  
  return isTouch || isMobileUA || isSmallScreen;
};

/**
 * 获取设备类型
 * @returns {string} 设备类型：'desktop' 或 'mobile'
 */
export const getDeviceType = () => {
  return isMobileDevice() ? 'mobile' : 'desktop';
};

/**
 * 监听设备类型变化
 * @param {function} callback 设备类型变化时的回调函数
 * @returns {function} 取消监听的函数
 */
export const listenDeviceTypeChange = (callback) => {
  const handleResize = () => {
    const currentDeviceType = getDeviceType();
    if (handleResize.previousDeviceType !== currentDeviceType) {
      handleResize.previousDeviceType = currentDeviceType;
      callback(currentDeviceType);
    }
  };
  
  // 初始化设备类型
  handleResize.previousDeviceType = getDeviceType();
  
  // 添加事件监听
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // 返回取消监听的函数
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
};

/**
 * 加载响应式样式
 * @param {string} componentName 组件名称
 * @returns {object} 样式对象
 */
export const loadResponsiveStyles = (componentName) => {
  const deviceType = getDeviceType();
  
  try {
    // 尝试动态加载对应设备的样式
    const styles = require(`../components/DivinationInfo/components/FormComponents/${componentName}/${componentName}.${deviceType}.module.css`);
    return styles;
  } catch (error) {
    console.warn(`Failed to load ${deviceType} styles for ${componentName}, falling back to desktop styles.`, error);
    try {
      const styles = require(`../components/DivinationInfo/components/FormComponents/${componentName}/${componentName}.desktop.module.css`);
      return styles;
    } catch (fallbackError) {
      console.error(`Failed to load fallback styles for ${componentName}`, fallbackError);
      return {};
    }
  }
};

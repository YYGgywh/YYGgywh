/*
 * @file            frontend/src/utils/elementColorUtils.js
 * @description     五行属性判断工具函数，用于根据汉字判断五行属性
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-23 15:00:00
 * @lastModified    2026-02-23 15:00:00
 * Copyright © All rights reserved
*/

/**
 * 五行映射表
 * 木、火、金、水、土对应的汉字
 */
const ELEMENT_MAP = {
  wood: ['木', '甲', '乙', '寅', '卯', '青龙'],
  fire: ['火', '丙', '丁', '巳', '午', '朱雀'],
  metal: ['金', '庚', '辛', '申', '酉', '白虎'],
  water: ['水', '壬', '癸', '亥', '子', '玄武'],
  earth: ['土', '戊', '己', '丑', '辰', '未', '戌', '勾陈', '螣蛇']
};

/**
 * 根据汉字判断五行属性
 * @param {string} text - 需要判断的汉字
 * @returns {string|null} 返回五行属性（'wood' | 'fire' | 'metal' | 'water' | 'earth'），如果不在五行映射表中则返回 null
 */
const getElementByText = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmedText = text.trim();
  
  for (const [element, characters] of Object.entries(ELEMENT_MAP)) {
    if (characters.includes(trimmedText)) {
      return element;
    }
  }
  
  return null;
};

/**
 * 获取五行对应的颜色值
 * @param {string} element - 五行属性（'wood' | 'fire' | 'metal' | 'water' | 'earth'）
 * @returns {string|null} 返回颜色值，如果五行属性无效则返回 null
 */
const getElementColor = (element) => {
  const COLOR_MAP = {
    wood: '#00B050',
    fire: '#FF0000',
    metal: '#FFC000',
    water: '#002060',
    earth: '#80350E'
  };
  
  return COLOR_MAP[element] || null;
};

/**
 * 冲合颜色映射表
 * 冲：红色 #C00000
 * 合：绿色 #00B050
 */
const CHONG_HE_COLOR_MAP = {
  '冲': '#C00000',
  '合': '#00B050'
};

/**
 * 根据汉字直接获取对应的颜色值
 * 优先判断冲合，再判断五行
 * @param {string} text - 需要判断的汉字
 * @returns {string|null} 返回颜色值，如果不在映射表中则返回 null
 */
const getColorByText = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmedText = text.trim();
  
  // 优先判断冲合
  if (CHONG_HE_COLOR_MAP[trimmedText]) {
    return CHONG_HE_COLOR_MAP[trimmedText];
  }
  
  // 再判断五行
  const element = getElementByText(trimmedText);
  return getElementColor(element);
};

/**
 * 判断是否为冲或合
 * @param {string} text - 需要判断的汉字
 * @returns {boolean} 返回是否为冲或合
 */
const isChongOrHe = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return text.trim() === '冲' || text.trim() === '合';
};

/**
 * 获取冲合颜色
 * @param {string} text - 冲或合
 * @returns {string|null} 返回颜色值，如果不是冲或合则返回 null
 */
const getChongHeColor = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }
  return CHONG_HE_COLOR_MAP[text.trim()] || null;
};

export {
  getElementByText,
  getElementColor,
  getColorByText,
  isChongOrHe,
  getChongHeColor
};

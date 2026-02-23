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
 * 根据汉字直接获取对应的颜色值
 * @param {string} text - 需要判断的汉字
 * @returns {string|null} 返回颜色值，如果不在五行映射表中则返回 null
 */
const getColorByText = (text) => {
  const element = getElementByText(text);
  return getElementColor(element);
};

export {
  getElementByText,
  getElementColor,
  getColorByText
};

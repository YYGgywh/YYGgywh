/*
 * @file            frontend/src/utils/xunKongUtils.js
 * @description     旬空判断工具函数，支持传入天干、地支或干支组合，返回旬空信息
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-21 18:00:00
 * @lastModified    2026-02-21 18:27:34
 * Copyright © All rights reserved
*/

import { ALL_GANS, ALL_ZHIS, YANG_GANS, YIN_GANS, YANG_ZHIS, YIN_ZHIS } from '../data/ganZhiData'; // 导入天干地支数据
import { xunTable, xunKongMap } from '../data/ganZhiData'; // 导入旬表和空亡表

/*
 * 判断干支组合是否合法
 * @param {string} combination - 干支组合，如"甲子"（可选）
 * @param {string} gan - 天干，如"甲"（可选）
 * @param {string} zhi - 地支，如"子"（可选）
 * @returns {boolean} 是否合法
 * 
 * 使用方式：
 * 1. 传入干支组合：isValidCombination('甲子')
 * 2. 传入天干和地支：isValidCombination(null, '甲', '子')
 */
export function isValidCombination(combination, gan, zhi) {
  let finalGan, finalZhi; /* 定义最终的天干和地支 */
  
  // 方式1：传入干支组合
  if (combination && !gan && !zhi) {
    if (combination.length !== 2) {
      return false;
    }
    finalGan = combination[0]; /* 从组合中提取天干 */
    finalZhi = combination[1]; /* 从组合中提取地支 */
  }
  // 方式2：传入天干和地支
  else if (!combination && gan && zhi) {
    finalGan = gan; /* 直接赋值天干 */
    finalZhi = zhi; /* 直接赋值地支 */
  }
  // 参数不合法
  else {
    return false;
  }
  
  // 检查天干是否合法
  if (!ALL_GANS.includes(finalGan)) {
    return false;
  }
  
  // 检查地支是否合法
  if (!ALL_ZHIS.includes(finalZhi)) {
    return false;
  }
  
  // 检查阴阳属性是否匹配：阳干必须对应阳支，阴干必须对应阴支
  const isYangGan = YANG_GANS.includes(finalGan); /* 判断天干是否为阳干 */
  const isYangZhi = YANG_ZHIS.includes(finalZhi); /* 判断地支是否为阳支 */
  
  if (isYangGan !== isYangZhi) {
    return false;
  }
  
  return true;
}

/**
 * 根据天干地支获取旬空信息
 * @param {string} gan - 天干（可选），如"甲"
 * @param {string} zhi - 地支（可选），如"子"
 * @param {string} combination - 干支组合（可选），如"甲子"
 * @returns {Object} 旬空信息对象，包含旬名、空亡列表、是否空亡等
 */
export function getXunKong(gan, zhi, combination) {
  let finalGan = gan;
  let finalZhi = zhi;
  let finalCombination = combination;

  // 如果传入的是干支组合，解析天干和地支
  if (combination && !gan && !zhi) {
    if (combination.length !== 2) {
      console.error('干支组合长度必须为2');
      return { error: '干支组合长度必须为2' };
    }
    finalGan = combination[0];
    finalZhi = combination[1];
    finalCombination = combination;
  }
  // 如果传入的是天干和地支，构建组合
  else if (gan && zhi && !combination) {
    finalCombination = gan + zhi;
  }
  // 如果既没有组合，也没有天干地支，返回错误
  else if (!finalCombination) {
    console.error('必须传入干支组合或天干地支');
    return { error: '必须传入干支组合或天干地支' };
  }

  // 验证干支组合是否合法
  if (!isValidCombination(finalCombination)) {
    console.error(`干支组合非法：${finalCombination}`);
    return { error: '干支组合非法' };
  }

  // 查旬
  let xun = null;
  for (const [xunName, combinations] of Object.entries(xunTable)) {
    if (combinations.includes(finalCombination)) {
      xun = xunName;
      break;
    }
  }

  // 如果没有找到旬，返回错误
  if (!xun) {
    console.error(`未找到旬：${finalCombination}`);
    return { error: '未找到旬' };
  }

  // 获取空亡列表
  const kongList = xunKongMap[xun] || [];

  // 判断地支是否为空亡
  const isKong = kongList.includes(finalZhi);

  return {
    combination: finalCombination, /* 最终的干支组合 */
    gan: finalGan, /* 最终的天干 */
    zhi: finalZhi, /* 最终的地支 */
    xun: xun, /* 最终的旬名 */
    kongList: kongList, /* 空亡列表 */
    isKong: isKong, /* 是否为空亡 */
    kongZhi: isKong ? finalZhi : null, /* 空亡的地支 */
    isValid: true /* 是否为合法组合 */
  };
}

/**
 * 简化函数：根据干支组合获取旬空信息
 * @param {string} combination - 干支组合，如"甲子"
 * @returns {Object} 旬空信息对象
 */
export function getXunKongByCombination(combination) {
  return getXunKong(null, null, combination);
}

/**
 * 简化函数：根据天干地支获取旬空信息
 * @param {string} gan - 天干，如"甲"
 * @param {string} zhi - 地支，如"子"
 * @returns {Object} 旬空信息对象
 */
export function getXunKongByGanZhi(gan, zhi) {
  return getXunKong(gan, zhi, null);
}

/**
 * 获取空亡显示字符串
 * @param {string} gan - 天干，如"甲"
 * @param {string} zhi - 地支，如"子"
 * @returns {string} 空亡显示字符串，如"戌亥"
 */
export function getXunKongDisplay(gan, zhi) {
  if (!gan || !zhi) return '';
  const xunKongInfo = getXunKongByGanZhi(gan, zhi);
  if (!xunKongInfo.isValid || !xunKongInfo.kongList || xunKongInfo.kongList.length === 0) return '';
  return `${xunKongInfo.kongList.join('')}`;
}

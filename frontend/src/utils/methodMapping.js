/*
 * @file            frontend/src/utils/methodMapping.js
 * @description     起卦方式和排盘类型映射工具，用于中英文转换
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 12:00:00
 * @lastModified    2026-03-03 13:30:00
 * Copyright © All rights reserved
*/

// 起卦方式映射
const METHOD_TO_CHINESE = {
  'step_by_step': '逐爻起卦',
  'one_click': '一键起卦',
  'number': '报数起卦',
  'specified': '指定起卦'
};

const METHOD_TO_ENGLISH = {
  '逐爻起卦': 'step_by_step',
  '一键起卦': 'one_click',
  '报数起卦': 'number',
  '指定起卦': 'specified'
};

// 排盘类型映射
const PAN_TYPE_TO_CHINESE = {
  'liuyao': '六爻',
  'bazi': '八字',
  'ziwei': '紫微斗数',
  'qimen': '奇门遁甲'
};

const PAN_TYPE_TO_ENGLISH = {
  '六爻': 'liuyao',
  '八字': 'bazi',
  '紫微斗数': 'ziwei',
  '奇门遁甲': 'qimen'
};

const methodToChinese = (method) => {
  return METHOD_TO_CHINESE[method] || method;
};

const methodToEnglish = (method) => {
  return METHOD_TO_ENGLISH[method] || method;
};

const panTypeToChinese = (panType) => {
  return PAN_TYPE_TO_CHINESE[panType] || panType;
};

const panTypeToEnglish = (panType) => {
  return PAN_TYPE_TO_ENGLISH[panType] || panType;
};

export {
  METHOD_TO_CHINESE,
  METHOD_TO_ENGLISH,
  PAN_TYPE_TO_CHINESE,
  PAN_TYPE_TO_ENGLISH,
  methodToChinese,
  methodToEnglish,
  panTypeToChinese,
  panTypeToEnglish
};

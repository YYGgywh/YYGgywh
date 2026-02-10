// 路径:src/utils/fourPillarsUtils.js 时间:2026-02-06 10:00
// 功能:提供四柱排盘相关的工具函数，包括天干地支验证、组合逻辑等

// 定义阳干、阴干、阳支、阴支
const YANG_GANS = ['甲', '丙', '戊', '庚', '壬'];
const YIN_GANS = ['乙', '丁', '己', '辛', '癸'];
const YANG_ZHIS = ['子', '寅', '辰', '午', '申', '戌'];
const YIN_ZHIS = ['丑', '卯', '巳', '未', '酉', '亥'];
const ALL_GANS = [...YANG_GANS, ...YIN_GANS];
const ALL_ZHIS = [...YANG_ZHIS, ...YIN_ZHIS];

/**
 * 验证天干输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateGanInput = (value) => {
  const validGans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  return validGans.includes(value);
};

/**
 * 验证地支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateZhiInput = (value) => {
  const validZhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return validZhis.includes(value);
};

/**
 * 获取天干列表
 * @returns {Array<Array<string>>} 天干列表，第一行为阳干，第二行为阴干
 */
export const getTianGanList = () => {
  return [
    ['甲', '丙', '戊', '庚', '壬'], // 阳干
    ['乙', '丁', '己', '辛', '癸']  // 阴干
  ];
};

/**
 * 获取地支列表
 * @returns {Array<string>} 地支列表
 */
export const getDiZhiList = () => {
  return ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
};

/**
 * 验证年干输入
 * @param {string} value - 输入值
 * @param {string} yearZhi - 年支值
 * @returns {boolean} 是否有效
 */
export const validateYearGanInput = (value, yearZhi) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  if (!yearZhi) {
    return ALL_GANS.includes(value);
  } else if (YANG_ZHIS.includes(yearZhi)) {
    return YANG_GANS.includes(value);
  } else if (YIN_ZHIS.includes(yearZhi)) {
    return YIN_GANS.includes(value);
  }
  return false;
};

/**
 * 验证年支输入
 * @param {string} value - 输入值
 * @param {string} yearGan - 年干值
 * @returns {boolean} 是否有效
 */
export const validateYearZhiInput = (value, yearGan) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  if (!yearGan) {
    return ALL_ZHIS.includes(value);
  } else if (YANG_GANS.includes(yearGan)) {
    return YANG_ZHIS.includes(value);
  } else if (YIN_GANS.includes(yearGan)) {
    return YIN_ZHIS.includes(value);
  }
  return false;
};

/**
 * 验证日干输入
 * @param {string} value - 输入值
 * @param {string} dayZhi - 日支值
 * @returns {boolean} 是否有效
 */
export const validateDayGanInput = (value, dayZhi) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  if (!dayZhi) {
    return ALL_GANS.includes(value);
  } else if (YANG_ZHIS.includes(dayZhi)) {
    return YANG_GANS.includes(value);
  } else if (YIN_ZHIS.includes(dayZhi)) {
    return YIN_GANS.includes(value);
  }
  return false;
};

/**
 * 验证日支输入
 * @param {string} value - 输入值
 * @param {string} dayGan - 日干值
 * @returns {boolean} 是否有效
 */
export const validateDayZhiInput = (value, dayGan) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  if (!dayGan) {
    return ALL_ZHIS.includes(value);
  } else if (YANG_GANS.includes(dayGan)) {
    return YANG_ZHIS.includes(value);
  } else if (YIN_GANS.includes(dayGan)) {
    return YIN_ZHIS.includes(value);
  }
  return false;
};

/**
 * 验证月支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateMonthZhiInput = (value) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  return ALL_ZHIS.includes(value);
};

/**
 * 验证时支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateHourZhiInput = (value) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true;
  }
  
  return ALL_ZHIS.includes(value);
};

/**
 * 根据年干和月支计算月干（五虎遁规则）
 * @param {string} yearGan - 年干
 * @param {string} monthZhi - 月支
 * @returns {string} 月干
 */
export const calculateMonthGan = (yearGan, monthZhi) => {
  // 五虎遁月干表：年干 -> 月支 -> 月干
  const wuhuDunTable = {
    '甲': {
      '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己', '午': '庚', '未': '辛',
      '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙', '子': '丙', '丑': '丁'
    },
    '乙': {
      '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛', '午': '壬', '未': '癸',
      '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁', '子': '戊', '丑': '己'
    },
    '丙': {
      '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸', '午': '甲', '未': '乙',
      '申': '丙', '酉': '丁', '戌': '戊', '亥': '己', '子': '庚', '丑': '辛'
    },
    '丁': {
      '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙', '午': '丙', '未': '丁',
      '申': '戊', '酉': '己', '戌': '庚', '亥': '辛', '子': '壬', '丑': '癸'
    },
    '戊': {
      '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁', '午': '戊', '未': '己',
      '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸', '子': '甲', '丑': '乙'
    },
    '己': {
      '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己', '午': '庚', '未': '辛',
      '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙', '子': '丙', '丑': '丁'
    },
    '庚': {
      '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛', '午': '壬', '未': '癸',
      '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁', '子': '戊', '丑': '己'
    },
    '辛': {
      '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸', '午': '甲', '未': '乙',
      '申': '丙', '酉': '丁', '戌': '戊', '亥': '己', '子': '庚', '丑': '辛'
    },
    '壬': {
      '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙', '午': '丙', '未': '丁',
      '申': '戊', '酉': '己', '戌': '庚', '亥': '辛', '子': '壬', '丑': '癸'
    },
    '癸': {
      '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁', '午': '戊', '未': '己',
      '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸', '子': '甲', '丑': '乙'
    }
  };
  
  // 查找对应月干
  if (yearGan && monthZhi && wuhuDunTable[yearGan] && wuhuDunTable[yearGan][monthZhi]) {
    return wuhuDunTable[yearGan][monthZhi];
  }
  
  return '';
};

/**
 * 根据日干和时支计算时干（五鼠遁规则）
 * @param {string} dayGan - 日干
 * @param {string} hourZhi - 时支
 * @returns {string} 时干
 */
export const calculateHourGan = (dayGan, hourZhi) => {
  // 五鼠遁时干表：日干 -> 时支 -> 时干
  // 正确规则：甲、己日子时起甲；乙、庚子时起丙；丙、辛日子时起戊；丁、壬日子时起庚；戊、癸日子时起壬
  const wushuDunTable = {
    '甲': {
      '子': '甲', '丑': '乙', '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己',
      '午': '庚', '未': '辛', '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙'
    },
    '乙': {
      '子': '丙', '丑': '丁', '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛',
      '午': '壬', '未': '癸', '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁'
    },
    '丙': {
      '子': '戊', '丑': '己', '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸',
      '午': '甲', '未': '乙', '申': '丙', '酉': '丁', '戌': '戊', '亥': '己'
    },
    '丁': {
      '子': '庚', '丑': '辛', '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙',
      '午': '丙', '未': '丁', '申': '戊', '酉': '己', '戌': '庚', '亥': '辛'
    },
    '戊': {
      '子': '壬', '丑': '癸', '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁',
      '午': '戊', '未': '己', '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸'
    },
    '己': {
      '子': '甲', '丑': '乙', '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己',
      '午': '庚', '未': '辛', '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙'
    },
    '庚': {
      '子': '丙', '丑': '丁', '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛',
      '午': '壬', '未': '癸', '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁'
    },
    '辛': {
      '子': '戊', '丑': '己', '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸',
      '午': '甲', '未': '乙', '申': '丙', '酉': '丁', '戌': '戊', '亥': '己'
    },
    '壬': {
      '子': '庚', '丑': '辛', '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙',
      '午': '丙', '未': '丁', '申': '戊', '酉': '己', '戌': '庚', '亥': '辛'
    },
    '癸': {
      '子': '壬', '丑': '癸', '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁',
      '午': '戊', '未': '己', '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸'
    }
  };
  
  // 查找对应时干
  if (dayGan && hourZhi && wushuDunTable[dayGan] && wushuDunTable[dayGan][hourZhi]) {
    return wushuDunTable[dayGan][hourZhi];
  }
  
  return '';
};

/**
 * 验证四柱组合是否有效
 * @param {Object} fourPillars - 四柱数据
 * @returns {boolean} 是否有效
 */
export const validateFourPillars = (fourPillars) => {
  const { yearGan, monthGan, dayGan, hourGan, yearZhi, monthZhi, dayZhi, hourZhi } = fourPillars;
  
  // 验证所有天干是否有效
  const gansValid = [yearGan, monthGan, dayGan, hourGan].every(gan => 
    gan === '' || validateGanInput(gan)
  );
  
  // 验证所有地支是否有效
  const zhisValid = [yearZhi, monthZhi, dayZhi, hourZhi].every(zhi => 
    zhi === '' || validateZhiInput(zhi)
  );
  
  return gansValid && zhisValid;
};

/**
 * 格式化四柱数据
 * @param {Object} fourPillars - 四柱数据
 * @returns {Object} 格式化后的四柱数据
 */
export const formatFourPillars = (fourPillars) => {
  return {
    yearGan: fourPillars.yearGan || '',
    monthGan: fourPillars.monthGan || '',
    dayGan: fourPillars.dayGan || '',
    hourGan: fourPillars.hourGan || '',
    yearZhi: fourPillars.yearZhi || '',
    monthZhi: fourPillars.monthZhi || '',
    dayZhi: fourPillars.dayZhi || '',
    hourZhi: fourPillars.hourZhi || ''
  };
};
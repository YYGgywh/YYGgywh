/*
 * @file            frontend/src/services/liuyaoService.js
 * @description     六爻起卦服务，封装API请求和数据处理逻辑，包括随机数字生成、爻位计算、排盘等功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-08 12:00
 * @lastModified    2026-03-28 19:43:52
 * Copyright © All rights reserved
*/

/**
 * 六爻起卦服务类
 * 封装所有与六爻起卦相关的API请求和数据处理
 */
class LiuYaoService {
  // 定义爻位顺序数组，从初爻到上爻
  static YAO_ORDER = ['初', '二', '三', '四', '五', '上'];
  // 定义爻位顺序对应的键名数组，用于数据存储
  static YAO_ORDER_KEYS = ['chu', 'er', 'san', 'si', 'wu', 'shang'];
  
  // 定义按钮状态到三位数字的映射关系
  static BUTTON_STATE_TO_THREE_DIGITS = {
    'yang': '100', // 阳爻状态对应100
    'yin': '110', // 阴爻状态对应110
    'yang-active': '111', // 阳爻动爻状态对应111
    'yin-active': '000' // 阴爻动爻状态对应000
  };
  
  /**
   * 获取API基础URL
   * 优先使用环境变量，其次使用当前页面主机地址，最后使用默认本地地址
   * @returns {string} API基础URL
   */
  static getApiBaseUrl() {
    // 获取当前页面信息
    const { protocol, hostname, host } = window.location;
    
    console.log('[LiuYaoService] 当前页面地址:', window.location.href);
    console.log('[LiuYaoService] 当前主机名:', hostname);
    console.log('[LiuYaoService] 环境变量 REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
    
    // 1. 如果当前页面不是localhost，使用当前主机地址（支持局域网访问）
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const apiUrl = `${protocol}//${hostname}:8000`;
      console.log('[LiuYaoService] 使用局域网地址:', apiUrl);
      return apiUrl;
    }
    
    // 2. 优先使用环境变量（如果是localhost访问）
    if (process.env.REACT_APP_API_BASE_URL) {
      console.log('[LiuYaoService] 使用环境变量:', process.env.REACT_APP_API_BASE_URL);
      return process.env.REACT_APP_API_BASE_URL;
    }
    
    // 3. 默认使用本地地址
    console.log('[LiuYaoService] 使用默认本地地址: http://localhost:8000');
    return 'http://localhost:8000';
  }
  
  /**
   * 生成三位随机数字
   * @returns {Promise<Object>} 三位随机数字结果
   */
  static async generateRandomThreeDigits() {
    try {
      const apiBaseUrl = this.getApiBaseUrl();
      const requestUrl = `${apiBaseUrl}/api/v1/random/three-digits`;
      console.log('[LiuYaoService] 发起请求:', requestUrl);
      
      const response = await fetch(requestUrl);
      const data = await response.json();
      
      return data.data || data;
    }
    catch (error) {
      console.error('[LiuYaoService] 生成三位随机数字失败:', error);
      
      throw error;
    }
  }

  /**
   * 一键生成六个随机数字
   * @returns {Promise<Array>} 六个随机数字的数组
   */
  static async generateSixDigits() {
    const digitsArray = [];
    for (let i = 0; i < 6; i++) {
      const result = await this.generateRandomThreeDigits();
      if (result.three_digits) {
        digitsArray.push(result.three_digits);
      }
    }
    
    return digitsArray;
  }

  /**
   * 根据数字数组计算爻位数据
   * @param {Array} digitsArray 六位数字数组
   * @returns {Object} 爻位数据对象
   */
  static calculateYaoDataFromDigits(digitsArray) {
    const yaoOrder = this.YAO_ORDER;
    
    const yaoValues = {};
    const yaoOddCounts = {};
    
    yaoOrder.forEach((yaoName, index) => {
      if (index < digitsArray.length) {
        const threeDigits = digitsArray[index];
        const oddCount = this.calculateOddCount(threeDigits);
        const parityStr = this.calculateParityStr(threeDigits);
        const yaoKey = this.YAO_ORDER_KEYS[index];
        
        yaoValues[yaoKey] = parityStr;
        yaoOddCounts[yaoKey] = oddCount;
      }
    });
    
    return { yaoValues, yaoOddCounts };
  }

  /**
   * 计算奇数个数
   * @param {number} threeDigits 三位数字
   * @returns {number} 奇数个数
   */
  static calculateOddCount(threeDigits) {
    const digits = threeDigits.toString().split('').map(Number);
    
    return digits.filter(d => d % 2 === 1).length;
  }

  /**
   * 计算奇偶字符串
   * @param {number} threeDigits 三位数字
   * @returns {string} 奇偶字符串
   */
  static calculateParityStr(threeDigits) {
    const digits = threeDigits.toString().split('').map(Number);
    
    return digits.map(d => d % 2 === 1 ? '正' : '背').join('');
  }

  /**
   * 处理单个爻位的数据更新
   * @param {Object} yaoValues 当前爻值状态
   * @param {Object} yaoOddCounts 当前爻奇数个数状态
   * @param {string} yaoKey 爻位键名
   * @param {Object} resultData API返回的数据
   * @returns {Object} 更新后的状态对象
   */
  static processYaoData(yaoValues, yaoOddCounts, yaoKey, resultData) {
    const updatedYaoValues = { ...yaoValues };
    const updatedYaoOddCounts = { ...yaoOddCounts };

    if (resultData.parity_str) {
      updatedYaoValues[yaoKey] = resultData.parity_str;
    }

    if (resultData.odd_count !== undefined) {
      updatedYaoOddCounts[yaoKey] = resultData.odd_count;
    }

    return {
      yaoValues: updatedYaoValues,
      yaoOddCounts: updatedYaoOddCounts
    };
  }
}

export default LiuYaoService;
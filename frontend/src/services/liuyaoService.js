/*
 * @file            frontend/src/services/liuyaoService.js
 * @description     六爻起卦服务，封装API请求和数据处理逻辑，包括随机数字生成、爻位计算、排盘等功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-08 12:00
 * @lastModified    2026-02-19 19:09:36
 * Copyright © All rights reserved
*/

/**
 * 六爻起卦服务类
 * 封装所有与六爻起卦相关的API请求和数据处理
 */
class LiuYaoService {
  static API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // 定义API基础URL，优先使用环境变量，否则使用默认的本地地址
  static YAO_ORDER = ['初', '二', '三', '四', '五', '上']; // 定义爻位顺序数组，从初爻到上爻
  static YAO_ORDER_KEYS = ['chu', 'er', 'san', 'si', 'wu', 'shang']; // 定义爻位顺序对应的键名数组，用于数据存储
  // 定义按钮状态到三位数字的映射关系
  static BUTTON_STATE_TO_THREE_DIGITS = {
    'yang': '100', // 阳爻状态对应100
    'yin': '110', // 阴爻状态对应110
    'yang-active': '111', // 阳爻动爻状态对应111
    'yin-active': '000' // 阴爻动爻状态对应000
  };
  
  /**
   * 生成三位随机数字
   * @returns {Promise<Object>} 三位随机数字结果
   */
  static async generateRandomThreeDigits() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/v1/random/three-digits`); // 发送GET请求到后端API，生成三位随机数字
      const data = await response.json(); // 解析响应数据为JSON格式
      
      return data.data || data; // 返回数据中的data字段，如果不存在则直接返回data
    }
    // 捕获并处理其他异常
    catch (error) {
      console.error('生成三位随机数字失败:', error); // 捕获并打印错误信息
      
      throw error; // 重新抛出错误，让调用者处理
    }
  }

  /**
   * 一键生成六个随机数字
   * @returns {Promise<Array>} 六个随机数字的数组
   */
  static async generateSixDigits() {
    const digitsArray = []; // 初始化空数组，用于存储六个三位数字
    // 循环六次，每次生成一个三位数字
    for (let i = 0; i < 6; i++) {
      const result = await this.generateRandomThreeDigits(); // 调用generateRandomThreeDigits方法生成三位数字
      // 如果结果中包含three_digits字段，则将其添加到数组中
      if (result.three_digits) {
        digitsArray.push(result.three_digits); // 将三位数字添加到数组中
      }
    }
    
    return digitsArray; // 返回包含六个三位数字的数组
  }

  /**
   * 根据数字数组计算爻位数据
   * @param {Array} digitsArray 六位数字数组
   * @returns {Object} 爻位数据对象
   */
  static calculateYaoDataFromDigits(digitsArray) {
    const yaoOrder = this.YAO_ORDER; // 获取爻位顺序数组
    
    const yaoValues = {}; // 初始化爻值对象
    const yaoOddCounts = {}; // 初始化爻奇数个数对象
    
    // 遍历爻位顺序数组
    yaoOrder.forEach((yaoName, index) => {
      // 检查索引是否在数字数组范围内
      if (index < digitsArray.length) {
        const threeDigits = digitsArray[index]; // 获取当前爻位的三位数字
        const oddCount = this.calculateOddCount(threeDigits); // 计算该三位数字中奇数的个数
        const parityStr = this.calculateParityStr(threeDigits); // 计算该三位数字的奇偶字符串（正/背）
        const yaoKey = this.YAO_ORDER_KEYS[index]; // 根据索引获取对应的键名
        
        yaoValues[yaoKey] = parityStr; // 将奇偶字符串存储到爻值对象中
        yaoOddCounts[yaoKey] = oddCount; // 将奇数个数存储到爻奇数个数对象中
      }
    });
    
    return { yaoValues, yaoOddCounts }; // 返回爻值和爻奇数个数对象
  }

  /**
   * 计算奇数个数
   * @param {number} threeDigits 三位数字
   * @returns {number} 奇数个数
   */
  static calculateOddCount(threeDigits) {
    const digits = threeDigits.toString().split('').map(Number); // 将三位数字转换为字符串，然后分割成单个数字的数组
    
    return digits.filter(d => d % 2 === 1).length; // 过滤出奇数，返回奇数的个数
  }

  /**
   * 计算奇偶字符串
   * @param {number} threeDigits 三位数字
   * @returns {string} 奇偶字符串
   */
  static calculateParityStr(threeDigits) {
    const digits = threeDigits.toString().split('').map(Number); // 将三位数字转换为字符串，然后分割成单个数字的数组
    
    return digits.map(d => d % 2 === 1 ? '正' : '背').join(''); // 将每个数字转换为'正'（奇数）或'背'（偶数），然后连接成字符串
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
    const updatedYaoValues = { ...yaoValues }; // 复制当前的爻值对象
    const updatedYaoOddCounts = { ...yaoOddCounts }; // 复制当前的爻奇数个数对象

    // 更新爻值
    if (resultData.parity_str) {
      updatedYaoValues[yaoKey] = resultData.parity_str; // 如果API返回的数据中包含parity_str字段，则更新对应的爻值
    }

    // 更新奇数个数
    if (resultData.odd_count !== undefined) {
      updatedYaoOddCounts[yaoKey] = resultData.odd_count; // 如果API返回的数据中包含odd_count字段，则更新对应的奇数个数
    }

    // 返回更新后的爻值和爻奇数个数对象
    return {
      yaoValues: updatedYaoValues, // 返回更新后的爻值对象
      yaoOddCounts: updatedYaoOddCounts // 返回更新后的爻奇数个数对象
    };
  }
}

export default LiuYaoService; // 导出LiuYaoService类作为默认导出
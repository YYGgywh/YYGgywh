// 路径:src/services/liuyaoService.js 时间:2026-02-08 12:00
// 功能:六爻起卦服务，封装API请求和数据处理逻辑

/**
 * 六爻起卦服务类
 * 封装所有与六爻起卦相关的API请求和数据处理
 */
class LiuYaoService {
  static API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  /**
   * 生成单个随机数字
   * @returns {Promise<Object>} 随机数字结果
   */
  static async generateRandomDigit() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/v1/random/digit`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('生成随机数字失败:', error);
      throw error;
    }
  }

  /**
   * 生成三位随机数字
   * @returns {Promise<Object>} 三位随机数字结果
   */
  static async generateRandomThreeDigits() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/v1/random/three-digits`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('生成三位随机数字失败:', error);
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
   * 处理排盘逻辑
   * @param {Array} digitsArray 六位数字数组
   * @returns {Promise<Object>} 排盘结果
   */
  static async performDivination(digitsArray) {
    // 这里可以添加排盘逻辑，或者调用后端排盘API
    console.log('执行排盘，使用数字:', digitsArray);
    console.log('数字数组长度:', digitsArray.length);
    
    // 计算爻位数据
    const yaoData = this.calculateYaoDataFromDigits(digitsArray);
    
    // 示例：返回模拟排盘结果
    return {
      success: true,
      data: {
        digits: digitsArray,
        timestamp: new Date().toISOString(),
        yaoValues: yaoData.yaoValues,
        yaoOddCounts: yaoData.yaoOddCounts
      }
    };
  }

  /**
   * 根据数字数组计算爻位数据
   * @param {Array} digitsArray 六位数字数组
   * @returns {Object} 爻位数据对象
   */
  static calculateYaoDataFromDigits(digitsArray) {
    const yaoOrder = ['初', '二', '三', '四', '五', '上'];
    const yaoKeyMap = this.getYaoKeyMap();
    
    const yaoValues = {};
    const yaoOddCounts = {};
    
    yaoOrder.forEach((yaoName, index) => {
      if (index < digitsArray.length) {
        const threeDigits = digitsArray[index];
        const oddCount = this.calculateOddCount(threeDigits);
        const parityStr = this.calculateParityStr(threeDigits);
        
        const yaoKey = yaoKeyMap[yaoName];
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
   * 获取爻位映射
   * @returns {Object} 爻位映射对象
   */
  static getYaoKeyMap() {
    return {
      '初': 'chu',
      '二': 'er',
      '三': 'san',
      '四': 'si',
      '五': 'wu',
      '上': 'shang'
    };
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

    // 更新爻值
    if (resultData.parity_str) {
      updatedYaoValues[yaoKey] = resultData.parity_str;
    }

    // 更新奇数个数
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
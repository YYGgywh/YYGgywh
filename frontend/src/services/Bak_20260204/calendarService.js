// 路径:src/services/calendarService.js 时间:2026-02-01 15:12
// 功能:提供历法转换服务，包括农历转公历、公历转农历和获取当前农历信息
// 技术依赖:lunar-javascript 库

import { Lunar, Solar, LunarMonth, LunarYear, SolarUtil } from 'lunar-javascript';

/**
 * 日历服务类
 * 提供历法转换相关的静态方法，包括农历转公历、公历转农历和获取当前农历信息
 */
class CalendarService {
  /**
   * 农历转公历
   * @param {Object} lunarData 农历数据
   * @param {number} lunarData.lunar_year 农历年份
   * @param {number} lunarData.lunar_month 农历月份
   * @param {number} lunarData.lunar_day 农历日期
   * @param {number} lunarData.hour 小时
   * @param {number} lunarData.minute 分钟
   * @param {number} lunarData.second 秒
   * @param {boolean} lunarData.is_leap_month 是否为闰月
   * @returns {Object} 转换结果，包含农历和公历信息
   * @example
   * // 示例调用
   * const result = CalendarService.convertLunarToSolar({
   *   lunar_year: 2024,
   *   lunar_month: 1,
   *   lunar_day: 1,
   *   hour: 10,
   *   minute: 30,
   *   second: 0,
   *   is_leap_month: false
   * });
   */
  static convertLunarToSolar(lunarData) {
    try {
      // 解构获取农历数据
      const { lunar_year, lunar_month, lunar_day, hour, minute, second, is_leap_month } = lunarData;
      
      // 创建农历对象
      // 注意：lunar-javascript 库使用负数表示闰月
      const lunar = Lunar.fromYmdHms(
        parseInt(lunar_year), // 转换为整数
        is_leap_month ? -parseInt(lunar_month) : parseInt(lunar_month), // 闰月处理
        parseInt(lunar_day), // 转换为整数
        parseInt(hour || 0), // 转换为整数，默认为 0
        parseInt(minute || 0), // 转换为整数，默认为 0
        parseInt(second || 0) // 转换为整数，默认为 0
      );
      
      // 转换为公历对象
      const solar = lunar.getSolar();
      
      // 返回转换结果
      return {
        success: true,
        data: {
          lunar_year_in_GanZhi: lunar.getYearInGanZhi(), // 年干支
          lunar_month_in_Chinese: lunar.getMonthInChinese(), // 农历月
          lunar_day_in_Chinese: lunar.getDayInChinese(), // 农历日
          lunar_time_Zhi: lunar.getTimeZhi(), // 时辰
          solar_year: solar.getYear(), // 公历年
          solar_month: solar.getMonth(), // 公历月
          solar_day: solar.getDay(), // 公历日
          solar_hour: solar.getHour(), // 小时
          solar_minute: solar.getMinute(), // 分钟
          solar_second: solar.getSecond() // 秒
        }
      };
    } catch (error) {
      // 捕获并处理错误
      console.error('农历转公历失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 公历转农历
   * @param {Object} solarData 公历数据
   * @param {number} solarData.year 公历年份
   * @param {number} solarData.month 公历月份
   * @param {number} solarData.day 公历日期
   * @param {number} solarData.hour 小时
   * @param {number} solarData.minute 分钟
   * @param {number} solarData.second 秒
   * @returns {Object} 转换结果，包含农历信息
   * @example
   * // 示例调用
   * const result = CalendarService.convertSolarToLunar({
   *   year: 2024,
   *   month: 2,
   *   day: 10,
   *   hour: 10,
   *   minute: 30,
   *   second: 0
   * });
   */
  static convertSolarToLunar(solarData) {
    try {
      // 解构获取公历数据
      const { year, month, day, hour, minute, second } = solarData;
      
      // 创建公历对象
      const solar = Solar.fromYmdHms(
        parseInt(year), // 转换为整数
        parseInt(month), // 转换为整数
        parseInt(day), // 转换为整数
        parseInt(hour || 0), // 转换为整数，默认为 0
        parseInt(minute || 0), // 转换为整数，默认为 0
        parseInt(second || 0) // 转换为整数，默认为 0
      );
      
      // 转换为农历对象
      const lunar = solar.getLunar();
      
      // 返回转换结果
      return {
        success: true,
        data: {
          lunar_year_in_GanZhi: lunar.getYearInGanZhi(), // 年干支
          lunar_month_in_Chinese: lunar.getMonthInChinese(), // 农历月
          lunar_day_in_Chinese: lunar.getDayInChinese(), // 农历日
          lunar_time_Zhi: lunar.getTimeZhi() // 时辰
        }
      };
    } catch (error) {
      // 捕获并处理错误
      console.error('公历转农历失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取当前时间的农历信息
   * @returns {Object} 当前时间信息
   * @example
   * // 示例调用
   * const result = CalendarService.getCurrentLunarInfo();
   */
  static getCurrentLunarInfo() {
    // 获取当前系统时间
    const now = new Date();
    
    // 调用公历转农历方法获取当前时间的农历信息
    return this.convertSolarToLunar({
      year: now.getFullYear(), // 当前年份
      month: now.getMonth() + 1, // 当前月份（注意：getMonth() 返回 0-11，需要加 1）
      day: now.getDate(), // 当前日期
      hour: now.getHours(), // 当前小时
      minute: now.getMinutes(), // 当前分钟
      second: now.getSeconds() // 当前秒
    });
  }

  /**
   * 获取阴历月信息
   * @param {number} lunarYear 阴历年
   * @param {number} lunarMonth 阴历月（1-12，闰月为负数，如闰2月为-2）
   * @returns {Object} 阴历月信息，包含当月天数
   * @example
   * // 示例调用 - 普通月份
   * const result1 = CalendarService.getLunarMonthInfo(2024, 1);
   * 
   * // 示例调用 - 闰月
   * const result2 = CalendarService.getLunarMonthInfo(2024, -2); // 闰2月
   */
  static getLunarMonthInfo(lunarYear, lunarMonth) {
    try {
      // 创建阴历月对象
      const lunarMonthObj = LunarMonth.fromYm(
        parseInt(lunarYear), // 转换为整数
        parseInt(lunarMonth) // 转换为整数（注意：负数表示闰月）
      );
      
      // 返回阴历月信息
      return {
        success: true,
        data: {
          // lunar_year: lunarMonthObj.getYear(), // 阴历年
          // lunar_month: lunarMonthObj.getMonth(), // 阴历月（正数）
          // is_leap_month: lunarMonthObj.isLeap(), // 是否为闰月
          lunar_month_days: lunarMonthObj.getDayCount(), // 当月天数
          // lunar_month_in_chinese: lunarMonthObj.getMonthInChinese() // 农历月中文名称
        }
      };
    } catch (error) {
      // 捕获并处理错误
      console.error('获取阴历月信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取阴历年信息
   * @param {number} lunarYear 阴历年
   * @returns {Object} 阴历年信息，包含是否有闰月、闰月月份等
   * @example
   * // 示例调用
   * const result = CalendarService.getLunarYearInfo(2024);
   */
  static getLunarYearInfo(lunarYear) {
    try {
      // 创建阴历年对象
      const lunarYearObj = LunarYear.fromYear(
        parseInt(lunarYear) // 转换为整数
      );
      
      // 获取闰月（0表示无闰月）
      const leapMonth = lunarYearObj.getLeapMonth();
      
      // 返回阴历年信息
      return {
        success: true,
        data: {
          lunar_year: lunarYearObj.getYear(), // 阴历年
          has_leap_month: leapMonth > 0, // 是否有闰月
          leap_month: leapMonth, // 闰月月份（0表示无闰月）
          day_count: lunarYearObj.getDayCount() // 年天数
        }
      };
    } catch (error) {
      // 捕获并处理错误
      console.error('获取阴历年信息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 通过八字获取阳历列表
   * @param {Object} baZiData 八字数据
   * @param {string} baZiData.yearGanZhi 年柱
   * @param {string} baZiData.monthGanZhi 月柱
   * @param {string} baZiData.dayGanZhi 日柱
   * @param {string} baZiData.timeGanZhi 时柱
   * @param {number} [baZiData.sect=1] 流派，可选1或2
   * @param {number} [baZiData.baseYear=1] 起始年份
   * @returns {Object} 转换结果，包含匹配的阳历列表
   * @example
   * // 示例调用
   * const result = CalendarService.getSolarFromBaZi({
   *   yearGanZhi: '甲辰',
   *   monthGanZhi: '丙寅',
   *   dayGanZhi: '甲子',
   *   timeGanZhi: '甲子',
   *   sect: 1,
   *   baseYear: 1
   * });
   */
  static getSolarFromBaZi(baZiData) {
    try {
      // 解构获取八字数据，设置默认值
      const {
        yearGanZhi,
        monthGanZhi,
        dayGanZhi,
        timeGanZhi,
        sect = 1, // 默认流派为1
        baseYear = 1 // 默认起始年份为1
      } = baZiData;
      
      // 通过八字获取阳历列表
      const solarList = Solar.fromBaZi(
        yearGanZhi,
        monthGanZhi,
        dayGanZhi,
        timeGanZhi,
        sect,
        baseYear
      );
      
      // 获取当前时间的分、秒值
      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      
      // 处理返回结果，转换为标准格式，使用当前的分、秒值
      const formattedSolarList = solarList.map(solar => ({
        solar_year: solar.getYear(),
        solar_month: solar.getMonth(),
        solar_day: solar.getDay(),
        solar_hour: solar.getHour(),
        solar_minute: currentMinute, // 使用当前的分钟值
        solar_second: currentSecond // 使用当前的秒值
      }));
      
      // 返回转换结果
      return {
        success: true,
        data: {
          solar_list: formattedSolarList,
          total_count: formattedSolarList.length
        }
      };
    } catch (error) {
      // 捕获并处理错误
      console.error('通过八字获取阳历列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取阳历某月的天数
   * @param {number} year 阳历年(数字)
   * @param {number} month 阳历月(数字)
   * @returns {number} 当月天数
   * @example
   * // 示例调用
   * const days = CalendarService.getDaysInMonth(2024, 2);
   * console.log('2024年2月有', days, '天');
   */
  static getDaysInMonth(year, month) {
    try {
      // 调用 SolarUtil.getDaysOfMonth 获取当月天数
      const solar_month_days = SolarUtil.getDaysOfMonth(
        parseInt(year), // 转换为整数
        parseInt(month) // 转换为整数
      );
      
      // 返回天数
      return solar_month_days;
    } catch (error) {
      // 捕获并处理错误
      console.error('获取阳历某月天数失败:', error);
      return 0; // 错误时返回 0
    }
  }
}

// 导出日历服务类
export default CalendarService;
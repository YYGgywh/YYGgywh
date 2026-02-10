// 路径:src/services/calendarService.js 时间:2026-02-06 10:00
// 功能:提供历法转换服务

import { Lunar, Solar, LunarMonth, LunarYear, SolarUtil, LunarUtil } from 'lunar-javascript';

/**
 * 历法服务类
 * 提供阳历和农历之间的转换，以及获取详细历法信息的功能
 */
class CalendarService {
  /**
   * 获取完整的历法信息
   * @param {Object} timeData - 时间数据对象，可以是阳历或农历
   * @returns {Object} 包含所有历法信息的对象
   */
  static getFullCalendarInfo(timeData) {
    try {      
      const isSolar = timeData.hasOwnProperty('year') && timeData.hasOwnProperty('month') && timeData.hasOwnProperty('day');// 检查是否为阳历数据（包含年、月、日字段）      
      const isLunar = timeData.hasOwnProperty('lunar_year') && timeData.hasOwnProperty('lunar_month') && timeData.hasOwnProperty('lunar_day');// 检查是否为农历数据（包含lunar_year、lunar_month、lunar_day字段）
      
      // 如果既不是阳历也不是农历数据，抛出错误
      if (!isSolar && !isLunar) {
        throw new Error('无效的时间数据格式：必须包含年、月、日信息');
      }      
      
      let solar, lunar;// 声明阳历和农历对象变量
      
      // 如果是阳历数据
      if (isSolar) {
        // 使用阳历数据创建阳历对象
        solar = Solar.fromYmdHms(
          parseInt(timeData.year), // 年份
          parseInt(timeData.month), // 月份
          parseInt(timeData.day), // 日期
          parseInt(timeData.hour || 0), // 小时，默认为0
          parseInt(timeData.minute || 0), // 分钟，默认为0
          parseInt(timeData.second || 0) // 秒钟，默认为0
        );
        // 从阳历对象获取对应的农历对象
        lunar = solar.getLunar();
      } else {
        // 如果是农历数据，处理闰月情况（闰月用负数表示）
        const lunarMonth = timeData.is_leap_month ? -parseInt(timeData.lunar_month) : parseInt(timeData.lunar_month);
        // 使用农历数据创建农历对象
        lunar = Lunar.fromYmdHms(
          parseInt(timeData.lunar_year), // 农历年
          lunarMonth, // 农历月（闰月为负数）
          parseInt(timeData.lunar_day), // 农历日
          parseInt(timeData.hour || 0), // 小时，默认为0
          parseInt(timeData.minute || 0), // 分钟，默认为0
          parseInt(timeData.second || 0) // 秒钟，默认为0
        );
        solar = lunar.getSolar();// 从农历对象获取对应的阳历对象
      }
            
      const lunarYear = LunarYear.fromYear(lunar.getYear());// 创建农历年对象，用于获取年相关信息      
      const lunarMonth = LunarMonth.fromYm(lunar.getYear(), lunar.getMonth());// 创建农历月对象，用于获取月相关信息
      
      // 返回包含所有历法信息的对象
      return {
        success: true, // 操作成功标志
        data: {
          inputType: isSolar ? 'solar' : 'lunar', // 输入类型（阳历或农历）
          // 阳历信息
          solar: {
            year: solar.getYear(), // 阳历年
            month: solar.getMonth(), // 阳历月
            day: solar.getDay(), // 阳历日
            hour: solar.getHour(), // 小时
            minute: solar.getMinute(), // 分钟
            second: solar.getSecond(), // 秒钟
            // week: solar.getWeek(), // 星期（数字）
            // weekChinese: solar.getWeekInChinese(), // 星期（中文）
            // isLeapYear: solar.isLeapYear(), // 是否为闰年
            // festivals: solar.getFestivals(), // 阳历节日
            // otherFestivals: solar.getOtherFestivals() // 其他阳历节日
          },
          // 农历信息
          lunar: {
            // year: lunar.getYear(), // 农历年
            // month: lunar.getMonth(), // 农历月
            // day: lunar.getDay(), // 农历日
            // hour: lunar.getHour(), // 小时
            // minute: lunar.getMinute(), // 分钟
            // second: lunar.getSecond(), // 秒钟
            yearInGanZhi: lunar.getYearInGanZhi(), // 农历年干支（新年以正月初一起算）
            // yearInChinese: lunar.getYearInChinese(), // 农历年中文
            monthInChinese: lunar.getMonthInChinese(), // 农历月中文
            dayInChinese: lunar.getDayInChinese(), // 农历日中文
            timeZhi: lunar.getTimeZhi(), // 时辰（支）
            // yearShengXiao: lunar.getYearShengXiao(), // 年的生肖（以正月初一起）
            // festivals: lunar.getFestivals(), // 农历节日
            // otherFestivals: lunar.getOtherFestivals() // 其他农历节日
          },
          // 农历年信息
          lunarYear: {
            year: lunarYear.getYear(), // 农历年
            leapMonth: lunarYear.getLeapMonth(), // 闰月（0表示无闰月）
            hasLeapMonth: lunarYear.getLeapMonth() > 0, // 是否有闰月
            dayCount: lunarYear.getDayCount() // 农历年总天数
          },
          lunarMonth: { // 农历月信息
            year: lunarMonth.getYear(), // 农历年
            month: lunarMonth.getMonth(), // 农历月
            isLeap: lunarMonth.isLeap(), // 是否为闰月
            dayCount: lunarMonth.getDayCount() // 农历月天数
          },
          ganzhi: { // 干支信息
            year: lunar.getYearInGanZhiByLiChun(), // 年干支（新年以立春零点起算）
            month: lunar.getMonthInGanZhiExact(), // 月干支（新的一月以节交接准确时刻起算）
            day: lunar.getDayInGanZhiExact(), // 日干支（流派1，晚子时日柱算明天）
            time: lunar.getTimeInGanZhi() // 时干支
          },
          jieqi: { // 节气信息
            prevJie: { // 上一个节
              name: lunar.getPrevJie().getName(), // 节气名称
              time: lunar.getPrevJie().getSolar().toYmdHms() // 节气时间
            },
            nextJie: { // 下一个节
              name: lunar.getNextJie().getName(), // 节气名称
              time: lunar.getNextJie().getSolar().toYmdHms() // 节气时间
            },
            prevQi: { // 上一个气
              name: lunar.getPrevQi().getName(), // 节气名称
              time: lunar.getPrevQi().getSolar().toYmdHms() // 节气时间
            },
            nextQi: { // 下一个气
              name: lunar.getNextQi().getName(), // 节气名称
              time: lunar.getNextQi().getSolar().toYmdHms() // 节气时间
            }
          }
        }
      };
    } catch (error) {
      // 捕获并打印错误
      console.error('获取完整历法信息失败:', error);
      // 返回错误信息
      return {
        success: false, // 操作失败标志
        error: error.message // 错误消息
      };
    }
  }

  /**
   * 将阳历时间转换为农历
   * @param {Object} solarData - 阳历时间数据
   * @returns {Object} 包含农历信息的对象
   */
  static convertSolarToLunar(solarData) {
    try {
      const { year, month, day, hour = 0, minute = 0, second = 0 } = solarData;
      
      // 创建阳历对象
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
      // 获取农历对象
      const lunar = solar.getLunar();
      
      // 返回转换结果
      return {
        success: true,
        data: {
          lunar_year_in_GanZhi: lunar.getYearInGanZhi(),
          lunar_month_in_Chinese: lunar.getMonthInChinese(),
          lunar_day_in_Chinese: lunar.getDayInChinese(),
          lunar_time_Zhi: lunar.getTimeZhi(),
          solar_year: solar.getYear(),
          solar_month: solar.getMonth(),
          solar_day: solar.getDay(),
          solar_hour: solar.getHour(),
          solar_minute: solar.getMinute(),
          solar_second: solar.getSecond()
        }
      };
    } catch (error) {
      console.error('阳历转农历失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 将农历时间转换为阳历
   * @param {Object} lunarData - 农历时间数据
   * @returns {Object} 包含阳历信息的对象
   */
  static convertLunarToSolar(lunarData) {
    try {
      const { lunar_year, lunar_month, lunar_day, hour = 0, minute = 0, second = 0, is_leap_month = false } = lunarData;
      
      // 处理闰月情况（闰月用负数表示）
      const month = is_leap_month ? -lunar_month : lunar_month;
      
      // 创建农历对象
      const lunar = Lunar.fromYmdHms(lunar_year, month, lunar_day, hour, minute, second);
      // 获取阳历对象
      const solar = lunar.getSolar();
      
      // 返回转换结果
      return {
        success: true,
        data: {
          lunar_year_in_GanZhi: lunar.getYearInGanZhi(),
          lunar_month_in_Chinese: lunar.getMonthInChinese(),
          lunar_day_in_Chinese: lunar.getDayInChinese(),
          lunar_time_Zhi: lunar.getTimeZhi(),
          solar_year: solar.getYear(),
          solar_month: solar.getMonth(),
          solar_day: solar.getDay(),
          solar_hour: solar.getHour(),
          solar_minute: solar.getMinute(),
          solar_second: solar.getSecond()
        }
      };
    } catch (error) {
      console.error('农历转阳历失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取指定年月的天数
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @returns {number} 天数
   */
  static getDaysInMonth(year, month) {
    try {
      return SolarUtil.getDaysOfMonth(year, month);
    } catch (error) {
      console.error('获取月份天数失败:', error);
      return 31; // 默认值
    }
  }

  /**
   * 根据时、分、秒获取农历时辰
   * @param {number} hour - 小时
   * @param {number} minute - 分钟
   * @param {number} second - 秒
   * @returns {Object} 包含时辰信息的对象
   */
  static getLunarTimeByHms(hour = 0, minute = 0, second = 0) {
    try {
      // 使用当前日期作为基础日期
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 月份从0开始，需要加1
      const day = now.getDate();
      
      // 创建包含完整时间的阳历对象
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
      // 获取农历对象
      const lunar = solar.getLunar();
      
      // 返回时辰信息
      return {
        success: true,
        data: {
          lunar_time_Zhi: lunar.getTimeZhi(),
          solar_hour: solar.getHour(),
          solar_minute: solar.getMinute(),
          solar_second: solar.getSecond()
        }
      };
    } catch (error) {
      console.error('获取农历时辰失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 通过八字（四柱）获取匹配的阳历列表
   * @param {string} yearGanZhi - 年柱（天干地支）
   * @param {string} monthGanZhi - 月柱（天干地支）
   * @param {string} dayGanZhi - 日柱（天干地支）
   * @param {string} timeGanZhi - 时柱（天干地支）
   * @param {number} sect - 流派，可选1或2，默认1
   * @param {number} baseYear - 起始年份，默认1
   * @returns {Object} 包含匹配阳历列表的对象
   */
  static getSolarListByBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect = 1, baseYear = 1) {
    try {
      // 获取当前时间的分、秒值
      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      
      // 调用 Solar.fromBaZi 方法获取匹配的阳历列表
      const solarList = Solar.fromBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect, baseYear);
      
      // 格式化结果，使用当前时间的分、秒值
      const formattedList = solarList.map(solar => {
        // 使用当前的分、秒值
        const minute = currentMinute;
        const second = currentSecond;
        
        // 构建更新后的完整时间字符串
        const fullString = `${String(solar.getYear()).padStart(4, '0')}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')} ${String(solar.getHour()).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        
        return {
          year: solar.getYear(),
          month: solar.getMonth(),
          day: solar.getDay(),
          hour: solar.getHour(),
          minute: minute,
          second: second,
          dateString: solar.toString(),
          fullString: fullString
        };
      });
      
      // 返回结果
      return {
        success: true,
        data: {
          count: formattedList.length,
          list: formattedList,
          sect,
          baseYear
        }
      };
    } catch (error) {
      console.error('通过八字获取阳历列表失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default CalendarService;
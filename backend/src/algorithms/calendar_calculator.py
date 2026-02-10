# backend/src/algorithms/calendar_calculator.py
# 功能：前端传入数据的格式验证器
# 专注于验证公历、农历时间数据的格式规范，严格使用lunar库进行历法验证

from typing import Dict
from lunar_python import Lunar, Solar ,LunarMonth

class CalendarConverter:
    """
    历法数据转换器 - 专注于前端传入数据的格式验证和历法换算
    
    验证规则：
    1. 数据类型必须是整数
    2. 年范围：1~9999
    3. 月范围：公历1~12，农历1~12或-1~-12（闰月）
    4. 日范围：通过lunar库验证实际日期有效性
    5. 时范围：0~23
    6. 分范围：0~59
    7. 秒范围：0~59
    """


    def __init__(self):
        """初始化验证器"""
        pass

# ====== 时间数据格式验证 ======

    # 验证公历输入数据格式
    def validate_solar_input(self, year: int, month: int, day: int, 
                           hour: int = 0, minute: int = 0, second: int = 0) -> Dict:
        """
        验证公历输入数据格式
        
        Args:
            year: 年 (1-9999)
            month: 月 (1-12)
            day: 日 (根据月份验证)
            hour: 时 (0-23)
            minute: 分 (0-59)
            second: 秒 (0-59)
            
        Returns:
            Dict: 验证结果
        """
        # 验证数据类型
        if not all(isinstance(x, int) for x in [year, month, day, hour, minute, second]):
            return {"success": True, "valid": False, "error": "所有参数必须是整数类型"}
        
        # 验证年范围
        if not (1 <= year <= 9999):
            return {"success": True, "valid": False, "error": f"年份范围必须是1-9999，当前值：{year}"}
        
        # 验证月范围
        if not (1 <= month <= 12):
            return {"success": True, "valid": False, "error": f"公历月份范围必须是1-12，当前值：{month}"}
        
        # 验证日范围（基于实际月份天数）
        if not self._is_valid_solar_day(year, month, day):
            return {"success": True, "valid": False, "error": f"无效的公历日期：{year}年{month}月{day}日不存在"}
        
        # 验证时间组件
        time_result = self._is_valid_time_components(hour, minute, second)
        if not time_result["valid"]:
            return time_result
        
        # 使用lunar库验证公历日期有效性（作为额外验证）
        try:
            Solar.fromYmdHms(year, month, day, hour, minute, second)
            return {"success": True, "valid": True}
        except Exception as e:
            return {"success": True, "valid": False, "error": f"无效的公历日期：{str(e)}"}

    # 验证农历输入数据格式
    def validate_lunar_input(self, year: int, month: int, day: int,
                           hour: int = 0, minute: int = 0, second: int = 0) -> Dict:
        """
        验证农历输入数据格式
        
        Args:
            year: 年 (1-9999)
            month: 月 (1-12 或 -1~-12 表示闰月)
            day: 日 (根据月份验证)
            hour: 时 (0-23)
            minute: 分 (0-59)
            second: 秒 (0-59)
            
        Returns:
            Dict: 验证结果
        """
        # 验证数据类型
        if not all(isinstance(x, int) for x in [year, month, day, hour, minute, second]):
            return {"success": True, "valid": False, "error": "所有参数必须是整数类型"}
        
        # 验证年范围
        if not (1 <= year <= 9999):
            return {"success": True, "valid": False, "error": f"年份范围必须是1-9999，当前值：{year}"}
        
        # 验证月范围
        if not (1 <= abs(month) <= 12):
            return {"success": True, "valid": False, "error": f"农历月份范围必须是1-12或-1~-12，当前值：{month}"}
        
        # 验证日范围
        if not (1 <= day <= 30):
            return {"success": True, "valid": False, "error": f"农历日范围必须是1-30，当前值：{day}"}
        
        # 验证时间组件
        time_result = self._is_valid_time_components(hour, minute, second)
        if not time_result["valid"]:
            return time_result
        
        # 验证大小月天数
        lunar_day_result = self._is_valid_lunar_day(year, month, day)
        if not lunar_day_result["valid"]:
            return lunar_day_result
        
        # 使用lunar库验证农历日期有效性
        try:
            # 闰月用负数表示，lunar库需要正数月份
            lunar_month = abs(month)
            lunar_obj = Lunar.fromYmdHms(year, lunar_month, day, hour, minute, second)
            
            # 额外验证：检查实际日期是否有效
            actual_day = lunar_obj.getDay()
            if actual_day != day:
                return {"success": True, "valid": False, "error": f"无效的农历日期：{year}年{month}月{day}日不存在"}
                
            return {"success": True, "valid": True}
        except Exception as e:
            return {"success": True, "valid": False, "error": f"无效的农历日期：{str(e)}"}

    # 验证公历日期的有效性
    def _is_valid_solar_day(self, year: int, month: int, day: int) -> bool:
        """验证公历日期的有效性"""
        # 验证日范围
        if not (1 <= day <= 31):
            return False
        
        # 验证每个月的天数
        if month in [4, 6, 9, 11]:  # 30天的月份
            return day <= 30
        elif month == 2:  # 2月
            # 闰年判断：能被4整除但不能被100整除，或者能被400整除
            is_leap_year = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
            return day <= 29 if is_leap_year else day <= 28
        else:  # 31天的月份
            return day <= 31

    # 验证农历日期的有效性（大小月天数）
    def _is_valid_lunar_day(self, year: int, month: int, day: int) -> Dict:
        """验证农历日期的有效性（大小月天数）"""
        try:
            # 使用lunar库直接尝试创建日期对象，如果日期无效会抛出异常
            lunar_month = abs(month)
            lunar_obj = Lunar.fromYmd(year, lunar_month, day)
            
            # 如果创建成功且日期匹配，说明日期有效
            if lunar_obj.getYear() == year and lunar_obj.getMonth() == lunar_month and lunar_obj.getDay() == day:
                return {"success": True, "valid": True}
            else:
                return {"success": True, "valid": False, "error": f"农历日期验证失败：日期不匹配"}
        except Exception as e:
            return {"success": True, "valid": False, "error": f"农历日期验证失败：{str(e)}"}

    # 验证时间组件
    def _is_valid_time_components(self, hour: int, minute: int, second: int) -> Dict:
        """验证时间组件"""
        # 验证小时范围
        if not (0 <= hour <= 23):
            return {"success": True, "valid": False, "error": f"小时范围必须是0-23，当前值：{hour}"}
        
        # 验证分钟范围
        if not (0 <= minute <= 59):
            return {"success": True, "valid": False, "error": f"分钟范围必须是0-59，当前值：{minute}"}
        
        # 验证秒钟范围
        if not (0 <= second <= 59):
            return {"success": True, "valid": False, "error": f"秒钟范围必须是0-59，当前值：{second}"}
        
        return {"success": True, "valid": True}

# ====== 历法转换 ======

    # 历法双向转换函数
    def convert_calendar(self, year: int, month: int, day: int, 
                        hour: int = 0, minute: int = 0, second: int = 0,
                        is_solar: bool = True) -> Dict:
        """
        历法双向转换函数 - 统一转换为标准格式后调用私有函数
        
        Args:
            year: 年 (1-9999)
            month: 月 (公历:1-12, 农历:1-12或-1~-12表示闰月)
            day: 日 (根据月份验证)
            hour: 时 (0-23)
            minute: 分 (0-59)
            second: 秒 (0-59)
            is_solar: 是否为公历输入 (True:公历转农历, False:农历转公历)
            
        Returns:
            Dict: 转换结果，包含success, valid, error, solar_info, lunar_info等字段
        """
        # 先验证输入数据格式
        if is_solar:
            validation_result = self.validate_solar_input(year, month, day, hour, minute, second)
        else:
            validation_result = self.validate_lunar_input(year, month, day, hour, minute, second)
        
        if not validation_result["valid"]:
            return {
                "success": True,
                "valid": False,
                "error": validation_result["error"],
                "input_type": "solar" if is_solar else "lunar",
                "conversion_type": "solar_to_lunar" if is_solar else "lunar_to_solar"
            }
        
        try:
            # 统一转换为标准格式
            if is_solar:
                # 公历转农历：获取标准对象
                solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second)
                lunar_date = solar_date.getLunar()
            else:
                # 农历转公历：获取标准对象
                lunar_date = Lunar.fromYmdHms(year, abs(month), day, hour, minute, second)
                solar_date = lunar_date.getSolar()
            
            # 调用各个私有函数获取详细信息
            solar_info = self._get_solar_info(solar_date)
            lunar_info = self._get_lunar_info(lunar_date) 
            ganzhi_info = self._get_ganzhi_info(lunar_date)
            jieqi_info = self._get_jieqi_info(lunar_date) 
            
            # 统一返回所有私有函数的结果
            return {
                "success": True,
                "valid": True,
                "input_type": "solar" if is_solar else "lunar",
                "conversion_type": "solar_to_lunar" if is_solar else "lunar_to_solar",
                "solar_info": solar_info,
                "lunar_info": lunar_info,
                "ganzhi_info": ganzhi_info,
                "jieqi_info": jieqi_info
            }
            
        except Exception as e:
            return {
                "success": True,
                "valid": False,
                "error": f"历法转换失败：{str(e)}",
                "input_type": "solar" if is_solar else "lunar",
                "conversion_type": "solar_to_lunar" if is_solar else "lunar_to_solar"
            }
        
    # 获取阴历月对象
    def _get_lunar_month(self, lunar_date: Lunar) -> LunarMonth:
        """
        获取阴历月对象
        
        Args:
            lunar_date: Lunar对象，包含农历日期信息
            
        Returns:
            LunarMonth: 阴历月对象
        """
        try:
            lunar_year = lunar_date.getYear()
            lunar_month = lunar_date.getMonth()
            lunarMonth = LunarMonth.fromYm(lunar_year, lunar_month)
            return lunarMonth
        except Exception:
            # 如果获取失败，返回None
            return None

    # 提取公历日期的详细信息
    def _get_solar_info(self, solar_date: Solar) -> Dict:
        """
        提取公历日期的详细信息
        
        Args:
            solar_date: Solar对象，包含公历日期信息
            
        Returns:
            Dict: 公历日期的详细信息
        """
        return {
            "solar_year": solar_date.getYear(), # 公历年
            "solar_month": solar_date.getMonth(), # 公历月
            "solar_day": solar_date.getDay(), # 公历日
            "solar_hour": solar_date.getHour(), # 公历时
            "solar_minute": solar_date.getMinute(), # 公历分
            "solar_second": solar_date.getSecond(), # 公历秒
            "solar_String": solar_date.toString(), # 阳历对象的默认字符
            "solar_FullString": solar_date.toFullString(), # 阳历对象的全量字符串输出，包含尽量多的信息
            "solar_Ymd": solar_date.toYmd(), # 阳历对象的日期部分字符串输出，格式为yyyy-MM-dd
            "solar_YmdHms": solar_date.toYmdHms(), # 阳历对象的YYYY-MM-DD HH:mm:ss字符串输出
            "solar_week": solar_date.getWeek(), # 获取星期数字，0代表星期日，1代表星期一，6代表星期六
            "solar_week_chinese": solar_date.getWeekInChinese(), # 获取星期的中文：日一二三四五六
            "solar_leap_year": solar_date.isLeapYear(), # 返回true/false，true代表闰年，false代表非闰年
            "solar_festivals": solar_date.getFestivals(), # 获取阳历对象的所有节日名称列表
            "solar_other_festivals": solar_date.getOtherFestivals() # 获取阳历对象的所有其他节日名称列表
        }
    
    # 提取农历日期的详细信息
    def _get_lunar_info(self, lunar_date: Lunar) -> Dict:
        """
        提取农历日期的详细信息
        
        Args:
            lunar_date: Lunar对象，包含农历日期信息
            
        Returns:
            Dict: 农历日期的详细信息
        """
        try:
            lunar_year_num = lunar_date.getYear()
            lunar_month_num = lunar_date.getMonth()
            lunar_month = LunarMonth.fromYm(lunar_year_num, lunar_month_num)
        except Exception:
            lunar_month = None
        
        return {
            "lunar_year": lunar_year_num, # 获取阴历年的数字
            "lunar_year_in_Chinese": lunar_date.getYearInChinese(), # 获取阴历年的中文
            "lunar_year_in_GanZhi": lunar_date.getYearInGanZhi(), # 获取阴历年干支 （新年以正月初一起算）
            "lunar_year_in_Gan": lunar_date.getYearGan(), # 获取阴历年的天干（新年以正月初一起算）
            "lunar_year_in_Zhi": lunar_date.getYearZhi(), # 获取阴历年的地支（新年以正月初一起算）
            "lunar_year_shengxiao": lunar_date.getYearShengXiao(), # 获取年的生肖（以正月初一起）
            "lunar_year_shengxiao_by_lichun": lunar_date.getYearShengXiaoByLiChun(), # 获取年的生肖（以立春当天起）
            "lunar_month": lunar_month_num, # 获取阴历月的数字，值从1到12，但闰月为负数，如闰二月=-2
            "lunar_month_in_Chinese": lunar_date.getMonthInChinese(), # 获取阴历月的中文
            "lunar_month_days": lunar_month.getDayCount() if lunar_month else 0, # 获取阴历月的天数
            "lunar_day": lunar_date.getDay(), # 农历日
            "lunar_day_in_Chinese": lunar_date.getDayInChinese(), # 获取阴历日的中文
            "lunar_time_Zhi": lunar_date.getTimeZhi(), # 获取时辰地支    
            "lunar_string": lunar_date.toString(), # 阴历对象的默认字符串输出
            "lunar_full_string": lunar_date.toFullString(), # 阴历对象的全量字符串输出，包含尽量多的信息
            "lunar_festivals": lunar_date.getFestivals(), # 返回常用节日的数组，包括春节、中秋、元宵等，有可能同一天有多个，也可能没有
            "lunar_other_festivals": lunar_date.getOtherFestivals(), # 返回其他传统节日的数组，包括寒衣节、下元节、祭灶日等，有可能同一天有多个，也可能没有
        }


    # 提取干支信息
    def _get_ganzhi_info(self, lunar_date: Lunar) -> Dict:
        """
        提取干支的详细信息
        
        Args:
            lunar_date: Lunar对象，包含农历日期信息
            
        Returns:
            Dict: 干支的详细信息
        """
        return {
            "lunar_year_in_ganzhi_exact": lunar_date.getYearInGanZhiExact(), # 获取干支纪年（新年以立春节气交接的时刻起算）
            "lunar_year_gan_exact": lunar_date.getYearGanExact(),  # 获取阴历年的天干（新年以立春节气交接的时刻起算）
            "lunar_year_zhi_exact": lunar_date.getYearZhiExact(),  # 获取阴历年的地支（新年以立春节气交接的时刻起算）
            "lunar_month_in_ganzhi_exact": lunar_date.getMonthInGanZhiExact(),  # 获取干支纪月（新的一月以节交接准确时刻起算）
            "lunar_month_gan_exact": lunar_date.getMonthGanExact(),  # 获取阴历月的天干（新的一月以节交接准确时刻起算）
            "lunar_month_zhi_exact": lunar_date.getMonthZhiExact(),  # 获取阴历月的地支（新的一月以节交接准确时刻起算）
            "lunar_day_in_ganzhi_exact": lunar_date.getDayInGanZhiExact(), # 获取精确的干支纪日（流派1，晚子时日柱算明天）
            "lunar_day_in_gan_exact": lunar_date.getDayGanExact(), # 获取阴历日的精确天干（流派1，晚子时日柱算明天）
            "lunar_day_in_zhi_exact": lunar_date.getDayZhiExact(), # 获取阴历日的精确地支（流派1，晚子时日柱算明天）
            "lunar_day_in_ganzhi_exact2": lunar_date.getDayInGanZhiExact2(), # 获取精确的干支纪日（流派2，晚子时日柱算当天）
            "lunar_day_in_gan_exact2": lunar_date.getDayGanExact2(), # 获取阴历日的精确天干（流派2，晚子时日柱算当天）
            "lunar_day_in_zhi_exact2": lunar_date.getDayZhiExact2(), # 获取阴历日的精确地支（流派2，晚子时日柱算当天）
        }
    
    # 提取节气信息
    def _get_jieqi_info(self, lunar_date: Lunar) -> Dict:
        """
        提取节气的详细信息，并返回按时间顺序排列的节气字典
        
        Args:
            lunar_date: Lunar对象，包含农历日期信息
            
        Returns:
            Dict: 包含按时间顺序排列的节气信息字典
        """
        try:
            # 获取所有节气的基本信息
            prev_jie_time = lunar_date.getPrevJie().getSolar().toYmdHms()
            prev_jie_name = lunar_date.getPrevJie().getName()
            next_jie_time = lunar_date.getNextJie().getSolar().toYmdHms()
            next_jie_name = lunar_date.getNextJie().getName()
            prev_qi_time = lunar_date.getPrevQi().getSolar().toYmdHms()
            prev_qi_name = lunar_date.getPrevQi().getName()
            next_qi_time = lunar_date.getNextQi().getSolar().toYmdHms()
            next_qi_name = lunar_date.getNextQi().getName()

            # 获取Solar对象用于时间比较
            prev_jie_solar = lunar_date.getPrevJie().getSolar()
            prev_qi_solar = lunar_date.getPrevQi().getSolar()

            # 根据时间顺序确定节气排列
            if prev_jie_solar.isBefore(prev_qi_solar):
                # 节在气之前：节 → 气 → 下一个节
                jieqi_result_a = {
                    "prev_jie": {
                        "name": prev_jie_name,
                        "time": prev_jie_time
                    },
                    "prev_qi": {
                        "name": prev_qi_name,
                        "time": prev_qi_time
                    },
                    "new":{
                        "name": "占时",
                        "time": lunar_date.getSolar().toYmdHms()
                    },
                    "next_jie": {
                        "name": next_jie_name,
                        "time": next_jie_time
                    },
                    "next_qi": {
                        "name": next_qi_name,
                        "time": next_qi_time
                    },
                }
            else:
                # 气在节之前：节 → 下一个气 → 下一个节
                jieqi_result_a = {
                    "prev_qi": {
                        "name": prev_qi_name,
                        "time": prev_qi_time
                    },
                    "prev_jie": {
                        "name": prev_jie_name,
                        "time": prev_jie_time
                    },
                    "new":{
                        "name": "占时",
                        "time": lunar_date.getSolar().toYmdHms()
                    },
                    "next_qi": {
                        "name": next_qi_name,
                        "time": next_qi_time
                    },
                    "next_jie": {
                        "name": next_jie_name,
                        "time": next_jie_time
                    },
                }

            return {
                "jieqi_result_a": jieqi_result_a
            }
            
        except Exception as e:
            # 异常处理，返回错误信息
            return {
                "jieqi_result_a": {},
                "error": f"获取节气信息失败：{str(e)}"
            }




# 测试代码 - 用于验证CalendarConverter类的功能
if __name__ == "__main__":
    print("=== CalendarConverter 测试开始 ===")
    
    # 创建转换器实例
    converter = CalendarConverter()
    
    # 测试1: 公历转农历
    print("\n1. 测试公历转农历:")
    result1 = converter.convert_calendar(2024, 1, 1, is_solar=True)
    print(f"输入: 2024年1月1日 (公历)")
    print(f"成功: {result1['success']}")
    print(f"有效: {result1['valid']}")
    if result1['valid']:
        print(f"农历日期: {result1['lunar_date']['full_date']}")
        print(f"公历信息: {result1['solar_date']['full_date']}")
        print("\n_get_solar_info函数返回的所有数据:")
        solar_info = result1['solar_date']
        for key, value in solar_info.items():
            print(f"  {key}: {value}")
    
    # 测试2: 农历转公历
    print("\n2. 测试农历转公历:")
    result2 = converter.convert_calendar(2023, -2, 20, is_solar=False)
    print(f"输入: 2023年闰二月二十 (农历)")
    print(f"成功: {result2['success']}")
    print(f"有效: {result2['valid']}")
    if result2['valid']:
        print(f"公历日期: {result2['solar_date']['full_date']}")
        print(f"农历信息: {result2['lunar_date']['full_date']}")
    
    print("\n=== CalendarConverter 测试结束 ===")
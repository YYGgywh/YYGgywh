"""
中华易学排盘系统 - 历法服务模块

此模块提供公历到农历的转换、干支计算、节气判断等核心历法功能
基于calendar_calculator.py的专业干支算法，提供统一的错误处理和API接口
"""

from lunar_python import Solar, Lunar, LunarMonth
from typing import Dict, List, Optional, Union
from src.algorithms.calendar_calculator import CalendarConverter


class CalendarError(Exception):
    """历法计算异常"""
    pass


def handle_calendar_errors(func):
    """统一处理历法计算错误"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_msg = str(e)
            if 'wrong hour' in error_msg:
                raise CalendarError('时间参数错误：小时超出范围(0-23)')
            elif 'wrong minute' in error_msg:
                raise CalendarError('时间参数错误：分钟超出范围(0-59)')
            elif 'wrong second' in error_msg:
                raise CalendarError('时间参数错误：秒超出范围(0-59)')
            elif 'wrong date' in error_msg.lower():
                raise CalendarError('日期参数错误：无效的日期格式')
            else:
                raise CalendarError(f'历法计算错误：{error_msg}')
    return wrapper


class CalendarService:
    """历法服务类"""
    
    @staticmethod
    @handle_calendar_errors
    def convert_solar_to_lunar(
        year: int, 
        month: int, 
        day: int, 
        hour: int = 0, 
        minute: int = 0, 
        second: int = 0,
        day_ganzhi_method: int = 2
    ) -> Dict[str, Union[str, int, List[str]]]:
        """
        将公历日期转换为农历信息
        
        Args:
            year: 公历年
            month: 公历月
            day: 公历日
            hour: 小时 (0-23)
            minute: 分钟 (0-59)
            second: 秒 (0-59)
            day_ganzhi_method: 日干支流派选择 (1=流派1, 2=流派2)
            
        Returns:
            包含完整农历信息的字典
        """
        # 创建公历对象
        solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second)
        
        # 转换为农历对象
        lunar_date = solar_date.getLunar()
        
        # 创建数据验证器
        validator = CalendarConverter()
        
        # 验证输入数据格式
        validation_result = validator.validate_solar_input(year, month, day, hour, minute, second)
        if not validation_result["valid"]:
            raise CalendarError(f"输入数据格式错误：{validation_result.get('error', '未知错误')}")
        
        # 使用lunar-python库的方法构建历法信息
        # 构建返回结果（与calendar_calculator.py保持一致的键名）
        # 先获取日历计算器实例，使用其私有方法获取一致的信息结构
        calculator = CalendarConverter()
        
        # 构建与calendar_calculator.py一致的返回结构
        result = {
            "success": True,
            "valid": True,
            "input_type": "solar",
            "conversion_type": "solar_to_lunar",
            "solar_info": {
                "solar_year": solar_date.getYear(),
                "solar_month": solar_date.getMonth(),
                "solar_day": solar_date.getDay(),
                "solar_hour": solar_date.getHour(),
                "solar_minute": solar_date.getMinute(),
                "solar_second": solar_date.getSecond(),
                "solar_String": solar_date.toString(),
                "solar_FullString": solar_date.toFullString(),
                "solar_Ymd": solar_date.toYmd(),
                "solar_YmdHms": solar_date.toYmdHms(),
                "solar_week": solar_date.getWeek(),
                "solar_week_chinese": solar_date.getWeekInChinese(),
                "solar_leap_year": solar_date.isLeapYear(),
                "solar_festivals": solar_date.getFestivals(),
                "solar_other_festivals": solar_date.getOtherFestivals()
            },
            
            # 农历信息
            "lunar_info": {
                "lunar_year": lunar_date.getYear(),
                "lunar_year_in_Chinese": lunar_date.getYearInChinese(),
                "lunar_year_in_GanZhi": lunar_date.getYearInGanZhi(),
                "lunar_year_in_Gan": lunar_date.getYearGan(),
                "lunar_year_in_Zhi": lunar_date.getYearZhi(),
                "lunar_year_shengxiao": lunar_date.getYearShengXiao(),
                "lunar_year_shengxiao_by_lichun": lunar_date.getYearShengXiaoByLiChun(),
                "lunar_month": lunar_date.getMonth(),
                "lunar_month_in_Chinese": lunar_date.getMonthInChinese(),
                "lunar_month_days": LunarMonth.fromYm(lunar_date.getYear(), lunar_date.getMonth()).getDayCount() if lunar_date else 0,
                "lunar_day": lunar_date.getDay(),
                "lunar_day_in_Chinese": lunar_date.getDayInChinese(),
                "lunar_time_Zhi": lunar_date.getTimeZhi(),
                "lunar_string": lunar_date.toString(),
                "lunar_full_string": lunar_date.toFullString(),
                "lunar_festivals": lunar_date.getFestivals(),
                "lunar_other_festivals": lunar_date.getOtherFestivals()
            },
            
            # 干支信息
            "ganzhi_info": {
                "lunar_year_in_ganzhi_exact": lunar_date.getYearInGanZhiExact(),
                "lunar_year_gan_exact": lunar_date.getYearGanExact(),
                "lunar_year_zhi_exact": lunar_date.getYearZhiExact(),
                "lunar_month_in_ganzhi_exact": lunar_date.getMonthInGanZhiExact(),
                "lunar_month_gan_exact": lunar_date.getMonthGanExact(),
                "lunar_month_zhi_exact": lunar_date.getMonthZhiExact(),
                "lunar_day_in_ganzhi_exact": lunar_date.getDayInGanZhiExact(),
                "lunar_day_in_gan_exact": lunar_date.getDayGanExact(),
                "lunar_day_in_zhi_exact": lunar_date.getDayZhiExact(),
                "lunar_day_in_ganzhi_exact2": lunar_date.getDayInGanZhiExact2(),
                "lunar_day_in_gan_exact2": lunar_date.getDayGanExact2(),
                "lunar_day_in_zhi_exact2": lunar_date.getDayZhiExact2()
            },
            
            # 节气信息
            "jieqi_info": {
                "jieqi_result_a": CalendarService._get_jieqi_combination(lunar_date)
            }
        }
        
        return result
    
    @staticmethod
    def convert_lunar_to_solar(
        lunar_year: int, lunar_month: int, lunar_day: int, 
        hour: int = 0, minute: int = 0, second: int = 0,
        is_leap_month: bool = False
    ) -> Dict:
        """
        将农历日期转换为公历及完整历法信息
        
        Args:
            lunar_year: 农历年
            lunar_month: 农历月
            lunar_day: 农历日
            hour: 小时 (0-23)
            minute: 分钟 (0-59)
            second: 秒 (0-59)
            is_leap_month: 是否为闰月
            
        Returns:
            包含完整历法信息的字典
        """
        try:
            # 创建农历对象，支持闰月
            if is_leap_month:
                # 对于闰月，使用lunar_month的负数表示
                lunar_date = Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, hour, minute, second)
            else:
                lunar_date = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
            
            # 转换为公历
            solar_date = lunar_date.getSolar()
            
            # 调用现有的公历转换方法获取完整信息
            return CalendarService.convert_solar_to_lunar(
                solar_date.getYear(), solar_date.getMonth(), solar_date.getDay(),
                hour, minute, second
            )
            
        except Exception as e:
            raise CalendarError(f"农历转换失败: {str(e)}")

    @staticmethod
    def _get_jieqi_combination(lunar_date: Lunar) -> Dict:
        """获取节气组合信息（与calendar_calculator.py保持一致）"""
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

            return jieqi_result_a
            
        except Exception as e:
            # 异常处理，返回空字典
            return {}
    
    @staticmethod
    def _get_jieqi_info(lunar_date: Lunar, solar_date: Solar) -> Dict[str, Union[str, Dict[str, str]]]:
        """获取节气信息（排盘专用详细版本）"""
        
        # 获取前后节令气令信息
        prev_jie = lunar_date.getPrevJie()
        prev_qi = lunar_date.getPrevQi()
        next_jie = lunar_date.getNextJie()
        next_qi = lunar_date.getNextQi()
        
        # 获取当前节气
        current_jieqi = lunar_date.getJieQi()
        
        # 详细节气信息
        jieqi_info = {
            # 节令信息
            "jie": {
                "prev": {
                    "name": str(prev_jie),
                    "time": prev_jie.getSolar().toYmdHms(),
                    "solar": prev_jie.getSolar().toYmd()
                },
                "next": {
                    "name": str(next_jie),
                    "time": next_jie.getSolar().toYmdHms(),
                    "solar": next_jie.getSolar().toYmd()
                }
            },
            # 气令信息
            "qi": {
                "prev": {
                    "name": str(prev_qi),
                    "time": prev_qi.getSolar().toYmdHms(),
                    "solar": prev_qi.getSolar().toYmd()
                },
                "next": {
                    "name": str(next_qi),
                    "time": next_qi.getSolar().toYmdHms(),
                    "solar": next_qi.getSolar().toYmd()
                }
            },
            # 当前节气状态
            "current": {
                "name": str(current_jieqi) if current_jieqi else "无",
                "is_jieqi": current_jieqi is not None,
                "current_time": solar_date.toYmdHms()
            }
        }
        
        return jieqi_info
    
    @staticmethod
    @handle_calendar_errors
    def get_current_calendar_info() -> Dict[str, Union[str, int, List[str]]]:
        """获取当前时间的历法信息"""
        from datetime import datetime
        from lunar_python import Solar
        now = datetime.now()
        solar = Solar.fromDate(now)
        return CalendarService.convert_solar_to_lunar(
            solar.getYear(), solar.getMonth(), solar.getDay(), 
            solar.getHour(), solar.getMinute(), solar.getSecond()
        )
    
    @staticmethod
    @handle_calendar_errors
    def validate_date_params(
        year: int, month: int, day: int, 
        hour: int = 0, minute: int = 0, second: int = 0
    ) -> Dict[str, Union[bool, str]]:
        """
        验证日期参数的有效性
        
        Returns:
            包含验证结果和修正信息的字典
        """
        try:
            # 尝试创建Solar对象，库会自动修正无效日期
            solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second)
            
            # 检查是否发生修正
            original_date = f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"
            converted_date = solar_date.toYmdHms()
            
            is_corrected = original_date != converted_date
            
            return {
                "is_valid": True,
                "is_corrected": is_corrected,
                "original_date": original_date,
                "corrected_date": converted_date if is_corrected else None,
                "message": "日期已自动修正为有效日期" if is_corrected else "日期参数有效"
            }
            
        except Exception as e:
            return {
                "is_valid": False,
                "is_corrected": False,
                "original_date": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}",
                "corrected_date": None,
                "message": f"日期参数无效: {str(e)}"
            }

    @staticmethod
    @handle_calendar_errors
    def convert_pillars_to_calendar(
        year_pillar: str, month_pillar: str, day_pillar: str, hour_pillar: str
    ) -> Dict:
        """
        从四柱八字反推公历时间及完整历法信息
        
        Args:
            year_pillar: 年柱（如：甲子）
            month_pillar: 月柱（如：丙寅）
            day_pillar: 日柱（如：戊辰）
            hour_pillar: 时柱（如：壬子）
            
        Returns:
            包含所有匹配时间段的字典，包含multiple_results字段
        """
        try:
            # 天干地支定义
            HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
            EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
            
            # 验证四柱格式
            if len(year_pillar) != 2 or len(month_pillar) != 2 or len(day_pillar) != 2 or len(hour_pillar) != 2:
                raise CalendarError("四柱格式错误，应为两个字符（如：甲子）")
            
            # 提取天干地支
            year_gan, year_zhi = year_pillar[0], year_pillar[1]
            month_gan, month_zhi = month_pillar[0], month_pillar[1]
            day_gan, day_zhi = day_pillar[0], day_pillar[1]
            hour_gan, hour_zhi = hour_pillar[0], hour_pillar[1]
            
            # 验证天干地支有效性
            if (year_gan not in HEAVENLY_STEMS or year_zhi not in EARTHLY_BRANCHES or
                month_gan not in HEAVENLY_STEMS or month_zhi not in EARTHLY_BRANCHES or
                day_gan not in HEAVENLY_STEMS or day_zhi not in EARTHLY_BRANCHES or
                hour_gan not in HEAVENLY_STEMS or hour_zhi not in EARTHLY_BRANCHES):
                raise CalendarError("四柱包含无效的天干或地支")
            
            # 使用lunar-python库的高效四柱转换方法
            # 设置sect=1（流派1，晚子时算明天），baseYear=1从公元1年开始搜索，以获取更全面的结果
            matching_solars = Solar.fromBaZi(year_pillar, month_pillar, day_pillar, hour_pillar, 1, 1)
            
            if not matching_solars:
                raise CalendarError("无法根据四柱推算出有效日期")
            
            # 收集所有匹配的日期
            matching_dates = []
            
            for solar in matching_solars:
                # 获取完整历法信息
                calendar_info = CalendarService.convert_solar_to_lunar(
                    solar.getYear(), solar.getMonth(), solar.getDay(),
                    solar.getHour(), solar.getMinute(), solar.getSecond()
                )
                
                matching_dates.append({
                    "solar_date": solar.toYmdHms(),
                    "calendar_info": calendar_info
                })
            
            # 返回所有匹配的日期信息
            return {
                "multiple_results": True,
                "total_matches": len(matching_dates),
                "matching_dates": matching_dates,
                "primary_result": matching_dates[0]["calendar_info"]  # 返回第一个结果作为主要结果
            }
        
        except Exception as e:
            raise CalendarError(f"四柱转换错误: {str(e)}")


# 创建全局服务实例
calendar_service = CalendarService()


if __name__ == "__main__":
    """模块测试"""
    # 测试当前时间
    print("=== 当前时间历法信息 ===")
    current_info = calendar_service.get_current_calendar_info()
    print(f"公历: {current_info['solar_datetime']}")
    print(f"农历: {current_info['lunar_collection']['lunar_date']}")
    print(f"年干支: {current_info['ganzhi_collection']['ganzhi_year']}")
    
    # 测试指定日期
    print("\n=== 指定日期测试 ===")
    test_info = calendar_service.convert_solar_to_lunar(2025, 2, 3, 22, 10, 27)
    print(f"公历: {test_info['solar_datetime']}")
    print(f"农历: {test_info['lunar_collection']['lunar_date']}")
    print(f"节气: {test_info['jieqi']}")
    
    # 测试日期验证
    print("\n=== 日期验证测试 ===")
    validation = calendar_service.validate_date_params(2024, 2, 30, 12, 0, 0)
    print(f"验证结果: {validation}")
# backend/src/core/calendar_algorithm_core.py 2026-02-12 14:30:00
# 功能：历法算法核心模块，处理公历农历转换和干支计算

from lunar_python import Solar, Lunar, LunarMonth  # 导入lunar-python库的核心类：Solar（公历）、Lunar（农历）、LunarMonth（农历月份）
from typing import Dict, List, Union  # 导入类型注解工具：Dict（字典类型）、List（列表类型）、Union（联合类型）
from src.algorithms.calendar_calculator import CalendarConverter  # 导入前端数据验证器类，专门验证公历农历时间参数的有效性和合法性


class CalendarError(Exception):  # 定义历法计算异常类，继承自Python标准异常类
    """历法计算异常"""  # 类文档字符串：说明此类用于处理历法计算相关的异常
    pass  # 空语句，表示此类没有额外的方法或属性，仅用于异常类型标识


def handle_calendar_errors(func):  # 定义错误处理装饰器函数，用于统一处理历法计算错误
    """统一处理历法计算错误"""  # 函数文档字符串：说明此装饰器的作用
    def wrapper(*args, **kwargs):  # 定义内部包装函数，接收任意位置参数和关键字参数
        try:  # 尝试执行被装饰的函数
            return func(*args, **kwargs)  # 调用原始函数并返回结果
        except Exception as e:  # 捕获所有异常
            error_msg = str(e)  # 将异常对象转换为字符串
            if 'wrong hour' in error_msg:  # 检查错误信息中是否包含小时错误
                raise CalendarError('时间参数错误：小时超出范围(0-23)')  # 抛出特定的小时错误异常
            elif 'wrong minute' in error_msg:  # 检查错误信息中是否包含分钟错误
                raise CalendarError('时间参数错误：分钟超出范围(0-59)')  # 抛出特定的分钟错误异常
            elif 'wrong second' in error_msg:  # 检查错误信息中是否包含秒错误
                raise CalendarError('时间参数错误：秒超出范围(0-59)')  # 抛出特定的秒错误异常
            elif 'wrong date' in error_msg.lower():  # 检查错误信息中是否包含日期格式错误（忽略大小写）
                raise CalendarError('日期参数错误：无效的日期格式')  # 抛出特定的日期格式错误异常
            else:  # 如果是其他类型的错误
                raise CalendarError(f'历法计算错误：{error_msg}')  # 抛出通用的历法计算错误异常
    return wrapper  # 返回包装函数


class CalendarAlgorithmCore:  # 定义历法算法核心类，包含所有历法计算的核心方法
    """历法算法核心类"""  # 类文档字符串：说明此类是历法算法的核心实现
    
    @staticmethod  # 静态方法装饰器：表示此方法不依赖于类实例，可以直接通过类名调用
    @handle_calendar_errors  # 错误处理装饰器：自动处理历法计算过程中可能出现的异常
    def convert_solar_to_lunar(  # 定义公历转农历的核心方法
        year: int,   # 参数：公历年份，整数类型
        month: int,  # 参数：公历月份，整数类型
        day: int,    # 参数：公历日期，整数类型
        hour: int = 0,     # 参数：小时（可选，默认0），整数类型，范围0-23
        minute: int = 0,   # 参数：分钟（可选，默认0），整数类型，范围0-59
        second: int = 0,   # 参数：秒（可选，默认0），整数类型，范围0-59
        day_ganzhi_method: int = 2  # 参数：日干支计算方法流派选择（可选，默认2），整数类型
    ) -> Dict[str, Union[str, int, List[str]]]:  # 返回值类型注解：返回包含多种数据类型的字典
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
        # 创建公历对象：使用lunar-python库的Solar类创建公历日期对象
        solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second)
        
        # 转换为农历对象：通过公历对象的getLunar()方法获取对应的农历日期对象
        lunar_date = solar_date.getLunar()
        
        # 创建数据验证器：实例化CalendarConverter类用于输入数据验证
        validator = CalendarConverter()
        
        # 验证输入数据格式：调用验证器的validate_solar_input方法检查输入参数有效性
        validation_result = validator.validate_solar_input(year, month, day, hour, minute, second)
        if not validation_result["valid"]:  # 如果验证结果无效
            raise CalendarError(f"输入数据格式错误：{validation_result.get('error', '未知错误')}")  # 抛出数据格式错误异常
        
        # 使用lunar-python库的方法构建历法信息
        # 构建返回结果（与calendar_calculator.py保持一致的键名）
        # 先获取日历计算器实例，使用其私有方法获取一致的信息结构
        calculator = CalendarConverter()  # 再次创建计算器实例，用于保持数据结构一致性
        
        # 构建与calendar_calculator.py一致的返回结构：创建包含所有历法信息的字典
        result = {  # 开始构建结果字典
            "success": True,  # 成功标志：表示计算成功完成
            "valid": True,  # 数据有效性标志：表示输入数据经过验证且有效
            "input_type": "solar",  # 输入类型标识：表示原始输入是公历日期
            "conversion_type": "solar_to_lunar",  # 转换类型标识：表示执行的是公历转农历操作
            "solar_info": {  # 公历信息子字典：包含所有公历相关的详细信息
                "solar_year": solar_date.getYear(),  # 公历年份：获取公历对象的年份
                "solar_month": solar_date.getMonth(),  # 公历月份：获取公历对象的月份
                "solar_day": solar_date.getDay(),  # 公历日期：获取公历对象的日期
                "solar_hour": solar_date.getHour(),  # 公历小时：获取公历对象的小时
                "solar_minute": solar_date.getMinute(),  # 公历分钟：获取公历对象的分钟
                "solar_second": solar_date.getSecond(),  # 公历秒数：获取公历对象的秒数
                "solar_String": solar_date.toString(),  # 公历字符串：获取简化的公历日期字符串
                "solar_FullString": solar_date.toFullString(),  # 公历完整字符串：获取详细的公历日期字符串
                "solar_Ymd": solar_date.toYmd(),  # 公历年月日：获取年月日格式的字符串
                "solar_YmdHms": solar_date.toYmdHms(),  # 公历年月日时分秒：获取完整时间格式的字符串
                "solar_week": solar_date.getWeek(),  # 公历星期：获取星期几的数字表示
                "solar_week_chinese": solar_date.getWeekInChinese(),  # 公历星期中文：获取星期几的中文表示
                "solar_leap_year": solar_date.isLeapYear(),  # 公历闰年标志：判断是否为闰年
                "solar_festivals": solar_date.getFestivals(),  # 公历节日：获取公历相关的节日列表
                "solar_other_festivals": solar_date.getOtherFestivals()  # 公历其他节日：获取其他相关节日列表
            },
            
            # 农历信息
            "lunar_info": {  # 农历信息子字典：包含所有农历相关的详细信息
                "lunar_year": lunar_date.getYear(),  # 农历年份：获取农历对象的年份
                "lunar_year_in_Chinese": lunar_date.getYearInChinese(),  # 农历年份中文：获取农历年份的中文表示
                "lunar_year_in_GanZhi": lunar_date.getYearInGanZhi(),  # 农历年干支：获取农历年份的干支表示
                "lunar_year_in_Gan": lunar_date.getYearGan(),  # 农历年天干：获取农历年份的天干
                "lunar_year_in_Zhi": lunar_date.getYearZhi(),  # 农历年地支：获取农历年份的地支
                "lunar_year_shengxiao": lunar_date.getYearShengXiao(),  # 农历年生肖：获取农历年份对应的生肖
                "lunar_year_shengxiao_by_lichun": lunar_date.getYearShengXiaoByLiChun(),  # 农历年立春生肖：按立春划分的生肖
                "lunar_month": lunar_date.getMonth(),  # 农历月份：获取农历对象的月份
                "lunar_month_in_Chinese": lunar_date.getMonthInChinese(),  # 农历月份中文：获取农历月份的中文表示
                "lunar_month_days": LunarMonth.fromYm(lunar_date.getYear(), lunar_date.getMonth()).getDayCount() if lunar_date else 0,  # 农历月份天数：获取该农历月的总天数
                "lunar_day": lunar_date.getDay(),  # 农历日期：获取农历对象的日期
                "lunar_day_in_Chinese": lunar_date.getDayInChinese(),  # 农历日期中文：获取农历日期的中文表示
                "lunar_time_Zhi": lunar_date.getTimeZhi(),  # 农历时辰地支：获取时辰对应的地支
                "lunar_string": lunar_date.toString(),  # 农历字符串：获取简化的农历日期字符串
                "lunar_full_string": lunar_date.toFullString(),  # 农历完整字符串：获取详细的农历日期字符串
                "lunar_festivals": lunar_date.getFestivals(),  # 农历节日：获取农历相关的节日列表
                "lunar_other_festivals": lunar_date.getOtherFestivals()  # 农历其他节日：获取其他相关节日列表
            },
            
            # 干支信息
            "ganzhi_info": {  # 干支信息子字典：包含所有干支相关的详细信息
                "lunar_year_in_ganzhi_exact": lunar_date.getYearInGanZhiExact(),  # 农历年精确干支：获取精确的年干支
                "lunar_year_gan_exact": lunar_date.getYearGanExact(),  # 农历年精确天干：获取精确的年天干
                "lunar_year_zhi_exact": lunar_date.getYearZhiExact(),  # 农历年精确地支：获取精确的年地支
                "lunar_month_in_ganzhi_exact": lunar_date.getMonthInGanZhiExact(),  # 农历月精确干支：获取精确的月干支
                "lunar_month_gan_exact": lunar_date.getMonthGanExact(),  # 农历月精确天干：获取精确的月天干
                "lunar_month_zhi_exact": lunar_date.getMonthZhiExact(),  # 农历月精确地支：获取精确的月地支
                "lunar_day_in_ganzhi_exact": lunar_date.getDayInGanZhiExact(),  # 农历日精确干支：获取精确的日干支
                "lunar_day_in_gan_exact": lunar_date.getDayGanExact(),  # 农历日精确天干：获取精确的日天干
                "lunar_day_in_zhi_exact": lunar_date.getDayZhiExact(),  # 农历日精确地支：获取精确的日地支
                "lunar_day_in_ganzhi_exact2": lunar_date.getDayInGanZhiExact2(),  # 农历日精确干支2：获取第二种精确的日干支
                "lunar_day_in_gan_exact2": lunar_date.getDayGanExact2(),  # 农历日精确天干2：获取第二种精确的日天干
                "lunar_day_in_zhi_exact2": lunar_date.getDayZhiExact2()  # 农历日精确地支2：获取第二种精确的日地支
            },
            
            # 节气信息
            "jieqi_info": {  # 节气信息子字典：包含所有节气相关的详细信息
                "jieqi_result_a": CalendarAlgorithmCore._get_jieqi_combination(lunar_date)  # 节气组合结果：调用内部方法获取节气排列组合信息
            }
        }
        
        return result  # 返回构建完成的历法信息字典
    
    @staticmethod  # 静态方法装饰器：表示此方法不依赖于类实例
    def convert_lunar_to_solar(  # 定义农历转公历的核心方法
        lunar_year: int,  # 参数：农历年份，整数类型
        lunar_month: int,  # 参数：农历月份，整数类型
        lunar_day: int,  # 参数：农历日期，整数类型
        hour: int = 0,  # 参数：小时（可选，默认0），整数类型，范围0-23
        minute: int = 0,  # 参数：分钟（可选，默认0），整数类型，范围0-59
        second: int = 0,  # 参数：秒（可选，默认0），整数类型，范围0-59
        is_leap_month: bool = False  # 参数：是否为闰月（可选，默认False），布尔类型
    ) -> Dict:  # 返回值类型注解：返回包含历法信息的字典
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
        try:  # 尝试执行农历转换操作
            # 创建农历对象，支持闰月
            if is_leap_month:  # 如果指定为闰月
                # 对于闰月，使用lunar_month的负数表示：lunar-python库约定用负数表示闰月
                lunar_date = Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, hour, minute, second)
            else:  # 如果是普通月份
                lunar_date = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
            
            # 转换为公历：通过农历对象的getSolar()方法获取对应的公历日期对象
            solar_date = lunar_date.getSolar()
            
            # 调用现有的公历转换方法获取完整信息：复用convert_solar_to_lunar方法
            return CalendarAlgorithmCore.convert_solar_to_lunar(  # 调用公历转农历方法
                solar_date.getYear(), solar_date.getMonth(), solar_date.getDay(),  # 传入公历年月日
                hour, minute, second  # 传入时间参数
            )
            
        except Exception as e:  # 捕获转换过程中可能出现的异常
            raise CalendarError(f"农历转换失败: {str(e)}")  # 抛出农历转换失败异常，包含具体错误信息

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
        return CalendarAlgorithmCore.convert_solar_to_lunar(
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
                calendar_info = CalendarAlgorithmCore.convert_solar_to_lunar(
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


# 创建全局算法核心实例：实例化CalendarAlgorithmCore类，便于其他模块直接使用
calendar_algorithm_core = CalendarAlgorithmCore()  # 创建全局实例，提供便捷的API调用方式


if __name__ == "__main__":  # 主程序入口：当直接运行此文件时执行以下代码
    """模块测试"""  # 模块测试说明：此部分代码用于测试历法算法的功能
    # 测试当前时间：获取并显示当前时间的历法信息
    print("=== 当前时间历法信息 ===")  # 打印测试标题
    current_info = calendar_algorithm_core.get_current_calendar_info()  # 调用方法获取当前时间历法信息
    print(f"公历: {current_info['solar_info']['solar_YmdHms']}")  # 打印公历时间信息
    print(f"农历: {current_info['lunar_info']['lunar_string']}")  # 打印农历时间信息
    print(f"年干支: {current_info['ganzhi_info']['lunar_year_in_ganzhi_exact']}")  # 打印年干支信息
    
    # 测试指定日期：测试特定日期的历法转换功能
    print("\n=== 指定日期测试 ===")  # 打印测试标题
    test_info = calendar_algorithm_core.convert_solar_to_lunar(2025, 2, 3, 22, 10, 27)  # 测试2025年2月3日22:10:27的历法转换
    print(f"公历: {test_info['solar_info']['solar_YmdHms']}")  # 打印测试日期的公历信息
    print(f"农历: {test_info['lunar_info']['lunar_string']}")  # 打印测试日期的农历信息
    print(f"节气: {test_info['jieqi_info']['jieqi_result_a']}")  # 打印测试日期的节气信息
    
    # 测试日期验证：测试日期参数验证功能
    print("\n=== 日期验证测试 ===")  # 打印测试标题
    validation = calendar_algorithm_core.validate_date_params(2024, 2, 30, 12, 0, 0)  # 测试无效日期（2024年2月30日）的验证
    print(f"验证结果: {validation}")  # 打印验证结果
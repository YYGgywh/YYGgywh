# backend/src/core/calendar_algorithm_core.py 2026-02-12 14:30:00
# 功能：历法算法核心模块，处理公历农历转换和干支计算

from lunar_python import Solar, Lunar, LunarMonth  # 导入lunar-python库的核心类：Solar（公历）、Lunar（农历）、LunarMonth（农历月份）
from typing import Dict, List, Union  # 导入类型注解工具：Dict（字典类型）、List（列表类型）、Union（联合类型）
from src.validators.calendar_validator import calendar_validator  # 导入统一的历法验证器实例，用于验证公历和农历时间参数的有效性和合法性

# 定义历法计算异常类，继承自Python标准异常类（用于处理历法计算相关的异常）
class CalendarError(Exception):
    pass  # 空语句，表示此类没有额外的方法或属性，仅用于异常类型标识

# 定义错误处理装饰器函数，用于统一处理历法计算错误
def handle_calendar_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)  # 调用原始函数并返回结果
        except Exception as e:
            raise CalendarError(f'历法计算错误：{str(e)}')  # 捕获异常并转换为统一的历法计算错误
    return wrapper  # 返回包装函数

# 定义历法算法核心类，包含所有历法计算的核心方法
class CalendarAlgorithmCore:
    
    @staticmethod  # 静态方法装饰器：表示此方法不依赖于类实例，可以直接通过类名调用
    @handle_calendar_errors  # 错误处理装饰器：自动处理历法计算过程中可能出现的异常

    # 定义公历转农历的核心方法（创建lunar公历对象，并转换为lunar农历对象）
    def convert_solar_to_lunar(
        year: int,   # 参数：公历年份，整数类型
        month: int,  # 参数：公历月份，整数类型
        day: int,    # 参数：公历日期，整数类型
        hour: int = 0,     # 参数：小时（可选，默认0），整数类型，范围0-23
        minute: int = 0,   # 参数：分钟（可选，默认0），整数类型，范围0-59
        second: int = 0   # 参数：秒（可选，默认0），整数类型，范围0-59
    ) -> Dict[str, Union[str, int, List[str]]]:  # 返回值类型注解：返回包含多种数据类型的字典
        
        # 验证输入数据格式：调用统一验证器的validate_solar_input方法检查输入参数有效性
        validation_result = calendar_validator.validate_solar_input(
            str(year), str(month), str(day), str(hour), str(minute), str(second)
        )
        if not validation_result["valid"]:  # 如果验证结果无效
            raise CalendarError(f"[Core层验证] {validation_result.get('error', '未知错误')}")  # 抛出数据格式错误异常
        
        # 创建公历对象：使用lunar-python库的Solar类创建公历日期对象
        solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second)
        
        # 转换为农历对象：通过公历对象的getLunar()方法获取对应的农历日期对象
        lunar_date = solar_date.getLunar()
        
        # 使用lunar-python库的方法构建历法信息
        # 构建返回结果：创建包含所有历法信息的字典
        # 开始构建结果字典
        result = {
            "success": True,  # 成功标志：表示计算成功完成
            "valid": True,  # 数据有效性标志：表示输入数据经过验证且有效
            "input_type": "solar",  # 输入类型标识：表示原始输入是公历日期
            "conversion_type": "from_solar_to_info",  # 转换类型标识：表示执行的是公历求详情操作
            # 公历信息子字典：包含所有公历相关的详细信息
            "solar_info": {
                "solar_year": solar_date.getYear(),  # 公历年份：获取公历对象的年份 2026
                "solar_month": solar_date.getMonth(),  # 公历月份：获取公历对象的月份 1
                "solar_day": solar_date.getDay(),  # 公历日期：获取公历对象的日期 1
                "solar_hour": solar_date.getHour(),  # 公历小时：获取公历对象的小时 1
                "solar_minute": solar_date.getMinute(),  # 公历分钟：获取公历对象的分钟 0
                "solar_second": solar_date.getSecond(),  # 公历秒数：获取公历对象的秒数 0
                "solar_String": solar_date.toString(),  # 公历字符串：获取简化的公历日期字符串 “2026-01-01”
                "solar_FullString": solar_date.toFullString(),  # 公历完整字符串：获取详细的公历日期字符串 "2026-01-01 01:00:00 星期四 (元旦节) 摩羯座"
                "solar_Ymd": solar_date.toYmd(),  # 公历年月日：获取年月日格式的字符串 "2026-01-01"
                "solar_YmdHms": solar_date.toYmdHms(),  # 公历年月日时分秒：获取完整时间格式的字符串 "2026-01-01 01:00:00"
                "solar_week": solar_date.getWeek(),  # 公历星期：获取星期几的数字表示 4
                "solar_week_chinese": solar_date.getWeekInChinese(),  # 公历星期中文：获取星期几的中文表示 "四"
                "solar_leap_year": solar_date.isLeapYear(),  # 公历闰年标志：判断是否为闰年 false
                "solar_festivals": solar_date.getFestivals(),  # 公历节日：获取公历相关的节日列表 ["元旦节"]
                "solar_other_festivals": solar_date.getOtherFestivals()  # 公历其他节日：获取其他相关节日列表 []
            },
            # 农历信息子字典：包含所有农历相关的详细信息
            "lunar_info": {
                "lunar_year": lunar_date.getYear(),  # 农历年份：获取农历对象的年份 2025
                "lunar_year_in_Chinese": lunar_date.getYearInChinese(),  # 农历年份中文：获取农历年份的中文表示 "二〇二五"
                "lunar_year_in_GanZhi": lunar_date.getYearInGanZhi(),  # 农历年干支：获取农历年份的干支表示 "乙巳"
                "lunar_year_in_Gan": lunar_date.getYearGan(),  # 农历年天干：获取农历年份的天干 "乙"
                "lunar_year_in_Zhi": lunar_date.getYearZhi(),  # 农历年地支：获取农历年份的地支 "巳"
                "lunar_year_shengxiao": lunar_date.getYearShengXiao(),  # 农历年生肖：获取农历年份对应的生肖 "蛇"
                "lunar_year_shengxiao_by_lichun": lunar_date.getYearShengXiaoByLiChun(),  # 农历年立春生肖：按立春划分的生肖 "蛇"
                "lunar_month": lunar_date.getMonth(),  # 农历月份：获取农历对象的月份 11
                "lunar_month_in_Chinese": lunar_date.getMonthInChinese(),  # 农历月份中文：获取农历月份的中文表示 "冬"
                "lunar_month_days": LunarMonth.fromYm(lunar_date.getYear(), lunar_date.getMonth()).getDayCount() if lunar_date else 0,  # 农历月份天数：获取该农历月的总天数 30
                "lunar_day": lunar_date.getDay(),  # 农历日期：获取农历对象的日期 13
                "lunar_day_in_Chinese": lunar_date.getDayInChinese(),  # 农历日期中文：获取农历日期的中文表示 "十三"
                "lunar_time_Zhi": lunar_date.getTimeZhi(),  # 农历时辰地支：获取时辰对应的地支 "丑"
                "lunar_string": lunar_date.toString(),  # 农历字符串：获取简化的农历日期字符串 "二〇二五年冬月十三"
                "lunar_full_string": lunar_date.toFullString(),  # 农历完整字符串：获取详细的农历日期字符串 "二〇二五年冬月十三 乙巳(蛇)年 戊子(鼠)月 乙亥(猪)日 丑(牛)时 纳音[覆灯火 霹雳火 山头火 涧下水] 星期四 南方朱雀 星宿[井木犴](吉) 彭祖百忌[乙不栽植千株不长 亥不嫁娶不利新郎] 喜神方位[乾](西北) 阳贵神方位[坤](西南) 阴贵神方位[坎](正北) 福神方位[坤](西南) 财神方位[艮](东北) 冲[(己巳)蛇] 煞[西]"
                "lunar_festivals": lunar_date.getFestivals(),  # 农历节日：获取农历相关的节日列表 []
                "lunar_other_festivals": lunar_date.getOtherFestivals()  # 农历其他节日：获取其他相关节日列表 []
            },            
            # 干支信息子字典：包含所有干支相关的详细信息
            "ganzhi_info": {
                "lunar_year_in_ganzhi_exact": lunar_date.getYearInGanZhiExact(),  # 农历年精确干支：获取精确的年干支 "乙巳"
                "lunar_year_gan_exact": lunar_date.getYearGanExact(),  # 农历年精确天干：获取精确的年天干 "乙"
                "lunar_year_zhi_exact": lunar_date.getYearZhiExact(),  # 农历年精确地支：获取精确的年地支 "巳"
                "lunar_month_in_ganzhi_exact": lunar_date.getMonthInGanZhiExact(),  # 农历月精确干支：获取精确的月干支 "戊子"
                "lunar_month_gan_exact": lunar_date.getMonthGanExact(),  # 农历月精确天干：获取精确的月天干 "戊"
                "lunar_month_zhi_exact": lunar_date.getMonthZhiExact(),  # 农历月精确地支：获取精确的月地支 "子"
                "lunar_day_in_ganzhi_exact": lunar_date.getDayInGanZhiExact(),  # 农历日精确干支：获取精确的日干支 "乙亥"
                "lunar_day_in_gan_exact": lunar_date.getDayGanExact(),  # 农历日精确天干：获取精确的日天干 "乙"
                "lunar_day_in_zhi_exact": lunar_date.getDayZhiExact(),  # 农历日精确地支：获取精确的日地支 "亥"
                "lunar_day_in_ganzhi_exact2": lunar_date.getDayInGanZhiExact2(),  # 农历日精确干支2：获取第二种精确的日干支 "乙亥"
                "lunar_day_in_gan_exact2": lunar_date.getDayGanExact2(),  # 农历日精确天干2：获取第二种精确的日天干 "乙"
                "lunar_day_in_zhi_exact2": lunar_date.getDayZhiExact2()  # 农历日精确地支2：获取第二种精确的日地支 "亥"
            },            
            # 节气信息子字典：包含所有节气相关的详细信息
            "jieqi_info": {
                "jieqi_result_a": CalendarAlgorithmCore._get_jieqi_combination(lunar_date)  # 节气组合结果：调用内部方法获取节气排列组合信息
            }
        }
        
        return result  # 返回构建完成的历法信息字典
    
    @staticmethod  # 静态方法装饰器：表示此方法不依赖于类实例
    # 定义农历转公历的核心方法
    def convert_lunar_to_solar(
        lunar_year: int,  # 参数：农历年份，整数类型
        lunar_month: int,  # 参数：农历月份，整数类型
        lunar_day: int,  # 参数：农历日期，整数类型
        hour: int = 0,  # 参数：小时（可选，默认0），整数类型，范围0-23
        minute: int = 0,  # 参数：分钟（可选，默认0），整数类型，范围0-59
        second: int = 0,  # 参数：秒（可选，默认0），整数类型，范围0-59
        is_leap_month: bool = False  # 参数：是否为闰月（可选，默认False），布尔类型
    ) -> Dict:  # 返回值类型注解：返回包含历法信息的字典
        
        # 验证输入数据格式：调用统一验证器的validate_lunar_input方法检查输入参数有效性
        validation_result = calendar_validator.validate_lunar_input(
            str(lunar_year), str(lunar_month), str(lunar_day), 
            str(hour), str(minute), str(second), 
            str(is_leap_month)
        )
        if not validation_result["valid"]:  # 如果验证结果无效
            raise CalendarError(f"[Core层验证] {validation_result.get('error', '未知错误')}")  # 抛出数据格式错误异常
        
        # 尝试执行农历转换操作
        try:
            # 创建农历对象，支持闰月
            if is_leap_month:  # 如果指定为闰月
                # 对于闰月，使用lunar_month的负数表示：lunar-python库约定用负数表示闰月
                lunar_date = Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, hour, minute, second)
            else:  # 如果是普通月份
                lunar_date = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
            
            # 转换为公历：通过农历对象的getSolar()方法获取对应的公历日期对象
            solar_date = lunar_date.getSolar()
            
            # 调用现有的公历转换方法获取完整信息：复用convert_solar_to_lunar方法
            return CalendarAlgorithmCore.convert_solar_to_lunar(
                solar_date.getYear(),
                solar_date.getMonth(),
                solar_date.getDay(),  # 传入公历年月日
                hour, minute, second  # 传入时间参数
            )
        # 捕获转换过程中可能出现的异常
        except Exception as e:
            raise CalendarError(f"农历转换失败: {str(e)}")  # 抛出农历转换失败异常，包含具体错误信息

    @staticmethod
    # 定义内部方法_get_jieqi_combination，用于获取节气组合信息
    def _get_jieqi_combination(lunar_date: Lunar) -> Dict:
        
        try:
            # 获取所有节气的基本信息
            prev_jie_time = lunar_date.getPrevJie().getSolar().toYmdHms()  # 获取前一个节令的公历时间
            prev_jie_name = lunar_date.getPrevJie().getName()  # 获取前一个节令的名称
            next_jie_time = lunar_date.getNextJie().getSolar().toYmdHms()  # 获取后一个节令的公历时间
            next_jie_name = lunar_date.getNextJie().getName()  # 获取后一个节令的名称
            prev_qi_time = lunar_date.getPrevQi().getSolar().toYmdHms()  # 获取前一个气令的公历时间
            prev_qi_name = lunar_date.getPrevQi().getName()  # 获取前一个气令的名称
            next_qi_time = lunar_date.getNextQi().getSolar().toYmdHms()  # 获取后一个气令的公历时间
            next_qi_name = lunar_date.getNextQi().getName()  # 获取后一个气令的名称

            # 获取Solar对象用于时间比较
            prev_jie_solar = lunar_date.getPrevJie().getSolar()  # 获取前一个节令的Solar对象
            prev_qi_solar = lunar_date.getPrevQi().getSolar()  # 获取前一个气令的Solar对象

            # 根据时间顺序确定节气排列
            if prev_jie_solar.isBefore(prev_qi_solar):
                # 节在气之前：节 → 气 → 下一个节
                jieqi_result_a = {
                    "prev_jie": {
                        "name": prev_jie_name,  # 前一个节令的名称
                        "time": prev_jie_time  # 前一个节令的时间
                    },
                    "prev_qi": {
                        "name": prev_qi_name,  # 前一个气令的名称
                        "time": prev_qi_time  # 前一个气令的时间
                    },
                    "new":{
                        "name": "占时",  # 当前时间的标记
                        "time": lunar_date.getSolar().toYmdHms()  # 当前时间的公历表示
                    },
                    "next_jie": {
                        "name": next_jie_name,  # 下一个节令的名称
                        "time": next_jie_time  # 下一个节令的时间
                    },
                    "next_qi": {
                        "name": next_qi_name,  # 下一个气令的名称
                        "time": next_qi_time  # 下一个气令的时间
                    },
                }
            else:
                # 气在节之前：节 → 下一个气 → 下一个节
                jieqi_result_a = {
                    "prev_qi": {
                        "name": prev_qi_name,  # 前一个气令的名称
                        "time": prev_qi_time  # 前一个气令的时间
                    },
                    "prev_jie": {
                        "name": prev_jie_name,  # 前一个节令的名称
                        "time": prev_jie_time  # 前一个节令的时间
                    },
                    "new":{
                        "name": "占时",  # 当前时间的标记
                        "time": lunar_date.getSolar().toYmdHms()  # 当前时间的公历表示
                    },
                    "next_qi": {
                        "name": next_qi_name,  # 下一个气令的名称
                        "time": next_qi_time  # 下一个气令的时间
                    },
                    "next_jie": {
                        "name": next_jie_name,  # 下一个节令的名称
                        "time": next_jie_time  # 下一个节令的时间
                    },
                }

            return jieqi_result_a  # 返回节气组合信息字典
        # 异常处理，返回空字典   
        except Exception as e:
            return {}


# 创建全局算法核心实例：实例化CalendarAlgorithmCore类，便于其他模块直接使用
calendar_algorithm_core = CalendarAlgorithmCore()  # 创建全局实例，提供便捷的API调用方式
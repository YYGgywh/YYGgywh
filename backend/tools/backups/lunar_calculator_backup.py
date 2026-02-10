# backend/src/algorithms/lunar_calculator.py
# 功能：基于lunar-python库的专业历法计算器，完全依赖lunar库进行所有计算
# 注意：闰月用负数表示，如闰2月=-2

from typing import Dict, Optional
from lunar_python import Lunar, Solar

class LunarCalculator:
    """专业历法计算器 - 完全基于lunar-python库实现"""
    
    def __init__(self):
        """初始化历法计算器"""
        pass
    
    def calculate_calendar_info(self, input_data: Dict) -> Dict:
        """
        统一入口方法 - 基于lunar-python库的历法计算
        
        Args:
            input_data: 输入数据字典，支持多种输入格式
                - 公历输入: {"type": "solar", "year": 2025, "month": 12, "day": 6, "hour": 0, "minute": 0, "second": 0}
                - 农历输入: {"type": "lunar", "year": 2025, "month": 10, "day": 17, "hour": 0, "minute": 0, "second": 0}
                - 闰月输入: {"type": "lunar", "year": 2023, "month": -2, "day": 1}  # 闰2月初一
        
        Returns:
            Dict: 包含完整历法信息的字典
        """
        try:
            input_type = input_data.get("type", "solar")
            
            if input_type == "solar":
                return self._calculate_from_solar(input_data)
            elif input_type == "lunar":
                return self._calculate_from_lunar(input_data)
            else:
                raise ValueError(f"不支持的输入类型: {input_type}")
                
        except Exception as e:
            return {
                "success": False,
                "error": f"历法计算失败: {str(e)}",
                "input_data": input_data
            }
    
    def _calculate_from_solar(self, input_data: Dict) -> Dict:
        """从公历输入计算历法信息"""
        year = input_data["year"]
        month = input_data["month"]
        day = input_data["day"]
        hour = input_data.get("hour", 0)
        minute = input_data.get("minute", 0)
        second = input_data.get("second", 0)
        
        # 使用lunar-python库创建Solar对象（自动验证日期有效性）
        solar = Solar.fromYmdHms(year, month, day, hour, minute, second)
        lunar = solar.getLunar()
        
        return self._build_calendar_info(solar, lunar)
    
    def _calculate_from_lunar(self, input_data: Dict) -> Dict:
        """从农历输入计算历法信息"""
        lunar_year = input_data["year"]
        lunar_month = input_data["month"]
        lunar_day = input_data["day"]
        hour = input_data.get("hour", 0)
        minute = input_data.get("minute", 0)
        second = input_data.get("second", 0)
        
        # 使用lunar-python库创建Lunar对象（自动验证日期有效性）
        lunar = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
        solar = lunar.getSolar()
        
        return self._build_calendar_info(solar, lunar)
    
    def _build_calendar_info(self, solar: Solar, lunar: Lunar) -> Dict:
        """构建完整的历法信息字典"""
        
        # 获取公历信息
        solar_year = solar.getYear()
        solar_month = solar.getMonth()
        solar_day = solar.getDay()
        solar_hour = solar.getHour()
        solar_minute = solar.getMinute()
        solar_second = solar.getSecond()
        
        # 获取农历信息
        lunar_year = lunar.getYear()
        lunar_month = lunar.getMonth()
        lunar_day = lunar.getDay()
        
        # 处理月份和日期名称，确保包含"月"和"日"
        lunar_month_name = lunar.getMonthInChinese()
        if lunar_month_name and "月" not in lunar_month_name:
            lunar_month_name = f"{lunar_month_name}月"
            
        lunar_day_name = lunar.getDayInChinese()
        if lunar_day_name and "日" not in lunar_day_name:
            lunar_day_name = f"{lunar_day_name}日"
        
        # 获取星座和节日信息
        try:
            constellation = solar.getXingZuo()
            festivals = solar.getFestivals()
            other_festivals = solar.getOtherFestivals()
        except Exception:
            constellation = ""
            festivals = []
            other_festivals = []
        
        return {
            "success": True,
            "solar_info": {
                "solar_date": solar.toString(),
                "solar_year": solar_year,
                "solar_month": solar_month,
                "solar_day": solar_day,
                "solar_hour": solar_hour,
                "solar_minute": solar_minute,
                "solar_second": solar_second,
                "constellation": constellation,
                "festivals": festivals,
                "other_festivals": other_festivals
            },
            "lunar_info": {
                "lunar_date": lunar.toString(),
                "lunar_year": lunar_year,
                "lunar_month": lunar_month,
                "lunar_day": lunar_day,
                "lunar_year_name": lunar.getYearInChinese(),
                "lunar_month_name": lunar_month_name,
                "lunar_day_name": lunar_day_name,
                "is_leap_month": lunar_month > 0,  # 闰月为正数
                "animal": lunar.getYearShengXiao(),
                "ganzhi_year": lunar.getYearInGanZhi(),
                "ganzhi_month": lunar.getMonthInGanZhi(),
                "ganzhi_day": lunar.getDayInGanZhi()
            }
        }
    
    def validate_solar_date(self, year: int, month: int, day: int, 
                           hour: int = 0, minute: int = 0, second: int = 0) -> Dict:
        """验证公历日期有效性"""
        try:
            solar = Solar.fromYmdHms(year, month, day, hour, minute, second)
            return {
                "success": True,
                "message": "公历日期有效",
                "solar_date": solar.toString()
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"公历日期无效: {str(e)}"
            }
    
    def validate_lunar_date(self, lunar_year: int, lunar_month: int, lunar_day: int,
                           hour: int = 0, minute: int = 0, second: int = 0) -> Dict:
        """验证农历日期有效性"""
        try:
            lunar = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
            return {
                "success": True,
                "message": "农历日期有效",
                "lunar_date": lunar.toString(),
                "solar_date": lunar.getSolar().toString()
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"农历日期无效: {str(e)}"
            }
    
    def get_lunar_month_days(self, lunar_year: int, lunar_month: int) -> Dict:
        """获取农历月份的天数"""
        try:
            # 尝试获取该月的最大天数
            max_days = 30
            for day in range(30, 0, -1):
                try:
                    lunar = Lunar.fromYmdHms(lunar_year, lunar_month, day, 0, 0, 0)
                    max_days = day
                    break
                except:
                    continue
            
            return {
                "success": True,
                "lunar_year": lunar_year,
                "lunar_month": lunar_month,
                "max_days": max_days,
                "is_leap_month": lunar_month > 0,
                "month_type": "大月" if max_days == 30 else "小月"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"无法获取农历月份天数: {str(e)}"
            }

# 测试函数
def test_lunar_calculator():
    """测试专业历法计算器"""
    calculator = LunarCalculator()
    
    print("=== 测试1: 公历日期计算 ===")
    result1 = calculator.calculate_calendar_info({
        "type": "solar",
        "year": 2025,
        "month": 12,
        "day": 6,
        "hour": 12,
        "minute": 0,
        "second": 0
    })
    print(f"输入: 公历2025年12月6日 12:00:00")
    print(f"结果: {result1}")
    
    print("\n=== 测试2: 农历日期计算 ===")
    result2 = calculator.calculate_calendar_info({
        "type": "lunar",
        "year": 2025,
        "month": 10,
        "day": 17,
        "hour": 0,
        "minute": 0,
        "second": 0
    })
    print(f"输入: 农历2025年十月十七日")
    print(f"结果: {result2}")
    
    print("\n=== 测试3: 闰月日期计算 ===")
    result3 = calculator.calculate_calendar_info({
        "type": "lunar",
        "year": 2023,
        "month": -2,
        "day": 1,
        "hour": 0,
        "minute": 0,
        "second": 0
    })
    print(f"输入: 农历2023年闰二月初一")
    print(f"结果: {result3}")
    
    print("\n=== 测试4: 农历月份天数查询 ===")
    result4 = calculator.get_lunar_month_days(2025, 1)  # 2025年正月
    print(f"输入: 农历2025年正月")
    print(f"结果: {result4}")

if __name__ == "__main__":
    test_lunar_calculator()
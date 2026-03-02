# backend/src/validators/calendar_validator.py 2026-02-12 15:30:00
# 功能：统一的历法验证器，专门验证公历时间参数的有效性和合法性

from typing import Dict  # 导入字典类型注解
from lunar_python.util import SolarUtil, LunarUtil  # 导入lunar-python库的SolarUtil类，用于获取月份天数
from lunar_python import LunarYear, LunarMonth  # 导入lunar-python库的LunarYear类和LunarMonth类，用于获取农历年天数和月天数

# 定义统一的历法验证器类，处理所有历法相关的时间参数验证
class CalendarValidator:
    
    # 初始化验证器实例
    def __init__(self):
        self._lunar_year_cache = {}  # 缓存LunarYear对象，避免重复创建
        self._lunar_month_cache = {}  # 缓存LunarMonth对象，避免重复创建
    
    # 私有方法：获取或创建LunarYear对象（带缓存）
    def _get_lunar_year_obj(self, lunar_year):
        """获取或创建LunarYear对象，使用缓存避免重复创建"""
        if lunar_year not in self._lunar_year_cache:
            self._lunar_year_cache[lunar_year] = LunarYear.fromYear(lunar_year)
        return self._lunar_year_cache[lunar_year]
    
    # 私有方法：获取或创建LunarMonth对象（带缓存）
    def _get_lunar_month_obj(self, lunar_year, lunar_month):
        """获取或创建LunarMonth对象，使用缓存避免重复创建"""
        cache_key = (lunar_year, lunar_month)
        if cache_key not in self._lunar_month_cache:
            self._lunar_month_cache[cache_key] = LunarMonth.fromYm(lunar_year, lunar_month)
        return self._lunar_month_cache[cache_key]

    # 公开方法：验证公历时间参数
    def validate_solar_input(self, year, month, day, hour, minute, second) -> Dict:
        
        # ====== 步骤1：验证参数类型和正负性 ======
        try:
            # 1.1 验证所有参数是否为字符串
            if not all(isinstance(x, str) for x in [year, month, day, hour, minute, second]):
                return {"valid": False, "error": "年、月、日、时、分、秒必须是字符串类型"}
            
            # 1.2 转换为整数
            year = int(year)
            month = int(month)
            day = int(day)
            hour = int(hour)
            minute = int(minute)
            second = int(second)
            
            # 1.3 验证转换后是否为非负数
            if any(x < 0 for x in [year, month, day, hour, minute, second]):
                return {"valid": False, "error": "年、月、日、时、分、秒转换后不能为负数"}
            
        # 捕获字符串转整数时可能出现的值错误或类型错误
        except (ValueError, TypeError) as e:            
            return {"valid": False, "error": f"参数类型转换失败：{str(e)}"}
        
        # ====== 步骤2：验证年、月范围 ======
        # 2.1 验证年份范围 1-9999
        if not (1 <= year <= 9999):
            return {"valid": False, "error": f"年份范围必须是1-9999，当前值：{year}"}
        
        # 2.2 验证月份范围 1-12
        if not (1 <= month <= 12):
            return {"valid": False, "error": f"月份范围必须是1-12，当前值：{month}"}
        
        # ====== 步骤3：验证日值范围 ======
        try:
            # 3.1 使用SolarUtil.getDaysOfMonth获取当月总天数
            days_of_month = SolarUtil.getDaysOfMonth(year, month)
            
            # 3.2 验证日值是否小于等于当月总天数
            if day > days_of_month:
                return {"valid": False, "error": f"{year}年{month}月只有{days_of_month}天，当前值：{day}"}
                
        except Exception as e:
            return {"valid": False, "error": f"获取当月总天数失败：{str(e)}"}
        
        # ====== 步骤4：验证小时范围 ======
        if not (0 <= hour <= 23):
            return {"valid": False, "error": f"小时范围必须是0-23，当前值：{hour}"}
        
        # ====== 步骤5：验证分钟和秒数范围 ======
        if not (0 <= minute <= 59):
            return {"valid": False, "error": f"分钟范围必须是0-59，当前值：{minute}"}
        
        if not (0 <= second <= 59):
            return {"valid": False, "error": f"秒数范围必须是0-59，当前值：{second}"}
        
        # ====== 步骤6：验证完成 ======
        return {"valid": True, "message": "公历时间验证通过"}

    # 公开方法：验证农历时间参数
    def validate_lunar_input(self, lunar_year, lunar_month, lunar_day, hour, minute, second, is_leap_month) -> Dict:
        
        # ====== 步骤1：验证参数类型和正负性 ======
        try:
            # 1.1 验证年、月、日、时、分、秒是否为字符串
            if not all(isinstance(x, str) for x in [lunar_year, lunar_month, lunar_day, hour, minute, second]):
                return {"valid": False, "error": "年、月、日、时、分、秒必须是字符串类型"}
            
            # 1.2 验证is_leap_month是否为字符串
            if not isinstance(is_leap_month, str):
                return {"valid": False, "error": "is_leap_month必须是字符串类型"}
            
            # 1.3 转换年、月、日、时、分、秒为整数
            lunar_year = int(lunar_year)
            lunar_month = int(lunar_month)
            lunar_day = int(lunar_day)
            hour = int(hour)
            minute = int(minute)
            second = int(second)
            
            # 1.4 验证转换后是否为非负数
            if any(x < 0 for x in [lunar_year, lunar_month, lunar_day, hour, minute, second]):
                return {"valid": False, "error": "年、月、日、时、分、秒转换后不能为负数"}
            
            # 1.5 转换is_leap_month为布尔值
            is_leap_month_lower = is_leap_month.lower()
            if is_leap_month_lower == "true":
                is_leap_month = True
            elif is_leap_month_lower == "false":
                is_leap_month = False
            else:
                return {"valid": False, "error": "is_leap_month必须是字符串'true'或'false'"}
            
        # 捕获字符串转整数时可能出现的值错误或类型错误
        except (ValueError, TypeError) as e:            
            return {"valid": False, "error": f"参数类型转换失败：{str(e)}"}
        
        # ====== 步骤2：验证年、月范围 ======
        # 2.1 验证年份范围 1-9999
        if not (1 <= lunar_year <= 9999):
            return {"valid": False, "error": f"年份范围必须是1-9999，当前值：{lunar_year}"}
        
        # 2.2 验证月份范围 1-12
        if not (1 <= lunar_month <= 12):
            return {"valid": False, "error": f"月份范围必须是1-12，当前值：{lunar_month}"}
        
        # ====== 步骤3：验证闰月 ======
        # 3.1 如果is_leap_month为true，验证当年是否有该闰月
        if is_leap_month:
            # 3.2 使用缓存获取LunarYear对象，然后获取闰月月份
            lunar_year_obj = self._get_lunar_year_obj(lunar_year)
            leap_month = lunar_year_obj.getLeapMonth()
            
            # 3.3 验证当年闰月月份是否等于传参的月值
            if leap_month == 0:
                return {"valid": False, "error": f"{lunar_year}年没有闰月"}
            elif leap_month != lunar_month:
                return {"valid": False, "error": f"{lunar_year}年的闰月是{leap_month}月，当前值：{lunar_month}月"}
        
        # ====== 步骤4：验证日值范围 ======
        try:
            # 4.1 使用缓存获取LunarMonth对象
            lunar_month_obj = self._get_lunar_month_obj(lunar_year, lunar_month)
            
            # 4.2 使用getDayCount获取当月总天数
            days_of_month = lunar_month_obj.getDayCount()
            
            # 4.3 验证日值是否小于等于当月总天数
            if lunar_day > days_of_month:
                return {"valid": False, "error": f"{lunar_year}年{lunar_month}月只有{days_of_month}天，当前值：{lunar_day}"}
                
        except Exception as e:
            return {"valid": False, "error": f"获取农历当月总天数失败：{str(e)}"}
        
        # ====== 步骤5：验证小时范围 ======
        if not (0 <= hour <= 23):
            return {"valid": False, "error": f"小时范围必须是0-23，当前值：{hour}"}
        
        # ====== 步骤6：验证分钟和秒数范围 ======
        if not (0 <= minute <= 59):
            return {"valid": False, "error": f"分钟范围必须是0-59，当前值：{minute}"}
        
        if not (0 <= second <= 59):
            return {"valid": False, "error": f"秒数范围必须是0-59，当前值：{second}"}
        
        # ====== 步骤7：验证完成 ======
        return {"valid": True, "message": "农历时间验证通过"}


# 创建全局验证器实例，便于其他模块直接使用
calendar_validator = CalendarValidator()

"""
数据验证工具模块
提供统一的数据验证功能
"""

from typing import Dict, Any, Tuple
from datetime import datetime
import re


class DataValidator:
    """数据验证器"""
    
    @staticmethod
    def validate_solar_date(year: int, month: int, day: int) -> Tuple[bool, str]:
        """验证公历日期"""
        try:
            # 基本范围验证
            if not (1900 <= year <= 2100):
                return False, "年份超出范围(1900-2100)"
            
            if not (1 <= month <= 12):
                return False, "月份超出范围(1-12)"
            
            if not (1 <= day <= 31):
                return False, "日期超出范围(1-31)"
            
            # 具体日期验证
            try:
                datetime(year, month, day)
            except ValueError:
                return False, "无效的日期"
            
            return True, "验证通过"
            
        except Exception as e:
            return False, f"日期验证异常: {str(e)}"
    
    @staticmethod
    def validate_time(hour: int, minute: int, second: int) -> Tuple[bool, str]:
        """验证时间参数"""
        try:
            if not (0 <= hour <= 23):
                return False, "小时超出范围(0-23)"
            
            if not (0 <= minute <= 59):
                return False, "分钟超出范围(0-59)"
            
            if not (0 <= second <= 59):
                return False, "秒超出范围(0-59)"
            
            return True, "验证通过"
            
        except Exception as e:
            return False, f"时间验证异常: {str(e)}"
    
    @staticmethod
    def validate_lunar_date(lunar_year: int, lunar_month: int, lunar_day: int) -> Tuple[bool, str]:
        """验证农历日期"""
        try:
            # 基本范围验证
            if not (1900 <= lunar_year <= 2100):
                return False, "农历年份超出范围(1900-2100)"
            
            if not (1 <= lunar_month <= 12):
                return False, "农历月份超出范围(1-12)"
            
            if not (1 <= lunar_day <= 30):
                return False, "农历日期超出范围(1-30)"
            
            return True, "验证通过"
            
        except Exception as e:
            return False, f"农历日期验证异常: {str(e)}"
    
    @staticmethod
    def validate_pillars(year_pillar: str, month_pillar: str, day_pillar: str, hour_pillar: str) -> Tuple[bool, str]:
        """验证四柱格式"""
        try:
            pillars = [year_pillar, month_pillar, day_pillar, hour_pillar]
            
            # 检查长度
            for pillar in pillars:
                if len(pillar) != 2:
                    return False, f"四柱格式错误: {pillar} 应为2个字符"
            
            # 检查天干地支
            heavenly_stems = "甲乙丙丁戊己庚辛壬癸"
            earthly_branches = "子丑寅卯辰巳午未申酉戌亥"
            
            for pillar in pillars:
                if pillar[0] not in heavenly_stems:
                    return False, f"天干格式错误: {pillar[0]}"
                if pillar[1] not in earthly_branches:
                    return False, f"地支格式错误: {pillar[1]}"
            
            return True, "验证通过"
            
        except Exception as e:
            return False, f"四柱验证异常: {str(e)}"
    
    @staticmethod
    def validate_calendar_request(data: Dict[str, Any]) -> Tuple[bool, str]:
        """验证历法请求数据"""
        try:
            # 检查必填字段
            required_fields = ['year', 'month', 'day']
            for field in required_fields:
                if field not in data:
                    return False, f"缺少必填字段: {field}"
            
            # 验证日期
            is_valid, message = DataValidator.validate_solar_date(
                data['year'], data['month'], data['day']
            )
            if not is_valid:
                return False, message
            
            # 验证时间（如果提供）
            if 'hour' in data or 'minute' in data or 'second' in data:
                hour = data.get('hour', 0)
                minute = data.get('minute', 0)
                second = data.get('second', 0)
                
                is_valid, message = DataValidator.validate_time(hour, minute, second)
                if not is_valid:
                    return False, message
            
            return True, "验证通过"
            
        except Exception as e:
            return False, f"请求数据验证异常: {str(e)}"


def validate_request_data(func):
    """请求数据验证装饰器"""
    def wrapper(*args, **kwargs):
        try:
            # 获取请求数据
            request_data = kwargs.get('request_data', {})
            
            # 验证数据
            is_valid, message = DataValidator.validate_calendar_request(request_data)
            if not is_valid:
                return {
                    "success": False,
                    "error": message,
                    "valid": False
                }
            
            # 调用原始函数
            return func(*args, **kwargs)
            
        except Exception as e:
            return {
                "success": False,
                "error": f"数据验证异常: {str(e)}",
                "valid": False
            }
    
    return wrapper
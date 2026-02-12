#!/usr/bin/env python3
"""
边界条件测试脚本
用于检查特殊日期和边界情况的转换结果偏差
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from core.calendar_algorithm_core import CalendarAlgorithmCore
from algorithms.calendar_calculator import CalendarConverter

def test_leap_years():
    """测试闰年转换"""
    print("=== 闰年转换测试 ===")
    
    # 闰年测试用例
    leap_years = [
        (2020, 2, 29),  # 闰年2月29日
        (2024, 2, 29),  # 闰年2月29日
        (2000, 2, 29),  # 世纪闰年
    ]
    
    for year, month, day in leap_years:
        print(f"\n测试闰年: {year}-{month}-{day}")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarAlgorithmCore.convert_solar_to_lunar(year, month, day)
            service_lunar = service_result["lunar_collection"]
            print(f"calendar_service.py: 农历 {service_lunar['lunar_year']}年{service_lunar['lunar_month']}月{service_lunar['lunar_day']}日")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(year, month, day, is_solar=True)
            if calc_result["valid"]:
                calc_lunar = calc_result["lunar_info"]
                print(f"calendar_calculator.py: 农历 {calc_lunar['lunar_year']}年{calc_lunar['lunar_month']}月{calc_lunar['lunar_day']}日")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 移除lunar_calculator.py测试，功能已被calendar_calculator.py覆盖
        print("lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def test_lunar_leap_months():
    """测试农历闰月转换"""
    print("\n=== 农历闰月转换测试 ===")
    
    # 农历闰月测试用例
    leap_months = [
        (2023, 2, 1),  # 2023年闰二月
        (2020, 4, 1),  # 2020年闰四月
        (2017, 6, 1),  # 2017年闰六月
    ]
    
    for lunar_year, lunar_month, lunar_day in leap_months:
        print(f"\n测试农历闰月: 农历{lunar_year}年闰{lunar_month}月{lunar_day}日")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_lunar_to_solar(lunar_year, lunar_month, lunar_day, is_leap=True)
            service_solar = service_result["solar_info"]
            print(f"calendar_service.py: 公历 {service_solar['date']}")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(lunar_year, lunar_month, lunar_day, is_solar=False, is_leap=True)
            if calc_result["valid"]:
                calc_solar = calc_result["solar_info"]
                print(f"calendar_calculator.py: 公历 {calc_solar['solar_YmdHms']}")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 移除lunar_calculator.py测试，功能已被calendar_calculator.py覆盖
        print("lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def test_boundary_dates():
    """测试边界日期转换"""
    print("\n=== 边界日期转换测试 ===")
    
    # 边界日期测试用例
    boundary_cases = [
        (1900, 1, 1),   # 最小年份
        (2100, 12, 31), # 最大年份
        (2000, 1, 1),   # 世纪之交
        (2024, 12, 31), # 当前年份边界
    ]
    
    for year, month, day in boundary_cases:
        print(f"\n测试边界日期: {year}-{month}-{day}")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_solar_to_lunar(year, month, day)
            service_lunar = service_result["lunar_collection"]
            print(f"calendar_service.py: 农历 {service_lunar['lunar_year']}年{service_lunar['lunar_month']}月{service_lunar['lunar_day']}日")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(year, month, day, is_solar=True)
            if calc_result["valid"]:
                calc_lunar = calc_result["lunar_info"]
                print(f"calendar_calculator.py: 农历 {calc_lunar['lunar_year']}年{calc_lunar['lunar_month']}月{calc_lunar['lunar_day']}日")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 移除lunar_calculator.py测试，功能已被calendar_calculator.py覆盖
        print("lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def test_time_components():
    """测试时间组件转换"""
    print("\n=== 时间组件转换测试 ===")
    
    # 时间组件测试用例
    time_cases = [
        (2024, 12, 6, 0, 0, 0),   # 午夜
        (2024, 12, 6, 12, 0, 0),  # 正午
        (2024, 12, 6, 23, 59, 59), # 午夜前
    ]
    
    for year, month, day, hour, minute, second in time_cases:
        print(f"\n测试时间: {year}-{month}-{day} {hour:02d}:{minute:02d}:{second:02d}")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_solar_to_lunar(year, month, day, hour, minute, second)
            service_lunar = service_result["lunar_collection"]
            service_hour_pillar = service_result["hour_pillar"]
            print(f"calendar_service.py: 农历 {service_lunar['lunar_year']}年{service_lunar['lunar_month']}月{service_lunar['lunar_day']}日 时柱: {service_hour_pillar}")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(year, month, day, hour, minute, second, is_solar=True)
            if calc_result["valid"]:
                calc_lunar = calc_result["lunar_info"]
                calc_hour_pillar = calc_result["hour_pillar"]
                print(f"calendar_calculator.py: 农历 {calc_lunar['lunar_year']}年{calc_lunar['lunar_month']}月{calc_lunar['lunar_day']}日 时柱: {calc_hour_pillar}")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 使用lunar_calculator.py转换
        try:
            lunar_calc = LunarCalculator()
            lunar_input = {"type": "solar", "year": year, "month": month, "day": day, "hour": hour, "minute": minute, "second": second}
            lunar_result = lunar_calc.calculate_calendar_info(lunar_input)
            if lunar_result["success"]:
                lunar_info = lunar_result["lunar_info"]
                hour_pillar = lunar_result.get("hour_pillar", "未知")
                print(f"lunar_calculator.py: 农历 {lunar_info['lunar_year']}年{lunar_info['lunar_month']}月{lunar_info['lunar_day']}日 时柱: {hour_pillar}")
            else:
                print(f"lunar_calculator.py 转换失败: {lunar_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"lunar_calculator.py 转换失败: {e}")

def main():
    """主测试函数"""
    print("开始执行边界条件转换测试...")
    
    # 执行各项测试
    test_leap_years()
    test_lunar_leap_months()
    test_boundary_dates()
    test_time_components()
    
    print("\n=== 边界条件测试完成 ===")

if __name__ == "__main__":
    main()
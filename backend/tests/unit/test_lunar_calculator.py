#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试专业历法计算器 - 基于CalendarConverter类
"""

import sys
import os
# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../src'))

from algorithms.calendar_calculator import CalendarConverter

def test_solar_validation():
    """测试公历日期验证"""
    calculator = CalendarConverter()
    
    print("=== 测试公历日期验证 ===")
    
    test_cases = [
        (1, 1, 1, "应该成功：公元1年1月1日"),
        (9999, 12, 31, "应该成功：公元9999年12月31日"),
        (2025, 2, 29, "应该失败：2025年不是闰年"),
        (2024, 2, 29, "应该成功：2024年是闰年"),
        (2025, 4, 31, "应该失败：4月只有30天"),
        (2025, 13, 1, "应该失败：月份超范围"),
        (0, 1, 1, "应该失败：年份太小"),
        (10000, 1, 1, "应该失败：年份太大"),
    ]
    
    for year, month, day, description in test_cases:
        result = calculator.validate_solar_input(year, month, day)
        status = "✓" if result["success"] and result["valid"] else "✗"
        print(f"{status} {year}年{month}月{day}日 - {description}")
        if not result["valid"]:
            print(f"  错误信息: {result['error']}")

def test_lunar_validation():
    """测试农历日期验证"""
    calculator = CalendarConverter()
    
    print("\n=== 测试农历日期验证 ===")
    
    test_cases = [
        (2025, 1, 29, "应该成功：2025年正月小月29天"),
        (2025, 1, 30, "应该失败：2025年正月只有29天"),
        (2025, 2, 30, "应该成功：2025年二月大月30天"),
        (2025, 2, 31, "应该失败：农历没有31天"),
        (2023, -2, 29, "应该成功：2023年闰二月小月29天"),
        (2023, -2, 30, "应该失败：2023年闰二月只有29天"),
        (2025, 13, 1, "应该失败：月份超范围"),
        (1899, 1, 1, "应该失败：年份太小"),
        (2101, 1, 1, "应该失败：年份太大"),
    ]
    
    for lunar_year, lunar_month, lunar_day, description in test_cases:
        result = calculator.validate_lunar_input(lunar_year, lunar_month, lunar_day)
        status = "✓" if result["success"] and result["valid"] else "✗"
        month_desc = f"{abs(lunar_month)}月" if lunar_month < 0 else f"{lunar_month}月"
        print(f"{status} 农历{lunar_year}年{month_desc}{lunar_day}日 - {description}")
        if not result["valid"]:
            print(f"  错误信息: {result['error']}")

def test_calendar_conversion():
    """测试历法转换"""
    calculator = CalendarConverter()
    
    print("\n=== 测试历法转换 ===")
    
    # 测试公历转农历
    print("1. 公历转农历:")
    result1 = calculator.convert_calendar(2025, 12, 6, 12, 0, 0, is_solar=True)
    
    if result1["success"] and result1["valid"]:
        solar_info = result1["solar_info"]
        lunar_info = result1["lunar_info"]
        ganzhi_info = result1["ganzhi_info"]
        print(f"✓ 公历: {solar_info['solar_Ymd']}")
        print(f"  农历: {lunar_info['lunar_year']}年{lunar_info['lunar_month']}月{lunar_info['lunar_day']}日")
        # 使用_get_ganzhi_info方法实际返回的字段名
        print(f"  干支: {ganzhi_info['lunar_year_in_ganzhi_exact']}年 {ganzhi_info['lunar_month_in_ganzhi_exact']}月 {ganzhi_info['lunar_day_in_ganzhi_exact']}日")
    else:
        print(f"✗ 转换失败: {result1['error']}")
    
    # 测试农历转公历
    print("\n2. 农历转公历:")
    result2 = calculator.convert_calendar(2025, 10, 17, 0, 0, 0, is_solar=False)
    
    if result2["success"] and result2["valid"]:
        solar_info = result2["solar_info"]
        lunar_info = result2["lunar_info"]
        print(f"✓ 农历: {lunar_info['lunar_year']}年{lunar_info['lunar_month']}月{lunar_info['lunar_day']}日")
        print(f"  公历: {solar_info['solar_Ymd']}")
    else:
        print(f"✗ 转换失败: {result2['error']}")
    
    # 测试闰月转换
    print("\n3. 闰月转换:")
    result3 = calculator.convert_calendar(2023, -2, 1, 0, 0, 0, is_solar=False)
    
    if result3["success"] and result3["valid"]:
        solar_info = result3["solar_info"]
        lunar_info = result3["lunar_info"]
        print(f"✓ 农历: {lunar_info['lunar_year']}年{lunar_info['lunar_month']}月{lunar_info['lunar_day']}日")
        print(f"  公历: {solar_info['solar_Ymd']}")
    else:
        print(f"✗ 转换失败: {result3['error']}")

def test_boundary_years():
    """测试边界年份"""
    calculator = CalendarConverter()
    
    print("\n=== 测试边界年份 ===")
    
    boundary_years = [1, 100, 1000, 1900, 2000, 9999]
    
    for year in boundary_years:
        result = calculator.validate_solar_input(year, 1, 1)
        status = "✓" if result["success"] and result["valid"] else "✗"
        print(f"{status} 公元{year}年1月1日")
        if result["success"] and result["valid"]:
            # 测试转换
            conv_result = calculator.convert_calendar(year, 1, 1, is_solar=True)
            if conv_result["success"] and conv_result["valid"]:
                lunar_info = conv_result["lunar_info"]
                print(f"  对应农历: {lunar_info['lunar_year']}年{lunar_info['lunar_month']}月{lunar_info['lunar_day']}日")

if __name__ == "__main__":
    print("开始测试专业历法计算器...\n")
    
    test_solar_validation()
    test_lunar_validation()
    test_calendar_conversion()
    test_boundary_years()
    
    print("\n测试完成！")

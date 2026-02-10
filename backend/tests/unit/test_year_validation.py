#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试公历年范围验证和农历大小月天数界定
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from algorithms.calendar_calculator import CalendarConverter

def test_solar_year_range():
    """测试公历年范围验证"""
    calculator = CalendarConverter()
    
    print("=== 测试公历年范围验证 ===")
    
    # 测试边界值
    test_cases = [
        (0, 1, 1, "应该失败：年份太小"),
        (1, 1, 1, "应该成功：最小年份"),
        (9999, 12, 31, "应该成功：最大年份"),
        (10000, 1, 1, "应该失败：年份太大"),
        (2025, 1, 1, "应该成功：正常年份"),
    ]
    
    for year, month, day, description in test_cases:
        try:
            # 使用convert_calendar方法间接测试日期验证
            result = calculator.convert_calendar(year, month, day, 0, is_solar=True)
            if result["success"]:
                print(f"✓ {year}年{month}月{day}日 - {description} - 验证通过")
            else:
                print(f"✗ {year}年{month}月{day}日 - {description} - 验证失败: {result.get('error_message', '未知错误')}")
        except Exception as e:
            print(f"✗ {year}年{month}月{day}日 - {description} - 验证失败: {e}")

def test_lunar_month_days():
    """测试农历大小月天数界定"""
    calculator = CalendarConverter()
    
    print("\n=== 测试农历大小月天数界定 ===")
    
    # 测试已知的大小月案例
    test_cases = [
        # (年份, 月份, 日期, 期望结果, 描述)
        (2025, 1, 29, "应该成功：2025年正月小月29天"),
        (2025, 1, 30, "应该失败：2025年正月只有29天"),
        (2025, 2, 30, "应该成功：2025年二月大月30天"),
        (2025, 2, 31, "应该失败：农历没有31天"),
        (2025, 10, 30, "应该成功：2025年十月大月30天"),
        (2025, 10, 31, "应该失败：农历没有31天"),
        (2023, -2, 29, "应该成功：2023年闰二月小月29天"),
        (2023, -2, 30, "应该失败：2023年闰二月只有29天"),
    ]
    
    for lunar_year, lunar_month, lunar_day, description in test_cases:
        try:
            # 使用convert_calendar方法间接测试农历日期验证
            result = calculator.convert_calendar(lunar_year, abs(lunar_month), lunar_day, 0, is_solar=False, is_leap_month=lunar_month < 0)
            if result["success"]:
                print(f"✓ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证通过")
            else:
                print(f"✗ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证失败: {result.get('error_message', '未知错误')}")
        except Exception as e:
            print(f"✗ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证失败: {e}")

def test_lunar_year_range():
    """测试农历年范围验证"""
    calculator = CalendarConverter()
    
    print("\n=== 测试农历年范围验证 ===")
    
    # 测试农历年边界值
    test_cases = [
        (1899, 1, 1, "应该失败：年份太小"),
        (1900, 1, 1, "应该成功：最小年份"),
        (2100, 12, 30, "应该成功：最大年份"),
        (2101, 1, 1, "应该失败：年份太大"),
    ]
    
    for lunar_year, lunar_month, lunar_day, description in test_cases:
        try:
            # 使用convert_calendar方法间接测试农历年份范围
            result = calculator.convert_calendar(lunar_year, lunar_month, lunar_day, 0, is_solar=False)
            if result["success"]:
                print(f"✓ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证通过")
            else:
                print(f"✗ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证失败: {result.get('error_message', '未知错误')}")
        except Exception as e:
            print(f"✗ 农历{lunar_year}年{lunar_month}月{lunar_day}日 - {description} - 验证失败: {e}")

def test_lunar_python_compatibility():
    """测试与lunar-python库的兼容性"""
    print("\n=== 测试与lunar-python库的兼容性 ===")
    
    # 测试lunar-python库支持的范围
    from lunar_python import Lunar, Solar
    
    # 测试边界年份
    boundary_years = [1, 9999]
    
    for year in boundary_years:
        try:
            # 测试创建农历对象
            lunar = Lunar.fromYmdHms(year, 1, 1, 0, 0, 0)
            solar = lunar.getSolar()
            print(f"✓ lunar-python支持{year}年: 农历{year}年1月1日 → 公历{solar.getYear()}-{solar.getMonth()}-{solar.getDay()}")
        except Exception as e:
            print(f"✗ lunar-python不支持{year}年: {e}")

if __name__ == "__main__":
    print("开始测试公历年范围验证和农历大小月天数界定...\n")
    
    test_solar_year_range()
    test_lunar_month_days()
    test_lunar_year_range()
    test_lunar_python_compatibility()
    
    print("\n测试完成！")
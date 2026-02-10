#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试历法计算器统一入口方法
"""

import sys
import os

# 添加父目录到路径，以便导入calendar_calculator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.algorithms.calendar_calculator import CalendarConverter

def test_unified_calendar():
    """测试统一入口方法"""
    calculator = CalendarConverter()
    
    print("=== 测试历法计算器统一入口方法 ===\n")
    
    # 测试1：公历输入
    print("1. 测试公历输入：")
    try:
        solar_input = {
            "type": "solar",
            "year": 2024,
            "month": 12,
            "day": 6,
            "hour": 14,
            "minute": 30,
            "second": 0
        }
        result = calculator.calculate_calendar_info(solar_input)
        print(f"   输入: 公历 {solar_input['year']}年{solar_input['month']}月{solar_input['day']}日")
        print(f"   结果: {result['success']}")
        print(f"   公历时间: {result.get('solar_datetime', 'N/A')}")
        print(f"   农历信息: {result.get('lunar_info', {}).get('lunar_date', 'N/A')}")
        print(f"   节气信息: {result.get('jieqi_info', {}).get('jieqi_name', 'N/A')}")
        print(f"   星座信息: {result.get('constellation_info', {}).get('constellation', 'N/A')}")
        print()
    except Exception as e:
        print(f"   错误: {e}")
        print()
    
    # 测试2：农历输入（目前暂不支持）
    print("2. 测试农历输入（暂不支持）：")
    try:
        lunar_input = {
            "type": "lunar",
            "year": 2024,
            "month": 11,
            "day": 6
        }
        result = calculator.calculate_calendar_info(lunar_input)
        print(f"   输入: 农历 {lunar_input['year']}年{lunar_input['month']}月{lunar_input['day']}日")
        print(f"   结果: {result}")
        print()
    except NotImplementedError as e:
        print(f"   预期错误: {e}")
        print()
    except Exception as e:
        print(f"   其他错误: {e}")
        print()
    
    # 测试3：干支输入（目前暂不支持）
    print("3. 测试干支输入（暂不支持）：")
    try:
        ganzhi_input = {
            "type": "ganzhi",
            "year": "甲子",
            "month": "乙丑",
            "day": "丙寅"
        }
        result = calculator.calculate_calendar_info(ganzhi_input)
        print(f"   输入: 干支 {ganzhi_input['year']}年{ganzhi_input['month']}月{ganzhi_input['day']}日")
        print(f"   结果: {result}")
        print()
    except NotImplementedError as e:
        print(f"   预期错误: {e}")
        print()
    except Exception as e:
        print(f"   其他错误: {e}")
        print()
    
    # 测试4：错误输入类型
    print("4. 测试错误输入类型：")
    try:
        invalid_input = {
            "type": "invalid",
            "year": 2024,
            "month": 1,
            "day": 1
        }
        result = calculator.calculate_calendar_info(invalid_input)
        print(f"   输入: 无效类型 {invalid_input['type']}")
        print(f"   结果: {result}")
        print()
    except ValueError as e:
        print(f"   预期错误: {e}")
        print()
    except Exception as e:
        print(f"   其他错误: {e}")
        print()
    
    # 测试5：缺少必要字段
    print("5. 测试缺少必要字段：")
    try:
        missing_input = {
            "type": "solar",
            "year": 2024
            # 缺少month和day字段
        }
        result = calculator.calculate_calendar_info(missing_input)
        print(f"   输入: 缺少字段 {missing_input}")
        print(f"   结果: {result}")
        print()
    except Exception as e:
        print(f"   错误: {e}")
        print()
    
    print("=== 测试完成 ===")

if __name__ == "__main__":
    test_unified_calendar()
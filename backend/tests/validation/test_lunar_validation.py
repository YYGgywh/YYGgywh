#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试农历日期验证逻辑
"""

import sys
import os

# 添加backend目录到Python路径
sys.path.append(os.path.dirname(__file__))

from src.algorithms.calendar_calculator import CalendarValidator

def test_lunar_validation():
    """测试农历日期验证功能"""
    print("=== 农历日期验证测试 ===")
    print()
    
    validator = CalendarValidator()
    
    # 测试用例
    test_cases = [
        # (lunar_year, lunar_month, lunar_day, expected_result, description)
        (2025, 1, 1, "通过", "正常农历日期"),
        (2025, -2, 1, "通过", "闰二月日期（如果2025年有闰二月）"),
        (2025, 1, 31, "失败", "农历大月31日（不存在）"),
        (2025, 2, 30, "失败", "农历小月30日（不存在）"),
        (2025, 13, 1, "失败", "月份超出范围"),
        (2025, 0, 1, "失败", "月份为0"),
        (2025, -13, 1, "失败", "闰月超出范围"),
        (2025, 1, 0, "失败", "日期为0"),
        (2025, 1, 31, "失败", "日期超出30"),
        (1899, 1, 1, "失败", "年份过小"),
        (2101, 1, 1, "失败", "年份过大"),
        (2023, -2, 1, "通过", "2023年闰二月（真实存在）"),
        (2024, -2, 1, "失败", "2024年没有闰二月"),
    ]
    
    passed = 0
    failed = 0
    
    for lunar_year, lunar_month, lunar_day, expected, description in test_cases:
        try:
            result = validator.validate_lunar_input(lunar_year, lunar_month, lunar_day)
            actual = "通过" if result["valid"] else "失败"
            
            if expected == "通过" and result["valid"]:
                status = "✓ 通过"
                passed += 1
            elif expected == "失败" and not result["valid"]:
                status = "✓ 通过（正确失败）"
                passed += 1
            elif expected == "通过" and not result["valid"]:
                status = f"✗ 失败（应通过但失败: {result.get('error', '未知错误')}）"
                failed += 1
            else:
                status = "✗ 失败（应失败但通过）"
                failed += 1
        except Exception as e:
            actual = "异常"
            status = f"✗ 异常: {str(e)}"
            failed += 1
        
        print(f"{status} - {description}")
        print(f"  输入: {lunar_year}年{lunar_month}月{lunar_day}日")
        if actual == "失败":
            print(f"  结果: {actual}")
        print()
    
    print(f"=== 测试结果 ===")
    print(f"通过: {passed}")
    print(f"失败: {failed}")
    print(f"总计: {passed + failed}")
    
    # 测试便捷验证函数
    print("\n=== 便捷验证函数测试 ===")
    
    from src.algorithms.calendar_calculator import validate_lunar_date
    
    lunar_test_cases = [
        (2025, 1, 1, "正常农历日期"),
        (2025, 1, 31, "无效农历日期"),
    ]
    
    for lunar_year, lunar_month, lunar_day, description in lunar_test_cases:
        try:
            result = validate_lunar_date(lunar_year, lunar_month, lunar_day)
            if result["valid"]:
                print(f"✓ {description} - 验证通过")
            else:
                print(f"✗ {description} - 验证失败: {result.get('error', '未知错误')}")
        except Exception as e:
            print(f"✗ {description} - 异常: {str(e)}")
        print()

if __name__ == "__main__":
    test_lunar_validation()
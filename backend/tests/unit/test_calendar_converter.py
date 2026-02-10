#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试CalendarConverter类的双向转换功能
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from algorithms.calendar_calculator import CalendarConverter

def test_calendar_converter():
    """测试历法双向转换功能"""
    converter = CalendarConverter()
    
    print("=== 测试公历转农历 ===")
    # 测试公历转农历：2024年1月1日
    result1 = converter.convert_calendar(2024, 1, 1, 12, 0, 0, is_solar=True)
    print(f"公历转农历结果: {result1}")
    
    print("\n=== 测试农历转公历 ===")
    # 测试农历转公历：2023年11月20日
    result2 = converter.convert_calendar(2023, 11, 20, 0, 0, 0, is_solar=False)
    print(f"农历转公历结果: {result2}")
    
    print("\n=== 测试闰月转换 ===")
    # 测试闰月转换：2023年闰二月
    result3 = converter.convert_calendar(2023, -2, 15, 0, 0, 0, is_solar=False)
    print(f"农历闰月转公历结果: {result3}")
    
    print("\n=== 测试错误输入 ===")
    # 测试错误输入：无效的日期
    result4 = converter.convert_calendar(2024, 2, 30, 0, 0, 0, is_solar=True)
    print(f"错误输入结果: {result4}")

if __name__ == "__main__":
    test_calendar_converter()
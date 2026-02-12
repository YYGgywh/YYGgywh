#!/usr/bin/env python3
"""
基本历法功能测试脚本
"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_basic_calendar():
    """测试基本历法功能"""
    print("=== 测试当前时间 ===")
    from core.calendar_algorithm_core import CalendarAlgorithmCore
    
    try:
        # 测试当前时间转换
        current = CalendarAlgorithmCore.get_current_calendar_info()
        print(f'公历: {current["solar"]["date"]}')
        print(f'农历: {current["lunar"]["full_string"]}')
        print(f'年干支: {current["ganzhi"]["year"]["ganzhi"]}')
        print(f'月干支: {current["ganzhi"]["month"]["ganzhi"]}')
        print(f'日干支: {current["ganzhi"]["day"]["ganzhi"]}')
        print(f'时干支: {current["ganzhi"]["time"]["ganzhi"]}')
        print("✅ 当前时间测试成功")
    except Exception as e:
        print(f"❌ 当前时间测试失败: {e}")
    
    print("\n=== 测试指定日期 ===")
    try:
        # 测试指定日期转换
        specific = CalendarService.convert_solar_to_lunar(2025, 2, 3, 22, 10, 27)
        print(f'公历: {specific["solar"]["date"]}')
        print(f'农历: {specific["lunar"]["full_string"]}')
        print(f'年干支: {specific["ganzhi"]["year"]["ganzhi"]}')
        print(f'月干支: {specific["ganzhi"]["month"]["ganzhi"]}')
        print(f'日干支: {specific["ganzhi"]["day"]["ganzhi"]}')
        print(f'时干支: {specific["ganzhi"]["time"]["ganzhi"]}')
        print("✅ 指定日期测试成功")
    except Exception as e:
        print(f"❌ 指定日期测试失败: {e}")

if __name__ == "__main__":
    test_basic_calendar()

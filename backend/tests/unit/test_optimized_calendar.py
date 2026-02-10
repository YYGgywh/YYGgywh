#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试优化后的历法计算器功能
"""

import sys
import os

# 添加src目录到路径
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src'))

from algorithms.calendar_calculator import CalendarConverter

def test_optimized_calendar():
    """测试优化后的历法计算器功能"""
    calculator = CalendarConverter()
    
    print("=== 测试优化后的历法计算器功能 ===\n")
    
    # 测试1：统一入口方法 - 公历输入
    print("1. 统一入口方法 - 公历输入测试：")
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
        print(f"   结果状态: {result['success']}")
        
        if result['success']:
            print(f"   公历时间: {result.get('solar_datetime', 'N/A')}")
            print(f"   农历日期: {result.get('lunar_info', {}).get('lunar_date', 'N/A')}")
            print(f"   生肖: {result.get('lunar_info', {}).get('animal', 'N/A')}")
            print(f"   节气: {result.get('jieqi_info', {}).get('jieqi', 'N/A')}")
            print(f"   星座: {result.get('constellation_info', {}).get('constellation', 'N/A')}")
        else:
            print(f"   错误: {result.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试2：单独方法测试 - 公历信息
    print("2. 单独方法测试 - 公历信息：")
    try:
        solar_info = calculator.get_solar_info(2024, 12, 6, 14, 30, 0)
        print(f"   输入: 2024-12-06 14:30:00")
        print(f"   结果状态: {solar_info['success']}")
        
        if solar_info['success']:
            print(f"   公历日期: {solar_info.get('solar_date', 'N/A')}")
            print(f"   星期: {solar_info.get('weekday', 'N/A')}")
            print(f"   是否闰年: {solar_info.get('is_leap_year', 'N/A')}")
            print(f"   月份天数: {solar_info.get('days_in_month', 'N/A')}")
        else:
            print(f"   错误: {solar_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试3：单独方法测试 - 农历信息
    print("3. 单独方法测试 - 农历信息：")
    try:
        lunar_info = calculator.get_lunar_info(2024, 12, 6)
        print(f"   输入: 2024-12-06")
        print(f"   结果状态: {lunar_info['success']}")
        
        if lunar_info['success']:
            print(f"   农历日期: {lunar_info.get('lunar_date', 'N/A')}")
            print(f"   农历年: {lunar_info.get('lunar_year', 'N/A')}")
            print(f"   农历月: {lunar_info.get('lunar_month', 'N/A')}")
            print(f"   农历日: {lunar_info.get('lunar_day', 'N/A')}")
            print(f"   生肖: {lunar_info.get('animal', 'N/A')}")
            print(f"   干支年: {lunar_info.get('ganzhi_year', 'N/A')}")
            print(f"   干支月: {lunar_info.get('ganzhi_month', 'N/A')}")
            print(f"   干支日: {lunar_info.get('ganzhi_day', 'N/A')}")
        else:
            print(f"   错误: {lunar_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试4：单独方法测试 - 节气信息
    print("4. 单独方法测试 - 节气信息：")
    try:
        jieqi_info = calculator.get_jieqi_info(2024, 12, 6)
        print(f"   输入: 2024-12-06")
        print(f"   结果状态: {jieqi_info['success']}")
        
        if jieqi_info['success']:
            print(f"   当前节气: {jieqi_info.get('jieqi', 'N/A')}")
            print(f"   是否节气日: {jieqi_info.get('is_jieqi_day', 'N/A')}")
            print(f"   前一个节: {jieqi_info.get('prev_jie', {}).get('name', 'N/A')} {jieqi_info.get('prev_jie', {}).get('time', 'N/A')}")
            print(f"   下一个节: {jieqi_info.get('next_jie', {}).get('name', 'N/A')} {jieqi_info.get('next_jie', {}).get('time', 'N/A')}")
            print(f"   前一个气: {jieqi_info.get('prev_qi', {}).get('name', 'N/A')} {jieqi_info.get('prev_qi', {}).get('time', 'N/A')}")
            print(f"   下一个气: {jieqi_info.get('next_qi', {}).get('name', 'N/A')} {jieqi_info.get('next_qi', {}).get('time', 'N/A')}")
        else:
            print(f"   错误: {jieqi_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试5：单独方法测试 - 星座信息
    print("5. 单独方法测试 - 星座信息：")
    try:
        constellation_info = calculator.get_constellation_info(12, 6)
        print(f"   输入: 12月6日")
        print(f"   结果状态: {constellation_info['success']}")
        
        if constellation_info['success']:
            print(f"   星座: {constellation_info.get('constellation', 'N/A')}")
        else:
            print(f"   错误: {constellation_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试6：精确节气信息
    print("6. 精确节气信息测试：")
    try:
        precise_jieqi_info = calculator.get_precise_jieqi_info(2024, 12, 6, 14, 30, 0)
        print(f"   输入: 2024-12-06 14:30:00")
        print(f"   结果状态: {precise_jieqi_info['success']}")
        
        if precise_jieqi_info['success']:
            print(f"   当前时间: {precise_jieqi_info.get('current_time', 'N/A')}")
            print(f"   节气类型: {precise_jieqi_info.get('jieqi_type', 'N/A')}")
            print(f"   节气组合: {precise_jieqi_info.get('jieqi_combination', {})}")
        else:
            print(f"   错误: {precise_jieqi_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试7：综合历法信息
    print("7. 综合历法信息测试：")
    try:
        comprehensive_info = calculator.get_comprehensive_calendar_info(2024, 12, 6, 14, 30, 0)
        print(f"   输入: 2024-12-06 14:30:00")
        
        solar_info = comprehensive_info.get('solar', {})
        lunar_info = comprehensive_info.get('lunar', {})
        jieqi_info = comprehensive_info.get('jieqi', {})
        precise_jieqi_info = comprehensive_info.get('precise_jieqi', {})
        constellation_info = comprehensive_info.get('constellation', {})
        
        print(f"   公历信息状态: {solar_info.get('success', 'N/A')}")
        print(f"   农历信息状态: {lunar_info.get('success', 'N/A')}")
        print(f"   节气信息状态: {jieqi_info.get('success', 'N/A')}")
        print(f"   精确节气状态: {precise_jieqi_info.get('success', 'N/A')}")
        print(f"   星座信息状态: {constellation_info.get('success', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    # 测试8：错误输入测试
    print("8. 错误输入测试：")
    try:
        # 无效月份
        invalid_month_info = calculator.get_solar_info(2024, 13, 6)
        print(f"   无效月份测试: {invalid_month_info.get('success', 'N/A')} - {invalid_month_info.get('error', 'N/A')}")
        
        # 无效日期
        invalid_day_info = calculator.get_solar_info(2024, 12, 32)
        print(f"   无效日期测试: {invalid_day_info.get('success', 'N/A')} - {invalid_day_info.get('error', 'N/A')}")
        
        # 无效小时
        invalid_hour_info = calculator.get_solar_info(2024, 12, 6, 25, 0, 0)
        print(f"   无效小时测试: {invalid_hour_info.get('success', 'N/A')} - {invalid_hour_info.get('error', 'N/A')}")
        print()
    except Exception as e:
        print(f"   异常: {e}")
        print()
    
    print("=== 测试完成 ===")

if __name__ == "__main__":
    test_optimized_calendar()
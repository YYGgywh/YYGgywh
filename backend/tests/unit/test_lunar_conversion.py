#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os

# 添加src目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../src'))

from algorithms.calendar_calculator import CalendarConverter

def manual_input_test():
    """手动输入测试功能"""
    print("=" * 60)
    print("农历↔公历双向转换测试工具")
    print("=" * 60)
    
    calc = CalendarConverter()
    
    while True:
        print("\n请选择输入类型:")
        print("1. 公历输入")
        print("2. 农历输入")
        print("3. 退出测试")
        
        choice = input("请输入选择 (1/2/3): ").strip()
        
        if choice == '3':
            print("退出测试工具")
            break
        
        if choice not in ['1', '2']:
            print("❌ 无效选择，请重新输入")
            continue
        
        # 获取输入数据
        input_data = {}
        
        if choice == '1':
            input_data['type'] = 'solar'
            print("\n请输入公历日期:")
        else:
            input_data['type'] = 'lunar'
            print("\n请输入农历日期:")
        
        try:
            # 年份
            year = int(input("年份: ").strip())
            input_data['year'] = year
            
            # 月份
            month = int(input("月份 (1-12): ").strip())
            if not 1 <= month <= 12:
                print("❌ 月份必须在1-12之间")
                continue
            input_data['month'] = month
            
            # 日期
            day = int(input("日期 (1-31): ").strip())
            if not 1 <= day <= 31:
                print("❌ 日期必须在1-31之间")
                continue
            input_data['day'] = day
            
            # 时间（可选）
            hour_input = input("小时 (0-23, 默认0): ").strip()
            hour = int(hour_input) if hour_input else 0
            if not 0 <= hour <= 23:
                print("❌ 小时必须在0-23之间")
                continue
            input_data['hour'] = hour
            
            minute_input = input("分钟 (0-59, 默认0): ").strip()
            minute = int(minute_input) if minute_input else 0
            if not 0 <= minute <= 59:
                print("❌ 分钟必须在0-59之间")
                continue
            input_data['minute'] = minute
            
            second_input = input("秒钟 (0-59, 默认0): ").strip()
            second = int(second_input) if second_input else 0
            if not 0 <= second <= 59:
                print("❌ 秒钟必须在0-59之间")
                continue
            input_data['second'] = second
            
            # 闰月处理（仅农历输入）
            if choice == '2':
                leap_input = input("是否闰月? (y/n, 默认n): ").strip().lower()
                if leap_input == 'y':
                    # 闰月用负值表示
                    input_data['month'] = -abs(input_data['month'])
                    print(f"✅ 设置为闰{abs(input_data['month'])}月（负值表示）")
            
            # 执行转换
            print(f"\n输入数据: {input_data}")
            print("正在转换...")
            
            result = calc.calculate_calendar_info(input_data)
            
            if result.get('success'):
                print("✅ 转换成功!")
                print(f"公历基准时间: {result.get('solar_datetime')}")
                
                solar_info = result.get('solar_info', {})
                lunar_info = result.get('lunar_info', {})
                ganzhi_info = result.get('ganzhi_info', {})
                jieqi_info = result.get('jieqi_info', {})
                
                print("\n📅 公历信息:")
                print(f"   日期: {solar_info.get('year')}年{solar_info.get('month')}月{solar_info.get('day')}日")
                print(f"   时间: {solar_info.get('hour')}时{solar_info.get('minute')}分{solar_info.get('second')}秒")
                print(f"   星期: {solar_info.get('weekday')}")
                
                print("\n🌙 农历信息:")
                print(f"   日期: {lunar_info.get('lunar_year_name')}年{lunar_info.get('lunar_month_name')}{lunar_info.get('lunar_day_name')}")
                print(f"   是否闰月: {'是' if lunar_info.get('is_leap_month') else '否'}")
                print(f"   生肖: {lunar_info.get('animal')}")
                
                print("\n🔢 干支信息:")
                print(f"   年干支: {ganzhi_info.get('lunar_year_ganzhi', '')}")
                print(f"   月干支: {ganzhi_info.get('lunar_year_ganzhi', '')}")
                print(f"   日干支: {ganzhi_info.get('lunar_year_ganzhi', '')}")
                
                if jieqi_info.get('is_jieqi_day'):
                    print(f"\n🌱 节气信息: {jieqi_info.get('jieqi')}")
                
            else:
                print(f"❌ 转换失败: {result.get('error')}")
                
        except ValueError:
            print("❌ 输入格式错误，请输入数字")
        except Exception as e:
            print(f"❌ 发生异常: {str(e)}")

def quick_test():
    """快速测试几个典型用例"""
    print("\n" + "=" * 60)
    print("快速测试")
    print("=" * 60)
    
    calc = CalendarCalculator()
    
    test_cases = [
        {
            'name': '普通农历日期',
            'input': {'type': 'lunar', 'year': 2025, 'month': 10, 'day': 15, 'hour': 12, 'minute': 0, 'second': 0}
        },
        {
            'name': '2023年闰二月',
            'input': {'type': 'lunar', 'year': 2023, 'month': 2, 'day': 1, 'hour': 0, 'minute': 0, 'second': 0}
        },
        {
            'name': '公历输入',
            'input': {'type': 'solar', 'year': 2025, 'month': 12, 'day': 6, 'hour': 12, 'minute': 0, 'second': 0}
        }
    ]
    
    for test in test_cases:
        print(f"\n测试: {test['name']}")
        print(f"输入: {test['input']}")
        
        try:
            result = calc.calculate_calendar_info(test['input'])
            if result.get('success'):
                print("✅ 成功")
                solar_info = result.get('solar_info', {})
                lunar_info = result.get('lunar_info', {})
                print(f"   公历: {solar_info.get('year')}年{solar_info.get('month')}月{solar_info.get('day')}日")
                print(f"   农历: {lunar_info.get('lunar_year_name')}年{lunar_info.get('lunar_month_name')}{lunar_info.get('lunar_day_name')}")
            else:
                print(f"❌ 失败: {result.get('error')}")
        except Exception as e:
            print(f"❌ 异常: {str(e)}")

if __name__ == "__main__":
    print("选择测试模式:")
    print("1. 手动输入测试")
    print("2. 快速测试")
    
    mode = input("请选择 (1/2): ").strip()
    
    if mode == '1':
        manual_input_test()
    elif mode == '2':
        quick_test()
    else:
        print("无效选择，退出")
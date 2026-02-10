#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
手动时间格式验证测试工具
用于测试公历和农历时间格式的验证准确性
"""

import sys
import os

# 添加backend目录到Python路径
sys.path.append(os.path.dirname(__file__))

from src.algorithms.calendar_calculator import CalendarCalculator
from src.api.calendar_api import CalendarRequest, LunarCalendarRequest

def test_manual_validation():
    """手动时间格式验证测试"""
    print("=== 手动时间格式验证测试工具 ===")
    print("本工具用于测试公历和农历时间格式的验证准确性")
    print("支持测试：公历日期验证、农历日期验证、闰月验证、大小月验证等")
    print()
    
    calculator = CalendarCalculator()
    
    while True:
        print("\n请选择测试类型：")
        print("1. 公历日期验证测试")
        print("2. 农历日期验证测试")
        print("3. 批量测试示例")
        print("4. 退出")
        
        choice = input("请输入选项 (1-4): ").strip()
        
        if choice == "1":
            test_solar_validation(calculator)
        elif choice == "2":
            test_lunar_validation(calculator)
        elif choice == "3":
            run_batch_tests(calculator)
        elif choice == "4":
            print("感谢使用，再见！")
            break
        else:
            print("无效选项，请重新输入")

def test_solar_validation(calculator):
    """测试公历日期验证"""
    print("\n=== 公历日期验证测试 ===")
    
    while True:
        print("\n请输入公历日期 (格式: 年 月 日，如: 2025 12 15)")
        print("输入 'q' 返回主菜单")
        
        input_str = input("请输入: ").strip()
        if input_str.lower() == 'q':
            break
            
        try:
            parts = input_str.split()
            if len(parts) != 3:
                print("❌ 输入格式错误，请使用 '年 月 日' 格式")
                continue
                
            year = int(parts[0])
            month = int(parts[1])
            day = int(parts[2])
            
            # 测试CalendarRequest模型验证
            print("\n--- CalendarRequest模型验证 ---")
            try:
                request = CalendarRequest(
                    year=year,
                    month=month,
                    day=day,
                    hour=0,
                    minute=0,
                    second=0
                )
                print("✅ CalendarRequest验证通过")
                print(f"   年份: {request.year}")
                print(f"   月份: {request.month}")
                print(f"   日期: {request.day}")
            except Exception as e:
                print(f"❌ CalendarRequest验证失败: {str(e)}")
            
            # 测试CalendarCalculator验证
            print("\n--- CalendarCalculator验证 ---")
            try:
                calculator._validate_date(year, month, day)
                print("✅ CalendarCalculator日期验证通过")
                
                # 测试完整转换流程
                result = calculator.calculate_calendar_info({
                    "type": "solar",
                    "year": year,
                    "month": month,
                    "day": day,
                    "hour": 0,
                    "minute": 0,
                    "second": 0
                })
                
                if result.get("success"):
                    print("✅ 完整转换流程成功")
                    print(f"   公历: {result.get('solar_datetime', 'N/A')}")
                    print(f"   农历: {result.get('lunar_collection', {}).get('lunar_date', 'N/A')}")
                else:
                    print(f"❌ 完整转换流程失败: {result.get('error', '未知错误')}")
                    
            except Exception as e:
                print(f"❌ CalendarCalculator验证失败: {str(e)}")
                
        except ValueError:
            print("❌ 输入格式错误，请确保输入的是数字")
        except Exception as e:
            print(f"❌ 发生错误: {str(e)}")

def test_lunar_validation(calculator):
    """测试农历日期验证"""
    print("\n=== 农历日期验证测试 ===")
    print("注意：闰月用负数表示，如闰2月 = -2")
    
    while True:
        print("\n请输入农历日期 (格式: 年 月 日，如: 2025 10 15)")
        print("闰月示例: 2023 -2 1 (2023年闰2月初一)")
        print("输入 'q' 返回主菜单")
        
        input_str = input("请输入: ").strip()
        if input_str.lower() == 'q':
            break
            
        try:
            parts = input_str.split()
            if len(parts) != 3:
                print("❌ 输入格式错误，请使用 '年 月 日' 格式")
                continue
                
            year = int(parts[0])
            month = int(parts[1])
            day = int(parts[2])
            
            # 测试LunarCalendarRequest模型验证
            print("\n--- LunarCalendarRequest模型验证 ---")
            try:
                request = LunarCalendarRequest(
                    lunar_year=year,
                    lunar_month=month,
                    lunar_day=day,
                    hour=0,
                    minute=0,
                    second=0
                )
                print("✅ LunarCalendarRequest验证通过")
                print(f"   农历年: {request.lunar_year}")
                print(f"   农历月: {request.lunar_month}")
                print(f"   农历日: {request.lunar_day}")
            except Exception as e:
                print(f"❌ LunarCalendarRequest验证失败: {str(e)}")
            
            # 测试CalendarCalculator农历验证
            print("\n--- CalendarCalculator农历验证 ---")
            try:
                calculator._validate_lunar_date(year, month, day)
                print("✅ CalendarCalculator农历日期验证通过")
                
                # 测试完整转换流程
                result = calculator.calculate_calendar_info({
                    "type": "lunar",
                    "year": year,
                    "month": month,
                    "day": day,
                    "hour": 0,
                    "minute": 0,
                    "second": 0
                })
                
                if result.get("success"):
                    print("✅ 完整转换流程成功")
                    print(f"   农历: {year}年{month}月{day}日")
                    print(f"   公历: {result.get('solar_datetime', 'N/A')}")
                else:
                    print(f"❌ 完整转换流程失败: {result.get('error', '未知错误')}")
                    
            except Exception as e:
                print(f"❌ CalendarCalculator农历验证失败: {str(e)}")
                
        except ValueError:
            print("❌ 输入格式错误，请确保输入的是数字")
        except Exception as e:
            print(f"❌ 发生错误: {str(e)}")

def run_batch_tests(calculator):
    """运行批量测试示例"""
    print("\n=== 批量测试示例 ===")
    
    # 公历测试用例
    solar_test_cases = [
        (2025, 12, 15, "正常公历日期"),
        (2025, 2, 29, "平年2月29日（应失败）"),
        (2024, 2, 29, "闰年2月29日（应通过）"),
        (2025, 4, 31, "4月31日（应失败）"),
        (2025, 0, 1, "月份为0（应失败）"),
        (2025, 13, 1, "月份超出范围（应失败）"),
    ]
    
    print("\n--- 公历批量测试 ---")
    for year, month, day, description in solar_test_cases:
        print(f"\n测试: {description}")
        print(f"输入: {year}年{month}月{day}日")
        
        try:
            calculator._validate_date(year, month, day)
            print("✅ 验证通过")
        except Exception as e:
            print(f"❌ 验证失败: {str(e)}")
    
    # 农历测试用例
    lunar_test_cases = [
        (2025, 1, 1, "正常农历日期"),
        (2025, 1, 31, "农历大月31日（应失败）"),
        (2025, 2, 30, "农历小月30日（应失败）"),
        (2023, -2, 1, "真实闰月（2023年闰2月）"),
        (2025, -2, 1, "无效闰月（2025年无闰2月）"),
        (2025, 0, 1, "月份为0（应失败）"),
    ]
    
    print("\n--- 农历批量测试 ---")
    for year, month, day, description in lunar_test_cases:
        print(f"\n测试: {description}")
        print(f"输入: {year}年{month}月{day}日")
        
        try:
            calculator._validate_lunar_date(year, month, day)
            print("✅ 验证通过")
        except Exception as e:
            print(f"❌ 验证失败: {str(e)}")

def main():
    """主函数"""
    try:
        test_manual_validation()
    except KeyboardInterrupt:
        print("\n\n程序被用户中断")
    except Exception as e:
        print(f"程序发生错误: {str(e)}")

if __name__ == "__main__":
    main()
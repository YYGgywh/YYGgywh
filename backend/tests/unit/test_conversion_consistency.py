#!/usr/bin/env python3
"""
公历、农历、四柱转换一致性测试脚本
用于检查不同模块之间的转换结果偏差
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from core.calendar_service import CalendarService
from algorithms.calendar_calculator import CalendarConverter
from utils.verify_pillars import verify_pillars

def test_solar_to_lunar_conversion():
    """测试公历转农历转换一致性"""
    print("=== 公历转农历转换一致性测试 ===")
    
    # 测试用例：2024年12月6日
    test_cases = [
        {"year": 2024, "month": 12, "day": 6, "hour": 10, "minute": 30, "second": 0},
        {"year": 2023, "month": 2, "day": 14, "hour": 15, "minute": 0, "second": 0},
        {"year": 2025, "month": 1, "day": 1, "hour": 0, "minute": 0, "second": 0},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n测试用例 {i}: {test_case}")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_solar_to_lunar(**test_case)
            service_lunar_year = service_result["lunar_collection"]["lunar_year"]
            service_lunar_month = service_result["lunar_collection"]["lunar_month"]
            service_lunar_day = service_result["lunar_collection"]["lunar_day"]
            print(f"calendar_service.py: 农历 {service_lunar_year}年{service_lunar_month}月{service_lunar_day}日")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(**test_case, is_solar=True)
            if calc_result["valid"]:
                calc_lunar_year = calc_result["lunar_info"]["lunar_year"]
                calc_lunar_month = calc_result["lunar_info"]["lunar_month"]
                calc_lunar_day = calc_result["lunar_info"]["lunar_day"]
                print(f"calendar_calculator.py: 农历 {calc_lunar_year}年{calc_lunar_month}月{calc_lunar_day}日")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 移除lunar_calculator.py测试，功能已被calendar_calculator.py覆盖
        print("lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def test_lunar_to_solar_conversion():
    """测试农历转公历转换一致性"""
    print("\n=== 农历转公历转换一致性测试 ===")
    
    # 测试用例
    test_cases = [
        {"lunar_year": 2024, "lunar_month": 11, "lunar_day": 6, "hour": 10, "minute": 30, "second": 0},
        {"lunar_year": 2023, "lunar_month": 1, "lunar_day": 14, "hour": 15, "minute": 0, "second": 0},
        {"lunar_year": 2025, "lunar_month": 12, "lunar_day": 1, "hour": 0, "minute": 0, "second": 0},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n测试用例 {i}: 农历{test_case['lunar_year']}年{test_case['lunar_month']}月{test_case['lunar_day']}日")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_lunar_to_solar(**test_case)
            service_solar_date = service_result["solar_info"]["date"]
            print(f"calendar_service.py: 公历 {service_solar_date}")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用calendar_calculator.py转换
        try:
            calculator = CalendarConverter()
            calc_result = calculator.convert_calendar(
                test_case["lunar_year"], 
                test_case["lunar_month"], 
                test_case["lunar_day"],
                test_case["hour"], test_case["minute"], test_case["second"],
                is_solar=False
            )
            if calc_result["valid"]:
                calc_solar_date = calc_result["solar_info"]["solar_YmdHms"]
                print(f"calendar_calculator.py: 公历 {calc_solar_date}")
            else:
                print(f"calendar_calculator.py 转换失败: {calc_result.get('error', '未知错误')}")
        except Exception as e:
            print(f"calendar_calculator.py 转换失败: {e}")
        
        # 移除lunar_calculator.py测试，功能已被calendar_calculator.py覆盖
        print("lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def test_pillars_validation_consistency():
    """测试四柱验证一致性"""
    print("\n=== 四柱验证一致性测试 ===")
    
    # 测试用例：有效的四柱组合
    test_cases = [
        {"year_pillar": "甲子", "month_pillar": "丙寅", "day_pillar": "戊辰", "hour_pillar": "壬子"},
        {"year_pillar": "乙丑", "month_pillar": "丁卯", "day_pillar": "己巳", "hour_pillar": "癸丑"},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n测试用例 {i}: {test_case}")
        
        # 移除validators.py测试，功能已被verify_pillars.py覆盖
        print("validators.py: 已废弃，功能由verify_pillars.py提供")
        
        # 使用verify_pillars.py验证（注意参数命名差异）
        try:
            verify_result = verify_pillars(
                test_case["year_pillar"], 
                test_case["month_pillar"], 
                test_case["day_pillar"], 
                test_case["hour_pillar"]  # 注意：这里使用hour_pillar而不是time_pillar
            )
            print(f"verify_pillars.py: 验证 {'通过' if verify_result['validation_passed'] else '失败'} - {verify_result.get('message', '无消息')}")
        except Exception as e:
            print(f"verify_pillars.py 验证失败: {e}")

def test_pillars_to_solar_conversion():
    """测试四柱反推公历转换一致性"""
    print("\n=== 四柱反推公历转换一致性测试 ===")
    
    # 测试用例
    test_cases = [
        {"year_pillar": "甲子", "month_pillar": "丙寅", "day_pillar": "戊辰", "hour_pillar": "壬子"},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n测试用例 {i}: {test_case}")
        
        # 使用calendar_service.py转换
        try:
            service_result = CalendarService.convert_pillars_to_calendar(**test_case)
            total_matches = service_result["total_matches"]
            primary_result = service_result["primary_result"]
            print(f"calendar_service.py: 找到 {total_matches} 个匹配日期")
            if total_matches > 0:
                solar_date = primary_result["solar_info"]["date"]
                print(f"  主要结果: 公历 {solar_date}")
        except Exception as e:
            print(f"calendar_service.py 转换失败: {e}")
        
        # 使用verify_pillars.py转换（注意参数命名差异）
        try:
            verify_result = verify_pillars.get_simple_pillars_conversion(
                test_case["year_pillar"], 
                test_case["month_pillar"], 
                test_case["day_pillar"], 
                test_case["hour_pillar"]  # 注意：这里使用hour_pillar而不是time_pillar
            )
            total_matches = verify_result["total_matches"]
            print(f"verify_pillars.py: 找到 {total_matches} 个匹配日期")
            if total_matches > 0:
                solar_dates = verify_result["solar_dates"]
                for j, solar_date in enumerate(solar_dates[:3]):  # 只显示前3个结果
                    print(f"  结果 {j+1}: {solar_date['solar_date']}")
        except Exception as e:
            print(f"verify_pillars.py 转换失败: {e}")

def main():
    """主测试函数"""
    print("开始执行公历、农历、四柱转换一致性测试...")
    
    # 执行各项测试
    test_solar_to_lunar_conversion()
    test_lunar_to_solar_conversion()
    test_pillars_validation_consistency()
    test_pillars_to_solar_conversion()
    
    print("\n=== 测试完成 ===")

if __name__ == "__main__":
    main()
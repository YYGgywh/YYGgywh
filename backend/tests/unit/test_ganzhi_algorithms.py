#!/usr/bin/env python3
"""
测试干支算法的边界情况
验证方案二（蛇形命名）的实现是否正确
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from core.calendar_service import CalendarService
from algorithms.calendar_calculator import CalendarConverter

def test_ganzhi_algorithms():
    """测试干支算法的边界情况"""
    
    # 测试边界日期：立春前后
    test_cases = [
        # (year, month, day, hour, description)
        (2025, 2, 3, 0, "立春前一日"),  # 立春前
        (2025, 2, 4, 0, "立春当日"),    # 立春当日
        (2025, 2, 5, 0, "立春后一日"),  # 立春后
        
        # 农历正月初一前后
        (2025, 1, 28, 0, "春节前一日"),  # 春节前
        (2025, 1, 29, 0, "春节当日"),    # 春节当日
        (2025, 1, 30, 0, "春节后一日"),  # 春节后
        
        # 子时换日边界
        (2025, 12, 5, 23, "子时前"),     # 23:00
        (2025, 12, 6, 0, "子时后"),      # 00:00
        (2025, 12, 6, 1, "子时后1小时"), # 01:00
    ]
    
    calculator = CalendarConverter()
    
    print("=" * 80)
    print("干支算法边界测试")
    print("=" * 80)
    
    for year, month, day, hour, description in test_cases:
        print(f"\n测试案例: {description}")
        print(f"日期: {year}-{month:02d}-{day:02d} {hour:02d}:00")
        
        # 使用calendar_service获取完整信息
        try:
            service_result = CalendarService.convert_solar_to_lunar(year, month, day, hour)
            
            # 检查干支结构
            ganzhi_info = service_result.get("ganzhi", {})
            
            if "solar_calendar" in ganzhi_info and "lunar_calendar" in ganzhi_info:
                print("✓ 干支信息结构正确")
                
                # 检查节气交节点算法
                solar_ganzhi = ganzhi_info["solar_calendar"]
                lunar_ganzhi = ganzhi_info["lunar_calendar"]
                
                # 年柱对比
                solar_year = solar_ganzhi["year"]["year_in_ganzhi_by_lichun"]
                lunar_year = lunar_ganzhi["year"]["year_in_ganzhi"]
                
                print(f"  年柱(节气算法): {solar_year}")
                print(f"  年柱(传统算法): {lunar_year}")
                
                # 日柱对比
                solar_day_zishi = solar_ganzhi["day"]["day_in_ganzhi_by_zishi"]
                solar_day_0000 = solar_ganzhi["day"]["day_in_ganzhi_by_00_00"]
                lunar_day = lunar_ganzhi["day"]["day_in_ganzhi"]
                
                print(f"  日柱(子时换日): {solar_day_zishi}")
                print(f"  日柱(00:00换日): {solar_day_0000}")
                print(f"  日柱(传统算法): {lunar_day}")
                
                # 检查算法差异
                if solar_year != lunar_year:
                    print(f"  ⚠ 年柱算法差异: 节气算法={solar_year}, 传统算法={lunar_year}")
                
                if solar_day_zishi != solar_day_0000:
                    print(f"  ⚠ 日柱换日方式差异: 子时={solar_day_zishi}, 00:00={solar_day_0000}")
                    
            else:
                print("✗ 干支信息结构不完整")
                
        except Exception as e:
            print(f"✗ 测试失败: {e}")
        
        print("-" * 50)
    
    # 测试calendar_calculator的集成
    print("\n测试calendar_calculator集成:")
    try:
        # 使用convert_calendar方法获取综合信息
        comp_info = calculator.convert_calendar(2025, 12, 5, 15, is_solar=True)
        
        if "ganzhi_info" in comp_info:
            print("✓ calendar_calculator集成正确")
            
            # 检查数据完整性
            ganzhi_comp = comp_info["ganzhi_info"]
            print(f"  集成年柱: {ganzhi_comp.get('lunar_year_in_ganzhi_exact', 'N/A')}")
            print(f"  集成月柱: {ganzhi_comp.get('lunar_month_in_ganzhi_exact', 'N/A')}")
            print(f"  集成日柱: {ganzhi_comp.get('lunar_day_in_ganzhi_exact', 'N/A')}")
            
        else:
            print("✗ calendar_calculator集成结构不完整")
            
    except Exception as e:
        print(f"✗ calendar_calculator集成测试失败: {e}")

if __name__ == "__main__":
    test_ganzhi_algorithms()
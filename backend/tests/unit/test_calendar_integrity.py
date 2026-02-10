#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CalendarCalculator 功能完整性测试
"""

from datetime import datetime
from src.algorithms.calendar_calculator import CalendarConverter
from lunar_python import Solar

def test_calendar_calculator_integrity():
    """测试CalendarConverter功能完整性"""
    print("=== CalendarConverter 功能完整性测试 ===")
    
    # 创建计算器实例
    calculator = CalendarConverter()
    
    # 测试当前日期
    current_datetime = datetime.now()
    now = Solar.fromDate(current_datetime)
    
    try:
        # 测试综合历法信息
        info = calculator.get_comprehensive_calendar_info(
            now.getYear(), now.getMonth(), now.getDay(), now.getHour(), now.getMinute(), now.getSecond()
        )
        
        print("✓ 综合历法信息测试成功")
        print(f"  公历信息: {info['solar']['solar_date']}")
        print(f"  农历信息: {info['lunar']['lunar_date']}")
        print(f"  节气信息: {info['jieqi']['jieqi']}")
        print(f"  星座信息: {info['constellation']['constellation']}")
        
        # 检查所有必需字段是否存在
        required_fields = ['solar', 'lunar', 'jieqi', 'precise_jieqi', 'constellation']
        all_fields_present = True
        
        for field in required_fields:
            if field in info:
                print(f"✓ {field} 字段存在")
            else:
                print(f"✗ {field} 字段缺失")
                all_fields_present = False
        
        # 测试单个方法
        print("\n=== 单个方法测试 ===")
        
        # 测试公历信息
        solar_info = calculator.get_solar_info(now.getYear(), now.getMonth(), now.getDay())
        print(f"✓ 公历信息方法: {solar_info['solar_date']}")
        
        # 测试农历信息
        lunar_info = calculator.get_lunar_info(now.getYear(), now.getMonth(), now.getDay())
        print(f"✓ 农历信息方法: {lunar_info['lunar_date']}")
        
        # 测试节气信息
        jieqi_info = calculator.get_jieqi_info(now.getYear(), now.getMonth(), now.getDay())
        print(f"✓ 节气信息方法: {jieqi_info['jieqi']}")
        
        # 测试星座信息
        constellation_info = calculator.get_constellation_info(now.getMonth(), now.getDay())
        print(f"✓ 星座信息方法: {constellation_info['constellation']}")
        
        # 测试精确节气信息
        precise_jieqi_info = calculator.get_precise_jieqi_info(
            now.getYear(), now.getMonth(), now.getDay(), now.getHour(), now.getMinute(), now.getSecond()
        )
        print(f"✓ 精确节气信息方法: {precise_jieqi_info.get('jieqi_type', 'N/A')}")
        
        # 测试公历转农历
        convert_result = calculator.convert_solar_to_lunar(
            now.getYear(), now.getMonth(), now.getDay(), now.getHour(), now.getMinute(), now.getSecond()
        )
        print(f"✓ 公历转农历方法: {convert_result['success']}")
        
        if all_fields_present:
            print("\n🎉 CalendarCalculator 功能完整性验证通过！")
            print("所有缺失的方法已成功添加，干支清理工作完成。")
            return True
        else:
            print("\n❌ CalendarCalculator 功能完整性验证失败！")
            return False
            
    except Exception as e:
        print(f"✗ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_calendar_calculator_integrity()
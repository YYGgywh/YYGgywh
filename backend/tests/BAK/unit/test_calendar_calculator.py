#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试calendar_calculator.py中的验证功能
"""

import sys
import os

# 添加backend/src目录到Python路径，以便导入calendar_calculator
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from algorithms.calendar_calculator import CalendarConverter

def test_solar_validation():
    """测试公历验证功能"""
    
    validator = CalendarConverter()
    
    print("=" * 60)
    print("公历验证测试")
    print("=" * 60)
    
    # 测试1: 有效公历日期
    print("\n1. 有效公历日期测试:")
    result = validator.validate_solar_input(2024, 12, 25, 14, 30, 0)
    print(f"   输入: 2024-12-25 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == True
    
    # 测试2: 无效公历日期（2月30日）
    print("\n2. 无效公历日期测试:")
    result = validator.validate_solar_input(2024, 2, 30, 14, 30, 0)
    print(f"   输入: 2024-2-30 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False
    
    # 测试3: 无效月份
    print("\n3. 无效月份测试:")
    result = validator.validate_solar_input(2024, 13, 25, 14, 30, 0)
    print(f"   输入: 2024-13-25 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False
    
    # 测试4: 无效年份
    print("\n4. 无效年份测试:")
    result = validator.validate_solar_input(0, 12, 25, 14, 30, 0)
    print(f"   输入: 0-12-25 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False
    
    # 测试5: 无效时间
    print("\n5. 无效时间测试:")
    result = validator.validate_solar_input(2024, 12, 25, 25, 70, 70)
    print(f"   输入: 2024-12-25 25:70:70")
    print(f"   结果: {result}")
    assert result["valid"] == False

def test_lunar_validation():
    """测试农历验证功能"""
    
    validator = CalendarConverter()
    
    print("\n" + "=" * 60)
    print("农历验证测试")
    print("=" * 60)
    
    # 测试1: 有效农历日期
    print("\n1. 有效农历日期测试:")
    result = validator.validate_lunar_input(2024, 11, 1, 14, 30, 0)
    print(f"   输入: 2024年11月初一 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == True
    
    # 测试2: 有效闰月日期
    print("\n2. 有效闰月日期测试:")
    result = validator.validate_lunar_input(2023, -2, 1, 14, 30, 0)  # 闰2月初一
    print(f"   输入: 2023年闰2月初一 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == True
    
    # 测试3: 无效农历日期
    print("\n3. 无效农历日期测试:")
    result = validator.validate_lunar_input(2024, 11, 31, 14, 30, 0)
    print(f"   输入: 2024年11月31日 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False
    
    # 测试4: 大小月天数验证（30天无效）
    print("\n4. 大小月天数验证（30天无效）:")
    result = validator.validate_lunar_input(2024, 4, 30, 14, 30, 0)  # 2024年四月只有29天
    print(f"   输入: 2024年四月30日 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False

    # 测试5: 大小月天数验证（29天有效）
    print("\n5. 大小月天数验证（29天有效）:")
    result = validator.validate_lunar_input(2024, 3, 29, 14, 30, 0)  # 2024年三月有29天
    print(f"   输入: 2024年三月29日 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == True
    
    # 测试6: 无效月份
    print("\n6. 无效月份测试:")
    result = validator.validate_lunar_input(2024, 13, 1, 14, 30, 0)
    print(f"   输入: 2024年13月初一 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False
    
    # 测试7: 无效年份
    print("\n7. 无效年份测试:")
    result = validator.validate_lunar_input(10000, 11, 1, 14, 30, 0)
    print(f"   输入: 10000年11月初一 14:30:00")
    print(f"   结果: {result}")
    assert result["valid"] == False



def test_data_type_validation():
    """测试数据类型验证"""
    
    validator = CalendarConverter()
    
    print("\n" + "=" * 60)
    print("数据类型验证测试")
    print("=" * 60)
    
    # 测试1: 字符串类型（应该失败）
    print("\n1. 字符串类型测试:")
    try:
        result = validator.validate_solar_input("2024", 12, 25, 14, 30, 0)
        print(f"   输入: '2024'-12-25 14:30:00")
        print(f"   结果: {result}")
        assert result["valid"] == False
    except TypeError:
        print("   正确捕获了类型错误")
    
    # 测试2: 浮点数类型（应该失败）
    print("\n2. 浮点数类型测试:")
    try:
        result = validator.validate_solar_input(2024.0, 12, 25, 14, 30, 0)
        print(f"   输入: 2024.0-12-25 14:30:00")
        print(f"   结果: {result}")
        assert result["valid"] == False
    except TypeError:
        print("   正确捕获了类型错误")

if __name__ == "__main__":
    # 运行所有测试
    test_solar_validation()
    test_lunar_validation()
    test_data_type_validation()
    
    print("\n" + "=" * 60)
    print("所有测试完成！")
    print("=" * 60)
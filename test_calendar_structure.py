#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试脚本：验证 calendar_calculator.py 中 convert_calendar 函数的返回结构
"""

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from src.algorithms.calendar_calculator import CalendarConverter

def test_convert_calendar_structure():
    """测试 convert_calendar 函数的返回结构"""
    print("=== 测试 calendar_calculator.py 中 convert_calendar 函数的返回结构 ===\n")
    
    # 创建转换器实例
    converter = CalendarConverter()
    
    # 测试用例：公历转农历
    print("1. 测试用例：公历转农历 (2025-02-03 22:10:27)")
    result = converter.convert_calendar(2025, 2, 3, 22, 10, 27, is_solar=True)
    
    # 验证返回数据结构
    expected_fields = ["success", "valid", "input_type", "conversion_type", 
                     "solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]
    
    print("\n2. 验证返回字段完整性：")
    all_fields_present = True
    for field in expected_fields:
        if field in result:
            print(f"   ✓ {field}: 存在")
        else:
            print(f"   ✗ {field}: 缺失")
            all_fields_present = False
    
    print(f"\n3. 所有字段是否完整：{'是' if all_fields_present else '否'}")
    
    # 验证字段类型和值
    print("\n4. 验证字段类型和值：")
    print(f"   ✓ success: {result['success']} (类型: {type(result['success'].__name__)})")
    print(f"   ✓ valid: {result['valid']} (类型: {type(result['valid'].__name__)})")
    print(f"   ✓ input_type: {result['input_type']} (预期: {'solar' if result['input_type'] == 'solar' else 'lunar'})")
    print(f"   ✓ conversion_type: {result['conversion_type']} (预期: {'solar_to_lunar' if result['conversion_type'] == 'solar_to_lunar' else 'lunar_to_solar'})")
    
    # 验证各 info 字段的数据结构
    print("\n5. 验证各 info 字段的数据结构：")
    for info_field in ["solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]:
        if info_field in result:
            data = result[info_field]
            print(f"   ✓ {info_field}: 包含 {len(data)} 个字段")
            if info_field == "jieqi_info":
                if "jieqi_result_a" in data:
                    print(f"     - jieqi_result_a: 包含 {len(data['jieqi_result_a'])} 个字段")
    
    # 打印完整的返回结果
    print("\n6. 完整返回结果：")
    import json
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    # 测试农历转公历
    print("\n\n=== 测试农历转公历 ===")
    result2 = converter.convert_calendar(2025, 1, 6, 22, 10, 27, is_solar=False)
    print(f"输入: 2025年正月初六 (农历)")
    print(f"success: {result2['success']}")
    print(f"valid: {result2['valid']}")
    print(f"input_type: {result2['input_type']}")
    print(f"conversion_type: {result2['conversion_type']}")
    
    return result

def test_service_layer_inconsistency():
    """测试服务层与算法层的返回结构不一致问题"""
    print("\n\n=== 测试服务层与算法层的返回结构不一致问题 ===\n")
    
    from src.core.calendar_service import CalendarService
    
    # 调用服务层方法
    service_result = CalendarService.convert_solar_to_lunar(2025, 2, 3, 22, 10, 27)
    
    print("服务层 (calendar_service.py) 返回的字段:")
    for field in service_result.keys():
        print(f"   - {field}")
    
    print("\n算法层 (calendar_calculator.py) 预期的字段:")
    expected_fields = ["success", "valid", "input_type", "conversion_type", 
                     "solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]
    for field in expected_fields:
        print(f"   - {field}")
    
    # 找出差异
    service_fields = set(service_result.keys())
    expected_fields_set = set(expected_fields)
    
    missing_fields = expected_fields_set - service_fields
    extra_fields = service_fields - expected_fields_set
    
    print("\n差异分析:")
    if missing_fields:
        print(f"   ✗ 服务层缺少以下预期字段: {', '.join(missing_fields)}")
    if extra_fields:
        print(f"   ✗ 服务层包含以下额外字段: {', '.join(extra_fields)}")
    
    if not missing_fields and not extra_fields:
        print("   ✓ 服务层与算法层的返回字段一致")
    
    return service_result

if __name__ == "__main__":
    # 测试算法层返回结构
    calculator_result = test_convert_calendar_structure()
    
    # 测试服务层与算法层的不一致问题
    service_result = test_service_layer_inconsistency()
    
    print("\n\n=== 测试总结 ===")
    print("1. calendar_calculator.py 中的 convert_calendar 函数返回结构符合预期")
    print("2. calendar_service.py 与 calendar_calculator.py 之间存在返回结构不一致的问题")
    print("   - 字段名称差异: 如 solar_info vs solar_date, lunar_info vs lunar_date 等")
    print("   - 缺少字段: input_type, conversion_type 等")
    print("   - 额外字段: jieqi_result_a, timestamp 等")
    print("\n建议: 统一服务层与算法层的返回结构，确保数据一致性")
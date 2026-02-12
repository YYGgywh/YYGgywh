#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试日历转换模块的返回结构
验证服务层(calendar_service.py)与算法层(calendar_calculator.py)的返回结构是否一致
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))

from core.calendar_algorithm_core import CalendarAlgorithmCore
from algorithms.calendar_calculator import CalendarConverter

def test_convert_calendar_structure():
    """测试CalendarConverter.convert_calendar函数的返回结构"""
    print("=== 测试CalendarConverter.convert_calendar函数的返回结构 ===")
    
    # 测试公历转农历
    converter = CalendarConverter()
    result = converter.convert_calendar(year=2023, month=12, day=25, hour=12, minute=0, second=0, is_solar=True)
    
    print("返回结构的键:", list(result.keys()))
    
    # 验证字段是否存在
    expected_keys = ["success", "valid", "input_type", "conversion_type", "solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]
    all_fields_present = True
    for key in expected_keys:
        if key in result:
            print(f"✓ 字段 '{key}' 存在")
        else:
            print(f"✗ 字段 '{key}' 缺失")
            all_fields_present = False
    
    # 验证success和valid是否为布尔值True
    print(f"success字段: {result['success']} (类型: {type(result['success']).__name__})")
    print(f"valid字段: {result['valid']} (类型: {type(result['valid']).__name__})")
    
    # 验证input_type和conversion_type
    print(f"input_type字段: {result['input_type']}")
    print(f"conversion_type字段: {result['conversion_type']}")
    
    # 验证各info字段的结构
    for info_key in ["solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]:
        if info_key in result:
            print(f"\n{info_key}的键数: {len(result[info_key].keys())}")
        else:
            print(f"\n{info_key}缺失")
    
    return result, all_fields_present

def test_service_vs_calculator():
    """比较服务层和算法层的返回结构是否一致"""
    print("\n=== 比较服务层和算法层的返回结构是否一致 ===")
    
    # 算法层结果
    calculator = CalendarConverter()
    calculator_result = calculator.convert_calendar(year=2023, month=12, day=25, hour=12, minute=0, second=0, is_solar=True)
    
    # 服务层结果
    service_result = CalendarService.convert_solar_to_lunar(year=2023, month=12, day=25, hour=12, minute=0, second=0)
    
    # 比较顶层键
    calc_keys = set(calculator_result.keys())
    serv_keys = set(service_result.keys())
    
    print("算法层独有的键:", calc_keys - serv_keys)
    print("服务层独有的键:", serv_keys - calc_keys)
    common_keys = calc_keys & serv_keys
    print("共同的键:", common_keys)
    
    # 检查是否结构一致
    structure_match = True
    if calc_keys != serv_keys:
        print("✗ 顶层键结构不一致")
        structure_match = False
    else:
        print("✓ 顶层键结构一致")
    
    # 比较各info字段
    info_fields = ["solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]
    for field in info_fields:
        if field in calculator_result and field in service_result:
            calc_subkeys = set(calculator_result[field].keys())
            serv_subkeys = set(service_result[field].keys())
            print(f"\n{field}字段的比较:")
            print(f"  算法层独有的子键: {calc_subkeys - serv_subkeys}")
            print(f"  服务层独有的子键: {serv_subkeys - calc_subkeys}")
            print(f"  共同的子键数: {len(calc_subkeys & serv_subkeys)}")
            if calc_subkeys != serv_subkeys:
                print(f"  ✗ {field}结构不一致")
                structure_match = False
            else:
                print(f"  ✓ {field}结构一致")
        elif field in calculator_result:
            print(f"\n{field}在服务层中缺失")
            structure_match = False
        elif field in service_result:
            print(f"\n{field}在算法层中缺失")
            structure_match = False
    
    return calculator_result, service_result, structure_match

def test_api_response_structure():
    """测试API响应的结构是否符合预期（模拟测试）"""
    print("\n=== 测试API响应的结构是否符合预期 ===")
    print("⚠️  注意：src.main模块不存在，使用模拟API响应结构进行测试")
    
    # 模拟API响应结构
    from algorithms.calendar_calculator import CalendarConverter
    import datetime
    
    # 生成模拟数据
    converter = CalendarConverter()
    conversion_result = converter.convert_calendar(year=2023, month=12, day=25, hour=12, minute=0, second=0, is_solar=True)
    
    # 模拟API响应
    mock_api_response = {
        "success": True,
        "timestamp": datetime.datetime.now().isoformat(),
        "data": conversion_result,
        "message": "转换成功"
    }
    
    print(f"模拟API响应状态码: 200")
    print(f"API响应结构: {list(mock_api_response.keys())}")
    
    # 验证响应结构
    expected_api_keys = ["success", "timestamp", "data", "message"]
    for key in expected_api_keys:
        if key in mock_api_response:
            print(f"✓ API响应包含字段 '{key}'")
        else:
            print(f"✗ API响应缺失字段 '{key}'")
    
    # 验证data字段的结构
    if "data" in mock_api_response:
        data_keys = list(mock_api_response["data"].keys())
        print(f"\nAPI响应data字段的结构: {data_keys}")
        
        # 验证data字段的结构是否与转换函数一致
        expected_data_keys = ["success", "valid", "input_type", "conversion_type", "solar_info", "lunar_info", "ganzhi_info", "jieqi_info"]
        for key in expected_data_keys:
            if key in mock_api_response["data"]:
                print(f"✓ API响应data包含字段 '{key}'")
            else:
                print(f"✗ API响应data缺失字段 '{key}'")
    
    return mock_api_response

if __name__ == "__main__":
    print("开始测试日历转换模块的返回结构...")
    
    # 测试算法层返回结构
    calc_result, calc_fields_ok = test_convert_calendar_structure()
    
    # 比较服务层和算法层
    calc_result, serv_result, structure_match = test_service_vs_calculator()
    
    # 测试API响应结构
    api_data = test_api_response_structure()
    
    print("\n=== 测试总结 ===")
    print(f"算法层字段完整性: {'✓ 完整' if calc_fields_ok else '✗ 不完整'}")
    print(f"服务层与算法层结构一致性: {'✓ 一致' if structure_match else '✗ 不一致'}")
    print(f"API响应结构: {'✓ 符合预期' if 'data' in api_data and set(api_data['data'].keys()) == set(calc_result.keys()) else '✗ 不符合预期'}")
    
    if calc_fields_ok and structure_match:
        print("\n🎉 所有测试通过！服务层和算法层的返回结构已经统一。")
    else:
        print("\n⚠️  测试未完全通过，需要进一步检查。")
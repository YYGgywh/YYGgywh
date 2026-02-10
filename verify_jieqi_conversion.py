#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证节气信息转换结果正确性的测试脚本
"""

import sys
import os

# 添加项目路径，确保能导入src模块
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from src.core.calendar_service import CalendarService

def test_jieqi_conversion():
    """
    测试节气信息转换结果
    """
    print("=== 节气信息转换测试 ===")
    
    # 测试用例1：2023-12-25 (大雪后，冬至后)
    print("\n测试用例1：2023-12-25 12:00:00")
    result1 = CalendarService.convert_solar_to_lunar(2023, 12, 25, 12, 0, 0)
    print(f"转换成功: {result1['success']}, 有效: {result1['valid']}")
    if result1['valid'] and 'jieqi_info' in result1:
        jieqi1 = result1['jieqi_info']['jieqi_result_a']
        print(f"上一个节: {jieqi1['prev_jie']['name']} ({jieqi1['prev_jie']['time']})")
        print(f"上一个气: {jieqi1['prev_qi']['name']} ({jieqi1['prev_qi']['time']})")
        print(f"当前占时: {jieqi1['new']['time']}")
        print(f"下一个节: {jieqi1['next_jie']['name']} ({jieqi1['next_jie']['time']})")
        print(f"下一个气: {jieqi1['next_qi']['name']} ({jieqi1['next_qi']['time']})")
    
    # 测试用例2：2024-01-01 (冬至后，小寒前)
    print("\n测试用例2：2024-01-01 10:00:00")
    result2 = CalendarService.convert_solar_to_lunar(2024, 1, 1, 10, 0, 0)
    print(f"转换成功: {result2['success']}, 有效: {result2['valid']}")
    if result2['valid'] and 'jieqi_info' in result2:
        jieqi2 = result2['jieqi_info']['jieqi_result_a']
        print(f"上一个节: {jieqi2['prev_jie']['name']} ({jieqi2['prev_jie']['time']})")
        print(f"上一个气: {jieqi2['prev_qi']['name']} ({jieqi2['prev_qi']['time']})")
        print(f"当前占时: {jieqi2['new']['time']}")
        print(f"下一个节: {jieqi2['next_jie']['name']} ({jieqi2['next_jie']['time']})")
        print(f"下一个气: {jieqi2['next_qi']['name']} ({jieqi2['next_qi']['time']})")
    
    # 测试用例3：2024-01-06 (小寒当天)
    print("\n测试用例3：2024-01-06 05:00:00 (小寒后)")
    result3 = CalendarService.convert_solar_to_lunar(2024, 1, 6, 5, 0, 0)
    print(f"转换成功: {result3['success']}, 有效: {result3['valid']}")
    if result3['valid'] and 'jieqi_info' in result3:
        jieqi3 = result3['jieqi_info']['jieqi_result_a']
        print(f"上一个节: {jieqi3['prev_jie']['name']} ({jieqi3['prev_jie']['time']})")
        print(f"上一个气: {jieqi3['prev_qi']['name']} ({jieqi3['prev_qi']['time']})")
        print(f"当前占时: {jieqi3['new']['time']}")
        print(f"下一个节: {jieqi3['next_jie']['name']} ({jieqi3['next_jie']['time']})")
        print(f"下一个气: {jieqi3['next_qi']['name']} ({jieqi3['next_qi']['time']})")
    
    # 测试用例4：2024-02-04 (立春)
    print("\n测试用例4：2024-02-04 10:00:00 (立春后)")
    result4 = CalendarService.convert_solar_to_lunar(2024, 2, 4, 10, 0, 0)
    print(f"转换成功: {result4['success']}, 有效: {result4['valid']}")
    if result4['valid'] and 'jieqi_info' in result4:
        jieqi4 = result4['jieqi_info']['jieqi_result_a']
        print(f"上一个节: {jieqi4['prev_jie']['name']} ({jieqi4['prev_jie']['time']})")
        print(f"上一个气: {jieqi4['prev_qi']['name']} ({jieqi4['prev_qi']['time']})")
        print(f"当前占时: {jieqi4['new']['time']}")
        print(f"下一个节: {jieqi4['next_jie']['name']} ({jieqi4['next_jie']['time']})")
        print(f"下一个气: {jieqi4['next_qi']['name']} ({jieqi4['next_qi']['time']})")

if __name__ == "__main__":
    test_jieqi_conversion()

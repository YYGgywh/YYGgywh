#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试新添加的Solar.fromBaZi功能
"""

import sys
sys.path.append('.')

from src.utils.verify_pillars import get_simple_pillars_conversion

def test_convert_pillars_to_solar():
    """测试四柱转换功能"""
    print("=== 测试有效四柱组合 ===")
    result1 = get_simple_pillars_conversion('甲辰', '丁丑', '癸卯', '癸亥')
    print(f'成功: {result1["success"]}')
    if result1['success']:
        print(f'匹配数量: {result1["total_matches"]}')
        if result1['solar_dates']:
            first = result1['solar_dates'][0]
            print(f'第一个结果: {first["solar_date"]}')
    
    print("\n=== 测试另一个有效四柱组合 ===")
    result2 = get_simple_pillars_conversion('癸卯', '庚申', '丙午', '戊戌')
    print(f'成功: {result2["success"]}')
    if result2['success']:
        print(f'匹配数量: {result2["total_matches"]}')
    
    print("\n=== 测试无效四柱 ===")
    result3 = get_simple_pillars_conversion('甲子', '戊寅', '戊辰', '庚午')
    print(f'成功: {result3["success"]}')
    if not result3['success']:
        print(f'错误信息: {result3["error"]}')
    
    print("\n=== 测试返回数据结构 ===")
    print(f'成功状态: {result1["success"]}')
    print(f'匹配数量: {result1["total_matches"]}')
    if result1['solar_dates']:
        print(f'第一个结果格式: {type(result1["solar_dates"][0])}')

if __name__ == "__main__":
    test_convert_pillars_to_solar()
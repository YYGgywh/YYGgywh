#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试四柱转公历API接口的完整性和准确性
"""

import sys
import os

# 添加backend目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.core.calendar_algorithm_core import calendar_algorithm_core

def test_pillars_conversion_api():
    """测试四柱转公历API接口"""
    print("=== 测试四柱转公历功能 ===")
    
    test_cases = [
        {
            'name': '有效四柱组合',
            'pillars': {
                'year_pillar': '甲辰',
                'month_pillar': '丁丑', 
                'day_pillar': '癸卯',
                'hour_pillar': '癸亥'
            }
        },
        {
            'name': '边界测试',
            'pillars': {
                'year_pillar': '甲子',
                'month_pillar': '丙寅',
                'day_pillar': '戊辰',
                'hour_pillar': '庚午'
            }
        },
        {
            'name': '无效四柱组合',
            'pillars': {
                'year_pillar': '无效',
                'month_pillar': '四柱',
                'day_pillar': '组合',
                'hour_pillar': '测试'
            }
        }
    ]
    
    for test in test_cases:
        print(f'\n测试: {test["name"]}')
        print(f'输入四柱: {test["pillars"]}')
        
        try:
            result = calendar_algorithm_core.convert_pillars_to_calendar(**test['pillars'])
            print('✅ 转换成功')
            print(f'   匹配结果数量: {len(result.get("matching_dates", []))}')
            if result.get('matching_dates'):
                print(f'   第一个结果: {result["matching_dates"][0]["solar_date"]}')
                # 显示更多详细信息
                calendar_info = result["matching_dates"][0]["calendar_info"]
                if calendar_info:
                    print(f'   农历信息: {calendar_info.get("lunar_collection", {}).get("lunar_date", "N/A")}')
                    print(f'   年干支: {calendar_info.get("ganzhi_collection", {}).get("ganzhi_year", "N/A")}')
        except Exception as e:
            print(f'❌ 转换失败: {e}')
    
    print('\n=== 测试完成 ===')

def test_solar_frombazi_directly():
    """直接测试Solar.fromBaZi方法"""
    print("\n=== 直接测试Solar.fromBaZi方法 ===")
    
    try:
        from lunar_python import Solar
        
        # 测试Solar.fromBaZi方法
        pillars = ['甲辰', '丁丑', '癸卯', '癸亥']
        print(f"测试四柱: {pillars}")
        
        # 使用sect=1, baseYear=1
        matching_solars = Solar.fromBaZi(pillars[0], pillars[1], pillars[2], pillars[3], 1, 1)
        
        print(f"✅ Solar.fromBaZi调用成功")
        print(f"   匹配结果数量: {len(matching_solars)}")
        
        if matching_solars:
            for i, solar in enumerate(matching_solars[:3]):  # 只显示前3个结果
                print(f"   结果{i+1}: {solar.toYmdHms()}")
        
    except Exception as e:
        print(f"❌ Solar.fromBaZi调用失败: {e}")

if __name__ == "__main__":
    test_pillars_conversion_api()
    test_solar_frombazi_directly()
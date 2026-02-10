#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试简化的四柱转换方法
"""

import sys
sys.path.append('.')

from src.utils.verify_pillars import get_simple_pillars_conversion

def test_simple_conversion():
    """测试简化四柱转换方法"""
    print("=== 测试简化四柱转换方法 ===")
    
    # 测试有效四柱组合
    year_pillar = '甲辰'
    month_pillar = '丁丑'
    day_pillar = '癸卯'
    time_pillar = '癸亥'
    
    result = get_simple_pillars_conversion(year_pillar, month_pillar, day_pillar, time_pillar)
    print(f'成功: {result["success"]}')
    
    if result['success']:
        print(f'匹配数量: {result["total_matches"]}')
        
        # 获取当前测试的四柱作为输入信息
        print(f'测试的输入四柱: 年柱{year_pillar}, 月柱{month_pillar}, 日柱{day_pillar}, 时柱{time_pillar}')
        
        if result['solar_dates']:
                print('\n前3个匹配结果:')
                for i, solar_date_entry in enumerate(result['solar_dates'][:3]):       
                    solar_date_str = solar_date_entry["solar_date"]
                    print(f'{i+1}. {solar_date_str}')
                    
                    # 解析日期字符串格式：YYYY-MM-DD HH:mm:ss
                    if solar_date_str and len(solar_date_str) >= 19:
                        ymd_part, hms_part = solar_date_str.split(' ')
                        year, month, day = ymd_part.split('-')
                        hour, minute, second = hms_part.split(':')
                        print(f'   年月日: {year}-{month}-{day}')
                        print(f'   时分秒: {hour}:{minute}:{second}')
    else:
        print(f'错误信息: {result["error"]}')

if __name__ == "__main__":
    test_simple_conversion()
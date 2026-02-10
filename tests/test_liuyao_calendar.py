#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试六爻算法与农历日历功能
"""

import sys
import os
from datetime import datetime

# 添加backend/src到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'src'))

from algorithms.liuyao_calculator import liuyao_calculator

def test_liuyao_with_lunar_calendar():
    """测试六爻算法与农历日历功能"""
    print("=== 测试六爻算法与农历日历功能 ===")
    print()
    
    # 测试1：基本起卦
    print("测试1：基本起卦（铜钱法）")
    result1 = liuyao_calculator.divine_hexagram(
        method="coin",
        question="测试事业运势",
        divination_time=datetime.now()
    )
    
    print(f"起卦方法: {result1['divination_info']['method']}")
    print(f"问题: {result1['divination_info']['question']}")
    print(f"公历时间: {result1['divination_info']['calendar_info']['solar_date']}")
    print(f"农历时间: {result1['divination_info']['calendar_info']['lunar_date']}")
    
    if result1['divination_info']['calendar_info']['ganzhi']:
        ganzhi = result1['divination_info']['calendar_info']['ganzhi']
        print(f"干支: {ganzhi['year']}年{ganzhi['month']}月{ganzhi['day']}日{ganzhi['time']}时")
    
    print(f"本卦: {result1['original_hexagram']['name']}")
    print(f"爻线: {'-'.join(result1['original_hexagram']['lines'])}")
    print(f"动爻: {result1['original_hexagram']['changing_lines']}")
    print(f"变卦: {result1['changed_hexagram']['name']}")
    print(f"解读: {result1['interpretation']}")
    print()
    
    # 测试2：不同问题类型
    print("测试2：感情问题起卦")
    result2 = liuyao_calculator.divine_hexagram(
        method="coin",
        question="测试感情运势",
        divination_time=datetime.now()
    )
    
    print(f"问题: {result2['divination_info']['question']}")
    print(f"本卦: {result2['original_hexagram']['name']}")
    print(f"解读: {result2['interpretation']}")
    print()
    
    # 测试3：获取六十四卦列表
    print("测试3：获取六十四卦列表")
    hexagram_list = liuyao_calculator.get_hexagram_list()
    print(f"已定义卦象数量: {len(hexagram_list)}")
    for i, hexagram in enumerate(hexagram_list[:5]):  # 只显示前5个
        print(f"  {i+1}. {hexagram['name']}: {'-'.join(hexagram['lines'])}")
    print()
    
    # 测试4：农历日历功能
    print("测试4：农历日历功能测试")
    from algorithms.lunar_calendar import LunarCalendar
    calendar = LunarCalendar()
    test_date = datetime.now()
    print(f"测试日期: {test_date.strftime('%Y年%m月%d日')}")
    print(f"农历日期: {calendar.get_lunar_date(test_date)}")
    print(f"干支年份: {calendar.get_ganzhi_year(test_date.year)}")
    print(f"节气: {calendar.get_jieqi(test_date)}")
    print(f"星座: {calendar.get_constellation(test_date)}")
    print()

if __name__ == "__main__":
    test_liuyao_with_lunar_calendar()
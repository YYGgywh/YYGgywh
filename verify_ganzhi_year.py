#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证年干支字段的实际返回值
"""

import sys
import os

# 添加项目路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from src.core.calendar_service import CalendarService

def verify_ganzhi_year():
    """
    验证年干支字段的实际返回值
    """
    print("=== 验证年干支字段实际返回值 ===")
    
    # 测试2023年12月25日的转换
    result = CalendarService.convert_solar_to_lunar(2023, 12, 25, 12, 0, 0)
    
    if result['success'] and result['valid']:
        lunar_info = result['lunar_info']
        print("转换成功，农历信息如下：")
        print(f"lunar_year: {lunar_info['lunar_year']}")
        print(f"lunar_year_in_Chinese: '{lunar_info['lunar_year_in_Chinese']}'")
        print(f"lunar_year_in_GanZhi: '{lunar_info['lunar_year_in_GanZhi']}'")
        print(f"lunar_year_in_Gan: '{lunar_info['lunar_year_in_Gan']}'")
        print(f"lunar_year_in_Zhi: '{lunar_info['lunar_year_in_Zhi']}'")
        print(f"lunar_string: '{lunar_info['lunar_string']}'")
        print(f"lunar_full_string: '{lunar_info['lunar_full_string']}'")
        
        # 验证是否包含"年"字
        print(f"\n验证：")
        print(f"lunar_year_in_GanZhi是否包含'年'字: {'年' in lunar_info['lunar_year_in_GanZhi']}")
        print(f"lunar_full_string是否包含'年'字: {'年' in lunar_info['lunar_full_string']}")
    else:
        print("转换失败：")
        print(f"错误信息: {result.get('error')}")

if __name__ == "__main__":
    verify_ganzhi_year()

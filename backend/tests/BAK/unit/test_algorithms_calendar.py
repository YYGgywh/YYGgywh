#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试简化后的历法计算器
"""

from datetime import datetime
from src.algorithms.calendar_calculator import CalendarConverter
from lunar_python import Solar

def test_simplified_calendar():
    """测试简化后的历法计算器"""
    calculator = CalendarConverter()
    current_datetime = datetime.now()
    now = Solar.fromDate(current_datetime)
    
    print('=== 简化版历法计算器测试 ===')
    
    # 使用convert_calendar方法获取所有信息
    result = calculator.convert_calendar(now.getYear(), now.getMonth(), now.getDay(), 
                                        now.getHour(), now.getMinute(), now.getSecond(), 
                                        is_solar=True)
    
    if result["success"] and result["valid"]:
        solar_info = result["solar_info"]
        lunar_info = result["lunar_info"]
        ganzhi_info = result["ganzhi_info"]
        jieqi_info = result["jieqi_info"]
        
        # 测试公历信息
        print('\n1. 公历信息测试:')
        print('公历日期:', solar_info.get("solar_Ymd", "N/A"))
        print('星期:', solar_info.get("solar_week", "N/A"))
        
        # 测试农历信息
        print('\n2. 农历信息测试:')
        print('农历日期:', lunar_info.get("lunar_full_string", "N/A"))
        print('生肖:', lunar_info.get("lunar_animal", "N/A"))
        
        # 测试节气信息
        print('\n3. 节气信息测试:')
        # 根据jieqi_info的实际结构显示信息
        if "prev_jie_name" in jieqi_info:
            print('前一个节气:', jieqi_info.get("prev_jie_name", "N/A"))
        if "next_jie_name" in jieqi_info:
            print('下一个节气:', jieqi_info.get("next_jie_name", "N/A"))
        
        # 测试综合信息
        print('\n4. 综合历法信息测试:')
        print('年干支:', ganzhi_info.get("lunar_year_in_ganzhi_exact", "N/A"))
        print('月干支:', ganzhi_info.get("lunar_month_in_ganzhi_exact", "N/A"))
        print('日干支:', ganzhi_info.get("lunar_day_in_ganzhi_exact", "N/A"))
    else:
        print('转换失败:', result.get('error', '未知错误'))
    
    print('\n=== 测试完成 ===')

if __name__ == "__main__":
    test_simplified_calendar()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测试四柱转换功能（流派1，晚子时算明天）"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from src.core.calendar_algorithm_core import convert_pillars_to_calendar
    
    # 测试四柱转换功能（流派1，晚子时算明天）
    print("=== 测试四柱转换功能（流派1，晚子时算明天） ===")
    
    result = convert_pillars_to_calendar('甲子', '丙寅', '戊辰', '壬子')
    
    print(f'成功: {result["success"]}')
    
    if result["success"]:
        print(f'匹配记录数: {result["total_matches"]}')
        print(f'主要结果: {result["primary_result"]}')
        
        if result["matching_dates"]:
            print('匹配日期列表:')
            for i, date in enumerate(result["matching_dates"], 1):
                print(f'  {i}. {date}')
        
        # 检查multiple_results字段
        if "multiple_results" in result:
            print(f'详细匹配结果数量: {len(result["multiple_results"])}')
    else:
        print(f'错误: {result["error"]}')
        
except Exception as e:
    print(f"测试过程中出现错误: {e}")
    import traceback
    traceback.print_exc()
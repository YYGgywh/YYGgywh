"""
测试API返回的数据结构，验证是否遵循阳历计算结果的键名规则
"""

import sys
import os

# 添加项目路径到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.core.calendar_algorithm_core import CalendarAlgorithmCore

def test_api_data_structure():
    """测试API返回的数据结构"""
    print("=== 测试API返回的数据结构 ===\n")
    
    # 测试几个重要日期
    test_dates = [
        ("2025-10-01", "国庆节"),
        ("2025-12-25", "圣诞节"),
        ("2025-03-15", "消费者权益日"),
        ("2025-02-14", "情人节"),
        ("2025-06-01", "儿童节")
    ]
    
    for date_str, description in test_dates:
        print(f"\n--- 测试日期: {date_str} ({description}) ---")
        
        # 解析日期
        year, month, day = map(int, date_str.split('-'))
        
        # 调用服务获取数据
        result = CalendarService.convert_solar_to_lunar(year, month, day)
        
        # 检查数据结构中的键名
        print("返回数据的顶层键:")
        for key in result.keys():
            print(f"  '{key}'")
        
        # 检查solar集合中的键名
        if "solar" in result:
            print("\nsolar集合中的键名:")
            for key in result["solar"].keys():
                print(f"  '{key}'")
        
        # 检查lunar集合中的键名
        if "lunar" in result:
            print("\nlunar集合中的键名:")
            for key in result["lunar"].keys():
                print(f"  '{key}'")
        
        # 检查ganzhi集合中的键名
        if "ganzhi" in result:
            print("\nganzhi集合中的键名:")
            for key in result["ganzhi"].keys():
                print(f"  '{key}'")
                
        # 检查阳历相关字段是否以solar_开头
        print("\n检查阳历相关字段命名规范:")
        if "solar" in result:
            solar_fields = result["solar"]
            for key in solar_fields.keys():
                if key.startswith("solar_"):
                    print(f"  ✓ '{key}' 符合规范")
                else:
                    print(f"  ✗ '{key}' 不符合规范")

if __name__ == "__main__":
    test_api_data_structure()
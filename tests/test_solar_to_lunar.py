# test_solar_to_lunar.py 2025-11-29 12:00:00
# 功能：测试前端公历时间转换为农历表达的功能

import sys
import os
from datetime import datetime

# 添加backend目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.algorithms.calendar_calculator import CalendarCalculator

def test_solar_to_lunar_conversion():
    """测试公历转农历功能"""
    print("=== 前端公历时间转农历表达测试 ===")
    print()
    
    # 创建计算器实例
    calculator = CalendarCalculator()
    
    # 测试1：正常日期转换
    print("测试1：正常日期转换（当前时间）")
    now = datetime.now()
    result = calculator.convert_solar_to_lunar(
        now.year, now.month, now.day, now.hour, now.minute, now.second
    )
    
    if result["success"]:
        print("转换成功")
        print(f"输入时间: {result['input']['solar_datetime']}")
        print(f"公历表达: {result['output']['solar_expression']}")
        print(f"农历表达: {result['output']['lunar_expression']}")
        print(f"干支年份: {result['output']['ganzhi_year']}")
        print(f"节气: {result['output']['jieqi']}")
        print(f"星期: {result['output']['weekday']}")
    else:
        print("✗ 转换失败")
        print(f"错误信息: {result['error']}")
    print()
    
    # 测试2：特殊日期（春节）
    print("测试2：特殊日期（2025年春节）")
    result = calculator.convert_solar_to_lunar(2025, 1, 29, 12, 0, 0)  # 2025年春节
    
    if result["success"]:
        print("✓ 转换成功")
        print(f"输入时间: {result['input']['solar_datetime']}")
        print(f"公历表达: {result['output']['solar_expression']}")
        print(f"农历表达: {result['output']['lunar_expression']}")
        print(f"干支年份: {result['output']['ganzhi_year']}")
        print(f"节气: {result['output']['jieqi']}")
    else:
        print("✗ 转换失败")
        print(f"错误信息: {result['error']}")
    print()
    
    # 测试3：节气日期（立春）
    print("测试3：节气日期（2025年立春）")
    result = calculator.convert_solar_to_lunar(2025, 2, 4, 10, 30, 0)  # 2025年立春
    
    if result["success"]:
        print("✓ 转换成功")
        print(f"输入时间: {result['input']['solar_datetime']}")
        print(f"公历表达: {result['output']['solar_expression']}")
        print(f"农历表达: {result['output']['lunar_expression']}")
        print(f"干支年份: {result['output']['ganzhi_year']}")
        print(f"节气: {result['output']['jieqi']}")
    else:
        print("✗ 转换失败")
        print(f"错误信息: {result['error']}")
    print()
    
    # 测试4：边界值测试（午夜）
    print("测试4：边界值测试（午夜时间）")
    result = calculator.convert_solar_to_lunar(2025, 6, 15, 23, 59, 59)  # 午夜
    
    if result["success"]:
        print("✓ 转换成功")
        print(f"输入时间: {result['input']['solar_datetime']}")
        print(f"公历表达: {result['output']['solar_expression']}")
        print(f"农历表达: {result['output']['lunar_expression']}")
    else:
        print("✗ 转换失败")
        print(f"错误信息: {result['error']}")
    print()
    
    # 测试5：错误输入测试
    print("测试5：错误输入测试")
    
    # 无效月份
    result = calculator.convert_solar_to_lunar(2025, 13, 1, 12, 0, 0)
    if not result["success"]:
        print("✓ 无效月份检测正常")
        print(f"错误信息: {result['error']}")
    
    # 无效小时
    result = calculator.convert_solar_to_lunar(2025, 6, 15, 25, 0, 0)
    if not result["success"]:
        print("✓ 无效小时检测正常")
        print(f"错误信息: {result['error']}")
    
    # 无效分钟
    result = calculator.convert_solar_to_lunar(2025, 6, 15, 12, 60, 0)
    if not result["success"]:
        print("✓ 无效分钟检测正常")
        print(f"错误信息: {result['error']}")
    print()
    
    # 测试6：详细信息查看
    print("测试6：详细信息查看")
    result = calculator.convert_solar_to_lunar(2025, 12, 25, 18, 30, 45)  # 圣诞节
    
    if result["success"]:
        print("详细信息获取成功")
        print("详细公历信息:")
        for key, value in result["detailed_info"]["solar"].items():
            print(f"  {key}: {value}")
        print("详细农历信息:")
        for key, value in result["detailed_info"]["lunar"].items():
            print(f"  {key}: {value}")
    else:
        print("✗ 详细信息获取失败")
        print(f"错误信息: {result['error']}")
    print()
    
    print("=== 测试完成 ===")

if __name__ == "__main__":
    test_solar_to_lunar_conversion()
"""
lunar-python库准确性验证测试
验证农历计算、节气、干支等功能的准确性
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from src.algorithms.calendar_calculator import CalendarCalculator
from lunar_python import Solar, Lunar

def validate_known_important_dates():
    """验证已知重要日期的准确性"""
    print("=== 验证已知重要日期的准确性 ===")
    
    calc = CalendarCalculator()
    
    # 已知的重要日期和对应的农历信息
    known_dates = [
        # (公历日期, 期望农历日期, 期望生肖, 期望年干支)
        ((2024, 1, 1), "二〇二三年冬月二十", "兔", "癸卯"),
        ((2024, 2, 10), "二〇二四年正月初一", "龙", "甲辰"),  # 春节
        ((2024, 6, 10), "二〇二四年五月初五", "龙", "甲辰"),  # 端午节
        ((2024, 9, 17), "二〇二四年八月十五", "龙", "甲辰"),  # 中秋节
        ((2024, 12, 31), "二〇二四年腊月初一", "龙", "甲辰"), # 除夕
        ((2023, 1, 1), "二〇二二年腊月初十", "虎", "壬寅"),
        ((2025, 1, 1), "二〇二四年腊月初二", "龙", "甲辰"),
    ]
    
    all_passed = True
    
    for solar_date, expected_lunar, expected_animal, expected_ganzhi in known_dates:
        year, month, day = solar_date
        
        # 使用CalendarCalculator获取信息
        info = calc.get_comprehensive_calendar_info(year, month, day)
        
        actual_lunar = info['lunar']['lunar_date']
        actual_animal = info['lunar']['animal']
        actual_ganzhi = info['ganzhi']['year_ganzhi']
        
        # 验证结果
        lunar_match = actual_lunar == expected_lunar
        animal_match = actual_animal == expected_animal
        ganzhi_match = actual_ganzhi == expected_ganzhi
        
        status = "✓" if lunar_match and animal_match and ganzhi_match else "✗"
        
        print(f"{status} {year}-{month:02d}-{day:02d}:")
        print(f"  农历: {actual_lunar} {'==' if lunar_match else '!='} {expected_lunar}")
        print(f"  生肖: {actual_animal} {'==' if animal_match else '!='} {expected_animal}")
        print(f"  年干支: {actual_ganzhi} {'==' if ganzhi_match else '!='} {expected_ganzhi}")
        
        if not (lunar_match and animal_match and ganzhi_match):
            all_passed = False
    
    print(f"\n重要日期验证: {'全部通过' if all_passed else '存在错误'}")
    return all_passed

def validate_jieqi_accuracy():
    """验证节气准确性"""
    print("\n=== 验证节气准确性 ===")
    
    calc = CalendarCalculator()
    
    # 2024年的主要节气日期
    jieqi_2024 = [
        ((2024, 1, 6), "小寒"),
        ((2024, 1, 20), "大寒"),
        ((2024, 2, 4), "立春"),
        ((2024, 2, 19), "雨水"),
        ((2024, 3, 5), "惊蛰"),
        ((2024, 3, 20), "春分"),
        ((2024, 4, 4), "清明"),
        ((2024, 4, 19), "谷雨"),
        ((2024, 5, 5), "立夏"),
        ((2024, 5, 20), "小满"),
        ((2024, 6, 5), "芒种"),
        ((2024, 6, 21), "夏至"),
        ((2024, 7, 6), "小暑"),
        ((2024, 7, 22), "大暑"),
        ((2024, 8, 7), "立秋"),
        ((2024, 8, 22), "处暑"),
        ((2024, 9, 7), "白露"),
        ((2024, 9, 22), "秋分"),
        ((2024, 10, 8), "寒露"),
        ((2024, 10, 23), "霜降"),
        ((2024, 11, 7), "立冬"),
        ((2024, 11, 22), "小雪"),
        ((2024, 12, 6), "大雪"),
        ((2024, 12, 21), "冬至"),
    ]
    
    all_passed = True
    correct_count = 0
    
    for solar_date, expected_jieqi in jieqi_2024:
        year, month, day = solar_date
        
        # 使用CalendarCalculator获取节气信息
        jieqi_info = calc.get_jieqi_info(year, month, day)
        actual_jieqi = jieqi_info['jieqi']
        
        # 验证结果
        jieqi_match = actual_jieqi == expected_jieqi
        
        status = "✓" if jieqi_match else "✗"
        
        print(f"{status} {year}-{month:02d}-{day:02d}: {actual_jieqi} {'==' if jieqi_match else '!='} {expected_jieqi}")
        
        if jieqi_match:
            correct_count += 1
        else:
            all_passed = False
    
    accuracy = correct_count / len(jieqi_2024) * 100
    print(f"\n节气准确性: {correct_count}/{len(jieqi_2024)} ({accuracy:.1f}%)")
    return all_passed

def validate_leap_month_handling():
    """验证闰月处理"""
    print("\n=== 验证闰月处理 ===")
    
    calc = CalendarCalculator()
    
    # 测试闰月年份
    leap_month_years = [
        (2023, 2),  # 2023年闰二月
        (2025, 6),  # 2025年闰六月
        (2028, 5),  # 2028年闰五月
    ]
    
    all_passed = True
    
    for year, leap_month in leap_month_years:
        # 测试闰月
        print(f"\n--- 测试 {year} 年闰{leap_month}月 ---")
        
        # 测试闰月第一天
        solar_date = (year, leap_month + 1, 1)  # 闰月通常在下个月
        info = calc.get_comprehensive_calendar_info(*solar_date)
        
        lunar_info = info['lunar']
        print(f"  农历日期: {lunar_info['lunar_date']}")
        print(f"  是否闰月: {lunar_info['is_leap_month']}")
        
        # 验证闰月标识
        if lunar_info['is_leap_month']:
            print("  ✓ 闰月标识正确")
        else:
            print("  ✗ 闰月标识可能不正确")
            all_passed = False
    
    return all_passed

def validate_ganzhi_consistency():
    """验证干支一致性"""
    print("\n=== 验证干支一致性 ===")
    
    calc = CalendarCalculator()
    
    # 测试干支循环（60年一个周期），使用春节后的日期
    test_dates = [
        (1984, 2, 2),  # 1984年春节（甲子年）
        (2044, 2, 1),  # 2044年春节（甲子年）
    ]
    
    all_passed = True
    
    for year, month, day in test_dates:
        print(f"\n--- 测试 {year} 年{month}月{day}日（甲子年春节）---")
        
        info = calc.get_comprehensive_calendar_info(year, month, day)
        ganzhi_info = info['ganzhi']
        
        print(f"  年干支: {ganzhi_info['year_ganzhi']}")
        print(f"  月干支: {ganzhi_info['month_ganzhi']}")
        print(f"  日干支: {ganzhi_info['day_ganzhi']}")
        
        # 验证甲子年
        if ganzhi_info['year_ganzhi'] == "甲子":
            print("  ✓ 甲子年验证通过")
        else:
            print("  ✗ 甲子年验证失败")
            all_passed = False
    
    return all_passed

def main():
    """运行所有准确性验证"""
    print("开始lunar-python库准确性验证...\n")
    
    try:
        results = []
        
        # 运行各项验证
        results.append(("重要日期验证", validate_known_important_dates()))
        results.append(("节气准确性", validate_jieqi_accuracy()))
        results.append(("闰月处理", validate_leap_month_handling()))
        results.append(("干支一致性", validate_ganzhi_consistency()))
        
        # 统计结果
        print("\n" + "="*50)
        print("验证结果汇总:")
        print("="*50)
        
        passed_count = 0
        for test_name, result in results:
            status = "通过" if result else "失败"
            symbol = "✓" if result else "✗"
            print(f"{symbol} {test_name}: {status}")
            if result:
                passed_count += 1
        
        total_tests = len(results)
        overall_accuracy = passed_count / total_tests * 100
        
        print(f"\n总体准确率: {passed_count}/{total_tests} ({overall_accuracy:.1f}%)")
        
        if passed_count == total_tests:
            print("🎉 所有验证通过！lunar-python库准确性极高！")
        else:
            print("⚠️  部分验证失败，建议进一步检查")
        
    except Exception as e:
        print(f"❌ 验证过程中出现错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
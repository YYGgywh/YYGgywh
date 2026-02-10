#!/usr/bin/env python3
"""
四柱验证调试脚本
用于分析验证不一致问题
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))

from utils.verify_pillars import verify_pillars

def debug_verify_pillars():
    """调试四柱验证"""
    
    # 测试用例2：乙丑年丁卯月己巳日癸丑时
    year_pillar = "乙丑"
    month_pillar = "丁卯"
    day_pillar = "己巳"
    hour_pillar = "癸丑"
    
    print(f"测试四柱组合: {year_pillar}年{month_pillar}月{day_pillar}日{hour_pillar}时")
    
    # 验证五虎遁规则
    year_gan = year_pillar[0]  # 乙
    month_zhi = month_pillar[1]  # 卯
    
    print(f"年干: {year_gan}, 月支: {month_zhi}")
    
    # 五虎遁规则：甲己之年丙作首，乙庚之岁戊为头
    wuhu_dun_rules = {
        "甲": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "乙": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "丙": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "丁": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "戊": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "己": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "庚": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "辛": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "壬": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "癸": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"]
    }
    
    # 月支对应的索引
    zhi_to_index = {"寅": 0, "卯": 1, "辰": 2, "巳": 3, "午": 4, "未": 5, 
                   "申": 6, "酉": 7, "戌": 8, "亥": 9, "子": 10, "丑": 11}
    
    if year_gan in wuhu_dun_rules and month_zhi in zhi_to_index:
        expected_gan = wuhu_dun_rules[year_gan][zhi_to_index[month_zhi]]
        actual_gan = month_pillar[0]
        
        print(f"五虎遁验证: 年干{year_gan}对应月支{month_zhi}应为{expected_gan}，实际为{actual_gan}")
        
        if expected_gan != actual_gan:
            print("❌ 五虎遁验证失败")
        else:
            print("✅ 五虎遁验证通过")
    
    # 验证五鼠遁规则
    day_gan = day_pillar[0]  # 己
    time_zhi = hour_pillar[1]  # 丑
    
    print(f"日干: {day_gan}, 时支: {time_zhi}")
    
    # 五鼠遁规则：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
    wushu_dun_rules = {
        "甲": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "乙": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "丙": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "丁": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "戊": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        "己": ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"],
        "庚": ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"],
        "辛": ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"],
        "壬": ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"],
        "癸": ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    }
    
    if day_gan in wushu_dun_rules and time_zhi in zhi_to_index:
        expected_gan = wushu_dun_rules[day_gan][zhi_to_index[time_zhi]]
        actual_gan = hour_pillar[0]
        
        print(f"五鼠遁验证: 日干{day_gan}对应时支{time_zhi}应为{expected_gan}，实际为{actual_gan}")
        
        if expected_gan != actual_gan:
            print("❌ 五鼠遁验证失败")
        else:
            print("✅ 五鼠遁验证通过")
    
    # 调用verify_pillars函数
    print("\n调用verify_pillars函数:")
    result = verify_pillars(year_pillar, month_pillar, day_pillar, hour_pillar)
    print(f"验证结果: {result}")

def main():
    """主函数"""
    debug_verify_pillars()

if __name__ == "__main__":
    main()
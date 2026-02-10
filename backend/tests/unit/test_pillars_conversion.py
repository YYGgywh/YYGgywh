#!/usr/bin/env python3
"""
四柱转换功能测试脚本
"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_pillars_conversion():
    """测试四柱转换功能"""
    print("=" * 60)
    print("四柱转换功能测试")
    print("=" * 60)
    
    try:
        # 导入核心模块
        from core.calendar_service import calendar_service, CalendarError
        
        # 测试1: 已知有效的四柱组合
        print("\n1. 测试已知有效的四柱组合")
        pillars_1 = {
            "year_pillar": "甲辰",
            "month_pillar": "丁丑",
            "day_pillar": "癸卯",
            "hour_pillar": "癸亥"
        }
        
        try:
            result_1 = calendar_service.convert_pillars_to_calendar(**pillars_1)
            print("✅ 四柱转换成功")
            print(f"   输入四柱: {pillars_1}")
            print(f"   计算年柱: {result_1['ganzhi']['year']['ganzhi']}")
            print(f"   计算月柱: {result_1['ganzhi']['month']['ganzhi']}")
            print(f"   计算日柱: {result_1['ganzhi']['day']['ganzhi']}")
            print(f"   计算时柱: {result_1['ganzhi']['time']['ganzhi']}")
            print(f"   转换公历: {result_1['solar']['date']}")
        except Exception as e:
            print(f"❌ 四柱转换失败: {e}")
        
        # 测试2: 另一个有效的四柱组合
        print("\n2. 测试另一个有效的四柱组合")
        pillars_2 = {
            "year_pillar": "癸卯",
            "month_pillar": "庚申",
            "day_pillar": "丙午",
            "hour_pillar": "戊戌"
        }
        
        try:
            result_2 = calendar_service.convert_pillars_to_calendar(**pillars_2)
            print("✅ 四柱转换成功")
            print(f"   输入四柱: {pillars_2}")
            print(f"   计算年柱: {result_2['ganzhi']['year']['ganzhi']}")
            print(f"   计算月柱: {result_2['ganzhi']['month']['ganzhi']}")
            print(f"   计算日柱: {result_2['ganzhi']['day']['ganzhi']}")
            print(f"   计算时柱: {result_2['ganzhi']['time']['ganzhi']}")
            print(f"   转换公历: {result_2['solar']['date']}")
        except Exception as e:
            print(f"❌ 四柱转换失败: {e}")
        
        # 测试3: 无效的四柱组合
        print("\n3. 测试无效的四柱组合")
        pillars_3 = {
            "year_pillar": "无效",
            "month_pillar": "四柱",
            "day_pillar": "组合",
            "hour_pillar": "测试"
        }
        
        try:
            result_3 = calendar_service.convert_pillars_to_calendar(**pillars_3)
            print("❌ 意外成功 - 应该失败")
        except CalendarError as e:
            print(f"✅ 预期错误: {e}")
        
        # 测试4: 边界情况测试
        print("\n4. 测试边界情况")
        pillars_4 = {
            "year_pillar": "甲子",
            "month_pillar": "丙寅",
            "day_pillar": "戊辰",
            "hour_pillar": "庚午"
        }
        
        try:
            result_4 = calendar_service.convert_pillars_to_calendar(**pillars_4)
            print("✅ 边界情况测试成功")
            print(f"   转换公历: {result_4['solar']['date']}")
        except Exception as e:
            print(f"❌ 边界情况测试失败: {e}")
            
    except Exception as e:
        print(f"❌ 测试过程中发生异常: {e}")
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)

if __name__ == "__main__":
    test_pillars_conversion()

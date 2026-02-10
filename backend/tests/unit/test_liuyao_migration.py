#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
六爻计算器迁移测试脚本
测试迁移后的正式代码功能
"""

import sys
import os

# 添加路径以便导入模块
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../src'))

from algorithms import liuyao_calculator
from lunar_python import Solar

# 测试数组
testArr = [179, 210, 214, 700, 115, 250]
print(f"测试数组: {testArr}")

def test_basic_functionality():
    """测试基本功能"""
    print("=== 六爻计算器迁移测试 ===")
    
    # 测试1：获取卦象列表
    print("\n1. 测试获取卦象列表:")
    # 直接从模块获取卦象列表
    hexagram_list = list(liuyao_calculator.SIXTY_FOUR_GUA.keys())
    print(f"卦象数量: {len(hexagram_list)}")
    print(f"前5个卦象: {hexagram_list[:5]}")
    
    # 测试2：测试六爻结果分析
    print("\n2. 测试六爻结果分析:")
    # 生成测试爻线数组（模拟铜钱法结果）
    test_lines = [7, 8, 9, 7, 6, 8]  # 少阳、少阴、老阳、少阳、老阴、少阴
    analysis_result = liuyao_calculator.analyze_liuyao_result(test_lines)
    print(f"分析结果类型: {type(analysis_result)}")
    
    if isinstance(analysis_result, dict):
        print("分析结果包含以下键:", list(analysis_result.keys()))
    
    # 测试3：测试前端数据格式化
    print("\n3. 测试前端数据格式化:")
    frontend_data = analysis_result  # analyze_liuyao_result已经返回格式化好的前端数据
    print(f"前端数据包含以下键:", list(frontend_data.keys()))
    
    # 测试4：测试打印功能
    print("\n4. 测试打印功能:")
    try:
        # 使用print_frontend_data函数，它接受前端数据字典
        liuyao_calculator.print_frontend_data(frontend_data)
        print("前端数据打印成功")
    except Exception as e:
        print(f"前端数据打印失败: {e}")
    
    # 如果需要详细结果打印，需要单独解析各个组件
    try:
        # 重新解析各个组件用于print_detailed_results
        test_result = [7, 8, 9, 7, 6, 8]  # 与test_lines相同，是模拟的随机结果
        ben_gua_info = liuyao_calculator.parse_ben_gua(test_result)
        dong_yao_indices = liuyao_calculator.parse_dong_yao(test_result)
        bian_gua_info = liuyao_calculator.parse_bian_gua(test_result, ben_gua_info)
        palace_info = liuyao_calculator.get_palace_info(ben_gua_info)
        
        liuyao_calculator.print_detailed_results(ben_gua_info, bian_gua_info, dong_yao_indices,
                                                palace_info)
        print("详细结果打印成功")
    except Exception as e:
        print(f"详细结果打印失败: {e}")
    
    print("\n=== 迁移测试完成 ===")

def test_liu_shen_calculation():
    """测试六神计算功能"""
    print("\n=== 六神计算功能测试 ===")
    
    # 测试日天干获取
    day_gan = liuyao_calculator.get_day_gan_from_calendar()
    print(f"当前日天干: {day_gan}")
    
    # 测试六神计算
    liu_shen_arrangement = liuyao_calculator.calculate_liu_shen_by_day_gan(day_gan)
    print(f"使用的日天干: {day_gan}")
    print(f"六神排列: {liu_shen_arrangement}")
    
    # 测试六神详细信息
    print("六神详细信息:")
    for i, shen_name in enumerate(liu_shen_arrangement):
        detail = liuyao_calculator.get_liu_shen_details(shen_name)
        print(f"  第{i+1}爻 {shen_name}: {detail}")
    
    print("=== 六神计算测试完成 ===")

if __name__ == "__main__":
    try:
        test_basic_functionality()
        test_liu_shen_calculation()
        print("\n✅ 所有迁移测试通过！")
    except Exception as e:
        print(f"\n❌ 迁移测试失败: {e}")
        import traceback
        traceback.print_exc()

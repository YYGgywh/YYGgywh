#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
六爻排盘手动测试脚本
可以手动输入爻位列表进行准确性测试
"""

import sys
import os

# 添加项目路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.liuyao.liuyao_calculator import LiuYaoCalculator

class ManualLiuYaoTester:
    def __init__(self):
        self.calculator = LiuYaoCalculator()
    
    def test_single_case(self, yao_list, day_gan):
        """测试单个案例"""
        print("=" * 60)
        print(f"测试数据:")
        print(f"爻位列表: {yao_list}")
        print(f"日干: {day_gan}")
        print("-" * 40)
        
        try:
            # 验证数据格式
            is_valid = self.calculator.validate_yao_data(yao_list)
            print(f"数据格式验证: {'✓ 通过' if is_valid else '✗ 失败'}")
            
            if not is_valid:
                return False
            
            # 统计奇数个数
            odd_counts = self.calculator.count_odd_digits(yao_list)
            print(f"奇数个数统计: {odd_counts}")
            
            # 完整排盘计算
            result = self.calculator.calculate_paipan(yao_list, day_gan)
            
            # 显示详细结果
            self._display_result(result)
            return True
            
        except Exception as e:
            print(f"计算错误: {e}")
            return False
    
    def _display_result(self, result):
        """显示排盘结果"""
        print("\n排盘结果:")
        print(f"原始爻位: {result['yao_list']}")
        print(f"奇数个数: {result['odd_counts']}")
        
        # 本卦信息
        ben_gua = result['ben_gua']
        print(f"本卦卦名: {ben_gua.get('卦名', '未知')}")
        print(f"本卦卦宫: {ben_gua.get('卦宫', '未知')}")
        print(f"本卦宫属: {ben_gua.get('宫属', '未知')}")
        print(f"本卦数列: {ben_gua.get('数列', [])}")
        
        # 动爻信息
        dong_yao = result['dong_yao']
        print(f"动爻位置: {dong_yao['positions']}")
        print(f"动爻符号: {dong_yao['symbols']}")
        
        # 变卦信息
        bian_gua = result['bian_gua']
        if bian_gua:
            print(f"变卦卦名: {bian_gua.get('卦名', '未知')}")
            print(f"变卦卦宫: {bian_gua.get('卦宫', '未知')}")
            print(f"变卦数列: {bian_gua.get('数列', [])}")
        else:
            print("变卦: 无动爻，不变卦")
        
        # 六神信息
        print(f"六神分布: {result['liu_shen']}")
        print(f"日干: {result['day_gan']}")
    
    def interactive_test(self):
        """交互式测试"""
        print("六爻排盘手动测试工具")
        print("=" * 60)
        
        while True:
            print("\n请输入测试数据 (输入 'quit' 退出):")
            
            # 获取爻位列表
            yao_input = input("爻位列表 (6个三位数，用空格分隔): ").strip()
            if yao_input.lower() == 'quit':
                break
            
            yao_list = yao_input.split()
            if len(yao_list) != 6:
                print("错误: 必须输入6个爻位数据")
                continue
            
            # 获取日干
            day_gan = input("日干 (甲、乙、丙、丁、戊、己、庚、辛、壬、癸): ").strip()
            
            # 执行测试
            self.test_single_case(yao_list, day_gan)
    
    def batch_test(self, test_cases):
        """批量测试"""
        print("批量测试开始...")
        print("=" * 60)
        
        success_count = 0
        for i, (yao_list, day_gan) in enumerate(test_cases, 1):
            print(f"\n测试案例 {i}:")
            if self.test_single_case(yao_list, day_gan):
                success_count += 1
        
        print("=" * 60)
        print(f"批量测试完成: {success_count}/{len(test_cases)} 成功")

def main():
    tester = ManualLiuYaoTester()
    
    print("选择测试模式:")
    print("1. 交互式测试")
    print("2. 批量测试示例")
    
    choice = input("请输入选择 (1 或 2): ").strip()
    
    if choice == "1":
        tester.interactive_test()
    elif choice == "2":
        # 示例测试数据
        test_cases = [
            (["123", "456", "789", "012", "345", "678"], "甲"),
            (["111", "222", "333", "444", "555", "666"], "乙"),
            (["135", "246", "357", "468", "579", "680"], "丙"),
            (["999", "888", "777", "666", "555", "444"], "丁"),
        ]
        tester.batch_test(test_cases)
    else:
        print("无效选择")

if __name__ == "__main__":
    main()
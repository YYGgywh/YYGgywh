#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试随机数生成器模块的三个方法
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.algorithms.random_number__calculator import RandomGenerator

def test_random_methods():
    """测试三个随机方法并打印结果"""
    print("=== 随机数生成器测试 ===")
    
    # 测试 random_digit 方法
    print("\n1. 测试 random_digit() 方法:")
    for i in range(5):
        result = RandomGenerator.random_digit()
        print(f"   第{i+1}次: 生成的随机数字: {result}")
    
    # 测试 random_three_digits 方法
    print("\n2. 测试 random_three_digits() 方法:")
    for i in range(5):
        result = RandomGenerator.random_three_digits()
        print(f"   第{i+1}次: 生成的三个随机数字: {result}")
    
    # 测试 random_jiazi 方法
    print("\n3. 测试 random_jiazi() 方法:")
    for i in range(5):
        result = RandomGenerator.random_jiazi()
        print(f"   第{i+1}次: 生成的随机干支: {result}")
    
    print("\n=== 测试完成 ===")

if __name__ == "__main__":
    test_random_methods()
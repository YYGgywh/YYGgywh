#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试lunar-python库的getYearInGanZhi()方法返回值
"""

import sys
import os

# 添加项目路径，确保能导入src模块
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# 导入lunar-python库
from lunar_python import Solar

def test_getYearInGanZhi():
    """
    测试getYearInGanZhi()方法的返回值
    """
    print("=== 测试getYearInGanZhi()方法 ===")
    
    # 创建一个公历日期对象
    solar_date = Solar.fromYmd(2023, 12, 25)
    
    # 转换为农历对象
    lunar_date = solar_date.getLunar()
    
    # 调用getYearInGanZhi()方法
    year_in_ganzhi = lunar_date.getYearInGanZhi()
    print(f"getYearInGanZhi()返回值: '{year_in_ganzhi}'")
    print(f"返回值类型: {type(year_in_ganzhi)}")
    print(f"是否包含'年'字: {'年' in year_in_ganzhi}")
    
    # 同时测试其他相关方法
    print("\n=== 测试其他相关方法 ===")
    print(f"getYearGan(): '{lunar_date.getYearGan()}'")
    print(f"getYearZhi(): '{lunar_date.getYearZhi()}'")
    print(f"getYearInGanZhiExact(): '{lunar_date.getYearInGanZhiExact()}'")
    print(f"getYearGanExact(): '{lunar_date.getYearGanExact()}'")
    print(f"getYearZhiExact(): '{lunar_date.getYearZhiExact()}'")

if __name__ == "__main__":
    test_getYearInGanZhi()

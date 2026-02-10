#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
临时测试模板
用于快速创建功能测试文件
"""

import sys
import os

# 添加项目路径
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
backend_path = os.path.join(project_root, 'backend')
sys.path.insert(0, backend_path)
sys.path.insert(0, os.path.join(backend_path, 'src'))

def main():
    """主测试函数"""
    print("=== 临时测试开始 ===")
    
    # 在这里添加你的测试代码
    try:
        # 示例：测试导入是否正常
        from src.core.calendar_calculator import CalendarCalculator
        print("✅ 模块导入成功")
        
        # 添加你的具体测试逻辑
        # ...
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
    except Exception as e:
        print(f"❌ 测试错误: {e}")
    
    print("=== 临时测试结束 ===")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
运行所有测试脚本
"""

import os
import sys
import subprocess
from datetime import datetime

def run_test(test_file):
    """运行单个测试文件"""
    print(f"\n{'='*60}")
    print(f"运行测试: {test_file}")
    print('='*60)
    
    try:
        # 构建完整的文件路径
        test_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), test_file)
        
        # 运行测试文件
        result = subprocess.run([
            sys.executable, test_file_path
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ 测试通过")
            print(result.stdout)
            return True
        else:
            print("❌ 测试失败")
            print(result.stdout)
            if result.stderr:
                print("错误信息:")
                print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ 执行测试时出错: {e}")
        return False

def main():
    """主函数"""
    print("🚀 开始运行所有测试")
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"工作目录: {os.getcwd()}")
    
    # 获取当前脚本所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 测试文件列表
    test_files = [
        "test_calendar_calculator.py",
        "test_solar_to_lunar.py",
        "test_liuyao_calendar.py"
    ]
    
    # 检查测试文件是否存在
    existing_tests = []
    for test_file in test_files:
        test_file_path = os.path.join(current_dir, test_file)
        if os.path.exists(test_file_path):
            existing_tests.append(test_file)
        else:
            print(f"⚠️ 测试文件不存在: {test_file_path}")
    
    if not existing_tests:
        print("❌ 没有找到可运行的测试文件")
        return
    
    # 运行所有测试
    passed = 0
    failed = 0
    
    for test_file in existing_tests:
        if run_test(test_file):
            passed += 1
        else:
            failed += 1
    
    # 输出测试总结
    print(f"\n{'='*60}")
    print("📊 测试总结")
    print('='*60)
    print(f"✅ 通过的测试: {passed}")
    print(f"❌ 失败的测试: {failed}")
    print(f"📋 总测试数: {len(existing_tests)}")
    
    if failed == 0:
        print("🎉 所有测试都通过了！")
    else:
        print(f"⚠️ 有 {failed} 个测试失败")
    
    # 提供测试界面信息
    print(f"\n🌐 测试界面访问地址: http://localhost:8081/test_time_input.html")
    print("💡 提示: 确保测试服务器正在运行")

if __name__ == "__main__":
    main()
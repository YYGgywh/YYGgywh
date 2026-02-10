#!/usr/bin/env python3
"""
统一测试运行脚本
支持运行所有测试、特定类型测试和单个测试
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def run_pytest(test_path, verbose=False, coverage=False):
    """运行pytest测试"""
    cmd = [sys.executable, "-m", "pytest", test_path]
    
    if verbose:
        cmd.append("-v")
    
    if coverage:
        cmd.extend(["--cov=src", "--cov-report=term", "--cov-report=html"])
    
    print(f"运行测试: {' '.join(cmd)}")
    print("=" * 60)
    
    result = subprocess.run(cmd, cwd=os.path.dirname(__file__))
    return result.returncode

def run_all_tests(verbose=False, coverage=False):
    """运行所有测试"""
    print("🚀 运行所有测试...")
    return run_pytest("tests", verbose, coverage)

def run_unit_tests(verbose=False, coverage=False):
    """运行单元测试"""
    print("🧪 运行单元测试...")
    return run_pytest("tests/unit", verbose, coverage)

def run_integration_tests(verbose=False, coverage=False):
    """运行集成测试"""
    print("🔗 运行集成测试...")
    return run_pytest("tests/integration", verbose, coverage)

def run_validation_tests(verbose=False, coverage=False):
    """运行验证测试"""
    print("✅ 运行验证测试...")
    return run_pytest("tests/validation", verbose, coverage)

def run_e2e_tests(verbose=False, coverage=False):
    """运行端到端测试"""
    print("🌐 运行端到端测试...")
    return run_pytest("tests/e2e", verbose, coverage)

def run_specific_test(test_file, verbose=False, coverage=False):
    """运行特定测试文件"""
    print(f"🎯 运行特定测试: {test_file}")
    return run_pytest(test_file, verbose, coverage)

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="统一测试运行脚本")
    parser.add_argument("--all", action="store_true", help="运行所有测试")
    parser.add_argument("--unit", action="store_true", help="运行单元测试")
    parser.add_argument("--integration", action="store_true", help="运行集成测试")
    parser.add_argument("--validation", action="store_true", help="运行验证测试")
    parser.add_argument("--e2e", action="store_true", help="运行端到端测试")
    parser.add_argument("--file", type=str, help="运行特定测试文件")
    parser.add_argument("-v", "--verbose", action="store_true", help="详细输出")
    parser.add_argument("--coverage", action="store_true", help="生成覆盖率报告")
    
    args = parser.parse_args()
    
    # 如果没有指定任何选项，默认运行所有测试
    if not any([args.all, args.unit, args.integration, args.validation, args.e2e, args.file]):
        args.all = True
    
    exit_code = 0
    
    try:
        if args.all:
            exit_code = run_all_tests(args.verbose, args.coverage)
        elif args.unit:
            exit_code = run_unit_tests(args.verbose, args.coverage)
        elif args.integration:
            exit_code = run_integration_tests(args.verbose, args.coverage)
        elif args.validation:
            exit_code = run_validation_tests(args.verbose, args.coverage)
        elif args.e2e:
            exit_code = run_e2e_tests(args.verbose, args.coverage)
        elif args.file:
            exit_code = run_specific_test(args.file, args.verbose, args.coverage)
    except Exception as e:
        print(f"❌ 测试运行失败: {e}")
        exit_code = 1
    
    if exit_code == 0:
        print("\n🎉 所有测试通过！")
    else:
        print(f"\n💥 测试失败，退出码: {exit_code}")
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
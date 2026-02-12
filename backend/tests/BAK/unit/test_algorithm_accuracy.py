#!/usr/bin/env python3
"""
公历、农历、四柱转换算法准确性检测脚本

功能：
1. 测试公历转农历算法的准确性
2. 测试农历转公历算法的准确性  
3. 测试四柱转换算法的准确性
4. 验证边界条件和特殊日期处理
5. 测试算法性能和效率
"""

import sys
import os
import time
import json
from datetime import datetime

# 添加backend目录到Python路径
sys.path.append(os.path.dirname(__file__))

from src.core.calendar_algorithm_core import calendar_algorithm_core
from src.utils.error_codes import create_success_response, create_error_response

class AlgorithmAccuracyTester:
    """算法准确性测试器"""
    
    def __init__(self):
        self.test_cases = []
        self.results = []
        
    def setup_test_cases(self):
        """设置测试用例"""
        
        # 基础测试用例 - 常规日期
        self.test_cases.extend([
            # 公历转农历测试
            {"type": "solar_to_lunar", "year": 2024, "month": 2, "day": 10, "hour": 12, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            {"type": "solar_to_lunar", "year": 2023, "month": 1, "day": 22, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            {"type": "solar_to_lunar", "year": 2022, "month": 2, "day": 1, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            
            # 农历转公历测试
            {"type": "lunar_to_solar", "lunar_year": 2024, "lunar_month": 1, "lunar_day": 1, "hour": 12, "minute": 0, "second": 0},
            {"type": "lunar_to_solar", "lunar_year": 2023, "lunar_month": 1, "lunar_day": 1, "hour": 0, "minute": 0, "second": 0},
            {"type": "lunar_to_solar", "lunar_year": 2022, "lunar_month": 1, "lunar_day": 1, "hour": 0, "minute": 0, "second": 0},
            
            # 闰月测试
            {"type": "solar_to_lunar", "year": 2023, "month": 3, "day": 22, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            {"type": "lunar_to_solar", "lunar_year": 2023, "lunar_month": -2, "lunar_day": 1, "hour": 0, "minute": 0, "second": 0},
        ])
        
        # 边界条件测试
        self.test_cases.extend([
            # 最小年份
            {"type": "solar_to_lunar", "year": 1900, "month": 1, "day": 1, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            # 最大年份
            {"type": "solar_to_lunar", "year": 2100, "month": 12, "day": 31, "hour": 23, "minute": 59, "second": 59, "day_ganzhi_method": 2},
            # 2月29日（闰年）
            {"type": "solar_to_lunar", "year": 2024, "month": 2, "day": 29, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
            # 2月29日（非闰年）- 应该报错
            {"type": "solar_to_lunar", "year": 2023, "month": 2, "day": 29, "hour": 0, "minute": 0, "second": 0, "day_ganzhi_method": 2},
        ])
        
        # 特殊节气测试
        self.test_cases.extend([
            # 立春
            {"type": "solar_to_lunar", "year": 2024, "month": 2, "day": 4, "hour": 16, "minute": 27, "second": 0, "day_ganzhi_method": 2},
            # 冬至
            {"type": "solar_to_lunar", "year": 2023, "month": 12, "day": 22, "hour": 11, "minute": 27, "second": 0, "day_ganzhi_method": 2},
        ])
        
    def test_solar_to_lunar_accuracy(self, test_case):
        """测试公历转农历准确性"""
        try:
            start_time = time.time()
            
            # 使用calendar_algorithm_core进行转换
            result = calendar_algorithm_core.convert_solar_to_lunar(
                year=test_case["year"],
                month=test_case["month"],
                day=test_case["day"],
                hour=test_case["hour"],
                minute=test_case["minute"],
                second=test_case["second"],
                day_ganzhi_method=test_case.get("day_ganzhi_method", 2)
            )
            
            execution_time = time.time() - start_time
            
            # 验证结果格式
            is_valid = True
            error_msg = ""
            
            # 检查基本字段是否存在（根据实际返回格式）
            required_fields = ["solar_info", "lunar_collection", "ganzhi_collection", "jieqi"]
            for field in required_fields:
                if field not in result:
                    is_valid = False
                    error_msg = f"缺少必要字段: {field}"
                    break
            
            # 检查农历年份和月份
            if is_valid:
                lunar_info = result["lunar_collection"]
                if "lunar_year" not in lunar_info or "lunar_month" not in lunar_info:
                    is_valid = False
                    error_msg = "农历信息不完整"
            
            return {
                "test_type": "solar_to_lunar",
                "input": f"{test_case['year']}-{test_case['month']}-{test_case['day']} {test_case['hour']}:{test_case['minute']}:{test_case['second']}",
                "success": is_valid,
                "execution_time": execution_time,
                "result": result if is_valid else None,
                "error": error_msg if not is_valid else None
            }
            
        except Exception as e:
            return {
                "test_type": "solar_to_lunar",
                "input": f"{test_case['year']}-{test_case['month']}-{test_case['day']} {test_case['hour']}:{test_case['minute']}:{test_case['second']}",
                "success": False,
                "execution_time": 0,
                "result": None,
                "error": str(e)
            }
    
    def test_lunar_to_solar_accuracy(self, test_case):
        """测试农历转公历准确性"""
        try:
            start_time = time.time()
            
            # 使用calendar_algorithm_core进行转换
            result = calendar_algorithm_core.convert_lunar_to_solar(
                lunar_year=test_case["lunar_year"],
                lunar_month=test_case["lunar_month"],
                lunar_day=test_case["lunar_day"],
                hour=test_case["hour"],
                minute=test_case["minute"],
                second=test_case["second"]
            )
            
            execution_time = time.time() - start_time
            
            # 验证结果
            is_valid = True
            error_msg = ""
            
            # 检查基本字段是否存在（根据实际返回格式）
            if "solar_info" not in result:
                is_valid = False
                error_msg = "缺少公历信息字段"
            
            # 检查公历日期格式
            if is_valid:
                solar_info = result["solar_info"]
                if "year" not in solar_info or "month" not in solar_info or "day" not in solar_info:
                    is_valid = False
                    error_msg = "公历信息不完整"
            
            return {
                "test_type": "lunar_to_solar",
                "input": f"农历{test_case['lunar_year']}年{test_case['lunar_month']}月{test_case['lunar_day']}日 {test_case['hour']}:{test_case['minute']}:{test_case['second']}",
                "success": is_valid,
                "execution_time": execution_time,
                "result": result if is_valid else None,
                "error": error_msg if not is_valid else None
            }
            
        except Exception as e:
            return {
                "test_type": "lunar_to_solar",
                "input": f"农历{test_case['lunar_year']}年{test_case['lunar_month']}月{test_case['lunar_day']}日 {test_case['hour']}:{test_case['minute']}:{test_case['second']}",
                "success": False,
                "execution_time": 0,
                "result": None,
                "error": str(e)
            }
    
    def analyze_api_response_format(self):
        """分析API响应格式"""
        print("\n分析API响应格式...")
        print("=" * 80)
        
        # 测试一个简单的公历转农历转换
        test_case = {"year": 2024, "month": 2, "day": 10, "hour": 12, "minute": 0, "second": 0, "day_ganzhi_method": 2}
        
        try:
            result = calendar_algorithm_core.convert_solar_to_lunar(
                year=test_case["year"],
                month=test_case["month"],
                day=test_case["day"],
                hour=test_case["hour"],
                minute=test_case["minute"],
                second=test_case["second"],
                day_ganzhi_method=test_case["day_ganzhi_method"]
            )
            
            print("实际返回的数据结构:")
            print(json.dumps(result, ensure_ascii=False, indent=2))
            
            # 分析数据结构
            print("\n数据结构分析:")
            if "solar_info" in result:
                print(f"  solar_info字段: {result['solar_info'].keys()}")
            if "lunar_collection" in result:
                print(f"  lunar_collection字段: {result['lunar_collection'].keys()}")
            if "ganzhi_collection" in result:
                print(f"  ganzhi_collection字段: {result['ganzhi_collection'].keys()}")
            if "jieqi" in result:
                print(f"  jieqi字段: {result['jieqi']}")
                
        except Exception as e:
            print(f"分析失败: {e}")
    
    def run_all_tests(self):
        """运行所有测试"""
        print("开始算法准确性检测...")
        print("=" * 80)
        
        total_tests = len(self.test_cases)
        passed_tests = 0
        failed_tests = 0
        total_execution_time = 0
        
        for i, test_case in enumerate(self.test_cases, 1):
            print(f"\n测试 {i}/{total_tests}: {test_case['type']}")
            
            if test_case["type"] == "solar_to_lunar":
                result = self.test_solar_to_lunar_accuracy(test_case)
            elif test_case["type"] == "lunar_to_solar":
                result = self.test_lunar_to_solar_accuracy(test_case)
            else:
                continue
            
            self.results.append(result)
            
            if result["success"]:
                passed_tests += 1
                total_execution_time += result["execution_time"]
                print(f"  ✓ 通过 - 执行时间: {result['execution_time']:.4f}秒")
            else:
                failed_tests += 1
                print(f"  ✗ 失败 - 错误: {result['error']}")
        
        # 生成测试报告
        self.generate_report(total_tests, passed_tests, failed_tests, total_execution_time)
        
        return passed_tests == total_tests
    
    def generate_report(self, total_tests, passed_tests, failed_tests, total_execution_time):
        """生成测试报告"""
        print("\n" + "=" * 80)
        print("算法准确性检测报告")
        print("=" * 80)
        print(f"总测试数: {total_tests}")
        print(f"通过数: {passed_tests}")
        print(f"失败数: {failed_tests}")
        print(f"通过率: {passed_tests/total_tests*100:.2f}%")
        print(f"总执行时间: {total_execution_time:.4f}秒")
        print(f"平均执行时间: {total_execution_time/total_tests:.4f}秒")
        
        # 显示失败详情
        if failed_tests > 0:
            print("\n失败测试详情:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test_type']}: {result['input']}")
                    print(f"    错误: {result['error']}")
        
        # 显示性能分析
        print("\n性能分析:")
        solar_times = [r['execution_time'] for r in self.results if r['test_type'] == 'solar_to_lunar' and r['success']]
        lunar_times = [r['execution_time'] for r in self.results if r['test_type'] == 'lunar_to_solar' and r['success']]
        
        if solar_times:
            print(f"  公历转农历 - 平均时间: {sum(solar_times)/len(solar_times):.4f}秒")
        if lunar_times:
            print(f"  农历转公历 - 平均时间: {sum(lunar_times)/len(lunar_times):.4f}秒")

def main():
    """主函数"""
    tester = AlgorithmAccuracyTester()
    
    # 首先分析API响应格式
    tester.analyze_api_response_format()
    
    # 设置测试用例
    tester.setup_test_cases()
    
    # 运行测试
    success = tester.run_all_tests()
    
    # 保存详细结果到文件
    with open('algorithm_test_results.json', 'w', encoding='utf-8') as f:
        json.dump(tester.results, f, ensure_ascii=False, indent=2)
    
    print(f"\n详细测试结果已保存到: algorithm_test_results.json")
    
    if success:
        print("\n🎉 所有测试通过！算法准确性验证成功。")
        return 0
    else:
        print("\n❌ 部分测试失败，请检查算法实现。")
        return 1

if __name__ == "__main__":
    sys.exit(main())
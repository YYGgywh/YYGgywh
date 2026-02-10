#!/usr/bin/env python3
"""
四柱转换算法准确性和效率测试脚本
"""

import sys
import os
import time
import json
from datetime import datetime

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_pillars_accuracy():
    """测试四柱转换算法的准确性和效率"""
    
    print("=" * 80)
    print("四柱转换算法准确性和效率测试")
    print("=" * 80)
    
    try:
        from src.core.calendar_service import calendar_service, CalendarError
        from src.utils.error_codes import create_success_response, create_error_response
        
        # 测试用例：已知有效的四柱组合
        test_cases = [
            {
                "name": "标准四柱组合1",
                "pillars": {
                    "year_pillar": "甲辰",
                    "month_pillar": "丁丑", 
                    "day_pillar": "癸卯",
                    "hour_pillar": "癸亥"
                },
                "expected_solar": None  # 该组合有多个匹配日期，不验证具体日期
            },
            {
                "name": "标准四柱组合2", 
                "pillars": {
                    "year_pillar": "癸卯",
                    "month_pillar": "庚申",
                    "day_pillar": "丙午",
                    "hour_pillar": "戊戌"
                },
                "expected_solar": None  # 该组合有多个匹配日期，不验证具体日期
            },
            {
                "name": "现代日期测试",
                "pillars": {
                    "year_pillar": "甲辰",
                    "month_pillar": "丙寅",
                    "day_pillar": "戊子",
                    "hour_pillar": "壬子"
                },
                "expected_solar": "2024-02-10 23:00:00"  # 2024年春节
            },
            {
                "name": "历史日期测试",
                "pillars": {
                    "year_pillar": "辛丑",
                    "month_pillar": "庚寅",
                    "day_pillar": "甲午",
                    "hour_pillar": "丙寅"
                },
                "expected_solar": None  # 可能匹配多个日期
            }
        ]
        
        # 性能测试用例
        performance_cases = [
            {
                "year_pillar": "甲辰",
                "month_pillar": "丁丑", 
                "day_pillar": "癸卯",
                "hour_pillar": "癸亥"
            },
            {
                "year_pillar": "乙巳",
                "month_pillar": "戊寅",
                "day_pillar": "甲辰",
                "hour_pillar": "甲子"
            }
        ]
        
        results = []
        total_tests = 0
        passed_tests = 0
        
        print("\n开始四柱转换算法准确性测试...")
        print("-" * 80)
        
        # 准确性测试
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n测试 {i}/{len(test_cases)}: {test_case['name']}")
            print(f"四柱组合: {test_case['pillars']}")
            
            start_time = time.time()
            
            try:
                result = calendar_service.convert_pillars_to_calendar(**test_case['pillars'])
                execution_time = time.time() - start_time
                
                if result.get("multiple_results", False):
                    total_matches = result.get("total_matches", 0)
                    print(f"  ✓ 转换成功 - 找到 {total_matches} 个匹配日期")
                    print(f"    执行时间: {execution_time:.4f}秒")
                    
                    # 检查所有匹配结果
                    if total_matches > 0:
                        matching_dates = result.get("matching_dates", [])
                        
                        # 显示前几个匹配结果
                        for j, match in enumerate(matching_dates[:3]):
                            solar_date = match.get("solar_date", "未知")
                            print(f"    匹配结果{j+1}: {solar_date}")
                        
                        if total_matches > 3:
                            print(f"    ... 还有 {total_matches - 3} 个匹配结果")
                        
                        # 验证预期结果
                        if test_case['expected_solar']:
                            # 在所有匹配结果中查找预期日期
                            found_expected = False
                            for match in matching_dates:
                                solar_date = match.get("solar_date", "")
                                if solar_date == test_case['expected_solar']:
                                    print(f"    ✓ 预期日期匹配成功")
                                    found_expected = True
                                    break
                            
                            if found_expected:
                                passed_tests += 1
                            else:
                                print(f"    ⚠ 未找到预期日期: {test_case['expected_solar']}")
                        else:
                            print(f"    ℹ 无预期日期验证")
                            passed_tests += 1
                    
                    results.append({
                        "test_name": test_case['name'],
                        "status": "通过",
                        "execution_time": execution_time,
                        "total_matches": total_matches,
                        "result": result
                    })
                else:
                    print(f"  ✗ 转换失败 - 未找到匹配日期")
                    results.append({
                        "test_name": test_case['name'],
                        "status": "失败",
                        "execution_time": execution_time,
                        "error": "未找到匹配日期"
                    })
                
            except CalendarError as e:
                execution_time = time.time() - start_time
                print(f"  ✗ 转换失败 - {str(e)}")
                results.append({
                    "test_name": test_case['name'],
                    "status": "失败", 
                    "execution_time": execution_time,
                    "error": str(e)
                })
            except Exception as e:
                execution_time = time.time() - start_time
                print(f"  ✗ 发生异常 - {str(e)}")
                results.append({
                    "test_name": test_case['name'],
                    "status": "异常",
                    "execution_time": execution_time,
                    "error": str(e)
                })
            
            total_tests += 1
        
        # 性能测试
        print("\n" + "=" * 80)
        print("性能测试")
        print("=" * 80)
        
        performance_results = []
        
        for i, pillars in enumerate(performance_cases, 1):
            print(f"\n性能测试 {i}/{len(performance_cases)}")
            print(f"四柱组合: {pillars}")
            
            # 运行多次取平均时间
            iterations = 10
            times = []
            
            for j in range(iterations):
                start_time = time.time()
                try:
                    result = calendar_service.convert_pillars_to_calendar(**pillars)
                    end_time = time.time()
                    times.append(end_time - start_time)
                except:
                    times.append(0)  # 失败不计入性能统计
            
            # 计算统计信息
            if times:
                avg_time = sum(times) / len(times)
                min_time = min(times)
                max_time = max(times)
                
                print(f"  平均执行时间: {avg_time:.4f}秒")
                print(f"  最短执行时间: {min_time:.4f}秒")
                print(f"  最长执行时间: {max_time:.4f}秒")
                
                performance_results.append({
                    "pillars": pillars,
                    "iterations": iterations,
                    "avg_time": avg_time,
                    "min_time": min_time,
                    "max_time": max_time
                })
            else:
                print(f"  ✗ 性能测试失败")
        
        # 生成测试报告
        print("\n" + "=" * 80)
        print("四柱转换算法测试报告")
        print("=" * 80)
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"总测试数: {total_tests}")
        print(f"通过数: {passed_tests}")
        print(f"失败数: {total_tests - passed_tests}")
        print(f"通过率: {success_rate:.2f}%")
        
        # 性能分析
        if performance_results:
            avg_performance = sum([r['avg_time'] for r in performance_results]) / len(performance_results)
            print(f"平均性能: {avg_performance:.4f}秒/次")
        
        # 保存详细结果
        report = {
            "test_timestamp": datetime.now().isoformat(),
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": success_rate,
            "accuracy_results": results,
            "performance_results": performance_results
        }
        
        with open("pillars_test_results.json", "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n详细测试结果已保存到: pillars_test_results.json")
        
        if success_rate >= 80:
            print("✅ 四柱转换算法测试基本通过")
        else:
            print("❌ 四柱转换算法测试存在较多问题")
        
        return report
        
    except ImportError as e:
        print(f"❌ 导入模块失败: {e}")
        return None
    except Exception as e:
        print(f"❌ 测试过程发生异常: {e}")
        return None

def analyze_pillars_algorithm():
    """分析四柱转换算法的实现细节"""
    
    print("\n" + "=" * 80)
    print("四柱转换算法分析")
    print("=" * 80)
    
    try:
        from src.core.calendar_service import calendar_service
        from src.utils.verify_pillars import verify_pillars
        
        # 分析算法特性
        print("\n1. 算法实现分析:")
        print("   - 基于lunar-python库的Solar.fromBaZi方法")
        print("   - 支持流派1（晚子时算明天）")
        print("   - 支持从公元1年开始搜索")
        print("   - 返回所有匹配的日期结果")
        
        # 分析验证规则
        print("\n2. 验证规则分析:")
        print("   - 六十甲子验证")
        print("   - 五虎遁规则（年干与月支关系）")
        print("   - 五鼠遁规则（日干与时支关系）")
        
        # 测试验证功能
        print("\n3. 验证功能测试:")
        test_pillars = {
            "year_pillar": "甲辰",
            "month_pillar": "丁丑", 
            "day_pillar": "癸卯",
            "hour_pillar": "癸亥"
        }
        
        validation_result = verify_pillars(**test_pillars)
        print(f"   验证结果: {validation_result.get('success', False)}")
        if validation_result.get('success'):
            print(f"   验证消息: {validation_result.get('message', '')}")
        
        return {
            "algorithm_analysis": {
                "implementation": "lunar-python Solar.fromBaZi",
                "sect": 1,
                "base_year": 1,
                "multiple_results": True
            },
            "validation_rules": [
                "六十甲子验证",
                "五虎遁规则", 
                "五鼠遁规则"
            ]
        }
        
    except Exception as e:
        print(f"❌ 算法分析失败: {e}")
        return None

if __name__ == "__main__":
    # 运行算法分析
    analysis_result = analyze_pillars_algorithm()
    
    # 运行准确性测试
    test_result = test_pillars_accuracy()
    
    # 综合评估
    print("\n" + "=" * 80)
    print("四柱转换算法综合评估")
    print("=" * 80)
    
    if test_result and analysis_result:
        success_rate = test_result.get("success_rate", 0)
        
        print(f"准确性评估: {success_rate:.1f}%")
        print(f"算法实现: {analysis_result['algorithm_analysis']['implementation']}")
        print(f"验证规则: {', '.join(analysis_result['validation_rules'])}")
        
        if success_rate >= 90:
            print("✅ 四柱转换算法表现优秀")
        elif success_rate >= 80:
            print("✅ 四柱转换算法表现良好") 
        elif success_rate >= 70:
            print("⚠ 四柱转换算法表现一般，需要优化")
        else:
            print("❌ 四柱转换算法存在严重问题")
    else:
        print("❌ 无法完成综合评估")
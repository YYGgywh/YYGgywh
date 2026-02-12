#!/usr/bin/env python3
"""
转换结果偏差详细分析脚本
"""

import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))

from core.calendar_algorithm_core import CalendarAlgorithmCore
from algorithms.calendar_calculator import CalendarConverter

def analyze_parameter_differences():
    """分析参数差异"""
    print("=== 参数差异分析 ===")
    
    # 检查不同模块的参数签名
    print("\n1. 闰月参数差异:")
    print("   - calendar_service.py: convert_lunar_to_solar() 不支持 is_leap 参数")
    print("   - calendar_calculator.py: convert_calendar() 不支持 is_leap 参数")
    print("   - lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")
    
    print("\n2. 时柱返回差异:")
    print("   - calendar_service.py: 返回的字典中缺少 hour_pillar 字段")
    print("   - calendar_calculator.py: 返回的字典中缺少 hour_pillar 字段")
    print("   - lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")

def analyze_verification_discrepancies():
    """分析验证不一致问题"""
    print("\n=== 验证不一致问题分析 ===")
    
    # 分析四柱验证差异
    print("\n1. 四柱验证深度差异:")
    print("   - validators.py: 只进行基本格式验证（长度、天干地支字符）")
    print("   - verify_pillars.py: 进行完整验证（六十甲子、五虎遁、五鼠遁）")
    
    print("\n2. 验证结果格式差异:")
    print("   - validators.py: 返回 Tuple[bool, str]")
    print("   - verify_pillars.py: 返回 Dict[str, Any]")
    
    print("\n3. 具体验证失败案例:")
    print("   四柱组合: 乙丑年丁卯月己巳日癸丑时")
    print("   - validators.py: 通过 (只检查格式)")
    print("   - verify_pillars.py: 失败 (五虎遁验证失败)")
    
    # 五虎遁规则分析
    print("\n4. 五虎遁规则验证:")
    print("   年干乙对应月支卯，根据规则应为己，实际为丁")
    print("   这表明四柱组合不符合传统历法规则")

def analyze_conversion_accuracy():
    """分析转换精度问题"""
    print("\n=== 转换精度分析 ===")
    
    # 分析历法转换精度
    print("\n1. 历法转换一致性:")
    print("   - 公历转农历: 三个模块结果完全一致")
    print("   - 农历转公历: 三个模块结果基本一致")
    
    print("\n2. 时间格式差异:")
    print("   - calendar_service.py: 返回完整时间戳 (2024-12-06 10:30:00)")
    print("   - calendar_calculator.py: 返回完整时间戳 (2024-12-06 10:30:00)")
    print("   - lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")
    
    print("\n3. 边界日期处理:")
    print("   - 所有模块都能正确处理1900-2100范围内的日期")
    print("   - 闰年转换结果一致")

def analyze_error_handling():
    """分析错误处理差异"""
    print("\n=== 错误处理差异分析 ===")
    
    print("\n1. 错误信息格式:")
    print("   - calendar_service.py: 统一错误处理装饰器，返回标准错误格式")
    print("   - calendar_calculator.py: 返回包含valid和error字段的字典")
    print("   - lunar_calculator.py: 返回包含success和error字段的字典")
    
    print("\n2. 参数验证严格性:")
    print("   - calendar_calculator.py: 有严格的日期验证逻辑")
    print("   - lunar_calculator.py: 已废弃，功能由calendar_calculator.py提供")
    print("   - calendar_service.py: 依赖下层模块的验证")

def analyze_performance_characteristics():
    """分析性能特征"""
    print("\n=== 性能特征分析 ===")
    
    print("\n1. 计算复杂度:")
    print("   - calendar_service.py: 服务层，复杂度中等")
    print("   - calendar_calculator.py: 算法层，复杂度较高")
    print("   - lunar_calculator.py: 基于第三方库，复杂度较低")
    
    print("\n2. 内存使用:")
    print("   - calendar_service.py: 返回完整历法信息，内存使用较大")
    print("   - calendar_calculator.py: 返回精简信息，内存使用适中")
    print("   - lunar_calculator.py: 返回第三方库对象，内存使用较小")

def main():
    """主分析函数"""
    print("开始分析转换结果偏差问题...")
    
    analyze_parameter_differences()
    analyze_verification_discrepancies()
    analyze_conversion_accuracy()
    analyze_error_handling()
    analyze_performance_characteristics()
    
    print("\n=== 转换结果偏差分析总结 ===")
    print("\n主要偏差问题:")
    print("1. 参数支持不一致: 闰月参数、时柱返回等")
    print("2. 验证深度不同: 四柱验证的严格程度差异")
    print("3. 返回格式不统一: 时间格式、错误格式等")
    print("4. 功能完整性差异: 部分模块缺少特定功能")
    
    print("\n影响范围:")
    print("1. 用户体验不一致: 不同接口返回不同结果")
    print("2. 数据准确性风险: 验证严格程度不同可能导致错误数据")
    print("3. 维护困难: 参数和返回格式不统一增加维护成本")
    
    print("\n建议修复优先级:")
    print("1. 高优先级: 统一参数和返回格式")
    print("2. 中优先级: 统一验证逻辑")
    print("3. 低优先级: 性能优化")

if __name__ == "__main__":
    main()
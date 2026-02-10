"""
六爻排盘算法准确性验证脚本
测试排盘算法的各个关键环节，确保计算结果的准确性
"""

import sys
import os

# 添加backend/src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from core.liuyao.liuyao_calculator import LiuYaoCalculator

def test_odd_count_accuracy():
    """测试奇数个数统计的准确性"""
    print("=== 测试奇数个数统计准确性 ===")
    calculator = LiuYaoCalculator()
    
    # 测试用例：已知爻位和期望的奇数个数
    test_cases = [
        {"yao_list": ["123", "456", "789", "012", "345", "678"], "expected": [2, 1, 2, 1, 2, 0]},
        {"yao_list": ["000", "111", "222", "333", "444", "555"], "expected": [0, 3, 0, 3, 0, 3]},
        {"yao_list": ["135", "246", "357", "468", "579", "680"], "expected": [3, 1, 3, 0, 3, 0]}
    ]
    
    for i, test_case in enumerate(test_cases):
        result = calculator.count_odd_digits(test_case["yao_list"])
        expected = test_case["expected"]
        
        print(f"测试用例 {i+1}:")
        print(f"  爻位: {test_case['yao_list']}")
        print(f"  期望: {expected}")
        print(f"  实际: {result}")
        print(f"  结果: {'✓ 通过' if result == expected else '✗ 失败'}")
        print()

def test_ben_gua_accuracy():
    """测试本卦计算的准确性"""
    print("=== 测试本卦计算准确性 ===")
    calculator = LiuYaoCalculator()
    
    # 测试用例：已知奇数个数和期望的卦象
    test_cases = [
        {"odd_counts": [2, 2, 2, 2, 2, 2], "expected_gua": "111111", "expected_name": "乾为天"},
        {"odd_counts": [0, 0, 0, 0, 0, 0], "expected_gua": "000000", "expected_name": "坤为地"},
        {"odd_counts": [2, 0, 2, 0, 2, 0], "expected_gua": "101010", "expected_name": "离为火"}
    ]
    
    for i, test_case in enumerate(test_cases):
        result = calculator.ben_gua_najia(test_case["odd_counts"])
        
        print(f"测试用例 {i+1}:")
        print(f"  奇数个数: {test_case['odd_counts']}")
        print(f"  期望卦码: {test_case['expected_gua']}")
        print(f"  期望卦名: {test_case['expected_name']}")
        
        if result:
            actual_gua = ''.join(map(str, result.get('数列', [])))
            actual_name = result.get('卦名', '')
            
            print(f"  实际卦码: {actual_gua}")
            print(f"  实际卦名: {actual_name}")
            
            gua_match = actual_gua == test_case['expected_gua']
            name_match = actual_name == test_case['expected_name']
            
            print(f"  卦码匹配: {'✓' if gua_match else '✗'}")
            print(f"  卦名匹配: {'✓' if name_match else '✗'}")
            print(f"  结果: {'✓ 通过' if gua_match and name_match else '✗ 失败'}")
        else:
            print(f"  结果: ✗ 失败 - 未找到对应卦象")
        print()

def test_dong_yao_accuracy():
    """测试动爻判断的准确性"""
    print("=== 测试动爻判断准确性 ===")
    calculator = LiuYaoCalculator()
    
    # 测试用例：已知奇数个数和期望的动爻位置
    test_cases = [
        {"odd_counts": [2, 2, 2, 2, 2, 2], "expected_positions": [], "expected_symbols": ['', '', '', '', '', '']},
        {"odd_counts": [0, 2, 0, 2, 0, 2], "expected_positions": [1, 3, 5], "expected_symbols": ['×→', '', '×→', '', '×→', '']},
        {"odd_counts": [3, 1, 3, 1, 3, 1], "expected_positions": [1, 3, 5], "expected_symbols": ['○→', '', '○→', '', '○→', '']}
    ]
    
    for i, test_case in enumerate(test_cases):
        positions, symbols = calculator.dong_yao(test_case["odd_counts"])
        
        print(f"测试用例 {i+1}:")
        print(f"  奇数个数: {test_case['odd_counts']}")
        print(f"  期望动爻位置: {test_case['expected_positions']}")
        print(f"  实际动爻位置: {positions}")
        print(f"  期望动爻符号: {test_case['expected_symbols']}")
        print(f"  实际动爻符号: {symbols}")
        
        pos_match = positions == test_case['expected_positions']
        sym_match = symbols == test_case['expected_symbols']
        
        print(f"  位置匹配: {'✓' if pos_match else '✗'}")
        print(f"  符号匹配: {'✓' if sym_match else '✗'}")
        print(f"  结果: {'✓ 通过' if pos_match and sym_match else '✗ 失败'}")
        print()

def test_liu_shen_accuracy():
    """测试六神计算的准确性"""
    print("=== 测试六神计算准确性 ===")
    calculator = LiuYaoCalculator()
    
    # 测试用例：已知日干和期望的六神分布
    test_cases = [
        {"day_gan": "甲", "expected": ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"]},
        {"day_gan": "丙", "expected": ["朱雀", "勾陈", "螣蛇", "白虎", "玄武", "青龙"]},
        {"day_gan": "庚", "expected": ["螣蛇", "白虎", "玄武", "青龙", "朱雀", "勾陈"]}
    ]
    
    for i, test_case in enumerate(test_cases):
        result = calculator.calculate_liu_shen(test_case["day_gan"])
        
        print(f"测试用例 {i+1}:")
        print(f"  日干: {test_case['day_gan']}")
        print(f"  期望六神: {test_case['expected']}")
        print(f"  实际六神: {result}")
        
        match = result == test_case['expected']
        print(f"  结果: {'✓ 通过' if match else '✗ 失败'}")
        print()

def test_complete_paipan():
    """测试完整排盘流程的准确性"""
    print("=== 测试完整排盘准确性 ===")
    calculator = LiuYaoCalculator()
    
    # 使用固定的爻位进行测试，确保结果可重现
    test_cases = [
        {
            "yao_list": ["123", "456", "789", "012", "345", "678"],
            "day_gan": "甲",
            "description": "标准测试用例"
        },
        {
            "yao_list": ["000", "111", "222", "333", "444", "555"],
            "day_gan": "丙",
            "description": "极端值测试用例"
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"测试用例 {i+1}: {test_case['description']}")
        print(f"  爻位: {test_case['yao_list']}")
        print(f"  日干: {test_case['day_gan']}")
        
        try:
            result = calculator.calculate_paipan(test_case["yao_list"], test_case["day_gan"])
            
            # 验证关键字段是否存在
            required_fields = ["yao_list", "odd_counts", "ben_gua", "dong_yao", "bian_gua", "liu_shen", "day_gan"]
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                print(f"  结果: ✗ 失败 - 缺少字段: {missing_fields}")
            else:
                print(f"  结果: ✓ 通过 - 所有字段完整")
                
                # 显示关键信息
                ben_gua = result["ben_gua"]
                dong_yao = result["dong_yao"]
                
                print(f"  本卦卦名: {ben_gua.get('卦名', '未知')}")
                print(f"  动爻数量: {len(dong_yao['positions'])}")
                print(f"  六神分布: {result['liu_shen']}")
                
        except Exception as e:
            print(f"  结果: ✗ 失败 - 异常: {str(e)}")
        
        print()

def test_hexagram_list():
    """测试六十四卦列表的完整性"""
    print("=== 测试六十四卦列表完整性 ===")
    calculator = LiuYaoCalculator()
    
    try:
        hexagram_list = calculator.get_hexagram_list()
        
        print(f"卦象总数: {len(hexagram_list)}")
        print(f"期望数量: 64")
        
        if len(hexagram_list) == 64:
            print("结果: ✓ 通过 - 卦象数量正确")
            
            # 检查前几个卦象的信息完整性
            sample_hexagrams = hexagram_list[:3]
            print("\n样本卦象信息:")
            for hexagram in sample_hexagrams:
                print(f"  卦码: {hexagram['code']}, 卦名: {hexagram['name']}, 卦宫: {hexagram['palace']}")
        else:
            print(f"结果: ✗ 失败 - 卦象数量不正确")
            
    except Exception as e:
        print(f"结果: ✗ 失败 - 异常: {str(e)}")
    
    print()

def main():
    """主测试函数"""
    print("六爻排盘算法准确性验证")
    print("=" * 50)
    
    # 运行所有测试
    test_odd_count_accuracy()
    test_ben_gua_accuracy()
    test_dong_yao_accuracy()
    test_liu_shen_accuracy()
    test_complete_paipan()
    test_hexagram_list()
    
    print("验证完成！")

if __name__ == "__main__":
    main()
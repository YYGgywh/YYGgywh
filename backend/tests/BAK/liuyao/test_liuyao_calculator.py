"""
六爻排盘核心算法单元测试
"""

import pytest
import sys
import os

# 添加路径以导入模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from core.liuyao.liuyao_calculator import LiuYaoCalculator


class TestLiuYaoCalculator:
    """六爻计算器测试类"""
    
    def setup_method(self):
        """测试前初始化"""
        self.calculator = LiuYaoCalculator()
    
    def test_yao_result_generation(self):
        """测试爻位生成功能"""
        # 测试铜钱法
        yao_list = self.calculator.yao_result("coin")
        assert len(yao_list) == 6, "爻位数量应为6个"
        
        for yao in yao_list:
            assert len(yao) == 3, "每个爻位应为3位数"
            assert yao.isdigit(), "爻位应为数字"
    
    def test_count_odd_digits(self):
        """测试奇数个数统计"""
        test_cases = [
            (["123", "456", "789", "000", "111", "222"], [2, 1, 2, 0, 3, 0]),
            (["135", "246", "357", "468", "579", "680"], [3, 0, 3, 0, 3, 0]),
            (["000", "111", "222", "333", "444", "555"], [0, 3, 0, 3, 0, 3])
        ]
        
        for yao_list, expected in test_cases:
            result = self.calculator.count_odd_digits(yao_list)
            assert result == expected, f"奇数统计错误: {yao_list} -> {result}, 期望: {expected}"
    
    def test_ben_gua_najia(self):
        """测试本卦纳甲计算"""
        # 测试乾为天卦（111111）
        odd_counts = [3, 3, 3, 3, 3, 3]  # 全阳爻
        ben_gua_info = self.calculator.ben_gua_najia(odd_counts)
        
        assert ben_gua_info["卦名"] == "乾为天", "卦名识别错误"
        assert ben_gua_info["卦宫"] == "乾", "卦宫识别错误"
        assert ben_gua_info["数列"] == [1, 1, 1, 1, 1, 1], "阴阳爻转换错误"
    
    def test_dong_yao_detection(self):
        """测试动爻检测"""
        test_cases = [
            ([0, 1, 2, 3, 1, 2], [1, 4], ['×→', '', '', '○→', '', '']),  # 第1爻和第4爻动
            ([3, 3, 0, 0, 1, 2], [1, 2, 3, 4], ['○→', '○→', '×→', '×→', '', '']),  # 前4爻动
            ([1, 2, 1, 2, 1, 2], [], ['', '', '', '', '', ''])  # 无动爻
        ]
        
        for odd_counts, expected_positions, expected_symbols in test_cases:
            positions, symbols = self.calculator.dong_yao(odd_counts)
            assert positions == expected_positions, f"动爻位置检测错误: {odd_counts}"
            assert symbols == expected_symbols, f"动爻符号生成错误: {odd_counts}"
    
    def test_bian_gua_calculation(self):
        """测试变卦计算"""
        # 测试有动爻的情况
        odd_counts = [0, 1, 2, 3, 1, 2]  # 第1爻和第4爻动
        ben_gua_info = {"卦宫": "乾", "纳支": ["子", "寅", "辰", "午", "申", "戌"]}
        
        bian_gua_info = self.calculator.bian_gua_najia(odd_counts, ben_gua_info)
        assert bian_gua_info is not None, "变卦计算不应为空"
        assert "数列" in bian_gua_info, "变卦应包含数列信息"
        
        # 测试无动爻的情况
        odd_counts_no_dong = [1, 2, 1, 2, 1, 2]  # 无动爻
        bian_gua_info_no_dong = self.calculator.bian_gua_najia(odd_counts_no_dong, ben_gua_info)
        assert bian_gua_info_no_dong == {}, "无动爻时应返回空字典"
    
    def test_liu_shen_calculation(self):
        """测试六神计算"""
        test_cases = [
            ("甲", ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"]),
            ("丙", ["朱雀", "勾陈", "螣蛇", "白虎", "玄武", "青龙"]),
            ("戊", ["勾陈", "螣蛇", "白虎", "玄武", "青龙", "朱雀"]),
            ("庚", ["螣蛇", "白虎", "玄武", "青龙", "朱雀", "勾陈"]),
            ("壬", ["白虎", "玄武", "青龙", "朱雀", "勾陈", "螣蛇"])
        ]
        
        for day_gan, expected in test_cases:
            liu_shen = self.calculator.calculate_liu_shen(day_gan)
            assert liu_shen == expected, f"六神计算错误: 日干{day_gan}"
    
    def test_complete_paipan_calculation(self):
        """测试完整排盘计算"""
        # 测试数据：有动爻的情况
        yao_list = ["010", "000", "010", "111", "101", "101"]
        day_gan = "甲"
        
        result = self.calculator.calculate_paipan(yao_list, day_gan)
        
        # 验证基本结构
        assert "yao_list" in result
        assert "odd_counts" in result
        assert "ben_gua" in result
        assert "dong_yao" in result
        assert "bian_gua" in result
        assert "liu_shen" in result
        assert "day_gan" in result
        
        # 验证数据一致性
        assert result["yao_list"] == yao_list
        assert result["day_gan"] == day_gan
        assert len(result["liu_shen"]) == 6
        
        # 验证无动爻的情况
        yao_list_no_dong = ["101", "101", "101", "101", "101", "101"]
        result_no_dong = self.calculator.calculate_paipan(yao_list_no_dong, day_gan)
        
        assert result_no_dong["bian_gua"] == {}, "无动爻时变卦应为空"
        assert len(result_no_dong["dong_yao"]["positions"]) == 0, "无动爻时动爻位置列表应为空"
    
    def test_get_hexagram_list(self):
        """测试获取卦象列表"""
        hexagram_list = self.calculator.get_hexagram_list()
        
        assert len(hexagram_list) > 0, "卦象列表不应为空"
        
        # 验证第一个卦象的结构
        first_hexagram = hexagram_list[0]
        assert "code" in first_hexagram
        assert "name" in first_hexagram
        assert "palace" in first_hexagram
        assert "nature" in first_hexagram
        assert "upper" in first_hexagram
        assert "lower" in first_hexagram
    
    def test_error_cases(self):
        """测试错误情况处理"""
        # 测试无效的日干
        with pytest.raises(Exception):
            self.calculator.calculate_liu_shen("无效日干")
        
        # 测试爻位数量错误
        with pytest.raises(Exception):
            self.calculator.count_odd_digits(["123", "456"])  # 只有2个爻位
    
    def test_edge_cases(self):
        """测试边界情况"""
        # 测试全动爻情况
        yao_list_all_dong = ["000", "000", "000", "000", "000", "000"]
        result = self.calculator.calculate_paipan(yao_list_all_dong, "甲")
        assert len(result["dong_yao"]["positions"]) == 6, "全动爻时应检测到6个动爻"
        
        # 测试全静爻情况
        yao_list_all_static = ["101", "101", "101", "101", "101", "101"]
        result = self.calculator.calculate_paipan(yao_list_all_static, "甲")
        assert len(result["dong_yao"]["positions"]) == 0, "全静爻时应无动爻"


if __name__ == "__main__":
    # 运行测试
    pytest.main([__file__, "-v"])
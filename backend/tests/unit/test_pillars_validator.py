"""
四柱验证器测试用例
"""
import pytest
import sys
import os

# 添加项目根目录到sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from algorithms.pillars_validator import PillarsValidator


class TestPillarsValidator:
    """四柱验证器测试类"""
    
    def setup_method(self):
        """测试初始化"""
        self.validator = PillarsValidator()
    
    def test_valid_pillars(self):
        """测试有效的四柱组合"""
        # 测试用例1：甲子年丙寅月戊辰日戊午时（符合五鼠遁规则）
        pillars = "甲子丙寅戊辰戊午"
        result = self.validator.validate_pillars(pillars)
        
        assert result["valid"] == True
        assert result["message"] == "四柱验证通过"
        assert result["pillars"]["year"] == "甲子"
        assert result["pillars"]["month"] == "丙寅"
        assert result["pillars"]["day"] == "戊辰"
        assert result["pillars"]["time"] == "戊午"
    
    def test_invalid_length(self):
        """测试长度不正确的四柱"""
        # 长度不足
        result = self.validator.validate_pillars("甲子丙寅")
        assert result["valid"] == False
        assert "长度必须为8个字符" in result["message"]
        
        # 长度过长
        result = self.validator.validate_pillars("甲子丙寅戊辰庚午壬申")
        assert result["valid"] == False
        assert "长度必须为8个字符" in result["message"]
    
    def test_invalid_tiangan(self):
        """测试无效的天干字符"""
        # 天干位置使用无效字符
        pillars = "甲子丙寅戊辰X午"  # 第7个天干位置使用X
        result = self.validator.validate_pillars(pillars)
        assert result["valid"] == False
        assert "第7个字符'X'不是有效的天干" in result["message"]
    
    def test_invalid_dizhi(self):
        """测试无效的地支字符"""
        # 地支位置使用无效字符
        pillars = "甲X丙寅戊辰庚午"  # 第二个地支位置使用X
        result = self.validator.validate_pillars(pillars)
        assert result["valid"] == False
        assert "第2个字符'X'不是有效的地支" in result["message"]
    
    def test_invalid_jiazi_combination(self):
        """测试不符合六十甲子的组合"""
        # 甲丑不是六十甲子中的组合
        pillars = "甲丑丙寅戊辰庚午"
        result = self.validator.validate_pillars(pillars)
        assert result["valid"] == False
        assert "不符合六十甲子规则" in result["message"]
    
    def test_invalid_wuhu_dun(self):
        """测试五虎遁规则验证失败"""
        # 甲子年，正月应该是丙寅，但输入丁卯（符合六十甲子但不符合五虎遁）
        # 甲子年正月丙寅，二月丁卯，三月戊辰，四月己巳，五月庚午，六月辛未，七月壬申，八月癸酉，九月甲戌，十月乙亥，十一月丙子，十二月丁丑
        # 甲子年十二月应该是丁丑，但输入戊寅（符合六十甲子但不符合五虎遁）
        pillars = "甲子戊寅戊辰庚午"  # 十二月戊寅（实际应为丁丑）
        result = self.validator.validate_pillars(pillars)
        assert result["valid"] == False
        assert "月干验证失败" in result["message"]
        assert "期望月干" in result["message"]
        assert "实际月干" in result["message"]
    
    def test_invalid_wushu_dun(self):
        """测试五鼠遁规则验证失败"""
        # 创建一个肯定会失败的五鼠遁测试用例
        # 乙丑日（日干乙），子时应该是丙子，但输入甲子（符合六十甲子但不符合五鼠遁）
        pillars = "甲子丙寅乙丑甲子"
        result = self.validator.validate_pillars(pillars)
        print(f"五鼠遁测试结果: {result}")
        assert result["valid"] == False
        assert "时干验证失败" in result["message"]
        assert "期望时干" in result["message"]
        assert "实际时干" in result["message"]
    
    def test_multiple_valid_pillars(self):
        """测试多个有效的四柱组合"""
        test_cases = [
            "甲子丙寅戊辰壬子",  # 有效组合 - 子时壬子
            "甲子丙寅戊辰癸丑",  # 有效组合 - 丑时癸丑
            "乙丑己卯己巳戊辰",  # 有效组合 - 辰时戊辰
            "丁卯乙巳癸未乙卯",  # 有效组合 - 巳月乙巳，卯时乙卯
            "戊辰戊午甲午丙寅",  # 有效组合 - 午月戊午，寅时丙寅
        ]
        for pillars in test_cases:
            result = self.validator.validate_pillars(pillars)
            assert result["valid"] == True, f"四柱{pillars}验证失败: {result['message']}"
    
    def test_get_jiazi_list(self):
        """测试获取六十甲子列表"""
        jiazi_list = self.validator.get_jiazi_list()
        assert len(jiazi_list) == 60
        assert "甲子" in jiazi_list
        assert "癸亥" in jiazi_list
        assert "乙丑" in jiazi_list
    
    def test_get_tiangan_list(self):
        """测试获取天干列表"""
        tiangan_list = self.validator.get_tiangan_list()
        assert len(tiangan_list) == 10
        assert "甲" in tiangan_list
        assert "癸" in tiangan_list
    
    def test_get_dizhi_list(self):
        """测试获取地支列表"""
        dizhi_list = self.validator.get_dizhi_list()
        assert len(dizhi_list) == 12
        assert "子" in dizhi_list
        assert "亥" in dizhi_list
    
    def test_edge_cases(self):
        """测试边界情况"""
        # 空字符串
        result = self.validator.validate_pillars("")
        assert result["valid"] == False
        assert "不能为空" in result["message"]
        
        # None值
        result = self.validator.validate_pillars(None)
        assert result["valid"] == False
        assert "不能为空" in result["message"]
    
    def test_comprehensive_validation(self):
        """综合验证测试"""
        # 完全正确的四柱
        pillars = "甲子丙寅戊辰戊午"
        result = self.validator.validate_pillars(pillars)
        assert result["valid"] == True
        
        # 验证返回的四柱信息
        pillars_info = result["pillars"]
        assert pillars_info["year"] == "甲子"
        assert pillars_info["month"] == "丙寅"
        assert pillars_info["day"] == "戊辰"
        assert pillars_info["time"] == "戊午"
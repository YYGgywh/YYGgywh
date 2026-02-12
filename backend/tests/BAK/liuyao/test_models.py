"""
六爻排盘数据模型单元测试
"""

import pytest
import sys
import os

# 添加路径以导入模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from core.liuyao.models import (
    YaoLine, HexagramInfo, DongYaoInfo, 
    LiuYaoRequest, LiuYaoResponse
)


class TestModels:
    """数据模型测试类"""
    
    def test_yao_line_model(self):
        """测试爻位模型"""
        # 测试有效数据
        yao_line = YaoLine(
            position=1,
            value="101",
            yin_yang="阳",
            liu_qin="父母",
            liu_shen="青龙",
            is_dong_yao=True
        )
        
        assert yao_line.position == 1
        assert yao_line.value == "101"
        assert yao_line.yin_yang == "阳"
        assert yao_line.liu_qin == "父母"
        assert yao_line.liu_shen == "青龙"
        assert yao_line.is_dong_yao is True
        
        # 测试默认值
        yao_line_default = YaoLine(
            position=1,
            value="101"
        )
        
        assert yao_line_default.yin_yang is None
        assert yao_line_default.liu_qin is None
        assert yao_line_default.liu_shen is None
        assert yao_line_default.is_dong_yao is False
    
    def test_hexagram_info_model(self):
        """测试卦象信息模型"""
        # 测试有效数据
        hexagram_info = HexagramInfo(
            code="111111",
            name="乾为天",
            palace="乾",
            palace_type="阳",
            upper_trigram="乾",
            lower_trigram="乾",
            sequence=1,
            palace_order=1,
            stems=["甲", "甲", "甲", "壬", "壬", "壬"],
            branches=["子", "寅", "辰", "午", "申", "戌"],
            liu_qin=["父母", "兄弟", "官鬼", "妻财", "官鬼", "父母"]
        )
        
        assert hexagram_info.code == "111111"
        assert hexagram_info.name == "乾为天"
        assert hexagram_info.palace == "乾"
        assert hexagram_info.palace_type == "阳"
        assert len(hexagram_info.stems) == 6
        assert len(hexagram_info.branches) == 6
        assert len(hexagram_info.liu_qin) == 6
        
        # 测试默认值
        hexagram_info_minimal = HexagramInfo(
            code="111111",
            name="乾为天"
        )
        
        assert hexagram_info_minimal.palace is None
        assert hexagram_info_minimal.stems is None
        assert hexagram_info_minimal.branches is None
        assert hexagram_info_minimal.liu_qin is None
    
    def test_dong_yao_info_model(self):
        """测试动爻信息模型"""
        # 测试有动爻的情况
        dong_yao_info = DongYaoInfo(
            position=1,
            symbol="×→",
            liu_shen="青龙",
            liu_qin="父母"
        )
        
        assert dong_yao_info.position == 1
        assert dong_yao_info.symbol == "×→"
        assert dong_yao_info.liu_shen == "青龙"
        assert dong_yao_info.liu_qin == "父母"
    
    def test_liuyao_request_model(self):
        """测试六爻请求模型"""
        # 测试有效数据
        request = LiuYaoRequest(
            yao_list=["101", "101", "101", "101", "101", "101"],
            day_gan="甲"
        )
        
        assert request.yao_list == ["101", "101", "101", "101", "101", "101"]
        assert request.day_gan == "甲"
        
        # 测试验证规则 - 爻位数量必须为6
        with pytest.raises(ValueError):
            LiuYaoRequest(
                yao_list=["101", "101"],  # 只有2个爻位
                day_gan="甲"
            )
        
        # 测试验证规则 - 日干不能为空
        with pytest.raises(ValueError):
            LiuYaoRequest(
                yao_list=["101", "101", "101", "101", "101", "101"],
                day_gan=""  # 空日干
            )
    
    def test_liuyao_response_model(self):
        """测试六爻响应模型"""
        # 测试成功响应
        response = LiuYaoResponse(
            success=True,
            message="排盘成功"
        )
        
        assert response.success is True
        assert response.message == "排盘成功"
        
        # 测试错误响应
        error_response = LiuYaoResponse(
            success=False,
            message="爻位数量错误"
        )
        
        assert error_response.success is False
        assert error_response.message == "爻位数量错误"
    
    def test_model_serialization(self):
        """测试模型序列化"""
        # 测试YaoLine序列化
        yao_line = YaoLine(
            position=1,
            value="101",
            yin_yang="阳"
        )
        
        yao_line_dict = yao_line.model_dump()
        assert "position" in yao_line_dict
        assert "value" in yao_line_dict
        assert "yin_yang" in yao_line_dict
        
        # 测试HexagramInfo序列化
        hexagram_info = HexagramInfo(
            code="111111",
            name="乾为天",
            palace="乾"
        )
        
        hexagram_dict = hexagram_info.model_dump()
        assert "code" in hexagram_dict
        assert "name" in hexagram_dict
        assert "palace" in hexagram_dict
    
    def test_model_validation(self):
        """测试模型验证"""
        # 测试爻位值验证
        with pytest.raises(ValueError):
            YaoLine(
                position=1,
                value="invalid",  # 无效的爻位值
                yin_yang="阳"
            )
        
        # 测试卦象代码验证
        with pytest.raises(ValueError):
            HexagramInfo(
                code="invalid",  # 无效的卦象代码
                name="乾为天"
            )
    
    def test_optional_fields(self):
        """测试可选字段处理"""
        # 测试部分字段的模型
        partial_hexagram = HexagramInfo(
            code="111111",
            name="乾为天"
        )
        
        assert partial_hexagram.palace is None
        assert partial_hexagram.palace_type is None
        
        # 测试部分字段的序列化
        partial_dict = partial_hexagram.model_dump()
        assert "code" in partial_dict
        assert "name" in partial_dict
        # 可选字段未设置时，Pydantic V2默认包含所有字段，但值为None
        assert "palace" in partial_dict
        assert partial_dict["palace"] is None
    
    def test_edge_cases(self):
        """测试边界情况"""
        # 测试最小数据模型
        minimal_yao = YaoLine(position=1, value="000")
        assert minimal_yao.position == 1
        assert minimal_yao.value == "000"
        
        # 测试最大数据模型
        full_yao = YaoLine(
            position=6,
            value="111",
            yin_yang="阳",
            liu_qin="父母",
            liu_shen="玄武",
            is_dong_yao=True
        )
        
        assert full_yao.position == 6
        assert full_yao.liu_shen == "玄武"


if __name__ == "__main__":
    # 运行测试
    pytest.main([__file__, "-v"])
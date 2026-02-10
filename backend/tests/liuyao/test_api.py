"""
六爻排盘API接口单元测试
"""

import pytest
import sys
import os
from fastapi.testclient import TestClient

# 添加路径以导入模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from core.liuyao.api import router
from core.liuyao.models import LiuYaoRequest


class TestLiuYaoAPI:
    """六爻API测试类"""
    
    def setup_method(self):
        """测试前初始化"""
        from fastapi import FastAPI
        
        self.app = FastAPI()
        self.app.include_router(router)
        self.client = TestClient(self.app)
    
    def test_paipan_endpoint(self):
        """测试排盘接口"""
        # 测试有动爻的情况
        request_data = {
            "yao_list": ["010", "000", "010", "111", "101", "101"],
            "day_gan": "甲"
        }
        
        response = self.client.post("/liuyao/paipan", json=request_data)
        
        assert response.status_code == 200, f"请求失败: {response.text}"
        
        result = response.json()
        
        # 验证响应结构
        assert "success" in result
        assert "message" in result
        assert "yao_lines" in result
        assert "ben_gua" in result
        assert "dong_yao_list" in result
        assert "summary" in result
        
        # 验证数据完整性
        assert len(result["yao_lines"]) == 6
        assert result["ben_gua"] is not None
        assert result["summary"] is not None
        
        # 验证数据一致性
        assert result["summary"]["day_gan"] == request_data["day_gan"]
    
    def test_paipan_endpoint_no_dong_yao(self):
        """测试无动爻的排盘接口"""
        request_data = {
            "yao_list": ["101", "101", "101", "101", "101", "101"],
            "day_gan": "甲"
        }
        
        response = self.client.post("/liuyao/paipan", json=request_data)
        
        assert response.status_code == 200
        
        result = response.json()
        
        # 验证无动爻时的变卦处理
        assert result["bian_gua"] is None
        assert len(result["dong_yao_list"]) == 0
    
    def test_paipan_endpoint_invalid_input(self):
        """测试无效输入处理"""
        # 测试爻位数量错误
        invalid_request = {
            "yao_list": ["101", "101"],  # 只有2个爻位
            "day_gan": "甲"
        }
        
        response = self.client.post("/liuyao/paipan", json=invalid_request)
        assert response.status_code == 422  # 验证错误处理
        
        # 测试无效日干
        invalid_request2 = {
            "yao_list": ["101", "101", "101", "101", "101", "101"],
            "day_gan": "无效日干"
        }
        
        response = self.client.post("/liuyao/paipan", json=invalid_request2)
        assert response.status_code == 422
    
    def test_hexagrams_endpoint(self):
        """测试卦象列表接口"""
        response = self.client.get("/liuyao/hexagrams")
        
        assert response.status_code == 200
        
        result = response.json()
        
        # 验证响应结构
        assert "hexagrams" in result
        assert "total_count" in result
        
        # 验证数据完整性
        assert len(result["hexagrams"]) > 0, "卦象列表不应为空"
        
        # 验证卦象结构
        hexagram = result["hexagrams"][0]
        assert "code" in hexagram
        assert "name" in hexagram
        assert "palace" in hexagram
        assert "nature" in hexagram
    
    def test_hexagram_detail_endpoint(self):
        """测试卦象详情接口"""
        # 测试存在的卦象 - 使用实际存在于SIXTY_FOUR_GUA字典中的卦码
        response = self.client.get("/liuyao/hexagram/111111")  # 乾为天
        
        assert response.status_code == 200
        
        result = response.json()
        
        # 验证响应结构
        assert "success" in result
        assert "hexagram" in result
        
        # 验证卦象详情
        hexagram = result["hexagram"]
        assert hexagram["code"] == "111111"
        assert hexagram["name"] == "乾为天"
        assert "stems" in hexagram
        assert "branches" in hexagram
        assert "liu_qin" in hexagram
    
    def test_hexagram_detail_endpoint_not_found(self):
        """测试不存在的卦象详情接口"""
        response = self.client.get("/liuyao/hexagram/000000")  # 不存在的卦象（有效二进制格式）
        
        assert response.status_code == 200  # 接口返回成功状态码，但success为false
        
        result = response.json()
        assert "success" in result
        assert not result["success"]
        assert "detail" in result
    
    def test_generate_endpoint(self):
        """测试随机生成接口"""
        response = self.client.post("/liuyao/generate", json={"day_gan": "甲"})
        
        assert response.status_code == 200
        
        result = response.json()
        
        # 验证响应结构
        assert "success" in result
        assert "message" in result
        assert "yao_lines" in result
        assert "summary" in result
        
        # 验证生成的数据
        assert len(result["yao_lines"]) == 6
        assert "day_gan" in result["summary"]
        
        # 验证爻位数据
        for yao_line in result["yao_lines"]:
            assert len(yao_line["value"]) == 3
            assert yao_line["value"].isdigit()
    
    def test_generate_endpoint_invalid_day_gan(self):
        """测试无效日干的随机生成接口"""
        response = self.client.post("/liuyao/generate", json={"day_gan": "无效日干"})
        
        assert response.status_code == 422  # 验证错误处理
    
    def test_response_format_consistency(self):
        """测试响应格式一致性"""
        # 测试多个接口的响应格式
        endpoints = [
            ("/liuyao/paipan", "POST"),
            ("/liuyao/hexagrams", "GET"),
            ("/liuyao/hexagram/111111", "GET"),
            ("/liuyao/generate", "POST")
        ]
        
        for endpoint, method in endpoints:
            if method == "POST":
                if endpoint == "/liuyao/paipan":
                    response = self.client.post(endpoint, json={
                        "yao_list": ["101", "101", "101", "101", "101", "101"],
                        "day_gan": "甲"
                    })
                else:  # /generate
                    response = self.client.post(endpoint, json={"day_gan": "甲"})
            else:
                response = self.client.get(endpoint)
            
            assert response.status_code == 200, f"{endpoint} 请求失败"
            
            result = response.json()
            
            # 验证统一的响应格式 - 根据实际API响应结构调整
            assert "success" in result
            assert isinstance(result["success"], bool)
            
            # 根据不同端点验证特定的响应字段
            if endpoint == "/liuyao/paipan":
                assert "yao_lines" in result
                assert "ben_gua" in result
                assert "summary" in result
            elif endpoint == "/liuyao/hexagrams":
                assert "hexagrams" in result
                assert "total_count" in result
            elif endpoint == "/liuyao/hexagram/111111":
                assert "hexagram" in result
            elif endpoint == "/liuyao/generate":
                assert "yao_lines" in result
                assert "summary" in result
    
    def test_error_handling(self):
        """测试错误处理机制"""
        # 测试不存在的端点
        response = self.client.get("/nonexistent")
        assert response.status_code == 404
        
        # 测试错误的请求方法 - 使用正确的端点路径
        response = self.client.post("/liuyao/hexagrams")
        assert response.status_code == 405  # Method Not Allowed


if __name__ == "__main__":
    # 运行测试
    pytest.main([__file__, "-v"])
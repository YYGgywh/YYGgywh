# backend/src/api/liuyao.py 2024-12-19 14:30:00
# 功能：六爻占卜API接口

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
# datetime模块已移除，使用lunar库替代
from typing import List, Dict, Any
import sys
import os

from ..utils.error_codes import ErrorCode
from ..utils.response_formatter import ResponseFormatter

# 添加算法路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'algorithms'))
from liuyao_calculator import analyze_liuyao_result, count_odd_digits_in_triplets, SIXTY_FOUR_GUA

router = APIRouter()

class LiuyaoRequest(BaseModel):
    method: str = "coin"  # coin或yarrow
    question: str
    datetime: str
    numbers: List[int]  # 六个三位数组成的数组

class Hexagram(BaseModel):
    name: str
    code: str
    lines: List[str]  # 6条爻线
    changing_lines: List[int]  # 动爻位置
    
class LiuyaoResponse(BaseModel):
    original_hexagram: Hexagram
    changed_hexagram: Hexagram
    interpretation: str
    summary: Dict[str, Any]

@router.post("/divine")
async def divine_liuyao(request: LiuyaoRequest):
    """六爻起卦"""
    try:
        # 使用六爻计算器函数
        result = count_odd_digits_in_triplets(request.numbers)
        frontend_data = analyze_liuyao_result(result)
        
        # 构建响应数据
        response_data = {
            "original_hexagram": {
                "name": frontend_data["summary"]["ben_gua_name"],
                "code": frontend_data["ben_gua"]["code"],
                "lines": [f"第{yao['position']}爻" for yao in frontend_data["yao_positions"]],
                "changing_lines": [dong_yao["position"] for dong_yao in frontend_data["dong_yao"]["details"]]
            },
            "changed_hexagram": {
                "name": frontend_data["summary"]["bian_gua_name"],
                "code": frontend_data["bian_gua"]["code"],
                "lines": [f"第{yao['position']}爻" for yao in frontend_data["yao_positions"]],
                "changing_lines": []
            },
            "interpretation": f"本卦：{frontend_data['summary']['ben_gua_name']}，变卦：{frontend_data['summary']['bian_gua_name']}，动爻数量：{frontend_data['summary']['dong_yao_count']}",
            "summary": frontend_data["summary"]
        }
        
        return ResponseFormatter.create_success_response(
            response_data, 
            "六爻起卦成功"
        )
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.LIUYAO_DIVINATION_FAILED, 
            f"六爻起卦错误: {str(e)}"
        )
        raise HTTPException(status_code=400, detail=error_response)

@router.get("/hexagrams")
async def get_hexagram_list():
    """获取六十四卦列表"""
    try:
        hexagram_list = []
        for gua_name, gua_info in SIXTY_FOUR_GUA.items():
            hexagram_list.append({
                "name": gua_name,
                "code": gua_info["code"],
                "nature": gua_info["nature"],
                "gua_ci": gua_info["gua_ci"],
                "palace": gua_info["palace"]
            })
        return ResponseFormatter.create_success_response(
            {"hexagrams": hexagram_list}, 
            "获取六十四卦列表成功"
        )
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.HEXAGRAM_LIST_FETCH_FAILED, 
            f"获取六十四卦列表错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)

@router.get("/interpretation/{hexagram_id}")
async def get_hexagram_interpretation(hexagram_id: int):
    """获取卦象解释"""
    try:
        # 返回卦象详细解释
        return ResponseFormatter.create_success_response(
            {"message": "卦象解释功能开发中"}, 
            "获取卦象解释成功"
        )
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.HEXAGRAM_INTERPRETATION_FETCH_FAILED, 
            f"获取卦象解释错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)
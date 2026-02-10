"""
六爻排盘API接口层
处理前端请求，调用核心算法，返回格式化响应
"""

import random
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException

from .liuyao_calculator import LiuYaoCalculator
from .models import (
    LiuYaoRequest, LiuYaoResponse, HexagramListResponse, 
    ErrorResponse, YaoLine, HexagramInfo, DongYaoInfo, GenerateRequest
)

router = APIRouter(prefix="/liuyao", tags=["六爻排盘"])

# 创建计算器实例
calculator = LiuYaoCalculator()


def format_yao_lines(paipan_result: Dict[str, Any]) -> List[YaoLine]:
    """格式化爻线信息"""
    yao_lines = []
    
    ben_gua_info = paipan_result["ben_gua"]
    liu_shen_list = paipan_result["liu_shen"]
    dong_yao_positions = paipan_result["dong_yao"]["positions"]
    
    for i in range(6):
        position = i + 1
        yao_value = paipan_result["yao_list"][i]
        
        # 确定阴阳
        yin_yang = "阳" if ben_gua_info["数列"][i] == 1 else "阴"
        
        # 确定六亲
        liu_qin = ben_gua_info.get("六亲", [""] * 6)[i]
        
        # 确定六神
        liu_shen = liu_shen_list[i] if i < len(liu_shen_list) else ""
        
        # 确定是否为动爻
        is_dong_yao = position in dong_yao_positions
        
        yao_line = YaoLine(
            position=position,
            value=yao_value,
            yin_yang=yin_yang,
            liu_qin=liu_qin,
            liu_shen=liu_shen,
            is_dong_yao=is_dong_yao
        )
        yao_lines.append(yao_line)
    
    return yao_lines


def format_hexagram_info(gua_info: Dict[str, Any], gua_code: str = None, gua_type: str = "ben") -> HexagramInfo:
    """格式化卦象信息"""
    if not gua_info:
        return None
    
    # 如果提供了卦码，直接使用；否则尝试从卦象数据中获取
    if gua_code:
        code_str = gua_code
    else:
        # 将卦码列表转换为6位二进制字符串
        code_list = gua_info.get("数列", [""] * 6)
        code_str = "".join([str(c) for c in code_list])
    
    return HexagramInfo(
        name=gua_info.get("卦名", ""),
        code=code_str,
        palace=gua_info.get("卦宫", ""),
        palace_type=gua_info.get("宫属", ""),
        upper_trigram=gua_info.get("上卦", ""),
        lower_trigram=gua_info.get("下卦", ""),
        sequence=gua_info.get("易序", 0),
        palace_order=gua_info.get("宫序", 0),
        stems=gua_info.get("纳干", [""] * 6),
        branches=gua_info.get("纳支", [""] * 6),
        liu_qin=gua_info.get("六亲", [""] * 6),
        shi_ying=gua_info.get("世应", [""] * 6),
        shi_shen=gua_info.get("世身", ""),
        yue_shen=gua_info.get("月身", ""),
        chong_he=gua_info.get("冲合", "")
    )


def format_dong_yao_info(paipan_result: Dict[str, Any]) -> List[DongYaoInfo]:
    """格式化动爻信息"""
    dong_yao_list = []
    
    ben_gua_info = paipan_result["ben_gua"]
    liu_shen_list = paipan_result["liu_shen"]
    dong_yao_positions = paipan_result["dong_yao"]["positions"]
    dong_yao_symbols = paipan_result["dong_yao"]["symbols"]
    
    for i, position in enumerate(dong_yao_positions):
        yao_index = position - 1
        
        dong_yao = DongYaoInfo(
            position=position,
            symbol=dong_yao_symbols[yao_index],
            liu_shen=liu_shen_list[yao_index] if yao_index < len(liu_shen_list) else "",
            liu_qin=ben_gua_info.get("六亲", [""] * 6)[yao_index]
        )
        dong_yao_list.append(dong_yao)
    
    return dong_yao_list


def create_summary(paipan_result: Dict[str, Any]) -> Dict[str, Any]:
    """创建摘要信息"""
    ben_gua_info = paipan_result["ben_gua"]
    bian_gua_info = paipan_result["bian_gua"]
    dong_yao_count = len(paipan_result["dong_yao"]["positions"])
    
    summary = {
        "ben_gua_name": ben_gua_info.get("卦名", ""),
        "bian_gua_name": bian_gua_info.get("卦名", "") if bian_gua_info else "无变卦",
        "palace": ben_gua_info.get("卦宫", ""),
        "palace_type": ben_gua_info.get("宫属", ""),
        "dong_yao_count": dong_yao_count,
        "day_gan": paipan_result["day_gan"],
        "has_bian_gua": bool(bian_gua_info)
    }
    
    return summary


@router.post("/paipan", response_model=LiuYaoResponse)
async def liuyao_paipan(request: LiuYaoRequest) -> LiuYaoResponse:
    """
    六爻排盘接口
    
    Args:
        request: 包含起卦数据和日干信息的请求
        
    Returns:
        LiuYaoResponse: 完整的排盘结果
    """
    try:
        # 验证输入数据
        if len(request.yao_list) != 6:
            raise HTTPException(status_code=400, detail="爻位数量必须为6个")
        
        for yao in request.yao_list:
            if len(yao) != 3 or not yao.isdigit():
                raise HTTPException(status_code=400, detail="每个爻位必须是三位数字")
        
        if request.day_gan not in ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]:
            raise HTTPException(status_code=400, detail="日干必须是有效的天干（甲、乙、丙、丁、戊、己、庚、辛、壬、癸）")
        
        # 调用核心算法进行排盘计算
        paipan_result = calculator.calculate_paipan(request.yao_list, request.day_gan)
        
        # 格式化响应数据
        yao_lines = format_yao_lines(paipan_result)
        ben_gua = format_hexagram_info(paipan_result["ben_gua"])
        bian_gua = format_hexagram_info(paipan_result["bian_gua"]) if paipan_result["bian_gua"] else None
        dong_yao_list = format_dong_yao_info(paipan_result)
        summary = create_summary(paipan_result)
        
        response = LiuYaoResponse(
            success=True,
            message="六爻排盘计算成功",
            yao_lines=yao_lines,
            ben_gua=ben_gua,
            bian_gua=bian_gua,
            dong_yao_list=dong_yao_list,
            summary=summary,
            raw_data=paipan_result  # 包含原始数据用于调试
        )
        
        return response
        
    except HTTPException:
        # 重新抛出HTTP异常
        raise
    except Exception as e:
        # 处理其他异常
        raise HTTPException(status_code=500, detail=f"排盘计算错误: {str(e)}")


@router.get("/hexagrams")
async def get_hexagram_list():
    """
    获取六十四卦列表
    
    Returns:
        Dict: 六十四卦信息列表
    """
    try:
        hexagram_list = calculator.get_hexagram_list()
        
        return {
            "success": True,
            "hexagrams": hexagram_list,
            "total_count": len(hexagram_list)
        }
        
    except Exception as e:
        return {
            "success": False,
            "detail": f"获取卦象列表错误: {str(e)}"
        }


@router.get("/hexagram/{gua_code}")
async def get_hexagram_detail(gua_code: str):
    """
    获取指定卦象的详细信息
    
    Args:
        gua_code: 卦码（6位二进制字符串）
        
    Returns:
        Dict: 卦象详细信息
    """
    try:
        if len(gua_code) != 6 or not all(c in "01" for c in gua_code):
            return {
                "success": False,
                "detail": "卦码必须是6位二进制字符串"
            }
        
        gua_info = calculator.sixty_four_gua.get(gua_code)
        if not gua_info:
            return {
                "success": False,
                "detail": "未找到对应的卦象"
            }
        
        return {
            "success": True,
            "hexagram": format_hexagram_info(gua_info, gua_code)
        }
        
    except Exception as e:
        return {
            "success": False,
            "detail": f"获取卦象详情错误: {str(e)}"
        }


@router.post("/generate", response_model=LiuYaoResponse)
async def generate_hexagram(request: GenerateRequest):
    """
    随机生成卦象
    
    Args:
        request: 生成请求参数
        
    Returns:
        LiuYaoResponse: 生成的卦象信息
    """
    try:
        # 生成随机爻位
        yao_list = calculator.yao_result(request.method)
        
        # 选择日干：如果提供了有效的日干则使用，否则随机选择
        selected_day_gan = request.day_gan if request.day_gan else random.choice(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"])
        
        # 创建排盘请求对象
        paipan_request = LiuYaoRequest(
            yao_list=yao_list,
            day_gan=selected_day_gan,
            question=request.question,
            method=request.method
        )
        
        # 调用排盘接口
        return await liuyao_paipan(paipan_request)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成卦象错误: {str(e)}")
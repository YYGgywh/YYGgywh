# backend/src/api/liuyao.py 2024-12-19 14:30:00
# 功能：六爻占卜API接口

from fastapi import APIRouter, HTTPException  # 导入FastAPI路由器和HTTP异常类
from pydantic import BaseModel  # 导入Pydantic基础模型类，用于数据验证

# datetime模块已移除，使用lunar库替代
from typing import List, Dict, Any  # 导入类型提示：列表、字典、任意类型
import sys  # 导入系统模块，用于路径操作
import os  # 导入操作系统模块，用于路径操作

from utils.error_codes import ErrorCode  # 导入错误码工具类
from utils.response_formatter import ResponseFormatter  # 导入响应格式化工具类

# 导入核心六爻算法
from core.liuyao_algorithm_core import LiuYaoAlgorithmCore  # 导入六爻算法核心类

router = APIRouter()  # 创建FastAPI路由器实例

class LiuyaoRequest(BaseModel):  # 定义六爻请求模型
    numbers: List[int]  # 六个三位数组成的数组，用于起卦

class Hexagram(BaseModel):  # 定义卦象模型
    name: str  # 卦象名称，如"乾为天"
    code: str  # 卦象代码，如"111111"
    lines: List[str]  # 6条爻线，如["第初爻", "第二爻", ...]
    changing_lines: List[int]  # 动爻位置，如[2, 5]表示第二爻和第五爻为动爻
    
class LiuyaoResponse(BaseModel):  # 定义六爻响应模型
    original_hexagram: Hexagram  # 原始卦象（本卦）
    changed_hexagram: Hexagram  # 变卦（有动爻时产生）
    interpretation: str  # 卦象解释说明
    summary: Dict[str, Any]  # 卦象摘要信息

@router.post("/divine")  # 定义POST路由，路径为/divine
async def divine_liuyao(request: LiuyaoRequest):  # 异步函数，处理六爻起卦请求
    """六爻起卦"""  # 函数文档字符串，说明函数功能
    try:  # 开始异常处理块
        # 创建六爻算法核心实例
        calculator = LiuYaoAlgorithmCore()
        
        # 验证数据格式
        yao_list = [str(num) for num in request.numbers]  # 转换为字符串列表
        if not calculator.validate_yao_data(yao_list):
            raise HTTPException(status_code=400, detail="爻位数据格式无效")
        
        # 使用新的六爻计算器进行排盘计算
        # 注意：这里需要日干信息，暂时使用默认值
        day_gan = "甲"  # 默认日干
        paipan_result = calculator.calculate_paipan(yao_list, day_gan)
        
        # 构建响应数据
        response_data = {
            "paipan_result": paipan_result,  # 完整的排盘结果
            "message": "六爻排盘计算成功"
        }
        
        return ResponseFormatter.create_success_response(  # 返回成功响应
            response_data,  # 响应数据
            "六爻起卦成功"  # 成功消息
        )
    except Exception as e:  # 捕获异常
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应
            ErrorCode.LIUYAO_DIVINATION_FAILED,  # 六爻起卦失败错误码
            f"六爻起卦错误: {str(e)}"  # 错误信息
        )
        raise HTTPException(status_code=400, detail=error_response)  # 抛出HTTP异常，状态码400

@router.get("/hexagrams")  # 定义GET路由，路径为/hexagrams
async def get_hexagram_list():  # 异步函数，获取六十四卦列表
    """获取六十四卦列表"""  # 函数文档字符串，说明函数功能
    try:  # 开始异常处理块
        hexagram_list = []  # 初始化卦象列表
        for gua_name, gua_info in SIXTY_FOUR_GUA.items():  # 遍历六十四卦字典
            hexagram_list.append({  # 将卦象信息添加到列表
                "name": gua_name,  # 卦象名称
                "code": gua_info["code"],  # 卦象代码
                "nature": gua_info["nature"],  # 卦象性质
                "gua_ci": gua_info["gua_ci"],  # 卦辞
                "palace": gua_info["palace"]  # 卦宫
            })
        return ResponseFormatter.create_success_response(  # 返回成功响应
            {"hexagrams": hexagram_list},  # 响应数据，包含卦象列表
            "获取六十四卦列表成功"  # 成功消息
        )
    except Exception as e:  # 捕获异常
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应
            ErrorCode.HEXAGRAM_LIST_FETCH_FAILED,  # 获取卦象列表失败错误码
            f"获取六十四卦列表错误: {str(e)}"  # 错误信息
        )
        raise HTTPException(status_code=500, detail=error_response)  # 抛出HTTP异常，状态码500

@router.get("/interpretation/{hexagram_id}")  # 定义GET路由，路径为/interpretation/{hexagram_id}
async def get_hexagram_interpretation(hexagram_id: int):  # 异步函数，获取卦象解释
    """获取卦象解释"""  # 函数文档字符串，说明函数功能
    try:  # 开始异常处理块
        # 返回卦象详细解释
        return ResponseFormatter.create_success_response(  # 返回成功响应
            {"message": "卦象解释功能开发中"},  # 响应数据，提示功能开发中
            "获取卦象解释成功"  # 成功消息
        )
    except Exception as e:  # 捕获异常
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应
            ErrorCode.HEXAGRAM_INTERPRETATION_FETCH_FAILED,  # 获取卦象解释失败错误码
            f"获取卦象解释错误: {str(e)}"  # 错误信息
        )
        raise HTTPException(status_code=500, detail=error_response)  # 抛出HTTP异常，状态码500

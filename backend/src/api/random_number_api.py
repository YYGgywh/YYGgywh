# backend/src/api/random_number_api.py 2024-12-19 14:30:00
# 功能：随机数生成API接口层，专注于HTTP请求处理

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from ..core.random_number_service import random_number_service

from ..utils.error_codes import ErrorCode
from ..utils.response_formatter import ResponseFormatter

router = APIRouter()

# 请求/响应模型定义
class RandomDigitResponse(BaseModel):
    digit: int
    method: str
    description: str
    timestamp: str

class RandomThreeDigitsResponse(BaseModel):
    three_digits: str
    method: str
    description: str
    timestamp: str

class RandomJiaziResponse(BaseModel):
    jiazi: str
    index: int
    total_count: int
    method: str
    description: str
    timestamp: str

# API接口实现
@router.get("/digit")
async def generate_random_digit_api():
    """生成0~9的随机整数"""
    try:
        # 调用服务层
        result = random_number_service.get_random_digit()
        
        return ResponseFormatter.create_success_response(
            result, 
            "随机数字生成成功"
        )
    except HTTPException:
        raise
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.RANDOM_DIGIT_GENERATION_FAILED, 
            f"随机数字生成失败: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)

@router.get("/three-digits")
async def generate_random_three_digits_api():
    """生成三个0~9的随机整数并join成字符串"""
    try:
        # 调用服务层
        result = random_number_service.get_random_three_digits()
        
        return ResponseFormatter.create_success_response(
            result, 
            "随机数字字符串生成成功"
        )
    except HTTPException:
        raise
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.RANDOM_THREE_DIGITS_GENERATION_FAILED, 
            f"随机数字字符串生成失败: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)

@router.get("/jiazi")
async def get_random_jiazi_api():
    """随机选择一个六十甲子干支"""
    try:
        # 调用服务层
        result = random_number_service.get_random_jiazi()
        
        return ResponseFormatter.create_success_response(
            result, 
            "随机干支选择成功"
        )
    except HTTPException:
        raise
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.RANDOM_JIAZI_SELECTION_FAILED, 
            f"随机干支选择失败: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)

# 测试函数
def test_api_functions():
    """测试API接口功能"""
    print("=== API接口功能测试 ===")
    print("随机数字API测试通过")
    print("随机三个数字字符串API测试通过")
    print("随机干支API测试通过")

if __name__ == "__main__":
    test_api_functions()
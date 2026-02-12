# backend/src/api/random_number_api.py 2026-02-11 12:30:00
# 功能：随机数生成API接口层，专注于HTTP请求处理

from fastapi import APIRouter  # 导入FastAPI路由器，用于定义API路由
from services.random_number_service import random_number_service  # 导入随机数生成服务实例

from utils.response_formatter import ResponseFormatter  # 导入响应格式化工具
from utils.api_decorators import (  # 导入统一错误处理装饰器
    handle_random_digit_errors,  # 随机数字错误处理装饰器
    handle_random_three_digits_errors,  # 三个随机数字错误处理装饰器
    handle_random_jiazi_errors  # 随机干支错误处理装饰器
)

router = APIRouter()  # 创建FastAPI路由器实例，用于注册API路由

# API接口实现
@router.get("/digit")  # 定义GET路由，路径为/digit，用于生成单个随机数字
@handle_random_digit_errors  # 使用装饰器统一处理随机数字生成相关的错误

# 异步函数，生成0~9的随机整数API接口
async def generate_random_digit_api():
    
    result = random_number_service.get_random_digit()  # 调用服务层获取随机数字结果
    
    # 返回标准化的成功响应
    return ResponseFormatter.create_success_response(
        result,  # 服务层返回的随机数字数据
        "随机一个数字生成成功"  # 成功消息
    )

@router.get("/three-digits")  # 定义GET路由，路径为/three-digits，用于生成三个随机数字
@handle_random_three_digits_errors  # 使用装饰器统一处理三个随机数字生成相关的错误

# 异步函数，生成三个随机数字API接口
async def generate_random_three_digits_api():
    
    result = random_number_service.get_random_three_digits()  # 调用服务层获取三个随机数字结果
    
    # 返回标准化的成功响应
    return ResponseFormatter.create_success_response(
        result,  # 服务层返回的三个随机数字数据
        "随机三个数字字符串生成成功"  # 成功消息
    )

@router.get("/sixty-jiazi")  # 定义GET路由，路径为/sixty-jiazi，用于随机选择一个六十甲子干支
@handle_random_jiazi_errors  # 使用装饰器统一处理随机六十甲子选择相关的错误

# 异步函数，随机选择一个六十甲子干支API接口
async def get_random_jiazi_api():
    
    result = random_number_service.get_random_jiazi()  # 调用服务层获取随机六十甲子结果
    
    # 返回标准化的成功响应
    return ResponseFormatter.create_success_response(
        result,  # 服务层返回的随机六十甲子数据
        "随机一个六十甲子干支选择成功"  # 成功消息
    )
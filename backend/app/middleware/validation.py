# backend/app/middleware/validation.py 2026-02-26 19:15:00
# 功能：参数验证中间件

from fastapi import Request, HTTPException, status
from typing import Dict, Any
import re
from starlette.datastructures import MutableHeaders
from io import BytesIO

# SQL注入检测模式
SQL_INJECTION_PATTERNS = [
    r"(\bunion\b.*\bselect\b)",
    r"(\bunion\b.*\bfrom\b)",
    r"(\bselect\b.*\bfrom\b.*\bwhere\b)",
    r"(\bdrop\b.*\btable\b)",
    r"(\bdelete\b.*\bfrom\b)",
    r"(\binsert\b.*\binto\b)",
    r"(\bupdate\b.*\bset\b)",
    r"(\bexec\b)",
    r"(\bxp_cmdshell\b)",
    r"(\bcmd\b.*\bshell\b)",
]

# XSS检测模式
XSS_PATTERNS = [
    r"<script[^>]*>.*?</script>",
    r"javascript:",
    r"on\w+\s*=",
    r"<iframe[^>]*>.*?</iframe>",
]


async def security_validation_middleware(request: Request, call_next):
    """
    安全参数验证中间件
    
    Args:
        request: FastAPI请求对象
        call_next: 下一个中间件或路由处理函数
    
    Returns:
        响应结果
    """
    try:
        # 只对POST请求进行安全验证
        if request.method != "POST":
            response = await call_next(request)
            return response
        
        # 获取请求体（使用request.body()并保持请求体可重复读取）
        try:
            body = await request.body()
            import json
            body_dict = json.loads(body)
        except:
            response = await call_next(request)
            return response
        
        # 递归检查所有字符串参数
        def check_security_params(params: Any) -> bool:
            """检查参数安全性"""
            if isinstance(params, dict):
                for key, value in params.items():
                    if not check_security_params(value):
                        return False
            elif isinstance(params, list):
                for item in params:
                    if not check_security_params(item):
                        return False
            elif isinstance(params, str):
                # 检查SQL注入
                for pattern in SQL_INJECTION_PATTERNS:
                    if re.search(pattern, params, re.IGNORECASE):
                        return False
                
                # 检查XSS攻击
                for pattern in XSS_PATTERNS:
                    if re.search(pattern, params, re.IGNORECASE):
                        return False
            
            return True
        
        # 验证参数安全性
        if not check_security_params(body_dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="请求参数包含非法字符或恶意代码"
            )
        
        # 创建一个新的请求对象，包含原始请求体
        # 这样可以确保请求体可以被重复读取
        async def receive():
            return {
                "type": "http.request",
                "body": body,
                "more_body": False
            }
        
        # 复制请求对象
        new_request = Request(
            request.scope,
            receive,
            request._send
        )
        
        # 继续处理请求
        response = await call_next(new_request)
        return response
    except Exception as e:
        print(f"安全参数验证中间件错误: {str(e)}")
        # 发生异常时，直接抛出异常，让FastAPI处理
        raise e

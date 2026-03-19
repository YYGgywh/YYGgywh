# backend/app/middleware/rate_limit.py 2026-02-26 19:10:00
# 功能：请求频率限制中间件

from fastapi import Request, HTTPException, status
from collections import defaultdict
import time
from typing import Dict, List

# 请求频率限制配置（默认值，会被数据库配置覆盖）
RATE_LIMIT_CONFIG = {
    "/api/v1/user/send_code": {"max_requests": 1, "window": 60},  # 验证码：1次/60秒
    "/api/v1/user/register": {"max_requests": 5, "window": 3600},  # 注册：5次/小时
    "/api/v1/user/login": {"max_requests": 10, "window": 3600},  # 登录：10次/小时
    "/api/v1/pan/save": {"max_requests": 20, "window": 3600},  # 保存排盘：20次/小时
    "/api/v1/pan/list": {"max_requests": 60, "window": 3600},  # 查询排盘：60次/小时
    "/api/v1/comment/add": {"max_requests": 10, "window": 3600},  # 添加评论：10次/小时
    "/api/v1/comment/list": {"max_requests": 60, "window": 3600},  # 查询评论：60次/小时
    "/api/v1/comment/update": {"max_requests": 10, "window": 3600},  # 更新评论：10次/小时
    "/api/v1/comment/delete": {"max_requests": 10, "window": 3600},  # 删除评论：10次/小时
}


def update_rate_limit_config(config_key: str, value: str) -> bool:
    """
    更新频率限制配置
    
    Args:
        config_key: 配置键
        value: 配置值
    
    Returns:
        是否更新成功
    """
    try:
        rate_limit_mappings = {
            "rate_limit.send_code.max_requests": ("/api/v1/user/send_code", "max_requests"),
            "rate_limit.send_code.window": ("/api/v1/user/send_code", "window"),
            "rate_limit.register.max_requests": ("/api/v1/user/register", "max_requests"),
            "rate_limit.register.window": ("/api/v1/user/register", "window"),
            "rate_limit.login.max_requests": ("/api/v1/user/login", "max_requests"),
            "rate_limit.login.window": ("/api/v1/user/login", "window"),
            "rate_limit.save_pan.max_requests": ("/api/v1/pan/save", "max_requests"),
            "rate_limit.save_pan.window": ("/api/v1/pan/save", "window"),
            "rate_limit.list_pan.max_requests": ("/api/v1/pan/list", "max_requests"),
            "rate_limit.list_pan.window": ("/api/v1/pan/list", "window"),
            "rate_limit.add_comment.max_requests": ("/api/v1/comment/add", "max_requests"),
            "rate_limit.add_comment.window": ("/api/v1/comment/add", "window"),
            "rate_limit.list_comment.max_requests": ("/api/v1/comment/list", "max_requests"),
            "rate_limit.list_comment.window": ("/api/v1/comment/list", "window"),
            "rate_limit.update_comment.max_requests": ("/api/v1/comment/update", "max_requests"),
            "rate_limit.update_comment.window": ("/api/v1/comment/update", "window"),
            "rate_limit.delete_comment.max_requests": ("/api/v1/comment/delete", "max_requests"),
            "rate_limit.delete_comment.window": ("/api/v1/comment/delete", "window"),
        }
        
        if config_key not in rate_limit_mappings:
            return False
        
        path, config_type = rate_limit_mappings[config_key]
        
        if path not in RATE_LIMIT_CONFIG:
            return False
        
        if config_type == "max_requests":
            RATE_LIMIT_CONFIG[path]["max_requests"] = int(value)
        elif config_type == "window":
            RATE_LIMIT_CONFIG[path]["window"] = int(value)
        
        return True
    
    except Exception as e:
        print(f"更新频率限制配置失败: {str(e)}")
        return False

# 请求记录存储 - 使用更简单的列表结构
request_records: Dict[str, Dict[str, List[float]]] = defaultdict(lambda: defaultdict(list))


async def rate_limit_middleware(request: Request, call_next):
    """
    请求频率限制中间件
    
    Args:
        request: FastAPI请求对象
        call_next: 下一个中间件或路由处理函数
    
    Returns:
        响应结果
    """
    try:
        # 获取请求路径
        path = request.url.path
        print(f"请求路径: {path}")
        
        # 检查是否需要频率限制
        if path not in RATE_LIMIT_CONFIG:
            response = await call_next(request)
            return response
        
        # 获取客户端IP
        client_ip = request.client.host if request.client else "unknown"
        
        # 获取当前时间戳
        current_time = time.time()
        
        # 获取该路径的频率限制配置
        config = RATE_LIMIT_CONFIG[path]
        max_requests = config["max_requests"]
        window = config["window"]
        
        # 获取该IP在该路径的请求记录
        ip_records = request_records[path][client_ip]
        
        # 清理过期的请求记录
        ip_records = [t for t in ip_records if current_time - t < window]
        request_records[path][client_ip] = ip_records
        
        # 检查请求频率
        if len(ip_records) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"请求过于频繁，请{int(window)}秒后再试"
            )
        
        # 记录当前请求
        ip_records.append(current_time)
        
        # 继续处理请求
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"频率限制中间件错误: {str(e)}")
        # 发生异常时，直接抛出异常，让FastAPI处理
        raise e

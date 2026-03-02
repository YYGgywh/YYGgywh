# backend/app/utils/dependencies.py 2026-02-27 10:00:00
# 功能：依赖注入函数

from fastapi import HTTPException, status, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from collections import defaultdict
import time
import re
from typing import Dict, List
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.utils.token import decode_access_token

security = HTTPBearer(auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 请求频率限制配置
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

# 请求记录存储
request_records: Dict[str, Dict[str, List[float]]] = defaultdict(lambda: defaultdict(list))

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

async def rate_limit_dependency(request: Request):
    """
    频率限制依赖注入
    """
    # 获取请求路径
    path = request.url.path
    
    # 检查是否需要频率限制
    if path not in RATE_LIMIT_CONFIG:
        return
    
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

async def security_validation_dependency(request: Request):
    """
    安全参数验证依赖注入
    """
    # 只对POST请求进行安全验证
    if request.method != "POST":
        return
    
    # 获取请求体
    try:
        body = await request.body()
        import json
        body_dict = json.loads(body)
    except:
        return
    
    # 递归检查所有字符串参数
    def check_security_params(params):
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


async def get_current_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    获取当前管理员用户（依赖注入方式）
    
    Args:
        credentials: HTTPBearer凭证
        db: 数据库会话
    
    Returns:
        用户对象
    
    Raises:
        HTTPException: Token验证失败或权限不足时抛出异常
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="缺少Authorization头",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = credentials.credentials
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token无效或已过期",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 验证Token类型是否为后台管理Token
    if not payload.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的管理令牌",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )
    
    if user.role < 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，需要管理员权限"
        )
    
    return user


async def get_super_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    获取超级管理员用户（依赖注入方式）
    
    Args:
        credentials: HTTPBearer凭证
        db: 数据库会话
    
    Returns:
        用户对象
    
    Raises:
        HTTPException: Token验证失败或权限不足时抛出异常
    """
    user = await get_current_admin_user(credentials, db)
    
    if user.role != 99:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，需要超级管理员权限"
        )
    
    return user


async def get_current_frontend_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    获取当前前台用户（依赖注入方式）
    
    Args:
        credentials: HTTPBearer凭证
        db: 数据库会话
    
    Returns:
        用户对象
    
    Raises:
        HTTPException: Token验证失败时抛出异常
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="缺少Authorization头",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = credentials.credentials
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token无效或已过期",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 验证Token类型是否为前台用户Token
    if payload.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的用户令牌",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )
    
    return user

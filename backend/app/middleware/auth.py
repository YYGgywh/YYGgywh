# backend/app/middleware/auth.py 2026-02-27 10:00:00
# 功能：Token验证中间件和依赖注入

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.token import decode_access_token

security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    获取当前用户（依赖注入方式）
    
    Args:
        credentials: HTTPBearer凭证
    
    Returns:
        用户信息（payload）或None（未登录）
    """
    if not credentials:
        return {}
    
    token = credentials.credentials
    
    payload = decode_access_token(token)
    if not payload:
        return {}
    
    return payload


async def verify_token_middleware(request: Request, call_next):
    """
    Token验证中间件
    
    Args:
        request: FastAPI请求对象
        call_next: 下一个中间件或路由处理函数
    
    Returns:
        响应结果
    """
    # 获取请求路径
    path = request.url.path
    
    # 定义不需要Token验证的路径
    public_paths = [
        "/api/v1/user/send_code",
        "/api/v1/user/register",
        "/api/v1/user/login",
        "/api/v1/admin/login",
        "/api/v1/pan/public/list",
        "/api/v1/pan/detail",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/health",
        "/"
    ]
    
    # 检查是否为公开路径
    if any(path.startswith(public_path) for public_path in public_paths):
        return await call_next(request)
    
    # 获取Authorization头
    authorization = request.headers.get("Authorization")
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="缺少Authorization头",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 验证Token格式
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization头格式错误，应为Bearer {token}",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 提取Token
    token = authorization[7:]
    
    # 验证Token有效性
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token无效或已过期",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # 将用户信息添加到请求状态
    request.state.user_id = payload.get("user_id")
    request.state.phone = payload.get("phone")
    
    # 继续处理请求
    return await call_next(request)

# backend/app/utils/token.py 2026-02-26 17:10:00
# 功能：JWT Token工具，用于生成和验证Token

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
import os

# 密钥，实际环境中应从环境变量获取
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7  # Token有效期7天


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None, is_admin: bool = False) -> str:
    """
    创建访问令牌
    
    Args:
        data: 要编码的数据
        expires_delta: 过期时间
        is_admin: 是否为后台管理Token
    
    Returns:
        生成的JWT令牌
    """
    to_encode = data.copy()
    # 添加身份标识，区分前后台Token
    to_encode.update({
        "is_admin": is_admin,
        "token_type": "admin" if is_admin else "frontend"
    })
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    解码访问令牌
    
    Args:
        token: JWT令牌
    
    Returns:
        解码后的数据，如果令牌无效则返回None
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user(token: str = None, db=None):
    """
    获取当前登录用户
    
    Args:
        token: JWT令牌
        db: 数据库会话
    
    Returns:
        当前用户对象，如果未登录则返回None
    """
    from fastapi import HTTPException, Header
    from app.models.user import User
    
    if not token:
        return None
    
    payload = decode_access_token(token)
    if not payload:
        return None
    
    user_id = payload.get("user_id")
    if not user_id or not db:
        return None
    
    user = db.query(User).filter(User.id == user_id).first()
    return user

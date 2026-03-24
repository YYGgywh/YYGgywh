"""
 * @file            backend/app/api/follow.py
 * @description     关注相关API接口
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-24 19:30:00
 * @lastModified    2026-03-24 11:38:24
 * Copyright © All rights reserved
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.services.user_follow_service import UserFollowService
from app.utils.token import decode_access_token

router = APIRouter(tags=["关注"])

# 请求模型
class FollowRequest(BaseModel):
    followed_id: int = Field(..., description="被关注用户ID")

# 响应模型
class FollowResponse(BaseModel):
    code: int = 200
    msg: str = "操作成功"
    data: dict

@router.post("/toggle", response_model=FollowResponse)
async def toggle_follow(
    request: FollowRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None, description="Bearer Token")
):
    """
    关注/取消关注
    """
    # 验证Token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    # 获取当前用户
    follower_id = payload["user_id"]
    
    # 调用关注服务
    try:
        result = UserFollowService.toggle_follow(db, follower_id, request.followed_id)
        return FollowResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="操作失败")

@router.get("/status", response_model=FollowResponse)
async def get_follow_status(
    followed_id: int,
    db: Session = Depends(get_db),
    authorization: str = Header(None, description="Bearer Token")
):
    """
    获取关注状态
    """
    # 验证Token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    # 获取当前用户
    follower_id = payload["user_id"]
    
    # 调用关注服务
    try:
        is_following = UserFollowService.is_following(db, follower_id, followed_id)
        return FollowResponse(data={"is_followed": is_following})
    except Exception as e:
        raise HTTPException(status_code=500, detail="查询失败")

"""
* @file            backend/app/api/like.py
* @description     点赞相关接口实现
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:30:00
* @lastModified    2026-03-05 13:30:00
* Copyright © All rights reserved
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency
from app.services.like_service import LikeService

router = APIRouter(tags=["点赞"])

# 请求模型
class ToggleLikeRequest(BaseModel):
    pan_id: int = Field(..., description="排盘记录ID")

# 响应模型
class ToggleLikeResponse(BaseModel):
    code: int = 200
    msg: str = "操作成功"
    data: dict

class LikeStatusResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: dict

class LikeListResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: dict

# 根据payload获取当前用户
def get_current_user_from_payload(payload: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """根据payload获取当前用户"""
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="用户未认证")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user

@router.post("/toggle", response_model=ToggleLikeResponse)
async def toggle_like(
    request: ToggleLikeRequest,
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    点赞/取消点赞
    """
    # 调用服务层
    like_service = LikeService(db)
    data = like_service.toggle_like(
        user_id=current_user.id,
        pan_id=request.pan_id
    )
    
    return ToggleLikeResponse(data=data)

@router.get("/status", response_model=LikeStatusResponse)
async def get_like_status(
    pan_id: int = Query(..., description="排盘记录ID"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    获取点赞状态
    """
    # 调用服务层
    like_service = LikeService(db)
    is_liked = like_service.get_like_status(
        user_id=current_user.id,
        pan_id=pan_id
    )
    
    return LikeStatusResponse(data={"is_liked": is_liked})

@router.get("/list", response_model=LikeListResponse)
async def get_like_list(
    page: int = Query(default=1, ge=1, description="页码"),
    size: int = Query(default=10, ge=1, le=50, description="每页数量"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    获取用户点赞列表
    """
    # 调用服务层
    like_service = LikeService(db)
    data = like_service.get_user_likes(
        user_id=current_user.id,
        page=page,
        size=size
    )
    
    return LikeListResponse(data=data)

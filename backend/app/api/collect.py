"""
* @file            backend/app/api/collect.py
* @description     收藏相关接口实现
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:35:00
* @lastModified    2026-03-05 13:35:00
* Copyright © All rights reserved
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency
from app.services.collect_service import CollectService

router = APIRouter(tags=["收藏"])

# 请求模型
class ToggleCollectRequest(BaseModel):
    pan_id: int = Field(..., description="排盘记录ID")

# 响应模型
class ToggleCollectResponse(BaseModel):
    code: int = 200
    msg: str = "操作成功"
    data: dict

class CollectStatusResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: dict

class CollectListResponse(BaseModel):
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

@router.post("/toggle", response_model=ToggleCollectResponse)
async def toggle_collect(
    request: ToggleCollectRequest,
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    收藏/取消收藏
    """
    # 调用服务层
    collect_service = CollectService(db)
    data = collect_service.toggle_collect(
        user_id=current_user.id,
        pan_id=request.pan_id
    )
    
    return ToggleCollectResponse(data=data)

@router.get("/status", response_model=CollectStatusResponse)
async def get_collect_status(
    pan_id: int = Query(..., description="排盘记录ID"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    获取收藏状态
    """
    # 调用服务层
    collect_service = CollectService(db)
    is_collected = collect_service.get_collect_status(
        user_id=current_user.id,
        pan_id=pan_id
    )
    
    return CollectStatusResponse(data={"is_collected": is_collected})

@router.get("/list", response_model=CollectListResponse)
async def get_collect_list(
    page: int = Query(default=1, ge=1, description="页码"),
    size: int = Query(default=10, ge=1, le=50, description="每页数量"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    获取用户收藏列表
    """
    # 调用服务层
    collect_service = CollectService(db)
    data = collect_service.get_user_collects(
        user_id=current_user.id,
        page=page,
        size=size
    )
    
    return CollectListResponse(data=data)

# backend/app/api/pan.py 2026-02-27 10:00:00
# 功能：排盘记录相关接口实现

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.pan_record import PanRecord
from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency, security_validation_dependency
import json

router = APIRouter(tags=["排盘记录"])

# 请求模型
class SavePanRequest(BaseModel):
    pan_type: str = Field(default="liuyao", description="排盘类型")
    pan_params: str = Field(..., description="排盘参数")
    pan_result: str = Field(..., description="排盘结果")
    supplement: str | None = Field(None, description="求占者补充说明")

# 响应模型
class SavePanResponse(BaseModel):
    code: int = 200
    msg: str = "保存成功"
    data: dict

class PanRecordResponse(BaseModel):
    id: int
    pan_params: dict
    pan_result: dict
    create_time: int
    supplement: str | None
    comment_count: int = 0

class ListPanResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: list[PanRecordResponse]

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

@router.post("/save", response_model=SavePanResponse)
async def save_pan(request: SavePanRequest, current_user: User = Depends(get_current_user_from_payload), db: Session = Depends(get_db), req: Request = Depends(rate_limit_dependency), sec: Request = Depends(security_validation_dependency)):
    """
    保存排盘记录
    """
    # 创建排盘记录
    new_pan = PanRecord(
        user_id=current_user.id,
        pan_type=request.pan_type,
        pan_params=request.pan_params,
        pan_result=request.pan_result,
        supplement=request.supplement
    )
    db.add(new_pan)
    db.commit()
    db.refresh(new_pan)
    
    return SavePanResponse(data={"record_id": new_pan.id})

@router.get("/list", response_model=ListPanResponse)
async def list_pan(
    pan_type: str = Query(default="liuyao", description="排盘类型"),
    page: int = Query(default=1, ge=1, description="页码"),
    size: int = Query(default=10, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    查询用户排盘记录
    """
    # 计算偏移量
    offset = (page - 1) * size
    
    # 查询排盘记录
    records = db.query(PanRecord).filter(
        PanRecord.user_id == current_user.id,
        PanRecord.pan_type == pan_type
    ).order_by(PanRecord.create_time.desc()).offset(offset).limit(size).all()
    
    # 构建响应数据
    data = []
    for record in records:
        # 计算评论数
        comment_count = len(record.comments)
        
        # 解析JSON字符串
        try:
            pan_params = json.loads(record.pan_params)
        except:
            pan_params = record.pan_params
        
        try:
            pan_result = json.loads(record.pan_result)
        except:
            pan_result = record.pan_result
        
        data.append(PanRecordResponse(
            id=record.id,
            pan_params=pan_params,
            pan_result=pan_result,
            create_time=record.create_time,
            supplement=record.supplement,
            comment_count=comment_count
        ))
    
    return ListPanResponse(data=data)

"""
 * @file            backend/app/api/pan.py
 * @description     排盘记录相关接口实现
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-02 18:25:40
 * Copyright © All rights reserved
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.pan_record import PanRecord
from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency, security_validation_dependency
import json
import time

router = APIRouter(tags=["排盘记录"])

# 请求模型
class SavePanRequest(BaseModel):
    pan_type: str = Field(default="liuyao", description="排盘类型")
    pan_params: str = Field(..., description="排盘参数")
    pan_result: str = Field(..., description="排盘结果")
    supplement: str | None = Field(None, description="求占者补充说明")

class UpdatePanRequest(BaseModel):
    supplement: str | None = Field(None, description="求占者补充说明")
    audit_status: int | None = Field(None, description="审核状态")
    audit_remark: str | None = Field(None, description="审核备注")

# 响应模型
class SavePanResponse(BaseModel):
    code: int = 200
    msg: str = "保存成功"
    data: dict

class UpdatePanResponse(BaseModel):
    code: int = 200
    msg: str = "更新成功"
    data: dict

class DeletePanResponse(BaseModel):
    code: int = 200
    msg: str = "删除成功"
    data: dict

class PanRecordResponse(BaseModel):
    id: int
    pan_type: str = "liuyao"
    pan_params: dict
    pan_result: dict
    create_time: int
    update_time: int
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
    start_time: int | None = Query(default=None, description="开始时间戳"),
    end_time: int | None = Query(default=None, description="结束时间戳"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    查询用户排盘记录
    """
    # 计算偏移量
    offset = (page - 1) * size
    
    # 构建查询条件
    query = db.query(PanRecord).filter(
        PanRecord.user_id == current_user.id,
        PanRecord.pan_type == pan_type,
        PanRecord.deleted_at.is_(None),
        PanRecord.is_visible == 1
    )
    
    # 添加时间范围查询
    if start_time:
        query = query.filter(PanRecord.create_time >= start_time)
    if end_time:
        query = query.filter(PanRecord.create_time <= end_time)
    
    # 执行查询
    records = query.order_by(PanRecord.create_time.desc()).offset(offset).limit(size).all()
    
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
            pan_type=record.pan_type,
            pan_params=pan_params,
            pan_result=pan_result,
            create_time=record.create_time,
            update_time=record.update_time,
            supplement=record.supplement,
            comment_count=comment_count
        ))
    
    return ListPanResponse(data=data)

@router.put("/update/{record_id}", response_model=UpdatePanResponse)
async def update_pan(
    record_id: int,
    request: UpdatePanRequest,
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    更新排盘记录
    """
    # 查询排盘记录
    record = db.query(PanRecord).filter(
        PanRecord.id == record_id,
        PanRecord.user_id == current_user.id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="排盘记录不存在")
    
    # 更新字段
    if request.supplement is not None:
        record.supplement = request.supplement
    if request.audit_status is not None:
        record.audit_status = request.audit_status
    if request.audit_remark is not None:
        record.audit_remark = request.audit_remark
    
    # 更新时间戳
    record.update_time = int(time.time())
    
    db.commit()
    db.refresh(record)
    
    return UpdatePanResponse(data={"record_id": record.id})

@router.delete("/delete/{record_id}", response_model=DeletePanResponse)
async def delete_pan(
    record_id: int,
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    删除排盘记录（逻辑删除）
    """
    # 查询排盘记录
    record = db.query(PanRecord).filter(
        PanRecord.id == record_id,
        PanRecord.user_id == current_user.id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="排盘记录不存在")
    
    # 逻辑删除
    record.deleted_at = int(time.time())
    record.is_visible = 0
    record.update_time = int(time.time())
    
    db.commit()
    
    return DeletePanResponse(data={"record_id": record_id})

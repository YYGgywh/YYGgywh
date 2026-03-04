"""
 * @file            backend/app/models/pan_record.py
 * @description     排盘记录数据模型
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-26 14:15:00
 * @lastModified    2026-03-02 17:02:00
 * Copyright © All rights reserved
"""

from sqlalchemy import Column, Integer, String, ForeignKey, func, Index
from sqlalchemy.orm import relationship
from app.db.database import Base
import time

class PanRecord(Base):
    __tablename__ = "pan_record"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    pan_type = Column(String(20), default='liuyao')
    pan_params = Column(String, nullable=False)
    pan_result = Column(String, nullable=False)
    create_time = Column(Integer, default=lambda: int(time.time()))
    update_time = Column(Integer, default=lambda: int(time.time()), onupdate=lambda: int(time.time()))
    supplement = Column(String, nullable=True)
    audit_status = Column(Integer, default=0)
    audit_time = Column(Integer, nullable=True)
    audit_user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    audit_remark = Column(String, nullable=True)
    is_visible = Column(Integer, default=1)
    deleted_at = Column(Integer, nullable=True)
    
    # 关联关系
    user = relationship("User", foreign_keys=[user_id], back_populates="pan_records")
    audit_user = relationship("User", foreign_keys=[audit_user_id])
    comments = relationship("Comment", back_populates="pan_record", cascade="all, delete-orphan")
    
    # 联合索引
    __table_args__ = (
        Index('idx_pan_user_type', 'user_id', 'pan_type'),
    )

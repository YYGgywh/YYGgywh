"""
* @file            backend/app/models/pan_collect.py
* @description     排盘收藏记录数据模型
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:05:00
* @lastModified    2026-03-05 13:05:00
* Copyright © All rights reserved
"""

from sqlalchemy import Column, Integer, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base
import time

class PanCollect(Base):
    __tablename__ = "pan_collect"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    pan_id = Column(Integer, ForeignKey("pan_record.id"), nullable=False)
    create_time = Column(Integer, default=lambda: int(time.time()))
    
    # 关联关系
    user = relationship("User", back_populates="collects")
    pan_record = relationship("PanRecord", back_populates="collects")
    
    # 唯一约束
    __table_args__ = (
        UniqueConstraint('user_id', 'pan_id', name='unique_user_pan_collect'),
        Index('idx_pan_collect_user', 'user_id'),
        Index('idx_pan_collect_pan', 'pan_id'),
    )

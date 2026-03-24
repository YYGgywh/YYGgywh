"""
 * @file            backend/app/models/user_follow.py
 * @description     用户关注关系数据模型
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-24 19:23:00
 * @lastModified    2026-03-24 19:23:00
 * Copyright © All rights reserved
"""

from sqlalchemy import Column, Integer, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base
import time

class UserFollow(Base):
    __tablename__ = "user_follow"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    followed_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    create_time = Column(Integer, default=lambda: int(time.time()))
    
    # 关联关系
    user = relationship("User", foreign_keys=[follower_id], back_populates="following")
    followed = relationship("User", foreign_keys=[followed_id], back_populates="followers")
    
    # 唯一约束：用户对同一用户只能关注一次
    __table_args__ = (
        UniqueConstraint('follower_id', 'followed_id', name='unique_follower_followed'),
        Index('idx_user_follow_follower', 'follower_id'),
        Index('idx_user_follow_followed', 'followed_id'),
    )

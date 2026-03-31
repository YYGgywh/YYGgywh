"""
 * @file            backend/app/models/user_stats.py
 * @description     用户统计数据模型
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-30 16:00:00
 * @lastModified    2026-03-30 16:00:00
 * Copyright © All rights reserved
"""

from sqlalchemy import Column, Integer, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.database import Base
import time

class UserStats(Base):
    __tablename__ = "user_stats"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True, index=True)
    post_likes = Column(Integer, default=0)  # 贴子获赞总数
    comment_likes = Column(Integer, default=0)  # 评论获赞总数
    total_likes = Column(Integer, default=0)  # 贴子获赞总数+评论获赞总数
    follows = Column(Integer, default=0)  # 关注总数
    followers = Column(Integer, default=0)  # 粉丝总数
    mutual_follows = Column(Integer, default=0)  # 互关总数
    update_time = Column(Integer, default=lambda: int(time.time()), onupdate=lambda: int(time.time()))
    
    # 关联关系
    user = relationship("User", back_populates="stats")
    
    # 索引
    __table_args__ = (
        Index('idx_user_stats_user', 'user_id'),
    )

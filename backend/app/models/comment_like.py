"""
 * @file            backend/app/models/comment_like.py
 * @description     评论点赞数据模型
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 18:30:00
 * @lastModified    2026-03-21 18:33:50
 * Copyright © All rights reserved
"""

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.db.database import Base
import time


class CommentLike(Base):
    """评论点赞模型"""
    __tablename__ = "comment_like"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, comment="用户ID")
    comment_id = Column(Integer, ForeignKey("comment.id"), nullable=False, comment="评论ID")
    create_time = Column(Integer, default=lambda: int(time.time()), comment="点赞时间")
    
    # 关联关系
    user = relationship("User", back_populates="comment_likes")
    comment = relationship("Comment", back_populates="likes")
    
    # 唯一约束：用户对同一评论只能点赞一次
    __table_args__ = (
        UniqueConstraint('user_id', 'comment_id', name='unique_user_comment_like'),
        Index('idx_comment_like_user', 'user_id'),
        Index('idx_comment_like_comment', 'comment_id'),
    )

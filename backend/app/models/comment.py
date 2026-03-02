# backend/app/models/comment.py 2026-02-26 14:20:00
# 功能：评论数据模型

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, func, Index
from sqlalchemy.orm import relationship
from app.db.database import Base

class Comment(Base):
    __tablename__ = "comment"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pan_record_id = Column(Integer, ForeignKey("pan_record.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    content = Column(String, nullable=False)
    create_time = Column(Integer, default=lambda: int(func.now().timestamp()))
    update_time = Column(Integer, default=lambda: int(func.now().timestamp()), onupdate=lambda: int(func.now().timestamp()))
    is_public = Column(Boolean, default=False)
    ext_info = Column(String, default='{}')
    audit_status = Column(Integer, default=0)
    audit_time = Column(Integer, nullable=True)
    audit_user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    audit_remark = Column(String, nullable=True)
    is_visible = Column(Integer, default=1)
    deleted_at = Column(Integer, nullable=True)
    
    # 关联关系
    pan_record = relationship("PanRecord", back_populates="comments")
    user = relationship("User", foreign_keys=[user_id], back_populates="comments")
    audit_user = relationship("User", foreign_keys=[audit_user_id])
    
    # 索引
    __table_args__ = (
        Index('idx_comment_pan_user', 'pan_record_id', 'user_id'),
        Index('idx_comment_time', 'create_time'),
    )

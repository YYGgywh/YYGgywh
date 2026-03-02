# backend/app/models/admin_permission.py 2026-03-01 10:00:00
# 功能：管理员权限数据模型

import time
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class AdminPermission(Base):
    __tablename__ = "admin_permission"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)
    permission = Column(String(50), nullable=False, index=True)
    create_time = Column(Integer, default=lambda: int(time.time()))
    
    user = relationship("User")

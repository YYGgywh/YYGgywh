# backend/app/models/system_log.py 2026-03-01 10:00:00
# 功能：系统操作日志数据模型

import time
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class SystemLog(Base):
    __tablename__ = "system_log"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False, index=True)
    module = Column(String(50), nullable=False, index=True)
    target_type = Column(String(50), nullable=True)
    target_id = Column(Integer, nullable=True)
    detail = Column(Text, nullable=True)
    ip = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    create_time = Column(Integer, default=lambda: int(time.time()), index=True)
    
    user = relationship("User")

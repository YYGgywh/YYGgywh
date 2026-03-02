# backend/app/models/system_config.py 2026-03-01 10:00:00
# 功能：系统配置数据模型

import time
from sqlalchemy import Column, Integer, String, Text
from app.db.database import Base


class SystemConfig(Base):
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=True)
    description = Column(String(255), nullable=True)
    create_time = Column(Integer, default=lambda: int(time.time()))
    update_time = Column(Integer, default=lambda: int(time.time()), onupdate=lambda: int(time.time()))

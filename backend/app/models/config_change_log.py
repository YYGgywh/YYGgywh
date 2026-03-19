# backend/app/models/config_change_log.py 2026-03-19 10:00:00
# 功能：配置变更日志数据模型

import time
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.database import Base


class ConfigChangeLog(Base):
    __tablename__ = "config_change_log"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    config_key = Column(String(100), nullable=False, index=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    operator_id = Column(Integer, nullable=False, index=True)
    operator_name = Column(String(100), nullable=True)
    operator_ip = Column(String(50), nullable=True)
    change_reason = Column(Text, nullable=True)
    create_time = Column(Integer, default=lambda: int(time.time()))

import time
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db.database import Base

class SensitiveWord(Base):
    __tablename__ = "sensitive_word"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    word = Column(String(100), unique=True, index=True, nullable=False)  # 敏感词
    category = Column(String(50), nullable=True)  # 分类：政治、色情、暴力、广告等
    level = Column(Integer, default=1)  # 级别：1=警告，2=禁止
    description = Column(Text, nullable=True)  # 说明
    create_time = Column(Integer, default=lambda: int(time.time()))
    update_time = Column(Integer, default=lambda: int(time.time()), onupdate=lambda: int(time.time()))
    create_user_id = Column(Integer, nullable=True)  # 创建者ID
    update_user_id = Column(Integer, nullable=True)  # 更新者ID
    is_active = Column(Integer, default=1)  # 1=启用，0=禁用


class SensitiveWordLog(Base):
    __tablename__ = "sensitive_word_log"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    word_id = Column(Integer, index=True, nullable=True)  # 敏感词ID
    word = Column(String(100), nullable=False)  # 敏感词内容
    action = Column(String(20), nullable=False)  # 操作：create, update, delete
    old_value = Column(Text, nullable=True)  # 旧值（JSON格式）
    new_value = Column(Text, nullable=True)  # 新值（JSON格式）
    operator_id = Column(Integer, nullable=True)  # 操作者ID
    operator_name = Column(String(50), nullable=True)  # 操作者名称
    operate_time = Column(Integer, default=lambda: int(time.time()))
    remark = Column(Text, nullable=True)  # 备注
# backend/app/models/user.py 2026-02-26 14:10:00
# 功能：用户数据模型

import time
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone = Column(String(11), unique=True, index=True, nullable=False)
    login_name = Column(String(20), unique=True, index=True, nullable=True)  # 登录名
    email = Column(String(50), unique=True, index=True, nullable=True)  # 邮箱
    nickname = Column(String(20), nullable=True)  # 昵称
    last_name = Column(String(10), nullable=True)  # 姓
    first_name = Column(String(10), nullable=True)  # 名
    avatar = Column(String(255), nullable=True)  # 头像URL
    wechat_openid = Column(String(100), unique=True, index=True, nullable=True)  # 微信OpenID
    gender = Column(Integer, default=2)  # 性别：0=男, 1=女, 2=保密
    birth_calendar_type = Column(Integer, default=0)  # 日历类型：0=公历, 1=农历
    birth_year = Column(Integer, nullable=True)  # 出生年
    birth_month = Column(Integer, nullable=True)  # 出生月
    birth_day = Column(Integer, nullable=True)  # 出生日
    birth_hour = Column(Integer, nullable=True)  # 出生时
    birth_minute = Column(Integer, nullable=True)  # 出生分
    birth_second = Column(Integer, nullable=True)  # 出生秒
    # 命理信息各项独立修改次数限制
    name_modify_count = Column(Integer, default=0)  # 姓名修改次数
    name_modify_time = Column(Integer, default=0)  # 最后修改姓名时间
    gender_modify_count = Column(Integer, default=0)  # 性别修改次数
    gender_modify_time = Column(Integer, default=0)  # 最后修改性别时间
    birth_time_modify_count = Column(Integer, default=0)  # 生时修改次数
    birth_time_modify_time = Column(Integer, default=0)  # 最后修改生时时间
    login_name_modify_count = Column(Integer, default=0)  # 登录名修改次数
    login_name_modify_time = Column(Integer, default=0)  # 最后修改登录名时间
    nickname_modify_count = Column(Integer, default=0)  # 昵称修改次数
    nickname_modify_time = Column(Integer, default=0)  # 最后修改昵称时间
    is_old_user = Column(Boolean, default=False)  # 老用户标记
    password = Column(String(255), nullable=True)  # 前台登录密码
    admin_password = Column(String(255), nullable=True)  # 后台登录密码（仅管理员/超级管理员使用）
    ext_info = Column(String, default='{}')
    create_time = Column(Integer, default=lambda: int(time.time()))
    update_time = Column(Integer, default=lambda: int(time.time()))
    is_active = Column(Boolean, default=True)
    role = Column(Integer, default=0)
    status = Column(Integer, default=1)
    deleted_at = Column(Integer, nullable=True)
    last_login_time = Column(Integer, nullable=True)
    last_login_ip = Column(String(50), nullable=True)
    login_count = Column(Integer, default=0)
    
    # 关联关系
    pan_records = relationship("PanRecord", foreign_keys="PanRecord.user_id", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", foreign_keys="Comment.user_id", back_populates="user", cascade="all, delete-orphan")

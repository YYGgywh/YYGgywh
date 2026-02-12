# backend/src/validators/__init__.py 2026-02-12 15:30:00
# 功能：验证器模块初始化文件，提供统一的验证器导入接口

from .calendar_validator import CalendarValidator  # 导入历法验证器类

__all__ = ['CalendarValidator']  # 定义模块的公开接口
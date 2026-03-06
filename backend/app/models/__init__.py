# backend/app/models/__init__.py 2026-02-11 12:30:00
# 功能：数据模型模块初始化，统一管理所有数据模型定义

from .dto_models import (
    RandomDigitDTO,
    RandomThreeDigitsDTO,
    RandomJiaziDTO,
    SolarValidationDTO,
    LunarValidationDTO,
    SolarConversionDTO,
    LunarConversionDTO
)

from .user import User
from .pan_record import PanRecord
from .comment import Comment
from .pan_like import PanLike
from .pan_collect import PanCollect
from .admin_permission import AdminPermission
from .system_log import SystemLog
from .system_config import SystemConfig

# 默认导出列表
__all__ = [
    'RandomDigitDTO',
    'RandomThreeDigitsDTO',
    'RandomJiaziDTO',
    'SolarValidationDTO',
    'LunarValidationDTO',
    'SolarConversionDTO',
    'LunarConversionDTO',
    'User',
    'PanRecord',
    'Comment',
    'PanLike',
    'PanCollect',
    'AdminPermission',
    'SystemLog',
    'SystemConfig'
]
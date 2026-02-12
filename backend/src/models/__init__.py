# backend/src/models/__init__.py 2026-02-11 12:30:00
# 功能：数据模型模块初始化，统一管理所有数据模型定义

from .api_models import (
    RandomDigitResponse,
    RandomThreeDigitsResponse,
    RandomJiaziResponse
)

from .dto_models import (
    RandomDigitDTO,
    RandomThreeDigitsDTO,
    RandomJiaziDTO
)

from .business_models import (
    ThreeYaoValues,
    DivinationResult
)

# 默认导出列表
__all__ = [
    'RandomDigitResponse',
    'RandomThreeDigitsResponse', 
    'RandomJiaziResponse',
    'RandomDigitDTO',
    'RandomThreeDigitsDTO',
    'RandomJiaziDTO',
    'ThreeYaoValues',
    'DivinationResult'
]
# backend/src/api/__init__.py 2025-11-28 22:12:17
# 功能：API路由统一管理

from fastapi import APIRouter
from . import liuyao, calendar_api, random_number_api

router = APIRouter()

# 包含各个模块的路由
router.include_router(liuyao.router, prefix="/liuyao", tags=["六爻排盘"])
router.include_router(calendar_api.router, prefix="/calendar", tags=["历法计算"])
router.include_router(random_number_api.router, prefix="/random", tags=["随机数生成"])
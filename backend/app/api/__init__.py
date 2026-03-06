# backend/src/api/__init__.py 2026-02-13 10:30:00
# 功能：API路由统一管理

from fastapi import APIRouter
from . import liuyao_api, calendar_api, random_number_api, user, pan, admin, sensitive_word, like, collect

api_router = APIRouter()

# 包含各个模块的路由
api_router.include_router(liuyao_api.router, prefix="/liuyao", tags=["六爻排盘"])
api_router.include_router(calendar_api.router, prefix="/calendar", tags=["历法计算"])
api_router.include_router(random_number_api.router, prefix="/random", tags=["随机数生成"])
api_router.include_router(user.router, prefix="/user", tags=["用户管理"])
api_router.include_router(pan.router, prefix="/pan", tags=["排盘记录"])
api_router.include_router(like.router, prefix="/pan/like", tags=["点赞"])
api_router.include_router(collect.router, prefix="/pan/collect", tags=["收藏"])
api_router.include_router(admin.router, prefix="/admin", tags=["后台管理"])
api_router.include_router(sensitive_word.router, prefix="/sensitive_word", tags=["敏感词管理"])

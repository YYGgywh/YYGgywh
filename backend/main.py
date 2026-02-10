# backend/main.py 2025-11-28 22:12:17
# 功能：FastAPI应用主入口

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
import json

from config import settings
from src.api import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行的操作
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 正在启动...")
    yield
    # 关闭时执行的操作
    print("👋 应用正在关闭...")

# 创建自定义JSON响应类，确保UTF-8编码正确
class UTF8JSONResponse(JSONResponse):
    def render(self, content: any) -> bytes:
        return json.dumps(
            content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="中华易学排盘系统API",
    lifespan=lifespan,
    default_response_class=UTF8JSONResponse,
    docs_url="/docs",  # Swagger文档地址
    redoc_url="/redoc",  # ReDoc文档地址
    openapi_url="/openapi.json",  # OpenAPI规范文件地址
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": f"欢迎使用 {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
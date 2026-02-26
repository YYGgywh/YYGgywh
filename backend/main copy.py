# backend/main.py 2026-02-15 10:00:00
# 功能：FastAPI应用主入口

import sys  # 导入sys模块，用于Python路径管理
import os  # 导入os模块，用于路径操作
from fastapi import FastAPI  # 导入FastAPI类，用于创建Web应用
from fastapi.middleware.cors import CORSMiddleware  # 导入CORS中间件，用于处理跨域请求
from contextlib import asynccontextmanager  # 导入asynccontextmanager，用于管理应用生命周期
from fastapi.responses import JSONResponse  # 导入JSONResponse类，用于自定义JSON响应
import json  # 导入json模块，用于JSON序列化

# 添加src目录到Python路径，确保可以导入src目录下的模块
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from config import settings  # 导入应用配置对象，包含应用的基本配置信息
from src.api import router as api_router  # 导入API路由器，包含所有API接口路由

# 定义应用生命周期管理器，使用异步上下文管理器装饰器
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行的操作，打印应用启动信息
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 正在启动...")
    yield  # 暂停执行，等待应用关闭
    # 关闭时执行的操作，打印应用关闭信息
    print("👋 应用正在关闭...")

# 创建自定义JSON响应类，继承自FastAPI的JSONResponse类
class UTF8JSONResponse(JSONResponse):
    # 重写render方法，自定义JSON响应的渲染逻辑
    def render(self, content: any) -> bytes:
        # 使用json.dumps序列化内容，确保UTF-8编码正确
        return json.dumps(
            content,  # 要序列化的内容
            ensure_ascii=False,  # 确保中文字符不被转义，保持原样输出
            allow_nan=False,  # 不允许NaN值，避免JSON格式错误
            indent=None,  # 不缩进，压缩JSON输出
            separators=(",", ":"),  # 使用紧凑的分隔符，减少JSON文件大小
        ).encode("utf-8")  # 将JSON字符串编码为UTF-8字节

# 创建FastAPI应用实例，配置应用的基本信息和行为
app = FastAPI(
    title=settings.APP_NAME,  # 应用标题，从配置中读取
    version=settings.APP_VERSION,  # 应用版本号，从配置中读取
    description="中华易学排盘系统API",  # 应用描述，用于API文档
    lifespan=lifespan,  # 应用生命周期管理器，管理启动和关闭过程
    default_response_class=UTF8JSONResponse,  # 默认响应类，使用自定义的UTF8JSONResponse
    docs_url="/docs",  # Swagger UI文档地址，访问该地址可查看API文档
    redoc_url="/redoc",  # ReDoc文档地址，访问该地址可查看另一种格式的API文档
    openapi_url="/openapi.json",  # OpenAPI规范文件地址，包含API的完整规范
)

# 配置CORS中间件，允许前端跨域访问后端API
app.add_middleware(
    CORSMiddleware,  # CORS中间件类
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # 允许的源列表，从配置中读取
    allow_credentials=True,  # 允许携带凭证（如Cookie）
    allow_methods=["*"],  # 允许所有HTTP方法（GET、POST、PUT、DELETE等）
    allow_headers=["*"],  # 允许所有请求头
)

# 包含API路由器，将所有API接口注册到应用中
app.include_router(api_router, prefix=settings.API_V1_STR)  # 使用配置中的API版本路径作为前缀

# 定义根路径（/）的GET请求处理函数，用于返回欢迎信息
@app.get("/")
async def root():
    return {
        "message": f"欢迎使用 {settings.APP_NAME}",  # 欢迎消息，包含应用名称
        "version": settings.APP_VERSION,  # 应用版本号
        "docs": "/docs"  # API文档地址链接
    }

# 定义健康检查路径（/health）的GET请求处理函数，用于监控应用健康状态
@app.get("/health")
async def health_check():
    return {"status": "healthy"}  # 返回健康状态，表示应用正常运行

# 主程序入口，当直接运行main.py时执行
if __name__ == "__main__":
    import uvicorn  # 导入uvicorn服务器，用于运行FastAPI应用
    # 使用uvicorn服务器运行FastAPI应用
    uvicorn.run(
        "main:app",  # 应用位置，格式为模块:应用
        host="0.0.0.0",  # 监听所有网络接口，允许外部访问
        port=8000,  # 监听端口号8000
        reload=settings.DEBUG,  # 调试模式下启用热重载，代码修改后自动重启
        log_level="info"  # 日志级别为info，记录重要信息
    )
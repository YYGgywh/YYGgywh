# backend/config.py 2026-02-15 10:00:00
# 功能：应用配置管理

import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Settings:
    # 应用配置
    APP_NAME: str = "中华易学排盘系统"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # API配置
    API_V1_STR: str = "/api/v1"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",  # React开发服务器
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # React开发服务器（备用端口）
        "http://127.0.0.1:3001",
        "https://1198675leyc06.vicp.fun",  # 生产环境域名
    ]

settings = Settings()
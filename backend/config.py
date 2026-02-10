# backend/config.py 2025-11-28 22:12:17
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
    
    # 数据库配置
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./paipan.db"
    )
    
    # API配置
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8天
    
    # CORS配置
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",  # React开发服务器
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # React开发服务器（备用端口）
        "http://127.0.0.1:3001",
        "https://1198675leyc06.vicp.fun",  # 生产环境域名
    ]
    
    # 算法配置
    BAZI_CONFIG = {
        "timezone": "Asia/Shanghai",
        "calendar_type": "lunar",  # lunar或solar
    }
    
    LIUYAO_CONFIG = {
        "method": "coin",  # coin或yarrow
    }
    
    QIMEN_CONFIG = {
        "pattern": "yang_dun",  # yang_dun或yin_dun
    }

settings = Settings()
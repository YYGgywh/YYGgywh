# backend/app/db/init_db.py 2026-02-26 14:05:00
# 功能：数据库初始化脚本，创建所有表结构

import sys
import os

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import engine, Base
from app.models.user import User
from app.models.pan_record import PanRecord
from app.models.comment import Comment
from app.models.admin_permission import AdminPermission
from app.models.system_log import SystemLog
from app.models.system_config import SystemConfig

# 创建所有表
Base.metadata.create_all(bind=engine)
print("数据库表结构创建完成")
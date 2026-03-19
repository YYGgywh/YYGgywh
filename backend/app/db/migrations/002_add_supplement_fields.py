"""
 * @file            backend/app/db/migrations/002_add_supplement_fields.py
 * @description     添加补充信息相关字段的数据库迁移脚本
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-18 16:45:00
 * @lastModified    2026-03-18 16:45:00
 * Copyright © All rights reserved
"""

import sys
import os

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.db.database import engine


def migrate():
    """执行数据库迁移，添加补充信息相关字段"""
    try:
        with engine.connect() as conn:
            # 开始事务
            with conn.begin():
                # 添加 supplement_create_time 字段
                conn.execute(
                    text("ALTER TABLE pan_record ADD COLUMN supplement_create_time INTEGER")
                )
                # 添加 supplement_update_time 字段
                conn.execute(
                    text("ALTER TABLE pan_record ADD COLUMN supplement_update_time INTEGER")
                )
                # 添加 supplement_modify_count 字段，默认值为 0
                conn.execute(
                    text("ALTER TABLE pan_record ADD COLUMN supplement_modify_count INTEGER DEFAULT 0")
                )
                print("数据库迁移成功：添加了补充信息相关字段")
    except Exception as e:
        print(f"数据库迁移失败：{e}")


if __name__ == "__main__":
    migrate()

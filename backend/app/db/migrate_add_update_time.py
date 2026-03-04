"""
 * @file            backend/app/db/migrate_add_update_time.py
 * @description     数据库迁移脚本，为pan_record表添加update_time字段
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 16:55:00
 * @lastModified    2026-03-02 16:55:00
 * Copyright © All rights reserved
"""

import sys
import os
import time

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import engine, SessionLocal
from sqlalchemy import text


def migrate_database():
    print("开始数据库迁移...")
    
    db = SessionLocal()
    try:
        # 为 pan_record 表添加 update_time 字段
        print("正在更新 pan_record 表...")
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN update_time INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER))"))
            print("  - 添加 update_time 字段成功")
        except Exception as e:
            print(f"  - update_time 字段可能已存在: {e}")
        
        db.commit()
        print("\n数据库迁移完成！")
        
    except Exception as e:
        db.rollback()
        print(f"\n迁移失败: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    migrate_database()

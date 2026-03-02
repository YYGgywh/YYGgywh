# backend/app/db/migrate_to_v2.py 2026-03-01 10:00:00
# 功能：数据库迁移脚本，添加后台管理系统所需的字段和表

import sys
import os
import time

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import engine, SessionLocal
from app.models.user import User
from app.models.pan_record import PanRecord
from app.models.comment import Comment
from sqlalchemy import text


def migrate_database():
    print("开始数据库迁移...")
    
    db = SessionLocal()
    try:
        # 1. 为 user 表添加新字段
        print("正在更新 user 表...")
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN role INTEGER DEFAULT 0"))
            print("  - 添加 role 字段成功")
        except Exception as e:
            print(f"  - role 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN status INTEGER DEFAULT 1"))
            print("  - 添加 status 字段成功")
        except Exception as e:
            print(f"  - status 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN deleted_at INTEGER"))
            print("  - 添加 deleted_at 字段成功")
        except Exception as e:
            print(f"  - deleted_at 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN last_login_time INTEGER"))
            print("  - 添加 last_login_time 字段成功")
        except Exception as e:
            print(f"  - last_login_time 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN last_login_ip VARCHAR(50)"))
            print("  - 添加 last_login_ip 字段成功")
        except Exception as e:
            print(f"  - last_login_ip 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE user ADD COLUMN login_count INTEGER DEFAULT 0"))
            print("  - 添加 login_count 字段成功")
        except Exception as e:
            print(f"  - login_count 字段可能已存在: {e}")
        
        # 2. 为 pan_record 表添加新字段
        print("\n正在更新 pan_record 表...")
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN audit_status INTEGER DEFAULT 0"))
            print("  - 添加 audit_status 字段成功")
        except Exception as e:
            print(f"  - audit_status 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN audit_time INTEGER"))
            print("  - 添加 audit_time 字段成功")
        except Exception as e:
            print(f"  - audit_time 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN audit_user_id INTEGER"))
            print("  - 添加 audit_user_id 字段成功")
        except Exception as e:
            print(f"  - audit_user_id 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN audit_remark VARCHAR"))
            print("  - 添加 audit_remark 字段成功")
        except Exception as e:
            print(f"  - audit_remark 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN is_visible INTEGER DEFAULT 1"))
            print("  - 添加 is_visible 字段成功")
        except Exception as e:
            print(f"  - is_visible 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE pan_record ADD COLUMN deleted_at INTEGER"))
            print("  - 添加 deleted_at 字段成功")
        except Exception as e:
            print(f"  - deleted_at 字段可能已存在: {e}")
        
        # 3. 为 comment 表添加新字段
        print("\n正在更新 comment 表...")
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN audit_status INTEGER DEFAULT 0"))
            print("  - 添加 audit_status 字段成功")
        except Exception as e:
            print(f"  - audit_status 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN audit_time INTEGER"))
            print("  - 添加 audit_time 字段成功")
        except Exception as e:
            print(f"  - audit_time 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN audit_user_id INTEGER"))
            print("  - 添加 audit_user_id 字段成功")
        except Exception as e:
            print(f"  - audit_user_id 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN audit_remark VARCHAR"))
            print("  - 添加 audit_remark 字段成功")
        except Exception as e:
            print(f"  - audit_remark 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN is_visible INTEGER DEFAULT 1"))
            print("  - 添加 is_visible 字段成功")
        except Exception as e:
            print(f"  - is_visible 字段可能已存在: {e}")
        
        try:
            db.execute(text("ALTER TABLE comment ADD COLUMN deleted_at INTEGER"))
            print("  - 添加 deleted_at 字段成功")
        except Exception as e:
            print(f"  - deleted_at 字段可能已存在: {e}")
        
        db.commit()
        print("\n数据库迁移完成！")
        
    except Exception as e:
        db.rollback()
        print(f"\n迁移失败: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    migrate_database()

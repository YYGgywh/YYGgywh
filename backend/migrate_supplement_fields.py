"""
 * @file            backend/migrate_supplement_fields.py
 * @description     添加补充信息相关字段的数据库迁移脚本
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-18 16:50:00
 * @lastModified    2026-03-18 16:50:00
 * Copyright © All rights reserved
"""

import sqlite3


def migrate():
    """执行数据库迁移，添加补充信息相关字段"""
    try:
        # 连接到 SQLite 数据库
        conn = sqlite3.connect('app/db/yyggywh.db')
        cursor = conn.cursor()
        
        # 添加 supplement_create_time 字段
        cursor.execute("ALTER TABLE pan_record ADD COLUMN supplement_create_time INTEGER")
        # 添加 supplement_update_time 字段
        cursor.execute("ALTER TABLE pan_record ADD COLUMN supplement_update_time INTEGER")
        # 添加 supplement_modify_count 字段，默认值为 0
        cursor.execute("ALTER TABLE pan_record ADD COLUMN supplement_modify_count INTEGER DEFAULT 0")
        
        # 提交事务
        conn.commit()
        print("数据库迁移成功：添加了补充信息相关字段")
        
    except Exception as e:
        print(f"数据库迁移失败：{e}")
    finally:
        # 关闭数据库连接
        if 'conn' in locals():
            conn.close()


if __name__ == "__main__":
    migrate()

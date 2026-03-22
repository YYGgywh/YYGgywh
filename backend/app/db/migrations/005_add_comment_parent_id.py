"""
 * @file            backend/app/db/migrations/005_add_comment_parent_id.py
 * @description     为 comment 表添加 parent_id 字段，支持评论回复功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 20:30:00
 * @lastModified    2026-03-21 20:30:00
 * Copyright © All rights reserved
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "db", "yyggywh.db")


def migrate():
    """为 comment 表添加 parent_id 字段"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 检查 parent_id 字段是否已存在
        cursor.execute("PRAGMA table_info(comment)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'parent_id' in column_names:
            print("字段 parent_id 已存在，跳过创建")
            # 检查索引是否存在
            cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_comment_parent'")
            if not cursor.fetchone():
                cursor.execute("CREATE INDEX idx_comment_parent ON comment(parent_id)")
                print("✅ 索引创建成功：idx_comment_parent")
            return
        
        # 添加 parent_id 字段
        cursor.execute("ALTER TABLE comment ADD COLUMN parent_id INTEGER REFERENCES comment(id)")
        
        # 创建索引
        cursor.execute("CREATE INDEX idx_comment_parent ON comment(parent_id)")
        
        conn.commit()
        print("✅ 迁移成功：comment 表已添加 parent_id 字段")
        print("   - 字段类型：INTEGER")
        print("   - 外键关联：comment.id")
        print("   - 索引：idx_comment_parent")
        print("   - 用途：支持评论回复功能")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ 迁移失败: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()

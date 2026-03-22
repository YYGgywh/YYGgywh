"""
 * @file            backend/app/db/migrations/006_add_comment_reply_to_user_id.py
 * @description     为 comment 表添加 reply_to_user_id 字段，支持二级回复
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-22 10:30:00
 * @lastModified    2026-03-22 10:30:00
 * Copyright © All rights reserved
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'db', 'yyggywh.db')

def migrate():
    """为 comment 表添加 reply_to_user_id 字段"""
    # 确保 instance 目录存在
    instance_dir = os.path.dirname(DB_PATH)
    if not os.path.exists(instance_dir):
        os.makedirs(instance_dir)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 检查 reply_to_user_id 字段是否已存在
        cursor.execute("PRAGMA table_info(comment)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'reply_to_user_id' in column_names:
            print("字段 reply_to_user_id 已存在，跳过创建")
            return
        
        # 添加 reply_to_user_id 字段
        cursor.execute("ALTER TABLE comment ADD COLUMN reply_to_user_id INTEGER REFERENCES user(id)")
        
        conn.commit()
        print("✅ 迁移成功：comment 表已添加 reply_to_user_id 字段")
    except Exception as e:
        conn.rollback()
        print(f"❌ 迁移失败: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

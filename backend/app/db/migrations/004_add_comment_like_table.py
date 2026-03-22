"""
 * @file            backend/app/db/migrations/004_add_comment_like_table.py
 * @description     创建评论点赞表
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 18:30:00
 * @lastModified    2026-03-21 18:30:00
 * Copyright © All rights reserved
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "db", "yyggywh.db")


def migrate():
    """创建评论点赞表"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 检查表是否已存在
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='comment_like'")
        if cursor.fetchone():
            print("表 comment_like 已存在，跳过创建")
            return
        
        # 创建评论点赞表
        cursor.execute("""
            CREATE TABLE comment_like (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                comment_id INTEGER NOT NULL,
                create_time INTEGER DEFAULT (CAST(strftime('%s', 'now') AS INTEGER)),
                FOREIGN KEY (user_id) REFERENCES user(id),
                FOREIGN KEY (comment_id) REFERENCES comment(id),
                UNIQUE(user_id, comment_id)
            )
        """)
        
        # 创建索引
        cursor.execute("CREATE INDEX idx_comment_like_user ON comment_like(user_id)")
        cursor.execute("CREATE INDEX idx_comment_like_comment ON comment_like(comment_id)")
        
        conn.commit()
        print("✅ 迁移成功：comment_like 表创建完成")
        print("   - 表结构：id, user_id, comment_id, create_time")
        print("   - 唯一约束：user_id + comment_id")
        print("   - 索引：idx_comment_like_user, idx_comment_like_comment")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ 迁移失败: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()

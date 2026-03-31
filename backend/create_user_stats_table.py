#!/usr/bin/env python3
# 直接创建 user_stats 表的脚本

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

# 创建用户统计表
create_table_sql = """
CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_likes INTEGER DEFAULT 0,
    comment_likes INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    follows INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    mutual_follows INTEGER DEFAULT 0,
    update_time INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    UNIQUE (user_id)
);
"""

# 创建索引
create_index_sql = """
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats (user_id);
"""

try:
    print("开始创建 user_stats 表...")
    with engine.connect() as conn:
        # 执行创建表的 SQL
        conn.execute(text(create_table_sql))
        print("  user_stats 表创建成功")
        
        # 执行创建索引的 SQL
        conn.execute(text(create_index_sql))
        print("  索引创建成功")
        
        # 提交事务
        conn.commit()
        print("  事务提交成功")
    
    print("\nuser_stats 表创建完成！")
    
except Exception as e:
    print(f"创建表时出错: {e}")
    sys.exit(1)

"""
数据库迁移：添加用户统计表
"""

from sqlalchemy import text


def upgrade():
    """执行数据库升级"""
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
    
    # 执行 SQL
    from app.db.database import engine
    with engine.connect() as conn:
        conn.execute(text(create_table_sql))
        conn.execute(text(create_index_sql))
        conn.commit()


def downgrade():
    """执行数据库回滚"""
    # 删除用户统计表
    drop_table_sql = """
    DROP TABLE IF EXISTS user_stats;
    """
    
    # 执行 SQL
    from app.db.database import engine
    with engine.connect() as conn:
        conn.execute(text(drop_table_sql))
        conn.commit()

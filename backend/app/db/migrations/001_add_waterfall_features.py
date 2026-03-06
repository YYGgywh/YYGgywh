"""
数据库迁移脚本：添加瀑布流功能相关表结构

@file            backend/app/db/migrations/001_add_waterfall_features.py
@description     数据库迁移脚本，用于添加瀑布流功能相关的表结构和字段
@author          Gordon <gordon_cao@qq.com>
@createTime      2026-03-05 12:55:00
@lastModified    2026-03-05 12:55:00
Copyright © All rights reserved
"""

import os
import sqlite3
import time

# 数据库文件路径
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "db", "yyggywh.db")


def backup_database():
    """备份数据库"""
    try:
        # 备份文件路径
        backup_path = f"{DB_PATH}.bak.{int(time.time())}"
        
        # 读取原数据库
        with open(DB_PATH, 'rb') as source:
            source_content = source.read()
        
        # 写入备份文件
        with open(backup_path, 'wb') as backup:
            backup.write(source_content)
        
        print(f"数据库备份成功: {backup_path}")
        return True
    except Exception as e:
        print(f"数据库备份失败: {e}")
        return False


def execute_sql(cursor, sql, params=None):
    """执行SQL语句"""
    try:
        if params:
            cursor.execute(sql, params)
        else:
            cursor.execute(sql)
        return True
    except Exception as e:
        print(f"执行SQL失败: {sql}\n错误: {e}")
        return False


def add_columns_to_pan_record(cursor):
    """为pan_record表添加新字段"""
    print("开始为pan_record表添加新字段...")
    
    # 检查并添加like_count字段
    try:
        sql = "ALTER TABLE pan_record ADD COLUMN like_count INTEGER DEFAULT 0"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("like_count字段已存在，跳过")
        else:
            return False
    
    # 检查并添加collect_count字段
    try:
        sql = "ALTER TABLE pan_record ADD COLUMN collect_count INTEGER DEFAULT 0"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("collect_count字段已存在，跳过")
        else:
            return False
    
    # 检查并添加view_count字段
    try:
        sql = "ALTER TABLE pan_record ADD COLUMN view_count INTEGER DEFAULT 0"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("view_count字段已存在，跳过")
        else:
            return False
    
    # 检查并添加comment_count字段
    try:
        sql = "ALTER TABLE pan_record ADD COLUMN comment_count INTEGER DEFAULT 0"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("comment_count字段已存在，跳过")
        else:
            return False
    
    # 检查并添加is_public字段
    try:
        sql = "ALTER TABLE pan_record ADD COLUMN is_public INTEGER DEFAULT 1"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("is_public字段已存在，跳过")
        else:
            return False
    
    print("pan_record表字段添加成功")
    return True


def add_columns_to_user(cursor):
    """为user表添加新字段"""
    print("开始为user表添加新字段...")
    
    # 检查并添加nickname字段
    try:
        sql = "ALTER TABLE user ADD COLUMN nickname VARCHAR(50)"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("nickname字段已存在，跳过")
        else:
            return False
    
    # 检查并添加avatar_url字段
    try:
        sql = "ALTER TABLE user ADD COLUMN avatar_url VARCHAR(255)"
        execute_sql(cursor, sql)
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("avatar_url字段已存在，跳过")
        else:
            return False
    
    print("user表字段添加成功")
    return True


def create_pan_like_table(cursor):
    """创建pan_like表"""
    print("开始创建pan_like表...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS pan_like (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pan_id INTEGER NOT NULL,
        create_time INTEGER DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, pan_id),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (pan_id) REFERENCES pan_record(id) ON DELETE CASCADE
    )
    """
    
    if not execute_sql(cursor, sql):
        return False
    
    # 创建索引
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_pan_like_user ON pan_like(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_pan_like_pan ON pan_like(pan_id)"
    ]
    
    for index_sql in indexes:
        if not execute_sql(cursor, index_sql):
            return False
    
    print("pan_like表创建成功")
    return True


def create_pan_collect_table(cursor):
    """创建pan_collect表"""
    print("开始创建pan_collect表...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS pan_collect (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pan_id INTEGER NOT NULL,
        create_time INTEGER DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, pan_id),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (pan_id) REFERENCES pan_record(id) ON DELETE CASCADE
    )
    """
    
    if not execute_sql(cursor, sql):
        return False
    
    # 创建索引
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_pan_collect_user ON pan_collect(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_pan_collect_pan ON pan_collect(pan_id)"
    ]
    
    for index_sql in indexes:
        if not execute_sql(cursor, index_sql):
            return False
    
    print("pan_collect表创建成功")
    return True


def create_indexes(cursor):
    """创建索引"""
    print("开始创建索引...")
    
    # pan_record表索引
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_pan_record_public ON pan_record(is_public, audit_status, is_visible, deleted_at)",
        "CREATE INDEX IF NOT EXISTS idx_pan_record_time ON pan_record(create_time DESC)",
        "CREATE INDEX IF NOT EXISTS idx_pan_record_hot ON pan_record(like_count DESC, create_time DESC)",
        "CREATE INDEX IF NOT EXISTS idx_pan_record_user ON pan_record(user_id, is_visible, deleted_at)"
    ]
    
    for index_sql in indexes:
        if not execute_sql(cursor, index_sql):
            return False
    
    print("索引创建成功")
    return True


def initialize_data(cursor):
    """初始化数据"""
    print("开始初始化数据...")
    
    # 为现有用户设置默认昵称
    sql = "UPDATE user SET nickname = login_name WHERE nickname IS NULL"
    if not execute_sql(cursor, sql):
        print("用户昵称初始化失败，但继续执行")
    
    # 为现有排盘记录设置is_public为1
    sql = "UPDATE pan_record SET is_public = 1 WHERE is_public IS NULL"
    if not execute_sql(cursor, sql):
        print("排盘记录is_public初始化失败，但继续执行")
    
    print("数据初始化完成")
    return True


def main():
    """主函数"""
    print("开始执行数据库迁移...")
    
    # 备份数据库
    if not backup_database():
        print("数据库备份失败，终止迁移")
        return
    
    # 连接数据库
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 执行迁移步骤
        steps = [
            add_columns_to_pan_record,
            add_columns_to_user,
            create_pan_like_table,
            create_pan_collect_table,
            create_indexes,
            initialize_data
        ]
        
        for step in steps:
            if not step(cursor):
                print(f"执行步骤 {step.__name__} 失败，回滚操作")
                conn.rollback()
                return
        
        # 提交事务
        conn.commit()
        print("数据库迁移成功完成！")
        
    except Exception as e:
        print(f"迁移过程中发生错误: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    main()

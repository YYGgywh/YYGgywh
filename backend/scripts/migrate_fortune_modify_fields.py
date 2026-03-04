"""
数据库迁移脚本：更新命理信息修改限制字段（各项独立）
创建时间：2026-03-04
"""

import sqlite3
import os

# 数据库路径
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'db', 'yyggywh.db')


def migrate():
    """执行数据库迁移"""
    print(f"开始迁移数据库: {DB_PATH}")
    
    # 连接数据库
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 检查字段是否已存在
        cursor.execute("PRAGMA table_info(user)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # 删除旧的统一字段
        if 'fortune_modify_count' in column_names:
            print("删除旧的 fortune_modify_count 字段...")
            cursor.execute("ALTER TABLE user DROP COLUMN fortune_modify_count")
            print("✓ fortune_modify_count 字段已删除")
        
        if 'fortune_modify_time' in column_names:
            print("删除旧的 fortune_modify_time 字段...")
            cursor.execute("ALTER TABLE user DROP COLUMN fortune_modify_time")
            print("✓ fortune_modify_time 字段已删除")
        
        # 添加新的独立字段
        new_fields = [
            ('name_modify_count', 'INTEGER DEFAULT 0'),
            ('name_modify_time', 'INTEGER DEFAULT 0'),
            ('gender_modify_count', 'INTEGER DEFAULT 0'),
            ('gender_modify_time', 'INTEGER DEFAULT 0'),
            ('birth_time_modify_count', 'INTEGER DEFAULT 0'),
            ('birth_time_modify_time', 'INTEGER DEFAULT 0'),
        ]
        
        for field_name, field_type in new_fields:
            if field_name not in column_names:
                print(f"添加 {field_name} 字段...")
                cursor.execute(f"ALTER TABLE user ADD COLUMN {field_name} {field_type}")
                print(f"✓ {field_name} 字段添加成功")
            else:
                print(f"✓ {field_name} 字段已存在，跳过")
        
        # 提交事务
        conn.commit()
        print("\n数据库迁移完成！")
        
    except Exception as e:
        print(f"迁移失败: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()

import sqlite3
import os
import time

# 获取数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

def migrate_database():
    """
    数据库迁移：添加昵称修改次数相关字段
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 检查字段是否已存在
        cursor.execute("PRAGMA table_info(user)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print(f"当前user表字段: {columns}")
        
        # 添加 nickname_modify_count 字段
        if 'nickname_modify_count' not in columns:
            print("正在添加 nickname_modify_count 字段...")
            cursor.execute("ALTER TABLE user ADD COLUMN nickname_modify_count INTEGER DEFAULT 0")
            print("nickname_modify_count 字段添加成功")
        
        # 添加 nickname_modify_time 字段
        if 'nickname_modify_time' not in columns:
            print("正在添加 nickname_modify_time 字段...")
            cursor.execute("ALTER TABLE user ADD COLUMN nickname_modify_time INTEGER DEFAULT 0")
            print("nickname_modify_time 字段添加成功")
        
        conn.commit()
        print("数据库迁移完成！")
        
        # 验证迁移结果
        print("\n验证迁移结果:")
        cursor.execute("PRAGMA table_info(user)")
        new_columns = [column[1] for column in cursor.fetchall()]
        print(f"新的user表字段: {new_columns}")
        
    except Exception as e:
        conn.rollback()
        print(f"迁移失败: {str(e)}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("开始创建敏感词相关表...")
    migrate_database()
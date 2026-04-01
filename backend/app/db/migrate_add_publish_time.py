# backend/app/db/migrate_add_publish_time.py 2026-03-31 18:00:00
# 功能：添加 publish_time 字段到 pan_record 表

import sqlite3
import os

# 数据库文件路径
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "yyggywh.db")

# 连接数据库
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 检查 publish_time 字段是否存在
try:
    cursor.execute("PRAGMA table_info(pan_record)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if "publish_time" not in columns:
        # 添加 publish_time 字段
        cursor.execute("ALTER TABLE pan_record ADD COLUMN publish_time INTEGER")
        print("成功添加 publish_time 字段到 pan_record 表")
    else:
        print("publish_time 字段已存在")
        
except Exception as e:
    print(f"执行出错: {e}")
finally:
    # 提交并关闭连接
    conn.commit()
    conn.close()

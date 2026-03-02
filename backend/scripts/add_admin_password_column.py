import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 检查字段是否已存在
cursor.execute("PRAGMA table_info(user)")
columns = [column[1] for column in cursor.fetchall()]

if 'admin_password' not in columns:
    print('添加 admin_password 字段')
    cursor.execute("ALTER TABLE user ADD COLUMN admin_password VARCHAR(255)")
    conn.commit()
else:
    print('admin_password 字段已存在')

conn.close()
print('操作完成')
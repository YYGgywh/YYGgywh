
import sqlite3
import os
import time

db_path = os.path.join(os.path.dirname(__file__), 'app', 'db', 'yyggywh.db')
journal_path = os.path.join(os.path.dirname(__file__), 'app', 'db', 'yyggywh.db-journal')

print(f"数据库路径: {db_path}")

try:
    print("1. 尝试直接访问数据库:")
    conn = sqlite3.connect(db_path, timeout=10)
    cursor = conn.cursor()
    
    # 检查数据库是否健康
    print("2. 检查数据库完整性:")
    cursor.execute("PRAGMA integrity_check")
    check_result = cursor.fetchone()
    print(f"   完整性检查: {check_result[0]}")
    
    # 尝试读取用户表
    print("3. 读取用户表数据:")
    cursor.execute("SELECT id, login_name, phone, role, status, login_count FROM user LIMIT 3")
    users = cursor.fetchall()
    for user in users:
        print(f"   ID: {user[0]}, 登录名: {user[1]}, 手机号: {user[2]}, 角色: {user[3]}, 状态: {user[4]}, 登录次数: {user[5]}")
    
    # 修复锁定问题 - 尝试执行简单的更新
    print("4. 尝试修复锁定:")
    cursor.execute("UPDATE user SET login_count = login_count WHERE id = 8")
    conn.commit()
    print("   锁定修复成功")
    
    # 检查锁定修复后的数据
    cursor.execute("SELECT login_count FROM user WHERE id = 8")
    count = cursor.fetchone()[0]
    print(f"   超级管理员登录次数: {count}")
    
    print("\n✅ 数据库修复完成！")
    
except Exception as e:
    print(f"\n❌ 数据库访问错误: {e}")
    import traceback
    print("Stack trace:")
    traceback.print_exc()
finally:
    try:
        conn.close()
    except:
        pass

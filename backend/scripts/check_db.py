#!/usr/bin/env python3
# 检查用户表字段和更新超级管理员

import sqlite3
import os
from app.utils.password import hash_password

# 数据库路径
db_path = os.path.join(os.path.dirname(__file__), 'app', 'db', 'yyggywh.db')

print(f'数据库路径: {db_path}\n')

conn = sqlite3.connect(db_path, timeout=10)
cursor = conn.cursor()

try:
    # 查找超级管理员
    cursor.execute('SELECT id, phone, login_name, nickname, password, role, status, deleted_at FROM user WHERE role = 99')
    admins = cursor.fetchall()
    
    print(f'找到 {len(admins)} 个超级管理员:')
    print('='*80)
    
    for admin in admins:
        print(f'  ID: {admin[0]}')
        print(f'  手机号: {admin[1]}')
        print(f'  登录名: {admin[2]}')
        print(f'  昵称: {admin[3]}')
        print(f'  状态: {admin[5]}')
        print(f'  删除时间: {admin[7]}')
        print('-'*80)
    
    if admins:
        admin_id = admins[0][0]
        new_password = hash_password('Admin@778825')
        
        print(f'\n正在更新超级管理员 ID: {admin_id}...')
        
        cursor.execute('''
            UPDATE user 
            SET phone = ?, login_name = ?, password = ?, nickname = ?, deleted_at = NULL, status = 1 
            WHERE id = ?
        ''', ('18006612925', 'Admin', new_password, '系统管理员', admin_id))
        
        conn.commit()
        
        print('\n✅ 超级管理员更新成功！')
        print('='*80)
        print('登录信息:')
        print('  - 登录名: Admin')
        print('  - 手机号: 18006612925')
        print('  - 密码: Admin@778825')
        print('='*80)
    else:
        print('⚠️ 未找到超级管理员')
        
except Exception as e:
    print(f'\n错误: {e}')
    conn.rollback()
    import traceback
    traceback.print_exc()
finally:
    conn.close()
import sqlite3
import os
from app.utils.password import verify_password

# 获取数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

# 连接数据库
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 查询所有用户信息
cursor.execute('SELECT id, phone, login_name, role, password, admin_password FROM user')
users = cursor.fetchall()
print('=== 数据库用户信息 ===')
print('ID | 手机号 | 登录名 | 角色 | 密码 | 后台密码')
print('-' * 70)
for user in users:
    print(f'{user[0]} | {user[1]} | {user[2]} | {user[3]} | {user[4]} | {user[5]}')

# 查询角色99的超级管理员
print('\n=== 超级管理员信息 ===')
cursor.execute('SELECT id, phone, login_name, role, password, admin_password FROM user WHERE role = 99')
admin = cursor.fetchone()
if admin:
    print(f'ID: {admin[0]}')
    print(f'手机号: {admin[1]}')
    print(f'登录名: {admin[2]}')
    print(f'角色: {admin[3]}')
    print(f'密码: {admin[4]}')
    print(f'后台密码: {admin[5]}')
    
    # 测试密码验证
    test_passwords = ['Admin@778825', 'Admin778825', 'Admin@7788251', 'Admin']
    print(f'\n密码验证:')
    for pwd in test_passwords:
        password_match = verify_password(pwd, admin[4])
        admin_password_match = verify_password(pwd, admin[5]) if admin[5] else False
        print(f'{pwd}:')
        print(f'  前台密码匹配: {password_match}')
        print(f'  后台密码匹配: {admin_password_match}')
else:
    print('未找到超级管理员账户')

conn.close()
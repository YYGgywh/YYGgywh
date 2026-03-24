"""
 * @file            add_users.py
 * @description     添加测试用户到数据库
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-24 11:45:00
 * @lastModified    2026-03-24 12:24:59
 * Copyright © All rights reserved
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.db.database import SessionLocal
from backend.app.models.user import User
from backend.app.utils.password import hash_password
import time

def add_test_users():
    db = SessionLocal()
    
    # 检查是否已经有用户
    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"数据库中已有 {existing_users} 个用户，是否继续添加新用户？(y/n)")
        response = input().lower()
        if response != 'y' and response != 'yes':
            print("操作已取消")
            db.close()
            return
    
    # 创建测试用户
    test_users = [
        {
            "phone": "13800138000",
            "login_name": "testuser1",
            "nickname": "测试用户1",
            "password": "123456"
        },
        {
            "phone": "13800138001",
            "login_name": "testuser2",
            "nickname": "测试用户2",
            "password": "123456"
        },
        {
            "phone": "13800138002",
            "login_name": "testuser3",
            "nickname": "测试用户3",
            "password": "123456"
        }
    ]
    
    for user_data in test_users:
        # 检查手机号是否已存在
        existing_user = db.query(User).filter(User.phone == user_data["phone"]).first()
        if existing_user:
            print(f"用户 {user_data['phone']} 已存在，跳过")
            continue
        
        # 创建新用户
        new_user = User(
            phone=user_data["phone"],
            login_name=user_data["login_name"],
            nickname=user_data["nickname"],
            password=hash_password(user_data["password"]),  # 使用项目中的密码哈希函数
            avatar="",
            gender=1,
            status=1
            # 不设置create_time，让它使用默认值
        )
        
        db.add(new_user)
        print(f"添加用户: {user_data['nickname']} ({user_data['phone']})")
    
    db.commit()
    print("用户添加完成")
    db.close()

if __name__ == "__main__":
    add_test_users()

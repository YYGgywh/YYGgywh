# backend/app/db/init_super_admin.py 2026-03-01 10:00:00
# 功能：初始化超级管理员账户

import sys
import os
import getpass
import time

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal
from app.models.user import User
from app.utils.password import hash_password


def init_super_admin():
    print("=" * 60)
    print("创建超级管理员账户")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        # 检查是否已存在超级管理员
        existing_admin = db.query(User).filter(User.role == 99).first()
        if existing_admin:
            print(f"\n超级管理员已存在：{existing_admin.nickname or existing_admin.phone}")
            print("如需重置密码，请使用其他方式。")
            return
        
        # 获取用户输入
        print("\n请输入超级管理员信息：")
        
        while True:
            phone = input("手机号: ").strip()
            if len(phone) == 11 and phone.isdigit():
                break
            print("手机号格式不正确，请重新输入！")
        
        while True:
            password = getpass.getpass("密码（至少6位）: ")
            if len(password) >= 6:
                break
            print("密码至少需要6位，请重新输入！")
        
        confirm_password = getpass.getpass("确认密码: ")
        if password != confirm_password:
            print("两次输入的密码不一致！")
            return
        
        nickname = input("昵称（可选，回车跳过）: ").strip() or "超级管理员"
        
        # 创建超级管理员
        print("\n正在创建超级管理员...")
        
        super_admin = User(
            phone=phone,
            nickname=nickname,
            password=hash_password(password),
            role=99,
            status=1,
            is_active=True,
            create_time=int(time.time()),
            update_time=int(time.time())
        )
        
        db.add(super_admin)
        db.commit()
        db.refresh(super_admin)
        
        print(f"\n✓ 超级管理员创建成功！")
        print(f"  ID: {super_admin.id}")
        print(f"  手机号: {super_admin.phone}")
        print(f"  昵称: {super_admin.nickname}")
        print(f"  角色: 超级管理员 (role=99)")
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ 创建失败: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    init_super_admin()

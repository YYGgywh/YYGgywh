# backend/app/db/update_super_admin.py 2026-03-01 10:00:00
# 功能：更新超级管理员账户信息

import sys
import os
import time

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal
from app.models.user import User
from app.utils.password import hash_password


def update_super_admin():
    print("=" * 60)
    print("更新超级管理员账户")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        # 查找超级管理员
        super_admin = db.query(User).filter(User.role == 99).first()
        if not super_admin:
            print("\n未找到超级管理员账户！")
            return
        
        print(f"\n找到超级管理员账户：{super_admin.nickname or super_admin.phone}")
        
        # 更新信息
        print("\n正在更新超级管理员信息...")
        
        super_admin.phone = "18006612925"
        super_admin.login_name = "Admin"
        super_admin.password = hash_password("Admin@778825")
        super_admin.nickname = "系统管理员"
        super_admin.update_time = int(time.time())
        
        db.commit()
        db.refresh(super_admin)
        
        print(f"\n✓ 超级管理员更新成功！")
        print(f"  ID: {super_admin.id}")
        print(f"  手机号: {super_admin.phone}")
        print(f"  登录名: {super_admin.login_name}")
        print(f"  昵称: {super_admin.nickname}")
        print(f"  密码: Admin@778825")
        print(f"  角色: 超级管理员 (role=99)")
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ 更新失败: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    update_super_admin()

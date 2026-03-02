
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.user import User
from app.utils.password import verify_password
from app.utils.token import create_access_token

# 测试超级管理员登录逻辑
db = SessionLocal()

try:
    print("=== 测试超级管理员登录 ===\n")
    
    # 测试1：查找用户
    print("1. 查找超级管理员用户:")
    username = 'Admin'
    user = db.query(User).filter(
        User.login_name == username,
        User.deleted_at.is_(None)
    ).first()
    
    if not user:
        print(f"❌ 未找到登录名: {username} 的用户")
        
        # 尝试使用手机号
        print("\n2. 尝试使用手机号查找:")
        phone = '18006612925'
        user = db.query(User).filter(
            User.phone == phone,
            User.deleted_at.is_(None)
        ).first()
        
        if not user:
            print(f"❌ 未找到手机号: {phone} 的用户")
            
            # 打印所有用户信息
            print("\n所有用户信息:")
            users = db.query(User).all()
            for u in users:
                print(f"ID: {u.id}, 手机号: {u.phone}, 登录名: {u.login_name}, 昵称: {u.nickname}, 角色: {u.role}, 状态: {u.status}, 删除时间: {u.deleted_at}")
                
            sys.exit(1)
        else:
            print(f"✅ 找到用户: 手机号 = {user.phone}, 登录名 = {user.login_name}, 昵称 = {user.nickname}")
    
    else:
        print(f"✅ 找到用户: 手机号 = {user.phone}, 登录名 = {user.login_name}, 昵称 = {user.nickname}")
    
    # 测试2：验证密码
    print("\n3. 验证密码:")
    password = 'Admin@778825'
    is_valid = verify_password(password, user.password)
    print(f"密码验证 (Admin@778825): {'✅ 正确' if is_valid else '❌ 错误'}")
    
    # 测试3：检查角色
    print(f"\n4. 角色检查:")
    print(f"当前用户角色: {user.role}")
    if user.role < 1:
        print("❌ 非管理员用户")
        sys.exit(1)
    else:
        print(f"✅ 管理员角色 (role >= 1)")
    
    # 测试4：检查状态
    print(f"\n5. 状态检查:")
    print(f"当前状态: {user.status}")
    if user.status != 1:
        print("❌ 用户状态不正常")
        sys.exit(1)
    else:
        print("✅ 用户状态正常")
    
    # 测试5：创建Token
    print("\n6. 创建访问Token:")
    token_data = {
        "user_id": user.id,
        "phone": user.phone,
        "role": user.role
    }
    
    try:
        token = create_access_token(token_data)
        print("✅ Token 创建成功")
        print(f"Token长度: {len(token)}字符")
    except Exception as e:
        print(f"❌ Token创建失败: {e}")
        import traceback
        print("Stack trace:")
        traceback.print_exc()
    
    # 测试6：更新登录信息
    print("\n7. 更新登录统计信息:")
    import time
    user.last_login_time = int(time.time())
    user.login_count = (user.login_count or 0) + 1
    db.commit()
    print("✅ 登录信息更新成功")
    
    print(f"\n=== 测试成功 ===\n")
    print("用户信息:")
    print(f"  ID: {user.id}")
    print(f"  手机号: {user.phone}")
    print(f"  登录名: {user.login_name}")
    print(f"  昵称: {user.nickname}")
    print(f"  角色: {user.role}")
    print(f"  状态: {user.status}")
    print(f"  登录次数: {user.login_count}")
    print(f"  最后登录: {user.last_login_time}")
    
except Exception as e:
    print(f"\n❌ 测试过程中出错: {e}")
    import traceback
    print("\n详细错误堆栈:")
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

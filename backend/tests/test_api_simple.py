#!/usr/bin/env python3
"""
简单测试API是否正常工作
"""

import sys
import os
import requests
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.password import hash_password
from app.utils.token import create_access_token
from app.db.database import SessionLocal
from app.models.user import User


def test_admin_login():
    """测试管理员登录"""
    
    db = SessionLocal()
    
    # 检查是否已存在测试用户
    existing_user = db.query(User).filter(User.phone == '13905730010').first()
    if not existing_user:
        existing_user = User(
            phone="13905730010",
            password=hash_password("admin123"),
            nickname="测试管理员",
            login_name="admin_test",
            status=1,
            role=1  # 管理员
        )
        db.add(existing_user)
        db.commit()
        db.refresh(existing_user)
    
    # 创建管理员token，使用is_admin参数
    admin_token = create_access_token(
        {"user_id": existing_user.id, "login_name": existing_user.login_name},
        is_admin=True
    )
    
    print(f"生成的token: {admin_token}")
    
    # 解码token检查内容
    from app.utils.token import decode_access_token
    decoded = decode_access_token(admin_token)
    print(f"解码内容: {decoded}")
    
    # 测试获取排盘记录API
    api_url = "http://localhost:8000/api/v1/admin/pan-records"
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }
    
    try:
        response = requests.get(api_url, headers=headers, verify=False)
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            print("✅ 管理员API访问成功")
            data = response.json()
            print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ API访问失败，状态码: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求发送失败: {e}")


def test_pan_records_api():
    """测试排盘记录相关API"""
    
    api_url = "http://localhost:8000/api/v1/admin/pan-records/deleted"
    
    db = SessionLocal()
    
    # 检查是否已存在测试用户
    existing_user = db.query(User).filter(User.phone == '13905730010').first()
    if not existing_user:
        existing_user = User(
            phone="13905730010",
            password=hash_password("admin123"),
            nickname="测试管理员",
            login_name="admin_test",
            status=1,
            role=1  # 管理员
        )
        db.add(existing_user)
        db.commit()
        db.refresh(existing_user)
    
    # 创建管理员token
    admin_token = create_access_token(
        {"user_id": existing_user.id, "login_name": existing_user.login_name},
        is_admin=True
    )
    
    # 测试获取已删除排盘记录
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }
    
    try:
        response = requests.get(api_url, headers=headers, verify=False)
        
        print(f"获取已删除排盘记录响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ 获取已删除排盘记录失败，状态码: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求发送失败: {e}")


if __name__ == "__main__":
    print("=== 测试API访问 ===")
    test_admin_login()
    
    print("\n=== 测试排盘记录API ===")
    test_pan_records_api()
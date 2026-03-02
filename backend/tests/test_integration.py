#!/usr/bin/env python3
# 集成测试：测试完整的用户注册登录流程

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
print("开始集成测试...")

# 测试1: 注册新用户
try:
    print("\n1. 测试用户注册")
    # 生成随机手机号
    import random
    phone = f"138{random.randint(1000, 9999)}{random.randint(1000, 9999)}"
    
    # 发送验证码
    print(f"  发送验证码到手机号: {phone}")
    response = requests.post(f"{BASE_URL}/user/send_code", json={"phone": phone})
    print(f"  发送验证码响应: {response.status_code} - {response.json()}")
    
    # 注册（验证码使用123456作为测试）
    register_data = {
        "phone": phone,
        "login_name": f"test_user_{random.randint(1000, 9999)}",
        "code": "123456",
        "password": "12345678"
    }
    print(f"  注册用户: {register_data['login_name']}")
    response = requests.post(f"{BASE_URL}/user/register", json=register_data)
    print(f"  注册响应: {response.status_code} - {response.json()}")
    
    if response.status_code == 200:
        print("✅ 用户注册成功")
    else:
        print("❌ 用户注册失败")
        
except Exception as e:
    print(f"❌ 注册测试失败: {str(e)}")

# 测试2: 用户登录
try:
    print("\n2. 测试用户登录")
    login_data = {
        "phone": phone,  # 使用上面注册的手机号
        "password": "12345678"
    }
    response = requests.post(f"{BASE_URL}/user/login", json=login_data)
    print(f"  登录响应: {response.status_code}")
    if response.status_code == 200:
        login_result = response.json()
        print(f"  登录成功，获取到token: {login_result['data']['token'][:20]}...")
        print(f"  用户信息: {login_result['data']['login_name']}")
        print("✅ 用户登录成功")
    else:
        print(f"❌ 用户登录失败: {response.json()}")
        
except Exception as e:
    print(f"❌ 登录测试失败: {str(e)}")

print("\n集成测试完成！")
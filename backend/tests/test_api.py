#!/usr/bin/env python3
# 测试API功能

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

print("开始API功能测试...")

# 测试1: 发送验证码
try:
    print("\n1. 测试发送验证码")
    response = requests.post(f"{BASE_URL}/user/send_code", json={"phone": "13800138000"})
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    if response.status_code == 200:
        print("✅ 发送验证码成功")
    else:
        print("❌ 发送验证码失败")
except Exception as e:
    print(f"❌ 发送验证码测试失败: {str(e)}")

# 测试2: 发送邮箱验证码
try:
    print("\n2. 测试发送邮箱验证码")
    response = requests.post(f"{BASE_URL}/user/send_email_code", json={"email": "test@example.com"})
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    if response.status_code == 200:
        print("✅ 发送邮箱验证码成功")
    else:
        print("❌ 发送邮箱验证码失败")
except Exception as e:
    print(f"❌ 发送邮箱验证码测试失败: {str(e)}")

# 测试3: 测试健康检查
try:
    print("\n3. 测试健康检查")
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    if response.status_code == 200:
        print("✅ 健康检查成功")
    else:
        print("❌ 健康检查失败")
except Exception as e:
    print(f"❌ 健康检查测试失败: {str(e)}")

print("\nAPI功能测试完成！")
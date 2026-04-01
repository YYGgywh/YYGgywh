#!/usr/bin/env python3
# 测试头像上传功能

import requests
import base64
import json

# 测试配置
BASE_URL = "http://localhost:8000/api/v1"
TEST_PHONE = "13800138000"
TEST_PASSWORD = "password123"

# 先登录获取token
def login():
    print("正在登录...")
    response = requests.post(
        f"{BASE_URL}/user/login",
        json={"phone": TEST_PHONE, "password": TEST_PASSWORD}
    )
    print(f"登录响应: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"登录成功，token: {data['data']['token'][:20]}...")
        return data['data']['token']
    else:
        print(f"登录失败: {response.text}")
        return None

# 测试头像上传
def test_avatar_upload(token):
    print("\n正在测试头像上传...")
    # 创建一个简单的测试图片
    test_image = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    )
    
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": ("test_avatar.png", test_image, "image/png")}
    
    response = requests.post(
        f"{BASE_URL}/user/upload_avatar",
        headers=headers,
        files=files
    )
    
    print(f"头像上传响应: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"上传成功！")
        print(f"头像URL: {data['data']['avatar']}")
        
        # 检查URL是否使用了正确的生产环境地址
        if "115.191.48.226" in data['data']['avatar']:
            print("✅ 头像URL使用了正确的生产环境地址")
        else:
            print("❌ 头像URL未使用正确的生产环境地址")
    else:
        print(f"上传失败: {response.text}")

if __name__ == "__main__":
    token = login()
    if token:
        test_avatar_upload(token)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# backend/test_api_demo.py 2026-02-28 20:00:00
# 功能：演示用户API新增功能的测试脚本

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 测试数据
TEST_PHONE = '13800138000'
TEST_PASSWORD = 'Test@123456'

print('=== 测试登录功能 ===')
login_response = client.post('/api/v1/user/login', json={
    'phone': TEST_PHONE,
    'password': TEST_PASSWORD
})
print(f'状态码: {login_response.status_code}')
print(f'响应内容: {login_response.json()}')
if login_response.status_code == 200:
    token = login_response.json()['data']['token']
    print(f'登录成功，获取到token: {token}')
    
    print('\n=== 测试更新用户信息 ===')
    update_response = client.post('/api/v1/user/update_user_info', headers={
        'Authorization': f'Bearer {token}'
    }, json={
        'nickname': '新测试用户',
        'email': 'newtest@example.com',
        'gender': 1
    })
    print(f'状态码: {update_response.status_code}')
    print(f'响应内容: {update_response.json()}')
    
    print('\n=== 测试头像上传 ===')
    # 准备测试图片文件
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
    
    avatar_response = client.post('/api/v1/user/upload_avatar', headers={
        'Authorization': f'Bearer {token}'
    }, files={
        'file': ('test_avatar.png', test_image_data, 'image/png')
    })
    print(f'状态码: {avatar_response.status_code}')
    print(f'响应内容: {avatar_response.json()}')

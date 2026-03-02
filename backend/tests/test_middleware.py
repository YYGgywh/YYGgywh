# backend/tests/test_middleware.py 2026-02-27 10:00:00
# 功能：测试中间件功能

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """测试健康检查接口"""
    print("测试健康检查接口...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_rate_limit():
    """测试频率限制中间件"""
    print("测试频率限制中间件...")
    for i in range(3):
        response = requests.post(
            f"{BASE_URL}/api/v1/user/send_code",
            json={"phone": "13800138000"}
        )
        print(f"第{i+1}次请求 - 状态码: {response.status_code}")
        print(f"响应: {response.json()}")
    print()

def test_sql_injection():
    """测试SQL注入防护中间件"""
    print("测试SQL注入防护中间件...")
    response = requests.post(
        f"{BASE_URL}/api/v1/user/register",
        json={
            "phone": "13800138000",
            "code": "123456",
            "password": "password123' OR '1'='1"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_xss():
    """测试XSS防护中间件"""
    print("测试XSS防护中间件...")
    response = requests.post(
        f"{BASE_URL}/api/v1/user/register",
        json={
            "phone": "13800138000",
            "code": "123456",
            "password": "<script>alert('xss')</script>"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_register():
    """测试注册接口"""
    print("测试注册接口...")
    response = requests.post(
        f"{BASE_URL}/api/v1/user/register",
        json={
            "phone": "13800138000",
            "code": "123456",
            "password": "password123"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_login():
    """测试登录接口"""
    print("测试登录接口...")
    response = requests.post(
        f"{BASE_URL}/api/v1/user/login",
        json={
            "phone": "13800138000",
            "password": "password123"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    if response.status_code == 200:
        token = response.json()["data"]["token"]
        print(f"Token: {token}")
        return token
    else:
        return None

def test_save_pan(token):
    """测试保存排盘记录接口（需要Token）"""
    print("测试保存排盘记录接口...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/api/v1/pan/save",
        headers=headers,
        json={
            "pan_type": "liuyao",
            "pan_params": json.dumps({"question": "测试问题", "time": "2026-02-27 10:00:00"}),
            "pan_result": json.dumps({"gua": "乾卦", "yao": "初九"}),
            "supplement": "补充说明"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_list_pan(token):
    """测试获取排盘列表接口（需要Token）"""
    print("测试获取排盘列表接口...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/api/v1/pan/list",
        headers=headers,
        params={"pan_type": "liuyao", "page": 1, "size": 10}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

if __name__ == "__main__":
    print("=" * 50)
    print("开始测试中间件功能")
    print("=" * 50)
    print()
    
    # 测试健康检查
    test_health_check()
    
    # 测试频率限制
    test_rate_limit()
    
    # 测试SQL注入防护
    test_sql_injection()
    
    # 测试XSS防护
    test_xss()
    
    # 测试注册
    test_register()
    
    # 测试登录
    token = test_login()
    
    if token:
        # 测试保存排盘记录
        test_save_pan(token)
        
        # 测试获取排盘列表
        test_list_pan(token)
    
    print("=" * 50)
    print("测试完成")
    print("=" * 50)

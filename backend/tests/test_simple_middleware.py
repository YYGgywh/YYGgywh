# backend/tests/test_simple_middleware.py 2026-02-27 10:00:00
# 功能：简单测试中间件功能

import requests

BASE_URL = "http://localhost:8000"

def test_health_check():
    """测试健康检查接口"""
    print("测试健康检查接口...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_send_code():
    """测试发送验证码接口"""
    print("测试发送验证码接口...")
    response = requests.post(
        f"{BASE_URL}/api/v1/user/send_code",
        json={"phone": "13800138000"}
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
    
    # 测试发送验证码
    test_send_code()
    
    print("=" * 50)
    print("测试完成")
    print("=" * 50)

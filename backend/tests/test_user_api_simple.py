# backend/tests/test_user_api_simple.py 2026-02-26 18:15:00
# 功能：测试用户相关接口（简单版本）

import requests
import threading
import time
from main import app
import uvicorn

# 测试手机号
TEST_PHONE = "13800138000"
TEST_PASSWORD = "Test123456"
BASE_URL = "http://localhost:8000/api/v1"

# 启动服务器的函数
def start_server():
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="error")

# 等待服务器启动
def wait_for_server():
    for i in range(10):
        try:
            response = requests.get("http://localhost:8000/")
            if response.status_code == 200:
                return True
        except:
            pass
        time.sleep(1)
    return False

def test_send_code():
    """测试发送验证码接口"""
    url = f"{BASE_URL}/user/send_code"
    data = {"phone": TEST_PHONE}
    response = requests.post(url, json=data)
    print(f"发送验证码响应: {response.json()}")
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "验证码发送成功"
    print("测试发送验证码接口通过!")

def test_register():
    """测试注册接口"""
    # 先发送验证码
    test_send_code()
    
    # 注册（使用验证码 123456，实际测试时需要从控制台获取真实验证码）
    url = f"{BASE_URL}/user/register"
    data = {
        "phone": TEST_PHONE,
        "code": "123456",  # 这里需要手动修改为控制台输出的验证码
        "password": TEST_PASSWORD
    }
    response = requests.post(url, json=data)
    print(f"注册响应: {response.json()}")
    # 可能已经注册过，所以允许400错误
    if response.status_code == 400 and "手机号已注册" in response.json().get("detail", ""):
        print("手机号已注册，测试通过!")
    else:
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["msg"] == "注册成功"
        assert "user_id" in response.json()["data"]
        print("测试注册接口通过!")

def test_login_with_password():
    """测试密码登录接口"""
    url = f"{BASE_URL}/user/login"
    data = {
        "phone": TEST_PHONE,
        "password": TEST_PASSWORD
    }
    response = requests.post(url, json=data)
    print(f"密码登录响应: {response.json()}")
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "登录成功"
    assert "token" in response.json()["data"]
    assert "user_id" in response.json()["data"]
    assert "phone" in response.json()["data"]
    print("测试密码登录接口通过!")

if __name__ == "__main__":
    # 启动服务器
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # 等待服务器启动
    if wait_for_server():
        print("服务器启动成功!")
        
        # 运行测试
        try:
            test_send_code()
            test_register()
            test_login_with_password()
            print("所有用户接口测试完成!")
        except Exception as e:
            print(f"测试失败: {e}")
    else:
        print("服务器启动失败!")

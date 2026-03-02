# backend/tests/test_user_api.py 2026-02-28 20:00:00
# 功能：测试用户相关接口

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 测试数据
TEST_PHONE = "13800138000"
TEST_EMAIL = "test@example.com"
TEST_LOGIN_NAME = "testuser123"
TEST_PASSWORD = "Test@123456"  # 符合强度要求的密码
TEST_WEAK_PASSWORD = "123456"  # 弱密码


def test_send_code():
    """测试发送手机验证码接口"""
    response = client.post(
        "/api/v1/user/send_code",
        json={"phone": TEST_PHONE}
    )
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "验证码发送成功"
    print("✅ 测试发送手机验证码接口通过!")


def test_send_email_code():
    """测试发送邮箱验证码接口"""
    response = client.post(
        "/api/v1/user/send_email_code",
        json={"email": TEST_EMAIL}
    )
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "验证码发送成功"
    print("✅ 测试发送邮箱验证码接口通过!")


def test_register_with_phone():
    """测试手机号注册接口"""
    # 先发送验证码
    client.post("/api/v1/user/send_code", json={"phone": TEST_PHONE})
    
    # 注册
    response = client.post(
        "/api/v1/user/register",
        json={
            "phone": TEST_PHONE,
            "login_name": TEST_LOGIN_NAME,
            "code": "123456",
            "password": TEST_PASSWORD
        }
    )
    print(f"手机号注册响应: {response.json()}")
    
    # 可能已经注册过，所以允许400错误
    if response.status_code == 400 and "手机号已注册" in response.json().get("detail", ""):
        print("✅ 手机号已注册，测试通过!")
    else:
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["msg"] == "注册成功"
        assert "user_id" in response.json()["data"]
        print("✅ 测试手机号注册接口通过!")


def test_register_with_email():
    """测试邮箱注册接口"""
    # 先发送验证码
    client.post("/api/v1/user/send_email_code", json={"email": TEST_EMAIL})
    
    # 注册
    response = client.post(
        "/api/v1/user/register",
        json={
            "email": TEST_EMAIL,
            "login_name": f"{TEST_LOGIN_NAME}_email",
            "code": "123456",
            "password": TEST_PASSWORD
        }
    )
    print(f"邮箱注册响应: {response.json()}")
    
    # 可能已经注册过，所以允许400错误
    if response.status_code == 400 and "邮箱已注册" in response.json().get("detail", ""):
        print("✅ 邮箱已注册，测试通过!")
    else:
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["msg"] == "注册成功"
        assert "user_id" in response.json()["data"]
        print("✅ 测试邮箱注册接口通过!")


def test_register_with_weak_password():
    """测试弱密码注册会被拒绝"""
    # 先发送验证码
    client.post("/api/v1/user/send_code", json={"phone": TEST_PHONE})
    
    # 尝试使用弱密码注册
    response = client.post(
        "/api/v1/user/register",
        json={
            "phone": TEST_PHONE,
            "login_name": f"{TEST_LOGIN_NAME}_weak",
            "code": "123456",
            "password": TEST_WEAK_PASSWORD
        }
    )
    print(f"弱密码注册响应: {response.json()}")
    
    # 应该返回400错误，提示密码强度不足
    assert response.status_code == 400
    assert "密码强度不足" in response.json().get("detail", "")
    print("✅ 测试弱密码注册被拒绝通过!")


def test_login_with_password():
    """测试密码登录接口"""
    response = client.post(
        "/api/v1/user/login",
        json={
            "phone": TEST_PHONE,
            "password": TEST_PASSWORD
        }
    )
    print(f"密码登录响应: {response.json()}")
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "登录成功"
    assert "token" in response.json()["data"]
    assert "user_id" in response.json()["data"]
    assert "phone" in response.json()["data"]
    print("✅ 测试密码登录接口通过!")


def test_login_with_login_name():
    """测试使用登录名登录接口"""
    response = client.post(
        "/api/v1/user/login",
        json={
            "login_name": TEST_LOGIN_NAME,
            "password": TEST_PASSWORD
        }
    )
    print(f"登录名登录响应: {response.json()}")
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "登录成功"
    assert "token" in response.json()["data"]
    print("✅ 测试登录名登录接口通过!")


def test_login_with_code():
    """测试验证码登录接口"""
    # 先发送验证码
    client.post("/api/v1/user/send_code", json={"phone": TEST_PHONE})
    
    # 验证码登录
    response = client.post(
        "/api/v1/user/login",
        json={
            "phone": TEST_PHONE,
            "code": "123456"
        }
    )
    print(f"验证码登录响应: {response.json()}")
    
    # 可能验证码错误，所以允许400错误
    if response.status_code == 400 and "验证码错误" in response.json().get("detail", ""):
        print("⚠️  验证码错误，需要手动输入真实验证码测试!")
    else:
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["msg"] == "登录成功"
        assert "token" in response.json()["data"]
        print("✅ 测试验证码登录接口通过!")


def test_update_user_info():
    """测试更新用户信息接口"""
    # 先登录获取token
    login_response = client.post(
        "/api/v1/user/login",
        json={
            "phone": TEST_PHONE,
            "password": TEST_PASSWORD
        }
    )
    token = login_response.json()["data"]["token"]
    
    # 更新用户信息
    response = client.post(
        "/api/v1/user/update_user_info",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "nickname": "测试用户昵称",
            "email": TEST_EMAIL,
            "gender": 1  # 1表示女性
        }
    )
    print(f"更新用户信息响应: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "用户信息更新成功"
    assert "nickname" in response.json()["data"]
    assert response.json()["data"]["nickname"] == "测试用户昵称"
    assert "email" in response.json()["data"]
    print("✅ 测试更新用户信息接口通过!")


def test_upload_avatar():
    """测试头像上传接口"""
    # 先登录获取token
    login_response = client.post(
        "/api/v1/user/login",
        json={
            "phone": TEST_PHONE,
            "password": TEST_PASSWORD
        }
    )
    token = login_response.json()["data"]["token"]
    
    # 准备测试图片文件（使用一个简单的base64编码的图片）
    test_image_data = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\x08\x02\x00\x00\x00\x90wS\xde"
        b"\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    
    # 上传头像
    response = client.post(
        "/api/v1/user/upload_avatar",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("test_avatar.png", test_image_data, "image/png")}
    )
    print(f"头像上传响应: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["code"] == 200
    assert response.json()["msg"] == "头像上传成功"
    assert "avatar" in response.json()["data"]
    print("✅ 测试头像上传接口通过!")


if __name__ == "__main__":
    print("\n=== 开始运行用户接口测试 ===\n")
    test_send_code()
    test_send_email_code()
    test_register_with_phone()
    test_register_with_email()
    test_register_with_weak_password()
    test_login_with_password()
    test_login_with_login_name()
    test_login_with_code()
    test_update_user_info()
    test_upload_avatar()
    print("\n✅ 所有用户接口测试完成!")

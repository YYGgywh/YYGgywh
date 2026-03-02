# backend/test_utils.py 2026-02-26 17:20:00
# 功能：测试工具类功能

from app.utils.password import hash_password, verify_password
from app.utils.token import create_access_token, decode_access_token
from app.utils.verify_code import generate_verify_code, verify_code, get_code_expire_time

def test_password_utils():
    """测试密码工具类"""
    print("测试密码工具类...")
    
    # 测试密码哈希
    password = "Test123456"
    hashed = hash_password(password)
    print(f"原始密码: {password}")
    print(f"哈希密码: {hashed}")
    
    # 测试密码验证
    assert verify_password(password, hashed) == True, "密码验证失败"
    assert verify_password("wrong", hashed) == False, "错误密码验证失败"
    print("密码工具类测试通过!")

def test_token_utils():
    """测试Token工具类"""
    print("\n测试Token工具类...")
    
    # 测试生成Token
    user_data = {"user_id": 1, "phone": "13800138000"}
    token = create_access_token(user_data)
    print(f"生成的Token: {token}")
    
    # 测试解码Token
    decoded = decode_access_token(token)
    assert decoded is not None, "Token解码失败"
    assert decoded["user_id"] == 1, "用户ID不匹配"
    assert decoded["phone"] == "13800138000", "手机号不匹配"
    print("Token工具类测试通过!")

def test_verify_code_utils():
    """测试验证码工具类"""
    print("\n测试验证码工具类...")
    
    phone = "13800138000"
    
    # 测试生成验证码
    code = generate_verify_code(phone)
    print(f"生成的验证码: {code}")
    
    # 测试验证码验证
    assert verify_code(phone, code) == True, "验证码验证失败"
    assert verify_code(phone, code) == False, "验证码重复使用验证失败"
    print("验证码工具类测试通过!")

if __name__ == "__main__":
    test_password_utils()
    test_token_utils()
    test_verify_code_utils()
    print("\n所有工具类测试通过!")

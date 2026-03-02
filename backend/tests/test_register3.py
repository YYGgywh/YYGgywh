import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from fastapi.testclient import TestClient
from app.utils.verify_code import generate_verify_code

client = TestClient(app)

# 直接生成验证码并存储在内存中（避免HTTP请求）
target_phone = '13905730001'
generated_code = generate_verify_code(target_phone)
print('直接生成的验证码：', generated_code)

# 测试注册
register_response = client.post('/api/v1/user/register', json={
    'phone': target_phone,
    'login_name': 'testuser456',
    'code': generated_code,
    'password': 'aBc_123'
})
print('注册响应：', register_response.status_code, register_response.json())

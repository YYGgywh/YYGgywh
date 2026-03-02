from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 测试发送验证码
send_code_response = client.post('/api/v1/user/send_code', json={
    'phone': '13905730001'
})
print('发送验证码响应：', send_code_response.status_code, send_code_response.json())

# 测试注册（注意：需要输入刚刚发送的验证码）
register_response = client.post('/api/v1/user/register', json={
    'phone': '13905730001',
    'login_name': 'testuser123',
    'code': '672589',
    'password': 'aBc_123'
})
print('注册响应：', register_response.status_code, register_response.json())

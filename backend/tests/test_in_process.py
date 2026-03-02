from fastapi.testclient import TestClient
from main import app

print('=== 在Python进程中直接测试API ===')

client = TestClient(app)

# 测试根路径
print('\n=== 测试根路径 ===')
response = client.get('/')
print(f'{response.status_code}: {response.text}')

# 测试健康检查
print('\n=== 测试健康检查 ===')
response = client.get('/health')
print(f'{response.status_code}: {response.text}')

# 测试用户登录
print('\n=== 测试用户登录 ===')
response = client.post('/api/v1/user/login', json={'phone': '18006612925', 'password': '778825'})
print(f'{response.status_code}: {response.text}')

# 测试敏感词API
print('\n=== 测试敏感词检查API ===')
try:
    response = client.get('/api/v1/sensitive_word/check?text=排盘作弊')
    print(f'{response.status_code}: {response.text}')
except Exception as e:
    print(f'API访问失败: {e}')

# 打印所有路由信息
print('\n=== 所有路由 ===')
for route in app.routes:
    print(f'{route.path}')
from fastapi.testclient import TestClient
from main import app

print('=== 在服务器进程中检查路由 ===')

client = TestClient(app)

# 测试根路径
response = client.get('/')
print(f'根路径: {response.status_code}')

# 测试用户API
response = client.post('/api/v1/user/login', json={'phone': '18006612925', 'password': '778825'})
print(f'登录API: {response.status_code}')

# 打印所有API路由
print('\n=== 所有路由 ===')
for route in app.routes:
    if hasattr(route, 'path'):
        print(f'{route.path}')
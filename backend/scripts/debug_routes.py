from fastapi.testclient import TestClient
from main import app
import sys
import os

print('=== 应用路由深度检查 ===')

# 检查是否有/路径的路由
print('\n=== 根路径路由 ===')
root_routes = [route for route in app.routes if route.path == '/']
print(f'根路径路由数量: {len(root_routes)}')

# 检查是否有API v1路径的路由
print('\n=== API v1根路由 ===')
api_routes = [route for route in app.routes if route.path.startswith('/api/v1/') or route.path == '/api/v1']
print(f'API v1路径路由数量: {len(api_routes)}')

# 检查是否有user路径的路由
print('\n=== 用户API路由 ===')
user_routes = [route for route in app.routes if '/user/' in route.path]
print(f'用户API路由数量: {len(user_routes)}')
for route in user_routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        print(f'  {list(route.methods)} -> {route.path}')

# 检查是否有sensitive_word路径的路由
print('\n=== 敏感词API路由 ===')
sensitive_routes = [route for route in app.routes if '/sensitive_word/' in route.path]
print(f'敏感词API路由数量: {len(sensitive_routes)}')
for route in sensitive_routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        print(f'  {list(route.methods)} -> {route.path}')

# 测试客户端访问
print('\n=== 测试客户端 ===')
try:
    client = TestClient(app)
    response = client.get('/api/v1/sensitive_word/check?text=排盘作弊')
    print(f'检查敏感词响应: {response.status_code}')
    print(f'响应内容: {response.text}')
except Exception as e:
    print(f'测试失败: {e}')
    import traceback
    print(traceback.format_exc())
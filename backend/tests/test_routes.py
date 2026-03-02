from fastapi.testclient import TestClient
from main import app
import sys
import os

print('=== 应用实例信息 ===')
print(f'应用名称: {app.title}')
print(f'应用版本: {app.version}')
print(f'调试模式: {app.debug}')

# 检查API路由器是否正确导入
print('\n=== 检查API路由器 ===')
try:
    from app.api import api_router
    print('API路由器导入成功')
    print(f'API路由器类型: {type(api_router)}')
    
    # 检查是否包含路由
    if hasattr(api_router, 'routes'):
        print(f'API路由器包含路由: {len(api_router.routes)}个')
    else:
        print('API路由器没有routes属性')
except Exception as e:
    print(f'API路由器导入失败: {e}')
    import traceback
    print(traceback.format_exc())

# 检查是否有sensitive_word模块的问题
print('\n=== 检查sensitive_word模块 ===')
try:
    from app.api import sensitive_word
    print('sensitive_word模块导入成功')
    print(f'sensitive_word模块类型: {type(sensitive_word)}')
    
    if hasattr(sensitive_word, 'router'):
        print('sensitive_word模块包含router属性')
        router = sensitive_word.router
        if hasattr(router, 'routes'):
            print(f'sensitive_word路由数量: {len(router.routes)}')
            print('sensitive_word路由详情:')
            for route in router.routes:
                if hasattr(route, 'path') and hasattr(route, 'methods'):
                    print(f'  {list(route.methods)} -> {route.path}')
except Exception as e:
    print(f'sensitive_word模块导入失败: {e}')
    import traceback
    print(traceback.format_exc())

# 测试客户端请求
print('\n=== 测试根路径 ===')
try:
    client = TestClient(app)
    response = client.get('/')
    print(f'根路径响应: {response.status_code}')
    print(f'响应内容: {response.json()}')
except Exception as e:
    print(f'测试客户端失败: {e}')
    import traceback
    print(traceback.format_exc())

# 测试API v1路径
print('\n=== 测试API v1路径 ===')
try:
    client = TestClient(app)
    response = client.get('/api/v1')
    print(f'API路径响应: {response.status_code}')
    print(f'响应内容: {response.text}')
except Exception as e:
    print(f'测试API路径失败: {e}')
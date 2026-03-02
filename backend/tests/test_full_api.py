from fastapi.testclient import TestClient
from main import app
import sys
import os
sys.path.append(os.path.dirname(__file__))

print('=== 完整API测试 ===')

# 测试客户端
client = TestClient(app)

# 测试用户登录
print('\n=== 测试用户登录 ===')
login_response = client.post(
    '/api/v1/user/login',
    json={'phone': '18006612925', 'password': '778825'}
)
print(f'登录响应状态: {login_response.status_code}')

if login_response.status_code == 200:
    login_result = login_response.json()
    token = login_result['data']['token']
    headers = {'Authorization': f'Bearer {token}'}
    
    # 测试获取敏感词列表
    print('\n=== 测试获取敏感词列表 ===')
    list_response = client.get('/api/v1/sensitive_word/list', headers=headers)
    print(f'列表响应状态: {list_response.status_code}')
    
    if list_response.status_code == 200:
        list_data = list_response.json()
        print(f'敏感词数量: {len(list_data.get("data", {}).get("list", []))}')
        print(f'响应内容: {list_data}')
    else:
        print(f'错误信息: {list_response.text}')
    
    # 测试检查敏感词API
    print('\n=== 测试检查敏感词 ===')
    check_response = client.get(
        '/api/v1/sensitive_word/check',
        params={'text': '这个排盘作弊的方法真不错'}
    )
    print(f'检查响应状态: {check_response.status_code}')
    
    if check_response.status_code == 200:
        check_data = check_response.json()
        print(f'检查结果: {check_data}')
    else:
        print(f'错误信息: {check_response.text}')
    
    # 测试过滤敏感词API
    print('\n=== 测试过滤敏感词 ===')
    filter_response = client.get(
        '/api/v1/sensitive_word/filter',
        params={'text': '这个排盘作弊的方法真不错'}
    )
    print(f'过滤响应状态: {filter_response.status_code}')
    
    if filter_response.status_code == 200:
        filter_data = filter_response.json()
        print(f'过滤结果: {filter_data}')
    else:
        print(f'错误信息: {filter_response.text}')
else:
    print(f'登录失败: {login_response.text}')
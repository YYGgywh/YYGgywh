import requests
import sys
import os
sys.path.append(os.path.dirname(__file__))

base_url = 'http://localhost:8000/api/v1/'

# 测试用户登录
login_url = base_url + 'user/login'
login_data = {
    'phone': '18006612925',
    'password': '778825'
}

print('=== 测试用户登录 ===')
login_response = requests.post(login_url, json=login_data)
print(f'登录响应状态: {login_response.status_code}')

if login_response.status_code == 200:
    login_result = login_response.json()
    token = login_result['data']['token']
    
    # 测试获取敏感词列表（需要管理员权限）
    list_url = base_url + 'sensitive_word/list'
    list_headers = {'Authorization': f'Bearer {token}'}
    
    print('\n=== 测试获取敏感词列表 ===')
    list_response = requests.get(list_url, headers=list_headers)
    print(f'列表响应状态: {list_response.status_code}')
    
    if list_response.status_code == 200:
        list_data = list_response.json()
        print(f'敏感词数量: {len(list_data.get("data", {}).get("list", []))}')
    else:
        print(f'错误信息: {list_response.text}')
    
    # 测试检查敏感词API
    check_url = base_url + 'sensitive_word/check?text=这个排盘作弊的方法真不错'
    
    print('\n=== 测试检查敏感词 ===')
    check_response = requests.get(check_url)
    print(f'检查响应状态: {check_response.status_code}')
    
    if check_response.status_code == 200:
        check_data = check_response.json()
        print(f'检查结果: {check_data}')
    else:
        print(f'错误信息: {check_response.text}')
    
    # 测试过滤敏感词API
    filter_url = base_url + 'sensitive_word/filter'
    filter_params = {'text': '这个排盘作弊的方法真不错'}
    
    print('\n=== 测试过滤敏感词 ===')
    filter_response = requests.get(filter_url, params=filter_params)
    print(f'过滤响应状态: {filter_response.status_code}')
    
    if filter_response.status_code == 200:
        filter_data = filter_response.json()
        print(f'过滤结果: {filter_data}')
    else:
        print(f'错误信息: {filter_response.text}')
else:
    print('登录失败:', login_response.text)
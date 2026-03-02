import requests

print('=== 网络测试 ===')

# 直接网络访问
try:
    # 测试公开检查接口
    check_url = 'http://localhost:8000/api/v1/sensitive_word/public/check?text=排盘作弊'
    response = requests.get(check_url, timeout=5)
    print(f'检查接口 - 状态码: {response.status_code}')
    print(f'检查接口 - 响应: {response.json()}')
    
    # 测试公开过滤接口
    filter_url = 'http://localhost:8000/api/v1/sensitive_word/public/filter?text=排盘作弊'
    response = requests.get(filter_url, timeout=5)
    print(f'过滤接口 - 状态码: {response.status_code}')
    print(f'过滤接口 - 响应: {response.json()}')
    
except Exception as e:
    print(f'网络请求错误: {e}')
    import traceback
    print(f'详细错误: {traceback.format_exc()}')

print('\n=== 测试包含敏感词的文本 ===')
try:
    # 测试包含敏感词的文本
    test_text = '这个排盘作弊方法真不错'
    check_url = f'http://localhost:8000/api/v1/sensitive_word/public/check?text={test_text}'
    response = requests.get(check_url, timeout=5)
    print(f'检查\"{test_text}\":')
    print(f'状态码: {response.status_code}')
    print(f'响应: {response.json()}')
except Exception as e:
    print(f'测试失败: {e}')
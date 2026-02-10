import requests
import json

# 测试API返回的编码
response = requests.get('http://localhost:8000/api/v1/calendar/current')
data = response.json()

# 检查ganzhi字段
if 'data' in data and 'ganzhi' in data['data']:
    ganzhi = data['data']['ganzhi']
    print('=== GANZHI 字段内容 ===')
    print(json.dumps(ganzhi, ensure_ascii=False, indent=2))
    
    # 检查每个字段的编码
    print('\n=== 编码检查 ===')
    for key, value in ganzhi.items():
        if isinstance(value, dict) and 'ganzhi' in value:
            print(f'{key}: {value["ganzhi"]}')
            print(f'  原始字节: {value["ganzhi"].encode("utf-8")}')
else:
    print('未找到ganzhi字段')
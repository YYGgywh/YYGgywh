import requests
import json

# 测试API的函数
def test_api():
    # 测试获取昵称修改限制信息的API
    try:
        response = requests.get(
            "http://localhost:8000/api/v1/user/get_nickname_limit_info",
            headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI0MzUxMzcsInVzZXJfaWQiOjEsInJvbGUiOjF9.7v6zL0y0X9Q7K8H6G5F4D3S2A1Z0Y9X8W7V6U5T4S3R2E1W"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 获取昵称修改限制信息API测试成功")
            print(f"响应内容: {json.dumps(result, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ 获取昵称修改限制信息API测试失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
    except Exception as e:
        print(f"❌ 获取昵称修改限制信息API测试失败: {str(e)}")
    
    print("\n" + "-"*50 + "\n")
    
    # 测试获取登录名修改限制信息的API
    try:
        response = requests.get(
            "http://localhost:8000/api/v1/user/get_login_name_limit_info",
            headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI0MzUxMzcsInVzZXJfaWQiOjEsInJvbGUiOjF9.7v6zL0y0X9Q7K8H6G5F4D3S2A1Z0Y9X8W7V6U5T4S3R2E1W"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 获取登录名修改限制信息API测试成功")
            print(f"响应内容: {json.dumps(result, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ 获取登录名修改限制信息API测试失败: 状态码 {response.status_code}")
            print(f"响应内容: {response.text}")
    except Exception as e:
        print(f"❌ 获取登录名修改限制信息API测试失败: {str(e)}")

if __name__ == "__main__":
    print("=== 后端API功能测试 ===\n")
    test_api()
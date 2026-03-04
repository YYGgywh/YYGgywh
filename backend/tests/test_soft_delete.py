#!/usr/bin/env python3
"""
测试排盘记录的软删除和恢复功能
"""

import sys
import os
import requests
import json
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.password import hash_password
from app.utils.token import create_access_token
from app.db.database import SessionLocal
from app.models.user import User


def get_admin_token():
    """获取管理员token"""
    
    db = SessionLocal()
    
    # 检查是否已存在测试用户
    existing_user = db.query(User).filter(User.phone == '13905730010').first()
    if not existing_user:
        existing_user = User(
            phone="13905730010",
            password=hash_password("admin123"),
            nickname="测试管理员",
            login_name="admin_test",
            status=1,
            role=1  # 管理员
        )
        db.add(existing_user)
        db.commit()
        db.refresh(existing_user)
    
    # 创建管理员token，使用is_admin参数
    admin_token = create_access_token(
        {"user_id": existing_user.id, "login_name": existing_user.login_name},
        is_admin=True
    )
    
    return admin_token


def test_soft_delete():
    """测试软删除功能"""
    
    admin_token = get_admin_token()
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 首先获取当前排盘记录
    api_url = "http://localhost:8000/api/v1/admin/pan-records"
    
    try:
        print("=== 第一步：获取当前排盘记录 ===")
        response = requests.get(api_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            data = response.json()
            print(f"响应状态码: {response.status_code}")
            print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data['data']['list']:
                record_id = data['data']['list'][0]['id']
                print(f"将删除记录ID: {record_id}")
                
                # 执行删除操作
                delete_url = f"http://localhost:8000/api/v1/admin/pan-records/{record_id}"
                
                print("\n=== 第二步：执行删除操作 ===")
                delete_response = requests.delete(delete_url, headers=headers, verify=False)
                print(f"删除响应状态码: {delete_response.status_code}")
                print(f"删除响应内容: {delete_response.text}")
                
                # 等待一下，确保数据已更新
                time.sleep(1)
                
                # 再次检查排盘记录
                print("\n=== 第三步：再次检查排盘记录 ===")
                response = requests.get(api_url, headers=headers, verify=False)
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"响应状态码: {response.status_code}")
                    print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
                else:
                    print(f"❌ 获取记录失败: {response.status_code}")
                
                # 检查已删除记录
                print("\n=== 第四步：检查已删除记录 ===")
                deleted_url = "http://localhost:8000/api/v1/admin/pan-records/deleted"
                deleted_response = requests.get(deleted_url, headers=headers, verify=False)
                
                if deleted_response.status_code == 200:
                    deleted_data = deleted_response.json()
                    print(f"响应状态码: {deleted_response.status_code}")
                    print(f"返回数据: {json.dumps(deleted_data, indent=2, ensure_ascii=False)}")
                else:
                    print(f"❌ 获取已删除记录失败: {deleted_response.status_code}")
                
                # 恢复删除的记录
                if deleted_response.status_code == 200 and deleted_response.json()['data']['list']:
                    print("\n=== 第五步：恢复已删除记录 ===")
                    restore_url = f"http://localhost:8000/api/v1/admin/pan-records/{record_id}/restore"
                    restore_response = requests.put(restore_url, headers=headers, verify=False)
                    print(f"恢复响应状态码: {restore_response.status_code}")
                    print(f"恢复响应内容: {restore_response.text}")
                    
                    time.sleep(1)
                    
                    # 再次检查恢复后的记录
                    print("\n=== 第六步：检查恢复后的记录 ===")
                    response = requests.get(api_url, headers=headers, verify=False)
                    
                    if response.status_code == 200:
                        data = response.json()
                        print(f"响应状态码: {response.status_code}")
                        print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
                    else:
                        print(f"❌ 获取记录失败: {response.status_code}")
                    
                    # 检查已删除记录是否已清除
                    print("\n=== 第七步：检查已删除记录 ===")
                    deleted_response = requests.get(deleted_url, headers=headers, verify=False)
                    
                    if deleted_response.status_code == 200:
                        deleted_data = deleted_response.json()
                        print(f"响应状态码: {deleted_response.status_code}")
                        print(f"返回数据: {json.dumps(deleted_data, indent=2, ensure_ascii=False)}")
                    else:
                        print(f"❌ 获取已删除记录失败: {deleted_response.status_code}")
                        
            else:
                print("⚠️ 没有找到可删除的排盘记录")
                
        else:
            print(f"❌ 获取记录失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求发送失败: {e}")


def test_permanent_delete():
    """测试永久删除功能"""
    
    admin_token = get_admin_token()
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 首先获取当前排盘记录
    api_url = "http://localhost:8000/api/v1/admin/pan-records"
    
    try:
        print("=== 第一步：获取当前排盘记录 ===")
        response = requests.get(api_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            data = response.json()
            print(f"响应状态码: {response.status_code}")
            print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data['data']['list']:
                record_id = data['data']['list'][0]['id']
                print(f"将永久删除记录ID: {record_id}")
                
                # 首先执行软删除
                delete_url = f"http://localhost:8000/api/v1/admin/pan-records/{record_id}"
                
                print("\n=== 第二步：先执行软删除 ===")
                delete_response = requests.delete(delete_url, headers=headers, verify=False)
                print(f"删除响应状态码: {delete_response.status_code}")
                print(f"删除响应内容: {delete_response.text}")
                
                # 等待一下
                time.sleep(1)
                
                # 执行永久删除
                perm_delete_url = f"http://localhost:8000/api/v1/admin/pan-records/{record_id}/permanent"
                
                print("\n=== 第三步：执行永久删除 ===")
                perm_delete_response = requests.delete(perm_delete_url, headers=headers, verify=False)
                print(f"永久删除响应状态码: {perm_delete_response.status_code}")
                print(f"永久删除响应内容: {perm_delete_response.text}")
                
                time.sleep(1)
                
                # 检查记录是否已删除
                print("\n=== 第四步：检查记录是否已删除 ===")
                response = requests.get(api_url, headers=headers, verify=False)
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"响应状态码: {response.status_code}")
                    print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
                else:
                    print(f"❌ 获取记录失败: {response.status_code}")
                
                # 检查已删除记录是否已清除
                print("\n=== 第五步：检查已删除记录 ===")
                deleted_url = "http://localhost:8000/api/v1/admin/pan-records/deleted"
                deleted_response = requests.get(deleted_url, headers=headers, verify=False)
                
                if deleted_response.status_code == 200:
                    deleted_data = deleted_response.json()
                    print(f"响应状态码: {deleted_response.status_code}")
                    print(f"返回数据: {json.dumps(deleted_data, indent=2, ensure_ascii=False)}")
                else:
                    print(f"❌ 获取已删除记录失败: {deleted_response.status_code}")
                    
            else:
                print("⚠️ 没有找到可删除的排盘记录")
                
        else:
            print(f"❌ 获取记录失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求发送失败: {e}")


if __name__ == "__main__":
    print("=== 测试排盘记录软删除和恢复功能 ===")
    test_soft_delete()
    
    print("\n" + "-" * 50 + "\n")
    
    print("=== 测试排盘记录永久删除功能 ===")
    test_permanent_delete()
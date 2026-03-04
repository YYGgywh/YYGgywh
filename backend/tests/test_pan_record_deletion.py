#!/usr/bin/env python3
"""
测试排盘记录的软删除和已删除记录管理功能
"""

import sys
import os
import time
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from app.db.database import SessionLocal, Base, engine
from app.models.pan_record import PanRecord
from app.models.user import User
from app.utils.password import hash_password
from app.utils.token import create_access_token


def test_pan_record_soft_deletion():
    """测试排盘记录的软删除功能"""
    
    client = TestClient(app)
    
    # 准备测试数据
    test_user = User(
        phone="13905730009",
        password=hash_password("12345678"),
        nickname="测试用户9",
        login_name="test_user_9",
        status=1,
        role=1  # 管理员角色
    )
    
    test_record1 = PanRecord(
        user_id=1,
        pan_type="liuyao",
        pan_params="{}",
        pan_result="{}",
        audit_status=0,
        is_visible=True,
        create_time=int(time.time()),
        update_time=int(time.time())
    )
    
    test_record2 = PanRecord(
        user_id=1,
        pan_type="bagua",
        pan_params="{}",
        pan_result="{}",
        audit_status=1,
        is_visible=True,
        create_time=int(time.time()),
        update_time=int(time.time())
    )
    
    # 创建测试数据
    db = SessionLocal()
    db.add(test_user)
    db.add(test_record1)
    db.add(test_record2)
    db.commit()
    db.refresh(test_user)
    db.refresh(test_record1)
    db.refresh(test_record2)
    
    test_user_id = test_user.id
    test_record_id1 = test_record1.id
    test_record_id2 = test_record2.id
    
    # 获取管理Token
    token = create_access_token({"user_id": test_user_id, "login_name": test_user.login_name, "is_admin": True})
    
    # 测试获取正常排盘记录列表
    response = client.get(
        "/api/v1/admin/pan-records",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"获取正常排盘记录响应状态码: {response.status_code}")
    assert response.status_code == 200, f"获取排盘记录列表失败: {response.text}"
    
    data = response.json()
    print(f"正常排盘记录数量: {data['data']['total']}")
    
    # 测试删除排盘记录（软删除）
    response = client.delete(
        f"/api/v1/admin/pan-records/{test_record_id1}",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"删除排盘记录响应状态码: {response.status_code}")
    assert response.status_code == 200, f"删除排盘记录失败: {response.text}"
    
    # 再次获取正常排盘记录列表，应该不包含已删除的记录
    response = client.get(
        "/api/v1/admin/pan-records",
        headers={"Authorization": f"Bearer {token}"}
    )
    data = response.json()
    print(f"删除后正常排盘记录数量: {data['data']['total']}")
    assert data['data']['total'] < 2, "删除后正常排盘记录数量未减少"
    
    # 测试获取已删除排盘记录列表
    response = client.get(
        "/api/v1/admin/pan-records/deleted",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"获取已删除排盘记录响应状态码: {response.status_code}")
    assert response.status_code == 200, f"获取已删除排盘记录失败: {response.text}"
    
    data = response.json()
    print(f"已删除排盘记录数量: {data['data']['total']}")
    assert data['data']['total'] > 0, "没有找到已删除的排盘记录"
    
    deleted_records = data['data']['list']
    assert any(record['id'] == test_record_id1 for record in deleted_records), "未找到被删除的排盘记录"
    
    # 测试恢复排盘记录
    response = client.put(
        f"/api/v1/admin/pan-records/{test_record_id1}/restore",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"恢复排盘记录响应状态码: {response.status_code}")
    assert response.status_code == 200, f"恢复排盘记录失败: {response.text}"
    
    # 验证已删除记录列表不再包含该记录
    response = client.get(
        "/api/v1/admin/pan-records/deleted",
        headers={"Authorization": f"Bearer {token}"}
    )
    data = response.json()
    assert data['data']['total'] == 0, "恢复后已删除记录数量未清零"
    
    # 再次删除用于测试永久删除
    client.delete(
        f"/api/v1/admin/pan-records/{test_record_id1}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # 测试永久删除排盘记录
    response = client.delete(
        f"/api/v1/admin/pan-records/{test_record_id1}/permanent",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"永久删除排盘记录响应状态码: {response.status_code}")
    assert response.status_code == 200, f"永久删除排盘记录失败: {response.text}"
    
    # 验证已删除记录列表不再包含该记录
    response = client.get(
        "/api/v1/admin/pan-records/deleted",
        headers={"Authorization": f"Bearer {token}"}
    )
    data = response.json()
    assert data['data']['total'] == 0, "永久删除后已删除记录数量未清零"
    
    # 清理测试数据
    db.query(PanRecord).filter(PanRecord.id.in_([test_record_id1, test_record_id2])).delete()
    db.query(User).filter(User.id == test_user_id).delete()
    db.commit()
    
    print("✅ 排盘记录删除测试完成")


if __name__ == "__main__":
    test_pan_record_soft_deletion()
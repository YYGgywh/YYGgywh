"""
 * @file            backend/tests/test_pan_api.py
 * @description     排盘API单元测试
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 17:10:00
 * @lastModified    2026-03-02 17:10:00
 * Copyright © All rights reserved
"""

import sys
import os
import json
import time

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pytest
import httpx
from main import app
from app.db.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.pan_record import PanRecord
from app.utils.password import get_password_hash
from app.utils.token import create_access_token

# 创建测试客户端
client = httpx.AsyncClient(app=app, base_url="http://testserver")

# 测试前准备
@pytest.fixture
def setup_db():
    # 创建测试数据库
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 创建测试用户
    test_user = User(
        phone="13800138000",
        password_hash=get_password_hash("123456"),
        nickname="测试用户",
        role=0,
        status=1
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    # 创建测试排盘记录
    test_pan = PanRecord(
        user_id=test_user.id,
        pan_type="liuyao",
        pan_params=json.dumps({"method": "number", "number": "123"}),
        pan_result=json.dumps({"gua": "乾卦", "yao": "初九"}),
        supplement="测试排盘",
        create_time=int(time.time()),
        update_time=int(time.time())
    )
    db.add(test_pan)
    db.commit()
    db.refresh(test_pan)
    
    yield test_user, test_pan
    
    # 清理测试数据
    db.query(PanRecord).delete()
    db.query(User).delete()
    db.commit()
    db.close()

# 获取测试token
def get_test_token(user):
    return create_access_token({"user_id": user.id, "phone": user.phone})

# 测试保存排盘记录
@pytest.mark.asyncio
async def test_save_pan(setup_db):
    user, _ = setup_db
    token = get_test_token(user)
    
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post(
            "/api/pan/save",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "pan_type": "liuyao",
                "pan_params": json.dumps({"method": "number", "number": "456"}),
                "pan_result": json.dumps({"gua": "坤卦", "yao": "初六"}),
                "supplement": "测试保存"
            }
        )
        
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert "record_id" in response.json()["data"]

# 测试查询排盘记录
@pytest.mark.asyncio
async def test_list_pan(setup_db):
    user, pan = setup_db
    token = get_test_token(user)
    
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get(
            "/api/pan/list",
            headers={"Authorization": f"Bearer {token}"},
            params={"pan_type": "liuyao", "page": 1, "size": 10}
        )
        
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert len(response.json()["data"]) > 0

# 测试更新排盘记录
@pytest.mark.asyncio
async def test_update_pan(setup_db):
    user, pan = setup_db
    token = get_test_token(user)
    
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.put(
            f"/api/pan/update/{pan.id}",
            headers={"Authorization": f"Bearer {token}"},
            json={"supplement": "更新后的补充说明"}
        )
        
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["data"]["record_id"] == pan.id

# 测试删除排盘记录
@pytest.mark.asyncio
async def test_delete_pan(setup_db):
    user, pan = setup_db
    token = get_test_token(user)
    
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.delete(
            f"/api/pan/delete/{pan.id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        assert response.json()["code"] == 200
        assert response.json()["data"]["record_id"] == pan.id

# 测试时间范围查询
@pytest.mark.asyncio
async def test_list_pan_with_time_range(setup_db):
    user, _ = setup_db
    token = get_test_token(user)
    
    # 创建测试排盘记录
    db = SessionLocal()
    current_time = int(time.time())
    
    # 创建一条5分钟前的记录
    old_pan = PanRecord(
        user_id=user.id,
        pan_type="liuyao",
        pan_params=json.dumps({"method": "number", "number": "789"}),
        pan_result=json.dumps({"gua": "震卦", "yao": "初九"}),
        supplement="旧记录",
        create_time=current_time - 300,  # 5分钟前
        update_time=current_time - 300
    )
    db.add(old_pan)
    db.commit()
    db.close()
    
    # 查询最近3分钟的记录
    async with httpx.AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.get(
            "/api/pan/list",
            headers={"Authorization": f"Bearer {token}"},
            params={
                "pan_type": "liuyao",
                "page": 1,
                "size": 10,
                "start_time": current_time - 180  # 3分钟前
            }
        )
        
        assert response.status_code == 200
        assert response.json()["code"] == 200

if __name__ == "__main__":
    pytest.main([__file__])

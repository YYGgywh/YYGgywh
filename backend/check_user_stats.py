#!/usr/bin/env python3
# 检查用户统计数据脚本

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import get_db
from app.models.user import User
from app.models.pan_record import PanRecord
from app.models.user_follow import UserFollow

# 获取数据库会话
db = next(get_db())

try:
    # 查找 test_0001 用户
    user = db.query(User).filter(User.login_name == 'test_0001').first()
    if not user:
        print("用户 test_0001 不存在")
        sys.exit(1)
    
    print(f"用户 ID: {user.id}, 登录名: {user.login_name}")
    
    # 查询用户的排盘记录
    pan_records = db.query(PanRecord).filter(PanRecord.user_id == user.id).all()
    print(f"\n用户的排盘记录数量: {len(pan_records)}")
    
    total_likes = 0
    for record in pan_records:
        print(f"排盘 ID: {record.id}, 获赞数: {record.like_count}")
        total_likes += record.like_count
    
    print(f"\n总获赞数: {total_likes}")
    
    # 查询关注数
    follows_count = db.query(UserFollow).filter(UserFollow.follower_id == user.id).count()
    print(f"关注数: {follows_count}")
    
    # 查询粉丝数
    followers_count = db.query(UserFollow).filter(UserFollow.followed_id == user.id).count()
    print(f"粉丝数: {followers_count}")
    
    # 查询互关数
    following = db.query(UserFollow.followed_id).filter(UserFollow.follower_id == user.id).all()
    following_ids = [f[0] for f in following]
    mutual_follows_count = 0
    if following_ids:
        mutual_follows_count = db.query(UserFollow).filter(
            UserFollow.follower_id.in_(following_ids),
            UserFollow.followed_id == user.id
        ).count()
    print(f"互关数: {mutual_follows_count}")
    
finally:
    db.close()

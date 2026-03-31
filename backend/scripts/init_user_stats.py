#!/usr/bin/env python3
# 初始化用户统计数据脚本

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import get_db
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.pan_record import PanRecord
from app.models.comment import Comment
from app.models.pan_like import PanLike
from app.models.comment_like import CommentLike
from app.models.user_follow import UserFollow
import time

# 获取数据库会话
db = next(get_db())

try:
    print("开始初始化用户统计数据...")
    
    # 遍历所有用户
    users = db.query(User).all()
    total_users = len(users)
    print(f"找到 {total_users} 个用户")
    
    for i, user in enumerate(users, 1):
        print(f"处理用户 {i}/{total_users}: {user.login_name or user.phone}")
        
        # 检查是否已有统计数据
        if user.stats:
            print(f"  用户已有统计数据，跳过")
            continue
        
        # 计算贴子获赞数
        user_pan_records = db.query(PanRecord).filter(
            PanRecord.user_id == user.id,
            PanRecord.is_visible == 1,
            PanRecord.deleted_at.is_(None)
        ).all()
        post_likes = sum(record.like_count or 0 for record in user_pan_records)
        
        # 计算评论获赞数
        user_comments = db.query(Comment).filter(
            Comment.user_id == user.id,
            Comment.deleted_at.is_(None)
        ).all()
        comment_likes = 0
        for comment in user_comments:
            comment_like_count = db.query(CommentLike).filter(
                CommentLike.comment_id == comment.id
            ).count()
            comment_likes += comment_like_count
        
        # 计算总获赞数
        total_likes = post_likes + comment_likes
        
        # 计算关注数
        follows_count = db.query(UserFollow).filter(
            UserFollow.follower_id == user.id
        ).count()
        
        # 计算粉丝数
        followers_count = db.query(UserFollow).filter(
            UserFollow.followed_id == user.id
        ).count()
        
        # 计算互关数
        following = db.query(UserFollow.followed_id).filter(
            UserFollow.follower_id == user.id
        ).all()
        following_ids = [f[0] for f in following]
        mutual_follows_count = 0
        if following_ids:
            mutual_follows_count = db.query(UserFollow).filter(
                UserFollow.follower_id.in_(following_ids),
                UserFollow.followed_id == user.id
            ).count()
        
        # 创建统计数据记录
        user_stats = UserStats(
            user_id=user.id,
            post_likes=post_likes,
            comment_likes=comment_likes,
            total_likes=total_likes,
            follows=follows_count,
            followers=followers_count,
            mutual_follows=mutual_follows_count,
            update_time=int(time.time())
        )
        db.add(user_stats)
        
        # 每10个用户提交一次
        if i % 10 == 0:
            db.commit()
            print(f"  已处理 {i} 个用户，提交事务")
    
    # 提交剩余事务
    db.commit()
    print("\n用户统计数据初始化完成！")
    
finally:
    db.close()

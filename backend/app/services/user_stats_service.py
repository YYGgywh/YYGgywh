"""
 * @file            backend/app/services/user_stats_service.py
 * @description     用户统计服务类，实现用户统计数据相关业务逻辑
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-30 16:30:00
 * @lastModified    2026-03-30 16:30:00
 * Copyright © All rights reserved
"""

from sqlalchemy.orm import Session
from app.models.user_stats import UserStats
from app.models.user import User
import time

class UserStatsService:
    @staticmethod
    def get_or_create_user_stats(db: Session, user_id: int) -> UserStats:
        """
        获取或创建用户统计数据
        :param db: 数据库会话
        :param user_id: 用户ID
        :return: 用户统计数据对象
        """
        user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not user_stats:
            user_stats = UserStats(user_id=user_id)
            db.add(user_stats)
            db.commit()
            db.refresh(user_stats)
        return user_stats
    
    @staticmethod
    def update_post_likes(db: Session, user_id: int, increment: int = 1):
        """
        更新用户的贴子获赞数
        :param db: 数据库会话
        :param user_id: 用户ID
        :param increment: 增量（正数为增加，负数为减少）
        """
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        user_stats.post_likes = max(0, user_stats.post_likes + increment)
        user_stats.total_likes = max(0, user_stats.total_likes + increment)
        user_stats.update_time = int(time.time())
        db.commit()
    
    @staticmethod
    def update_comment_likes(db: Session, user_id: int, increment: int = 1):
        """
        更新用户的评论获赞数
        :param db: 数据库会话
        :param user_id: 用户ID
        :param increment: 增量（正数为增加，负数为减少）
        """
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        user_stats.comment_likes = max(0, user_stats.comment_likes + increment)
        user_stats.total_likes = max(0, user_stats.total_likes + increment)
        user_stats.update_time = int(time.time())
        db.commit()
    
    @staticmethod
    def update_follows(db: Session, user_id: int, increment: int = 1):
        """
        更新用户的关注数
        :param db: 数据库会话
        :param user_id: 用户ID
        :param increment: 增量（正数为增加，负数为减少）
        """
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        user_stats.follows = max(0, user_stats.follows + increment)
        user_stats.update_time = int(time.time())
        db.commit()
    
    @staticmethod
    def update_followers(db: Session, user_id: int, increment: int = 1):
        """
        更新用户的粉丝数
        :param db: 数据库会话
        :param user_id: 用户ID
        :param increment: 增量（正数为增加，负数为减少）
        """
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        user_stats.followers = max(0, user_stats.followers + increment)
        user_stats.update_time = int(time.time())
        db.commit()
    
    @staticmethod
    def update_mutual_follows(db: Session, user_id: int):
        """
        更新用户的互关数
        :param db: 数据库会话
        :param user_id: 用户ID
        """
        from app.models.user_follow import UserFollow
        
        # 获取用户关注的人
        following = db.query(UserFollow.followed_id).filter(
            UserFollow.follower_id == user_id
        ).all()
        following_ids = [f[0] for f in following]
        
        # 计算互关数
        mutual_follows_count = 0
        if following_ids:
            mutual_follows_count = db.query(UserFollow).filter(
                UserFollow.follower_id.in_(following_ids),
                UserFollow.followed_id == user_id
            ).count()
        
        # 更新统计数据
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        user_stats.mutual_follows = mutual_follows_count
        user_stats.update_time = int(time.time())
        db.commit()
    
    @staticmethod
    def get_user_stats(db: Session, user_id: int) -> dict:
        """
        获取用户的统计数据
        :param db: 数据库会话
        :param user_id: 用户ID
        :return: 用户统计数据字典
        """
        user_stats = UserStatsService.get_or_create_user_stats(db, user_id)
        return {
            "post_likes": user_stats.post_likes,
            "comment_likes": user_stats.comment_likes,
            "total_likes": user_stats.total_likes,
            "follows": user_stats.follows,
            "followers": user_stats.followers,
            "mutual_follows": user_stats.mutual_follows
        }

"""
 * @file            backend/app/services/user_follow_service.py
 * @description     用户关注服务类，实现关注相关业务逻辑
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-24 19:30:00
 * @lastModified    2026-03-24 19:30:00
 * Copyright © All rights reserved
"""
from sqlalchemy.orm import Session
from app.models.user_follow import UserFollow
from app.models.user import User
from fastapi import HTTPException

class UserFollowService:
    @staticmethod
    def follow_user(db: Session, follower_id: int, followed_id: int) -> dict:
        """
        关注用户
        :param db: 数据库会话
        :param follower_id: 关注者ID
        :param followed_id: 被关注者ID
        :return: 操作结果
        """
        # 检查是否关注自己
        if follower_id == followed_id:
            raise HTTPException(status_code=400, detail="不能关注自己")
        
        # 检查被关注用户是否存在
        followed_user = db.query(User).filter(User.id == followed_id).first()
        if not followed_user:
            raise HTTPException(status_code=404, detail="被关注用户不存在")
        
        # 检查是否已经关注
        existing_follow = db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id
        ).first()
        
        if existing_follow:
            raise HTTPException(status_code=400, detail="已经关注该用户")
        
        # 创建关注关系
        new_follow = UserFollow(
            follower_id=follower_id,
            followed_id=followed_id
        )
        db.add(new_follow)
        db.commit()
        db.refresh(new_follow)
        
        return {"message": "关注成功"}
    
    @staticmethod
    def unfollow_user(db: Session, follower_id: int, followed_id: int) -> dict:
        """
        取消关注用户
        :param db: 数据库会话
        :param follower_id: 关注者ID
        :param followed_id: 被关注者ID
        :return: 操作结果
        """
        # 检查关注关系是否存在
        follow_relation = db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id
        ).first()
        
        if not follow_relation:
            raise HTTPException(status_code=400, detail="未关注该用户")
        
        # 删除关注关系
        db.delete(follow_relation)
        db.commit()
        
        return {"message": "取消关注成功"}
    
    @staticmethod
    def check_follow_status(db: Session, follower_id: int, followed_id: int) -> dict:
        """
        检查关注状态
        :param db: 数据库会话
        :param follower_id: 关注者ID
        :param followed_id: 被关注者ID
        :return: 关注状态
        """
        follow_relation = db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id
        ).first()
        
        return {"is_following": follow_relation is not None}
    
    @staticmethod
    def toggle_follow(db: Session, follower_id: int, followed_id: int) -> dict:
        """
        关注/取消关注（直接删除记录）
        :param db: 数据库会话
        :param follower_id: 关注者ID
        :param followed_id: 被关注者ID
        :return: 操作结果（is_followed）
        """
        # 防止关注自己
        if follower_id == followed_id:
            raise ValueError("不能关注自己")
        
        # 检查被关注用户是否存在
        followed_user = db.query(User).filter(User.id == followed_id).first()
        if not followed_user:
            raise ValueError("被关注用户不存在")
        
        # 查询现有关系
        follow = db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id
        ).first()
        
        if follow:
            # 已关注 -> 取消关注（直接删除）
            db.delete(follow)
            db.commit()
            
            return {
                "is_followed": False
            }
        else:
            # 未关注 -> 关注
            new_follow = UserFollow(
                follower_id=follower_id,
                followed_id=followed_id
            )
            db.add(new_follow)
            db.commit()
            
            return {
                "is_followed": True
            }
    
    @staticmethod
    def is_following(db: Session, follower_id: int, followed_id: int) -> bool:
        """
        获取关注状态
        :param db: 数据库会话
        :param follower_id: 关注者ID
        :param followed_id: 被关注者ID
        :return: 是否已关注
        """
        follow = db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.followed_id == followed_id
        ).first()
        
        return follow is not None
    
    @staticmethod
    def get_following_list(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list:
        """
        获取用户关注列表
        :param db: 数据库会话
        :param user_id: 用户ID
        :param skip: 跳过数量
        :param limit: 限制数量
        :return: 关注列表
        """
        follows = db.query(UserFollow).filter(
            UserFollow.follower_id == user_id
        ).offset(skip).limit(limit).all()
        
        following_list = []
        for follow in follows:
            followed_user = db.query(User).filter(User.id == follow.followed_id).first()
            if followed_user:
                following_list.append({
                    "user_id": followed_user.id,
                    "nickname": followed_user.nickname,
                    "avatar": followed_user.avatar,
                    "follow_time": follow.create_time
                })
        
        return following_list
    
    @staticmethod
    def get_followers_list(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list:
        """
        获取用户粉丝列表
        :param db: 数据库会话
        :param user_id: 用户ID
        :param skip: 跳过数量
        :param limit: 限制数量
        :return: 粉丝列表
        """
        follows = db.query(UserFollow).filter(
            UserFollow.followed_id == user_id
        ).offset(skip).limit(limit).all()
        
        followers_list = []
        for follow in follows:
            follower_user = db.query(User).filter(User.id == follow.follower_id).first()
            if follower_user:
                followers_list.append({
                    "user_id": follower_user.id,
                    "nickname": follower_user.nickname,
                    "avatar": follower_user.avatar,
                    "follow_time": follow.create_time
                })
        
        return followers_list
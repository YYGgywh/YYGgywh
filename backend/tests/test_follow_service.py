"""
 * @file            backend/tests/test_follow_service.py
 * @description     关注功能单元测试
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-24 19:30:00
 * @lastModified    2026-03-24 19:30:00
 * Copyright © All rights reserved
"""
import unittest
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.user_follow import UserFollow
from app.services.user_follow_service import UserFollowService

class TestFollowService(unittest.TestCase):
    def setUp(self):
        # 创建测试数据库表
        Base.metadata.create_all(bind=engine)
        self.db = SessionLocal()
        
        # 创建测试用户
        self.user1 = User(
            phone="13800138001",
            login_name="test1",
            nickname="测试用户1",
            password="123456"
        )
        self.user2 = User(
            phone="13800138002",
            login_name="test2",
            nickname="测试用户2",
            password="123456"
        )
        self.db.add(self.user1)
        self.db.add(self.user2)
        self.db.commit()
        self.db.refresh(self.user1)
        self.db.refresh(self.user2)
    
    def tearDown(self):
        # 清理测试数据
        self.db.query(UserFollow).delete()
        self.db.query(User).delete()
        self.db.commit()
        self.db.close()
    
    def test_follow_user(self):
        """测试关注用户功能"""
        # 测试关注用户
        result = UserFollowService.follow_user(self.db, self.user1.id, self.user2.id)
        self.assertEqual(result["message"], "关注成功")
        
        # 检查关注关系是否创建
        follow = self.db.query(UserFollow).filter(
            UserFollow.follower_id == self.user1.id,
            UserFollow.followed_id == self.user2.id
        ).first()
        self.assertIsNotNone(follow)
    
    def test_unfollow_user(self):
        """测试取消关注用户功能"""
        # 先关注用户
        UserFollowService.follow_user(self.db, self.user1.id, self.user2.id)
        
        # 测试取消关注
        result = UserFollowService.unfollow_user(self.db, self.user1.id, self.user2.id)
        self.assertEqual(result["message"], "取消关注成功")
        
        # 检查关注关系是否删除
        follow = self.db.query(UserFollow).filter(
            UserFollow.follower_id == self.user1.id,
            UserFollow.followed_id == self.user2.id
        ).first()
        self.assertIsNone(follow)
    
    def test_toggle_follow(self):
        """测试关注/取消关注切换功能"""
        # 测试关注
        result = UserFollowService.toggle_follow(self.db, self.user1.id, self.user2.id)
        self.assertTrue(result["is_followed"])
        
        # 测试取消关注
        result = UserFollowService.toggle_follow(self.db, self.user1.id, self.user2.id)
        self.assertFalse(result["is_followed"])
    
    def test_is_following(self):
        """测试检查关注状态功能"""
        # 测试未关注状态
        is_following = UserFollowService.is_following(self.db, self.user1.id, self.user2.id)
        self.assertFalse(is_following)
        
        # 关注后测试
        UserFollowService.follow_user(self.db, self.user1.id, self.user2.id)
        is_following = UserFollowService.is_following(self.db, self.user1.id, self.user2.id)
        self.assertTrue(is_following)
    
    def test_follow_self(self):
        """测试关注自己的情况"""
        # 测试关注自己
        with self.assertRaises(Exception):
            UserFollowService.follow_user(self.db, self.user1.id, self.user1.id)
        
        # 测试toggle_follow关注自己
        with self.assertRaises(ValueError):
            UserFollowService.toggle_follow(self.db, self.user1.id, self.user1.id)
    
    def test_duplicate_follow(self):
        """测试重复关注的情况"""
        # 第一次关注
        UserFollowService.follow_user(self.db, self.user1.id, self.user2.id)
        
        # 第二次关注（应该失败）
        with self.assertRaises(Exception):
            UserFollowService.follow_user(self.db, self.user1.id, self.user2.id)

if __name__ == "__main__":
    unittest.main()

"""
* @file            backend/app/services/like_service.py
* @description     点赞服务层，封装点赞相关业务逻辑
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:20:00
* @lastModified    2026-03-05 13:20:00
* Copyright © All rights reserved
"""

from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.pan_like import PanLike
from app.models.pan_record import PanRecord
from app.services.pan_service import PanService


class LikeService:
    """点赞服务类"""
    
    def __init__(self, db: Session):
        self.db = db
        self.pan_service = PanService(db)
    
    def toggle_like(self, user_id: int, pan_id: int) -> Dict[str, Any]:
        """
        点赞/取消点赞
        
        Args:
            user_id: 用户ID
            pan_id: 排盘记录ID
        
        Returns:
            操作结果（is_liked, like_count）
        """
        # 查询是否已点赞
        like = self.db.query(PanLike).filter(
            PanLike.user_id == user_id,
            PanLike.pan_id == pan_id
        ).first()
        
        if like:
            # 取消点赞
            self.db.delete(like)
            self.pan_service.decrement_like_count(pan_id)
            self.db.commit()
            
            # 获取当前点赞数
            record = self.db.query(PanRecord).filter(PanRecord.id == pan_id).first()
            like_count = record.like_count if record else 0
            
            return {
                "is_liked": False,
                "like_count": like_count
            }
        else:
            # 点赞
            new_like = PanLike(
                user_id=user_id,
                pan_id=pan_id
            )
            self.db.add(new_like)
            self.pan_service.increment_like_count(pan_id)
            self.db.commit()
            
            # 获取当前点赞数
            record = self.db.query(PanRecord).filter(PanRecord.id == pan_id).first()
            like_count = record.like_count if record else 0
            
            return {
                "is_liked": True,
                "like_count": like_count
            }
    
    def get_like_status(self, user_id: int, pan_id: int) -> bool:
        """
        获取点赞状态
        
        Args:
            user_id: 用户ID
            pan_id: 排盘记录ID
        
        Returns:
            是否已点赞
        """
        like = self.db.query(PanLike).filter(
            PanLike.user_id == user_id,
            PanLike.pan_id == pan_id
        ).first()
        
        return like is not None
    
    def get_user_likes(self, user_id: int, page: int = 1, size: int = 10) -> Dict[str, Any]:
        """
        获取用户点赞列表
        
        Args:
            user_id: 用户ID
            page: 页码
            size: 每页数量
        
        Returns:
            用户点赞列表
        """
        offset = (page - 1) * size
        
        # 查询点赞记录
        likes = self.db.query(PanLike).filter(
            PanLike.user_id == user_id
        ).order_by(PanLike.create_time.desc()).offset(offset).limit(size).all()
        
        # 构建响应数据
        items = []
        for like in likes:
            record = self.db.query(PanRecord).filter(
                PanRecord.id == like.pan_id,
                PanRecord.is_visible == 1,
                PanRecord.deleted_at.is_(None)
            ).first()
            
            if record:
                items.append({
                    "id": record.id,
                    "pan_type": record.pan_type,
                    "pan_params": record.pan_params,
                    "pan_result": record.pan_result,
                    "supplement": record.supplement,
                    "like_count": record.like_count,
                    "collect_count": record.collect_count,
                    "create_time": record.create_time
                })
        
        # 查询总数
        total = self.db.query(PanLike).filter(
            PanLike.user_id == user_id
        ).count()
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size
        }

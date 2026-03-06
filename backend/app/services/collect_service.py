"""
* @file            backend/app/services/collect_service.py
* @description     收藏服务层，封装收藏相关业务逻辑
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:25:00
* @lastModified    2026-03-05 13:25:00
* Copyright © All rights reserved
"""

from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.pan_collect import PanCollect
from app.models.pan_record import PanRecord
from app.services.pan_service import PanService


class CollectService:
    """收藏服务类"""
    
    def __init__(self, db: Session):
        self.db = db
        self.pan_service = PanService(db)
    
    def toggle_collect(self, user_id: int, pan_id: int) -> Dict[str, Any]:
        """
        收藏/取消收藏
        
        Args:
            user_id: 用户ID
            pan_id: 排盘记录ID
        
        Returns:
            操作结果（is_collected, collect_count）
        """
        # 查询是否已收藏
        collect = self.db.query(PanCollect).filter(
            PanCollect.user_id == user_id,
            PanCollect.pan_id == pan_id
        ).first()
        
        if collect:
            # 取消收藏
            self.db.delete(collect)
            self.pan_service.decrement_collect_count(pan_id)
            self.db.commit()
            
            # 获取当前收藏数
            record = self.db.query(PanRecord).filter(PanRecord.id == pan_id).first()
            collect_count = record.collect_count if record else 0
            
            return {
                "is_collected": False,
                "collect_count": collect_count
            }
        else:
            # 收藏
            new_collect = PanCollect(
                user_id=user_id,
                pan_id=pan_id
            )
            self.db.add(new_collect)
            self.pan_service.increment_collect_count(pan_id)
            self.db.commit()
            
            # 获取当前收藏数
            record = self.db.query(PanRecord).filter(PanRecord.id == pan_id).first()
            collect_count = record.collect_count if record else 0
            
            return {
                "is_collected": True,
                "collect_count": collect_count
            }
    
    def get_collect_status(self, user_id: int, pan_id: int) -> bool:
        """
        获取收藏状态
        
        Args:
            user_id: 用户ID
            pan_id: 排盘记录ID
        
        Returns:
            是否已收藏
        """
        collect = self.db.query(PanCollect).filter(
            PanCollect.user_id == user_id,
            PanCollect.pan_id == pan_id
        ).first()
        
        return collect is not None
    
    def get_user_collects(self, user_id: int, page: int = 1, size: int = 10) -> Dict[str, Any]:
        """
        获取用户收藏列表
        
        Args:
            user_id: 用户ID
            page: 页码
            size: 每页数量
        
        Returns:
            用户收藏列表
        """
        offset = (page - 1) * size
        
        # 查询收藏记录
        collects = self.db.query(PanCollect).filter(
            PanCollect.user_id == user_id
        ).order_by(PanCollect.create_time.desc()).offset(offset).limit(size).all()
        
        # 构建响应数据
        items = []
        for collect in collects:
            record = self.db.query(PanRecord).filter(
                PanRecord.id == collect.pan_id,
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
        total = self.db.query(PanCollect).filter(
            PanCollect.user_id == user_id
        ).count()
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size
        }

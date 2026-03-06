"""
* @file            backend/app/services/pan_service.py
* @description     排盘记录服务层，封装排盘记录相关业务逻辑
* @author          Gordon <gordon_cao@qq.com>
* @createTime      2026-03-05 13:15:00
* @lastModified    2026-03-05 13:15:00
* Copyright © All rights reserved
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.pan_record import PanRecord
from app.models.pan_like import PanLike
from app.models.pan_collect import PanCollect
from app.models.user import User
import json


class PanService:
    """排盘记录服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_public_pan_list(
        self,
        pan_type: str = "liuyao",
        page: int = 1,
        size: int = 12,
        sort: str = "newest",
        user_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        获取公开排盘记录列表
        
        Args:
            pan_type: 排盘类型
            page: 页码
            size: 每页数量
            sort: 排序方式（newest=最新，hottest=最热）
            user_id: 当前用户ID（可选，用于查询点赞/收藏状态）
        
        Returns:
            排盘记录列表
        """
        offset = (page - 1) * size
        
        # 构建查询条件
        query = self.db.query(PanRecord).filter(
            PanRecord.pan_type == pan_type,
            PanRecord.is_public == 1,
            PanRecord.audit_status == 1,
            PanRecord.is_visible == 1,
            PanRecord.deleted_at.is_(None)
        )
        
        # 排序
        if sort == "hottest":
            query = query.order_by(PanRecord.like_count.desc(), PanRecord.create_time.desc())
        else:
            query = query.order_by(PanRecord.create_time.desc())
        
        # 执行查询
        records = query.offset(offset).limit(size).all()
        
        # 构建响应数据
        data = []
        for record in records:
            # 解析JSON字符串
            try:
                pan_params = json.loads(record.pan_params)
            except:
                pan_params = record.pan_params
            
            try:
                pan_result = json.loads(record.pan_result)
            except:
                pan_result = record.pan_result
            
            # 获取用户信息
            user = self.db.query(User).filter(User.id == record.user_id).first()
            
            # 查询点赞/收藏状态
            is_liked = False
            is_collected = False
            if user_id:
                like = self.db.query(PanLike).filter(
                    PanLike.user_id == user_id,
                    PanLike.pan_id == record.id
                ).first()
                is_liked = like is not None
                
                collect = self.db.query(PanCollect).filter(
                    PanCollect.user_id == user_id,
                    PanCollect.pan_id == record.id
                ).first()
                is_collected = collect is not None
            
            data.append({
                "id": record.id,
                "pan_type": record.pan_type,
                "pan_params": pan_params,
                "pan_result": pan_result,
                "supplement": record.supplement,
                "like_count": record.like_count,
                "collect_count": record.collect_count,
                "comment_count": record.comment_count,
                "view_count": record.view_count,
                "create_time": record.create_time,
                "user": {
                    "id": user.id if user else None,
                    "nickname": user.nickname if user and user.nickname else "六爻用户",
                    "avatar_url": user.avatar if user else None
                },
                "is_liked": is_liked,
                "is_collected": is_collected
            })
        
        return data
    
    def get_pan_detail(
        self,
        record_id: int,
        user_id: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """
        获取排盘记录详情
        
        Args:
            record_id: 排盘记录ID
            user_id: 当前用户ID（可选，用于查询点赞/收藏状态）
        
        Returns:
            排盘记录详情
        """
        # 查询排盘记录
        record = self.db.query(PanRecord).filter(
            PanRecord.id == record_id,
            PanRecord.is_visible == 1,
            PanRecord.deleted_at.is_(None)
        ).first()
        
        if not record:
            return None
        
        # 增加浏览数
        record.view_count += 1
        self.db.commit()
        
        # 解析JSON字符串
        try:
            pan_params = json.loads(record.pan_params)
        except:
            pan_params = record.pan_params
        
        try:
            pan_result = json.loads(record.pan_result)
        except:
            pan_result = record.pan_result
        
        # 获取用户信息
        user = self.db.query(User).filter(User.id == record.user_id).first()
        
        # 查询点赞/收藏状态
        is_liked = False
        is_collected = False
        if user_id:
            like = self.db.query(PanLike).filter(
                PanLike.user_id == user_id,
                PanLike.pan_id == record.id
            ).first()
            is_liked = like is not None
            
            collect = self.db.query(PanCollect).filter(
                PanCollect.user_id == user_id,
                PanCollect.pan_id == record.id
            ).first()
            is_collected = collect is not None
        
        return {
            "id": record.id,
            "pan_type": record.pan_type,
            "pan_params": pan_params,
            "pan_result": pan_result,
            "supplement": record.supplement,
            "like_count": record.like_count,
            "collect_count": record.collect_count,
            "comment_count": record.comment_count,
            "view_count": record.view_count,
            "create_time": record.create_time,
            "user": {
                "id": user.id if user else None,
                "nickname": user.nickname if user and user.nickname else "六爻用户",
                "avatar_url": user.avatar if user else None
            },
            "is_liked": is_liked,
            "is_collected": is_collected
        }
    
    def increment_like_count(self, record_id: int):
        """增加点赞数"""
        record = self.db.query(PanRecord).filter(PanRecord.id == record_id).first()
        if record:
            record.like_count += 1
            self.db.commit()
    
    def decrement_like_count(self, record_id: int):
        """减少点赞数"""
        record = self.db.query(PanRecord).filter(PanRecord.id == record_id).first()
        if record and record.like_count > 0:
            record.like_count -= 1
            self.db.commit()
    
    def increment_collect_count(self, record_id: int):
        """增加收藏数"""
        record = self.db.query(PanRecord).filter(PanRecord.id == record_id).first()
        if record:
            record.collect_count += 1
            self.db.commit()
    
    def decrement_collect_count(self, record_id: int):
        """减少收藏数"""
        record = self.db.query(PanRecord).filter(PanRecord.id == record_id).first()
        if record and record.collect_count > 0:
            record.collect_count -= 1
            self.db.commit()

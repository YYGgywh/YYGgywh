# backend/app/utils/logger.py 2026-03-01 10:00:00
# 功能：系统日志记录工具

import time
from sqlalchemy.orm import Session
from app.models.system_log import SystemLog


def log_system_action(
    db: Session,
    user_id: int,
    action: str,
    module: str,
    target_type: str = None,
    target_id: int = None,
    detail: str = None,
    ip: str = None,
    user_agent: str = None
):
    """
    记录系统操作日志
    
    Args:
        db: 数据库会话
        user_id: 操作用户ID
        action: 操作类型 (login, view, create, update, delete等)
        module: 模块名称 (user, pan, comment, system等)
        target_type: 目标类型
        target_id: 目标ID
        detail: 详细信息
        ip: 客户端IP
        user_agent: 用户代理
    """
    try:
        log = SystemLog(
            user_id=user_id,
            action=action,
            module=module,
            target_type=target_type,
            target_id=target_id,
            detail=detail,
            ip=ip,
            user_agent=user_agent,
            create_time=int(time.time())
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log
    except Exception as e:
        db.rollback()
        print(f"记录日志失败: {e}")
        return None

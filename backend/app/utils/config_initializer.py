# backend/app/utils/config_initializer.py 2026-03-19 10:00:00
# 功能：初始化系统配置，将预定义的配置项插入数据库

from sqlalchemy.orm import Session
from app.models.system_config import SystemConfig
from app.utils.config_manager import ConfigManager


def initialize_system_configs(db: Session) -> dict:
    """
    初始化系统配置
    
    Args:
        db: 数据库会话
    
    Returns:
        初始化结果字典
    """
    result = {
        "created": 0,
        "updated": 0,
        "skipped": 0,
        "errors": []
    }
    
    try:
        config_keys = ConfigManager.get_all_config_keys()
        
        for config_key in config_keys:
            try:
                definition = ConfigManager.get_config_definition(config_key)
                if not definition:
                    result["errors"].append(f"配置项 {config_key} 定义不存在")
                    continue
                
                existing_config = db.query(SystemConfig).filter(
                    SystemConfig.key == config_key
                ).first()
                
                if existing_config:
                    result["skipped"] += 1
                else:
                    new_config = SystemConfig(
                        key=config_key,
                        value=str(definition["default"]),
                        description=definition["description"]
                    )
                    db.add(new_config)
                    result["created"] += 1
            
            except Exception as e:
                result["errors"].append(f"初始化配置项 {config_key} 失败: {str(e)}")
        
        if result["created"] > 0:
            db.commit()
        
        return result
    
    except Exception as e:
        db.rollback()
        result["errors"].append(f"初始化系统配置失败: {str(e)}")
        return result


def sync_rate_limit_configs(db: Session) -> dict:
    """
    同步频率限制配置到中间件
    
    Args:
        db: 数据库会话
    
    Returns:
        同步结果字典
    """
    from app.middleware.rate_limit import RATE_LIMIT_CONFIG
    
    result = {
        "synced": 0,
        "errors": []
    }
    
    try:
        rate_limit_mappings = {
            "rate_limit.send_code.max_requests": "/api/v1/user/send_code",
            "rate_limit.send_code.window": "/api/v1/user/send_code",
            "rate_limit.register.max_requests": "/api/v1/user/register",
            "rate_limit.register.window": "/api/v1/user/register",
            "rate_limit.login.max_requests": "/api/v1/user/login",
            "rate_limit.login.window": "/api/v1/user/login",
            "rate_limit.save_pan.max_requests": "/api/v1/pan/save",
            "rate_limit.save_pan.window": "/api/v1/pan/save",
            "rate_limit.list_pan.max_requests": "/api/v1/pan/list",
            "rate_limit.list_pan.window": "/api/v1/pan/list",
            "rate_limit.add_comment.max_requests": "/api/v1/comment/add",
            "rate_limit.add_comment.window": "/api/v1/comment/add",
            "rate_limit.list_comment.max_requests": "/api/v1/comment/list",
            "rate_limit.list_comment.window": "/api/v1/comment/list",
            "rate_limit.update_comment.max_requests": "/api/v1/comment/update",
            "rate_limit.update_comment.window": "/api/v1/comment/update",
            "rate_limit.delete_comment.max_requests": "/api/v1/comment/delete",
            "rate_limit.delete_comment.window": "/api/v1/comment/delete",
        }
        
        for config_key, path in rate_limit_mappings.items():
            try:
                config = db.query(SystemConfig).filter(
                    SystemConfig.key == config_key
                ).first()
                
                if not config:
                    continue
                
                if path not in RATE_LIMIT_CONFIG:
                    continue
                
                if config_key.endswith(".max_requests"):
                    RATE_LIMIT_CONFIG[path]["max_requests"] = int(config.value)
                elif config_key.endswith(".window"):
                    RATE_LIMIT_CONFIG[path]["window"] = int(config.value)
                
                result["synced"] += 1
            
            except Exception as e:
                result["errors"].append(f"同步配置项 {config_key} 失败: {str(e)}")
        
        return result
    
    except Exception as e:
        result["errors"].append(f"同步频率限制配置失败: {str(e)}")
        return result

# backend/app/utils/config_manager.py 2026-03-19 10:00:00
# 功能：配置管理工具类，用于配置验证和管理

from typing import Dict, Any, Optional, List
from fastapi import HTTPException, status
import re


class ConfigManager:
    """配置管理器，用于配置验证和管理"""
    
    # 配置项定义
    CONFIG_DEFINITIONS = {
        # 应用基础配置
        "app.name": {
            "type": "string",
            "default": "圆运阁古易文化",
            "description": "应用名称",
            "category": "app",
            "is_super_admin_only": False,
            "validation": lambda x: len(x) <= 100
        },
        "app.version": {
            "type": "string",
            "default": "1.0.0",
            "description": "应用版本",
            "category": "app",
            "is_super_admin_only": False,
            "validation": lambda x: bool(re.match(r'^\d+\.\d+\.\d+$', x))
        },
        "app.debug": {
            "type": "boolean",
            "default": "False",
            "description": "调试模式开关",
            "category": "app",
            "is_super_admin_only": True,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
        
        # 频率限制配置
        "rate_limit.send_code.max_requests": {
            "type": "integer",
            "default": "1",
            "description": "验证码发送频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.send_code.window": {
            "type": "integer",
            "default": "60",
            "description": "验证码发送频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 10 <= int(x) <= 3600
        },
        "rate_limit.register.max_requests": {
            "type": "integer",
            "default": "5",
            "description": "注册频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.register.window": {
            "type": "integer",
            "default": "3600",
            "description": "注册频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.login.max_requests": {
            "type": "integer",
            "default": "10",
            "description": "登录频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.login.window": {
            "type": "integer",
            "default": "3600",
            "description": "登录频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.save_pan.max_requests": {
            "type": "integer",
            "default": "20",
            "description": "保存排盘频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.save_pan.window": {
            "type": "integer",
            "default": "3600",
            "description": "保存排盘频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.list_pan.max_requests": {
            "type": "integer",
            "default": "60",
            "description": "查询排盘频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 1000
        },
        "rate_limit.list_pan.window": {
            "type": "integer",
            "default": "3600",
            "description": "查询排盘频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.add_comment.max_requests": {
            "type": "integer",
            "default": "10",
            "description": "添加评论频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.add_comment.window": {
            "type": "integer",
            "default": "3600",
            "description": "添加评论频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.list_comment.max_requests": {
            "type": "integer",
            "default": "60",
            "description": "查询评论频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 1000
        },
        "rate_limit.list_comment.window": {
            "type": "integer",
            "default": "3600",
            "description": "查询评论频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.update_comment.max_requests": {
            "type": "integer",
            "default": "10",
            "description": "更新评论频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.update_comment.window": {
            "type": "integer",
            "default": "3600",
            "description": "更新评论频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        "rate_limit.delete_comment.max_requests": {
            "type": "integer",
            "default": "10",
            "description": "删除评论频率限制（次数）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 100
        },
        "rate_limit.delete_comment.window": {
            "type": "integer",
            "default": "3600",
            "description": "删除评论频率限制（秒）",
            "category": "rate_limit",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 86400
        },
        
        # Token配置
        "token.expire_days": {
            "type": "integer",
            "default": "7",
            "description": "Token有效期（天）",
            "category": "token",
            "is_super_admin_only": True,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 365
        },
        
        # 验证码配置
        "verify_code.expire_time": {
            "type": "integer",
            "default": "600",
            "description": "验证码有效期（秒）",
            "category": "verify_code",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 60 <= int(x) <= 3600
        },
        "verify_code.send_interval": {
            "type": "integer",
            "default": "60",
            "description": "验证码发送间隔（秒）",
            "category": "verify_code",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 30 <= int(x) <= 300
        },
        "verify_code.max_daily_send": {
            "type": "integer",
            "default": "5",
            "description": "单日最多发送验证码次数",
            "category": "verify_code",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1 <= int(x) <= 20
        },
        
        # 用户功能配置
        "user.auto_save_enabled": {
            "type": "boolean",
            "default": "True",
            "description": "用户注册自动保存功能开关",
            "category": "user",
            "is_super_admin_only": False,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
        "user.avatar_max_size": {
            "type": "integer",
            "default": "2097152",
            "description": "用户头像最大尺寸（字节）",
            "category": "user",
            "is_super_admin_only": False,
            "validation": lambda x: x.isdigit() and 1048576 <= int(x) <= 10485760
        },
        
        # 内容管理配置
        "content.pan_audit_enabled": {
            "type": "boolean",
            "default": "False",
            "description": "排盘记录审核开关",
            "category": "content",
            "is_super_admin_only": False,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
        "content.comment_audit_enabled": {
            "type": "boolean",
            "default": "False",
            "description": "评论审核开关",
            "category": "content",
            "is_super_admin_only": False,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
        "content.sensitive_word_filter_enabled": {
            "type": "boolean",
            "default": "True",
            "description": "敏感词过滤开关",
            "category": "content",
            "is_super_admin_only": False,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
        "content.publish_audit_enabled": {
            "type": "boolean",
            "default": "False",
            "description": "内容发布审核开关",
            "category": "content",
            "is_super_admin_only": False,
            "validation": lambda x: x in ["True", "False", "true", "false"]
        },
    }
    
    @classmethod
    def get_config_definition(cls, config_key: str) -> Optional[Dict[str, Any]]:
        """
        获取配置项定义
        
        Args:
            config_key: 配置键
        
        Returns:
            配置项定义，如果不存在则返回None
        """
        return cls.CONFIG_DEFINITIONS.get(config_key)
    
    @classmethod
    def validate_config(cls, config_key: str, value: str) -> tuple[bool, str]:
        """
        验证配置值
        
        Args:
            config_key: 配置键
            value: 配置值
        
        Returns:
            (是否有效, 错误信息)
        """
        definition = cls.get_config_definition(config_key)
        if not definition:
            return False, f"配置项 {config_key} 不存在"
        
        try:
            if not definition["validation"](value):
                return False, f"配置值 {value} 不符合要求"
            return True, ""
        except Exception as e:
            return False, f"配置验证失败: {str(e)}"
    
    @classmethod
    def get_all_config_keys(cls) -> List[str]:
        """
        获取所有配置键
        
        Returns:
            配置键列表
        """
        return list(cls.CONFIG_DEFINITIONS.keys())
    
    @classmethod
    def get_configs_by_category(cls, category: str) -> Dict[str, Dict[str, Any]]:
        """
        根据分类获取配置
        
        Args:
            category: 配置分类
        
        Returns:
            配置字典
        """
        return {
            key: definition
            for key, definition in cls.CONFIG_DEFINITIONS.items()
            if definition["category"] == category
        }
    
    @classmethod
    def get_all_categories(cls) -> List[str]:
        """
        获取所有配置分类
        
        Returns:
            配置分类列表
        """
        categories = set()
        for definition in cls.CONFIG_DEFINITIONS.values():
            categories.add(definition["category"])
        return sorted(list(categories))

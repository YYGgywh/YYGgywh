# backend/init_configs.py 2026-03-19 10:00:00
# 功能：初始化系统配置，将预定义的配置项插入数据库

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.models.system_config import SystemConfig
from app.utils.config_manager import ConfigManager


def init_database_tables():
    """创建数据库表（如果不存在）"""
    print("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成")


def initialize_system_configs():
    """初始化系统配置"""
    db = SessionLocal()
    try:
        print("开始初始化系统配置...")
        
        config_keys = ConfigManager.get_all_config_keys()
        created_count = 0
        skipped_count = 0
        
        for config_key in config_keys:
            definition = ConfigManager.get_config_definition(config_key)
            if not definition:
                print(f"配置项 {config_key} 定义不存在，跳过")
                continue
            
            # 检查配置项是否已存在
            existing_config = db.query(SystemConfig).filter(
                SystemConfig.key == config_key
            ).first()
            
            if existing_config:
                print(f"配置项 {config_key} 已存在，跳过")
                skipped_count += 1
            else:
                # 创建新配置项
                new_config = SystemConfig(
                    key=config_key,
                    value=str(definition["default"]),
                    description=definition["description"]
                )
                db.add(new_config)
                created_count += 1
                print(f"创建配置项: {config_key} = {definition['default']}")
        
        db.commit()
        print(f"\n初始化完成！")
        print(f"创建: {created_count} 个配置项")
        print(f"跳过: {skipped_count} 个配置项")
        
    except Exception as e:
        db.rollback()
        print(f"初始化失败: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


def sync_rate_limit_configs():
    """同步频率限制配置到中间件"""
    from app.middleware.rate_limit import RATE_LIMIT_CONFIG, update_rate_limit_config
    
    db = SessionLocal()
    try:
        print("\n开始同步频率限制配置...")
        
        rate_limit_configs = db.query(SystemConfig).filter(
            SystemConfig.key.like("rate_limit.%")
        ).all()
        
        synced_count = 0
        for config in rate_limit_configs:
            if update_rate_limit_config(config.key, config.value):
                synced_count += 1
                print(f"同步配置: {config.key} = {config.value}")
        
        print(f"同步完成！共同步 {synced_count} 个频率限制配置")
        
        # 打印当前频率限制配置
        print("\n当前频率限制配置:")
        for path, config in RATE_LIMIT_CONFIG.items():
            print(f"  {path}: {config['max_requests']}次/{config['window']}秒")
        
    except Exception as e:
        print(f"同步失败: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("系统配置初始化工具")
    print("=" * 60)
    
    # 创建数据库表
    init_database_tables()
    
    # 初始化系统配置
    initialize_system_configs()
    
    # 同步频率限制配置
    sync_rate_limit_configs()
    
    print("\n" + "=" * 60)
    print("初始化完成！")
    print("=" * 60)

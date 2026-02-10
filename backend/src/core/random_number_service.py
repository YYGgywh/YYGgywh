# backend/src/core/random_number_service.py 2024-12-19 14:30:00
# 功能：随机数生成服务模块，封装业务逻辑和错误处理

import logging
from typing import List, Dict, Any, Optional
# datetime模块已移除，使用lunar库替代
from fastapi import HTTPException
from ..algorithms.random_number__calculator import RandomGenerator

# 配置日志
logger = logging.getLogger(__name__)

# 辅助函数：获取当前时间戳字符串
def _get_timestamp() -> str:
    from datetime import datetime
    from lunar_python import Solar
    now = datetime.now()
    solar = Solar.fromDate(now)
    return solar.toYmdHms()

# 随机数生成服务类
class RandomNumberService:
    
    # 生成0~9随机数字服务方法
    def get_random_digit(self) -> Dict[str, Any]:
        try:
            # 调用随机数生成器
            digit = RandomGenerator.random_digit()
            
            # 构建响应
            result = {
                "digit": digit,
                "method": "uniform",
                "description": "生成0~9之间的随机数字",
                "timestamp": _get_timestamp()
            }
            
            logger.info(f"成功生成随机数字: {result}")
            return result
            
        except Exception as e:
            logger.error(f"随机数字生成失败: {str(e)}")
            raise HTTPException(status_code=500, detail="随机数字生成失败")
    
    # 生成三个随机数字字符串服务方法
    def get_random_three_digits(self) -> Dict[str, Any]:
        try:
            # 调用随机数生成器 - 生成三个随机数字的字符串
            digit_str, parity_str, odd_count = RandomGenerator.random_three_digits()
            
            # 构建响应
            result = {
                "three_digits": digit_str,
                "parity_str": parity_str,
                "odd_count": odd_count,
                "method": "uniform",
                "description": "生成三个随机数字的字符串",
                "timestamp": _get_timestamp()
            }
            
            logger.info(f"成功生成三个随机数字字符串: {result}")
            return result
            
        except Exception as e:
            logger.error(f"三个随机数字字符串生成失败: {str(e)}")
            raise HTTPException(status_code=500, detail="三个随机数字字符串生成失败")
    
    # 随机选择六十甲子干支服务方法
    def get_random_jiazi(self) -> Dict[str, Any]:
        try:
            # 调用随机数生成器 - 从六十甲子中随机选择一个干支
            jiazi = RandomGenerator.random_jiazi()
            
            # 构建响应
            result = {
                "jiazi": jiazi,
                "index": RandomGenerator.JIAZI_LIST.index(jiazi) + 1,
                "total_count": len(RandomGenerator.JIAZI_LIST),
                "method": "uniform",
                "description": "从六十甲子中随机选择一个干支",
                "timestamp": _get_timestamp()
            }
            
            logger.info(f"成功随机选择干支: {result}")
            return result
            
        except Exception as e:
            logger.error(f"随机干支选择失败: {str(e)}")
            raise HTTPException(status_code=500, detail="随机干支选择失败")


# 创建服务实例
random_number_service = RandomNumberService()


# 默认导出
__all__ = [
    'RandomNumberService',
    'random_number_service'
]
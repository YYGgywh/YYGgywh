# backend/src/utils/service_decorators.py 2026-02-11 13:30:00
# 功能：服务层装饰器工具，提供统一的错误处理和日志记录

import logging  # 导入日志模块，用于记录服务层操作日志
from functools import wraps  # 导入functools.wraps装饰器，用于保留被装饰函数的元数据
from typing import Callable, Any  # 导入类型注解工具，用于函数类型定义和任意类型
# 导入业务异常类，用于服务层错误处理
from exceptions.business_exceptions import (
    RandomDigitException,  # 随机数字异常：处理单个随机数字生成错误
    RandomThreeDigitsException,  # 随机三位数异常：处理三位随机数字生成错误
    RandomJiaziException,  # 随机干支异常：处理干支序列生成错误
    SolarValidationException,  # 公历时间验证异常：处理公历时间验证错误
    LunarValidationException  # 农历时间验证异常：处理农历时间验证错误
)

logger = logging.getLogger(__name__)  # 创建日志记录器实例，使用当前模块名称


# 定义统一服务层错误处理装饰器
def handle_service_errors(success_message: str, exception_class):
    
    # 定义装饰器函数，接收被装饰的函数
    def decorator(func: Callable) -> Callable:
        @wraps(func)  # 使用wraps装饰器保留原函数的名称、文档字符串等元数据
        # 定义包装函数，处理服务层函数调用
        def wrapper(*args, **kwargs) -> Any:
            try:
                result = func(*args, **kwargs)  # 执行被装饰的服务层函数
                logger.info(f"{success_message}: {result}")  # 记录成功日志，包含操作结果
                return result  # 返回函数执行结果
            
            # 捕获所有异常
            except Exception as e:
                logger.error(f"{success_message}失败: {str(e)}")  # 记录错误日志，包含异常信息
                raise exception_class()  # 抛出指定的业务异常
            
        return wrapper  # 返回包装函数
    
    return decorator  # 返回装饰器函数


# 定义随机数字服务错误处理装饰器
handle_random_digit_service_errors = handle_service_errors(
    "成功生成随机数字",  # 成功日志消息模板
    RandomDigitException  # 对应的业务异常类
)

# 定义随机三位数服务错误处理装饰器
handle_random_three_digits_service_errors = handle_service_errors(
    "成功生成三个随机数字字符串",  # 成功日志消息模板
    RandomThreeDigitsException  # 对应的业务异常类
)

# 定义随机干支服务错误处理装饰器
handle_random_jiazi_service_errors = handle_service_errors(
    "成功随机选择干支",  # 成功日志消息模板
    RandomJiaziException  # 对应的业务异常类
)

# 定义公历时间验证服务错误处理装饰器
handle_solar_validation_service_errors = handle_service_errors(
    "成功验证公历时间",  # 成功日志消息模板
    SolarValidationException  # 对应的业务异常类
)

# 定义农历时间验证服务错误处理装饰器
handle_lunar_validation_service_errors = handle_service_errors(
    "成功验证农历时间",  # 成功日志消息模板
    LunarValidationException  # 对应的业务异常类
)


# 默认导出列表（定义模块的公开导出列表）
__all__ = [
    'handle_service_errors',  # 导出基础错误处理装饰器
    'handle_random_digit_service_errors',  # 导出随机数字装饰器
    'handle_random_three_digits_service_errors',  # 导出随机三位数装饰器
    'handle_random_jiazi_service_errors',  # 导出随机干支装饰器
    'handle_solar_validation_service_errors',  # 导出公历时间验证装饰器
    'handle_lunar_validation_service_errors'  # 导出农历时间验证装饰器
]
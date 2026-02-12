# backend/src/utils/api_decorators.py 2026-02-11 12:30:00
# 功能：API装饰器工具，提供统一的错误处理和响应格式化

from functools import wraps  # 导入functools.wraps装饰器，用于保留被装饰函数的元数据
from fastapi import HTTPException  # 导入FastAPI的HTTP异常类，用于抛出标准HTTP错误响应
from typing import Callable, Any  # 导入类型注解工具，用于函数类型定义和任意类型
from .error_codes import ErrorCode  # 导入自定义错误码枚举，定义标准化的错误类型
from .response_formatter import ResponseFormatter  # 导入响应格式化工具，统一API响应格式
# 导入业务异常类，用于捕获和处理业务层抛出的异常
from exceptions.business_exceptions import (
    RandomDigitException,  # 随机数字异常：处理单个随机数字生成错误
    RandomThreeDigitsException,  # 随机三位数异常：处理三位随机数字生成错误
    RandomJiaziException,  # 随机干支异常：处理干支序列生成错误
    SolarValidationException,  # 公历时间验证异常：处理公历时间验证错误
    LunarValidationException  # 农历时间验证异常：处理农历时间验证错误
)


# 统一API错误处理装饰器，为API接口提供标准化的异常处理机制
def handle_api_errors(error_code: ErrorCode, error_message: str = None):
    
    # 定义装饰器函数，接收被装饰的函数
    def decorator(func: Callable) -> Callable:
        @wraps(func)  # 使用wraps装饰器保留原函数的名称、文档字符串等元数据

        # 定义异步包装函数，处理API请求
        async def wrapper(*args, **kwargs) -> Any:

            # 执行被装饰的API函数，获取正常结果
            try:
                result = await func(*args, **kwargs)  # 异步等待函数执行完成
                return result  # 返回正常结果，不进行任何修改
            
            # 重新抛出HTTP异常，不进行额外处理
            except HTTPException:
                raise  # 直接重新抛出，保持原有的HTTP异常状态和消息

            # 处理业务异常，将业务异常转换为标准HTTP错误响应
            except (RandomDigitException, RandomThreeDigitsException, RandomJiaziException, 
                   SolarValidationException, LunarValidationException) as e:
                message = error_message or str(e)  # 优先使用自定义消息，否则使用异常消息
                # 创建标准错误响应
                error_response = ResponseFormatter.create_error_response(
                    error_code,  # 传入错误码枚举
                    message  # 错误消息
                )
                raise HTTPException(status_code=500, detail=error_response)  # 抛出500内部服务器错误
            
            # 统一处理其他未预期的异常，确保系统稳定性
            except Exception as e:
                message = error_message or f"{error_code.value[1]}: {str(e)}"  # 组合错误消息
                # 创建标准错误响应
                error_response = ResponseFormatter.create_error_response(
                    error_code,  # 传入错误码枚举
                    message  # 错误消息
                )
                raise HTTPException(status_code=500, detail=error_response)  # 抛出500内部服务器错误
            
        return wrapper  # 返回包装后的函数
    
    return decorator  # 返回装饰器函数


# 预定义的错误处理装饰器，为特定API功能提供专用错误处理

# 随机数字生成API错误处理装饰器
handle_random_digit_errors = handle_api_errors(
    ErrorCode.RANDOM_DIGIT_GENERATION_FAILED,  # 使用随机数字生成失败错误码
    "随机数字生成失败"  # 自定义错误消息
)

# 三个随机数字生成API错误处理装饰器
handle_random_three_digits_errors = handle_api_errors(
    ErrorCode.RANDOM_THREE_DIGITS_GENERATION_FAILED,  # 使用三个随机数字生成失败错误码
    "随机数字字符串生成失败"  # 自定义错误消息
)

# 随机干支选择API错误处理装饰器
handle_random_jiazi_errors = handle_api_errors(
    ErrorCode.RANDOM_JIAZI_SELECTION_FAILED,  # 使用随机干支选择失败错误码
    "随机干支选择失败"  # 自定义错误消息
)

# 公历时间验证API错误处理装饰器
handle_solar_validation_errors = handle_api_errors(
    ErrorCode.SOLAR_VALIDATION_FAILED,  # 使用公历时间验证失败错误码
    "公历时间验证失败"  # 自定义错误消息
)

# 农历时间验证API错误处理装饰器
handle_lunar_validation_errors = handle_api_errors(
    ErrorCode.LUNAR_VALIDATION_FAILED,  # 使用农历时间验证失败错误码
    "农历时间验证失败"  # 自定义错误消息
)


# 默认导出列表，定义模块的公共接口（指定可以从模块中导入的名称）
__all__ = [
    'handle_api_errors',  # 导出通用错误处理装饰器，便于自定义扩展
    'handle_random_digit_errors',  # 导出随机数字错误处理装饰器
    'handle_random_three_digits_errors',  # 导出三个随机数字错误处理装饰器
    'handle_random_jiazi_errors',  # 导出随机干支错误处理装饰器
    'handle_solar_validation_errors',  # 导出公历时间验证错误处理装饰器
    'handle_lunar_validation_errors'  # 导出农历时间验证错误处理装饰器
]
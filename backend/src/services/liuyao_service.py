# backend/src/services/liuyao_service.py 2026-02-14 12:15:00
# 功能：六爻排盘服务模块，封装六爻排盘业务逻辑和Service层验证

import logging  # 导入Python标准日志模块，用于记录服务运行日志
from typing import Dict, Any  # 导入类型注解工具，用于字典和任意类型定义
from validators.liuyao_validator import liuyao_validator  # 导入六爻验证器实例，用于验证爻位数据
from validators.calendar_validator import calendar_validator  # 导入日历验证器实例，用于验证时间参数
from core.liuyao_algorithm_core import LiuYaoAlgorithmCore  # 导入六爻算法核心实例，用于执行六爻排盘计算
from exceptions.business_exceptions import BusinessException  # 导入业务异常基类，用于定义六爻相关异常

logger = logging.getLogger(__name__)  # 配置日志系统，获取当前模块的日志记录器实例


# 定义六爻排盘业务异常类
class LiuyaoValidationException(BusinessException):
    """六爻验证业务异常"""
    
    def __init__(self, message: str):
        super().__init__(message, "LIUYAO_VALIDATION_ERROR")


# 定义六爻排盘计算业务异常类
class LiuyaoCalculationException(BusinessException):
    """六爻计算业务异常"""
    
    def __init__(self, message: str):
        super().__init__(message, "LIUYAO_CALCULATION_ERROR")


# 定义统一服务层错误处理装饰器
def handle_liuyao_service_errors(success_message: str, exception_class):
    """定义统一服务层错误处理装饰器"""
    
    # 定义装饰器函数，接收被装饰的函数
    def decorator(func):
        from functools import wraps  # 导入functools.wraps装饰器，用于保留被装饰函数的元数据
        
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
                raise exception_class(str(e))  # 抛出指定的业务异常，传递原始错误信息
            
        return wrapper  # 返回包装函数
    
    return decorator  # 返回装饰器函数


# 定义六爻排盘服务错误处理装饰器
handle_liuyao_calculation_service_errors = handle_liuyao_service_errors(
    "成功计算六爻排盘",  # 成功日志消息模板
    LiuyaoCalculationException  # 对应的业务异常类
)


# 六爻排盘服务类，封装所有六爻排盘相关的业务逻辑
class LiuYaoService:
    
    # 初始化六爻排盘服务类
    def __init__(self):
        self.liuyao_algorithm_core = LiuYaoAlgorithmCore()  # 创建六爻算法核心实例，用于执行排盘计算
    
    # 六爻排盘计算服务方法
    @handle_liuyao_calculation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录
    def calculate_liuyao_with_solar_calendar(
        self,
        yao_list: list,
        year: int,
        month: int,
        day: int,
        hour: int = 0,
        minute: int = 0,
        second: int = 0
    ) -> Dict[str, Any]:
        """使用公历日期计算六爻排盘"""
        # 第一层验证：在Service层验证爻位数据
        validation_result = liuyao_validator.validate_yao_data(yao_list)
        if not validation_result["valid"]:
            error_msg = validation_result.get("error", "爻位数据验证失败")
            logger.warning(f"Service层验证失败: {error_msg}")
            raise ValueError(f"[Service层验证] {error_msg}")
        
        # 第二层验证：在Service层验证公历时间参数
        time_validation_result = calendar_validator.validate_solar_input(
            str(year), str(month), str(day), str(hour), str(minute), str(second)
        )
        if not time_validation_result["valid"]:
            error_msg = time_validation_result.get('error', '公历时间验证失败')
            logger.warning(f"Service层验证失败: {error_msg}")
            raise ValueError(f"[Service层验证] {error_msg}")
        
        # 调用Core层进行六爻排盘计算（跳过Core层重复验证）
        paipan_result = self.liuyao_algorithm_core.calculate_paipan_with_solar_calendar(
            yao_list=yao_list,
            year=year,
            month=month,
            day=day,
            hour=hour,
            minute=minute,
            second=second,
            validate=False  # Service层已验证，跳过Core层重复验证
        )
        
        return paipan_result  # 返回排盘结果
    
    # 六爻排盘计算服务方法（农历）
    @handle_liuyao_calculation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录
    def calculate_liuyao_with_lunar_calendar(
        self,
        yao_list: list,
        lunar_year: int,
        lunar_month: int,
        lunar_day: int,
        hour: int = 0,
        minute: int = 0,
        second: int = 0,
        is_leap_month: bool = False
    ) -> Dict[str, Any]:
        """使用农历日期计算六爻排盘"""
        # 第一层验证：在Service层验证爻位数据
        validation_result = liuyao_validator.validate_yao_data(yao_list)
        if not validation_result["valid"]:
            error_msg = validation_result.get("error", "爻位数据验证失败")
            logger.warning(f"Service层验证失败: {error_msg}")
            raise ValueError(f"[Service层验证] {error_msg}")
        
        # 第二层验证：在Service层验证农历时间参数
        time_validation_result = calendar_validator.validate_lunar_input(
            str(lunar_year), str(lunar_month), str(lunar_day), str(hour), str(minute), str(second), str(is_leap_month)
        )
        if not time_validation_result["valid"]:
            error_msg = time_validation_result.get('error', '农历时间验证失败')
            logger.warning(f"Service层验证失败: {error_msg}")
            raise ValueError(f"[Service层验证] {error_msg}")
        
        # 调用Core层进行六爻排盘计算（跳过Core层重复验证）
        paipan_result = self.liuyao_algorithm_core.calculate_paipan_with_lunar_calendar(
            yao_list=yao_list,
            lunar_year=lunar_year,
            lunar_month=lunar_month,
            lunar_day=lunar_day,
            hour=hour,
            minute=minute,
            second=second,
            is_leap_month=is_leap_month,
            validate=False  # Service层已验证，跳过Core层重复验证
        )
        
        return paipan_result  # 返回排盘结果


# 创建全局服务实例，便于其他模块直接使用
liuyao_service = LiuYaoService()  # 实例化LiuYaoService类，创建全局服务实例供其他模块使用


# 默认导出列表（定义模块的公开导出列表）
__all__ = [
    'LiuYaoService',  # 导出六爻排盘服务类
    'LiuyaoValidationException',  # 导出六爻验证业务异常类
    'LiuyaoCalculationException',  # 导出六爻计算业务异常类
    'handle_liuyao_service_errors',  # 导出基础错误处理装饰器
    'handle_liuyao_calculation_service_errors',  # 导出六爻排盘计算错误处理装饰器
    'liuyao_service'  # 导出全局服务实例
]

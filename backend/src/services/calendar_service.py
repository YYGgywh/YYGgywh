# backend/src/services/calendar_service.py 2026-02-13 13:00:00
# 功能：日历验证服务模块，封装时间验证业务逻辑和错误处理

import logging  # 导入Python标准日志模块，用于记录服务运行日志
from datetime import datetime  # 导入datetime模块，用于生成时间戳
from validators.calendar_validator import calendar_validator  # 导入日历验证器实例，用于验证公历和农历时间参数
from models.dto_models import SolarValidationDTO, LunarValidationDTO, SolarConversionDTO, LunarConversionDTO  # 导入数据传输对象模型，用于标准化API响应格式
from core.calendar_algorithm_core import calendar_algorithm_core  # 导入历法算法核心实例，用于执行历法转换计算
# 导入服务层错误处理装饰器，提供统一的异常处理机制
from utils.service_decorators import (
    handle_solar_validation_service_errors,  # 公历时间验证错误处理装饰器
    handle_lunar_validation_service_errors,  # 农历时间验证错误处理装饰器
    handle_solar_conversion_service_errors,  # 公历转换错误处理装饰器
    handle_lunar_conversion_service_errors  # 农历转换错误处理装饰器
)

logger = logging.getLogger(__name__)  # 配置日志系统，获取当前模块的日志记录器实例

# 日历验证服务类，封装所有时间验证相关的业务逻辑
class CalendarService:
    # 私有方法：构建标准化的验证结果DTO
    def _build_validation_dto(self, validation_result, dto_class, default_success_msg):
        # 判断验证是否通过
        if validation_result["valid"]:
            logger.debug(f"{default_success_msg}")  # 记录验证成功的调试日志
            # 构建并返回验证成功的DTO对象
            return dto_class(
                valid=True,  # 设置验证结果为有效
                message=validation_result.get("message", default_success_msg),  # 获取成功消息，设置到DTO中
                error=None  # 设置错误信息为空
            )
        # 验证未通过
        else:
            error_msg = validation_result.get("error", f"{default_success_msg}失败")  # 获取错误信息，设置默认值
            logger.warning(f"{default_success_msg}失败: {error_msg}")  # 记录验证失败的警告日志
            return dto_class(  # 构建并返回验证失败的DTO对象
                valid=False,  # 设置验证结果为无效
                message=None,  # 设置成功消息为空
                error=error_msg  # 获取错误信息，设置到DTO中
            )
    
    # 私有方法：确保所有参数为字符串类型
    def _ensure_string_params(self, *params):
        
        try:
            return tuple(str(param) for param in params)  # 遍历所有参数，转换为字符串并返回元组
        except (ValueError, TypeError) as e:  # 捕获类型转换异常
            raise ValueError(f"参数类型转换失败：{str(e)}")  # 抛出新的ValueError异常，包含具体错误信息
    
    # 私有方法：确保所有参数为整数类型
    def _ensure_int_params(self, *params):
        
        try:
            return tuple(int(param) for param in params)  # 遍历所有参数，转换为整数并返回元组
        except (ValueError, TypeError) as e:  # 捕获类型转换异常
            raise ValueError(f"参数类型转换失败：{str(e)}")  # 抛出新的ValueError异常，包含具体错误信息
    
    # 公历时间验证服务方法
    @handle_solar_validation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为公历验证结果DTO对象
    def validate_solar_time(self, year, month, day, hour, minute, second) -> SolarValidationDTO:
        logger.info(f"验证公历时间: {year}-{month}-{day} {hour}:{minute}:{second}")  # 记录验证请求的信息日志
        
        try:
            # 确保所有参数为字符串类型
            year, month, day, hour, minute, second = self._ensure_string_params(
                year, month, day, hour, minute, second
            )
            # 调用日历验证器 - 验证公历时间参数的有效性和合法性
            validation_result = calendar_validator.validate_solar_input(
                year=year,  # 传入公历年参数
                month=month,  # 传入公历月参数
                day=day,  # 传入公历日参数
                hour=hour,  # 传入小时参数
                minute=minute,  # 传入分钟参数
                second=second  # 传入秒数参数
            )
            
            # 根据验证结果构建并返回标准化的DTO响应对象
            return self._build_validation_dto(
                validation_result, SolarValidationDTO, "公历时间验证通过"
            )
        # 捕获验证过程中可能发生的所有异常
        except Exception as e:
            logger.error(f"验证过程中发生错误: {str(e)}")  # 记录验证错误的错误日志
            return SolarValidationDTO(  # 构建并返回验证错误的DTO对象
                valid=False,  # 设置验证结果为无效
                message=None,  # 设置成功消息为空
                error=f"验证过程中发生错误: {str(e)}"  # 设置错误信息为具体的异常信息
            )
    
    # 农历时间验证服务方法
    @handle_lunar_validation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为农历验证结果DTO对象
    def validate_lunar_time(self, lunar_year, lunar_month, lunar_day, is_leap_month, hour, minute, second) -> LunarValidationDTO:
        logger.info(f"验证农历时间: {lunar_year}年{lunar_month}月{lunar_day}日 (闰月: {is_leap_month}) {hour}:{minute}:{second}")  # 记录验证请求的信息日志
        
        try:
            # 确保所有参数为字符串类型
            lunar_year, lunar_month, lunar_day, is_leap_month, hour, minute, second = self._ensure_string_params(
                lunar_year, lunar_month, lunar_day, is_leap_month, hour, minute, second
            )            
            # 调用日历验证器 - 验证农历时间参数的有效性和合法性
            validation_result = calendar_validator.validate_lunar_input(
                lunar_year=lunar_year,  # 传入农历年参数
                lunar_month=lunar_month,  # 传入农历月参数
                lunar_day=lunar_day,  # 传入农历日参数
                is_leap_month=is_leap_month,  # 传入是否闰月参数
                hour=hour,  # 传入小时参数
                minute=minute,  # 传入分钟参数
                second=second  # 传入秒数参数
            )
            
            # 根据验证结果构建并返回标准化的DTO响应对象
            return self._build_validation_dto(
                validation_result, LunarValidationDTO, "农历时间验证通过"
            )
            
        except Exception as e:  # 捕获验证过程中可能发生的所有异常
            logger.error(f"验证过程中发生错误: {str(e)}")  # 记录验证错误的错误日志
            return LunarValidationDTO(  # 构建并返回验证错误的DTO对象
                valid=False,  # 设置验证结果为无效
                message=None,  # 设置成功消息为空
                error=f"验证过程中发生错误: {str(e)}"  # 设置错误信息为具体的异常信息
            )
    
    # 公历转农历转换服务方法
    @handle_solar_conversion_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为公历转换结果DTO对象
    def convert_solar_to_lunar(self, year, month, day, hour=0, minute=0, second=0) -> SolarConversionDTO:
        logger.info(f"公历转农历: {year}-{month}-{day} {hour}:{minute}:{second}")  # 记录转换请求的信息日志
        
        try:
            # 确保所有参数为整数类型
            year, month, day, hour, minute, second = self._ensure_int_params(
                year, month, day, hour, minute, second
            )
            
            # 第一层验证：在Service层验证公历时间参数
            validation_result = calendar_validator.validate_solar_input(
                str(year), str(month), str(day), str(hour), str(minute), str(second)
            )
            if not validation_result["valid"]:
                error_msg = validation_result.get('error', '公历时间验证失败')
                logger.warning(f"公历时间验证失败: {error_msg}")
                raise ValueError(f"[Service层验证] {error_msg}")
            
            # 调用核心算法进行转换
            result = calendar_algorithm_core.convert_solar_to_lunar(
                year=year,  # 传入公历年参数
                month=month,  # 传入公历月参数
                day=day,  # 传入公历日参数
                hour=hour,  # 传入小时参数
                minute=minute,  # 传入分钟参数
                second=second  # 传入秒数参数
            )
            
            logger.debug("公历转农历成功")  # 记录转换成功的调试日志
            return SolarConversionDTO(**result)  # 构建并返回转换成功的DTO对象
            
        except Exception as e:  # 捕获转换过程中可能发生的所有异常
            logger.error(f"转换过程中发生错误: {str(e)}")  # 记录转换错误的错误日志
            raise ValueError(f"转换过程中发生错误: {str(e)}")  # 抛出新的ValueError异常，包含具体错误信息
    
    # 农历转公历转换服务方法
    @handle_lunar_conversion_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为农历转换结果DTO对象
    def convert_lunar_to_solar(self, lunar_year, lunar_month, lunar_day, hour=0, minute=0, second=0, is_leap_month=False) -> LunarConversionDTO:
        logger.info(f"农历转公历: {lunar_year}年{lunar_month}月{lunar_day}日 (闰月: {is_leap_month}) {hour}:{minute}:{second}")  # 记录转换请求的信息日志
        
        try:
            # 确保所有参数为整数类型
            lunar_year, lunar_month, lunar_day, hour, minute, second = self._ensure_int_params(
                lunar_year, lunar_month, lunar_day, hour, minute, second
            )
            
            # 第一层验证：在Service层验证农历时间参数
            validation_result = calendar_validator.validate_lunar_input(
                str(lunar_year), str(lunar_month), str(lunar_day),
                str(hour), str(minute), str(second), str(is_leap_month)
            )
            if not validation_result["valid"]:
                error_msg = validation_result.get('error', '农历时间验证失败')
                logger.warning(f"农历时间验证失败: {error_msg}")
                raise ValueError(f"[Service层验证] {error_msg}")
            
            # 调用核心算法进行转换
            result = calendar_algorithm_core.convert_lunar_to_solar(
                lunar_year=lunar_year,  # 传入农历年参数
                lunar_month=lunar_month,  # 传入农历月参数
                lunar_day=lunar_day,  # 传入农历日参数
                hour=hour,  # 传入小时参数
                minute=minute,  # 传入分钟参数
                second=second,  # 传入秒数参数
                is_leap_month=is_leap_month  # 传入是否闰月参数
            )
            
            logger.debug("农历转公历成功")  # 记录转换成功的调试日志
            return LunarConversionDTO(**result)  # 构建并返回转换成功的DTO对象
            
        except Exception as e:  # 捕获转换过程中可能发生的所有异常
            logger.error(f"转换过程中发生错误: {str(e)}")  # 记录转换错误的错误日志
            raise ValueError(f"转换过程中发生错误: {str(e)}")  # 抛出新的ValueError异常，包含具体错误信息


calendar_service = CalendarService()  # 创建服务实例，采用单例模式提供全局服务访问（实例化服务类，供API层调用）


# 默认导出列表，定义模块的公共接口（指定哪些名称可以从模块中导入）
__all__ = [
    'CalendarService',  # 导出服务类，便于测试和扩展
    'calendar_service'  # 导出服务实例，供API层直接使用
]

# backend/src/services/calendar_service.py 2026-02-12 16:00:00
# 功能：日历验证服务模块，封装时间验证业务逻辑和错误处理

import logging  # 导入Python标准日志模块，用于记录服务运行日志
from validators.calendar_validator import calendar_validator  # 导入日历验证器实例，用于验证公历和农历时间参数
from models.dto_models import SolarValidationDTO, LunarValidationDTO  # 导入数据传输对象模型，用于标准化API响应格式
# 导入服务层错误处理装饰器，提供统一的异常处理机制
from utils.service_decorators import (
    handle_solar_validation_service_errors,  # 公历时间验证错误处理装饰器
    handle_lunar_validation_service_errors  # 农历时间验证错误处理装饰器
)

logger = logging.getLogger(__name__)  # 配置日志系统，获取当前模块的日志记录器实例

# 日历验证服务类，封装所有时间验证相关的业务逻辑
class CalendarService:
    
    # 公历时间验证服务方法
    @handle_solar_validation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为公历验证结果DTO对象
    def validate_solar_time(self, year, month, day, hour, minute, second) -> SolarValidationDTO:
        validation_result = calendar_validator.validate_solar_input(  # 调用日历验证器 - 验证公历时间参数的有效性和合法性
            year=year,  # 传入公历年参数
            month=month,  # 传入公历月参数
            day=day,  # 传入公历日参数
            hour=hour,  # 传入小时参数
            minute=minute,  # 传入分钟参数
            second=second  # 传入秒数参数
        )
        
        # 根据验证结果构建并返回标准化的DTO响应对象
        if validation_result["valid"]:  # 判断验证是否通过
            return SolarValidationDTO(
                valid=True,  # 设置验证结果为有效
                message=validation_result.get("message", "公历时间验证通过"),  # 获取成功消息，设置到DTO中
                error=None  # 设置错误信息为空
            )
        else:  # 验证未通过
            return SolarValidationDTO(
                valid=False,  # 设置验证结果为无效
                message=None,  # 设置成功消息为空
                error=validation_result.get("error", "公历时间验证失败")  # 获取错误信息，设置到DTO中
            )
    
    # 农历时间验证服务方法
    @handle_lunar_validation_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为农历验证结果DTO对象
    def validate_lunar_time(self, lunar_year, lunar_month, lunar_day, is_leap_month, hour, minute, second) -> LunarValidationDTO:
        validation_result = calendar_validator.validate_lunar_input(  # 调用日历验证器 - 验证农历时间参数的有效性和合法性
            lunar_year=lunar_year,  # 传入农历年参数
            lunar_month=lunar_month,  # 传入农历月参数
            lunar_day=lunar_day,  # 传入农历日参数
            is_leap_month=is_leap_month,  # 传入是否闰月参数
            hour=hour,  # 传入小时参数
            minute=minute,  # 传入分钟参数
            second=second  # 传入秒数参数
        )
        
        # 根据验证结果构建并返回标准化的DTO响应对象
        if validation_result["valid"]:  # 判断验证是否通过
            return LunarValidationDTO(
                valid=True,  # 设置验证结果为有效
                message=validation_result.get("message", "农历时间验证通过"),  # 获取成功消息，设置到DTO中
                error=None  # 设置错误信息为空
            )
        else:  # 验证未通过
            return LunarValidationDTO(
                valid=False,  # 设置验证结果为无效
                message=None,  # 设置成功消息为空
                error=validation_result.get("error", "农历时间验证失败")  # 获取错误信息，设置到DTO中
            )


calendar_service = CalendarService()  # 创建服务实例，采用单例模式提供全局服务访问（实例化服务类，供API层调用）


# 默认导出列表，定义模块的公共接口（指定哪些名称可以从模块中导入）
__all__ = [
    'CalendarService',  # 导出服务类，便于测试和扩展
    'calendar_service'  # 导出服务实例，供API层直接使用
]

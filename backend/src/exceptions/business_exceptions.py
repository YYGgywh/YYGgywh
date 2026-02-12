# backend/src/exceptions/business_exceptions.py 2026-02-11 13:45:00
# 功能：业务异常类定义，用于服务层抛出业务相关的异常


class BusinessException(Exception):
    """业务异常基类"""
    
    def __init__(self, message: str, code: str = "BUSINESS_ERROR"):
        super().__init__(message)
        self.message = message
        self.code = code


class RandomNumberGenerationException(BusinessException):
    """随机数生成业务异常"""
    
    def __init__(self, message: str):
        super().__init__(message, "RANDOM_NUMBER_GENERATION_ERROR")


class RandomDigitException(RandomNumberGenerationException):
    """随机数字生成异常"""
    
    def __init__(self):
        super().__init__("随机数字生成失败")


class RandomThreeDigitsException(RandomNumberGenerationException):
    """三个随机数字生成异常"""
    
    def __init__(self):
        super().__init__("三个随机数字字符串生成失败")


class RandomJiaziException(RandomNumberGenerationException):
    """随机干支选择异常"""
    
    def __init__(self):
        super().__init__("随机干支选择失败")


class CalendarValidationException(BusinessException):
    """日历验证业务异常"""
    
    def __init__(self, message: str):
        super().__init__(message, "CALENDAR_VALIDATION_ERROR")


class SolarValidationException(CalendarValidationException):
    """公历时间验证异常"""
    
    def __init__(self):
        super().__init__("公历时间验证失败")


class LunarValidationException(CalendarValidationException):
    """农历时间验证异常"""
    
    def __init__(self):
        super().__init__("农历时间验证失败")


# 默认导出列表
__all__ = [
    'BusinessException',
    'RandomNumberGenerationException', 
    'RandomDigitException',
    'RandomThreeDigitsException',
    'RandomJiaziException',
    'CalendarValidationException',
    'SolarValidationException',
    'LunarValidationException'
]
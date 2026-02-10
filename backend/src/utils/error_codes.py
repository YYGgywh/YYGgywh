"""
错误码定义模块
提供统一的错误码和错误消息格式
"""

from enum import Enum
from typing import Dict, Any


class ErrorCode(Enum):
    """错误码枚举"""
    
    # 成功
    SUCCESS = (0, "成功")
    
    # 参数错误 (1000-1999)
    INVALID_PARAMETER = (1001, "参数错误")
    INVALID_DATE_FORMAT = (1002, "日期格式错误")
    INVALID_TIME_FORMAT = (1003, "时间格式错误")
    INVALID_PILLARS_FORMAT = (1004, "四柱格式错误")
    MISSING_REQUIRED_PARAM = (1005, "缺少必填参数")
    
    # 业务逻辑错误 (2000-2999)
    CALENDAR_CONVERSION_FAILED = (2001, "历法转换失败")
    PILLARS_VALIDATION_FAILED = (2002, "四柱验证失败")
    PILLARS_CONVERSION_FAILED = (2005, "四柱转换失败")
    INVALID_PILLARS_COMBINATION = (2006, "四柱组合无效")
    LIUYAO_CALCULATION_FAILED = (2003, "六爻计算失败")
    LIUYAO_DIVINATION_FAILED = (2007, "六爻起卦失败")
    HEXAGRAM_LIST_FETCH_FAILED = (2008, "六十四卦列表获取失败")
    HEXAGRAM_INTERPRETATION_FETCH_FAILED = (2009, "卦象解释获取失败")
    RANDOM_DIGIT_GENERATION_FAILED = (2010, "随机数字生成失败")
    RANDOM_THREE_DIGITS_GENERATION_FAILED = (2011, "随机数字字符串生成失败")
    RANDOM_JIAZI_SELECTION_FAILED = (2012, "随机干支选择失败")
    DATE_OUT_OF_RANGE = (2004, "日期超出范围")
    
    # 系统错误 (3000-3999)
    INTERNAL_SERVER_ERROR = (3001, "服务器内部错误")
    SERVICE_UNAVAILABLE = (3002, "服务暂时不可用")
    DATABASE_ERROR = (3003, "数据库错误")
    
    # 权限错误 (4000-4999)
    UNAUTHORIZED = (4001, "未授权访问")
    FORBIDDEN = (4002, "禁止访问")
    
    def __init__(self, code: int, message: str):
        self._code = code
        self._message = message
    
    @property
    def code(self) -> int:
        """获取错误码"""
        return self._code
    
    @property
    def message(self) -> str:
        """获取错误消息"""
        return self._message


def create_error_response(
    error_code: ErrorCode, 
    detail: str = None, 
    extra_data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    创建标准错误响应
    
    Args:
        error_code: 错误码
        detail: 详细错误信息
        extra_data: 额外数据
        
    Returns:
        标准错误响应字典
    """
    response = {
        "success": False,
        "error_code": error_code.code,
        "error_message": error_code.message,
        "timestamp": None  # 可以在调用时填充
    }
    
    if detail:
        response["detail"] = detail
    
    if extra_data:
        response.update(extra_data)
    
    return response


def create_success_response(data: Any = None, message: str = None) -> Dict[str, Any]:
    """
    创建标准成功响应
    
    Args:
        data: 返回数据
        message: 成功消息
        
    Returns:
        标准成功响应字典
    """
    response = {
        "success": True,
        "error_code": ErrorCode.SUCCESS.code,
        "error_message": ErrorCode.SUCCESS.message,
        "timestamp": None  # 可以在调用时填充
    }
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    return response
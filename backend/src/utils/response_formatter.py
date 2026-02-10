"""
数据响应格式化工具

提供统一的数据响应格式，确保前后端数据格式一致性
"""

from typing import Any, Dict, Optional
from datetime import datetime


class StandardizedResponse:
    """标准化响应格式"""
    
    def __init__(
        self,
        success: bool,
        data: Optional[Any] = None,
        error_code: Optional[int] = None,
        error_message: Optional[str] = None,
        message: Optional[str] = None,
        timestamp: Optional[str] = None
    ):
        self.success = success
        self.data = data
        self.error_code = error_code
        self.error_message = error_message
        self.message = message
        self.timestamp = timestamp or datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        response = {
            "success": self.success,
            "timestamp": self.timestamp
        }
        
        if self.data is not None:
            response["data"] = self.data
        
        if self.error_code is not None:
            response["error_code"] = self.error_code
        
        if self.error_message is not None:
            response["error_message"] = self.error_message
        
        if self.message is not None:
            response["message"] = self.message
        
        return response


class ResponseFormatter:
    """响应格式化器"""
    
    @staticmethod
    def create_success_response(
        data: Any = None,
        message: Optional[str] = None
    ) -> Dict[str, Any]:
        """创建成功响应"""
        return StandardizedResponse(
            success=True,
            data=data,
            message=message
        ).to_dict()
    
    @staticmethod
    def create_error_response(
        error_code: int,
        error_message: str,
        data: Optional[Any] = None
    ) -> Dict[str, Any]:
        """创建错误响应"""
        return StandardizedResponse(
            success=False,
            data=data,
            error_code=error_code,
            error_message=error_message
        ).to_dict()
    
    @staticmethod
    def format_legacy_response(legacy_response: Dict[str, Any]) -> Dict[str, Any]:
        """格式化旧版响应为标准化格式"""
        success = legacy_response.get("success", False)
        
        if success:
            return ResponseFormatter.create_success_response(
                data=legacy_response.get("data"),
                message=legacy_response.get("message")
            )
        else:
            return ResponseFormatter.create_error_response(
                error_code=legacy_response.get("error_code", 5000),
                error_message=legacy_response.get("error", legacy_response.get("error_message", "未知错误")),
                data=legacy_response.get("data")
            )


# 向后兼容的函数
def create_success_response(data: Any = None, message: Optional[str] = None) -> Dict[str, Any]:
    """创建成功响应（向后兼容）"""
    return ResponseFormatter.create_success_response(data, message)


def create_error_response(error_code: int, error_message: str, data: Optional[Any] = None) -> Dict[str, Any]:
    """创建错误响应（向后兼容）"""
    return ResponseFormatter.create_error_response(error_code, error_message, data)
# 路径:backend/src/utils/response_formatter.py 时间:2026-02-11 21:30:00
# 功能:数据响应格式化工具，提供统一的API响应格式

from typing import Any, Dict, Optional  # 导入类型注解工具，用于任意类型、字典和可选类型定义
from datetime import datetime  # 导入日期时间模块，用于生成时间戳

# 定义标准化响应格式类
class StandardizedResponse:
    
    # 定义构造函数，初始化响应对象
    def __init__(
        self,  # 实例自身引用
        success: bool,  # 操作成功标志，布尔类型
        data: Optional[Any] = None,  # 返回数据，可选参数，任意类型
        error_code: Optional[int] = None,  # 错误码，可选参数，整数类型
        error_message: Optional[str] = None,  # 错误消息，可选参数，字符串类型
        message: Optional[str] = None,  # 成功消息，可选参数，字符串类型
        timestamp: Optional[str] = None  # 时间戳，可选参数，字符串类型
    ):
        self.success = success  # 设置操作成功标志
        self.data = data  # 设置返回数据
        self.error_code = error_code  # 设置错误码
        self.error_message = error_message  # 设置错误消息
        self.message = message  # 设置成功消息
        self.timestamp = timestamp or datetime.now().isoformat()  # 设置时间戳，如果未提供则使用当前时间
    
    # 定义转换为字典格式的方法
    def to_dict(self) -> Dict[str, Any]:
        # 初始化响应字典
        response = {
            "success": self.success,  # 设置操作成功标志
            "timestamp": self.timestamp  # 设置时间戳
        }
        
        if self.data is not None:  # 检查是否提供了返回数据
            response["data"] = self.data  # 将返回数据添加到响应字典中
        
        if self.error_code is not None:  # 检查是否提供了错误码
            response["error_code"] = self.error_code  # 将错误码添加到响应字典中
        
        if self.error_message is not None:  # 检查是否提供了错误消息
            response["error_message"] = self.error_message  # 将错误消息添加到响应字典中
        
        if self.message is not None:  # 检查是否提供了成功消息
            response["message"] = self.message  # 将成功消息添加到响应字典中
        
        return response  # 返回完整的响应字典

# 定义响应格式化器类
class ResponseFormatter:
    
    @staticmethod  # 定义静态方法装饰器，无需实例化即可调用
    # 定义创建成功响应方法
    def create_success_response(
        data: Any = None,  # 返回数据，默认值为None
        message: Optional[str] = None  # 成功消息，可选参数
    ) -> Dict[str, Any]:  # 返回类型为字典，包含字符串键和任意值
        
        # 创建标准化响应对象
        return StandardizedResponse(
            success=True,  # 设置操作成功标志为True
            data=data,  # 设置返回数据
            message=message  # 设置成功消息
        ).to_dict()  # 转换为字典格式并返回
    
    @staticmethod  # 定义静态方法装饰器，无需实例化即可调用
    # 定义创建错误响应方法
    def create_error_response(
        error_code: int,  # 错误码，整数类型
        error_message: str,  # 错误消息，字符串类型
        data: Optional[Any] = None  # 返回数据，可选参数
    ) -> Dict[str, Any]:  # 返回类型为字典，包含字符串键和任意值
        
        # 创建标准化响应对象
        return StandardizedResponse(
            success=False,  # 设置操作成功标志为False
            data=data,  # 设置返回数据
            error_code=error_code,  # 设置错误码
            error_message=error_message  # 设置错误消息
        ).to_dict()  # 转换为字典格式并返回
    
    @staticmethod  # 定义静态方法装饰器，无需实例化即可调用
    # 定义格式化旧版响应方法
    def format_legacy_response(legacy_response: Dict[str, Any]) -> Dict[str, Any]:

        success = legacy_response.get("success", False)  # 从旧版响应中获取成功标志，默认为False
        
        if success:  # 如果操作成功
            # 创建成功响应
            return ResponseFormatter.create_success_response(
                data=legacy_response.get("data"),  # 获取旧版响应中的数据
                message=legacy_response.get("message")  # 获取旧版响应中的消息
            )
        else:  # 如果操作失败
            # 创建错误响应
            return ResponseFormatter.create_error_response(
                error_code=legacy_response.get("error_code", 5000),  # 获取错误码，默认为5000
                error_message=legacy_response.get("error", legacy_response.get("error_message", "未知错误")),  # 获取错误消息，优先使用error字段
                data=legacy_response.get("data")  # 获取旧版响应中的数据
            )


# 定义向后兼容的成功响应函数
def create_success_response(data: Any = None, message: Optional[str] = None) -> Dict[str, Any]:
    return ResponseFormatter.create_success_response(data, message)  # 调用ResponseFormatter类的静态方法

# 定义向后兼容的错误响应函数
def create_error_response(error_code: int, error_message: str, data: Optional[Any] = None) -> Dict[str, Any]:
    return ResponseFormatter.create_error_response(error_code, error_message, data)  # 调用ResponseFormatter类的静态方法
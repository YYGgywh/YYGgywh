# 路径:backend/src/utils/error_codes.py 时间:2026-02-11 21:19:33
# 功能:定义统一的错误码枚举和响应格式化工具

from enum import Enum  # 导入枚举模块，用于定义错误码枚举类
from typing import Dict, Any  # 导入类型注解工具，用于字典和任意类型定义

# 定义错误码枚举类，继承自Enum基类
class ErrorCode(Enum):
    
    SUCCESS = (0, "成功")  # 成功状态码：0，表示操作成功完成
    
    # 参数错误 (1000-1999)
    INVALID_PARAMETER = (1001, "参数错误")  # 参数错误：1001，表示输入参数格式或内容错误
    INVALID_DATE_FORMAT = (1002, "日期格式错误")  # 日期格式错误：1002，表示日期格式不符合要求
    INVALID_TIME_FORMAT = (1003, "时间格式错误")  # 时间格式错误：1003，表示时间格式不符合要求
    INVALID_PILLARS_FORMAT = (1004, "四柱格式错误")  # 四柱格式错误：1004，表示四柱数据格式错误
    MISSING_REQUIRED_PARAM = (1005, "缺少必填参数")  # 缺少必填参数：1005，表示缺少必要的请求参数
    
    # 业务逻辑错误 (2000-2999)
    CALENDAR_CONVERSION_FAILED = (2001, "历法转换失败")  # 历法转换失败：2001，表示公历农历转换过程中出错
    SOLAR_VALIDATION_FAILED = (2013, "公历时间验证失败")  # 公历时间验证失败：2013，表示公历时间数据验证不通过
    LUNAR_VALIDATION_FAILED = (2014, "农历时间验证失败")  # 农历时间验证失败：2014，表示农历时间数据验证不通过
    PILLARS_VALIDATION_FAILED = (2002, "四柱验证失败")  # 四柱验证失败：2002，表示四柱数据验证不通过
    PILLARS_CONVERSION_FAILED = (2005, "四柱转换失败")  # 四柱转换失败：2005，表示四柱数据转换过程中出错
    INVALID_PILLARS_COMBINATION = (2006, "四柱组合无效")  # 四柱组合无效：2006，表示四柱组合不符合规则
    LIUYAO_CALCULATION_FAILED = (2003, "六爻计算失败")  # 六爻计算失败：2003，表示六爻卦象计算过程中出错
    LIUYAO_DIVINATION_FAILED = (2007, "六爻起卦失败")  # 六爻起卦失败：2007，表示六爻起卦过程中出错
    HEXAGRAM_LIST_FETCH_FAILED = (2008, "六十四卦列表获取失败")  # 六十四卦列表获取失败：2008，表示获取卦象列表时出错
    HEXAGRAM_INTERPRETATION_FETCH_FAILED = (2009, "卦象解释获取失败")  # 卦象解释获取失败：2009，表示获取卦象解释时出错
    RANDOM_DIGIT_GENERATION_FAILED = (2010, "随机数字生成失败")  # 随机数字生成失败：2010，表示生成随机数字时出错
    RANDOM_THREE_DIGITS_GENERATION_FAILED = (2011, "随机数字字符串生成失败")  # 随机数字字符串生成失败：2011，表示生成三位随机数字时出错
    RANDOM_JIAZI_SELECTION_FAILED = (2012, "随机干支选择失败")  # 随机干支选择失败：2012，表示随机选择干支时出错
    DATE_OUT_OF_RANGE = (2004, "日期超出范围")  # 日期超出范围：2004，表示输入的日期不在有效范围内
    
    # 系统错误 (3000-3999)
    INTERNAL_SERVER_ERROR = (3001, "服务器内部错误")  # 服务器内部错误：3001，表示服务器内部处理错误
    SERVICE_UNAVAILABLE = (3002, "服务暂时不可用")  # 服务暂时不可用：3002，表示服务暂时无法使用
    DATABASE_ERROR = (3003, "数据库错误")  # 数据库错误：3003，表示数据库操作过程中出错
    
    # 权限错误 (4000-4999)
    UNAUTHORIZED = (4001, "未授权访问")  # 未授权访问：4001，表示用户未通过身份验证
    FORBIDDEN = (4002, "禁止访问")  # 禁止访问：4002，表示用户无权限访问资源
    
    # 枚举类构造函数，初始化错误码和错误消息
    def __init__(self, code: int, message: str):
        self._code = code  # 设置错误码私有属性
        self._message = message  # 设置错误消息私有属性
    
    @property  # 定义属性装饰器，将方法转换为只读属性
    # 获取错误码属性方法
    def code(self) -> int:
        return self._code  # 返回错误码值
    
    @property  # 定义属性装饰器，将方法转换为只读属性
    # 获取错误消息属性方法
    def message(self) -> str:
        return self._message  # 返回错误消息值

# 定义创建错误响应函数
def create_error_response(
    error_code: ErrorCode,  # 错误码枚举实例
    detail: str = None,  # 详细错误信息，可选参数
    extra_data: Dict[str, Any] = None  # 额外数据字典，可选参数
) -> Dict[str, Any]:  # 返回类型为字典，包含字符串键和任意值
    
    # 初始化响应字典
    response = {
        "success": False,  # 设置操作成功标志为False
        "error_code": error_code.code,  # 设置错误码
        "error_message": error_code.message,  # 设置错误消息
        "timestamp": None  # 设置时间戳为None，可以在调用时填充
    }
    
    if detail:  # 检查是否提供了详细错误信息
        response["detail"] = detail  # 将详细错误信息添加到响应中
    
    if extra_data:  # 检查是否提供了额外数据
        response.update(extra_data)  # 将额外数据合并到响应字典中
    
    return response  # 返回完整的错误响应字典

# 定义创建成功响应函数
def create_success_response(data: Any = None, message: str = None) -> Dict[str, Any]:
    # 初始化响应字典
    response = {
        "success": True,  # 设置操作成功标志为True
        "error_code": ErrorCode.SUCCESS.code,  # 设置成功状态码
        "error_message": ErrorCode.SUCCESS.message,  # 设置成功消息
        "timestamp": None  # 设置时间戳为None，可以在调用时填充
    }
    
    if data is not None:  # 检查是否提供了返回数据
        response["data"] = data  # 将返回数据添加到响应中
    
    if message:  # 检查是否提供了自定义成功消息
        response["message"] = message  # 将自定义成功消息添加到响应中
    
    return response  # 返回完整的成功响应字典
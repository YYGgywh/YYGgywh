# backend/src/api/calendar_api.py 时间:2026-02-13 13:00
# 功能:提供REST API接口，供前端调用历法计算功能

from fastapi import APIRouter, HTTPException  # 导入FastAPI的路由和异常处理类
from pydantic import BaseModel  # 导入Pydantic的基础模型类，用于请求和响应模型定义
from typing import Optional, Dict, Any  # 导入可选类型注解、字典类型和任意类型，用于标记可选参数和定义字典类型
import sys  # 导入系统模块，用于路径操作
import os  # 导入操作系统模块，用于路径操作

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))  # 将backend目录添加到Python路径

from core.calendar_algorithm_core import calendar_algorithm_core, CalendarError  # 导入历法算法核心实例和异常类
from utils.error_codes import ErrorCode  # 导入标准错误码和响应格式化器
from utils.response_formatter import ResponseFormatter  # 导入响应格式化器类
from src.validators.calendar_validator import calendar_validator  # 导入统一的历法验证器实例
from src.services.calendar_service import calendar_service  # 导入日历验证服务实例，用于统一处理验证和转换业务逻辑

router = APIRouter(tags=["历法计算"])  # 创建API路由实例，并设置标签为"历法计算"

# 定义公历时间验证请求模型，继承自Pydantic的BaseModel
class SolarValidationRequest(BaseModel):
    """公历时间验证请求模型"""
    year: str  # 公历年参数，字符串类型
    month: str  # 公历月参数，字符串类型
    day: str  # 公历日参数，字符串类型
    hour: str  # 小时参数，字符串类型
    minute: str  # 分钟参数，字符串类型
    second: str  # 秒数参数，字符串类型

# 定义公历时间验证响应模型，继承自Pydantic的BaseModel
class SolarValidationResponse(BaseModel):
    valid: bool  # 验证结果，布尔类型，true表示验证通过，false表示验证失败
    error: Optional[str] = None  # 错误信息，可选，默认为None
    message: Optional[str] = None  # 成功消息，可选，默认为None

# 定义公历转换请求模型，继承自Pydantic的BaseModel
class SolarConversionRequest(BaseModel):
    """公历转换请求模型"""
    year: int  # 公历年参数，整数类型
    month: int  # 公历月参数，整数类型
    day: int  # 公历日参数，整数类型
    hour: Optional[int] = 0  # 小时参数，可选，默认值为0
    minute: Optional[int] = 0  # 分钟参数，可选，默认值为0
    second: Optional[int] = 0  # 秒数参数，可选，默认值为0

# 定义公历转换响应模型，继承自Pydantic的BaseModel
class SolarConversionResponse(BaseModel):
    """公历转换响应模型"""
    success: bool  # 转换是否成功，布尔类型
    data: Dict[str, Any]  # 转换结果数据，字典类型，键为字符串，值为任意类型
    message: str  # 响应消息，字符串类型
    timestamp: str  # 时间戳，字符串类型

# 定义农历时间验证请求模型，继承自Pydantic的BaseModel
class LunarValidationRequest(BaseModel):
    """农历时间验证请求模型"""
    lunar_year: str  # 农历年参数，字符串类型
    lunar_month: str  # 农历月参数，字符串类型
    lunar_day: str  # 农历日参数，字符串类型
    is_leap_month: str  # 是否闰月参数，字符串类型，值为"true"或"false"
    hour: str  # 小时参数，字符串类型
    minute: str  # 分钟参数，字符串类型
    second: str  # 秒数参数，字符串类型

# 定义农历时间验证响应模型，继承自Pydantic的BaseModel
class LunarValidationResponse(BaseModel):
    """农历时间验证响应模型"""
    valid: bool  # 验证结果，布尔类型，true表示验证通过，false表示验证失败
    error: Optional[str] = None  # 错误信息，可选，默认为None
    message: Optional[str] = None  # 成功消息，可选，默认为None

# 定义农历转换请求模型，继承自Pydantic的BaseModel
class LunarConversionRequest(BaseModel):
    """农历转换请求模型"""
    lunar_year: int  # 农历年参数，整数类型
    lunar_month: int  # 农历月参数，整数类型
    lunar_day: int  # 农历日参数，整数类型
    hour: Optional[int] = 0  # 小时参数，可选，默认值为0
    minute: Optional[int] = 0  # 分钟参数，可选，默认值为0
    second: Optional[int] = 0  # 秒数参数，可选，默认值为0
    is_leap_month: Optional[bool] = False  # 是否闰月参数，可选，默认值为False

# 定义农历转换响应模型，继承自Pydantic的BaseModel
class LunarConversionResponse(BaseModel):
    """农历转换响应模型"""
    success: bool  # 转换是否成功，布尔类型
    data: Dict[str, Any]  # 转换结果数据，字典类型，键为字符串，值为任意类型
    message: str  # 响应消息，字符串类型
    timestamp: str  # 时间戳，字符串类型


@router.post("/validate-solar", response_model=SolarValidationResponse)  # 定义POST路由，路径为"/validate-solar"，指定响应模型
async def validate_solar_time(request: SolarValidationRequest):  # 定义公历时间验证的异步处理函数
    
    # 尝试执行验证操作
    try:
        # 调用历法验证器的validate_solar_input方法
        result = calendar_validator.validate_solar_input(  # 调用验证器的公历时间验证方法
            year=request.year,  # 传入公历年参数
            month=request.month,  # 传入公历月参数
            day=request.day,  # 传入公历日参数
            hour=request.hour,  # 传入小时参数
            minute=request.minute,  # 传入分钟参数
            second=request.second  # 传入秒数参数
        )
        
        return SolarValidationResponse(**result)  # 返回验证结果响应，使用字典解包
        
    # 捕获验证过程中的异常
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证过程中发生错误: {str(e)}")  # 抛出HTTP异常，状态码500，包含错误消息


@router.post("/convert-solar", response_model=SolarConversionResponse)  # 定义POST路由，路径为"/convert-solar"，指定响应模型
async def convert_solar_calendar(request: SolarConversionRequest):  # 定义历法转换的异步处理函数
    # 尝试执行历法转换操作
    try:
        result = calendar_service.convert_solar_to_lunar(  # 通过服务层调用公历转农历方法
            year=request.year,  # 传入公历年参数
            month=request.month,  # 传入公历月参数
            day=request.day,  # 传入公历日参数
            hour=request.hour,  # 传入小时参数
            minute=request.minute,  # 传入分钟参数
            second=request.second  # 传入秒数参数
        )
        
        return ResponseFormatter.create_success_response(result.dict(), "历法转换成功")  # 返回成功响应，包含转换结果和成功消息
        
    # 捕获历法计算异常
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应对象
            ErrorCode.CALENDAR_CONVERSION_FAILED.code,  # 使用错误码获取整数错误码
            str(e)  # 传入异常消息
        )
        raise HTTPException(status_code=400, detail=error_response)  # 抛出HTTP异常，状态码400，包含错误响应
    # 捕获其他未知异常
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应对象
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用错误码获取整数错误码
            f"服务器内部错误: {str(e)}"  # 传入服务器内部错误消息
        )
        raise HTTPException(status_code=500, detail=error_response)  # 抛出HTTP异常，状态码500，包含错误响应


@router.post("/validate-lunar", response_model=LunarValidationResponse)  # 定义POST路由，路径为"/validate-lunar"，指定响应模型
async def validate_lunar_time(request: LunarValidationRequest):  # 定义农历时间验证的异步处理函数
    
    # 尝试执行验证操作
    try:
        # 调用历法验证器的validate_lunar_input方法
        result = calendar_validator.validate_lunar_input(  # 调用验证器的农历时间验证方法
            lunar_year=request.lunar_year,  # 传入农历年参数
            lunar_month=request.lunar_month,  # 传入农历月参数
            lunar_day=request.lunar_day,  # 传入农历日参数
            hour=request.hour,  # 传入小时参数
            minute=request.minute,  # 传入分钟参数
            second=request.second,  # 传入秒数参数
            is_leap_month=request.is_leap_month  # 传入是否闰月参数
        )
        
        return LunarValidationResponse(**result)  # 返回验证结果响应，使用字典解包
        
    # 捕获验证过程中的异常
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证过程中发生错误: {str(e)}")  # 抛出HTTP异常，状态码500，包含错误消息


@router.post("/convert-lunar", response_model=LunarConversionResponse)  # 定义POST路由，路径为"/convert-lunar"，指定响应模型
async def convert_lunar_calendar(request: LunarConversionRequest):  # 定义农历转换的异步处理函数、

    # 尝试执行历法转换操作
    try:
        # 通过服务层调用农历转公历方法
        result = calendar_service.convert_lunar_to_solar(
            lunar_year=request.lunar_year,  # 传入农历年参数
            lunar_month=request.lunar_month,  # 传入农历月参数
            lunar_day=request.lunar_day,  # 传入农历日参数
            hour=request.hour,  # 传入小时参数
            minute=request.minute,  # 传入分钟参数
            second=request.second,  # 传入秒数参数
            is_leap_month=request.is_leap_month  # 传入是否闰月参数
        )
        
        return ResponseFormatter.create_success_response(result.dict(), "农历转换成功")  # 返回成功响应，包含转换结果和成功消息
        
    # 捕获历法计算异常
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(  # 创建错误响应对象
            ErrorCode.CALENDAR_CONVERSION_FAILED.code,  # 使用错误码获取整数错误码
            str(e)  # 传入异常消息
        )
        raise HTTPException(status_code=400, detail=error_response)  # 抛出HTTP异常，状态码400，包含错误响应
    except Exception as e:  # 捕获其他未知异常
        # 创建错误响应对象
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用错误码获取整数错误码
            f"服务器内部错误: {str(e)}"  # 传入服务器内部错误消息
        )
        raise HTTPException(status_code=500, detail=error_response)  # 抛出HTTP异常，状态码500，包含错误响应


# ========== API文档描述 ==========

# 设置公历时间验证函数的文档字符串
validate_solar_time.__doc__ = """
验证公历时间参数的有效性

**参数说明:**
- year: 公历年 (字符串格式)
- month: 公历月 (字符串格式)
- day: 公历日 (字符串格式)
- hour: 小时 (字符串格式)
- minute: 分钟 (字符串格式)
- second: 秒 (字符串格式)

**验证规则:**
1. 类型验证：检查所有参数是否为字符串
2. 转换验证：检查字符串是否能有效转换为整数
3. 范围验证：检查年值是否在1-9999之间，月值是否在1-12之间
4. 日期验证：检查日值是否在当月有效范围内
5. 时间验证：检查时、分、秒是否在有效范围内

**返回示例（验证成功）:**
```json
{
    "valid": true,
    "message": "公历时间验证通过"
}
```

**返回示例（验证失败）:**
```json
{
    "valid": false,
    "error": "年、月、日、时、分、秒必须是字符串类型"
}
```
"""

# 设置历法转换函数的文档字符串
convert_solar_calendar.__doc__ = """
将公历日期转换为农历信息

**参数说明:**
- year: 公历年 (1-9999)
- month: 公历月 (1-12)
- day: 公历日 (1-31)
- hour: 小时 (0-23, 可选，默认0)
- minute: 分钟 (0-59, 可选，默认0)
- second: 秒 (0-59, 可选，默认0)

**返回示例:**
```json
{
    "success": true,
    "data": {
        "solar": {
            "date": "2025-02-03 22:10:27",
            "year": 2025,
            "month": 2,
            "day": 3,
            "week": "一",
            "constellation": "水瓶"
        },
        "lunar": {
            "full_string": "二〇二五年正月初六 乙巳(蛇)年...",
            "year_chinese": "二〇二五",
            "year": 2025
        },
        "ganzhi": {
            "year": {
                "ganzhi": "甲辰",
                "gan": "甲",
                "zhi": "辰"
            }
        },
        "jieqi": {
            "prev_jie": "小寒 2025-01-05 10:32:47",
            "current_time": "2025-02-03 22:10:27",
            "next_jie": "立春 2025-02-03 22:10:28"
        }
    },
    "message": "历法转换成功"
}
```
"""

# 设置农历时间验证函数的文档字符串
validate_lunar_time.__doc__ = """
验证农历时间参数的有效性

**参数说明:**
- lunar_year: 农历年 (字符串格式)
- lunar_month: 农历月 (字符串格式)
- lunar_day: 农历日 (字符串格式)
- is_leap_month: 是否闰月 (字符串格式，值为"true"或"false")
- hour: 小时 (字符串格式)
- minute: 分钟 (字符串格式)
- second: 秒 (字符串格式)

**验证规则:**
1. 类型验证：检查所有参数是否为字符串
2. 转换验证：检查字符串是否能有效转换为整数和布尔值
3. 范围验证：检查年值是否在1-9999之间，月值是否在1-12之间
4. 闰月验证：如果is_leap_month为true，验证当年是否有该闰月
5. 日期验证：检查日值是否在当月有效范围内
6. 时间验证：检查时、分、秒是否在有效范围内

**返回示例（验证成功）:**
```json
{
    "valid": true,
    "message": "农历时间验证通过"
}
```

**返回示例（验证失败）:**
```json
{
    "valid": false,
    "error": "年、月、日、时、分、秒必须是字符串类型"
}
```
"""

# 设置农历转换函数的文档字符串
convert_lunar_calendar.__doc__ = """
将农历日期转换为公历信息

**参数说明:**
- lunar_year: 农历年 (1-9999)
- lunar_month: 农历月 (1-12)
- lunar_day: 农历日 (1-30)
- hour: 小时 (0-23, 可选，默认0)
- minute: 分钟 (0-59, 可选，默认0)
- second: 秒 (0-59, 可选，默认0)
- is_leap_month: 是否闰月 (true/false, 可选，默认false)

**返回示例:**
```json
{
    "success": true,
    "data": {
        "solar": {
            "date": "2026-07-23 15:30:45",
            "year": 2026,
            "month": 7,
            "day": 23,
            "week": "四",
            "constellation": "狮子"
        },
        "lunar": {
            "full_string": "二〇二六年六月初九 丙午(马)年...",
            "year_chinese": "二〇二六",
            "year": 2026
        },
        "ganzhi": {
            "year": {
                "ganzhi": "丙午",
                "gan": "丙",
                "zhi": "午"
            }
        },
        "jieqi": {
            "prev_jie": "小暑 2026-07-07 10:12:34",
            "current_time": "2026-07-23 15:30:45",
            "next_jie": "大暑 2026-07-23 15:30:46"
        }
    },
    "message": "农历转换成功"
}
```
"""

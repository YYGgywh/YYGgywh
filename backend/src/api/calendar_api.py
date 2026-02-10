"""
中华易学排盘系统 - 历法API接口

提供REST API接口，供前端调用历法计算功能
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os
from datetime import datetime

# 添加backend目录到Python路径，以便导入verify_pillars模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# datetime模块已移除，使用lunar库替代
from ..core.calendar_service import calendar_service, CalendarError

# 导入四柱验证模块
from ..utils.verify_pillars import verify_pillars

# 导入标准错误码和响应格式化器
from ..utils.error_codes import ErrorCode
from ..utils.response_formatter import ResponseFormatter

router = APIRouter(tags=["历法计算"])


class CalendarRequest(BaseModel):
    """历法计算请求模型"""
    year: int
    month: int
    day: int
    hour: Optional[int] = 0
    minute: Optional[int] = 0
    second: Optional[int] = 0
    day_ganzhi_method: Optional[int] = 2  # 日干支流派选择：1=流派1(晚子时算明天)，2=流派2(晚子时算当天)，默认2


class LunarCalendarRequest(BaseModel):
    """农历历法计算请求模型"""
    lunar_year: int
    lunar_month: int
    lunar_day: int
    is_leap_month: Optional[bool] = False  # 是否闰月，默认False
    hour: Optional[int] = 0
    minute: Optional[int] = 0
    second: Optional[int] = 0


class CalendarResponse(BaseModel):
    """历法计算响应模型"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    message: Optional[str] = None


class ValidationRequest(BaseModel):
    """日期验证请求模型"""
    year: int
    month: int
    day: int
    hour: Optional[int] = 0
    minute: Optional[int] = 0
    second: Optional[int] = 0


class ValidationResponse(BaseModel):
    """日期验证响应模型"""
    is_valid: bool
    is_corrected: bool
    original_date: str
    corrected_date: Optional[str] = None
    message: str


class PillarsCalendarRequest(BaseModel):
    """四柱历法计算请求模型"""
    year_pillar: str
    month_pillar: str
    day_pillar: str
    hour_pillar: str  # 修改为hour_pillar，与前端保持一致


class PillarsValidationRequest(BaseModel):
    """四柱验证请求模型"""
    year_pillar: str
    month_pillar: str
    day_pillar: str
    hour_pillar: str  # 修改为hour_pillar，与前端保持一致


class PillarsValidationResponse(BaseModel):
    """四柱验证响应模型"""
    is_valid: bool
    message: str
    details: Optional[dict] = None


@router.post("/convert")
async def convert_calendar(request: CalendarRequest):
    """
    将公历日期转换为农历信息
    
    Args:
        request: 包含公历日期参数的请求对象
        
    Returns:
        包含完整农历信息的标准化响应对象
    """
    try:
        result = calendar_service.convert_solar_to_lunar(
            year=request.year,
            month=request.month,
            day=request.day,
            hour=request.hour,
            minute=request.minute,
            second=request.second,
            day_ganzhi_method=request.day_ganzhi_method
        )
        
        return ResponseFormatter.create_success_response(result, "历法转换成功")
        
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.CALENDAR_CONVERSION_FAILED.code,  # 使用.code获取整数错误码
            str(e)
        )
        raise HTTPException(status_code=400, detail=error_response)
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用.code获取整数错误码
            f"服务器内部错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)


@router.get("/current")
async def get_current_calendar_info():
    """
    获取当前时间的历法信息
    
    Returns:
        包含当前时间历法信息的标准化响应对象
    """
    try:
        result = calendar_service.get_current_calendar_info()
        
        return ResponseFormatter.create_success_response(
            result, 
            "获取当前时间历法信息成功"
        )
        
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.CALENDAR_CONVERSION_FAILED.code,  # 使用.code获取整数错误码
            str(e)
        )
        raise HTTPException(status_code=400, detail=error_response)
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用.code获取整数错误码
            f"服务器内部错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)


@router.post("/convert-from-lunar")
async def convert_from_lunar(request: LunarCalendarRequest):
    """
    将农历日期转换为公历及完整历法信息
    
    Args:
        request: 包含农历日期参数的请求对象
        
    Returns:
        包含完整历法信息的标准化响应对象
    """
    try:
        result = calendar_service.convert_lunar_to_solar(
            lunar_year=request.lunar_year,
            lunar_month=request.lunar_month,
            lunar_day=request.lunar_day,
            hour=request.hour,
            minute=request.minute,
            second=request.second,
            is_leap_month=request.is_leap_month  # 添加is_leap_month参数
        )
        
        return ResponseFormatter.create_success_response(
            result, 
            "农历转换成功"
        )
        
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.CALENDAR_CONVERSION_FAILED.code,  # 使用.code获取整数错误码
            str(e)
        )
        raise HTTPException(status_code=400, detail=error_response)
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用.code获取整数错误码
            f"服务器内部错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)


@router.post("/validate", response_model=ValidationResponse)
async def validate_date_params(request: ValidationRequest):
    """
    验证日期参数的有效性
    
    Args:
        request: 包含日期参数的请求对象
        
    Returns:
        包含验证结果的响应对象
    """
    try:
        result = calendar_service.validate_date_params(
            year=request.year,
            month=request.month,
            day=request.day,
            hour=request.hour,
            minute=request.minute,
            second=request.second
        )
        
        return ValidationResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证过程中发生错误: {str(e)}")


@router.get("/test/{date_str}")
async def test_date_conversion(date_str: str):
    """
    测试日期转换功能（开发调试用）
    
    Args:
        date_str: 日期字符串，格式为 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS
        
    Returns:
        转换结果
    """
    try:
        # 解析日期字符串
        if ' ' in date_str:
            date_part, time_part = date_str.split(' ', 1)
            year, month, day = map(int, date_part.split('-'))
            hour, minute, second = map(int, time_part.split(':'))
        else:
            year, month, day = map(int, date_str.split('-'))
            hour, minute, second = 0, 0, 0
        
        result = calendar_service.convert_solar_to_lunar(
            year=year, month=month, day=day,
            hour=hour, minute=minute, second=second
        )
        
        return {
            "success": True,
            "input_date": date_str,
            "solar_date": result["solar_date"]["date"],
            "lunar_full_string": result["lunar_date"]["lunar_date"],
            "year_ganzhi": result["ganzhi_date"]["year"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"日期格式错误: {str(e)}")


# API文档描述
convert_calendar.__doc__ = """
将公历日期转换为农历信息

**参数说明:**
- year: 公历年 (1900-2100)
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

@router.post("/convert-from-pillars")
async def convert_from_pillars(request: PillarsCalendarRequest):
    """
    根据四柱信息转换为公历日期及完整历法信息
    
    Args:
        request: 包含四柱信息的请求对象
        
    Returns:
        包含完整历法信息的标准化响应对象
    """
    try:
        result = calendar_service.convert_pillars_to_calendar(
            year_pillar=request.year_pillar,
            month_pillar=request.month_pillar,
            day_pillar=request.day_pillar,
            hour_pillar=request.hour_pillar  # 修正参数名
        )
        
        return ResponseFormatter.create_success_response(
            result, 
            "四柱转换成功"
        )
        
    except CalendarError as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.PILLARS_CONVERSION_FAILED.code,  # 使用.code获取整数错误码
            str(e)
        )
        raise HTTPException(status_code=400, detail=error_response)
    except Exception as e:
        error_response = ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用.code获取整数错误码
            f"服务器内部错误: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=error_response)


@router.post("/validate-pillars")
async def validate_pillars(request: PillarsValidationRequest):
    """
    验证四柱组合的正确性
    
    Args:
        request: 包含四柱参数的请求对象
        
    Returns:
        验证结果的标准化响应对象
    """
    try:
        # 调用验证函数
        is_valid, error_message = verify_pillars(
            year_pillar=request.year_pillar,
            month_pillar=request.month_pillar,
            day_pillar=request.day_pillar,
            time_pillar=request.hour_pillar  # 修改为hour_pillar
        )
        
        if is_valid:
            return ResponseFormatter.create_success_response(
                {"valid": True}, 
                "四柱组合验证通过"
            )
        else:
            return ResponseFormatter.create_error_response(
                ErrorCode.INVALID_PILLARS_COMBINATION.code,  # 使用.code获取整数错误码
                error_message
            )
            
    except Exception as e:
        return ResponseFormatter.create_error_response(
            ErrorCode.INTERNAL_SERVER_ERROR.code,  # 使用.code获取整数错误码
            f"验证过程中发生错误: {str(e)}"
        )


get_current_calendar_info.__doc__ = """
获取当前时间的历法信息

**返回示例:**
```json
{
    "success": true,
    "data": {
        "solar": {
            "date": "2025-12-02 19:32:32",
            "year": 2025,
            "month": 12,
            "day": 2
        },
        "lunar": {
            "full_string": "二〇二五年十月十三 乙巳(蛇)年..."
        }
    },
    "message": "获取当前时间历法信息成功"
}
```
"""


convert_from_pillars.__doc__ = """
从四柱八字反推公历时间及完整历法信息

**参数说明:**
- year_pillar: 年柱 (如：甲子)
- month_pillar: 月柱 (如：丙寅)
- day_pillar: 日柱 (如：戊辰)
- hour_pillar: 时柱 (如：壬子)

**返回示例:**
```json
{
    "success": true,
    "data": {
        "solar": {
            "date": "2025-02-03 22:10:00",
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
            },
            "month": {
                "ganzhi": "丁丑",
                "gan": "丁",
                "zhi": "丑"
            },
            "day": {
                "ganzhi": "癸卯",
                "gan": "癸",
                "zhi": "卯"
            },
            "time": {
                "ganzhi": "癸亥",
                "gan": "癸",
                "zhi": "亥"
            }
        },
        "jieqi": {
            "prev_jie": "小寒 2025-01-05 10:32:47",
            "current_time": "2025-02-03 22:10:00",
            "next_jie": "立春 2025-02-03 22:10:28"
        }
    },
    "message": "四柱转换成功"
}
```
"""


validate_pillars.__doc__ = """
验证四柱组合的正确性

**参数说明:**
- year_pillar: 年柱 (如：甲子)
- month_pillar: 月柱 (如：丙寅)
- day_pillar: 日柱 (如：戊辰)
- time_pillar: 时柱 (如：壬子)

**验证规则:**
1. 六十甲子验证：检查四柱是否在六十甲子范围内
2. 五虎遁验证：检查月柱是否符合年干对应的五虎遁规则
3. 五鼠遁验证：检查时柱是否符合日干对应的五鼠遁规则

**返回示例（验证成功）:**
```json
{
    "is_valid": true,
    "message": "四柱组合验证通过，符合六十甲子、五虎遁和五鼠遁规则",
    "details": {
        "year_pillar": "甲子",
        "month_pillar": "丙寅",
        "day_pillar": "戊辰",
        "time_pillar": "戊午"
    }
}
```

**返回示例（验证失败）:**
```json
{
    "is_valid": false,
    "message": "四柱组合验证失败，请检查四柱是否符合六十甲子、五虎遁和五鼠遁规则",
    "details": {
        "year_pillar": "甲子",
        "month_pillar": "丙寅",
        "day_pillar": "戊辰",
        "time_pillar": "庚午"
    }
}
```
"""
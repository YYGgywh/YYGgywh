"""
中华易学排盘系统 - 历法API接口

提供REST API接口，供前端调用历法计算功能
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os

# 添加backend目录到Python路径，以便导入verify_pillars模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# 导入核心历法算法模块
from core.calendar_algorithm_core import calendar_algorithm_core, CalendarError

# 导入四柱验证模块
from utils.verify_pillars import verify_pillars

# 导入标准错误码和响应格式化器
from utils.error_codes import ErrorCode
from utils.response_formatter import ResponseFormatter

# 导入历法验证器
from src.validators.calendar_validator import calendar_validator

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


class SolarValidationRequest(BaseModel):
    """公历时间验证请求模型"""
    year: str
    month: str
    day: str
    hour: str
    minute: str
    second: str


class SolarValidationResponse(BaseModel):
    """公历时间验证响应模型"""
    valid: bool
    error: Optional[str] = None
    message: Optional[str] = None


class LunarValidationRequest(BaseModel):
    """农历时间验证请求模型"""
    lunar_year: str
    lunar_month: str
    lunar_day: str
    is_leap_month: str
    hour: str
    minute: str
    second: str


class LunarValidationResponse(BaseModel):
    """农历时间验证响应模型"""
    valid: bool
    error: Optional[str] = None
    message: Optional[str] = None


class PillarsValidationRequest(BaseModel):
    """四柱验证请求模型"""
    year_pillar: str
    month_pillar: str
    day_pillar: str
    hour_pillar: str  # 修改为hour_pillar，与前端保持一致


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
        result = calendar_algorithm_core.convert_solar_to_lunar(
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


@router.post("/validate-solar", response_model=SolarValidationResponse)
async def validate_solar_time(request: SolarValidationRequest):
    """
    验证公历时间参数的有效性
    
    Args:
        request: 包含公历时间参数的请求对象
        
    Returns:
        包含验证结果的响应对象
    """
    try:
        # 调用历法验证器的validate_solar_input方法
        result = calendar_validator.validate_solar_input(
            year=request.year,
            month=request.month,
            day=request.day,
            hour=request.hour,
            minute=request.minute,
            second=request.second
        )
        
        return SolarValidationResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证过程中发生错误: {str(e)}")


@router.post("/validate-lunar", response_model=LunarValidationResponse)
async def validate_lunar_time(request: LunarValidationRequest):
    """
    验证农历时间参数的有效性
    
    Args:
        request: 包含农历时间参数的请求对象
        
    Returns:
        包含验证结果的响应对象
    """
    try:
        # 调用历法验证器的validate_lunar_input方法
        result = calendar_validator.validate_lunar_input(
            lunar_year=request.lunar_year,
            lunar_month=request.lunar_month,
            lunar_day=request.lunar_day,
            hour=request.hour,
            minute=request.minute,
            second=request.second,
            is_leap_month=request.is_leap_month
        )
        
        return LunarValidationResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证过程中发生错误: {str(e)}")


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


validate_pillars.__doc__ = """
验证四柱组合的正确性

**参数说明:**
- year_pillar: 年柱 (如：甲子)
- month_pillar: 月柱 (如：丙寅)
- day_pillar: 日柱 (如：戊辰)
- hour_pillar: 时柱 (如：壬子)

**验证规则:**
1. 六十甲子验证：检查四柱是否在六十甲子范围内
2. 五虎遁验证：检查月柱是否符合年干对应的五虎遁规则
3. 五鼠遁验证：检查时柱是否符合日干对应的五鼠遁规则

**返回示例（验证成功）:**
```json
{
    "success": true,
    "data": {"valid": true},
    "message": "四柱组合验证通过"
}
```

**返回示例（验证失败）:**
```json
{
    "success": false,
    "error": "四柱组合验证失败，请检查四柱是否符合六十甲子、五虎遁和五鼠遁规则"
}
```
"""


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

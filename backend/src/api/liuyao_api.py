# backend/src/api/liuyao_api.py 2026-02-14 12:20:00
# 功能：六爻占卜API接口，提供六爻起卦功能

from fastapi import APIRouter, HTTPException  # 导入FastAPI路由器和HTTP异常类
from pydantic import BaseModel, field_validator, model_validator  # 导入Pydantic基础模型类、字段验证器和模型验证器，用于数据验证

# 导入类型提示：列表、字典、任意类型、可选类型
from typing import List, Dict, Any, Optional  # 导入类型提示：列表、字典、任意类型、可选类型

# 导入六爻排盘服务和验证器
from services.liuyao_service import liuyao_service  # 导入六爻排盘服务实例，用于Service层验证和排盘计算
from validators.liuyao_validator import liuyao_validator  # 导入六爻验证器实例，用于测试验证功能

router = APIRouter()  # 创建FastAPI路由器实例

# 定义验证器测试请求模型
class ValidatorTestRequest(BaseModel):
    numbers: List[str]  # 六个三位数组成的数组，用于验证


@router.post("/validator-liuya")  # 定义POST路由，路径为/validator-liuya
# 异步函数，处理六爻验证器测试请求
async def test_validator(request: ValidatorTestRequest):
    """
    测试六爻验证器的验证功能
    
    Args:
        request: 验证器测试请求模型，包含爻位数据
        
    Returns:
        Dict: 验证结果，包含valid状态和error信息
    """
    # 获取爻位数据
    yao_list = request.numbers
    
    # 调用六爻验证器进行验证
    validation_result = liuyao_validator.validate_yao_data(yao_list)
    
    # 直接返回验证结果，统一响应格式
    return {
        "validation_result": validation_result,  # 验证结果
        "message": "验证器测试完成"
    }


# 定义六爻请求模型
class LiuyaoRequest(BaseModel):
    numbers: List[str]  # 六个三位数组成的数组，用于起卦（字符串格式）
    
    # 公历日期字段（可选）
    year: Optional[int] = None  # 公历年份
    month: Optional[int] = None  # 公历月份
    day: Optional[int] = None  # 公历日期
    
    # 农历日期字段（可选）
    lunar_year: Optional[int] = None  # 农历年份
    lunar_month: Optional[int] = None  # 农历月份
    lunar_day: Optional[int] = None  # 农历日期
    
    # 公用时间字段
    hour: int = 0  # 小时（默认0）
    minute: int = 0  # 分钟（默认0）
    second: int = 0  # 秒（默认0）
    
    # 农历专用字段
    is_leap_month: bool = False  # 是否为闰月（仅农历有效，默认False）
    
    @field_validator('numbers')
    @classmethod
    def validate_numbers(cls, v):
        """验证爻位数据格式"""
        if len(v) != 6:
            raise ValueError("[API层验证] 爻位数据必须包含6个三位数")
        for num in v:
            if len(num) != 3 or not num.isdigit():
                raise ValueError("[API层验证] 每个爻位必须是3位数字")
        return v
    
    @field_validator('year', 'month', 'day', mode='before')
    @classmethod
    def validate_solar_fields(cls, v, info):
        """验证公历字段，确保如果提供了其中一个，就必须提供所有公历字段"""
        field_name = info.field_name
        solar_fields = {'year', 'month', 'day'}
        
        # 获取所有公历字段的值
        values = {}
        for field in solar_fields:
            values[field] = getattr(info.data, field, None)
        
        # 检查是否部分提供了公历字段
        provided_solar = [k for k, v in values.items() if v is not None]
        if provided_solar and len(provided_solar) != len(solar_fields):
            raise ValueError("[API层验证] 公历日期必须完整提供year、month、day三个字段")
        
        return v
    
    @field_validator('lunar_year', 'lunar_month', 'lunar_day', mode='before')
    @classmethod
    def validate_lunar_fields(cls, v, info):
        """验证农历字段，确保如果提供了其中一个，就必须提供所有农历字段"""
        field_name = info.field_name
        lunar_fields = {'lunar_year', 'lunar_month', 'lunar_day'}
        
        # 获取所有农历字段的值
        values = {}
        for field in lunar_fields:
            values[field] = getattr(info.data, field, None)
        
        # 检查是否部分提供了农历字段
        provided_lunar = [k for k, v in values.items() if v is not None]
        if provided_lunar and len(provided_lunar) != len(lunar_fields):
            raise ValueError("[API层验证] 农历日期必须完整提供lunar_year、lunar_month、lunar_day三个字段")
        
        return v
    
    @model_validator(mode='after')
    def validate_calendar_type(self):
        """验证必须且只能提供一种历法类型的日期"""
        # 获取所有公历和农历字段的值
        solar_fields = {'year', 'month', 'day'}
        lunar_fields = {'lunar_year', 'lunar_month', 'lunar_day'}
        
        solar_values = {}
        lunar_values = {}
        
        for field in solar_fields:
            solar_values[field] = getattr(self, field, None)
        
        for field in lunar_fields:
            lunar_values[field] = getattr(self, field, None)
        
        # 检查是否提供了公历日期
        has_solar = all(v is not None for v in solar_values.values())
        
        # 检查是否提供了农历日期
        has_lunar = all(v is not None for v in lunar_values.values())
        
        # 验证必须提供一种历法类型，且不能同时提供两种
        if not has_solar and not has_lunar:
            raise ValueError("[API层验证] 必须提供公历日期（year、month、day）或农历日期（lunar_year、lunar_month、lunar_day）")
        
        if has_solar and has_lunar:
            raise ValueError("[API层验证] 不能同时提供公历和农历日期，请选择其中一种")
        
        return self

@router.post("/assemble-liuya")  # 定义POST路由，路径为/assemble-liuya
# 异步函数，处理六爻起卦请求
async def divine_liuyao(request: LiuyaoRequest):
    # 开始异常处理块
    try:
        # 获取爻位数据
        yao_list = request.numbers  # 使用原始字符串列表
        
        # 判断历法类型并准备参数
        has_solar = request.year is not None and request.month is not None and request.day is not None
        has_lunar = request.lunar_year is not None and request.lunar_month is not None and request.lunar_day is not None
        
        if has_solar:
            # 使用公历日期调用Service层进行六爻排盘计算
            paipan_result = liuyao_service.calculate_liuyao_with_solar_calendar(
                yao_list=yao_list,
                year=request.year,
                month=request.month,
                day=request.day,
                hour=request.hour,
                minute=request.minute,
                second=request.second
            )
        else:
            # 使用农历日期调用Service层进行六爻排盘计算
            paipan_result = liuyao_service.calculate_liuyao_with_lunar_calendar(
                yao_list=yao_list,
                lunar_year=request.lunar_year,
                lunar_month=request.lunar_month,
                lunar_day=request.lunar_day,
                hour=request.hour,
                minute=request.minute,
                second=request.second,
                is_leap_month=request.is_leap_month
            )
        
        # 直接返回Core层的结果，不额外包装，避免多层嵌套和重复字段
        return paipan_result
    except ValueError as e:  # 捕获值错误异常
        error_msg = str(e)
        # 检查错误消息是否包含层标识，如果没有则添加API层标识
        if not any(layer in error_msg for layer in ["[API层验证]", "[Service层验证]", "[Core层验证]"]):
            error_msg = f"[API层处理] {error_msg}"
        raise HTTPException(status_code=400, detail=error_msg)  # 抛出HTTP异常，状态码400，传递精细化的错误消息
    except Exception as e:  # 捕获其他异常
        # 对于非预期的异常，添加API层标识并记录详细错误信息
        error_msg = f"[API层处理] 服务器内部错误: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)  # 抛出HTTP异常，状态码500

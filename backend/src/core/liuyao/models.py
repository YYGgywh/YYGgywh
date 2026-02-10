"""
六爻排盘数据模型
定义前端请求和响应的数据结构
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, validator


class YaoLine(BaseModel):
    """爻线信息"""
    position: int                    # 爻位（1-6）
    value: str                       # 爻值（三位数）
    yin_yang: Optional[str] = None   # 阴阳（"阳"或"阴"）
    liu_qin: Optional[str] = None    # 六亲
    liu_shen: Optional[str] = None   # 六神
    is_dong_yao: Optional[bool] = False  # 是否为动爻
    
    @validator('value')
    def validate_yao_value(cls, v):
        if len(v) != 3 or not v.isdigit():
            raise ValueError('爻值必须为3位数字')
        return v


class HexagramInfo(BaseModel):
    """卦象信息"""
    name: str                           # 卦名
    code: str                           # 卦码
    palace: Optional[str] = None        # 所属宫
    palace_type: Optional[str] = None   # 宫属类型
    upper_trigram: Optional[str] = None # 上卦
    lower_trigram: Optional[str] = None # 下卦
    sequence: Optional[int] = None      # 易序
    palace_order: Optional[int] = None  # 宫序
    
    # 纳甲信息
    stems: Optional[List[str]] = None    # 纳干
    branches: Optional[List[str]] = None # 纳支
    liu_qin: Optional[List[str]] = None  # 六亲
    
    # 世应信息
    shi_ying: Optional[List[str]] = None # 世应分布
    shi_shen: Optional[str] = None      # 世身
    yue_shen: Optional[str] = None      # 月身
    chong_he: Optional[str] = None      # 冲合
    
    @validator('code')
    def validate_hexagram_code(cls, v):
        if len(v) != 6 or not all(c in '01' for c in v):
            raise ValueError('卦码必须为6位二进制数（0或1）')
        return v


class DongYaoInfo(BaseModel):
    """动爻信息"""
    position: int                      # 动爻位置（1-6）
    symbol: Optional[str] = None       # 动爻符号（"×→"或"○→"）
    liu_shen: Optional[str] = None    # 六神
    liu_qin: Optional[str] = None     # 六亲


class LiuYaoRequest(BaseModel):
    """六爻排盘请求模型"""
    yao_list: List[str]  # 起卦列表数据（6个三位数）
    day_gan: str         # 日干信息
    question: Optional[str] = None  # 问题（可选）
    method: Optional[str] = "coin"  # 起卦方法（coin或yarrow）
    
    @validator('yao_list')
    def validate_yao_list(cls, v):
        if len(v) != 6:
            raise ValueError('爻位列表必须包含6个爻位')
        for yao in v:
            if len(yao) != 3 or not yao.isdigit():
                raise ValueError('每个爻位必须为3位数字')
        return v
    
    @validator('day_gan')
    def validate_day_gan(cls, v):
        valid_gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        if v not in valid_gans:
            raise ValueError('日干必须是有效的天干')
        return v


class LiuYaoResponse(BaseModel):
    """六爻排盘响应模型"""
    # 基本信息
    success: bool
    message: str
    
    # 排盘结果
    yao_lines: Optional[List[YaoLine]] = None          # 爻线详细信息
    ben_gua: Optional[HexagramInfo] = None             # 本卦信息
    bian_gua: Optional[HexagramInfo] = None             # 变卦信息（无动爻时为None）
    dong_yao_list: Optional[List[DongYaoInfo]] = None   # 动爻列表
    
    # 摘要信息
    summary: Optional[Dict[str, Any]] = None
    
    # 原始数据（用于调试）
    raw_data: Optional[Dict[str, Any]] = None


class HexagramListResponse(BaseModel):
    """六十四卦列表响应模型"""
    hexagrams: List[Dict[str, Any]]
    total_count: int


class GenerateRequest(BaseModel):
    """随机生成卦象请求模型"""
    method: Optional[str] = "coin"  # 起卦方法（coin或yarrow）
    question: Optional[str] = None  # 问题（可选）
    day_gan: Optional[str] = None   # 日干（可选）
    
    @validator('method')
    def validate_method(cls, v):
        if v not in ["coin", "yarrow"]:
            raise ValueError('起卦方法必须是coin或yarrow')
        return v
    
    @validator('day_gan')
    def validate_day_gan(cls, v):
        if v is not None:
            valid_gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
            if v not in valid_gans:
                raise ValueError('日干必须是有效的天干')
        return v


class ErrorResponse(BaseModel):
    """错误响应模型"""
    success: bool = False
    error_code: str
    error_message: str
    details: Optional[Dict[str, Any]] = None
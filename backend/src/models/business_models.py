# backend/src/models/business_models.py 2026-02-11 12:30:00
# 功能：核心业务数据模型定义，用于业务逻辑层数据处理

from pydantic import BaseModel  # 导入Pydantic的BaseModel基类，用于定义数据验证模型

# 定义三数的爻位值模型类，继承自BaseModel
class ThreeYaoValues(BaseModel):
    digit_str: str   # 数字字符串：三个随机数字组成的字符串，如："357"，字符串类型
    parity_str: str  # 背正字符串：表示三个数字的背正状态，如："背正背"，字符串类型
    odd_count: int   # 奇数个数：三个数字中奇数的数量，整数类型

# 定义占卜结果模型类，继承自BaseModel
class DivinationResult(BaseModel):
    method: str             # 起卦方法：描述占卜的起卦方式，如："随机数字法"，字符串类型
    values: ThreeYaoValues  # 爻位值：包含三个数的爻位值的ThreeYaoValues对象
    timestamp: str          # 时间戳：占卜操作的时间，字符串类型


# 默认导出列表
__all__ = [  # 定义模块的公开导出列表
    'ThreeYaoValues',  # 导出三个爻位值模型
    'DivinationResult'  # 导出占卜结果模型
]
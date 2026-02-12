# backend/src/models/api_models.py 2026-02-11 12:30:00
# 功能：API层请求/响应模型定义，确保前后端数据格式一致性

from pydantic import BaseModel  # 导入Pydantic的BaseModel基类，用于定义数据验证模型

# 定义随机数字API响应模型类，继承自BaseModel
class RandomDigitResponse(BaseModel):
    digit: int  # 随机数字：生成的单个随机数字，整数类型
    method: str  # 生成方法：描述随机数字的生成方式，字符串类型
    description: str  # 描述信息：对随机数字的详细说明，字符串类型
    timestamp: str  # 时间戳：生成随机数字的时间，字符串类型

# 定义三个随机数字API响应模型类，继承自BaseModel
class RandomThreeDigitsResponse(BaseModel):
    three_digits: str  # 三个随机数字：生成的三位随机数字字符串，字符串类型
    parity_str: str  # 背正字符串：表示三个数字的背正状态，如："背正背"，字符串类型
    odd_count: int   # 奇数个数：三个数字中奇数的数量，整数类型
    method: str  # 生成方法：描述三个随机数字的生成方式，字符串类型
    description: str  # 描述信息：对三个随机数字的详细说明，字符串类型
    timestamp: str  # 时间戳：生成三个随机数字的时间，字符串类型

# 定义随机六十甲子API响应模型类，继承自BaseModel
class RandomJiaziResponse(BaseModel):
    jiazi: str  # 干支：随机选择的六十甲子干支组合，字符串类型
    index: int  # 序号：在六十甲子列表中的序号（从1开始），整数类型
    total_count: int = 60  # 总数：六十甲子总数，固定为60，整数类型
    method: str  # 生成方法：描述随机干支的生成方式，字符串类型
    description: str  # 描述信息：对随机干支的详细说明，字符串类型
    timestamp: str  # 时间戳：生成随机干支的时间，字符串类型


# 默认导出列表（定义模块的公开导出列表）
__all__ = [
    'RandomDigitResponse',  # 导出随机数字响应模型
    'RandomThreeDigitsResponse',  # 导出三个随机数字响应模型
    'RandomJiaziResponse'  # 导出随机六十甲子响应模型
]
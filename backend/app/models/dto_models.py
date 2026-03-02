# backend/src/models/dto_models.py 2026-02-11 12:30:00
# 功能：数据传输对象模型，用于服务层与API层之间的数据传递

from pydantic import BaseModel  # 导入Pydantic的BaseModel基类，用于定义数据验证模型
from typing import Optional, Dict, Any  # 导入Optional类型注解，用于表示可选参数；导入Dict和Any类型注解，用于定义字典类型和任意类型

# 定义随机数字数据传输对象类，继承自BaseModel
class RandomDigitDTO(BaseModel):
    digit: int  # 随机数字：生成的单个随机数字，整数类型
    method: str = "普通单个随机整数"  # 生成方法：描述随机数字的生成方式，默认值为"uniform"，字符串类型
    description: str = "生成0~9之间的随机数字"  # 描述信息：对随机数字的详细说明，默认值为"生成0~9之间的随机数字"，字符串类型

# 定义三个随机数字数据传输对象类，继承自BaseModel
class RandomThreeDigitsDTO(BaseModel):
    three_digits: str  # 三个随机数字：生成的三位随机数字字符串，字符串类型
    parity_str: str  # 背正字符串：表示三个数字的背正状态，如："背正背"，字符串类型
    odd_count: int  # 奇数个数：三个数字中奇数的数量，整数类型
    method: str = "模拟六爻三个铜钱随机正背"  # 生成方法：描述三个随机数字的生成方式，默认值为"uniform"，字符串类型
    description: str = "生成三个随机数字的字符串"  # 描述信息：对三个随机数字的详细说明，默认值为"生成三个随机数字的字符串"，字符串类型

# 定义随机六十甲子数据传输对象类，继承自BaseModel
class RandomJiaziDTO(BaseModel):
    jiazi: str  # 干支：随机选择的六十甲子干支组合，字符串类型
    index: int  # 序号：在六十甲子列表中的序号（从1开始），整数类型
    total_count: int  # 总数：六十甲子总数，固定为60，整数类型
    method: str = "模拟抽签六十甲子"  # 生成方法：描述随机干支的生成方式，默认值为"uniform"，字符串类型
    description: str = "从六十甲子中随机选择一个干支"  # 描述信息：对随机干支的详细说明，默认值为"从六十甲子中随机选择一个干支"，字符串类型

# 定义公历时间验证结果数据传输对象类，继承自BaseModel
class SolarValidationDTO(BaseModel):
    valid: bool  # 验证结果：表示公历时间是否有效，布尔类型
    error: Optional[str] = None  # 错误信息：验证失败时的错误描述，可选参数，默认为None，字符串类型
    message: Optional[str] = None  # 成功消息：验证成功时的提示信息，可选参数，默认为None，字符串类型
    method: str = "公历时间参数验证"  # 验证方法：描述公历时间验证的方式，默认值为"公历时间参数验证"，字符串类型
    description: str = "验证公历年、月、日、时、分、秒参数的有效性和合法性"  # 描述信息：对公历时间验证的详细说明，默认值为"验证公历年、月、日、时、分、秒参数的有效性和合法性"，字符串类型

# 定义农历时间验证结果数据传输对象类，继承自BaseModel
class LunarValidationDTO(BaseModel):
    valid: bool  # 验证结果：表示农历时间是否有效，布尔类型
    error: Optional[str] = None  # 错误信息：验证失败时的错误描述，可选参数，默认为None，字符串类型
    message: Optional[str] = None  # 成功消息：验证成功时的提示信息，可选参数，默认为None，字符串类型
    method: str = "农历时间参数验证"  # 验证方法：描述农历时间验证的方式，默认值为"农历时间参数验证"，字符串类型
    description: str = "验证农历年、月、日、闰月、时、分、秒参数的有效性和合法性"  # 描述信息：对农历时间验证的详细说明，默认值为"验证农历年、月、日、闰月、时、分、秒参数的有效性和合法性"，字符串类型

# 定义公历转换结果数据传输对象类，继承自BaseModel
class SolarConversionDTO(BaseModel):
    success: bool  # 转换是否成功：表示公历转农历是否成功，布尔类型
    valid: bool  # 数据是否有效：表示输入数据是否有效，布尔类型
    input_type: str  # 输入类型：表示原始输入的类型，字符串类型
    conversion_type: str  # 转换类型：表示执行的转换操作类型，字符串类型
    solar_info: Dict[str, Any]  # 公历信息：包含所有公历相关的详细信息，字典类型
    lunar_info: Dict[str, Any]  # 农历信息：包含所有农历相关的详细信息，字典类型
    ganzhi_info: Dict[str, Any]  # 干支信息：包含所有干支相关的详细信息，字典类型
    jieqi_info: Dict[str, Any]  # 节气信息：包含所有节气相关的详细信息，字典类型
    method: str = "公历转农历"  # 转换方法：描述公历转农历的方式，默认值为"公历转农历"，字符串类型
    description: str = "将公历日期转换为农历信息"  # 描述信息：对公历转农历的详细说明，默认值为"将公历日期转换为农历信息"，字符串类型

# 定义农历转换结果数据传输对象类，继承自BaseModel
class LunarConversionDTO(BaseModel):
    success: bool  # 转换是否成功：表示农历转公历是否成功，布尔类型
    valid: bool  # 数据是否有效：表示输入数据是否有效，布尔类型
    input_type: str  # 输入类型：表示原始输入的类型，字符串类型
    conversion_type: str  # 转换类型：表示执行的转换操作类型，字符串类型
    solar_info: Dict[str, Any]  # 公历信息：包含所有公历相关的详细信息，字典类型
    lunar_info: Dict[str, Any]  # 农历信息：包含所有农历相关的详细信息，字典类型
    ganzhi_info: Dict[str, Any]  # 干支信息：包含所有干支相关的详细信息，字典类型
    jieqi_info: Dict[str, Any]  # 节气信息：包含所有节气相关的详细信息，字典类型
    method: str = "农历转公历"  # 转换方法：描述农历转公历的方式，默认值为"农历转公历"，字符串类型
    description: str = "将农历日期转换为公历信息"  # 描述信息：对农历转公历的详细说明，默认值为"将农历日期转换为公历信息"，字符串类型


# 默认导出列表（定义模块的公开导出列表）
__all__ = [
    'RandomDigitDTO',  # 导出随机数字数据传输对象
    'RandomThreeDigitsDTO',  # 导出三个随机数字数据传输对象
    'RandomJiaziDTO',  # 导出随机六十甲子数据传输对象
    'SolarValidationDTO',  # 导出公历时间验证结果数据传输对象
    'LunarValidationDTO',  # 导出农历时间验证结果数据传输对象
    'SolarConversionDTO',  # 导出公历转换结果数据传输对象
    'LunarConversionDTO'  # 导出农历转换结果数据传输对象
]
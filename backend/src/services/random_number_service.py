# backend/src/services/random_number_service.py 2026-02-11 12:30:00
# 功能：随机数生成服务模块，封装业务逻辑和错误处理

import logging  # 导入Python标准日志模块，用于记录服务运行日志
from divination.random_number_divination import RandomNumberDivination  # 导入随机数起卦法核心算法类
from data.sixty_jiazi_data import SIXTY_JIAZI  # 导入六十甲子静态数据，包含60个干支组合
from models.dto_models import RandomDigitDTO, RandomThreeDigitsDTO, RandomJiaziDTO  # 导入数据传输对象模型，用于标准化API响应格式
# 导入服务层错误处理装饰器，提供统一的异常处理机制
from utils.service_decorators import (
    handle_random_digit_service_errors,  # 随机数字生成错误处理装饰器
    handle_random_three_digits_service_errors,  # 三个随机数字错误处理装饰器
    handle_random_jiazi_service_errors  # 随机干支选择错误处理装饰器
)

# 配置日志系统，获取当前模块的日志记录器实例
logger = logging.getLogger(__name__)  # 使用模块名作为日志记录器名称，便于日志追踪和分类

# 时间戳将在API层统一处理，服务层专注于业务逻辑和数据转换

# 随机数生成服务类，封装所有（三种）随机数生成相关的业务逻辑
class RandomNumberService:
    
    # 生成0~9一个随机数字服务方法
    @handle_random_digit_service_errors  # 应用错误处理装饰器，自动处理异常和日志记录

    # 返回类型为随机数字DTO对象
    def get_random_digit(self) -> RandomDigitDTO:
        digit = RandomNumberDivination.generate_single_yao_value()  # 调用静态随机数法核心算法 - 生成单个随机数值
        return RandomDigitDTO(digit=digit)  # 将随机数字封装到DTO对象中返回
    
    # 生成三个随机数字字符串服务方法
    @handle_random_three_digits_service_errors  # 应用三个随机数字的错误处理装饰器

    # 返回类型为三个随机数字DTO对象
    def get_random_three_digits(self) -> RandomThreeDigitsDTO:
        digit_str, parity_str, odd_count = RandomNumberDivination.generate_three_yao_values()  # 调用随机数核心算法 - 生成三个爻位的随机数值，同时获取数字字符串、奇偶字符串和奇数个数
        
        # 构建并返回标准化的DTO响应对象
        return RandomThreeDigitsDTO(
            three_digits=digit_str,  # 三个随机数字组成的字符串
            parity_str=parity_str,  # 奇偶性字符串（如"阳阴阳"）
            odd_count=odd_count  # 奇数个数统计
        )
    
    # 随机选择六十甲子干支服务方法
    @handle_random_jiazi_service_errors  # 应用随机干支选择的错误处理装饰器

    # 返回类型为随机干支DTO对象
    def get_random_jiazi(self) -> RandomJiaziDTO:
        jiazi = RandomNumberDivination.generate_random_jiazi()  # 调用静态方法随机选择干支 - 从六十甲子中随机选择一个干支
        
        # 构建并返回标准化的DTO响应对象
        return RandomJiaziDTO(
            jiazi=jiazi,  # 选中的干支字符串
            index=SIXTY_JIAZI.index(jiazi) + 1,  # 计算干支在六十甲子中的序号（从1开始）
            total_count=len(SIXTY_JIAZI)  # 干支总数，固定为60
        )


random_number_service = RandomNumberService()  # 创建服务实例，采用单例模式提供全局服务访问（实例化服务类，供API层调用）


# 默认导出列表，定义模块的公共接口（指定哪些名称可以从模块中导入）
__all__ = [
    'RandomNumberService',  # 导出服务类，便于测试和扩展
    'random_number_service'  # 导出服务实例，供API层直接使用
]
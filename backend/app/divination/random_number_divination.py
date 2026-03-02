# backend/src/divination/random_number_divination.py 2026-02-11 12:15:00
# 功能：随机数起卦法实现，提供六爻起卦所需的随机数生成

import random  # 导入随机数模块，用于生成随机数
from typing import Tuple  # 导入类型提示模块，用于类型注解
from data.sixty_jiazi_data import SIXTY_JIAZI  # 导入六十甲子静态数据


# 随机数起卦法类，提供起卦、起局等所需的随机数生成功能
class RandomNumberDivination:
    
    @staticmethod
    # 生成单个随机数值（0~9）
    def generate_single_yao_value() -> int:

        result = random.randint(0, 9)  # 使用random模块生成0~9之间的随机整数
        return result  # 返回生成的随机数
    

    @staticmethod
    # 生成三个随机数值（0~9）
    def generate_three_yao_values() -> Tuple[str, str, int]:
        
        digits = [str(random.randint(0, 9)) for _ in range(3)]  # 步骤1：生成三个0~9的随机整数，并转换为字符串列表
        digit_str = ''.join(digits)  # 步骤2：拼接数字字符串：将三个数字拼接成一个字符串，用于前端显示

        parity_list = ['背' if int(d) % 2 else '正' for d in digits]  # 步骤3：对生成的随机数进行奇偶判断：奇数用"背"表示，偶数用"正"表示
        parity_str = ''.join(parity_list)  # 步骤4：拼接背正字符串：将奇偶判断结果拼接成一个字符串，用于前端显示
        
        odd_count = sum(1 for d in digits if int(d) % 2 == 1)  # 步骤4：统计奇数个数：计算三个数字中奇数的数量
        
        return digit_str, parity_str, odd_count  # 步骤5：返回三个结果：数字字符串、背正字符串、奇数个数
    

    @staticmethod
    #  随机选择一个六十甲子
    def generate_random_jiazi() -> str:
        
        result = random.choice(SIXTY_JIAZI)  # 从六十甲子静态数据中随机选择一个干支组合
        return result  # 返回随机选择的六十甲子字符串


__all__ = ['RandomNumberDivination']  # 默认导出列表，指定模块的公开接口
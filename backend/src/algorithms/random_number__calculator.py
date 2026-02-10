# backend/src/algorithms/random_number__calculator.py 2024-12-19 14:30:00
# 功能：随机数生成器模块，提供多种随机数生成功能

import random
import string
# datetime模块已移除，使用lunar库替代
from typing import List


class RandomGenerator: # 随机数生成器类  
    
    # 六十甲子列表
    JIAZI_LIST = [
        "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
        "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
        "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
        "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
        "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
        "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
     ]
    
    
    # 生成0~9的随机整数
    @staticmethod
    def random_digit() -> int:
        result = random.randint(0, 9)
        return result
    
    # 生成三个0~9的随机整数，并返回相关结果
    @staticmethod
    def random_three_digits() -> tuple:
        # 生成三个0~9的随机整数，并转换为字符串
        digits = [str(random.randint(0, 9)) for _ in range(3)]
        
        # 一：拼接数字字符串
        digit_str = ''.join(digits)
        
        # 二：对生成的随机数进行奇偶判断，奇数用“背”表示，偶数用“正”表示
        parity_list = ['背' if int(d) % 2 else '正' for d in digits]
        parity_str = ''.join(parity_list)
        
        # 三：统计奇数个数
        odd_count = sum(1 for d in digits if int(d) % 2 == 1)
        
        # 四：返回三个结果
        return digit_str, parity_str, odd_count

    # 随机选择的六十甲子之一
    @staticmethod
    def random_jiazi() -> str:
        result = random.choice(RandomGenerator.JIAZI_LIST)
        return result

# 测试代码
result = RandomGenerator.random_three_digits()
print("数字字符串:", result[0])
print("背正字符串:", result[1])
print("奇数个数:", result[2])
print("完整结果:", result)

print(RandomGenerator.random_digit())
print(RandomGenerator.random_jiazi())
    

# 默认导出
__all__ = ['RandomGenerator']
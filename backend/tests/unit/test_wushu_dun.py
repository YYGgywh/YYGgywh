"""
验证五鼠遁推算逻辑
"""

# 天干列表
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

# 地支列表
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 五鼠遁表（日干 -> 子时时干）
WU_SHU_DUN = {
    "甲": "甲", "乙": "丙", "丙": "戊", "丁": "庚", "戊": "壬",
    "己": "甲", "庚": "丙", "辛": "戊", "壬": "庚", "癸": "壬"
}

def calculate_time_gan(day_gan: str, time_zhi: str) -> str:
    """根据日干和时支计算时干"""
    # 根据日干获取子时的时干
    first_time_gan = WU_SHU_DUN.get(day_gan)
    if not first_time_gan:
        return None
    
    # 计算地支在列表中的索引
    zhi_index = DI_ZHI.index(time_zhi)
    
    # 计算子时在地支列表中的索引
    zi_index = DI_ZHI.index("子")
    
    # 计算时辰差
    time_diff = (zhi_index - zi_index) % 12
    
    # 根据子时时干推算当前时辰的时干
    first_time_gan_index = TIAN_GAN.index(first_time_gan)
    expected_time_gan_index = (first_time_gan_index + time_diff) % 10
    expected_time_gan = TIAN_GAN[expected_time_gan_index]
    
    return expected_time_gan

# 测试戊日的午时
print("戊日午时的时干推算:")
print(f"日干: 戊")
print(f"时支: 午")
result = calculate_time_gan("戊", "午")
print(f"推算结果: {result}")
print(f"期望结果: 戊")
print(f"是否正确: {result == '戊'}")

# 验证其他组合
print("\n验证其他组合:")
test_cases = [
    ("甲", "子", "甲"),  # 甲日子时
    ("甲", "丑", "乙"),  # 甲日丑时
    ("乙", "子", "丙"),  # 乙日子时
    ("乙", "午", "壬"),  # 乙日午时
    ("戊", "子", "壬"),  # 戊日子时
    ("戊", "午", "戊"),  # 戊日午时
    ("癸", "子", "壬"),  # 癸日子时
    ("癸", "亥", "癸"),  # 癸日亥时
]

for day_gan, time_zhi, expected in test_cases:
    result = calculate_time_gan(day_gan, time_zhi)
    correct = result == expected
    print(f"日干{day_gan}，时支{time_zhi}：推算{result}，期望{expected}，正确性：{correct}")
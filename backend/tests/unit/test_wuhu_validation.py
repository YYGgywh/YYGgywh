"""
验证五虎遁规则
"""

# 天干列表
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

# 地支列表
DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 五虎遁表（年干 -> 正月月干）
WU_HU_DUN = {
    "甲": "丙", "乙": "戊", "丙": "庚", "丁": "壬", "戊": "甲",
    "己": "丙", "庚": "戊", "辛": "庚", "壬": "壬", "癸": "甲"
}

def verify_wuhu_dun(year_gan: str, month_pillar: str):
    """验证五虎遁规则"""
    print(f"验证五虎遁: 年干{year_gan}，月柱{month_pillar}")
    
    # 根据年干获取正月（寅月）的月干
    expected_first_month_gan = WU_HU_DUN.get(year_gan)
    print(f"正月月干: {expected_first_month_gan}")
    
    # 获取月柱的地支
    month_zhi = month_pillar[1]
    
    # 计算地支在列表中的索引
    zhi_index = DI_ZHI.index(month_zhi)
    
    # 计算正月（寅月）在地支列表中的索引
    yin_index = DI_ZHI.index("寅")
    
    # 计算月数差
    month_diff = (zhi_index - yin_index) % 12
    print(f"月支{month_zhi}与寅月差: {month_diff}")
    
    # 根据正月月干推算当前月的月干
    first_month_gan_index = TIAN_GAN.index(expected_first_month_gan)
    expected_month_gan_index = (first_month_gan_index + month_diff) % 10
    expected_month_gan = TIAN_GAN[expected_month_gan_index]
    
    # 验证月干是否匹配
    actual_month_gan = month_pillar[0]
    print(f"期望月干: {expected_month_gan}")
    print(f"实际月干: {actual_month_gan}")
    print(f"验证结果: {expected_month_gan == actual_month_gan}")
    
    return expected_month_gan == actual_month_gan

# 测试甲子年丁卯月
print("=== 测试甲子年丁卯月 ===")
result1 = verify_wuhu_dun("甲", "丁卯")
print()

# 测试正确的组合
print("=== 测试甲子年丙寅月 ===")
result2 = verify_wuhu_dun("甲", "丙寅")
print()

# 测试甲子年戊辰月
print("=== 测试甲子年戊辰月 ===")
result3 = verify_wuhu_dun("甲", "戊辰")
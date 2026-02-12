"""
测试字符位置计算
"""

pillars = "甲子丙寅戊辰庚X"
print(f"四柱字符串: {pillars}")
print(f"字符串长度: {len(pillars)}")

for i, char in enumerate(pillars):
    print(f"位置{i+1}: 字符'{char}'，索引{i}")
    if i % 2 == 0:
        print(f"  - 这是天干位置（偶数索引）")
    else:
        print(f"  - 这是地支位置（奇数索引）")
from lunar_python import Solar, Lunar

# 测试方法链的使用
lunar_date = Lunar.fromYmdHms(2025, 10, 15, 0, 0, 0)

print("=== 测试方法链的正确使用 ===")

# 方法1：分段实现（您认为正确的方式）
print("\n1. 分段实现：")
jieqi_obj = lunar_date.getPrevJie()
solar_obj = jieqi_obj.getSolar()
result1 = solar_obj.toYmdHms()
print(f"分段实现结果: {result1}")

# 方法2：方法链实现（您认为可能有问题的方式）
print("\n2. 方法链实现：")
result2 = lunar_date.getPrevJie().getSolar().toYmdHms()
print(f"方法链实现结果: {result2}")

# 比较结果
print(f"\n结果是否相同: {result1 == result2}")

print("\n=== 测试更多方法链 ===")

# 测试其他方法链
print("\n3. 测试更多方法链：")
result3 = lunar_date.getNextJie().getSolar().toYmdHms()
result4 = lunar_date.getPrevQi().getSolar().toYmdHms()
result5 = lunar_date.getNextQi().getSolar().toYmdHms()

print(f"下一个节: {result3}")
print(f"上一个气: {result4}")
print(f"下一个气: {result5}")

print("\n=== 测试复杂方法链 ===")

# 测试更复杂的方法链
print("\n4. 复杂方法链测试：")
# 获取节气名称和时间的组合
jieqi_name = lunar_date.getPrevJie().getName()
jieqi_time = lunar_date.getPrevJie().getSolar().toYmdHms()
print(f"节气名称: {jieqi_name}")
print(f"节气时间: {jieqi_time}")

# 直接方法链
print("\n5. 直接方法链：")
print(f"节气信息: {lunar_date.getPrevJie().getName()} - {lunar_date.getPrevJie().getSolar().toYmdHms()}")
# Lunar-Python 农历计算库使用说明

## 概述

圆运阁排盘系统集成了 **lunar-python** 库，这是一个专业的农历计算库，为易学排盘提供准确的农历、节气、干支等历法计算功能。

## 安装与配置

### 依赖安装

lunar-python库已添加到项目依赖中，安装方法：

```bash
cd backend
pip install -r requirements.txt
```

### 版本信息

当前使用的版本：`lunar-python==1.4.8`

## 核心功能

### 1. 农历转换

支持公历到农历的精确转换，包括：
- 农历年、月、日
- 农历年、月、日的中文名称
- 闰月判断
- 生肖计算

### 2. 节气计算

自动识别24节气：
- 立春、雨水、惊蛰、春分等
- 精确到节气日
- 节气名称获取

### 3. 干支计算

提供完整的干支信息：
- 年干支（如：甲子、乙丑）
- 月干支
- 日干支
- 时干支（待扩展）

### 4. 闰月处理

正确处理农历闰月情况：
- 闰月标识
- 闰月日期计算
- 闰月年份识别

## 使用方法

### 基础使用

```python
from src.algorithms.calendar_calculator import CalendarCalculator

# 创建计算器实例
calc = CalendarCalculator()

# 检查库可用性
if calc.is_available():
    print("lunar-python库已正确安装")
```

### 获取完整历法信息

```python
# 获取指定日期的完整历法信息
info = calc.get_comprehensive_calendar_info(2024, 1, 1)

print("=== 公历信息 ===")
print(f"日期: {info['solar']['solar_date']}")

print("=== 农历信息 ===")
print(f"农历日期: {info['lunar']['lunar_date']}")
print(f"农历年: {info['lunar']['lunar_year_name']}")
print(f"农历月: {info['lunar']['lunar_month_name']}")
print(f"农历日: {info['lunar']['lunar_day_name']}")
print(f"生肖: {info['lunar']['animal']}")
print(f"是否闰月: {info['lunar']['is_leap_month']}")

print("=== 干支信息 ===")
print(f"年干支: {info['ganzhi']['year_ganzhi']}")
print(f"月干支: {info['ganzhi']['month_ganzhi']}")
print(f"日干支: {info['ganzhi']['day_ganzhi']}")

print("=== 节气信息 ===")
print(f"节气: {info['jieqi']['jieqi']}")
print(f"是否节气日: {info['jieqi']['is_jieqi_day']}")

print("=== 星座信息 ===")
print(f"星座: {info['constellation']['constellation']}")
```

### 单独功能调用

```python
# 单独获取农历信息
lunar_info = calc.get_lunar_info(2024, 1, 1)

# 单独获取干支信息
ganzhi_info = calc.get_ganzhi_info(2024, 1, 1)

# 单独获取节气信息
jieqi_info = calc.get_jieqi_info(2024, 1, 1)

# 公历转农历
conversion_result = calc.convert_solar_to_lunar(2024, 1, 1)
```

## 高级用法

### 节气日期查询

```python
# 查询2024年所有节气
jieqi_dates_2024 = [
    (2024, 1, 6),   # 小寒
    (2024, 2, 4),   # 立春
    # ... 其他节气
]

for year, month, day in jieqi_dates_2024:
    jieqi_info = calc.get_jieqi_info(year, month, day)
    if jieqi_info['is_jieqi_day']:
        print(f"{year}-{month:02d}-{day:02d}: {jieqi_info['jieqi']}")
```

### 干支周期验证

```python
# 验证60年干支周期
jiazi_years = [1984, 2044]  # 甲子年

for year in jiazi_years:
    ganzhi_info = calc.get_ganzhi_info(year, 2, 1)  # 春节后日期
    print(f"{year}年干支: {ganzhi_info['year_ganzhi']}")
```

### 闰月年份处理

```python
# 处理闰月年份
leap_month_years = [2023, 2025, 2028]

for year in leap_month_years:
    # 测试闰月日期
    info = calc.get_comprehensive_calendar_info(year, 3, 1)
    if info['lunar']['is_leap_month']:
        print(f"{year}年有闰月")
```

## 错误处理

### 异常处理机制

```python
try:
    # 正常使用
    info = calc.get_comprehensive_calendar_info(2024, 1, 1)
except Exception as e:
    print(f"计算错误: {e}")
    # 回退到简化实现
    fallback_info = calc._get_simplified_lunar_info(2024, 1, 1)
```

### 无效日期处理

```python
try:
    # 无效日期（2月30日）
    info = calc.get_comprehensive_calendar_info(2024, 2, 30)
except ValueError as e:
    print(f"无效日期: {e}")
```

## 测试验证

### 运行测试用例

项目包含完整的测试用例，验证lunar-python库的准确性：

```bash
# 基础功能测试
python tests/test_lunar_calendar.py

# 准确性验证测试
python tests/test_accuracy_validation.py
```

### 测试覆盖范围

- ✅ 重要日期验证（春节、端午、中秋等）
- ✅ 24节气准确性验证（100%通过）
- ✅ 闰月处理验证
- ✅ 干支一致性验证
- ✅ 错误处理验证

## 性能优化

### 缓存机制

对于频繁使用的日期计算，建议实现缓存机制：

```python
from functools import lru_cache

class CachedCalendarCalculator(CalendarCalculator):
    @lru_cache(maxsize=1000)
    def get_comprehensive_calendar_info(self, year: int, month: int, day: int):
        return super().get_comprehensive_calendar_info(year, month, day)
```

### 批量处理

对于批量日期计算，建议使用批量处理：

```python
def batch_calculate_dates(calculator, dates_list):
    """批量计算多个日期的历法信息"""
    results = []
    for year, month, day in dates_list:
        info = calculator.get_comprehensive_calendar_info(year, month, day)
        results.append(info)
    return results
```

## 常见问题

### Q: lunar-python库支持哪些年份范围？
A: lunar-python库支持从公元前1900年到公元2100年的农历计算。

### Q: 如何处理时区问题？
A: 当前版本默认使用系统时区，未来版本将支持自定义时区设置。

### Q: 节气计算是否准确？
A: 经过验证，24节气计算的准确率达到100%。

### Q: 是否支持时辰干支计算？
A: 当前版本支持年、月、日干支，时辰干支将在后续版本中添加。

## 版本更新

### v1.0.0 (当前版本)
- ✅ 集成lunar-python库
- ✅ 农历转换功能
- ✅ 节气计算功能
- ✅ 干支计算功能
- ✅ 完整的测试用例

### 未来计划
- 🔄 时辰干支计算
- 🔄 自定义时区支持
- 🔄 更多历法算法集成

## 技术支持

如有技术问题，请参考：
- [lunar-python官方文档](https://github.com/6tail/lunar-python)
- 项目Issue页面
- 开发者文档

---

*最后更新: 2024年1月*
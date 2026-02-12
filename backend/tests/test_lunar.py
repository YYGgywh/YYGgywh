# backend/tests/test_lunar.py 2026-02-12 16:45:00
# 功能：lunar-python库核心功能测试，验证Solar、Lunar、LunarMonth等类的功能

from lunar_python import Solar, Lunar, LunarMonth

# 前端传参格式示例（全局变量，所有测试方法都可以使用）
SOLAR_PARAMS = {
    "year": "2026",
    "month": "1", 
    "day": "30",
    "hour": "12",
    "minute": "0",
    "second": "0"
}

LUNAR_PARAMS = {
    "lunar_year": "2025",
    "lunar_month": "6",
    "lunar_day": "9",
    "is_leap_month": "false",
    "hour": "15",
    "minute": "30",
    "second": "45"
}

# 测试Solar类（公历）的基本功能
def test_solar_class():
    print("=== 测试Solar类（公历） ===")
    
    # 使用全局参数创建Solar对象
    solar_year = int(SOLAR_PARAMS["year"])
    solar_month = int(SOLAR_PARAMS["month"])
    solar_day = int(SOLAR_PARAMS["day"])
    solar_hour = int(SOLAR_PARAMS["hour"])
    solar_minute = int(SOLAR_PARAMS["minute"])
    solar_second = int(SOLAR_PARAMS["second"])
    
    solar = Solar.fromYmdHms(solar_year, solar_month, solar_day, solar_hour, solar_minute, solar_second)
    
    # 测试基本属性
    print(f"公历日期: {solar.toYmd()}")
    print(f"年份: {solar.getYear()}")
    print(f"月份: {solar.getMonth()}")
    print(f"日期: {solar.getDay()}")
    print(f"星期: {solar.getWeekInChinese()}")
    
    # 测试转换为农历
    lunar = solar.getLunar()
    print(f"对应农历: {lunar.toString()}")
    print("✓ Solar类测试完成\n")

# 测试Lunar类（农历）的基本功能
def test_lunar_class():
    print("=== 测试Lunar类（农历） ===")
    
    # 使用全局参数创建Lunar对象
    lunar_year = int(LUNAR_PARAMS["lunar_year"])
    lunar_month = int(LUNAR_PARAMS["lunar_month"])
    lunar_day = int(LUNAR_PARAMS["lunar_day"])
    is_leap_month = LUNAR_PARAMS["is_leap_month"].lower() == "true"
    lunar_hour = int(LUNAR_PARAMS["hour"])
    lunar_minute = int(LUNAR_PARAMS["minute"])
    lunar_second = int(LUNAR_PARAMS["second"])
    
    # 根据闰月标志创建Lunar对象
    if is_leap_month:
        lunar_normal = Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, lunar_hour, lunar_minute, lunar_second)
    else:
        lunar_normal = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, lunar_hour, lunar_minute, lunar_second)
    
    # 测试基本属性
    print(f"农历日期: {lunar_normal.toString()}")
    print(f"农历年份: {lunar_normal.getYear()}")
    print(f"农历月份: {lunar_normal.getMonth()}")
    print(f"农历日期: {lunar_normal.getDay()}")
    print(f"生肖: {lunar_normal.getYearShengXiao()}")
    print(f"年干支: {lunar_normal.getYearInGanZhi()}")
    print(f"月干支: {lunar_normal.getMonthInGanZhi()}")
    print(f"日干支: {lunar_normal.getDayInGanZhi()}")
    
    # 测试转换为公历
    solar = lunar_normal.getSolar()
    print(f"对应公历: {solar.toYmd()}")

    print("✓ Lunar类测试完成\n")

# 测试LunarMonth类（农历月份）的基本功能
def test_lunar_month_class():
    print("=== 测试LunarMonth类（农历月份） ===")
    
    # 使用全局参数测试月份
    lunar_year = int(LUNAR_PARAMS["lunar_year"])
    lunar_month = int(LUNAR_PARAMS["lunar_month"]) if not LUNAR_PARAMS["is_leap_month"].lower() == "true" else -int(LUNAR_PARAMS["lunar_month"])
    
    # 测试指定月份
    lunar_month_normal = LunarMonth.fromYm(lunar_year, lunar_month)
    
    print(f"{lunar_year}年{lunar_month}月农历信息:")
    print(f"  总天数: {lunar_month_normal.getDayCount()}")
    print(f"  是否为闰月: {lunar_month_normal.isLeap()}")
    print(f"  月份索引: {lunar_month_normal.getIndex()}")
    
    print("✓ LunarMonth类测试完成\n")

# 测试干支计算功能
def test_ganzhi_calculation():
    print("=== 测试干支计算 ===")
    
    # 测试特定日期的干支
    test_dates = [
        (2025, 2, 3, "乙巳年 戊寅月 癸卯日"),
        (2024, 2, 10, "甲辰年 丙寅月 甲辰日"),  # 春节
        (2023, 1, 22, "壬寅年 癸丑月 庚辰日"),  # 春节
    ]
    
    for year, month, day, expected_ganzhi in test_dates:
        lunar = Lunar.fromYmdHms(year, month, day, 0, 0, 0)
        actual_ganzhi = f"{lunar.getYearInGanZhi()}年 {lunar.getMonthInGanZhi()}月 {lunar.getDayInGanZhi()}日"
        
        print(f"{year}-{month:02d}-{day:02d}: {actual_ganzhi}")
        if expected_ganzhi:
            status = "✓" if actual_ganzhi == expected_ganzhi else "✗"
            print(f"  {status} 期望: {expected_ganzhi}")
    
    print("✓ 干支计算测试完成\n")


def test_jieqi_calculation():
    """测试节气计算功能"""
    print("=== 测试节气计算 ===")
    
    # 测试特定月份的节气
    lunar = Lunar.fromYmdHms(2025, 2, 3, 0, 0, 0)
    
    # 获取当前节气
    jieqi = lunar.getJieQi()
    print(f"当前节气: {jieqi}")
    
    # 获取当前节气的详细信息
    jieqi_table = lunar.getJieQiTable()
    print("2025年2月节气信息:")
    for key, value in jieqi_table.items():
        if "2025-02" in key:
            print(f"  {key}: {value}")
    
    print("✓ 节气计算测试完成\n")


def test_conversion_accuracy():
    """测试公历农历转换的准确性"""
    print("=== 测试公历农历转换准确性 ===")
    
    # 测试双向转换
    test_cases = [
        (2025, 2, 3, 22, 10, 27),  # 普通日期
        (2024, 2, 29, 0, 0, 0),    # 闰年日期
        (2023, 12, 31, 23, 59, 59), # 年末日期
    ]
    
    for year, month, day, hour, minute, second in test_cases:
        # 公历转农历
        solar = Solar.fromYmdHms(year, month, day, hour, minute, second)
        lunar_from_solar = solar.getLunar()
        
        # 农历转公历
        solar_from_lunar = lunar_from_solar.getSolar()
        
        # 验证转换准确性
        solar_match = (solar.getYear() == solar_from_lunar.getYear() and
                      solar.getMonth() == solar_from_lunar.getMonth() and
                      solar.getDay() == solar_from_lunar.getDay())
        
        status = "✓" if solar_match else "✗"
        print(f"{status} {year}-{month:02d}-{day:02d}: 双向转换{'成功' if solar_match else '失败'}")
        if not solar_match:
            print(f"  原始: {solar.toYmd()}")
            print(f"  转换: {solar_from_lunar.toYmd()}")
    
    print("✓ 转换准确性测试完成\n")


def test_edge_cases():
    """测试边界情况"""
    print("=== 测试边界情况 ===")
    
    # 测试最小日期
    try:
        lunar_min = Lunar.fromYmdHms(1, 1, 1, 0, 0, 0)
        print(f"✓ 最小日期(1年1月1日): {lunar_min.toString()}")
    except Exception as e:
        print(f"✗ 最小日期测试失败: {e}")
    
    # 测试最大日期
    try:
        lunar_max = Lunar.fromYmdHms(9999, 12, 30, 23, 59, 59)
        print(f"✓ 最大日期(9999年12月30日): {lunar_max.toString()}")
    except Exception as e:
        print(f"✗ 最大日期测试失败: {e}")
    
    # 测试无效日期
    try:
        lunar_invalid = Lunar.fromYmdHms(2025, 2, 30, 0, 0, 0)  # 2025年2月没有30日
        print(f"✗ 无效日期测试失败: 应该抛出异常")
    except Exception as e:
        print(f"✓ 无效日期测试成功: {e}")
    
    print("✓ 边界情况测试完成\n")


def test_parameter_format():
    """测试前端参数格式的处理"""
    print("=== 测试前端参数格式处理 ===")
    
    print("前端传参格式:")
    print(f"公历参数: {SOLAR_PARAMS}")
    print(f"农历参数: {LUNAR_PARAMS}")
    
    # 处理公历参数
    print("\n=== 处理公历参数 ===")
    try:
        # 参数类型转换
        solar_year = int(SOLAR_PARAMS["year"])
        solar_month = int(SOLAR_PARAMS["month"])
        solar_day = int(SOLAR_PARAMS["day"])
        solar_hour = int(SOLAR_PARAMS["hour"])
        solar_minute = int(SOLAR_PARAMS["minute"])
        solar_second = int(SOLAR_PARAMS["second"])
        
        # 创建Solar对象
        solar = Solar.fromYmdHms(solar_year, solar_month, solar_day, solar_hour, solar_minute, solar_second)
        print(f"✓ 公历参数处理成功: {solar.toYmdHms()}")
        
        # 转换为农历
        lunar_from_solar = solar.getLunar()
        print(f"  对应农历: {lunar_from_solar.toString()}")
        print(f"  年干支: {lunar_from_solar.getYearInGanZhi()}")
        print(f"  月干支: {lunar_from_solar.getMonthInGanZhi()}")
        print(f"  日干支: {lunar_from_solar.getDayInGanZhi()}")
        
    except Exception as e:
        print(f"✗ 公历参数处理失败: {e}")
    
    # 处理农历参数
    print("\n=== 处理农历参数 ===")
    try:
        # 参数类型转换
        lunar_year = int(LUNAR_PARAMS["lunar_year"])
        lunar_month = int(LUNAR_PARAMS["lunar_month"])
        lunar_day = int(LUNAR_PARAMS["lunar_day"])
        is_leap_month = LUNAR_PARAMS["is_leap_month"].lower() == "true"
        lunar_hour = int(LUNAR_PARAMS["hour"])
        lunar_minute = int(LUNAR_PARAMS["minute"])
        lunar_second = int(LUNAR_PARAMS["second"])
        
        # 根据闰月标志创建Lunar对象
        if is_leap_month:
            # 闰月使用负数月份
            lunar = Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, lunar_hour, lunar_minute, lunar_second)
        else:
            lunar = Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, lunar_hour, lunar_minute, lunar_second)
            
        print(f"✓ 农历参数处理成功: {lunar.toString()}")
        
        # 转换为公历
        solar_from_lunar = lunar.getSolar()
        print(f"  对应公历: {solar_from_lunar.toYmdHms()}")
        print(f"  生肖: {lunar.getYearShengXiao()}")
        print(f"  年干支: {lunar.getYearInGanZhi()}")
        print(f"  月干支: {lunar.getMonthInGanZhi()}")
        print(f"  日干支: {lunar.getDayInGanZhi()}")
        
        # 验证闰月标志
        lunar_month_obj = LunarMonth.fromYm(lunar_year, lunar_month)
        actual_is_leap = lunar_month_obj.isLeap()
        print(f"  实际是否为闰月: {actual_is_leap}")
        
        if is_leap_month == actual_is_leap:
            print("  ✓ 闰月标志验证正确")
        else:
            print(f"  ✗ 闰月标志不匹配: 传入{is_leap_month}, 实际{actual_is_leap}")
            
    except Exception as e:
        print(f"✗ 农历参数处理失败: {e}")
    
    print("✓ 参数格式测试完成\n")


def test_parameter_validation():
    """测试参数验证功能"""
    print("=== 测试参数验证功能 ===")
    
    # 测试有效参数
    valid_solar_params = {"year": "2025", "month": "2", "day": "3", "hour": "12", "minute": "0", "second": "0"}
    valid_lunar_params = {"lunar_year": "2025", "lunar_month": "6", "lunar_day": "9", "is_leap_month": "false", "hour": "15", "minute": "30", "second": "45"}
    
    # 测试无效参数
    invalid_solar_params = {"year": "2025", "month": "13", "day": "32", "hour": "25", "minute": "60", "second": "60"}
    invalid_lunar_params = {"lunar_year": "2025", "lunar_month": "6", "lunar_day": "35", "is_leap_month": "true", "hour": "15", "minute": "30", "second": "45"}
    
    def validate_solar_params(params):
        """验证公历参数"""
        try:
            year = int(params["year"])
            month = int(params["month"])
            day = int(params["day"])
            hour = int(params["hour"])
            minute = int(params["minute"])
            second = int(params["second"])
            
            # 基础范围验证
            if not (1 <= year <= 9999):
                return False, "年份超出范围"
            if not (1 <= month <= 12):
                return False, "月份超出范围"
            if not (0 <= hour <= 23):
                return False, "小时超出范围"
            if not (0 <= minute <= 59):
                return False, "分钟超出范围"
            if not (0 <= second <= 59):
                return False, "秒超出范围"
                
            # 使用lunar库验证日期有效性
            Solar.fromYmdHms(year, month, day, hour, minute, second)
            return True, "参数有效"
            
        except Exception as e:
            return False, f"参数验证失败: {e}"
    
    def validate_lunar_params(params):
        """验证农历参数"""
        try:
            lunar_year = int(params["lunar_year"])
            lunar_month = int(params["lunar_month"])
            lunar_day = int(params["lunar_day"])
            is_leap_month = params["is_leap_month"].lower() == "true"
            hour = int(params["hour"])
            minute = int(params["minute"])
            second = int(params["second"])
            
            # 基础范围验证
            if not (1 <= lunar_year <= 9999):
                return False, "农历年份超出范围"
            if not (1 <= lunar_month <= 12):
                return False, "农历月份超出范围"
            if not (0 <= hour <= 23):
                return False, "小时超出范围"
            if not (0 <= minute <= 59):
                return False, "分钟超出范围"
            if not (0 <= second <= 59):
                return False, "秒超出范围"
                
            # 使用lunar库验证日期有效性
            if is_leap_month:
                Lunar.fromYmdHms(lunar_year, -lunar_month, lunar_day, hour, minute, second)
            else:
                Lunar.fromYmdHms(lunar_year, lunar_month, lunar_day, hour, minute, second)
                
            return True, "参数有效"
            
        except Exception as e:
            return False, f"参数验证失败: {e}"
    
    # 测试有效参数
    solar_valid, solar_msg = validate_solar_params(valid_solar_params)
    lunar_valid, lunar_msg = validate_lunar_params(valid_lunar_params)
    
    print(f"公历有效参数测试: {'✓' if solar_valid else '✗'} {solar_msg}")
    print(f"农历有效参数测试: {'✓' if lunar_valid else '✗'} {lunar_msg}")
    
    # 测试无效参数
    solar_invalid, solar_error = validate_solar_params(invalid_solar_params)
    lunar_invalid, lunar_error = validate_lunar_params(invalid_lunar_params)
    
    print(f"公历无效参数测试: {'✓' if not solar_invalid else '✗'} {solar_error}")
    print(f"农历无效参数测试: {'✓' if not lunar_invalid else '✗'} {lunar_error}")
    
    print("✓ 参数验证测试完成\n")


def main():
    """主测试函数"""
    print("🚀 开始lunar-python库核心功能测试")
    print("=" * 60)
    
    # 执行所有测试
    test_solar_class()
    test_lunar_class()
    test_lunar_month_class()
    test_ganzhi_calculation()
    test_jieqi_calculation()
    test_conversion_accuracy()
    test_edge_cases()
    test_parameter_format()
    test_parameter_validation()
    
    print("=" * 60)
    print("🎉 lunar-python库核心功能测试完成")


if __name__ == "__main__":
    main()
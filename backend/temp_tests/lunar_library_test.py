# backend/tests/test_lunar_calendar.py 2025-11-30 09:18:37
# 功能：测试lunar-python库的农历转换功能

# 导入系统模块，用于路径操作
import sys
import os

# 将src目录添加到Python路径中，以便能够导入项目中的模块
# os.path.dirname(__file__) 获取当前文件所在目录
# '..' 表示上级目录，'src' 表示源代码目录
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

# 从项目算法模块导入日历计算器类
from algorithms.calendar_calculator import CalendarCalculator

# 从lunar-python库导入Solar和Lunar类
# Solar: 公历日期类，用于处理公历日期
# Lunar: 农历日期类，用于处理农历日期和历法计算
from lunar_python import Solar, Lunar

# datetime模块已移除，使用lunar库替代

def test_solar_date_conversion(year=2025, month=2, day=3, hour=22, minute=10, second=27):
    """测试Solar日期转换功能"""
    
    print(f"输入参数: {year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}")
    print()


    # 获取指定时间的Solar对象并转换为字符串格式
    print(f"★ ===== 公历 ===== ★")
    solar_date = Solar.fromYmdHms(year, month, day, hour, minute, second) #格式化公历对象
    solar_date_YmdHms = solar_date.toYmdHms() # 将公历对象转换为 年-月-日 时:分:秒 字符串格式
    solar_date_year = solar_date.getYear() # 将公历对象 获取年 整数格式
    solar_date_month = solar_date.getMonth() # 将公历对象 获取月 整数格式
    solar_date_day = solar_date.getDay() # 将公历对象 获取日 整数格式
    solar_date_hour = solar_date.getHour() # 将公历对象 获取时 整数格式
    solar_date_minute = solar_date.getMinute() # 将公历对象 获取分 整数格式
    solar_date_second = solar_date.getSecond() # 将公历对象 获取秒 整数格式
     # 将公历对象 获取季节 字符串格式
    solar_date_WeekChinese = solar_date.getWeekInChinese() # 将公历对象 获取星期的中文：日一二三四五六 字符串格式
    solar_date_getFestivals = solar_date.getFestivals() # 将公历对象 返回节日的数组 字符串格式
    solar_date_getOtherFestivals = solar_date.getOtherFestivals() # 将公历对象 返回其他纪念日的数组 字符串格式
    solar_date_getXingZuo = solar_date.getXingZuo() # 将公历对象 返回阳历对应的星座 字符串格式

    print(f"公历对象: {solar_date}")
    print(f"公历: {solar_date_YmdHms}")
    print(f"公历年: {solar_date_year}")
    print(f"公历月: {solar_date_month}")
    print(f"公历日: {solar_date_day}")
    print(f"公历时: {solar_date_hour}")
    print(f"公历分: {solar_date_minute}")
    print(f"公历秒: {solar_date_second}")    
    print(f"公历周:{solar_date_WeekChinese}")
    print(f"公历节日: {solar_date_getFestivals}")
    print(f"公历其他纪念日: {solar_date_getOtherFestivals}")
    print(f"公历星座: {solar_date_getXingZuo}")


    print()
    print(f"★ ===== 农历 ===== ★")

    lunar_date = solar_date.getLunar() # 将公历对象 转换为农历对象
    lunar_FullString = lunar_date.toFullString() # 将农历对象 获取完整字符串格式
    lunar_year = lunar_date.getYearInChinese() # 将农历对象 获取年 字符串格式
    lunar_year_GanZhi = lunar_date.getYearInGanZhi() # 将农历对象 获取年 干支字符串格式
    lunar_year_int = lunar_date.getYear() # 将农历对象 获取年 整数格式
    lunar_month = lunar_date.getMonthInChinese() # 将农历对象 获取月 字符串格式
    lunar_month_int = lunar_date.getMonth() # 将农历对象 获取月 整数格式
    lunar_day = lunar_date.getDayInChinese() # 将农历对象 获取日 字符串格式
    lunar_day_int = lunar_date.getDay() # 将农历对象 获取日 整数格式
    lunar_time = lunar_date.getTimeZhi() # 将农历对象 获取时间 字符串格式
    lunsr_Festivals = lunar_date.getFestivals() # 将农历对象 返回节日的数组 字符串格式
    lunsr_OtherFestivals = lunar_date.getOtherFestivals() # 将农历对象 返回其他纪念日的数组 字符串格式

    print(f"农历对象: {lunar_date}")
    print(f"农历完整字符串: {lunar_FullString}")
    print(f"农历年: {lunar_year}")
    print(f"农历年数: {lunar_year_int}")
    print(f"农历年干支: {lunar_year_GanZhi}")
    print(f"农历月: {lunar_month}")
    print(f"农历月数: {lunar_month_int}")
    print(f"农历日: {lunar_day}")
    print(f"农历日数: {lunar_day_int}")
    print(f"农历时: {lunar_time}")
    print(f"农历节日: {lunsr_Festivals}")
    print(f"农历其他纪念日: {lunsr_OtherFestivals}")


    print()
    print(f"★ ===== 干支 ===== ★")

    lunar_year_GanZhi_Exact = lunar_date.getYearInGanZhiExact() # 将农历对象 获取年干支（立春交节点） 字符串格式
    lunar_year_Gan_Exact = lunar_date.getYearGanExact() # 提取年干（立春交节点） 字符串格式
    lunar_year_Zhi_Exact = lunar_date.getYearZhiExact() # 提取年支（立春交节点） 字符串格式
    lunar_month_GanZhi_Exact = lunar_date.getMonthInGanZhiExact() # 将农历对象 获取月干支（节令交节点） 字符串格式
    lunar_month_Gan_Exact = lunar_date.getMonthGanExact() # 提取月干（节令交节点） 字符串格式
    lunar_month_Zhi_Exact = lunar_date.getMonthZhiExact() # 提取月支（节令交节点） 字符串格式
    lunar_day_GanZhi_Exact = lunar_date.getDayInGanZhiExact() # 将农历对象 获取日干支（子时换日） 字符串格式
    lunar_day_Gan_Exact = lunar_date.getDayGanExact() # 提取日干（子时换日） 字符串格式
    lunar_day_Zhi_Exact = lunar_date.getDayZhiExact() # 提取日支（子时换日） 字符串格式
    lunar_day_GianZhi_Exact2 = lunar_date.getDayInGanZhiExact2() # 提取日天支（00:00换日） 字符串格式
    lunar_day_GianZhi_Exact2_Gan = lunar_date.getDayGanExact2() # 提取日天支（00:00换日） 日干字符串格式
    lunar_day_GianZhi_Exact2_Zhi = lunar_date.getDayZhiExact2() # 提取日天支（00:00换日） 日支字符串格式
    lunar_time_GanZhi_Exact = lunar_date.getTimeInGanZhi() # 提取时干支（） 字符串格式
    lunar_time_Gan_Exact = lunar_date.getTimeGan() # 提取时干（） 字符串格式
    lunar_time_Zhi_Exact = lunar_date.getTimeZhi() # 提取时支（） 字符串格式

    print(f"年干支（立春交节点）: {lunar_year_GanZhi_Exact}")
    print(f"年干（立春交节点）: {lunar_year_Gan_Exact}")
    print(f"年支（立春交节点）: {lunar_year_Zhi_Exact}")
    print(f"月干支（节令交节点）: {lunar_month_GanZhi_Exact}")
    print(f"月干（节令交节点）: {lunar_month_Gan_Exact}")
    print(f"月支（节令交节点）: {lunar_month_Zhi_Exact}")
    print(f"日干支（子时换日）: {lunar_day_GanZhi_Exact}")
    print(f"日干（子时换日）: {lunar_day_Gan_Exact}")
    print(f"日支（子时换日）: {lunar_day_Zhi_Exact}")
    print(f"日天支（00:00换日）: {lunar_day_GianZhi_Exact2}")
    print(f"日天支（00:00换日）日干: {lunar_day_GianZhi_Exact2_Gan}")
    print(f"日天支（00:00换日）日支: {lunar_day_GianZhi_Exact2_Zhi}")
    print(f"时干支（）: {lunar_time_GanZhi_Exact}")
    print(f"时干（）: {lunar_time_Gan_Exact}")
    print(f"时支（）: {lunar_time_Zhi_Exact}")


    print()
    print(f"★ ===== 节气 ===== ★")

    prevJie_name = lunar_date.getPrevJie() # 获取上个节令名称
    prevJie_YmdHms = prevJie_name.getSolar().toYmdHms() # 获取上个节令时间
    preveQi_name = lunar_date.getPrevQi() # 获取上个气令名称
    preveQi_YmdHms = preveQi_name.getSolar().toYmdHms() # 获取上个气令时间
    nextJie_name = lunar_date.getNextJie() # 获取下个节令名称
    nextJie_YmdHms = nextJie_name.getSolar().toYmdHms() # 获取下个节令时间
    nextQi_name = lunar_date.getNextQi() # 获取下个气令名称
    nextQi_YmdHms = nextQi_name.getSolar().toYmdHms() # 获取下个气令时间
    
    solar_prevJie = prevJie_name.getSolar()
    solar_preveQi = preveQi_name.getSolar()
    print(solar_prevJie.isBefore(solar_preveQi))
    if solar_prevJie.isBefore(solar_preveQi):
        JieQi_1 = f"{prevJie_name} {prevJie_YmdHms}"
        JieQi_2 = f"{preveQi_name} {preveQi_YmdHms}"
        JieQi_3 = f"{nextJie_name} {nextJie_YmdHms}"
        
        print(f"上个节令:{JieQi_1}")
        print(f"上个气令:{JieQi_2}")
        print(f"当前时间:当前 {solar_date_YmdHms}")
        print(f"下个节令:{JieQi_3}")
        
    else:
        JieQi_1 = f"{prevJie_name} {prevJie_YmdHms}"
        JieQi_2 = f"{nextQi_name} {nextQi_YmdHms}"
        JieQi_3 = f"{nextJie_name} {nextJie_YmdHms}"
        
        print(f"上个节令:{JieQi_1}")
        print(f"当前时间:当前 {solar_date_YmdHms}")
        print(f"下个气令:{JieQi_2}")
        print(f"下个节令:{JieQi_3}")
 
      
"""
    print(f"上个节令:{prevJie_name} {prevJie_YmdHms}")
    print(f"上个气令:{preveQi_name} {preveQi_YmdHms}")
    print(f"下个节令:{nextJie_name} {nextJie_YmdHms}")
    print(f"下个气令:{nextQi_name} {nextQi_YmdHms}")
    print(f"当前时间:{solar_date_YmdHms}")

"""



# 如果直接运行此文件，则执行测试
if __name__ == "__main__":
    test_solar_date_conversion()


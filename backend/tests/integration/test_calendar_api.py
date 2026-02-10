#!/usr/bin/env python3
"""
历法换算有效性测试脚本
测试正式文件对历法换算的完整功能
"""

import requests
import json
# datetime模块已移除，使用lunar库替代

def test_api_endpoints():
    """测试所有API端点"""
    base_url = "http://localhost:8000/api/v1/calendar"
    
    print("=" * 60)
    print("历法换算有效性测试")
    print("=" * 60)
    
    # 1. 测试获取当前时间
    print("\n1. 测试获取当前时间历法信息")
    try:
        response = requests.get(f"{base_url}/current")
        data = response.json()
        
        if data.get("success"):
            print("✅ GET /current - 成功")
            print(f"   当前时间: {data['data']['solar']['date']}")
            print(f"   农历: {data['data']['lunar']['full_string'][:30]}...")
            print(f"   年干支: {data['data']['ganzhi']['year']['ganzhi']}")
        else:
            print("❌ GET /current - 失败")
            print(f"   错误: {data.get('error')}")
    except Exception as e:
        print(f"❌ GET /current - 异常: {e}")
    
    # 2. 测试日期转换
    print("\n2. 测试日期转换功能")
    test_dates = [
        {"year": 2024, "month": 2, "day": 29, "hour": 12, "minute": 0, "second": 0},  # 闰年
        {"year": 2023, "month": 6, "day": 15, "hour": 8, "minute": 0, "second": 0},  # 普通日期
        {"year": 2000, "month": 1, "day": 1, "hour": 0, "minute": 0, "second": 0},  # 世纪之交
    ]
    
    for i, date_params in enumerate(test_dates, 1):
        try:
            response = requests.post(f"{base_url}/convert", json=date_params)
            data = response.json()
            
            if data.get("success"):
                print(f"✅ 转换测试 {i} - 成功")
                print(f"   输入: {date_params['year']}-{date_params['month']}-{date_params['day']}")
                lunar_info = data['data']['lunar']
                print(f"   农历: {lunar_info['year_chinese']}年{lunar_info['month_chinese']}月{lunar_info['day_chinese']}日")
            else:
                print(f"❌ 转换测试 {i} - 失败")
        except Exception as e:
            print(f"❌ 转换测试 {i} - 异常: {e}")
    
    # 3. 测试日期验证
    print("\n3. 测试日期验证功能")
    test_validation = [
        {"year": 2024, "month": 2, "day": 29},  # 有效日期（闰年）
        {"year": 2023, "month": 2, "day": 29},  # 无效日期
        {"year": 2024, "month": 13, "day": 1},  # 无效月份
    ]
    
    for i, date_params in enumerate(test_validation, 1):
        try:
            response = requests.post(f"{base_url}/validate", json=date_params)
            data = response.json()
            
            print(f"✅ 验证测试 {i} - 成功")
            print(f"   日期: {date_params['year']}-{date_params['month']}-{date_params['day']}")
            print(f"   有效: {data['is_valid']}, 修正: {data['is_corrected']}")
        except Exception as e:
            print(f"❌ 验证测试 {i} - 异常: {e}")
    
    # 4. 测试节气计算
    print("\n4. 测试节气计算功能")
    try:
        # 测试立春日期
        response = requests.post(f"{base_url}/convert", json={"year": 2024, "month": 2, "day": 4})
        data = response.json()
        
        if data.get("success"):
            jieqi_info = data['data']['jieqi']
            print("✅ 节气计算 - 成功")
            print(f"   当前节气: {jieqi_info['prev_jie']}")
            print(f"   下个节气: {jieqi_info['next_jie']}")
        else:
            print("❌ 节气计算 - 失败")
    except Exception as e:
        print(f"❌ 节气计算 - 异常: {e}")
    
    # 5. 测试干支计算
    print("\n5. 测试干支计算功能")
    try:
        response = requests.get(f"{base_url}/current")
        data = response.json()
        
        if data.get("success"):
            ganzhi_info = data['data']['ganzhi']
            print("✅ 干支计算 - 成功")
            print(f"   年干支: {ganzhi_info['year']['ganzhi']}")
            print(f"   月干支: {ganzhi_info['month']['ganzhi']}")
            print(f"   日干支: {ganzhi_info['day']['ganzhi']}")
            print(f"   时干支: {ganzhi_info['time']['ganzhi']}")
        else:
            print("❌ 干支计算 - 失败")
    except Exception as e:
        print(f"❌ 干支计算 - 异常: {e}")

def test_direct_module():
    """直接测试核心模块功能"""
    print("\n" + "=" * 60)
    print("直接模块功能测试")
    print("=" * 60)
    
    try:
        # 导入正式模块
        from src.core.calendar_service import CalendarService, calendar_service
        
        # 测试当前时间转换
        print("\n1. 测试CalendarService当前时间转换")
        current_info = CalendarService.get_current_calendar_info()
        print("✅ CalendarService.get_current_calendar_info() - 成功")
        print(f"   公历: {current_info['solar']['date']}")
        print(f"   农历: {current_info['lunar']['full_string'][:30]}...")
        
        # 测试指定日期转换
        print("\n2. 测试CalendarService指定日期转换")
        specific_info = CalendarService.convert_solar_to_lunar(2024, 2, 29, 12, 0, 0)
        print("✅ CalendarService.convert_solar_to_lunar() - 成功")
        print(f"   输入: 2024-02-29 12:00:00")
        print(f"   农历: {specific_info['lunar']['full_string'][:30]}...")
        
        # 测试算法模块
        print("\n3. 测试CalendarCalculator模块")
        from src.algorithms.calendar_calculator import CalendarCalculator
        calc = CalendarCalculator()
        
        if calc.is_available():
            print("✅ CalendarCalculator.is_available() - 成功")
            
            # 测试综合信息获取
            comp_info = calc.get_comprehensive_calendar_info(2024, 2, 29)
            print("✅ CalendarCalculator.get_comprehensive_calendar_info() - 成功")
            print(f"   星座: {comp_info['constellation']}")
            print(f"   节气: {comp_info['jieqi']}")
        else:
            print("❌ CalendarCalculator不可用")
        
        # 测试四柱转换
        print("\n4. 测试四柱转换功能")
        
        # 使用已知的四柱组合进行测试
        pillars = {
            "year_pillar": "甲辰",
            "month_pillar": "丁丑",
            "day_pillar": "癸卯",
            "hour_pillar": "癸亥"
        }
        
        pillars_result = calendar_service.convert_pillars_to_calendar(**pillars)
        print("✅ calendar_service.convert_pillars_to_calendar() - 成功")
        print(f"   年柱: {pillars_result['ganzhi']['year']['ganzhi']}")
        print(f"   月柱: {pillars_result['ganzhi']['month']['ganzhi']}")
        print(f"   日柱: {pillars_result['ganzhi']['day']['ganzhi']}")
        print(f"   时柱: {pillars_result['ganzhi']['time']['ganzhi']}")
        print(f"   转换公历: {pillars_result['solar']['date']}")
            
    except Exception as e:
        print(f"❌ 直接模块测试 - 异常: {e}")

def main():
    """主测试函数"""
    print("开始历法换算有效性测试...")
    
    # 检查服务器是否运行
    try:
        response = requests.get("http://localhost:8000/api/v1/calendar/current", timeout=5)
        if response.status_code == 200:
            print("✅ 服务器运行正常")
        else:
            print("❌ 服务器响应异常")
            return
    except:
        print("❌ 服务器未运行，请先启动服务器: python main.py")
        return
    
    # 执行测试
    test_api_endpoints()
    test_direct_module()
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)

if __name__ == "__main__":
    main()
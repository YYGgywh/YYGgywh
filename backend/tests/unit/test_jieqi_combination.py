#!/usr/bin/env python3
"""
测试节气组合功能
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.core.calendar_service import CalendarService
# datetime模块已移除，使用lunar库替代

def test_jieqi_combination():
    """测试节气组合功能"""
    print("=== 测试节气组合功能 ===")
    
    # 测试当前时间
    from datetime import datetime
    from lunar_python import Solar
    current_datetime = datetime.now()
    current_date = Solar.fromDate(current_datetime)
    print(f"当前时间: {current_date}")
    
    try:
        # 调用转换方法
        result = CalendarService.convert_solar_to_lunar(
            year=current_date.getYear(),
            month=current_date.getMonth(),
            day=current_date.getDay(),
            hour=current_date.getHour(),
            minute=current_date.getMinute(),
            second=current_date.getSecond()
        )
        
        print(f"jieqi_combination字段是否存在: {'jieqi_combination' in result}")
        
        if 'jieqi_combination' in result:
            jieqi_combo = result['jieqi_combination']
            print("节气组合信息:")
            for key, value in jieqi_combo.items():
                print(f"  {key}: {value}")
            
            # 验证字段完整性
            required_fields = ['prev_jie', 'prev_qi', 'next_jie', 'next_qi']
            missing_fields = [field for field in required_fields if field not in jieqi_combo]
            
            if missing_fields:
                print(f"警告: 缺少字段: {missing_fields}")
            else:
                print("✓ 所有必需字段都存在")
                
            # 验证数据格式
            for field in required_fields:
                if field in jieqi_combo and jieqi_combo[field]:
                    print(f"✓ {field}: {jieqi_combo[field]}")
                else:
                    print(f"⚠ {field}: 无数据")
                    
        else:
            print("❌ 错误: jieqi_combination字段不存在")
            
    except Exception as e:
        print(f"❌ 测试过程中出现错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_jieqi_combination()
"""
pytest配置文件
设置全局测试配置和fixtures
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
src_path = project_root / "src"
sys.path.insert(0, str(src_path))

# 设置pytest配置
def pytest_configure(config):
    """pytest配置钩子"""
    # 添加自定义标记
    config.addinivalue_line(
        "markers", "slow: 标记为慢速测试（需要较长时间运行）"
    )
    config.addinivalue_line(
        "markers", "integration: 标记为集成测试"
    )
    config.addinivalue_line(
        "markers", "unit: 标记为单元测试"
    )
    config.addinivalue_line(
        "markers", "validation: 标记为验证测试"
    )
    config.addinivalue_line(
        "markers", "e2e: 标记为端到端测试"
    )

def pytest_collection_modifyitems(items):
    """修改测试收集结果"""
    # 可以根据需要调整测试执行顺序
    pass

# 定义全局fixtures
import pytest
# datetime模块已移除，使用lunar库替代

@pytest.fixture
def sample_solar_date():
    """提供示例公历日期"""
    return {
        "year": 2024,
        "month": 12,
        "day": 25,
        "hour": 14,
        "minute": 30,
        "second": 0
    }

@pytest.fixture
def sample_ganzhi_pillars():
    """提供示例四柱组合"""
    return {
        "year_pillar": "甲辰",
        "month_pillar": "丁丑", 
        "day_pillar": "癸卯",
        "hour_pillar": "癸亥"
    }

@pytest.fixture
def calendar_calculator():
    """提供CalendarCalculator实例"""
    from algorithms.calendar_calculator import CalendarCalculator
    return CalendarCalculator()

@pytest.fixture
def calendar_service():
    """提供CalendarService实例"""
    from core.calendar_service import CalendarService
    return CalendarService

@pytest.fixture
def current_time():
    """提供当前时间"""
    from datetime import datetime
    from lunar_python import Solar
    now = datetime.now()
    solar = Solar.fromDate(now)
    return solar.toYmdHms()

# 测试环境设置
@pytest.fixture(scope="session")
def test_environment():
    """设置测试环境"""
    # 确保测试环境干净
    print("设置测试环境...")
    
    # 可以在这里设置数据库连接、临时文件等
    
    yield
    
    # 清理测试环境
    print("清理测试环境...")

# 错误处理fixtures
@pytest.fixture
def error_handler():
    """提供错误处理功能"""
    def handle_error(error, expected_error_type=None):
        """处理错误并验证错误类型"""
        if expected_error_type:
            assert isinstance(error, expected_error_type), f"期望错误类型: {expected_error_type}, 实际: {type(error)}"
        return str(error)
    
    return handle_error
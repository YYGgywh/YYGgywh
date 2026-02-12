# 六爻后端重写开发计划

## 一、项目概述

### 1.1 项目背景
当前六爻后端代码存在以下问题：
- 代码结构混乱，职责不清
- 多个API接口重复，功能重叠
- 算法逻辑分散，难以维护
- 前后端交互不统一

### 1.2 项目目标
- 重构六爻后端代码，提高代码质量和可维护性
- 统一API接口，简化前端调用
- 优化核心算法，提高计算效率和准确性
- 完善文档和测试，确保系统稳定性

### 1.3 技术栈
- 后端框架：FastAPI
- 数据验证：Pydantic V2
- 算法实现：纯Python
- 测试框架：pytest
- 文档工具：FastAPI自动文档

## 二、功能需求

### 2.1 核心功能
1. **起卦功能**
   - 基于六个三位数起卦
   - 基于公历完整时间计算历法数据
   - 支持随机起卦
   - 支持指定起卦

2. **排盘功能**
   - 计算本卦和变卦
   - 判断动爻位置
   - 分配六亲（父母、兄弟、子孙、妻财、官鬼）
   - 分配六神（青龙、朱雀、勾陈、螣蛇、白虎、玄武）
   - 确定世应位置
   - 纳干纳支
   - 计算公历、农历、节气等历法数据

3. **卦象查询**
   - 获取六十四卦列表
   - 获取指定卦象详情
   - 提供卦象基本解释

### 2.2 API接口需求
| 接口名称 | 方法 | 路径 | 功能描述 |
|---------|------|------|---------|
| 起卦接口 | POST | /api/v1/liuyao/divine | 基于数字起卦，返回完整排盘数据 |
| 随机起卦 | POST | /api/v1/liuyao/generate | 随机生成卦象并排盘 |
| 卦象列表 | GET | /api/v1/liuyao/hexagrams | 获取六十四卦列表 |
| 卦象详情 | GET | /api/v1/liuyao/hexagram/{code} | 获取指定卦象详细信息 |

### 2.3 数据需求
1. **请求数据**
   - numbers: 六个三位数组成的数组
   - gregorian_date: 公历完整时间（年、月、日、时、分、秒）
   - method: 起卦方法（可选）
   - question: 占卜问题（可选）

2. **响应数据**
   - **本卦信息**：卦名、卦码、卦宫、六亲、六神、世应、纳干纳支
   - **变卦信息**：卦名、卦码、卦宫
   - **动爻信息**：动爻位置、动爻符号
   - **历法数据**：
     - 公历：年、月、日、时、分、秒、星期
     - 农历：年、月、日、闰月、节气
     - 干支：年干支、月干支、日干支、时干支
     - 节气：当前节气、下一个节气、节气时间
   - **卦象摘要**：本卦名、变卦名、动爻数量

## 三、架构设计

### 3.1 模块划分
| 模块名称 | 文件路径 | 职责描述 |
|---------|----------|---------|
| 数据模型层 | backend/src/models/liuyao.py | 定义所有数据结构和验证规则 |
| 核心算法层 | backend/src/algorithms/liuyao_calculator.py | 实现排盘的核心计算逻辑 |
| 业务服务层 | backend/src/services/liuyao_service.py | 协调整个排盘流程，处理业务逻辑 |
| API接口层 | backend/src/api/liuyao.py | 处理HTTP请求，路由管理 |
| 工具函数层 | backend/src/utils/liuyao_utils.py | 提供辅助函数和常量定义 |

### 3.2 数据流设计
```
前端请求
    ↓
API接口层（验证请求，调用服务）
    ↓
业务服务层（协调流程，组装数据）
    ↓
核心算法层（执行计算，返回结果）
    ↓
业务服务层（格式化结果）
    ↓
API接口层（返回响应）
    ↓
前端接收
```

### 3.3 响应格式设计
所有接口使用统一的响应格式：

```python
# 成功响应
{
    "success": true,
    "data": {
        # 具体数据内容
    },
    "message": "操作成功"
}

# 错误响应
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述"
    }
}
```

## 四、文件结构设计

### 4.1 新增文件
```
backend/src/
├── models/
│   └── liuyao.py                    # 数据模型定义
├── algorithms/
│   └── liuyao_calculator.py         # 核心算法实现
├── services/
│   └── liuyao_service.py            # 业务服务层
├── api/
│   └── liuyao.py                   # API接口（重写）
└── utils/
    └── liuyao_utils.py              # 工具函数
```

### 4.2 保留文件
```
backend/src/
├── core/
│   └── liuyao/                     # 保留核心逻辑，作为参考
└── algorithms/
    └── liuyao_calculator.py         # 保留现有算法，作为参考
```

## 五、开发顺序

### 5.1 第一阶段：数据模型（第1天）
**目标**：定义所有数据结构，为后续开发奠定基础

**任务清单**：
- [ ] 定义请求模型（LiuyaoRequest）
- [ ] 定义响应模型（LiuyaoResponse）
- [ ] 定义数据模型（Hexagram, YaoLine, LiuQin, LiuShen等）
- [ ] 添加字段验证规则
- [ ] 编写模型测试用例

**验收标准**：
- 所有数据结构定义完整
- Pydantic验证规则合理
- 类型提示正确
- 测试用例通过

### 5.2 第二阶段：核心算法（第2-3天）
**目标**：实现排盘的核心计算逻辑

**任务清单**：
- [ ] 实现起卦算法（calculate_hexagram）
- [ ] 实现本卦变卦计算（calculate_ben_bian_gua）
- [ ] 实现动爻判断（calculate_dong_yao）
- [ ] 实现六亲分配（calculate_liu_qin）
- [ ] 实现六神分配（calculate_liu_shen）
- [ ] 实现世应计算（calculate_shi_ying）
- [ ] 实现纳干纳支（calculate_na_gan_zhi）
- [ ] 编写算法单元测试

**验收标准**：
- 算法逻辑正确
- 计算结果准确
- 边界情况处理完善
- 单元测试覆盖率>80%

### 5.3 第三阶段：业务服务（第4天）
**目标**：协调整个排盘流程，处理业务逻辑

**任务清单**：
- [ ] 实现数据验证函数（validate_numbers）
- [ ] 实现排盘服务函数（perform_paipan）
- [ ] 实现数据组装函数（assemble_response）
- [ ] 实现错误处理逻辑
- [ ] 添加日志记录
- [ ] 编写服务层测试

**验收标准**：
- 数据验证逻辑完整
- 错误处理合理
- 日志记录完善
- 集成测试通过

### 5.4 第四阶段：API接口（第5天）
**目标**：实现HTTP接口，处理前端请求

**任务清单**：
- [ ] 实现起卦接口（/divine）
- [ ] 实现随机起卦接口（/generate）
- [ ] 实现卦象列表接口（/hexagrams）
- [ ] 实现卦象详情接口（/hexagram/{code}）
- [ ] 添加接口文档
- [ ] 编写API测试用例

**验收标准**：
- 接口路径正确
- 请求验证完整
- 响应格式统一
- API文档完善

### 5.5 第五阶段：测试与优化（第6天）
**目标**：确保系统稳定性和性能

**任务清单**：
- [ ] 执行单元测试
- [ ] 执行集成测试
- [ ] 执行端到端测试
- [ ] 执行性能测试
- [ ] 优化算法性能
- [ ] 修复发现的问题

**验收标准**：
- 所有测试通过
- 性能指标达标
- 无严重bug

### 5.6 第六阶段：文档与部署（第7天）
**目标**：完善文档，准备上线

**任务清单**：
- [ ] 完善代码注释
- [ ] 编写API文档
- [ ] 编写部署文档
- [ ] 准备生产环境配置
- [ ] 执行上线流程

**验收标准**：
- 文档完整清晰
- 配置正确
- 上线流程顺利

## 六、详细开发步骤

### 6.1 数据模型开发

#### 步骤1：定义基础模型
```python
# backend/src/models/liuyao.py
from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Optional

class GregorianDate(BaseModel):
    """公历日期模型"""
    year: int = Field(..., ge=1900, le=2100, description="年份")
    month: int = Field(..., ge=1, le=12, description="月份")
    day: int = Field(..., ge=1, le=31, description="日期")
    hour: int = Field(..., ge=0, le=23, description="小时")
    minute: int = Field(..., ge=0, le=59, description="分钟")
    second: int = Field(..., ge=0, le=59, description="秒")

class LunarDate(BaseModel):
    """农历日期模型"""
    year: int = Field(..., description="农历年份")
    month: int = Field(..., ge=1, le=12, description="农历月份")
    day: int = Field(..., ge=1, le=30, description="农历日期")
    is_leap_month: bool = Field(default=False, description="是否为闰月")
    solar_term: Optional[str] = Field(default=None, description="节气")

class GanZhi(BaseModel):
    """干支模型"""
    year_gan_zhi: str = Field(..., description="年干支")
    month_gan_zhi: str = Field(..., description="月干支")
    day_gan_zhi: str = Field(..., description="日干支")
    hour_gan_zhi: str = Field(..., description="时干支")

class SolarTerm(BaseModel):
    """节气模型"""
    current_term: Optional[str] = Field(default=None, description="当前节气")
    next_term: Optional[str] = Field(default=None, description="下一个节气")
    current_term_time: Optional[str] = Field(default=None, description="当前节气时间")
    next_term_time: Optional[str] = Field(default=None, description="下一个节气时间")

class CalendarData(BaseModel):
    """历法数据模型"""
    gregorian: GregorianDate = Field(..., description="公历日期")
    lunar: LunarDate = Field(..., description="农历日期")
    gan_zhi: GanZhi = Field(..., description="干支")
    solar_term: SolarTerm = Field(..., description="节气")
    weekday: int = Field(..., ge=0, le=6, description="星期（0-6，0为周日）")

class LiuyaoRequest(BaseModel):
    """六爻起卦请求模型"""
    numbers: List[int] = Field(..., min_items=6, max_items=6, description="六个三位数")
    gregorian_date: GregorianDate = Field(..., description="公历完整时间")
    
    @field_validator('numbers')
    @classmethod
    def validate_numbers(cls, v):
        for num in v:
            if not (100 <= num <= 999):
                raise ValueError('每个数字必须是三位数')
        return v

class YaoLine(BaseModel):
    """爻位模型"""
    position: int = Field(..., ge=1, le=6, description="爻位位置")
    value: str = Field(..., description="爻值")
    yin_yang: str = Field(..., description="阴阳属性")
    liu_qin: str = Field(..., description="六亲")
    liu_shen: str = Field(..., description="六神")
    is_dong_yao: bool = Field(default=False, description="是否为动爻")

class Hexagram(BaseModel):
    """卦象模型"""
    name: str = Field(..., description="卦名")
    code: str = Field(..., description="卦码")
    palace: str = Field(..., description="卦宫")
    palace_type: str = Field(..., description="宫属")
    upper_trigram: str = Field(..., description="上卦")
    lower_trigram: str = Field(..., description="下卦")
    sequence: int = Field(..., description="易序")
    palace_order: int = Field(..., description="宫序")
    stems: List[str] = Field(..., description="纳干")
    branches: List[str] = Field(..., description="纳支")
    liu_qin: List[str] = Field(..., description="六亲")
    shi_ying: List[str] = Field(..., description="世应")
    shi_shen: str = Field(default="", description="世身")
    yue_shen: str = Field(default="", description="月身")
    chong_he: str = Field(default="", description="冲合")

class LiuyaoResponse(BaseModel):
    """六爻起卦响应模型"""
    success: bool = Field(default=True, description="是否成功")
    message: str = Field(..., description="响应消息")
    data: Dict = Field(..., description="排盘数据")
```

#### 步骤2：编写测试用例
```python
# tests/models/test_liuyao.py
import pytest
from src.models.liuyao import LiuyaoRequest

def test_valid_request():
    request = LiuyaoRequest(numbers=[123, 456, 789, 234, 567, 890])
    assert request.numbers == [123, 456, 789, 234, 567, 890]

def test_invalid_numbers():
    with pytest.raises(ValueError):
        LiuyaoRequest(numbers=[12, 456, 789, 234, 567, 890])
```

### 6.2 核心算法开发

#### 步骤1：实现起卦算法
```python
# backend/src/algorithms/liuyao_calculator.py
from typing import List, Dict, Tuple
from datetime import datetime

def count_odd_digits_in_triplets(numbers: List[int]) -> List[int]:
    """计算每个三位数中的奇数个数"""
    odd_counts = []
    for num in numbers:
        odd_count = sum(1 for digit in str(num) if int(digit) % 2 == 1)
        odd_counts.append(odd_count)
    return odd_counts

def determine_yao_value(odd_count: int) -> str:
    """根据奇数个数确定爻值"""
    if odd_count == 0:
        return "老阴"  # 0个奇数 -> 老阴
    elif odd_count == 1:
        return "少阳"  # 1个奇数 -> 少阳
    elif odd_count == 2:
        return "少阴"  # 2个奇数 -> 少阴
    else:
        return "老阳"  # 3个奇数 -> 老阳

def calculate_hexagram(numbers: List[int]) -> Dict:
    """计算本卦和变卦"""
    odd_counts = count_odd_digits_in_triplets(numbers)
    yao_values = [determine_yao_value(count) for count in odd_counts]
    
    # 计算本卦码（1表示阳，0表示阴）
    ben_gua_code = ""
    for value in yao_values:
        if value in ["少阳", "老阳"]:
            ben_gua_code = "1" + ben_gua_code
        else:
            ben_gua_code = "0" + ben_gua_code
    
    # 计算变卦码（动爻取反）
    bian_gua_code = list(ben_gua_code)
    for i, value in enumerate(yao_values):
        if value in ["老阳", "老阴"]:
            bian_gua_code[i] = "1" if bian_gua_code[i] == "0" else "0"
    bian_gua_code = "".join(bian_gua_code)
    
    return {
        "yao_values": yao_values,
        "ben_gua_code": ben_gua_code,
        "bian_gua_code": bian_gua_code,
        "dong_yao_positions": [i+1 for i, v in enumerate(yao_values) if v in ["老阳", "老阴"]]
    }

def calculate_calendar_data(gregorian_date: Dict) -> Dict:
    """计算历法数据（公历、农历、干支、节气）"""
    # 使用lunar库进行历法转换
    from lunar import Lunar, Solar
    
    # 创建公历日期对象
    solar = Solar.fromYmdHms(
        gregorian_date['year'],
        gregorian_date['month'],
        gregorian_date['day'],
        gregorian_date['hour'],
        gregorian_date['minute'],
        gregorian_date['second']
    )
    
    # 转换为农历
    lunar = solar.getLunar()
    
    # 获取干支
    year_gan_zhi = lunar.getYearGanZhi()
    month_gan_zhi = lunar.getMonthGanZhi()
    day_gan_zhi = lunar.getDayGanZhi()
    hour_gan_zhi = lunar.getTimeGanZhi()
    
    # 获取节气
    current_term = lunar.getCurrentJieQi()
    next_term = lunar.getNextJieQi()
    current_term_time = None
    next_term_time = None
    
    # 获取节气时间
    if current_term:
        current_term_time = solar.getJieQiTime(current_term)
    if next_term:
        next_term_time = solar.getJieQiTime(next_term)
    
    # 获取星期
    weekday = solar.getWeek()
    
    return {
        "gregorian": {
            "year": gregorian_date['year'],
            "month": gregorian_date['month'],
            "day": gregorian_date['day'],
            "hour": gregorian_date['hour'],
            "minute": gregorian_date['minute'],
            "second": gregorian_date['second']
        },
        "lunar": {
            "year": lunar.getYear(),
            "month": lunar.getMonth(),
            "day": lunar.getDay(),
            "is_leap_month": lunar.getMonth() == lunar.getLeapMonth(),
            "solar_term": current_term
        },
        "gan_zhi": {
            "year_gan_zhi": year_gan_zhi,
            "month_gan_zhi": month_gan_zhi,
            "day_gan_zhi": day_gan_zhi,
            "hour_gan_zhi": hour_gan_zhi
        },
        "solar_term": {
            "current_term": current_term,
            "next_term": next_term,
            "current_term_time": str(current_term_time) if current_term_time else None,
            "next_term_time": str(next_term_time) if next_term_time else None
        },
        "weekday": weekday
    }
```

#### 步骤2：实现排盘算法
```python
def calculate_liu_qin(gua_code: str, day_gan: str) -> List[str]:
    """计算六亲"""
    liu_qin_map = {
        "乾": ["兄弟", "父母", "官鬼", "父母", "兄弟", "官鬼"],
        "坤": ["子孙", "妻财", "兄弟", "妻财", "子孙", "兄弟"],
        # 其他卦象的六亲映射...
    }
    gua_name = get_gua_name_by_code(gua_code)
    return liu_qin_map.get(gua_name, [""] * 6)

def calculate_liu_shen(day_gan: str) -> List[str]:
    """计算六神"""
    liu_shen_order = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"]
    gan_index = {"甲": 0, "乙": 1, "丙": 2, "丁": 3, "戊": 4, 
                "己": 5, "庚": 0, "辛": 1, "壬": 2, "癸": 3}
    start_index = gan_index.get(day_gan, 0)
    return [liu_shen_order[(start_index + i) % 6] for i in range(6)]

def calculate_na_gan_zhi(gua_code: str, month_gan: str) -> Tuple[List[str], List[str]]:
    """计算纳干纳支"""
    na_gan_map = {
        "乾": ["戊", "庚", "壬", "甲", "丙", "戊"],
        "坤": ["乙", "癸", "乙", "癸", "乙", "癸"],
        # 其他卦象的纳干映射...
    }
    na_zhi_map = {
        "乾": ["子", "寅", "辰", "午", "申", "戌"],
        "坤": ["未", "巳", "卯", "丑", "亥", "未"],
        # 其他卦象的纳支映射...
    }
    gua_name = get_gua_name_by_code(gua_code)
    return na_gan_map.get(gua_name, [""] * 6), na_zhi_map.get(gua_name, [""] * 6)

def calculate_shi_ying(gua_code: str) -> List[str]:
    """计算世应"""
    gua_order = ["初", "二", "三", "四", "五", "上"]
    shi_ying_map = {
        "乾": ["", "", "", "应", "", "世"],
        "坤": ["", "", "世", "", "", "应"],
        # 其他卦象的世应映射...
    }
    gua_name = get_gua_name_by_code(gua_code)
    shi_ying = shi_ying_map.get(gua_name, [""] * 6)
    return [shi_ying[i] if shi_ying[i] else gua_order[i] for i in range(6)]
```

#### 步骤3：编写算法测试
```python
# tests/algorithms/test_liuyao_calculator.py
import pytest
from src.algorithms.liuyao_calculator import count_odd_digits_in_triplets, calculate_calendar_data

def test_count_odd_digits():
    numbers = [123, 456, 789]
    result = count_odd_digits_in_triplets(numbers)
    assert result == [2, 1, 3]  # 123有2个奇数，456有1个奇数，789有3个奇数

def test_determine_yao_value():
    from src.algorithms.liuyao_calculator import determine_yao_value
    assert determine_yao_value(0) == "老阴"
    assert determine_yao_value(1) == "少阳"
    assert determine_yao_value(2) == "少阴"
    assert determine_yao_value(3) == "老阳"

def test_calculate_calendar_data():
    gregorian_date = {
        'year': 2024,
        'month': 1,
        'day': 1,
        'hour': 12,
        'minute': 0,
        'second': 0
    }
    result = calculate_calendar_data(gregorian_date)
    
    # 验证返回数据结构
    assert "gregorian" in result
    assert "lunar" in result
    assert "gan_zhi" in result
    assert "solar_term" in result
    assert "weekday" in result
    
    # 验证公历数据
    assert result["gregorian"]["year"] == 2024
    assert result["gregorian"]["month"] == 1
    assert result["gregorian"]["day"] == 1
    
    # 验证干支数据
    assert result["gan_zhi"]["year_gan_zhi"] is not None
    assert result["gan_zhi"]["month_gan_zhi"] is not None
    assert result["gan_zhi"]["day_gan_zhi"] is not None
    assert result["gan_zhi"]["hour_gan_zhi"] is not None
    
    # 验证农历数据
    assert result["lunar"]["year"] is not None
    assert result["lunar"]["month"] is not None
    assert result["lunar"]["day"] is not None
    
    # 验证星期
    assert 0 <= result["weekday"] <= 6
```

### 6.3 业务服务开发

#### 步骤1：实现服务函数
```python
# backend/src/services/liuyao_service.py
from typing import Dict, List
from ..models.liuyao import LiuyaoRequest, LiuyaoResponse
from ..algorithms.liuyao_calculator import calculate_hexagram, calculate_liu_qin, calculate_liu_shen, calculate_calendar_data
from ..utils.liuyao_utils import get_gua_info_by_code, get_gua_name_by_code
import logging

logger = logging.getLogger(__name__)

class LiuyaoService:
    @staticmethod
    def validate_numbers(numbers: List[int]) -> Tuple[bool, str]:
        """验证起卦数字"""
        if len(numbers) != 6:
            return False, "必须提供6个三位数"
        for num in numbers:
            if not (100 <= num <= 999):
                return False, f"数字{num}不是三位数"
        return True, ""
    
    @staticmethod
    def perform_paipan(request: LiuyaoRequest) -> Dict:
        """执行排盘计算"""
        try:
            # 验证输入
            is_valid, error_msg = LiuyaoService.validate_numbers(request.numbers)
            if not is_valid:
                logger.error(f"数字验证失败: {error_msg}")
                return {"success": False, "error": {"code": "INVALID_INPUT", "message": error_msg}}
            
            # 计算卦象
            hexagram_result = calculate_hexagram(request.numbers)
            
            # 计算历法数据
            gregorian_date = {
                'year': request.gregorian_date.year,
                'month': request.gregorian_date.month,
                'day': request.gregorian_date.day,
                'hour': request.gregorian_date.hour,
                'minute': request.gregorian_date.minute,
                'second': request.gregorian_date.second
            }
            calendar_result = calculate_calendar_data(gregorian_date)
            
            # 获取卦象信息
            ben_gua_info = get_gua_info_by_code(hexagram_result["ben_gua_code"])
            bian_gua_info = get_gua_info_by_code(hexagram_result["bian_gua_code"]) if hexagram_result["bian_gua_code"] != hexagram_result["ben_gua_code"] else None
            
            # 计算六亲、六神等（使用历法数据中的干支）
            day_gan = calendar_result["gan_zhi"]["day_gan_zhi"][0]  # 日干
            liu_qin = calculate_liu_qin(hexagram_result["ben_gua_code"], day_gan)
            liu_shen = calculate_liu_shen(day_gan)
            shi_ying = calculate_shi_ying(hexagram_result["ben_gua_code"])
            
            # 组装响应数据
            response_data = {
                "ben_gua": {
                    "name": ben_gua_info["name"],
                    "code": hexagram_result["ben_gua_code"],
                    "palace": ben_gua_info["palace"],
                    "palace_type": ben_gua_info["palace_type"],
                    "upper_trigram": ben_gua_info["upper_trigram"],
                    "lower_trigram": ben_gua_info["lower_trigram"],
                    "sequence": ben_gua_info["sequence"],
                    "palace_order": ben_gua_info["palace_order"],
                    "stems": ben_gua_info["stems"],
                    "branches": ben_gua_info["branches"],
                    "liu_qin": liu_qin,
                    "shi_ying": shi_ying
                },
                "bian_gua": {
                    "name": bian_gua_info["name"] if bian_gua_info else "无变卦",
                    "code": hexagram_result["bian_gua_code"] if bian_gua_info else "",
                } if bian_gua_info else None,
                "dong_yao": {
                    "positions": hexagram_result["dong_yao_positions"],
                    "symbols": ["老阳" if hexagram_result["ben_gua_code"][i] == "1" else "老阴" 
                               for i in hexagram_result["dong_yao_positions"]]
                },
                "liu_shen": liu_shen,
                "calendar": calendar_result,  # 历法数据
                "summary": {
                    "ben_gua_name": ben_gua_info["name"],
                    "bian_gua_name": bian_gua_info["name"] if bian_gua_info else "无变卦",
                    "dong_yao_count": len(hexagram_result["dong_yao_positions"]),
                    "year_gan_zhi": calendar_result["gan_zhi"]["year_gan_zhi"],
                    "month_gan_zhi": calendar_result["gan_zhi"]["month_gan_zhi"],
                    "day_gan_zhi": calendar_result["gan_zhi"]["day_gan_zhi"],
                    "hour_gan_zhi": calendar_result["gan_zhi"]["hour_gan_zhi"]
                }
            }
            
            logger.info(f"排盘成功: {ben_gua_info['name']}, 干支: {calendar_result['gan_zhi']['year_gan_zhi']}")
            return {"success": True, "data": response_data, "message": "排盘成功"}
            
        except Exception as e:
            logger.error(f"排盘错误: {str(e)}")
            return {"success": False, "error": {"code": "PAIPAN_ERROR", "message": str(e)}}
```

#### 步骤2：编写服务测试
```python
# tests/services/test_liuyao_service.py
import pytest
from src.services.liuyao_service import LiuyaoService

def test_validate_numbers():
    is_valid, error = LiuyaoService.validate_numbers([123, 456, 789, 234, 567, 890])
    assert is_valid == True
    assert error == ""

def test_validate_invalid_numbers():
    is_valid, error = LiuyaoService.validate_numbers([12, 456, 789, 234, 567, 890])
    assert is_valid == False
    assert "不是三位数" in error
```

### 6.4 API接口开发

#### 步骤1：实现API路由
```python
# backend/src/api/liuyao.py
from fastapi import APIRouter, HTTPException, status
from ..models.liuyao import LiuyaoRequest
from ..services.liuyao_service import LiuyaoService
from ..utils.response_formatter import ResponseFormatter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/divine", response_model=dict)
async def divine_liuyao(request: LiuyaoRequest):
    """六爻起卦接口
    
    Args:
        request: 起卦请求，包含六个三位数和公历完整时间
        
    Returns:
        完整的排盘数据，包括卦象信息和历法数据
    """
    try:
        logger.info(f"收到起卦请求: 数字={request.numbers}, 时间={request.gregorian_date}")
        result = LiuyaoService.perform_paipan(request)
        
        if result["success"]:
            return ResponseFormatter.create_success_response(
                result["data"],
                "六爻起卦成功"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"起卦接口错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": f"服务器错误: {str(e)}"}
        )

@router.get("/hexagrams", response_model=dict)
async def get_hexagram_list():
    """获取六十四卦列表
    
    Returns:
        六十四卦的详细信息列表
    """
    try:
        from ..utils.liuyao_utils import SIXTY_FOUR_GUA
        hexagram_list = []
        for gua_name, gua_info in SIXTY_FOUR_GUA.items():
            hexagram_list.append({
                "name": gua_name,
                "code": gua_info["code"],
                "nature": gua_info["nature"],
                "gua_ci": gua_info["gua_ci"],
                "palace": gua_info["palace"]
            })
        
        return ResponseFormatter.create_success_response(
            {"hexagrams": hexagram_list, "total": len(hexagram_list)},
            "获取六十四卦列表成功"
        )
    except Exception as e:
        logger.error(f"获取卦象列表错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "LIST_ERROR", "message": str(e)}
        )

@router.get("/hexagram/{code}", response_model=dict)
async def get_hexagram_detail(code: str):
    """获取指定卦象的详细信息
    
    Args:
        code: 卦码（6位二进制字符串）
        
    Returns:
        卦象的详细信息
    """
    try:
        from ..utils.liuyao_utils import get_gua_info_by_code
        gua_info = get_gua_info_by_code(code)
        
        if not gua_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "未找到该卦象"}
            )
        
        return ResponseFormatter.create_success_response(gua_info, "获取卦象详情成功")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取卦象详情错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "DETAIL_ERROR", "message": str(e)}
        )
```

#### 步骤2：编写API测试
```python
# tests/api/test_liuyao_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_divine_success():
    response = client.post(
        "/api/v1/liuyao/divine",
        json={
            "numbers": [123, 456, 789, 234, 567, 890],
            "gregorian_date": {
                "year": 2024,
                "month": 1,
                "day": 1,
                "hour": 12,
                "minute": 0,
                "second": 0
            }
        }
    )
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert "ben_gua" in response.json()["data"]
    assert "calendar" in response.json()["data"]  # 验证历法数据存在
    
    # 验证历法数据结构
    calendar = response.json()["data"]["calendar"]
    assert "gregorian" in calendar
    assert "lunar" in calendar
    assert "gan_zhi" in calendar
    assert "solar_term" in calendar
    assert "weekday" in calendar

def test_divine_invalid_numbers():
    response = client.post(
        "/api/v1/liuyao/divine",
        json={
            "numbers": [12, 456, 789, 234, 567, 890],
            "gregorian_date": {
                "year": 2024,
                "month": 1,
                "day": 1,
                "hour": 12,
                "minute": 0,
                "second": 0
            }
        }
    )
    assert response.status_code == 400

def test_divine_calendar_data():
    """测试历法数据计算的正确性"""
    response = client.post(
        "/api/v1/liuyao/divine",
        json={
            "numbers": [111, 222, 333, 444, 555, 666],
            "gregorian_date": {
                "year": 2024,
                "month": 2,
                "day": 10,
                "hour": 14,
                "minute": 30,
                "second": 45
            }
        }
    )
    assert response.status_code == 200
    
    calendar = response.json()["data"]["calendar"]
    
    # 验证公历数据
    assert calendar["gregorian"]["year"] == 2024
    assert calendar["gregorian"]["month"] == 2
    assert calendar["gregorian"]["day"] == 10
    assert calendar["gregorian"]["hour"] == 14
    assert calendar["gregorian"]["minute"] == 30
    assert calendar["gregorian"]["second"] == 45
    
    # 验证干支数据存在
    assert calendar["gan_zhi"]["year_gan_zhi"] is not None
    assert calendar["gan_zhi"]["month_gan_zhi"] is not None
    assert calendar["gan_zhi"]["day_gan_zhi"] is not None
    assert calendar["gan_zhi"]["hour_gan_zhi"] is not None
    
    # 验证农历数据存在
    assert calendar["lunar"]["year"] is not None
    assert calendar["lunar"]["month"] is not None
    assert calendar["lunar"]["day"] is not None
    
    # 验证星期
    assert 0 <= calendar["weekday"] <= 6
```

## 七、测试计划

### 7.1 单元测试
- **数据模型测试**：验证数据结构和验证规则
- **算法测试**：验证核心算法的正确性
- **服务测试**：验证业务逻辑的正确性
- **覆盖率目标**：>80%

### 7.2 集成测试
- **模块集成测试**：验证各模块间的协作
- **API集成测试**：验证API与服务的集成
- **端到端测试**：验证完整的业务流程

### 7.3 性能测试
- **响应时间**：API响应时间<500ms
- **并发测试**：支持100并发请求
- **压力测试**：系统稳定运行24小时

### 7.4 测试工具
- pytest：单元测试框架
- TestClient：API测试
- locust：性能测试

## 八、部署计划

### 8.1 部署环境
- **开发环境**：本地开发，热更新
- **测试环境**：模拟生产，功能验证
- **生产环境**：正式上线，性能监控

### 8.2 部署步骤
1. **代码审查**：确保代码质量
2. **测试验证**：所有测试通过
3. **配置准备**：准备环境配置
4. **数据库迁移**：如有数据库变更
5. **服务部署**：部署新版本
6. **健康检查**：验证服务正常
7. **监控配置**：设置告警规则

### 8.3 回滚计划
- **保留旧版本**：至少保留3个历史版本
- **快速回滚**：30分钟内完成回滚
- **回滚验证**：回滚后验证功能正常

## 九、时间估算

| 阶段 | 任务 | 预估时间 | 实际时间 | 负责人 |
|------|------|----------|----------|---------|
| 数据模型 | 定义数据结构、编写测试 | 0.5-1天 | - |
| 核心算法 | 实现算法、编写测试 | 2-3天 | - |
| 业务服务 | 实现服务、编写测试 | 1-2天 | - |
| API接口 | 实现接口、编写测试 | 0.5-1天 | - |
| 测试优化 | 执行测试、优化代码 | 1-2天 | - |
| 文档部署 | 完善文档、准备上线 | 0.5-1天 | - |
| **总计** | - | **6-10天** | - |

## 十、风险管理

### 10.1 技术风险
| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| 算法错误 | 中 | 高 | 充分测试，参考现有算法 |
| 性能问题 | 中 | 中 | 优化算法，使用缓存 |
| 接口不兼容 | 低 | 高 | 与前端充分沟通，保持兼容 |

### 10.2 进度风险
| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| 需求变更 | 中 | 高 | 预留缓冲时间，灵活调整 |
| 测试延期 | 中 | 中 | 提前准备测试用例 |
| 上线问题 | 低 | 高 | 充分测试，准备回滚方案 |

### 10.3 质量风险
| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| 代码质量差 | 低 | 中 | 代码审查，单元测试 |
| 文档不完善 | 中 | 低 | 同步编写文档，定期检查 |

## 十一、验收标准

### 11.1 功能验收
- [ ] 所有API接口正常工作
- [ ] 算法计算结果准确
- [ ] 前端能够正确调用接口
- [ ] 错误处理完善

### 11.2 性能验收
- [ ] API响应时间<500ms
- [ ] 支持100并发请求
- [ ] 系统稳定运行24小时

### 11.3 质量验收
- [ ] 代码注释完整
- [ ] 测试覆盖率>80%
- [ ] 文档清晰完整
- [ ] 无严重bug

## 十二、后续维护

### 12.1 日常维护
- 定期检查系统日志
- 监控系统性能指标
- 及时处理用户反馈
- 定期更新依赖库

### 12.2 功能迭代
- 根据用户需求添加新功能
- 优化现有算法逻辑
- 扩展卦象解释内容
- 改进用户体验

### 12.3 技术升级
- 定期升级框架版本
- 引入新的技术方案
- 优化系统架构
- 提高开发效率

---

**文档版本**：v1.0  
**创建日期**：2026-02-10  
**最后更新**：2026-02-10  
**维护人**：开发团队

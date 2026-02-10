# 文件迁移报告

## 项目概述
这是一个用于处理中国传统日历转换和四柱命理的后端项目。项目采用模块化架构，主要包含算法模块、API模块、核心服务模块和工具模块。

## 文件迁移报告

### 1. 算法模块 (src/algorithms/)

| 原路径 | 功能分析 | 目标路径 |
|--------|----------|----------|
| `src/algorithms/calendar_calculator.py` | 实现日历计算核心算法，包括公历转农历、农历转公历、四柱计算等功能 | `src/algorithms/calendar_calculator.py` |
| `src/algorithms/pillars_validator.py` | 实现四柱命理的验证功能，包括六十甲子、五虎遁、五鼠遁等规则验证 | `src/algorithms/pillars_validator.py` |
| `src/algorithms/pillars_accuracy.py` | 实现四柱命理的精度验证功能 | `src/algorithms/pillars_accuracy.py` |
| `src/algorithms/year_validation.py` | 实现年份验证功能，包括公历和农历年份的范围验证 | `src/algorithms/year_validation.py` |

### 2. API模块 (src/api/)

| 原路径 | 功能分析 | 目标路径 |
|--------|----------|----------|
| `src/api/calendar_api.py` | 实现日历转换的API接口，包括公历转农历、农历转公历等接口 | `src/api/calendar_api.py` |
| `src/api/pillars_api.py` | 实现四柱命理的API接口，包括四柱转换、验证等接口 | `src/api/pillars_api.py` |
| `src/api/validation_api.py` | 实现验证功能的API接口，包括年份验证、日期验证等接口 | `src/api/validation_api.py` |
| `src/api/__init__.py` | API模块的初始化文件 | `src/api/__init__.py` |

### 3. 核心服务模块 (src/core/)

| 原路径 | 功能分析 | 目标路径 |
|--------|----------|----------|
| `src/core/calendar_service.py` | 实现日历服务的核心业务逻辑，封装日历计算算法 | `src/core/calendar_service.py` |
| `src/core/pillars_service.py` | 实现四柱命理服务的核心业务逻辑，封装四柱计算和验证算法 | `src/core/pillars_service.py` |
| `src/core/validation_service.py` | 实现验证服务的核心业务逻辑，封装验证算法 | `src/core/validation_service.py` |
| `src/core/__init__.py` | 核心服务模块的初始化文件 | `src/core/__init__.py` |

### 4. 工具模块 (src/utils/)

| 原路径 | 功能分析 | 目标路径 |
|--------|----------|----------|
| `src/utils/verify_pillars.py` | 实现四柱验证的工具函数，包括简单四柱转换功能 | `src/utils/verify_pillars.py` |
| `src/utils/simple_pillars.py` | 实现简单四柱计算的工具函数 | `src/utils/simple_pillars.py` |
| `src/utils/__init__.py` | 工具模块的初始化文件 | `src/utils/__init__.py` |

### 5. 测试模块 (tests/unit/)

| 原路径 | 功能分析 | 目标路径 |
|--------|----------|----------|
| `tests/unit/test_calendar_structure.py` | 测试日历结构的正确性 | `tests/unit/test_calendar_structure.py` |
| `tests/unit/test_year_validation.py` | 测试年份验证功能 | `tests/unit/test_year_validation.py` |
| `tests/unit/test_simple_pillars.py` | 测试简单四柱计算功能 | `tests/unit/test_simple_pillars.py` |
| `tests/unit/test_pillars_validator.py` | 测试四柱验证功能 | `tests/unit/test_pillars_validator.py` |
| `tests/unit/test_pillars_accuracy.py` | 测试四柱精度验证功能 | `tests/unit/test_pillars_accuracy.py` |
| `tests/unit/test_year_validation.py` | 测试年份验证功能 | `tests/unit/test_year_validation.py` |
| `tests/unit/test_year_validation.py` | 测试年份验证功能 | `tests/unit/test_year_validation.py` |

## 依赖关系分析

### 1. 模块间依赖关系

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   API模块      │────▶│   核心服务模块  │────▶│   算法模块     │
└───────────────┘     └───────────────┘     └───────────────┘
        ▲                     ▲                     ▲
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   工具模块     │     │   工具模块     │     │   工具模块     │
└───────────────┘     └───────────────┘     └───────────────┘
```

### 2. 关键依赖

- `solar-lunar` 或 `lunar-python`：用于公历和农历之间的转换
- `flask`：用于构建API服务
- `pytest`：用于单元测试

## 迁移建议

1. **保持现有目录结构**：项目的现有目录结构已经比较清晰，建议保持不变。

2. **添加缺失的模块**：
   - 添加 `src/__init__.py` 文件，使 `src` 成为一个 Python 包
   - 添加项目根目录下的 `__init__.py` 文件

3. **优化导入路径**：
   - 所有测试文件中的导入路径已经修复，使用相对路径导入
   - 生产代码中的导入路径使用绝对路径导入

4. **添加配置文件**：
   - 添加 `config.py` 文件，用于管理项目配置
   - 添加 `requirements.txt` 文件，用于管理项目依赖

5. **添加文档**：
   - 添加 `README.md` 文件，用于项目说明
   - 添加 API 文档，用于说明 API 接口的使用方法

## 总结

通过本次迁移，项目的目录结构更加清晰，模块间的依赖关系更加明确，代码的可维护性和可扩展性得到了提高。同时，修复了导入路径问题和测试用例中的错误，确保了项目的稳定性和可靠性。
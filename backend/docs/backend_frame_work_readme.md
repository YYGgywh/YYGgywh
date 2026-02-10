# 中华易学排盘项目 - 后端框架说明

## 📁 项目结构概览

```
backend/
├── src/                    # 源代码目录
│   ├── algorithms/         # 核心算法模块
│   ├── api/                # API接口模块
│   ├── core/               # 核心业务逻辑
│   ├── models/             # 数据模型
│   └── utils/              # 工具函数
├── tests/                  # 测试目录（分层架构）
│   ├── unit/               # 单元测试
│   ├── integration/        # 集成测试
│   ├── validation/         # 验证测试
│   └── e2e/                # 端到端测试
├── docs/                   # 文档目录
├── tools/                  # 开发工具
└── temp_tests/             # 临时测试文件
```

## 📋 核心文件说明

### 1. 项目配置文件

#### `requirements.txt` - 依赖管理文件
```python
# Web框架相关
fastapi==0.104.1      # 现代化Web API框架，支持异步
uvicorn==0.24.0       # ASGI服务器，用于运行FastAPI应用
pydantic==2.5.0       # 数据验证和序列化库

# 数据库相关
sqlalchemy==2.0.23    # ORM框架，数据库操作抽象层

# 测试相关
pytest==7.4.3         # 测试框架，支持单元测试和集成测试
pytest-asyncio==0.21.1 # 异步测试支持

# 易学算法核心依赖
lunar-python==1.4.8   # 农历计算库，提供农历、节气、干支计算
lunardate==0.2.0      # 农历日期处理
ephem==4.1.4          # 天文计算库

# 数据处理
numpy==1.24.3         # 数值计算
pandas==2.0.3         # 数据分析
```

#### `config.py` - 应用配置
```python
# 应用配置文件
# 包含数据库连接、API配置、算法参数等
```

### 2. 入口文件

#### `main.py` - 应用入口
```python
# FastAPI应用主入口
# 启动Web服务器，注册路由，配置中间件
```

#### `run_tests.py` - 测试运行脚本
```python
# 统一的测试运行脚本
# 支持按类型运行测试：单元测试、集成测试、验证测试、端到端测试
# 支持生成覆盖率报告
```

### 3. 测试配置文件

#### `tests/conftest.py` - 测试配置
```python
# pytest全局配置文件
# 包含测试fixtures、自定义标记、项目路径设置
```

## 🔧 核心模块详解

### 1. 算法模块 (`src/algorithms/`)

#### `calendar_calculator.py` - 日历计算器
```python
# 核心日历计算功能
# 公历转农历、节气计算、干支计算、星座计算
```

#### `bazi_calculator.py` - 八字计算器
```python
# 八字排盘算法
# 年柱、月柱、日柱、时柱计算
```

#### `liuyao_calculator.py` - 六爻计算器
```python
# 六爻占卜算法
# 卦象生成、变爻处理、卦辞解析
```

#### `qimen_calculator.py` - 奇门遁甲计算器
```python
# 奇门遁甲排盘算法
# 排局、定局、星门神煞计算
```

### 2. API接口模块 (`src/api/`)

#### `calendar_api.py` - 日历API
```python
# 日历相关API接口
# 农历查询、节气查询、干支查询
```

#### `bazi_api.py` - 八字API
```python
# 八字排盘API接口
# 八字查询、大运流年计算
```

#### `liuyao_api.py` - 六爻API
```python
# 六爻占卜API接口
# 起卦、解卦、卦象分析
```

#### `qimen_api.py` - 奇门API
```python
# 奇门遁甲API接口
# 排盘、局数计算、星门神煞查询
```

### 3. 核心业务模块 (`src/core/`)

#### `calendar_service.py` - 日历服务
```python
# 日历业务逻辑层
# 整合各种日历计算功能，提供统一的服务接口
```

### 4. 数据模型 (`src/models/`)

```python
# 数据模型定义
# 请求/响应模型、数据库模型、业务模型
```

### 5. 工具函数 (`src/utils/`)

```python
# 通用工具函数
# 日期处理、字符串处理、错误处理、日志记录
```

## 🧪 测试架构说明

### 分层测试策略

#### 1. 单元测试 (`tests/unit/`)
- **目的**: 测试单个函数或类的功能
- **范围**: 算法函数、工具函数、业务逻辑
- **文件示例**:
  - `test_calendar_calculator.py` - 日历计算器单元测试
  - `test_calendar_service.py` - 日历服务单元测试
  - `test_pillars_conversion.py` - 干支转换单元测试

#### 2. 集成测试 (`tests/integration/`)
- **目的**: 测试模块间的集成和API接口
- **范围**: API端点、数据库操作、外部服务集成
- **文件示例**:
  - `test_calendar_api.py` - 日历API集成测试

#### 3. 验证测试 (`tests/validation/`)
- **目的**: 验证算法准确性和数据一致性
- **范围**: 农历计算准确性、节气时间验证、干支循环验证
- **文件示例**:
  - `test_lunar_accuracy.py` - 农历准确性验证

#### 4. 端到端测试 (`tests/e2e/`)
- **目的**: 测试完整业务流程
- **范围**: 用户操作流程、系统整体功能
- **文件示例**: (待开发)

## 🚀 开发工作流

### 1. 环境设置
```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
.venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 2. 运行测试
```bash
# 运行所有测试
python run_tests.py --all

# 运行单元测试
python run_tests.py --unit

# 运行集成测试
python run_tests.py --integration

# 运行验证测试
python run_tests.py --validation

# 运行单个测试文件
python run_tests.py --file tests/unit/test_calendar_calculator.py
```

### 3. 启动开发服务器
```bash
# 启动FastAPI开发服务器
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. API文档访问
```
# Swagger UI文档
http://localhost:8000/docs

# ReDoc文档
http://localhost:8000/redoc
```

## 📊 技术栈特点

### 现代化架构
- **FastAPI**: 高性能异步Web框架
- **Pydantic**: 强类型数据验证
- **SQLAlchemy**: 数据库ORM抽象
- **Pytest**: 全面的测试框架

### 易学算法核心
- **lunar-python**: 专业的农历计算库
- **自定义算法**: 八字、六爻、奇门等传统易学算法
- **高精度计算**: 支持精确到分钟的节气时间计算

## ⚠️ 组件废弃通知

### 已废弃组件
以下组件已从代码库中移除，请使用替代方案：

#### 1. LunarCalculator (`src/algorithms/lunar_calculator.py`)
- **废弃原因**: 功能已由更优化的CalendarCalculator组件替代
- **替代方案**: 使用 `src/algorithms/calendar_calculator.py`
- **迁移指南**: 参考 `docs/component_deprecation_notice.md`

#### 2. Validators (`src/utils/validators.py`)
- **废弃原因**: 验证逻辑已内联到相关模块，减少依赖
- **替代方案**: 使用各模块内的验证逻辑
- **迁移指南**: 参考 `docs/component_deprecation_notice.md`

### 应急处理
如需恢复废弃组件，请参考：
- **回滚脚本**: `scripts/rollback_components.py`
- **应急计划**: `docs/emergency_plan.md`
- **详细通知**: `docs/component_deprecation_notice.md`

### 开发友好
- **分层架构**: 清晰的代码组织
- **完整测试**: 全面的测试覆盖
- **详细文档**: 自动生成的API文档
- **开发工具**: 丰富的开发辅助工具

## 🔄 扩展指南

### 添加新的算法模块
1. 在 `src/algorithms/` 创建新的算法文件
2. 实现核心算法逻辑
3. 在 `src/api/` 创建对应的API接口
4. 在 `tests/unit/` 添加单元测试
5. 在 `tests/integration/` 添加集成测试

### 添加新的API端点
1. 在相应的API文件中添加新的路由函数
2. 定义请求/响应模型
3. 实现业务逻辑
4. 添加测试用例

### 数据库集成
1. 在 `config.py` 中配置数据库连接
2. 在 `src/models/` 中定义数据模型
3. 在业务逻辑中使用SQLAlchemy进行数据库操作

## 📞 技术支持

### 问题排查
- 查看日志文件了解详细错误信息
- 使用测试框架验证功能正确性
- 参考API文档了解接口使用方法

### 性能优化
- 使用异步编程提高并发性能
- 合理使用缓存减少重复计算
- 优化数据库查询语句

---

**最后更新**: 2024年12月
**版本**: 1.0.0
**维护者**: 中华易学排盘项目团队
# backend/README.md 2026-02-15 16:30:00
# 功能：圆运阁古易文化 - 后端项目说明文档

## 项目简介

圆运阁古易文化后端项目是一个基于 FastAPI 的 Web 服务，提供历法转换、六爻排盘、随机数生成等 API 接口。项目采用模块化设计，代码结构清晰，易于维护和扩展。

## 功能特性

### 历法转换功能
- ✅ 公历转农历：支持公历日期转换为农历日期
- ✅ 农历转公历：支持农历日期转换为公历日期
- ✅ 干支计算：提供年、月、日、时干支信息
- ✅ 节气计算：提供24节气信息
- ✅ 生肖计算：提供生肖信息
- ✅ 闰月处理：正确处理农历闰月情况

### 六爻排盘功能
- ✅ 随机数生成：生成单个随机数字
- ✅ 三个随机数字：生成三个随机数字（模拟六爻三个铜钱）
- ✅ 随机六十甲子：随机选择六十甲子干支组合
- ✅ 背正判断：判断三个数字的背正状态

### 随机数生成功能
- ✅ 单个随机数字：生成 0-9 之间的随机数字
- ✅ 三个随机数字：生成三个随机数字
- ✅ 随机六十甲子：随机选择六十甲子干支组合

## 技术栈

### 核心框架
- **Python 3.14**：项目使用的 Python 版本
- **FastAPI 0.104.1**：Web 框架，用于构建 RESTful API
- **Uvicorn 0.24.0**：ASGI 服务器，用于运行 FastAPI 应用

### 数据验证
- **Pydantic 2.12.5**：数据验证和序列化库，用于 API 请求和响应模型

### 环境管理
- **python-dotenv 1.0.0**：环境变量管理库，用于加载 .env 文件中的配置

### 易学算法
- **lunar-python 1.4.8**：中国农历和干支计算库，用于历法转换和六爻排盘算法

## 项目结构

```
backend/
├── main.py                          # 主程序入口，FastAPI 应用启动
├── config.py                        # 应用配置管理
├── requirements.txt                 # Python 依赖列表
├── src/                            # 源代码目录
│   ├── api/                        # API 路由模块
│   │   ├── __init__.py             # API 路由统一管理
│   │   ├── calendar_api.py         # 历法转换 API 接口
│   │   ├── liuyao_api.py          # 六爻排盘 API 接口
│   │   └── random_number_api.py    # 随机数生成 API 接口
│   ├── core/                       # 核心算法模块
│   │   ├── calendar_algorithm_core.py    # 历法计算核心算法
│   │   └── liuyao_algorithm_core.py     # 六爻排盘核心算法
│   ├── data/                       # 数据层
│   │   ├── liuyao_configuration_data.py    # 六爻配置数据
│   │   └── sixty_jiazi_data.py            # 六十甲子数据
│   ├── divination/                  # 卜筮相关
│   │   └── random_number_divination.py      # 随机数卜筮
│   ├── exceptions/                 # 异常处理
│   │   └── business_exceptions.py       # 业务异常定义
│   ├── models/                     # 数据模型
│   │   ├── __init__.py             # 数据模型模块初始化
│   │   └── dto_models.py          # 数据传输对象模型
│   ├── services/                   # 服务层
│   │   ├── calendar_service.py      # 历法转换服务
│   │   ├── liuyao_service.py       # 六爻排盘服务
│   │   └── random_number_service.py  # 随机数生成服务
│   ├── utils/                      # 工具函数
│   │   ├── api_decorators.py      # API 装饰器
│   │   ├── error_codes.py          # 错误码定义
│   │   ├── response_formatter.py   # 响应格式化工具
│   │   └── service_decorators.py  # 服务装饰器
│   └── validators/                 # 验证器
│       ├── __init__.py             # 验证器模块初始化
│       ├── calendar_validator.py    # 历法参数验证器
│       ├── four_pillars_validator.py # 四柱参数验证器
│       └── liuyao_validator.py     # 六爻参数验证器
```

## 安装说明

### 环境要求
- Python 3.14+
- pip（Python 包管理器）

### 安装步骤

1. **创建虚拟环境**
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境（Windows）
.venv\Scripts\activate

# 激活虚拟环境（Linux/Mac）
source .venv/bin/activate
```

2. **安装依赖**
```bash
# 安装项目依赖
pip install -r requirements.txt
```

3. **启动项目**
```bash
# 启动 FastAPI 应用
python main.py
```

后端服务将在 http://localhost:8000 启动

## API 文档

### Swagger UI
- 访问地址：http://localhost:8000/docs
- 功能：交互式 API 文档，支持在线测试

### ReDoc
- 访问地址：http://localhost:8000/redoc
- 功能：另一种格式的 API 文档

### OpenAPI 规范
- 访问地址：http://localhost:8000/openapi.json
- 功能：OpenAPI 规范文件，用于生成客户端 SDK

## API 接口

### 历法转换 API

#### 公历转农历
- **请求地址**：`POST /api/v1/calendar/solar-to-lunar`
- **请求参数**：
  - `year`：公历年（1-9999）
  - `month`：公历月（1-12）
  - `day`：公历日（1-31）
  - `hour`：公历小时（0-23）
  - `minute`：公历分钟（0-59）
  - `second`：公历秒（0-59）
- **响应格式**：见 `docs/calendar_conversion_response_structure.md`

#### 农历转公历
- **请求地址**：`POST /api/v1/calendar/lunar-to-solar`
- **请求参数**：
  - `year`：农历年（1900-2100）
  - `month`：农历月（1-12，负数表示闰月）
  - `day`：农历日（1-30）
  - `hour`：时辰（0-11）
  - `minute`：分钟（0-59）
  - `second`：秒（0-59）
  - `is_leap_month`：是否为闰月（true/false）
- **响应格式**：见 `docs/calendar_conversion_response_structure.md`

### 六爻排盘 API

#### 随机数生成
- **请求地址**：`POST /api/v1/random/digit`
- **请求参数**：无
- **响应格式**：
```json
{
  "digit": 5,
  "method": "普通单个随机整数",
  "description": "生成0~9之间的随机数字"
}
```

#### 三个随机数字
- **请求地址**：`POST /api/v1/random/three-digits`
- **请求参数**：无
- **响应格式**：
```json
{
  "three_digits": "531",
  "parity_str": "背正背",
  "odd_count": 2,
  "method": "模拟六爻三个铜钱随机正背",
  "description": "生成三个随机数字的字符串"
}
```

#### 随机六十甲子
- **请求地址**：`POST /api/v1/random/jiazi`
- **请求参数**：无
- **响应格式**：
```json
{
  "jiazi": "甲子",
  "index": 1,
  "total_count": 60,
  "method": "模拟抽签六十甲子",
  "description": "从六十甲子中随机选择一个干支"
}
```

## 开发指南

### 开发环境搭建
```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
.venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动项目
python main.py
```

### 开发规范

#### 命名规范
- **变量命名**：驼峰命名法，首字母小写
  - 示例：`userName`, `totalCount`, `isActive`
- **常量命名**：全部大写，单词之间用下划线分隔
  - 示例：`MAX_COUNT`, `DEFAULT_TIMEOUT`
- **类命名**：驼峰命名法，首字母大写
  - 示例：`UserProfile`, `DataProcessor`
- **函数命名**：驼峰命名法，首字母小写
  - 示例：`calculateTotal`, `validateInput`
- **文件命名**：小写字母，单词之间用下划线分隔
  - 示例：`user_profile.py`, `data_processor.py`

#### 代码注释
- **文件注释**：第一行添加文件路径和创建时间
  - 格式：`# 路径:[真实路径]/[带后缀的文件名] 时间:[YYYY-MM-DD HH:MM]`
  - 示例：`# 路径:backend/config.py 时间:2026-02-15 10:00:00`
- **功能注释**：第二行添加文件功能
  - 格式：`# 功能:[文件简要功能（10-30字）]`
  - 示例：`# 功能:应用配置管理`
- **代码注释**：逐行添加注释，注释内容与代码在同一行
  - 示例：`import os  # 导入os模块，用于路径操作`

### 测试指南
```bash
# 运行测试（待实现）
pytest

# 运行测试并生成覆盖率报告（待实现）
pytest --cov=src --cov-report=html
```

## 部署指南

### 使用 Uvicorn 部署
```bash
# 启动 FastAPI 应用
uvicorn main:app --host 0.0.0.0 --port 8000

# 启动 FastAPI 应用（调试模式）
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 使用 Docker 部署
```bash
# 构建 Docker 镜像
docker build -t yyg-backend .

# 运行 Docker 容器
docker run -p 8000:8000 yyg-backend
```

### 使用 Gunicorn 部署
```bash
# 启动 FastAPI 应用
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 配置说明

### 环境变量
创建 `.env` 文件配置环境变量：
```env
DEBUG=True  # 调试模式
```

### 配置文件
`config.py` 文件包含应用的所有配置：
- `APP_NAME`：应用名称
- `APP_VERSION`：应用版本号
- `DEBUG`：调试模式
- `API_V1_STR`：API 版本路径
- `BACKEND_CORS_ORIGINS`：CORS 允许的源列表

## 文档

### 项目文档
- [日历转换模块返回数据结构文档](docs/calendar_conversion_response_structure.md)
- [Lunar-Python 农历计算库使用说明](docs/lunar_calendar_usage.md)

### API 文档
- Swagger UI：http://localhost:8000/docs
- ReDoc：http://localhost:8000/redoc
- OpenAPI 规范：http://localhost:8000/openapi.json

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护者。

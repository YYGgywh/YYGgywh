# 路径:f:\Project\YYG_paipan_Project\README.md 时间:2026-02-15 10:00
# 功能:项目说明文档，介绍项目结构和使用方法

# 圆运阁古易文化

专业的易学排盘工具，提供六爻占卜、历法计算等传统易学算法的在线计算服务。

## 项目结构

```
YYG_paipan_Project/
├── backend/                 # 后端Python服务
│   ├── src/
│   │   ├── api/            # API接口模块
│   │   │   ├── calendar_api.py      # 历法计算API接口
│   │   │   ├── liuyao_api.py        # 六爻占卜API接口
│   │   │   └── random_number_api.py # 随机数生成API接口
│   │   ├── core/           # 核心算法模块
│   │   │   ├── calendar_algorithm_core.py  # 历法算法核心
│   │   │   └── liuyao_algorithm_core.py    # 六爻算法核心
│   │   ├── data/           # 数据配置模块
│   │   │   ├── liuyao_configuration_data.py    # 六爻配置数据
│   │   │   └── sixty_jiazi_data.py             # 六十甲子数据
│   │   ├── divination/     # 占卜模块
│   │   │   └── random_number_divination.py     # 随机数占卜
│   │   ├── exceptions/     # 异常处理模块
│   │   │   └── business_exceptions.py           # 业务异常
│   │   ├── models/         # 数据模型
│   │   │   └── dto_models.py                    # DTO数据模型
│   │   ├── services/       # 业务服务模块
│   │   │   ├── calendar_service.py              # 历法服务
│   │   │   ├── liuyao_service.py                # 六爻服务
│   │   │   └── random_number_service.py         # 随机数服务
│   │   ├── utils/          # 工具函数模块
│   │   │   ├── api_decorators.py                # API装饰器
│   │   │   ├── error_codes.py                   # 错误码定义
│   │   │   ├── response_formatter.py            # 响应格式化器
│   │   │   └── service_decorators.py            # 服务装饰器
│   │   └── validators/     # 数据验证模块
│   │       ├── calendar_validator.py            # 历法验证器
│   │       ├── four_pillars_validator.py        # 四柱验证器
│   │       └── liuyao_validator.py              # 六爻验证器
│   ├── docs/              # 后端文档
│   ├── config.py          # 配置文件
│   ├── main.py            # 主程序入口
│   └── requirements.txt   # Python依赖
├── frontend/               # 前端React应用
│   ├── src/
│   │   ├── components/    # 组件模块
│   │   │   ├── Add/       # 添加组件
│   │   │   ├── DivinationInfo/  # 占卜信息组件
│   │   │   │   └── timestamp/  # 时间戳相关组件
│   │   │   ├── Footer/    # 页脚组件
│   │   │   ├── Header/    # 头部导航组件
│   │   │   ├── LiuYao/    # 六爻相关组件
│   │   │   │   ├── LiuYaoQiGua/      # 六爻起卦组件
│   │   │   │   ├── LiuYaoReault/     # 六爻结果组件
│   │   │   │   ├── components/       # 六爻子组件
│   │   │   │   └── methods/          # 起卦方法组件
│   │   │   └── common/    # 公共组件
│   │   ├── contexts/      # 全局状态管理
│   │   │   └── DivinationContext.jsx  # 占卜上下文
│   │   ├── services/      # API服务模块
│   │   │   ├── calendarService.js     # 历法服务
│   │   │   └── liuyaoService.js       # 六爻服务
│   │   ├── utils/         # 工具函数
│   │   │   ├── fourPillarsUtils.js    # 四柱工具
│   │   │   └── validationUtils.js     # 验证工具
│   │   ├── App.css        # 应用样式
│   │   ├── App.jsx        # 主应用组件
│   │   └── index.js       # 入口文件
│   ├── test/              # 前端测试文件
│   ├── 说明/              # 前端说明文档
│   ├── public/            # 公共资源
│   ├── package.json       # Node.js依赖
│   └── jsconfig.json     # JavaScript配置
├── docs/                  # 项目文档
├── .trae/                 # 项目配置
├── tests/                # 测试文件
├── start_project.bat     # 项目启动脚本
└── README.md             # 项目说明
```

## 功能特性

### 六爻占卜
- 传统六爻占卜系统
- 支持多种起卦方法：
  - 一键起卦：自动生成六个随机数字
  - 数字起卦：手动输入六个三位数
  - 指定起卦：逐个指定每个爻位的数字
  - 逐步起卦：逐步生成每个爻位的数字
- 支持公历和农历日期作为起卦时间
- 提供详细的卦象解读和爻位分析
- 基于后端随机数生成器确保随机性

### 历法计算
- 公历与农历双向转换
- 支持完整的历法信息查询：
  - 公历日期（年、月、日、时、分、秒）
  - 农历日期（年、月、日、时辰）
  - 干支信息（年干支、月干支、日干支、时干支）
  - 节气信息（上/下一个节气）
  - 农历年月信息（闰月、天数等）
- 支持四柱时间查询
- 基于**lunar-javascript**库提供准确的农历计算

### 随机数生成
- 提供随机数生成服务
- 支持生成单个随机数字
- 支持生成三位随机数字
- 用于六爻起卦的随机数生成

## 技术栈

### 后端技术
- **框架**: FastAPI 0.104.1
- **语言**: Python 3.8+
- **ASGI服务器**: Uvicorn 0.24.0
- **数据验证**: Pydantic 2.5.0
- **环境变量**: python-dotenv 1.0.0
- **农历计算**: lunar-python 1.4.8（专业的农历计算库）
- **跨域支持**: FastAPI CORS Middleware

### 前端技术
- **框架**: React 19.2.3
- **语言**: JavaScript
- **构建工具**: React Scripts 5.0.1
- **农历计算**: lunar-javascript 1.7.7
- **状态管理**: React Context API
- **路由**: 简单路径判断（非React Router）
- **样式**: CSS（支持CSS Modules）

## 快速开始

### 环境要求
- Python 3.8+
- Node.js 16+
- npm

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 安装Python依赖
```bash
pip install -r requirements.txt
```

3. 启动后端服务
```bash
python main.py
```

后端服务将在 http://localhost:8000 启动

API文档地址：http://localhost:8000/docs

### 前端启动

1. 进入前端目录
```bash
cd frontend
```

2. 安装Node.js依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

前端应用将在 http://localhost:3000 启动

### 一键启动

使用项目根目录的启动脚本：
```bash
start_project.bat
```

## 环境配置

### 前端环境配置

前端项目使用环境变量来配置后端 API 地址，支持开发环境和生产环境的不同配置。

#### 配置文件说明

- `.env.example` - 示例配置文件（提交到 Git，供其他开发者参考）
- `.env.development` - 开发环境配置（不提交到 Git，本地开发使用）
- `.env.production` - 生产环境配置（不提交到 Git，生产环境部署使用）

#### 配置步骤

1. **复制示例配置文件**

```bash
cd frontend
cp .env.example .env.development
cp .env.example .env.production
```

2. **配置开发环境** (`.env.development`)

```bash
# 开发环境：后端运行在本地
REACT_APP_API_BASE_URL=http://localhost:8000
```

3. **配置生产环境** (`.env.production`)

**方案一：使用相对路径（推荐用于同服务器部署）**

```bash
# 生产环境：前端和后端在同一域名下
REACT_APP_API_BASE_URL=
```

**方案二：使用完整域名（推荐用于分离部署）**

```bash
# 生产环境：前端和后端在不同域名下
REACT_APP_API_BASE_URL=https://1198675leyc06.vicp.fun
```

#### 环境变量优先级

React 会按以下优先级加载环境变量：
1. `.env.development.local`（仅开发环境）
2. `.env.local`（所有环境）
3. `.env.development`（仅开发环境）
4. `.env.production`（仅生产环境）
5. `.env`（所有环境）

#### 注意事项

- 所有 `.env` 文件都已添加到 `.gitignore`，不会被提交到 Git
- `.env.example` 文件应该提交到 Git，供其他开发者参考
- 生产环境配置文件（`.env.production`）应该在服务器上手动创建
- 修改环境变量后需要重启开发服务器才能生效

### 后端环境配置

后端项目使用环境变量来配置应用行为。

#### 配置文件

- `.env` - 环境变量配置文件（不提交到 Git）

#### 配置示例

```bash
# backend/.env
DEBUG=false
```

#### CORS 配置

后端已配置 CORS，允许以下源访问：
- `http://localhost:3000` - 开发环境前端
- `http://127.0.0.1:3000` - 开发环境前端
- `http://localhost:3001` - 开发环境前端（备用端口）
- `http://127.0.0.1:3001` - 开发环境前端（备用端口）
- `https://1198675leyc06.vicp.fun` - 生产环境域名

如需添加新的允许访问的域名，请修改 `backend/config.py` 文件中的 `BACKEND_CORS_ORIGINS` 配置。

## API接口

### 六爻占卜 (API路径: `/api/v1/liuyao`)

#### POST `/api/v1/liuyao/assemble-liuya` - 六爻起卦
**请求参数：**
- `numbers`: 六个三位数组成的数组（字符串格式）
- 公历日期（可选）：
  - `year`: 公历年
  - `month`: 公历月
  - `day`: 公历日
- 农历日期（可选）：
  - `lunar_year`: 农历年
  - `lunar_month`: 农历月
  - `lunar_day`: 农历日
  - `is_leap_month`: 是否闰月（默认false）
- 公用时间字段：
  - `hour`: 小时（默认0）
  - `minute`: 分钟（默认0）
  - `second`: 秒（默认0）

**返回：**
- 六爻排盘结果，包含卦象、爻位、干支等信息

#### POST `/api/v1/liuyao/validator-liuya` - 验证器测试
**请求参数：**
- `numbers`: 六个三位数组成的数组

**返回：**
- 验证结果

### 历法计算 (API路径: `/api/v1/calendar`)

#### POST `/api/v1/calendar/validate-solar` - 验证公历时间
**请求参数：**
- `year`: 公历年（字符串）
- `month`: 公历月（字符串）
- `day`: 公历日（字符串）
- `hour`: 小时（字符串）
- `minute`: 分钟（字符串）
- `second`: 秒（字符串）

**返回：**
- 验证结果

#### POST `/api/v1/calendar/convert-solar` - 公历转农历
**请求参数：**
- `year`: 公历年（1-9999）
- `month`: 公历月（1-12）
- `day`: 公历日（1-31）
- `hour`: 小时（0-23，可选，默认0）
- `minute`: 分钟（0-59，可选，默认0）
- `second`: 秒（0-59，可选，默认0）

**返回：**
- 完整的历法信息，包括：
  - 公历信息
  - 农历信息
  - 干支信息（年、月、日、时）
  - 节气信息
  - 农历年月信息

#### POST `/api/v1/calendar/validate-lunar` - 验证农历时间
**请求参数：**
- `lunar_year`: 农历年（字符串）
- `lunar_month`: 农历月（字符串）
- `lunar_day`: 农历日（字符串）
- `is_leap_month`: 是否闰月（字符串，"true"或"false"）
- `hour`: 小时（字符串）
- `minute`: 分钟（字符串）
- `second`: 秒（字符串）

**返回：**
- 验证结果

#### POST `/api/v1/calendar/convert-lunar` - 农历转公历
**请求参数：**
- `lunar_year`: 农历年（1-9999）
- `lunar_month`: 农历月（1-12）
- `lunar_day`: 农历日（1-30）
- `hour`: 小时（0-23，可选，默认0）
- `minute`: 分钟（0-59，可选，默认0）
- `second`: 秒（0-59，可选，默认0）
- `is_leap_month`: 是否闰月（true/false，可选，默认false）

**返回：**
- 完整的历法信息

### 随机数生成 (API路径: `/api/v1/random`)

#### GET `/api/v1/random/digit` - 生成单个随机数字
**返回：**
- 随机数字结果

#### GET `/api/v1/random/three-digits` - 生成三位随机数字
**返回：**
- 三位随机数字结果

## 前端服务

### 历法服务 (CalendarService)

提供历法转换和计算功能，基于**lunar-javascript**库。

主要方法：
- `getFullCalendarInfo(timeData)` - 获取完整历法信息
- `convertSolarToLunar(solarData)` - 公历转农历
- `convertLunarToSolar(lunarData)` - 农历转公历
- `getDaysInMonth(year, month)` - 获取指定年月的天数
- `getLunarTimeByHms(hour, minute, second)` - 根据时分秒获取农历时辰
- `getSolarListByBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect, baseYear)` - 通过八字获取匹配的阳历列表

### 六爻服务 (LiuYaoService)

提供六爻起卦相关的服务。

主要方法：
- `generateRandomDigit()` - 生成单个随机数字
- `generateRandomThreeDigits()` - 生成三位随机数字
- `generateSixDigits()` - 一键生成六个随机数字
- `performDivination(digitsArray)` - 处理排盘逻辑
- `calculateYaoDataFromDigits(digitsArray)` - 根据数字数组计算爻位数据
- `calculateOddCount(threeDigits)` - 计算奇数个数
- `calculateParityStr(threeDigits)` - 计算奇偶字符串
- `processYaoData(yaoValues, yaoOddCounts, yaoKey, resultData)` - 处理爻位数据更新

## 开发说明

### 后端开发
- 使用FastAPI框架，支持异步处理
- 配置管理使用Pydantic Settings
- API文档自动生成，访问 http://localhost:8000/docs
- 分层架构：API层 → Service层 → Core层
- 统一的异常处理和错误码管理
- 统一的响应格式化

### 前端开发
- 使用React Hooks和类组件
- JavaScript开发（非TypeScript）
- React Context进行全局状态管理
- 简单的路径判断进行路由（非React Router）
- 组件化开发，支持CSS Modules
- 服务层封装API调用

## 部署说明

### 生产环境部署
1. 后端：使用uvicorn或gunicorn部署
2. 前端：运行 `npm run build` 构建静态文件
3. 配置Nginx反向代理

### 环境变量配置
创建 `.env` 文件配置环境变量：
```env
DEBUG=false
```

### CORS配置
后端已配置CORS，允许以下源访问：
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:3001
- http://127.0.0.1:3001
- https://1198675leyc06.vicp.fun

## 命名规范

### 后端命名规范
- 所有变量名必须采用驼峰命名法（CamelCase），首字母小写
  示例：`userName`, `totalCount`, `isActive`
- 常量名必须全部大写，单词之间用下划线分隔
  示例：`MAX_COUNT`, `DEFAULT_TIMEOUT`
- 类名必须采用驼峰命名法，首字母大写
  示例：`UserProfile`, `DataProcessor`
- 函数名必须采用驼峰命名法，首字母小写
  示例：`calculateTotal`, `validateInput`
- Python文件名必须采用小写字母，单词之间用下划线分隔
  示例：`user_profile.py`, `data_processor.py`

### 前端命名规范
- 所有变量名必须采用驼峰命名法（CamelCase），首字母小写
  示例：`userName`, `totalCount`, `isActive`
- 常量名必须全部大写，单词之间用下划线分隔
  示例：`MAX_COUNT`, `DEFAULT_TIMEOUT`
- 类名必须采用驼峰命名法，首字母大写
  示例：`UserProfile`, `DataProcessor`
- 函数名必须采用驼峰命名法，首字母小写
  示例：`calculateTotal`, `validateInput`
- JS文件名必须采用驼峰命名法，首字母小写
  示例：`calculateTotal.js`, `validateInput.js`
- JSX文件名必须采用驼峰命名法，首字母大写
  示例：`UserProfile.jsx`, `DataProcessor.jsx`

## 注释规范

- 生成的代码必须添加逐行注释，注释内容必须与代码在同一行
- 对函数、类、模块等进行注释时，注释内容必须置于代码上方
- 所有改写/生成的代码文件，第一行必须添加注释：
  格式：`[对应注释符号] 路径:[真实路径]/[带后缀的文件名] 时间:[YYYY-MM-DD HH:MM]`
  示例（.js文件）：`// 路径:src/utils/format.js 时间:2026-02-15 10:00`
  示例（.py文件）：`# 路径:data/process/user.py 时间:2026-02-15 10:00`
- 第二行添加注释，格式：`[对应注释符号] 功能:[文件简要功能（10-30字）]`
  示例：`// 功能:格式化时间戳为YYYY-MM-DD格式`

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护者。

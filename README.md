# 圆运阁排盘系统

专业的易学排盘工具，提供八字、六爻、奇门等多种传统易学算法的在线计算服务。

## 项目结构

```
YYG_paipan_Project/
├── backend/                 # 后端Python服务
│   ├── src/
│   │   ├── algorithms/     # 核心算法模块
│   │   │   ├── bazi_calculator.py      # 八字排盘算法
│   │   │   ├── liuyao_calculator.py    # 六爻占卜算法
│   │   │   └── qimen_calculator.py     # 奇门遁甲算法
│   │   ├── api/            # API路由模块
│   │   │   ├── bazi.py     # 八字API接口
│   │   │   ├── liuyao.py   # 六爻API接口
│   │   │   └── qimen.py    # 奇门API接口
│   │   ├── core/           # 核心业务模块
│   │   ├── models/         # 数据模型
│   │   └── utils/          # 工具函数
│   ├── requirements.txt    # Python依赖
│   ├── config.py          # 配置文件
│   └── main.py            # 主程序入口
├── frontend/               # 前端React应用
│   ├── src/
│   │   ├── components/    # 公共组件
│   │   │   ├── Header.tsx # 导航头部组件
│   │   │   ├── Bazi/      # 八字相关组件
│   │   │   ├── Liuyao/    # 六爻相关组件
│   │   │   └── Qimen/     # 奇门相关组件
│   │   ├── pages/         # 页面组件
│   │   │   ├── Home.tsx   # 首页
│   │   │   ├── Bazi.tsx   # 八字排盘页面
│   │   │   ├── Liuyao.tsx # 六爻占卜页面
│   │   │   └── Qimen.tsx  # 奇门遁甲页面
│   │   ├── services/      # API服务模块
│   │   │   ├── api.ts     # API客户端配置
│   │   │   ├── baziService.ts     # 八字API服务
│   │   │   ├── liuyaoService.ts   # 六爻API服务
│   │   │   └── qimenService.ts    # 奇门API服务
│   │   ├── utils/         # 工具函数
│   │   ├── styles/        # 样式文件
│   │   ├── App.tsx        # 主应用组件
│   │   └── main.tsx       # 入口文件
│   ├── package.json       # Node.js依赖
│   ├── tsconfig.json     # TypeScript配置
│   └── vite.config.ts    # Vite配置
├── docs/                  # 项目文档
├── tests/                # 测试文件
├── start_project.bat     # 项目启动脚本
└── README.md             # 项目说明
```

## 功能特性

### 八字排盘
- 专业的八字命理分析
- 四柱八字、十神、大运、流年详细排盘
- 支持公历和农历日期转换
- 基于**lunar-python**库提供准确的农历计算和节气信息

### 六爻占卜
- 传统六爻占卜系统
- 支持铜钱法和蓍草法起卦
- 提供详细卦象解读

### 奇门遁甲
- 奇门遁甲排盘系统
- 包含天盘、地盘、人盘、神盘四层分析
- 支持阳遁和阴遁模式

## 技术栈

### 后端技术
- **框架**: FastAPI
- **语言**: Python 3.8+
- **数据库**: SQLite/MySQL (待扩展)
- **依赖管理**: pip + requirements.txt
- **农历计算**: lunar-python (专业的农历计算库)

### 前端技术
- **框架**: React 18
- **语言**: TypeScript
- **UI组件**: Ant Design
- **构建工具**: Vite
- **路由**: React Router

## 快速开始

### 环境要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

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
npm run dev
```

前端应用将在 http://localhost:3000 启动

## API接口

### 八字排盘 (API路径: `/api/bazi`)
- `POST /api/bazi/calculate` - 计算八字排盘
  - 请求参数：出生日期、出生时间、性别、是否农历
  - 返回：四柱八字、十神、日主、五行分布
- `GET /api/bazi/dayun/{birth_date}` - 获取大运信息（开发中）
- `GET /api/bazi/liunian/{year}` - 获取流年信息（开发中）

### 六爻占卜 (API路径: `/api/liuyao`)
- `POST /api/liuyao/divine` - 六爻起卦
  - 请求参数：起卦方法、问题、时间
  - 返回：本卦、变卦、卦象解读
- `GET /api/liuyao/hexagrams` - 获取六十四卦列表（开发中）
- `GET /api/liuyao/interpretation/{hexagram_id}` - 获取卦象解释（开发中）

### 奇门遁甲 (API路径: `/api/qimen`)
- `POST /api/qimen/calculate` - 奇门排盘
  - 请求参数：排盘时间、排盘模式（阳遁/阴遁）
  - 返回：天干地支、九星、八门、八神
- `GET /api/qimen/patterns` - 获取排盘模式
  - 返回：阳遁和阴遁模式信息
- `GET /api/qimen/analysis/{datetime}` - 奇门分析（开发中）

## 农历计算库 (lunar-python)

本项目使用 **lunar-python** 库进行专业的农历计算，该库提供了以下功能：

### 主要特性
- **准确的农历转换**: 支持公历到农历的精确转换
- **节气计算**: 自动识别24节气日期
- **干支计算**: 提供年、月、日干支信息
- **生肖计算**: 自动计算生肖信息
- **闰月处理**: 正确处理农历闰月情况

### 使用方法

```python
from src.algorithms.calendar_calculator import CalendarCalculator

# 创建日历计算器实例
calc = CalendarCalculator()

# 获取完整的历法信息
info = calc.get_comprehensive_calendar_info(2024, 1, 1)

# 农历信息
lunar_info = info['lunar']
print(f"农历日期: {lunar_info['lunar_date']}")
print(f"农历年: {lunar_info['lunar_year_name']}")
print(f"生肖: {lunar_info['animal']}")

# 干支信息
ganzhi_info = info['ganzhi']
print(f"年干支: {ganzhi_info['year_ganzhi']}")
print(f"月干支: {ganzhi_info['month_ganzhi']}")
print(f"日干支: {ganzhi_info['day_ganzhi']}")

# 节气信息
jieqi_info = info['jieqi']
print(f"节气: {jieqi_info['jieqi']}")
```

### 测试验证
项目包含完整的测试用例，验证lunar-python库的准确性：
- 重要日期验证（春节、端午、中秋等）
- 24节气准确性验证
- 闰月处理验证
- 干支一致性验证

运行测试：
```bash
cd backend
python tests/test_lunar_calendar.py
python tests/test_accuracy_validation.py
```

## 开发说明

### 后端开发
- 使用FastAPI框架，支持异步处理
- 配置管理使用Pydantic Settings
- API文档自动生成，访问 http://localhost:8000/docs

### 前端开发
- 使用React Hooks和函数式组件
- TypeScript提供类型安全
- Ant Design提供现代化UI组件
- Vite提供快速开发体验

## 部署说明

### 生产环境部署
1. 后端：使用uvicorn或gunicorn部署
2. 前端：运行 `npm run build` 构建静态文件
3. 配置Nginx反向代理

### 环境变量配置
创建 `.env` 文件配置环境变量：
```env
DATABASE_URL=sqlite:///./paipan.db
SECRET_KEY=your-secret-key
DEBUG=false
```

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
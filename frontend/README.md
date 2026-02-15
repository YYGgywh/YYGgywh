# frontend/README.md 2026-02-15 16:40:00
# 功能：圆运阁古易文化 - 前端项目说明文档

## 项目简介

圆运阁古易文化前端项目是一个基于 React 的 Web 应用，提供历法转换、六爻排盘、随机数生成等功能的用户界面。项目采用模块化设计，组件化开发，易于维护和扩展。

## 功能特性

### 历法转换功能
- ✅ 公历转农历：支持公历日期转换为农历日期
- ✅ 农历转公历：支持农历日期转换为公历日期
- ✅ 干支选择：支持年、月、日干支选择
- ✅ 时辰选择：支持十二时辰选择

### 六爻排盘功能
- ✅ 数字方法：使用三个随机数字起卦
- ✅ 指定方法：指定三个数字起卦
- ✅ 一步法：逐步选择起卦
- ✅ 一键法：一键随机起卦

### 随机数生成功能
- ✅ 单个随机数字：生成 0-9 之间的随机数字
- ✅ 三个随机数字：生成三个随机数字

## 技术栈

### 核心框架
- **React 18**：UI 框架
- **JavaScript**：开发语言

### UI 组件库
- **Ant Design Mobile**：移动端 UI 组件库

### 工具库
- **lunar-javascript 1.7.7**：中国农历和干支计算库

### 构建工具
- **Vite**：快速的前端构建工具

### 路由
- **React Router**：路由管理

## 项目结构

```
frontend/
├── public/                         # 公共资源目录
│   ├── favicon.ico               # 网站图标
│   ├── favicon1.ico              # 网站图标（备用）
│   └── index.html               # HTML 入口文件
├── src/                            # 源代码目录
│   ├── components/                # 公共组件
│   │   ├── Add/                    # 添加组件
│   │   │   ├── Add.css              # 添加组件样式
│   │   │   └── Add.jsx              # 添加组件
│   │   ├── DivinationInfo/          # 卜筮信息组件
│   │   │   ├── timestamp/           # 时间戳组件
│   │   │   │   ├── Bak_20260201/   # 时间戳备份
│   │   │   │   │   ├── FourPillarsTime.jsx    # 四柱时间组件
│   │   │   │   │   ├── GregorianTime.jsx   # 公历时间组件
│   │   │   │   │   ├── LunarTime.jsx       # 农历时间组件
│   │   │   │   │   └── TimestampModal.jsx # 时间戳模态框
│   │   │   │   ├── FourPillarsTime.jsx  # 四柱时间组件
│   │   │   │   ├── GanZhiSelector.jsx   # 干支选择器
│   │   │   │   ├── GanZhiSelector.module.css  # 干支选择器样式
│   │   │   │   ├── GregorianTime.jsx  # 公历时间组件
│   │   │   │   ├── LunarTime.jsx       # 农历时间组件
│   │   │   │   └── TimestampModal.jsx # 时间戳模态框
│   │   │   ├── DivinationInfo.css    # 卜筮信息样式
│   │   │   └── DivinationInfo.jsx   # 卜筮信息组件
│   │   ├── Footer/                 # 页脚组件
│   │   │   ├── Footer.css           # 页脚样式
│   │   │   └── Footer.jsx           # 页脚组件
│   │   ├── Header/                 # 导航头部组件
│   │   │   ├── Button/              # 按钮组件
│   │   │   │   ├── Button.css          # 按钮样式
│   │   │   │   └── Button.jsx          # 按钮组件
│   │   │   ├── DropdownColumn/     # 下拉菜单列组件
│   │   │   │   ├── DropdownColumn.css.BAK     # 下拉菜单列样式（备份）
│   │   │   │   ├── DropdownColumn.jsx          # 下拉菜单列组件
│   │   │   │   └── DropdownColumn.module.css  # 下拉菜单列样式
│   │   │   ├── DropdownItem/       # 下拉菜单项组件
│   │   │   │   ├── DropdownItem.css          # 下拉菜单项样式
│   │   │   │   └── DropdownItem.jsx          # 下拉菜单项组件
│   │   │   ├── DropdownMenu/      # 下拉菜单组件
│   │   │   │   ├── DropdownMenu.css.bak      # 下拉菜单样式（备份）
│   │   │   │   ├── DropdownMenu.jsx              # 下拉菜单组件
│   │   │   │   └── DropdownMenu.module.css  # 下拉菜单样式
│   │   │   ├── Logo/               # Logo 组件
│   │   │   │   ├── Logo.css            # Logo 样式
│   │   │   │   ├── Logo.jsx            # Logo 组件
│   │   │   │   └── Logo.png            # Logo 图片
│   │   │   └── MenuItem/           # 菜单项组件
│   │   │       ├── MenuItem.css          # 菜单项样式
│   │   │       └── MenuItem.jsx          # 菜单项组件
│   │   ├── LiuYao/                # 六爻相关组件
│   │   │   ├── LiuYaoQiGua/       # 六爻起卦组件
│   │   │   │   ├── LiuYaoQiGua.css      # 六爻起卦样式
│   │   │   │   └── LiuYaoQiGua.jsx      # 六爻起卦组件
│   │   │   ├── LiuYaoReault/      # 六爻结果组件
│   │   │   │   ├── LiuYaoReault.css     # 六爻结果样式
│   │   │   │   └── LiuYaoReault.jsx     # 六爻结果组件
│   │   │   ├── components/         # 六爻子组件
│   │   │   │   ├── MethodContent.jsx   # 方法内容组件
│   │   │   │   ├── NavigationSidebar.css  # 导航侧边栏样式
│   │   │   │   └── NavigationSidebar.jsx # 导航侧边栏组件
│   │   │   └── methods/           # 六爻方法组件
│   │   │       ├── NumberMethod.jsx          # 数字方法组件
│   │   │       ├── NumberMethod.jsx.BAK       # 数字方法组件（备份）
│   │   │       ├── NumberMethod.module.css.BAK # 数字方法样式（备份）
│   │   │       ├── OneClickMethod.jsx      # 一键法组件
│   │   │       ├── SpecifiedMethod.jsx      # 指定法组件
│   │   │       ├── SpecifiedMethod.jsx.BAK       # 指定法组件（备份）
│   │   │       ├── SpecifiedMethod.module.css.BAK # 指定法样式（备份）
│   │   │       └── StepByStepMethod.jsx  # 一步法组件
│   │   ├── common/                 # 公共组件
│   │   │   ├── SixYaoDisplay.css   # 六爻显示样式
│   │   │   ├── SixYaoDisplay.jsx   # 六爻显示组件
│   │   │   ├── YaoComponents.css   # 爻组件样式
│   │   │   └── YaoComponents.jsx   # 爻组件
│   ├── contexts/                   # React Context
│   │   └── DivinationContext.jsx   # 卜筮上下文
│   ├── services/                  # API 服务
│   │   ├── Bak_20260204/          # 服务备份
│   │   │   └── calendarService.js  # 日历服务备份
│   │   ├── calendarService.js       # 日历服务
│   │   └── liuyaoService.js        # 六爻服务
│   ├── utils/                     # 工具函数
│   │   ├── fourPillarsUtils.js    # 四柱工具函数
│   │   └── validationUtils.js      # 验证工具函数
│   ├── App.css                    # 应用样式
│   ├── App.jsx                    # 主应用组件
│   └── index.js                   # 入口文件
├── test/                           # 测试文件
│   ├── 123.html                   # 测试 HTML 文件
│   ├── 123.js                     # 测试 JavaScript 文件
│   ├── SixYaoDisplayTest.jsx    # 六爻显示测试组件
│   ├── calendarServiceTest.html   # 日历服务测试 HTML 文件
│   └── test_clear_button.jsx      # 清除按钮测试组件
├── 说明/                           # 说明文档
│   └── 圓运阁页顶部导航_设计说明.md  # 页面顶部导航设计说明
├── .gitignore                       # Git 忽略文件
├── README.md                        # 项目说明
├── jsconfig.json                    # JavaScript 配置
├── package.json                     # Node.js 依赖
└── package-lock.json                 # Node.js 依赖锁定
```

## 安装说明

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **进入前端目录**
```bash
cd frontend
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm start
```

前端应用将在 http://localhost:3000 启动

## 开发指南

### 开发环境搭建
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 开发规范

#### 命名规范
- **组件命名**：驼峰命名法，首字母大写
  - 示例：`Add`, `DivinationInfo`, `Footer`, `Header`
- **样式文件命名**：驼峰命名法，首字母大写
  - 示例：`Add.css`, `DivinationInfo.css`, `Footer.css`, `Header.css`
- **模块化样式文件命名**：驼峰命名法，首字母大写，后缀为 `.module.css`
  - 示例：`GanZhiSelector.module.css`, `DropdownColumn.module.css`

#### 代码注释
- **文件注释**：第一行添加文件路径和创建时间
  - 格式：`// 路径:[真实路径]/[带后缀的文件名] 时间:[YYYY-MM-DD HH:MM]`
  - 示例：`// 路径:frontend/src/components/Add/Add.jsx 时间:2026-02-15 16:40:00`
- **功能注释**：第二行添加文件功能
  - 格式：`// 功能:[文件简要功能（10-30字）]`
  - 示例：`// 功能:添加组件，用于添加卜筮信息`
- **代码注释**：逐行添加注释，注释内容与代码在同一行
  - 示例：`import React from 'react'  // 导入React库`

### 测试指南
```bash
# 运行测试（待实现）
npm test

# 运行测试并生成覆盖率报告（待实现）
npm test -- --coverage
```

## 部署指南

### 生产环境部署
1. **构建静态文件**
```bash
npm run build
```

2. **部署静态文件**
将 `build` 目录中的文件部署到 Web 服务器

### 环境变量配置
创建 `.env` 文件配置环境变量：
```env
REACT_APP_API_URL=http://localhost:8000
```

## API 服务

### 日历服务
- **文件名**：`calendarService.js`
- **功能**：提供日历转换 API 调用
- **方法**：
  - `solarToLunar`：公历转农历
  - `lunarToSolar`：农历转公历

### 六爻服务
- **文件名**：`liuyaoService.js`
- **功能**：提供六爻排盘 API 调用
- **方法**：
  - `generateRandomDigits`：生成随机数字
  - `generateThreeDigits`：生成三个随机数字
  - `generateJiazi`：生成随机六十甲子

## 组件说明

### 公共组件
- **Add**：添加组件，用于添加卜筮信息
- **DivinationInfo**：卜筮信息组件，用于显示卜筮结果
- **Footer**：页脚组件，用于显示页脚信息
- **Header**：导航头部组件，用于显示导航菜单

### 六爻组件
- **LiuYaoQiGua**：六爻起卦组件，用于起卦
- **LiuYaoReault**：六爻结果组件，用于显示卦象
- **NavigationSidebar**：导航侧边栏组件，用于显示六爻方法导航
- **MethodContent**：方法内容组件，用于显示起卦方法内容
- **NumberMethod**：数字方法组件，用于数字法起卦
- **OneClickMethod**：一键法组件，用于一键随机起卦
- **SpecifiedMethod**：指定法组件，用于指定数字起卦
- **StepByStepMethod**：一步法组件，用于逐步选择起卦

### 公共组件
- **SixYaoDisplay**：六爻显示组件，用于显示六爻卦象
- **YaoComponents**：爻组件，用于显示爻象

## 工具函数

### 四柱工具函数
- **文件名**：`fourPillarsUtils.js`
- **功能**：提供四柱相关的工具函数
- **方法**：
  - `formatGanZhi`：格式化干支
  - `calculateFourPillars`：计算四柱

### 验证工具函数
- **文件名**：`validationUtils.js`
- **功能**：提供验证相关的工具函数
- **方法**：
  - `validateSolarDate`：验证公历日期
  - `validateLunarDate`：验证农历日期
  - `validateGanZhi`：验证干支

## 文档

### 设计文档
- [页顶部导航设计说明](说明/圆运阁页顶部导航_设计说明.md)

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护者。

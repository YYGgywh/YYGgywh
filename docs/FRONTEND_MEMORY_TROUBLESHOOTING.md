# 前端服务内存问题排查方案
## 问题描述
前端服务启动需要设置 --max-old-space-size=8192 环境变量才能正常运行，否则会出现内存溢出或启动失败问题。

## 排查目标
1. 确定导致内存问题的根本原因
2. 提供具体的排查步骤
3. 给出优化建议和解决方案
4. 验证优化效果

## 排查工具准备

### 1. Node.js 工具
- **process.memoryUsage()**: Node.js 内存监控
- **heapdump**: 内存快照分析
- **node-heapdump**: 内存泄漏检测

### 2. 浏览器工具
- **Chrome DevTools**: 内存分析
- **Chrome Task Manager**: 进程监控
- **Performance 面板**: 性能分析

### 3. 项目工具
- **webpack-bundle-analyzer**: 打包体积分析
- **react-devtools**: React组件分析
- **npm list**: 依赖树分析
## 排查步骤

### 步骤1: 基础信息收集

#### 1.1 项目状态检查
`ash
cd f:\Project\YYG_paipan_Project\frontend

# 检查项目依赖
npm list --depth=0

# 检查 Node.js 版本
node --version
npm --version

# 检查当前进程状态
tasklist | findstr node
`

#### 1.2 启动日志收集
`ash
# 正常启动（带内存参数）
npm start

# 尝试无参数启动（会失败）
npm run start:no-memory
`

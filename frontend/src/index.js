/*
 * @file            frontend/src/index.js
 * @description     React应用入口文件，负责渲染App组件到DOM
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-16 13:35:00
 * @lastModified    2026-03-15 12:15:13
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import ReactDOM from 'react-dom/client'; // 导入ReactDOM的客户端渲染API
import App from './App'; // 导入应用主组件

/* 导入全局样式文件 - 按照优先级顺序引入 */
import './styles/variables.css';  // 统一的主题变量文件 - 必须最先引入
import './styles/elementColors.css';  // 五行颜色样式
import './styles/Reset.css';  // 全局CSS Reset和基础标准设置

/* 内存监控函数 - 暂时注释掉，避免在浏览器中打印内存监控信息
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  // Node.js 环境内存监控
  const formatMemoryUsage = (data) => {
    return `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
  };

  console.log('=== 项目启动内存监控 ===');
  const initialMem = process.memoryUsage();
  console.log(`初始内存使用:
  - 总内存: ${formatMemoryUsage(initialMem.rss)}
  - 堆内存: ${formatMemoryUsage(initialMem.heapTotal)}
  - 已使用: ${formatMemoryUsage(initialMem.heapUsed)}
  - 外部内存: ${formatMemoryUsage(initialMem.external)}
`);

  const monitorInterval = setInterval(() => {
    const mem = process.memoryUsage();
    console.log(`内存使用 (${new Date().toLocaleTimeString()}):
  - 总内存: ${formatMemoryUsage(mem.rss)}
  - 堆内存: ${formatMemoryUsage(mem.heapTotal)}
  - 已使用: ${formatMemoryUsage(mem.heapUsed)}
  - 外部内存: ${formatMemoryUsage(mem.external)}
  - 使用率: ${Math.round(mem.heapUsed / mem.heapTotal * 100)}%
`);
  }, 10000);

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(monitorInterval);
    });
  }
} else if (typeof window !== 'undefined' && window.performance) {
  // 浏览器环境内存监控
  console.log('=== 浏览器内存监控 ===');
  
  // 打印导航计时信息
  const perf = window.performance;
  const nav = perf.getEntriesByType('navigation')[0];
  if (nav) {
    console.log(`页面加载时间: ${Math.round(nav.loadEventEnd - nav.startTime)}ms`);
  }
  
  // 定期监控浏览器内存
  const browserMonitorInterval = setInterval(() => {
    if ('memory' in perf) {
      const mem = perf.memory;
      console.log(`浏览器内存 (${new Date().toLocaleTimeString()}):
  - 已使用: ${Math.round(mem.usedJSHeapSize / 1024 / 1024 * 100) / 100} MB
  - 总量: ${Math.round(mem.totalJSHeapSize / 1024 / 1024 * 100) / 100} MB
  - 限制: ${Math.round(mem.jsHeapSizeLimit / 1024 / 1024 * 100) / 100} MB
  - 使用率: ${Math.round(mem.usedJSHeapSize / mem.totalJSHeapSize * 100)}%
`);
    }
  }, 10000);
  
  window.addEventListener('beforeunload', () => {
    clearInterval(browserMonitorInterval);
  });
}
*/

const root = ReactDOM.createRoot(document.getElementById('root')); // 创建React根节点，绑定到DOM中的root元素
// 开始渲染React应用
root.render(
  <React.StrictMode> {/* 使用React严格模式，帮助检测潜在问题 */}
    <App /> {/* 渲染应用主组件 */}
  </React.StrictMode>
);
/*
 * @file            frontend/src/index.js
 * @description     React应用入口文件，负责渲染App组件到DOM
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-16 13:35:00
 * @lastModified    2026-02-16 14:08:02
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import ReactDOM from 'react-dom/client'; // 导入ReactDOM的客户端渲染API
import App from './App'; // 导入应用主组件

const root = ReactDOM.createRoot(document.getElementById('root')); // 创建React根节点，绑定到DOM中的root元素
// 开始渲染React应用
root.render(
  <React.StrictMode> {/* 使用React严格模式，帮助检测潜在问题 */}
    <App /> {/* 渲染应用主组件 */}
  </React.StrictMode>
);
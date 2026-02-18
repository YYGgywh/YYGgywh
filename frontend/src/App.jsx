/*
 * @file            frontend/src/App.jsx
 * @description     应用主组件，集成导航、内容和页脚
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-02-16 14:04:01
 * Copyright © All rights reserved
*/

import React, { Component } from 'react' // 导入React核心库和Component类
import './App.css' // 导入应用主样式文件

import Navigation from './components/Header/Navigation/Navigation' // 导入导航组件

import DivinationInfo from './components/DivinationInfo/DivinationInfo' // 导入占卜信息组件
import LiuYaoQiGua from './components/LiuYao/LiuYaoQiGua/LiuYaoQiGua' // 导入六爻起卦组件
import LiuYaoReault from './components/LiuYao/LiuYaoReault/LiuYaoReault' // 导入六爻结果组件
import { DivinationProvider } from './contexts/DivinationContext' // 导入占卜上下文提供者

// import Add from './components/Add/Add' // 导入添加组件
// import Footer from './components/Footer/Footer' // 导入页脚组件

// 定义App主组件类，继承自React.Component
export default class App extends Component {
  // 定义render方法，用于渲染组件
  render() {
    // 获取当前URL路径，用于路由判断
    const path = window.location.pathname;
    
    // 如果当前路径是'/divination-result'，显示结果页面
    if (path === '/divination-result') {
      // 返回结果页面的JSX结构
      return (
        <DivinationProvider> {/* 注释：使用DivinationProvider包裹，提供全局状态管理 */}
          <div className="app-container"> {/* 注释：应用容器div，设置class为app-container */}
            <header className="app-header"> {/* 注释：头部区域，设置class为app-header */}
              <Navigation /> {/* 注释：渲染导航组件 */}
            </header>            
            <main className="app-main"> {/* 注释：主内容区域，设置class为app-main */}
              <LiuYaoReault /> {/* 注释：渲染六爻结果组件 */}
            </main>
          </div>
        </DivinationProvider>
      );
    }
    
    // 默认返回主页面的JSX结构
    return (
      <DivinationProvider> {/* 注释：使用DivinationProvider包裹，提供全局状态管理 */}
        <div className="app-container"> {/* 注释：应用容器div，设置class为app-container */}
          <header className="app-header"> {/* 注释：头部区域，设置class为app-header */}
            <Navigation /> {/* 注释：渲染导航组件 */}
          </header>
          <main className="app-main"> {/* 注释：主内容区域，设置class为app-main */}
            <DivinationInfo /> {/* 注释：渲染占卜信息组件 */}
            <LiuYaoQiGua /> {/* 注释：渲染六爻起卦组件 */}
          </main>
        </div>
      </DivinationProvider>
    )
  }
}

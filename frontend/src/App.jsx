// 路径:src/App.jsx 时间:2026-02-10 10:00
// 功能:应用主组件，集成导航、内容和页脚
import React, { Component } from 'react'
import './App.css'
import Navigation from './components/Header/Navigation/Navigation'
import DivinationInfo from './components/DivinationInfo/DivinationInfo'
import LiuYaoQiGua from './components/LiuYao/LiuYaoQiGua/LiuYaoQiGua'
import LiuYaoReault from './components/LiuYao/LiuYaoReault/LiuYaoReault'
import { DivinationProvider } from './contexts/DivinationContext'



// import Add from './components/Add/Add'
// import Footer from './components/Footer/Footer'

export default class App extends Component {
  render() {
    // 简单的路由逻辑，根据 URL 路径显示不同的组件
    const path = window.location.pathname;
    
    if (path === '/divination-result') {
      return (
        <DivinationProvider>
          <div className="app-container">
            <header className="app-header">
              <Navigation />
            </header>
            <main className="app-main">
              <LiuYaoReault />
            </main>
          </div>
        </DivinationProvider>
      );
    }
    
    return (
      <DivinationProvider>
        <div className="app-container">
          <header className="app-header">
            <Navigation />
          </header>
          <main className="app-main">
            <DivinationInfo />
            <LiuYaoQiGua />
          </main>
        </div>
      </DivinationProvider>
    )
  }
}

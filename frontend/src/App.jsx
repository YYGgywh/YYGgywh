// 路径:src/App.jsx 时间:2026-01-27 16:35
// 功能:应用主组件，集成导航、内容和页脚
import React, { Component } from 'react'
import './App.css'
import Navigation from './components/Header/Navigation/Navigation'
import DivinationInfo from './components/DivinationInfo/DivinationInfo'
import LiuYaoQiGua from './components/LiuYao/LiuYaoQiGua/LiuYaoQiGua'



// import Add from './components/Add/Add'
// import Footer from './components/Footer/Footer'

export default class App extends Component {
  render() {
    return (
      <div className="app-container">
        <header className="app-header">
          <Navigation />
        </header>
        <main className="app-main">
          <DivinationInfo />
          <LiuYaoQiGua />
        </main>
      </div>
    )
  }
}

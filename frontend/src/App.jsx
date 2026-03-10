/*
 * @file            frontend/src/App.jsx
 * @description     应用主组件 - 集成导航、内容和页脚，使用 React Router 管理路由
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-03-07 18:49:30
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React from 'react'
// 导入 React Router 相关组件：BrowserRouter（路由器）、Routes（路由配置）、Route（单个路由）、Navigate（重定向组件）
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// 导入样式文件 - CSS Modules（桌面端样式）
import styles from './App.desktop.module.css'

// 导入导航栏组件 - 顶部导航菜单
import Navigation from './components/Header/Navigation/Navigation'
// 导入占卜信息组件 - 用于输入占卜相关信息
import DivinationInfo from './components/DivinationInfo/DivinationInfo'
// 导入六爻起卦组件 - 用于进行六爻排盘
import LiuYaoQiGua from './components/LiuYao/LiuYaoQiGua/LiuYaoQiGua'
// 导入六爻结果组件 - 用于显示六爻排盘结果
import LiuYaoReault from './components/LiuYao/LiuYaoReault/LiuYaoReault'
// 导入应用全局上下文提供者 - 用于全局状态管理
import { AppProvider } from './contexts/AppContext'
// 导入六爻排盘上下文提供者 - 用于六爻排盘相关的状态管理
import { LiuyaoProvider } from './contexts/LiuyaoContext'

// 导入页面组件
// 导入首页组件 - 瀑布流展示公开排盘记录
import HomePage from './pages/HomePage'
// 导入登录/注册页面组件 - 用户身份验证
import Login from './pages/Login/Login'
// 导入用户中心页面组件 - 用户个人信息管理
import UserCenter from './pages/User/UserCenter'

// 导入后台管理相关页面
// 导入后台管理上下文提供者和路由守卫 - 用于后台管理的权限控制
import { AdminProvider, AdminRouteGuard } from './contexts/AdminContext'
// 导入后台登录页面组件 - 管理员身份验证
import AdminLogin from './pages/Admin/AdminLogin'
// 导入后台布局组件 - 后台管理页面的统一布局
import AdminLayout from './pages/Admin/AdminLayout'
// 导入后台仪表盘页面组件 - 后台管理首页
import AdminDashboard from './pages/Admin/AdminDashboard'
// 导入用户管理页面组件 - 管理系统用户
import UserManagement from './pages/Admin/UserManagement'
// 导入排盘记录管理页面组件 - 管理排盘记录
import PanRecordManagement from './pages/Admin/PanRecordManagement'
// 导入评论管理页面组件 - 管理用户评论
import CommentManagement from './pages/Admin/CommentManagement'
// 导入敏感词管理页面组件 - 管理敏感词过滤
import SensitiveWordManagement from './pages/Admin/SensitiveWordManagement'
// 导入系统日志管理页面组件 - 查看系统操作日志
import SystemLogManagement from './pages/Admin/SystemLogManagement'
// 导入系统配置管理页面组件 - 配置系统参数
import SystemConfigManagement from './pages/Admin/SystemConfigManagement'

// 定义六爻排盘页面组件
// 这是一个组合组件，包含占卜信息输入和六爻起卦功能
const LiuYaoPage = () => (
  <div className={styles.appContainer}>
    <header className={styles.appHeader}>
      <Navigation />
    </header>
    <main className={styles.appMain}>
      <DivinationInfo />
      <LiuYaoQiGua />
    </main>
  </div>
);

// 定义结果页面组件
// 这是一个展示六爻排盘结果的页面
const ResultPage = () => (
  <div className={styles.appContainer}>
    <header className={styles.appHeader}>
      <Navigation />
    </header>
    <main className={styles.appMain}>
      <LiuYaoReault />
    </main>
  </div>
);

// 定义 App 主组件
// 这是应用的根组件，负责路由配置和全局状态管理
export default function App() {
  return (
    <AppProvider>
      <LiuyaoProvider>
        <AdminProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/divination/liuyao" element={<LiuYaoPage />} />
              <Route path="/divination-result" element={<ResultPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user" element={<UserCenter />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRouteGuard>
                  <AdminLayout />
                </AdminRouteGuard>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="pan-records" element={<PanRecordManagement />} />
                <Route path="comments" element={<CommentManagement />} />
                <Route path="sensitive-words" element={<SensitiveWordManagement />} />
                <Route path="logs" element={<SystemLogManagement />} />
                <Route path="config" element={<SystemConfigManagement />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AdminProvider>
      </LiuyaoProvider>
    </AppProvider>
  );
}

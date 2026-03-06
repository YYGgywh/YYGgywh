/*
 * @file            frontend/src/App.jsx
 * @description     应用主组件，集成导航、内容和页脚
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-02-27 14:11:54
 * Copyright © All rights reserved
*/

import React from 'react' // 导入React核心库
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom' // 导入路由相关组件
import './App.css' // 导入应用主样式文件

import Navigation from './components/Header/Navigation/Navigation' // 导入导航组件

import DivinationInfo from './components/DivinationInfo/DivinationInfo' // 导入占卜信息组件
import LiuYaoQiGua from './components/LiuYao/LiuYaoQiGua/LiuYaoQiGua' // 导入六爻起卦组件
import LiuYaoReault from './components/LiuYao/LiuYaoReault/LiuYaoReault' // 导入六爻结果组件
import { AppProvider } from './contexts/AppContext' // 导入应用全局上下文提供者
import { LiuyaoProvider } from './contexts/LiuyaoContext' // 导入六爻排盘上下文提供者

// 导入页面组件
import HomePage from './pages/HomePage' // 首页
import Login from './pages/Login/Login' // 登录/注册页面
import UserCenter from './pages/User/UserCenter' // 用户中心页面

// 导入后台管理相关页面
import { AdminProvider, AdminRouteGuard } from './contexts/AdminContext'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import PanRecordManagement from './pages/Admin/PanRecordManagement'
import CommentManagement from './pages/Admin/CommentManagement'
import SensitiveWordManagement from './pages/Admin/SensitiveWordManagement'
import SystemLogManagement from './pages/Admin/SystemLogManagement'
import SystemConfigManagement from './pages/Admin/SystemConfigManagement'

// 定义六爻排盘页面组件
const LiuYaoPage = () => (
  <div className="app-container">
    <header className="app-header">
      <Navigation />
    </header>
    <main className="app-main">
      <DivinationInfo />
      <LiuYaoQiGua />
    </main>
  </div>
);

// 定义结果页面组件
const ResultPage = () => (
  <div className="app-container">
    <header className="app-header">
      <Navigation />
    </header>
    <main className="app-main">
      <LiuYaoReault />
    </main>
  </div>
);

// 定义App主组件
export default function App() {
  return (
    <AppProvider>
      <LiuyaoProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* 前台路由 */}
              <Route path="/" element={<HomePage />} />
              <Route path="/divination/liuyao" element={<LiuYaoPage />} />
              <Route path="/divination-result" element={<ResultPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user" element={<UserCenter />} />
              
              {/* 后台管理路由 */}
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

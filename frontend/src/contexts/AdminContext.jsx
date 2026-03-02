/*
 * @file            frontend/src/contexts/AdminContext.jsx
 * @description     后台管理全局状态管理
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 11:00:00
 * Copyright © All rights reserved
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getBackendToken, setBackendToken, removeBackendToken, getBackendUserInfo, setBackendUserInfo } from '../utils/storage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getBackendToken();
    const userInfo = getBackendUserInfo();
    
    if (token) {
      try {
        if (userInfo) {
          setAdminUser(userInfo);
        } else {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userData = {
            id: payload.user_id,
            phone: payload.phone,
            role: payload.role
          };
          setAdminUser(userData);
          setBackendUserInfo(userData);
        }
      } catch (error) {
        console.error('Token解析失败:', error);
        removeBackendToken();
        setAdminUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token, user) => {
    setBackendToken(token);
    setBackendUserInfo(user);
    setAdminUser(user);
  };

  const logout = () => {
    removeBackendToken();
    setAdminUser(null);
  };

  return (
    <AdminContext.Provider value={{ adminUser, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminRouteGuard = ({ children }) => {
  const { adminUser, isLoading } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>加载中...</div>;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};


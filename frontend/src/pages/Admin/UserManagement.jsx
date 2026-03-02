/*
 * @file            frontend/src/pages/Admin/UserManagement.jsx
 * @description     用户管理页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getUserList, getUserDetail, updateUser, deleteUser, getDeletedUserList, restoreUser, permanentDeleteUser, updateUserPassword, updateAdminPassword } from '../../api/adminApi';
import { useAdmin } from '../../contexts/AdminContext';
import './UserManagement.css';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('active');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', status: '', role: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({ new_password: '', confirm_password: '' });
  const [adminPasswordFormData, setAdminPasswordFormData] = useState({ new_password: '', confirm_password: '' });
  const { adminUser: currentAdmin } = useAdmin();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'active') {
        const params = {
          page: pagination.page,
          page_size: pagination.page_size,
          keyword: filters.keyword || undefined
        };
        if (filters.status && filters.status !== '') {
          params.status = parseInt(filters.status);
        }
        if (filters.role && filters.role !== '') {
          params.role = parseInt(filters.role);
        }
        response = await getUserList(params);
      } else {
        const params = {
          page: pagination.page,
          page_size: pagination.page_size,
          keyword: filters.keyword || undefined
        };
        response = await getDeletedUserList(params);
      }
      
      if (response.success || response.code === 200) {
        setUsers(response.data.list || []);
        setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.page_size, filters, activeTab]);

  const handleViewDetail = async (userId) => {
    try {
      const response = await getUserDetail(userId);
      if (response.success || response.code === 200) {
        setSelectedUser(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('获取用户详情失败:', error);
    }
  };

  const handleEdit = async (userId) => {
    try {
      const response = await getUserDetail(userId);
      if (response.success || response.code === 200) {
        setEditFormData(response.data);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('获取用户详情失败:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateUser(editFormData.id, editFormData);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUser(userId, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('更新用户角色失败:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('确定要删除该用户吗？')) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const handleRestore = async (userId) => {
    if (!window.confirm('确定要恢复该用户吗？')) return;
    try {
      await restoreUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('恢复用户失败:', error);
    }
  };

  const handlePermanentDelete = async (userId) => {
    if (!window.confirm('⚠️ 警告：此操作将永久删除该用户，无法恢复！\n确定要继续吗？')) return;
    try {
      await permanentDeleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('永久删除用户失败:', error);
    }
  };

  const handleChangePassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      alert('用户不存在');
      return;
    }
    
    setSelectedUser(user);
    setPasswordFormData({ new_password: '', confirm_password: '' });
    setShowPasswordModal(true);
  };

  const handleChangeAdminPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      alert('用户不存在');
      return;
    }
    
    setSelectedUser(user);
    setAdminPasswordFormData({ new_password: '', confirm_password: '' });
    setShowAdminPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!selectedUser) return;
    
    if (!passwordFormData.new_password || !passwordFormData.confirm_password) {
      alert('请输入新密码和确认密码');
      return;
    }
    
    if (passwordFormData.new_password.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      alert('两次输入的密码不一致');
      return;
    }
    
    try {
      await updateUserPassword(selectedUser.id, passwordFormData.new_password);
      setShowPasswordModal(false);
      alert('前台密码修改成功');
      fetchUsers();
    } catch (error) {
      console.error('修改密码失败:', error);
      alert('修改密码失败，请重试');
    }
  };

  const handleAdminPasswordSubmit = async () => {
    if (!selectedUser) return;
    
    if (!adminPasswordFormData.new_password || !adminPasswordFormData.confirm_password) {
      alert('请输入新密码和确认密码');
      return;
    }
    
    if (adminPasswordFormData.new_password.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    
    if (adminPasswordFormData.new_password !== adminPasswordFormData.confirm_password) {
      alert('两次输入的密码不一致');
      return;
    }
    
    try {
      await updateAdminPassword(selectedUser.id, adminPasswordFormData.new_password);
      setShowAdminPasswordModal(false);
      alert('后台密码修改成功');
      fetchUsers();
    } catch (error) {
      console.error('修改后台密码失败:', error);
      alert('修改后台密码失败，请重试');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  const getRoleText = (role) => {
    const roles = { 0: '普通用户', 1: '管理员', 99: '超级管理员' };
    return roles[role] || '普通用户';
  };

  const getGenderText = (gender) => {
    const genders = { 0: '未知', 1: '男', 2: '女' };
    return genders[gender] || '未知';
  };

  const getStatusText = (status) => {
    return status === 1 ? '正常' : '禁用';
  };

  // 检查是否有查看权限
  const canViewUser = (user) => {
    if (!currentAdmin) return false;
    // 超级管理员可以查看所有人
    if (currentAdmin.role === 99) return true;
    // 普通管理员不能查看超级管理员
    if (user.role === 99) return false;
    // 普通管理员可以查看其他所有人（包括同级管理员和普通用户）
    return true;
  };

  // 检查是否有删除权限
  const canDeleteUser = (user) => {
    if (!currentAdmin) return false;
    // 不能删除自己
    if (user.id === currentAdmin.id) return false;
    // 超级管理员可以删除所有人（除了自己）
    if (currentAdmin.role === 99) return true;
    // 普通管理员只能删除普通用户（role=0），不能删除超级管理员和同级管理员
    return user.role === 0;
  };

  // 检查是否有编辑权限
  const canEditUser = (user) => {
    if (!currentAdmin) return false;
    // 超级管理员可以编辑所有人
    if (currentAdmin.role === 99) return true;
    // 普通管理员只能编辑普通用户（role=0），不能编辑超级管理员和同级管理员
    return user.role === 0;
  };

  // 检查是否有修改密码权限
  const canChangePassword = (user) => {
    if (!currentAdmin) return false;
    // 超级管理员可以修改所有人的密码
    if (currentAdmin.role === 99) return true;
    // 普通管理员只能修改普通用户（role=0）的密码，不能修改超级管理员和同级管理员的密码
    return user.role === 0;
  };

  // 检查是否有修改后台密码权限
  const canChangeAdminPassword = (user) => {
    if (!currentAdmin) return false;
    // 超级管理员可以修改所有人的后台密码
    if (currentAdmin.role === 99) return true;
    // 普通管理员只能修改普通用户（role=0）的后台密码，不能修改超级管理员和同级管理员的后台密码
    return user.role === 0;
  };

  // 检查是否有永久删除权限
  const canPermanentDelete = (user) => {
    if (!currentAdmin) return false;
    // 只有超级管理员可以永久删除
    return currentAdmin.role === 99;
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>用户管理</h2>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => { setActiveTab('active'); setPagination({ page: 1, page_size: 20, total: 0 }); }}
        >
          正常用户
        </button>
        <button
          className={`tab-btn ${activeTab === 'deleted' ? 'active' : ''}`}
          onClick={() => { setActiveTab('deleted'); setPagination({ page: 1, page_size: 20, total: 0 }); }}
        >
          已删除用户
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="filter-bar">
          <input
            type="text"
            placeholder="搜索手机号/昵称/登录名"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="filter-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="1">正常</option>
            <option value="0">禁用</option>
          </select>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="filter-select"
          >
            <option value="">全部角色</option>
            <option value="0">普通用户</option>
            <option value="1">管理员</option>
            <option value="99">超级管理员</option>
          </select>
          <button onClick={fetchUsers} className="filter-btn">搜索</button>
        </div>
      )}

      {activeTab === 'deleted' && (
        <div className="filter-bar">
          <input
            type="text"
            placeholder="搜索手机号/昵称/登录名"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="filter-input"
          />
          <button onClick={fetchUsers} className="filter-btn">搜索</button>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>手机号</th>
              <th>登录名</th>
              <th>昵称</th>
              <th>角色</th>
              {activeTab === 'active' && <th>状态</th>}
              <th>注册时间</th>
              {activeTab === 'deleted' && <th>删除时间</th>}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={activeTab === 'active' ? 9 : 8} className="loading-cell">加载中...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={activeTab === 'active' ? 9 : 8} className="empty-cell">暂无数据</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.phone}</td>
                  <td>{user.login_name || '-'}</td>
                  <td>{user.nickname || '-'}</td>
                  <td>{getRoleText(user.role)}</td>
                  {activeTab === 'active' && (
                    <td>
                      <span className={`status-badge ${user.status === 1 ? 'active' : 'inactive'}`}>
                        {getStatusText(user.status)}
                      </span>
                      <button
                        onClick={() => handleStatusChange(user.id, user.status === 1 ? 0 : 1)}
                        className="small-btn"
                      >
                        {user.status === 1 ? '禁用' : '启用'}
                      </button>
                    </td>
                  )}
                  <td>{formatTime(user.create_time)}</td>
                  {activeTab === 'deleted' && <td>{formatTime(user.deleted_at)}</td>}
                  <td>
                    {activeTab === 'active' && (
                      <>
                        <button 
                          onClick={() => handleViewDetail(user.id)} 
                          className="small-btn"
                          disabled={!canViewUser(user)}
                          title={!canViewUser(user) ? '无权查看此用户' : ''}
                        >
                          查看
                        </button>
                        <button 
                          onClick={() => handleEdit(user.id)} 
                          className="small-btn"
                          disabled={!canEditUser(user)}
                          title={!canEditUser(user) ? '无权编辑此用户' : ''}
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => handleChangePassword(user.id)} 
                          className="small-btn"
                          disabled={!canChangePassword(user)}
                          title={!canChangePassword(user) ? '无权修改此用户密码' : ''}
                        >
                          修改前台密码
                        </button>
                        {user.role >= 1 && (
                          <button 
                            onClick={() => handleChangeAdminPassword(user.id)} 
                            className="small-btn"
                            disabled={!canChangeAdminPassword(user)}
                            title={!canChangeAdminPassword(user) ? '无权修改此用户后台密码' : ''}
                          >
                            修改后台密码
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="small-btn danger"
                          disabled={!canDeleteUser(user)}
                          title={user.id === currentAdmin?.id ? '不能删除自己' : !canDeleteUser(user) ? '无权删除此用户' : ''}
                        >
                          删除
                        </button>
                      </>
                    )}
                    {activeTab === 'deleted' && (
                      <>
                        <button 
                          onClick={() => handleRestore(user.id)} 
                          className="small-btn"
                          disabled={!canEditUser(user)}
                          title={!canEditUser(user) ? '无权恢复此用户' : ''}
                        >
                          恢复
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(user.id)} 
                          className="small-btn danger"
                          disabled={!canPermanentDelete(user)}
                          title={!canPermanentDelete(user) ? '只有超级管理员可以永久删除用户' : ''}
                        >
                          永久删除
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          上一页
        </button>
        <span>第 {pagination.page} 页 / 共 {Math.ceil(pagination.total / pagination.page_size)} 页</span>
        <button
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.page_size)}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          下一页
        </button>
      </div>

      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>用户详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>基本信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>{selectedUser.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>手机号:</label>
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>登录名:</label>
                    <span>{selectedUser.login_name || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>昵称:</label>
                    <span>{selectedUser.nickname || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>邮箱:</label>
                    <span>{selectedUser.email || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>微信OpenID:</label>
                    <span>{selectedUser.wechat_openid || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>性别:</label>
                    <span>{getGenderText(selectedUser.gender)}</span>
                  </div>
                  <div className="detail-item">
                    <label>角色:</label>
                    <span>{getRoleText(selectedUser.role)}</span>
                  </div>
                  <div className="detail-item">
                    <label>状态:</label>
                    <span>{getStatusText(selectedUser.status)}</span>
                  </div>
                  <div className="detail-item">
                    <label>激活状态:</label>
                    <span>{selectedUser.is_active ? '已激活' : '未激活'}</span>
                  </div>
                  <div className="detail-item">
                    <label>老用户标记:</label>
                    <span>{selectedUser.is_old_user ? '是' : '否'}</span>
                  </div>
                  {selectedUser.role >= 1 && (
                    <div className="detail-item">
                      <label>后台密码设置:</label>
                      <span>{selectedUser.has_admin_password ? '已设置' : '未设置'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-section">
                <h4>出生信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>日历类型:</label>
                    <span>{selectedUser.birth_calendar_type === 0 ? '公历' : '农历'}</span>
                  </div>
                  <div className="detail-item">
                    <label>出生年月日:</label>
                    <span>{selectedUser.birth_year ? `${selectedUser.birth_year}年${selectedUser.birth_month}月${selectedUser.birth_day}日` : '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>出生时辰:</label>
                    <span>{selectedUser.birth_hour ? `${selectedUser.birth_hour}时${selectedUser.birth_minute}分${selectedUser.birth_second}秒` : '-'}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>登录信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>注册时间:</label>
                    <span>{formatTime(selectedUser.create_time)}</span>
                  </div>
                  <div className="detail-item">
                    <label>最后登录:</label>
                    <span>{formatTime(selectedUser.last_login_time)}</span>
                  </div>
                  <div className="detail-item">
                    <label>最后登录IP:</label>
                    <span>{selectedUser.last_login_ip || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>登录次数:</label>
                    <span>{selectedUser.login_count || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>登录名管理</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>登录名修改次数:</label>
                    <span>{selectedUser.login_name_modify_count}</span>
                  </div>
                  <div className="detail-item">
                    <label>最后修改登录名时间:</label>
                    <span>{formatTime(selectedUser.login_name_modify_time)}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>系统信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>更新时间:</label>
                    <span>{formatTime(selectedUser.update_time)}</span>
                  </div>
                  <div className="detail-item">
                    <label>删除时间:</label>
                    <span>{selectedUser.deleted_at ? formatTime(selectedUser.deleted_at) : '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>头像:</label>
                    <span>{selectedUser.avatar ? <img src={selectedUser.avatar} style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> : '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>扩展信息:</label>
                    <span style={{ maxWidth: '300px', wordBreak: 'break-all' }}>{selectedUser.ext_info || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDetailModal(false)} className="modal-btn">关闭</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editFormData && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>编辑用户</h3>
              <button onClick={() => setShowEditModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>登录名</label>
                <input
                  type="text"
                  value={editFormData.login_name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, login_name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>昵称</label>
                <input
                  type="text"
                  value={editFormData.nickname || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>性别</label>
                <select
                  value={editFormData.gender || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, gender: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value={0}>未知</option>
                  <option value={1}>男</option>
                  <option value={2}>女</option>
                </select>
              </div>
              <div className="form-group">
                <label>角色</label>
                <select
                  value={editFormData.role || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, role: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value={0}>普通用户</option>
                  <option value={1}>管理员</option>
                  <option value={99}>超级管理员</option>
                </select>
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={editFormData.status || 1}
                  onChange={(e) => setEditFormData({ ...editFormData, status: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value={1}>正常</option>
                  <option value={0}>禁用</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="modal-btn">取消</button>
              <button onClick={handleEditSubmit} className="modal-btn primary">保存</button>
            </div>
          </div>
        </div>
      )}

      {showAdminPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowAdminPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>修改后台密码</h3>
              <button onClick={() => setShowAdminPasswordModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>用户</label>
                <input
                  type="text"
                  value={`${selectedUser.login_name} (${selectedUser.phone})`}
                  disabled
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>新密码</label>
                <input
                  type="password"
                  value={adminPasswordFormData.new_password}
                  onChange={(e) => setAdminPasswordFormData({ 
                    ...adminPasswordFormData, 
                    new_password: e.target.value 
                  })}
                  className="form-input"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div className="form-group">
                <label>确认密码</label>
                <input
                  type="password"
                  value={adminPasswordFormData.confirm_password}
                  onChange={(e) => setAdminPasswordFormData({ 
                    ...adminPasswordFormData, 
                    confirm_password: e.target.value 
                  })}
                  className="form-input"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAdminPasswordModal(false)} className="modal-btn">取消</button>
              <button onClick={handleAdminPasswordSubmit} className="modal-btn primary">确认修改</button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>修改前台密码</h3>
              <button onClick={() => setShowPasswordModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>用户</label>
                <input
                  type="text"
                  value={`${selectedUser.login_name} (${selectedUser.phone})`}
                  disabled
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>新密码</label>
                <input
                  type="password"
                  value={passwordFormData.new_password}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, new_password: e.target.value })}
                  className="form-input"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div className="form-group">
                <label>确认密码</label>
                <input
                  type="password"
                  value={passwordFormData.confirm_password}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, confirm_password: e.target.value })}
                  className="form-input"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPasswordModal(false)} className="modal-btn">取消</button>
              <button onClick={handlePasswordSubmit} className="modal-btn primary">确认修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

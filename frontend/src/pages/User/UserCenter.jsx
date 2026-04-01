/*
 * @file            frontend/src/pages/User/UserCenter.jsx
 * @description     用户中心页面组件，重构后采用两栏布局结构
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-30 15:12:22
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Header/Navigation/Navigation';
import {
  UserCenterLayout,
  SidebarNav,
  MainContentArea,
  UserProfileContent,
  PanRecordsContent,
  FollowContent,
  UserIcon,
  RecordIcon,
  FollowIcon
} from '../../components/UserCenter';
import MobileUserCenterLayout from '../../components/UserCenter/MobileUserCenter/MobileUserCenterLayout/MobileUserCenterLayout';
import PanDetailModal from '../../components/Modal/PanDetailModal';
import { listPan, getPanDetail, toggleLike, toggleCollect, deletePan } from '../../api/panApi';
import { isLoggedIn, removeToken, getUserInfo, setUserInfo as saveUserInfo } from '../../utils/storage';
import {
  updateUserInfo,
  uploadAvatar,
  getNicknameLimitInfo,
  getLoginNameLimitInfo,
  updateLoginName,
  getUserStats
} from '../../api/userApi';
import { panTypeToChinese } from '../../utils/methodMapping';

// 导航项配置
const NAV_ITEMS = [
  { id: 'userCenter', label: '用户中心', icon: UserIcon },
  { id: 'panRecords', label: '排盘记录', icon: RecordIcon },
  { id: 'followList', label: '关注列表', icon: FollowIcon }
];

const UserCenter = () => {
  const navigate = useNavigate();

  // 导航状态
  const [activeNav, setActiveNav] = useState('userCenter');
  // 设备状态
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  // 移动端内容标签
  const [activeContentTab, setActiveContentTab] = useState('记录');
  // 移动端记录类型
  const [activeRecordType, setActiveRecordType] = useState('六爻');

  // 设备检测
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检测
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 用户数据状态
  const [userInfo, setUserInfo] = useState(null);
  const [panRecords, setPanRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [selectedPanData, setSelectedPanData] = useState(null);

  // 编辑状态
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [editingLoginName, setEditingLoginName] = useState(false);
  const [newLoginName, setNewLoginName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // 限制信息状态
  const [nicknameLimitInfo, setNicknameLimitInfo] = useState(null);
  const [loginNameLimitInfo, setLoginNameLimitInfo] = useState(null);

  // 检查登录状态并初始化
  useEffect(() => {
    const initializeUserInfo = async () => {
      if (!isLoggedIn()) {
        navigate('/login');
        return;
      }
      const user = getUserInfo();
      if (user) {
        setUserInfo(user);
        setNewNickname(user.nickname || '');
        setNewLoginName(user.login_name || '');
        fetchNicknameLimitInfo();
        fetchLoginNameLimitInfo();
        
        // 获取用户统计数据
        try {
          const statsResponse = await getUserStats();
          const updatedUserInfo = {
            ...user,
            likes: statsResponse.data.likes || 0,
            post_likes: statsResponse.data.post_likes || 0,
            comment_likes: statsResponse.data.comment_likes || 0,
            mutual_follows: statsResponse.data.mutual_follows || 0,
            follows: statsResponse.data.follows || 0,
            followers: statsResponse.data.followers || 0
          };
          setUserInfo(updatedUserInfo);
          saveUserInfo(updatedUserInfo);
        } catch (err) {
          console.error('获取用户统计数据失败:', err);
        }
      }
    };
    
    initializeUserInfo();
  }, [navigate]);

  // 获取排盘记录
  useEffect(() => {
    if (isLoggedIn()) {
      fetchPanRecords();
    }
  }, [currentPage, pageSize]);

  // 获取昵称限制信息
  const fetchNicknameLimitInfo = async () => {
    try {
      const response = await getNicknameLimitInfo();
      setNicknameLimitInfo(response.data);
    } catch (err) {
      console.error('获取昵称修改限制信息失败:', err);
    }
  };

  // 获取登录名限制信息
  const fetchLoginNameLimitInfo = async () => {
    try {
      const response = await getLoginNameLimitInfo();
      setLoginNameLimitInfo(response.data);
    } catch (err) {
      console.error('获取登录名修改限制信息失败:', err);
    }
  };

  // 获取排盘记录
  const fetchPanRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listPan('liuyao', currentPage, pageSize);
      
      // 为每条记录获取完整数据
      const recordsWithDetails = await Promise.all(
        response.data.map(async (record) => {
          try {
            const detailResponse = await getPanDetail(record.id);
            const detailData = detailResponse.data;
            
            // 提取 formData 和 divinationData
            const formData = detailData.pan_params?.form_data || {};
            const divinationData = detailData.pan_result || {};
            
            // 提取交互相关数据
            const likeCount = detailData.like_count || 0;
            const collectCount = detailData.collect_count || 0;
            const commentCount = detailData.comment_count || 0;
            const viewCount = detailData.view_count || 0;
            const isLiked = detailData.is_liked || false;
            const isCollected = detailData.is_collected || false;
            
            // 处理用户信息
            const userNickname = detailData.user?.nickname || '匿名用户';
            const userAvatar = detailData.user?.avatar_url || '';
            const userId = detailData.user?.id || record.user_id || 0;
            
            return {
              ...record,
              formData,
              divinationData,
              like_count: likeCount,
              collect_count: collectCount,
              comment_count: commentCount,
              view_count: viewCount,
              is_liked: isLiked,
              is_collected: isCollected,
              user_nickname: userNickname,
              user_avatar: userAvatar,
              user_id: userId,
              audit_status: detailData.audit_status || 0
            };
          } catch (err) {
            console.error(`获取记录 ${record.id} 详情失败:`, err);
            return record;
          }
        })
      );
      
      setPanRecords(recordsWithDetails);
      setTotalPages(Math.ceil(recordsWithDetails.length / pageSize) || 1);
    } catch (err) {
      setError(err.message || '获取排盘记录失败');
      setPanRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  // 昵称编辑处理
  const handleNicknameEdit = () => setEditingNickname(true);
  const handleNicknameCancel = () => {
    setNewNickname(userInfo?.nickname || '');
    setEditingNickname(false);
  };
  const handleNicknameSave = async () => {
    try {
      await updateUserInfo({ nickname: newNickname });
      const updatedUserInfo = { ...userInfo, nickname: newNickname };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingNickname(false);
      fetchNicknameLimitInfo();
    } catch (err) {
      setError(err.message || '修改昵称失败');
    }
  };

  // 登录名编辑处理
  const handleLoginNameEdit = () => setEditingLoginName(true);
  const handleLoginNameCancel = () => {
    setNewLoginName(userInfo?.login_name || '');
    setEditingLoginName(false);
  };
  const handleLoginNameSave = async () => {
    try {
      await updateLoginName(newLoginName);
      const updatedUserInfo = { ...userInfo, login_name: newLoginName };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingLoginName(false);
      fetchLoginNameLimitInfo();
    } catch (err) {
      setError(err.message || '修改登录名失败');
    }
  };

  // 头像处理
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
  };
  const handleAvatarUpload = async (file) => {
    try {
      // 优先使用传递的文件参数，否则使用状态中的文件
      const uploadFile = file || avatarFile;
      if (!uploadFile) {
        setError('请选择要上传的头像');
        return;
      }
      const response = await uploadAvatar(uploadFile);
      const updatedUserInfo = { ...userInfo, avatar: response.data.avatar };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setAvatarFile(null);
    } catch (err) {
      setError(err.message || '头像上传失败');
    }
  };

  // 排盘记录处理
  const handleViewDetail = (record) => {
    // 打开详情弹窗
    setSelectedPanData(record);
    setShowModal(true);
  };
  
  // 处理弹窗关闭事件
  const handleModalClose = (updatedData) => {
    // 隐藏详情弹窗
    setShowModal(false);
    setSelectedPanData(null);
    
    // 如果弹窗中有数据更新，重新获取排盘记录以同步状态
    if (updatedData && updatedData.id) {
      fetchPanRecords();
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // 交互功能处理
  const handleLike = async (recordId) => {
    try {
      await toggleLike(recordId);
      // 重新获取排盘记录以更新状态
      fetchPanRecords();
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };
  
  const handleCollect = async (recordId) => {
    try {
      await toggleCollect(recordId);
      // 重新获取排盘记录以更新状态
      fetchPanRecords();
    } catch (err) {
      console.error('收藏失败:', err);
    }
  };
  
  const handleComment = (recordId) => {
    // 跳转到详情页或打开评论模态框
    navigate(`/divination-result/${recordId}#comments`);
  };
  
  const handleShare = (recordId) => {
    // 实现分享功能
    console.log('分享记录:', recordId);
  };

  // 删除排盘记录处理
  const handleDelete = async (recordId) => {
    // 确认弹窗
    if (!window.confirm('确定要删除这条排盘记录吗？删除后无法恢复。')) {
      return;
    }

    try {
      const response = await deletePan(recordId);
      if (response.code === 200) {
        // 删除成功，刷新列表
        fetchPanRecords();
        alert('删除成功！');
      } else {
        alert(response.msg || '删除失败');
      }
    } catch (err) {
      console.error('删除失败:', err);
      alert(err.message || '删除失败，请稍后重试');
    }
  };

  // 时间格式化
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  // 处理用户信息更新
  const handleUserInfoUpdate = (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
    saveUserInfo(updatedUserInfo);
  };

  // 渲染内容区域
  const renderContent = () => {
    switch (activeNav) {
      case 'userCenter':
        return (
          <UserProfileContent
            userInfo={userInfo}
            editingNickname={editingNickname}
            editingLoginName={editingLoginName}
            newNickname={newNickname}
            newLoginName={newLoginName}
            nicknameLimitInfo={nicknameLimitInfo}
            loginNameLimitInfo={loginNameLimitInfo}
            avatarFile={avatarFile}
            onNicknameEdit={handleNicknameEdit}
            onNicknameSave={handleNicknameSave}
            onNicknameCancel={handleNicknameCancel}
            onLoginNameEdit={handleLoginNameEdit}
            onLoginNameSave={handleLoginNameSave}
            onLoginNameCancel={handleLoginNameCancel}
            onNicknameChange={setNewNickname}
            onLoginNameChange={setNewLoginName}
            onAvatarChange={handleAvatarChange}
            onAvatarUpload={handleAvatarUpload}
            onUserInfoUpdate={handleUserInfoUpdate}
          />
        );
      case 'panRecords':
        return (
          <PanRecordsContent
            records={panRecords}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onViewDetail={handleViewDetail}
            onLike={handleLike}
            onCollect={handleCollect}
            onComment={handleComment}
            onShare={handleShare}
            onDelete={handleDelete}
            onRefresh={fetchPanRecords}
            formatTime={formatTime}
            panTypeToChinese={panTypeToChinese}
          />
        );
      case 'followList':
        return <FollowContent />;
      default:
        return null;
    }
  };

  // 处理移动端内容标签切换
  const handleContentTabChange = (tabId) => {
    setActiveContentTab(tabId);
  };

  // 处理移动端记录类型切换
  const handleRecordTypeChange = (typeId) => {
    setActiveRecordType(typeId);
  };

  return (
    <div className="user-center-page">
      <header className="user-center-header">
        <Navigation />
      </header>

      <div className="user-center-body">
        {isMobile ? (
          <MobileUserCenterLayout
            userInfo={userInfo}
            activeContentTab={activeContentTab}
            activeRecordType={activeRecordType}
            records={panRecords}
            onContentTabChange={handleContentTabChange}
            onRecordTypeChange={handleRecordTypeChange}
            onAvatarUpload={handleAvatarUpload}
            onProfileUpdate={handleUserInfoUpdate}
            onLogout={handleLogout}
            onRecordAction={(action, data) => {
              switch (action) {
                case 'view':
                  handleViewDetail(data);
                  break;
                case 'delete':
                  handleDelete(data);
                  break;
                default:
                  break;
              }
            }}
          />
        ) : (
          <UserCenterLayout
            sidebar={
              <SidebarNav
                items={NAV_ITEMS}
                activeId={activeNav}
                onNavClick={setActiveNav}
                onLogout={handleLogout}
              />
            }
            mainContent={
              <MainContentArea>
                {error && <div className="user-center-error">{error}</div>}
                {renderContent()}
              </MainContentArea>
            }
          />
        )}
      </div>

      {/* 排盘详情弹窗 */}
      <PanDetailModal
        isOpen={showModal}
        onClose={handleModalClose}
        data={selectedPanData}
      />
    </div>
  );
};

export default UserCenter;

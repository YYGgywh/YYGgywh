/*
 * @file            frontend/src/components/UserCenter/UserProfileContent/UserProfileContent.jsx
 * @description     用户中心内容组件，采用表格布局，包含基本信息和安全中心选项卡
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:48:00
 * @lastModified    2026-03-14 11:27:56
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import styles from './UserProfileContent.desktop.module.css';
import mobileStyles from './UserProfileContent.mobile.module.css';
import CalendarService from '../../../services/calendarService';
import { updateUserInfo, getNameLimitInfo, getGenderLimitInfo, getBirthTimeLimitInfo, getVirtualGenderLimitInfo } from '../../../api/userApi';
import Avatar from '../../common/Avatar';

// 选项卡配置
const TABS = [
  { id: 'basic', label: '基本信息' },
  { id: 'fortune', label: '命理信息' },
  { id: 'security', label: '安全中心' }
];

/**
 * 格式化时间戳
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
const formatTimestamp = (timestamp) => {
  if (timestamp === 0 || !timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 获取角色文本
 * @param {number} role - 角色值
 * @returns {string} 角色文本
 */
const getRoleText = (role) => {
  switch (role) {
    case 0:
      return '普通用户';
    case 1:
      return '管理员';
    case 2:
      return '超级管理员';
    default:
      return '-';
  }
};

/**
 * 获取性别文本
 * @param {number} gender - 性别值
 * @returns {string} 性别文本
 */
const getGenderText = (gender) => {
  if (gender === null || gender === undefined || gender === '') {
    return '-';
  }
  switch (parseInt(gender)) {
    case 0:
      return '男';
    case 1:
      return '女';
    case 2:
      return '保密';
    default:
      return '-';
  }
};

/**
 * 获取当前年度结束日期
 * @returns {string} 格式化后的日期字符串（xxxx年12月31日）
 */
const getYearEndDate = () => {
  const now = new Date();
  return `${now.getFullYear()}年12月31日`;
};

/**
 * 用户中心内容组件
 * @param {Object} props - 组件属性
 * @param {Object} props.userInfo - 用户信息对象
 * @param {boolean} props.editingNickname - 是否正在编辑昵称
 * @param {boolean} props.editingLoginName - 是否正在编辑登录名
 * @param {string} props.newNickname - 新昵称值
 * @param {string} props.newLoginName - 新登录名值
 * @param {Object} props.nicknameLimitInfo - 昵称修改限制信息
 * @param {Object} props.loginNameLimitInfo - 登录名修改限制信息
 * @param {File} props.avatarFile - 选中的头像文件
 * @param {Function} props.onNicknameEdit - 编辑昵称回调
 * @param {Function} props.onNicknameSave - 保存昵称回调
 * @param {Function} props.onNicknameCancel - 取消昵称编辑回调
 * @param {Function} props.onLoginNameEdit - 编辑登录名回调
 * @param {Function} props.onLoginNameSave - 保存登录名回调
 * @param {Function} props.onLoginNameCancel - 取消登录名编辑回调
 * @param {Function} props.onNicknameChange - 昵称输入变化回调
 * @param {Function} props.onLoginNameChange - 登录名输入变化回调
 * @param {Function} props.onAvatarChange - 头像选择回调
 * @param {Function} props.onAvatarUpload - 头像上传回调
 * @param {Function} props.onUserInfoUpdate - 用户信息更新回调
 */
const UserProfileContent = ({
  userInfo,
  editingNickname,
  editingLoginName,
  newNickname,
  newLoginName,
  nicknameLimitInfo,
  loginNameLimitInfo,
  avatarFile,
  onNicknameEdit,
  onNicknameSave,
  onNicknameCancel,
  onLoginNameEdit,
  onLoginNameSave,
  onLoginNameCancel,
  onNicknameChange,
  onLoginNameChange,
  onAvatarChange,
  onAvatarUpload,
  onUserInfoUpdate
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentStyles = isMobile ? mobileStyles : styles;
  
  // 性别编辑状态
  const [editingGender, setEditingGender] = useState(false);
  const [newGender, setNewGender] = useState('');
  const [genderError, setGenderError] = useState('');
  
  // 虚拟性别编辑状态
  const [editingVirtualGender, setEditingVirtualGender] = useState(false);
  const [newVirtualGender, setNewVirtualGender] = useState('');
  const [virtualGenderError, setVirtualGenderError] = useState('');
  
  // 处理性别编辑
  const handleGenderEdit = () => {
    setNewGender(userInfo.gender !== undefined && userInfo.gender !== null ? userInfo.gender.toString() : '');
    setEditingGender(true);
    setGenderError('');
  };
  
  // 处理性别保存
  const handleGenderSave = async () => {
    if (newGender === '') {
      setGenderError('请选择性别');
      return;
    }
    
    try {
      const response = await updateUserInfo({ gender: parseInt(newGender) });
      
      if (response.code === 200) {
        // 更新本地用户信息
        const updatedUserInfo = { ...userInfo, gender: parseInt(newGender) };
        if (onUserInfoUpdate) {
          onUserInfoUpdate(updatedUserInfo);
        }
        setEditingGender(false);
        setGenderError('');
        alert('性别修改成功');
      } else {
        setGenderError(response.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存性别失败:', error);
      setGenderError('网络错误，请稍后重试');
    }
  };
  
  // 处理性别取消
  const handleGenderCancel = () => {
    setEditingGender(false);
    setNewGender('');
    setGenderError('');
  };
  
  // 处理性别变化
  const handleGenderChange = (value) => {
    setNewGender(value);
    setGenderError('');
  };
  
  // 处理虚拟性别编辑
  const handleVirtualGenderEdit = async () => {
    await fetchVirtualGenderLimitInfo();
    if (!canModifyVirtualGender()) {
      alert('您已达到本年度虚拟性别修改次数上限（4次），请明年再试');
      return;
    }
    setNewVirtualGender(userInfo.virtual_gender !== undefined && userInfo.virtual_gender !== null ? userInfo.virtual_gender.toString() : '');
    setEditingVirtualGender(true);
    setVirtualGenderError('');
  };
  
  // 处理虚拟性别保存
  const handleVirtualGenderSave = async () => {
    if (newVirtualGender === '') {
      setVirtualGenderError('请选择虚拟性别');
      return;
    }
    
    try {
      const response = await updateUserInfo({ virtual_gender: parseInt(newVirtualGender) });
      
      if (response.code === 200) {
        // 更新本地用户信息
        const updatedUserInfo = { ...userInfo, virtual_gender: parseInt(newVirtualGender) };
        if (onUserInfoUpdate) {
          onUserInfoUpdate(updatedUserInfo);
        }
        setEditingVirtualGender(false);
        setVirtualGenderError('');
        alert('虚拟性别修改成功');
      } else {
        setVirtualGenderError(response.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存虚拟性别失败:', error);
      setVirtualGenderError('网络错误，请稍后重试');
    }
  };
  
  // 处理虚拟性别取消
  const handleVirtualGenderCancel = () => {
    setEditingVirtualGender(false);
    setNewVirtualGender('');
    setVirtualGenderError('');
  };
  
  // 处理虚拟性别变化
  const handleVirtualGenderChange = (value) => {
    setNewVirtualGender(value);
    setVirtualGenderError('');
  };
  
  // 姓名编辑状态
  const [editingName, setEditingName] = useState(false);
  const [newLastName, setNewLastName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // 处理姓名编辑
  const handleNameEdit = () => {
    setNewLastName(userInfo.last_name || '');
    setNewFirstName(userInfo.first_name || '');
    setEditingName(true);
    setNameError('');
  };
  
  // 处理姓名保存
  const handleNameSave = async () => {
    // 验证姓和名
    if (!newLastName.trim()) {
      setNameError('请输入姓');
      return;
    }
    if (!newFirstName.trim()) {
      setNameError('请输入名');
      return;
    }
    if (newLastName.length > 10) {
      setNameError('姓不能超过10个字符');
      return;
    }
    if (newFirstName.length > 10) {
      setNameError('名不能超过10个字符');
      return;
    }
    
    try {
      const response = await updateUserInfo({ 
        last_name: newLastName.trim(),
        first_name: newFirstName.trim()
      });
      
      if (response.code === 200) {
        // 更新本地用户信息
        const updatedUserInfo = { 
          ...userInfo, 
          last_name: newLastName.trim(),
          first_name: newFirstName.trim()
        };
        if (onUserInfoUpdate) {
          onUserInfoUpdate(updatedUserInfo);
        }
        setEditingName(false);
        setNameError('');
        alert('姓名修改成功');
      } else {
        setNameError(response.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存姓名失败:', error);
      setNameError('网络错误，请稍后重试');
    }
  };
  
  // 处理姓名取消
  const handleNameCancel = () => {
    setEditingName(false);
    setNewLastName('');
    setNewFirstName('');
    setNameError('');
  };
  
  // 生时编辑状态
  const [editingBirthTime, setEditingBirthTime] = useState(false);
  const [birthTimeData, setBirthTimeData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: ''
  });
  const [birthTimeError, setBirthTimeError] = useState('');
  
  // 处理生时编辑
  const handleBirthTimeEdit = () => {
    setBirthTimeData({
      year: userInfo.birth_year ? userInfo.birth_year.toString() : '',
      month: userInfo.birth_month ? userInfo.birth_month.toString().padStart(2, '0') : '',
      day: userInfo.birth_day ? userInfo.birth_day.toString().padStart(2, '0') : '',
      hour: userInfo.birth_hour !== undefined && userInfo.birth_hour !== null ? userInfo.birth_hour.toString().padStart(2, '0') : '',
      minute: userInfo.birth_minute !== undefined && userInfo.birth_minute !== null ? userInfo.birth_minute.toString().padStart(2, '0') : '',
      second: userInfo.birth_second !== undefined && userInfo.birth_second !== null ? userInfo.birth_second.toString().padStart(2, '0') : ''
    });
    setEditingBirthTime(true);
    setBirthTimeError('');
  };
  
  // 处理生时输入变化
  const handleBirthTimeChange = (field, value) => {
    // 只允许输入数字
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setBirthTimeData(prev => ({
      ...prev,
      [field]: numericValue
    }));
    setBirthTimeError('');
  };
  
  // 处理生时失去焦点 - 自动补零
  const handleBirthTimeBlur = (field) => {
    setBirthTimeData(prev => {
      const value = prev[field];
      if (!value) return prev;
      
      let paddedValue = value;
      if (field === 'year') {
        // 年份补零到4位
        paddedValue = value.padStart(4, '0');
      } else {
        // 其他字段补零到2位
        paddedValue = value.padStart(2, '0');
      }
      
      return {
        ...prev,
        [field]: paddedValue
      };
    });
  };
  
  // 验证生时数据
  const validateBirthTime = () => {
    const { year, month, day, hour, minute, second } = birthTimeData;
    
    if (!year || !month || !day) {
      return '请输入完整的年月日';
    }
    
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const hourNum = hour ? parseInt(hour) : 0;
    const minuteNum = minute ? parseInt(minute) : 0;
    const secondNum = second ? parseInt(second) : 0;
    
    // 验证年份范围
    if (yearNum < 1 || yearNum > 9999) {
      return '年份范围：0001-9999';
    }
    
    // 验证月份范围
    if (monthNum < 1 || monthNum > 12) {
      return '月份范围：01-12';
    }
    
    // 验证日期范围
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum < 1 || dayNum > daysInMonth) {
      return `日期范围：01-${daysInMonth}`;
    }
    
    // 验证小时范围
    if (hourNum < 0 || hourNum > 23) {
      return '小时范围：00-23';
    }
    
    // 验证分钟范围
    if (minuteNum < 0 || minuteNum > 59) {
      return '分钟范围：00-59';
    }
    
    // 验证秒范围
    if (secondNum < 0 || secondNum > 59) {
      return '秒范围：00-59';
    }
    
    return null;
  };
  
  // 处理生时保存
  const handleBirthTimeSave = async () => {
    const error = validateBirthTime();
    if (error) {
      setBirthTimeError(error);
      return;
    }
    
    try {
      const { year, month, day, hour, minute, second } = birthTimeData;
      const response = await updateUserInfo({
        birth_year: parseInt(year),
        birth_month: parseInt(month),
        birth_day: parseInt(day),
        birth_hour: parseInt(hour || '0'),
        birth_minute: parseInt(minute || '0'),
        birth_second: parseInt(second || '0')
      });
      
      if (response.code === 200) {
        // 更新本地用户信息
        const updatedUserInfo = { 
          ...userInfo, 
          birth_year: parseInt(year),
          birth_month: parseInt(month),
          birth_day: parseInt(day),
          birth_hour: parseInt(hour || '0'),
          birth_minute: parseInt(minute || '0'),
          birth_second: parseInt(second || '0')
        };
        if (onUserInfoUpdate) {
          onUserInfoUpdate(updatedUserInfo);
        }
        setEditingBirthTime(false);
        setBirthTimeError('');
        alert('生时修改成功');
      } else {
        setBirthTimeError(response.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存生时失败:', error);
      setBirthTimeError('网络错误，请稍后重试');
    }
  };
  
  // 处理生时取消
  const handleBirthTimeCancel = () => {
    setEditingBirthTime(false);
    setBirthTimeData({
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: ''
    });
    setBirthTimeError('');
  };
  
  // 各项命理信息修改限制状态（独立）
  const [nameLimitInfo, setNameLimitInfo] = useState({
    name_modify_count: 0,
    name_modify_time: 0,
    remaining_count: 2
  });
  const [genderLimitInfo, setGenderLimitInfo] = useState({
    gender_modify_count: 0,
    gender_modify_time: 0,
    remaining_count: 2
  });
  const [birthTimeLimitInfo, setBirthTimeLimitInfo] = useState({
    birth_time_modify_count: 0,
    birth_time_modify_time: 0,
    remaining_count: 2
  });
  const [virtualGenderLimitInfo, setVirtualGenderLimitInfo] = useState({
    virtual_gender_modify_count: 0,
    virtual_gender_modify_time: 0,
    remaining_count: 4
  });
  
  // 获取各项命理信息修改限制
  const fetchNameLimitInfo = async () => {
    try {
      const response = await getNameLimitInfo();
      if (response.code === 200) {
        setNameLimitInfo(response.data);
      }
    } catch (error) {
      console.error('获取姓名修改限制失败:', error);
    }
  };
  
  const fetchGenderLimitInfo = async () => {
    try {
      const response = await getGenderLimitInfo();
      if (response.code === 200) {
        setGenderLimitInfo(response.data);
      }
    } catch (error) {
      console.error('获取性别修改限制失败:', error);
    }
  };
  
  const fetchBirthTimeLimitInfo = async () => {
    try {
      const response = await getBirthTimeLimitInfo();
      if (response.code === 200) {
        setBirthTimeLimitInfo(response.data);
      }
    } catch (error) {
      console.error('获取生时修改限制失败:', error);
    }
  };
  
  const fetchVirtualGenderLimitInfo = async () => {
    try {
      const response = await getVirtualGenderLimitInfo();
      if (response.code === 200) {
        setVirtualGenderLimitInfo(response.data);
      }
    } catch (error) {
      console.error('获取虚拟性别修改限制失败:', error);
    }
  };
  
  // 检查是否可以修改某项命理信息
  const canModifyName = () => nameLimitInfo.remaining_count > 0;
  const canModifyGender = () => genderLimitInfo.remaining_count > 0;
  const canModifyBirthTime = () => birthTimeLimitInfo.remaining_count > 0;
  const canModifyVirtualGender = () => virtualGenderLimitInfo.remaining_count > 0;
  
  // 处理命理信息编辑（带独立限制检查）
  const handleFortuneEdit = async (editType) => {
    if (editType === 'name') {
      await fetchNameLimitInfo();
      if (!canModifyName()) {
        alert('您已达到本年度姓名修改次数上限（2次），请明年再试');
        return;
      }
      handleNameEdit();
    } else if (editType === 'gender') {
      await fetchGenderLimitInfo();
      if (!canModifyGender()) {
        alert('您已达到本年度性别修改次数上限（2次），请明年再试');
        return;
      }
      handleGenderEdit();
    } else if (editType === 'birthTime') {
      await fetchBirthTimeLimitInfo();
      if (!canModifyBirthTime()) {
        alert('您已达到本年度生时修改次数上限（2次），请明年再试');
        return;
      }
      handleBirthTimeEdit();
    }
  };
  
  // 组件挂载时获取各项限制信息
  useEffect(() => {
    fetchNameLimitInfo();
    fetchGenderLimitInfo();
    fetchBirthTimeLimitInfo();
    fetchVirtualGenderLimitInfo();
  }, []);

  if (!userInfo) {
    return <div className={currentStyles.userProfileEmpty}>加载用户信息...</div>;
  }

  // 渲染基本信息选项卡内容
  const renderBasicInfo = () => (
    <div className={currentStyles.profileTable}>
      {/* 头像行 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>头像</div>
        <div className={currentStyles.profileValue + ' ' + currentStyles.profileValueAvatar}>
          <Avatar 
            src={userInfo.avatar}
            alt="用户头像"
            size="xlarge"
            className={currentStyles.avatarPreview}
            nickname={userInfo.nickname || userInfo.login_name}
          />
        </div>
        <div className={currentStyles.profileAction}>
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            onChange={onAvatarChange}
            style={{ display: 'none' }}
          />
          <button
            className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
            onClick={() => document.getElementById('avatarInput').click()}
          >
            更换
          </button>
          {avatarFile && (
            <button
              className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnSuccess}
              onClick={onAvatarUpload}
            >
              保存
            </button>
          )}
        </div>
      </div>

      {/* UID */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>UID</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.id !== undefined && userInfo.id !== null ? userInfo.id : '-'}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 角色 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>角色</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{getRoleText(userInfo.role)}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 登录名 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>登录名</div>
        <div className={currentStyles.profileValue}>
          {editingLoginName ? (
            <div className={currentStyles.editMode}>
              <input
                type="text"
                value={newLoginName}
                onChange={(e) => onLoginNameChange(e.target.value)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onLoginNameChange('');
                  // 添加视觉反馈
                  const input = e.target;
                  input.style.borderColor = '#2196f3';
                  input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                  setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                  }, 500);
                }}
                className={currentStyles.editInput + ' ' + currentStyles.nameInput}
                maxLength="20"
                placeholder="请输入登录名"
              />
              {loginNameLimitInfo && (
                <span className={`${currentStyles.editHint} ${loginNameLimitInfo.remaining_count === 0 ? currentStyles.editHintExceeded : ''}`}>
                  {getYearEndDate()}前修改次数：{loginNameLimitInfo.login_name_modify_count}/4次
                  {loginNameLimitInfo.remaining_count === 0 && '（已达上限）'}
                </span>
              )}
            </div>
          ) : (
            <div className={currentStyles.valueWithLimit}>
              <span className={currentStyles.valueText}>{userInfo.login_name || '未设置'}</span>
              {loginNameLimitInfo && (
                <div className={currentStyles.limitInfoInline}>
                  <span className={`${currentStyles.limitText} ${loginNameLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                    {getYearEndDate()}前修改次数：{loginNameLimitInfo.login_name_modify_count}/4次
                    {loginNameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={currentStyles.profileAction}>
          {editingLoginName ? (
            <div className={currentStyles.actionGroup}>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={onLoginNameCancel}>
                取消
              </button>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={onLoginNameSave}>
                保存
              </button>
            </div>
          ) : (
            <button
              className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
              onClick={onLoginNameEdit}
              disabled={loginNameLimitInfo?.remaining_count === 0}
            >
              修改
            </button>
          )}
        </div>
      </div>

      {/* 昵称 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>昵称</div>
        <div className={currentStyles.profileValue}>
          {editingNickname ? (
            <div className={currentStyles.editMode}>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => onNicknameChange(e.target.value)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  onNicknameChange('');
                  // 添加视觉反馈
                  const input = e.target;
                  input.style.borderColor = '#2196f3';
                  input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                  setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                  }, 500);
                }}
                className={currentStyles.editInput + ' ' + currentStyles.nameInput}
                maxLength="20"
                placeholder="请输入昵称"
              />
              {nicknameLimitInfo && (
                <span className={`${currentStyles.editHint} ${nicknameLimitInfo.remaining_count === 0 ? currentStyles.editHintExceeded : ''}`}>
                  {getYearEndDate()}前修改次数：{nicknameLimitInfo.nickname_modify_count}/12次
                  {nicknameLimitInfo.remaining_count === 0 && '（已达上限）'}
                </span>
              )}
            </div>
          ) : (
            <div className={currentStyles.valueWithLimit}>
              <span className={currentStyles.valueText}>{userInfo.nickname || '未设置'}</span>
              {nicknameLimitInfo && (
                <div className={currentStyles.limitInfoInline}>
                  <span className={`${currentStyles.limitText} ${nicknameLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                    {getYearEndDate()}前修改次数：{nicknameLimitInfo.nickname_modify_count}/12次
                    {nicknameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={currentStyles.profileAction}>
          {editingNickname ? (
            <div className={currentStyles.actionGroup}>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={onNicknameCancel}>
                取消
              </button>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={onNicknameSave}>
                保存
              </button>
            </div>
          ) : (
            <button
              className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
              onClick={onNicknameEdit}
              disabled={nicknameLimitInfo?.remaining_count === 0}
            >
              修改
            </button>
          )}
        </div>
      </div>

      {/* 虚拟性别 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>虚拟性别</div>
        <div className={currentStyles.profileValue}>
          {editingVirtualGender ? (
            <div className={currentStyles.editMode}>
              <select
                value={newVirtualGender}
                onChange={(e) => handleVirtualGenderChange(e.target.value)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  handleVirtualGenderChange('');
                  // 添加视觉反馈
                  const select = e.target;
                  select.style.borderColor = '#2196f3';
                  select.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                  setTimeout(() => {
                    select.style.borderColor = '';
                    select.style.boxShadow = '';
                  }, 500);
                }}
                className={currentStyles.editInput + ' ' + currentStyles.editSelect}
              >
                <option value="">请选择</option>
                <option value="0">男</option>
                <option value="1">女</option>
                <option value="2">保密</option>
              </select>
              {virtualGenderError && (
                <span className={currentStyles.editHint + ' ' + currentStyles.editHintError}>{virtualGenderError}</span>
              )}
              <span className={`${currentStyles.editHint} ${virtualGenderLimitInfo.remaining_count === 0 ? currentStyles.editHintExceeded : ''}`}>
                {getYearEndDate()}前修改次数：{virtualGenderLimitInfo.virtual_gender_modify_count}/4次
                {virtualGenderLimitInfo.remaining_count === 0 && '（已达上限）'}
              </span>
            </div>
          ) : (
            <div className={currentStyles.valueWithLimit}>
              <span className={currentStyles.valueText}>
                {userInfo.virtual_gender !== undefined && userInfo.virtual_gender !== null ? getGenderText(userInfo.virtual_gender) : '-'}
              </span>
              <div className={currentStyles.limitInfoInline}>
                <span className={`${currentStyles.limitText} ${virtualGenderLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                  {getYearEndDate()}前修改次数：{virtualGenderLimitInfo.virtual_gender_modify_count}/4次
                  {virtualGenderLimitInfo.remaining_count === 0 && '（已达上限）'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={currentStyles.profileAction}>
          {editingVirtualGender ? (
            <div className={currentStyles.actionGroup}>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={handleVirtualGenderCancel}>
                取消
              </button>
              <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={handleVirtualGenderSave}>
                保存
              </button>
            </div>
          ) : (
            <button
              className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
              onClick={handleVirtualGenderEdit}
              disabled={virtualGenderLimitInfo.remaining_count === 0}
            >
              修改
            </button>
          )}
        </div>
      </div>

      {/* 创建时间 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>创建时间</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{formatTimestamp(userInfo.create_time)}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 更新时间 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>更新时间</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{formatTimestamp(userInfo.update_time)}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 登录时间 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>登录时间</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{formatTimestamp(userInfo.last_login_time)}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 登录IP */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>登录IP</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.last_login_ip || '-'}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>

      {/* 登录次数 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>登录次数</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.login_count || 0}</span>
        </div>
        <div className={currentStyles.profileAction}></div>
      </div>
    </div>
  );

  // 渲染命理信息选项卡内容
  const renderFortuneInfo = () => {
    // 处理出生公历信息 - 返回对象包含日期和时间
    const getSolarBirthTimeInfo = () => {
      const birthYear = userInfo.birth_year || 1900;
      const birthMonth = userInfo.birth_month || 1;
      const birthDay = userInfo.birth_day || 1;
      const birthHour = userInfo.birth_hour || 0;
      const birthMinute = userInfo.birth_minute || 0;
      const birthSecond = userInfo.birth_second || 0;
      // 格式化数字为2位
      const formatTwoDigits = (num) => num.toString().padStart(2, '0');
      
      // 构建公历日期字符串
      const solarDateString = `${birthYear}年${formatTwoDigits(birthMonth)}月${formatTwoDigits(birthDay)}日`;
      
      // 构建公历时间字符串
      const solarTimeString = `${formatTwoDigits(birthHour)}:${formatTwoDigits(birthMinute)}:${formatTwoDigits(birthSecond)}`;
      
      return { date: solarDateString, time: solarTimeString };
    };
    
    // 处理出生农历信息 - 返回对象包含日期和时间
    const getLunarBirthTimeInfo = () => {
      const birthYear = userInfo.birth_year || 1900;
      const birthMonth = userInfo.birth_month || 1;
      const birthDay = userInfo.birth_day || 1;
      const birthHour = userInfo.birth_hour || 0;
      const birthMinute = userInfo.birth_minute || 0;
      const birthSecond = userInfo.birth_second || 0;
      
      // 尝试获取农历信息
      try {
        const result = CalendarService.convertSolarToLunar({
          year: birthYear,
          month: birthMonth,
          day: birthDay,
          hour: birthHour,
          minute: birthMinute,
          second: birthSecond
        });
        
        if (result && result.success && result.data) {
          const lunarYear = result.data.lunar_year_in_GanZhi;
          const lunarMonth = result.data.lunar_month_in_Chinese;
          const lunarDay = result.data.lunar_day_in_Chinese;
          const lunarTime = result.data.lunar_time_Zhi;
          
          // 判断是否为子时，并区分早子时和晚子时
          let lunarTimeDisplay;
          if (lunarTime === '子') {
            // 23:00:00~23:59:59 → 晚子时
            if (birthHour === 23) {
              lunarTimeDisplay = '晚子时';
            }
            // 00:00:00~00:59:59 → 早子时
            else if (birthHour === 0) {
              lunarTimeDisplay = '早子时';
            }
            else {
              lunarTimeDisplay = `${lunarTime}时`;
            }
          }
          else {
            lunarTimeDisplay = `${lunarTime}时`;
          }
          
          return { date: `${lunarYear}年${lunarMonth}月${lunarDay}`, time: lunarTimeDisplay };
        }
      } catch (error) {
        console.error('获取农历信息失败:', error);
      }
      
      return { date: '-', time: '' };
    };
    

    
    return (
      <div className={currentStyles.profileTable}>
        {/* 网站说明内容 */}
        <div className={currentStyles.profileRow}>
          <div className={currentStyles.profileLabel}>说明</div>
          <div className={currentStyles.profileValue}>
            <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>以下内容为选择性填写项目，请用户尽量提供真实准确的个人信息。所填写的信息将被用于网站为注册用户生成个人命理排盘结果时进行数据提取与分析。请注意，此部分信息包含个人隐私敏感内容，网站承诺将采取合理的技术与管理措施保障信息安全与隐秘性。用户可根据自身意愿自主决定是否填写以及填写内容的真实性与完整性。</span>
          </div>
          <div className={currentStyles.profileAction}></div>
        </div>

        {/* 姓名 */}
        <div className={currentStyles.profileRow}>
          <div className={currentStyles.profileLabel}>姓名</div>
          <div className={currentStyles.profileValue}>
            {editingName ? (
              <div className={currentStyles.editMode}>
                <div className={currentStyles.nameInputs}>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      setNewLastName('');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="姓"
                    className={currentStyles.editInput + ' ' + currentStyles.nameInput}
                    maxLength={10}
                  />
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      setNewFirstName('');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="名"
                    className={currentStyles.editInput + ' ' + currentStyles.nameInput}
                    maxLength={10}
                  />
                </div>
                {nameError && (
                  <span className={currentStyles.editHint + ' ' + currentStyles.editHintError}>{nameError}</span>
                )}
              </div>
            ) : (
              <div className={currentStyles.valueWithLimit}>
                <span className={currentStyles.valueText}>
                  {userInfo.last_name && userInfo.first_name 
                    ? `${userInfo.last_name}${userInfo.first_name}` 
                    : '-'}
                </span>
                <div className={currentStyles.limitInfoInline}>
                  <span className={`${currentStyles.limitText} ${nameLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                    {getYearEndDate()}前修改次数：{nameLimitInfo.name_modify_count}/2次
                    {nameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={currentStyles.profileAction}>
            {editingName ? (
              <div className={currentStyles.actionGroup}>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={handleNameCancel}>
                  取消
                </button>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={handleNameSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
                onClick={() => handleFortuneEdit('name')}
                disabled={nameLimitInfo.remaining_count === 0}
              >
                修改
              </button>
            )}
          </div>
        </div>

        {/* 出生公历 */}
        <div className={currentStyles.profileRow}>
          <div className={currentStyles.profileLabel}>出生公历</div>
          <div className={currentStyles.profileValue}>
            {editingBirthTime ? (
              <div className={currentStyles.editMode}>
                <div className={currentStyles.birthTimeInputs}>
                  <input
                    type="text"
                    value={birthTimeData.year}
                    onChange={(e) => handleBirthTimeChange('year', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('year')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('year', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="年"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeYear}
                    maxLength={4}
                  />
                  <span className={currentStyles.birthTimeSeparator}>年</span>
                  <input
                    type="text"
                    value={birthTimeData.month}
                    onChange={(e) => handleBirthTimeChange('month', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('month')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('month', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="月"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeMonth}
                    maxLength={2}
                  />
                  <span className={currentStyles.birthTimeSeparator}>月</span>
                  <input
                    type="text"
                    value={birthTimeData.day}
                    onChange={(e) => handleBirthTimeChange('day', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('day')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('day', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="日"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeDay}
                    maxLength={2}
                  />
                  <span className={currentStyles.birthTimeSeparator}>日</span>
                  <input
                    type="text"
                    value={birthTimeData.hour}
                    onChange={(e) => handleBirthTimeChange('hour', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('hour')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('hour', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="时"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeHour}
                    maxLength={2}
                  />
                  <span className={currentStyles.birthTimeSeparator}>时</span>
                  <input
                    type="text"
                    value={birthTimeData.minute}
                    onChange={(e) => handleBirthTimeChange('minute', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('minute')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('minute', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="分"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeMinute}
                    maxLength={2}
                  />
                  <span className={currentStyles.birthTimeSeparator}>分</span>
                  <input
                    type="text"
                    value={birthTimeData.second}
                    onChange={(e) => handleBirthTimeChange('second', e.target.value)}
                    onBlur={() => handleBirthTimeBlur('second')}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      handleBirthTimeChange('second', '');
                      // 添加视觉反馈
                      const input = e.target;
                      input.style.borderColor = '#2196f3';
                      input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                      setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                      }, 500);
                    }}
                    placeholder="秒"
                    className={currentStyles.editInput + ' ' + currentStyles.birthTimeInput + ' ' + currentStyles.birthTimeSecond}
                    maxLength={2}
                  />
                  <span className={currentStyles.birthTimeSeparator}>秒</span>
                </div>
                {birthTimeError && (
                  <span className={currentStyles.editHint + ' ' + currentStyles.editHintError}>{birthTimeError}</span>
                )}
              </div>
            ) : (
              <div className={currentStyles.valueWithLimit}>
                <div className={currentStyles.fortuneTimeDisplay}>
                  <span className={currentStyles.datePart}>{getSolarBirthTimeInfo().date}</span>
                  <span className={currentStyles.timePart}>{getSolarBirthTimeInfo().time}</span>
                </div>
                <div className={currentStyles.limitInfoInline}>
                  <span className={`${currentStyles.limitText} ${birthTimeLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                    {getYearEndDate()}前修改次数：{birthTimeLimitInfo.birth_time_modify_count}/2次
                    {birthTimeLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={currentStyles.profileAction}>
            {editingBirthTime ? (
              <div className={currentStyles.actionGroup}>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={handleBirthTimeCancel}>
                  取消
                </button>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={handleBirthTimeSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
                onClick={() => handleFortuneEdit('birthTime')}
                disabled={birthTimeLimitInfo.remaining_count === 0}
              >
                修改
              </button>
            )}
          </div>
        </div>

        {/* 出生农历 */}
        <div className={currentStyles.profileRow}>
          <div className={currentStyles.profileLabel}>出生农历</div>
          <div className={currentStyles.profileValue}>
            <div className={currentStyles.fortuneTimeDisplay}>
              <span className={currentStyles.datePart}>{getLunarBirthTimeInfo().date}</span>
              <span className={currentStyles.timePart}>{getLunarBirthTimeInfo().time}</span>
            </div>
          </div>
          <div className={currentStyles.profileAction}></div>
        </div>

        {/* 性别 */}
        <div className={currentStyles.profileRow}>
          <div className={currentStyles.profileLabel}>性别</div>
          <div className={currentStyles.profileValue}>
            {editingGender ? (
              <div className={currentStyles.editMode}>
                <select
                  value={newGender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    handleGenderChange('');
                    // 添加视觉反馈
                    const select = e.target;
                    select.style.borderColor = '#2196f3';
                    select.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.2)';
                    setTimeout(() => {
                      select.style.borderColor = '';
                      select.style.boxShadow = '';
                    }, 500);
                  }}
                  className={currentStyles.editInput + ' ' + currentStyles.editSelect}
                >
                  <option value="">请选择</option>
                  <option value="0">男</option>
                  <option value="1">女</option>
                </select>
                {genderError && (
                  <span className={currentStyles.editHint + ' ' + currentStyles.editHintError}>{genderError}</span>
                )}
              </div>
            ) : (
              <div className={currentStyles.valueWithLimit}>
                <span className={currentStyles.valueText}>
                  {userInfo.gender !== undefined && userInfo.gender !== null ? getGenderText(userInfo.gender) : '-'}
                </span>
                <div className={currentStyles.limitInfoInline}>
                  <span className={`${currentStyles.limitText} ${genderLimitInfo.remaining_count === 0 ? currentStyles.limitTextExceeded : ''}`}>
                    {getYearEndDate()}前修改次数：{genderLimitInfo.gender_modify_count}/2次
                    {genderLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={currentStyles.profileAction}>
            {editingGender ? (
              <div className={currentStyles.actionGroup}>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextCancel} onClick={handleGenderCancel}>
                  取消
                </button>
                <button className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnTextSave} onClick={handleGenderSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className={currentStyles.actionBtn + ' ' + currentStyles.actionBtnPrimary}
                onClick={() => handleFortuneEdit('gender')}
                disabled={genderLimitInfo.remaining_count === 0}
              >
                修改
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染安全中心选项卡内容
  const renderSecurityCenter = () => (
    <div className={currentStyles.profileTable}>
      {/* 手机 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>手机</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.phone || '-'}</span>
        </div>
        <div className={currentStyles.profileAction}>
          <span className={currentStyles.actionHint}>暂不可修改</span>
        </div>
      </div>

      {/* 邮箱 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>邮箱</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.email || '-'}</span>
        </div>
        <div className={currentStyles.profileAction}>
          <span className={currentStyles.actionHint}>暂不可修改</span>
        </div>
      </div>

      {/* 微信 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>微信</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.wechat_openid ? '已绑定' : '未绑定'}</span>
        </div>
        <div className={currentStyles.profileAction}>
          <span className={currentStyles.actionHint}>暂不可修改</span>
        </div>
      </div>

      {/* 密码 */}
      <div className={currentStyles.profileRow}>
        <div className={currentStyles.profileLabel}>密码</div>
        <div className={currentStyles.profileValue}>
          <span className={currentStyles.valueText + ' ' + currentStyles.valueTextReadonly}>{userInfo.password ? '已设置' : '未设置'}</span>
        </div>
        <div className={currentStyles.profileAction}>
          <span className={currentStyles.actionHint}>暂不可修改</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={currentStyles.userProfileContent}>
      {/* 选项卡 */}
      <div className={currentStyles.profileTabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${currentStyles.profileTab} ${activeTab === tab.id ? currentStyles.profileTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 选项卡内容 */}
      <div className={currentStyles.profileTabContent}>
        {activeTab === 'basic' ? renderBasicInfo() : activeTab === 'fortune' ? renderFortuneInfo() : renderSecurityCenter()}
      </div>
    </div>
  );
};

export default UserProfileContent;

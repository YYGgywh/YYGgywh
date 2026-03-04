/*
 * @file            frontend/src/components/UserCenter/UserProfileContent.jsx
 * @description     用户中心内容组件，采用表格布局，包含基本信息和安全中心选项卡
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:48:00
 * @lastModified    2026-03-04 13:51:25
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import './UserProfileContent.css';
import CalendarService from '../../services/calendarService';
import { updateUserInfo, getNameLimitInfo, getGenderLimitInfo, getBirthTimeLimitInfo } from '../../api/userApi';

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
  
  // 性别编辑状态
  const [editingGender, setEditingGender] = useState(false);
  const [newGender, setNewGender] = useState('');
  const [genderError, setGenderError] = useState('');
  
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
  
  // 检查是否可以修改某项命理信息
  const canModifyName = () => nameLimitInfo.remaining_count > 0;
  const canModifyGender = () => genderLimitInfo.remaining_count > 0;
  const canModifyBirthTime = () => birthTimeLimitInfo.remaining_count > 0;
  
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
  }, []);

  if (!userInfo) {
    return <div className="user-profile-empty">加载用户信息...</div>;
  }

  // 渲染基本信息选项卡内容
  const renderBasicInfo = () => (
    <div className="profile-table">
      {/* 头像行 */}
      <div className="profile-row">
        <div className="profile-label">头像</div>
        <div className="profile-value profile-value--avatar">
          {userInfo.avatar ? (
            <img src={userInfo.avatar} alt="用户头像" className="avatar-preview" />
          ) : (
            <div className="avatar-preview avatar-preview--default">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#ccc"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <div className="profile-action">
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            onChange={onAvatarChange}
            style={{ display: 'none' }}
          />
          <button
            className="action-btn action-btn--primary"
            onClick={() => document.getElementById('avatarInput').click()}
          >
            更换
          </button>
          {avatarFile && (
            <button
              className="action-btn action-btn--success"
              onClick={onAvatarUpload}
            >
              保存
            </button>
          )}
        </div>
      </div>

      {/* UID */}
      <div className="profile-row">
        <div className="profile-label">UID</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.id !== undefined && userInfo.id !== null ? userInfo.id : '-'}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 角色 */}
      <div className="profile-row">
        <div className="profile-label">角色</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{getRoleText(userInfo.role)}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 登录名 */}
      <div className="profile-row">
        <div className="profile-label">登录名</div>
        <div className="profile-value">
          {editingLoginName ? (
            <div className="edit-mode">
              <input
                type="text"
                value={newLoginName}
                onChange={(e) => onLoginNameChange(e.target.value)}
                className="edit-input"
                maxLength="20"
                placeholder="请输入登录名"
              />
              {loginNameLimitInfo && (
                <span className={`edit-hint ${loginNameLimitInfo.remaining_count === 0 ? 'edit-hint--exceeded' : ''}`}>
                  {getYearEndDate()}前修改次数：{loginNameLimitInfo.login_name_modify_count}/4次
                  {loginNameLimitInfo.remaining_count === 0 && '（已达上限）'}
                </span>
              )}
            </div>
          ) : (
            <div className="value-with-limit">
              <span className="value-text">{userInfo.login_name || '未设置'}</span>
              {loginNameLimitInfo && (
                <div className="limit-info-inline">
                  <span className={`limit-text ${loginNameLimitInfo.remaining_count === 0 ? 'limit-text--exceeded' : ''}`}>
                    {getYearEndDate()}前修改次数：{loginNameLimitInfo.login_name_modify_count}/4次
                    {loginNameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="profile-action">
          {editingLoginName ? (
            <div className="action-group">
              <button className="action-btn action-btn--text-cancel" onClick={onLoginNameCancel}>
                取消
              </button>
              <button className="action-btn action-btn--text-save" onClick={onLoginNameSave}>
                保存
              </button>
            </div>
          ) : (
            <button
              className="action-btn action-btn--primary"
              onClick={onLoginNameEdit}
              disabled={loginNameLimitInfo?.remaining_count === 0}
            >
              修改
            </button>
          )}
        </div>
      </div>

      {/* 昵称 */}
      <div className="profile-row">
        <div className="profile-label">昵称</div>
        <div className="profile-value">
          {editingNickname ? (
            <div className="edit-mode">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => onNicknameChange(e.target.value)}
                className="edit-input"
                maxLength="20"
                placeholder="请输入昵称"
              />
              {nicknameLimitInfo && (
                <span className={`edit-hint ${nicknameLimitInfo.remaining_count === 0 ? 'edit-hint--exceeded' : ''}`}>
                  {getYearEndDate()}前修改次数：{nicknameLimitInfo.nickname_modify_count}/12次
                  {nicknameLimitInfo.remaining_count === 0 && '（已达上限）'}
                </span>
              )}
            </div>
          ) : (
            <div className="value-with-limit">
              <span className="value-text">{userInfo.nickname || '未设置'}</span>
              {nicknameLimitInfo && (
                <div className="limit-info-inline">
                  <span className={`limit-text ${nicknameLimitInfo.remaining_count === 0 ? 'limit-text--exceeded' : ''}`}>
                    {getYearEndDate()}前修改次数：{nicknameLimitInfo.nickname_modify_count}/12次
                    {nicknameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="profile-action">
          {editingNickname ? (
            <div className="action-group">
              <button className="action-btn action-btn--text-cancel" onClick={onNicknameCancel}>
                取消
              </button>
              <button className="action-btn action-btn--text-save" onClick={onNicknameSave}>
                保存
              </button>
            </div>
          ) : (
            <button
              className="action-btn action-btn--primary"
              onClick={onNicknameEdit}
              disabled={nicknameLimitInfo?.remaining_count === 0}
            >
              修改
            </button>
          )}
        </div>
      </div>

      {/* 创建时间 */}
      <div className="profile-row">
        <div className="profile-label">创建时间</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{formatTimestamp(userInfo.create_time)}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 更新时间 */}
      <div className="profile-row">
        <div className="profile-label">更新时间</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{formatTimestamp(userInfo.update_time)}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 登录时间 */}
      <div className="profile-row">
        <div className="profile-label">登录时间</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{formatTimestamp(userInfo.last_login_time)}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 登录IP */}
      <div className="profile-row">
        <div className="profile-label">登录IP</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.last_login_ip || '-'}</span>
        </div>
        <div className="profile-action"></div>
      </div>

      {/* 登录次数 */}
      <div className="profile-row">
        <div className="profile-label">登录次数</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.login_count || 0}</span>
        </div>
        <div className="profile-action"></div>
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
    
    // 处理性别显示
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
    
    return (
      <div className="profile-table">
        {/* 网站说明内容 */}
        <div className="profile-row">
          <div className="profile-label">说明</div>
          <div className="profile-value">
            <span className="value-text value-text--readonly">以下内容为选择性填写项目，请用户尽量提供真实准确的个人信息。所填写的信息将被用于网站为注册用户生成个人命理排盘结果时进行数据提取与分析。请注意，此部分信息包含个人隐私敏感内容，网站承诺将采取合理的技术与管理措施保障信息安全与隐秘性。用户可根据自身意愿自主决定是否填写以及填写内容的真实性与完整性。</span>
          </div>
          <div className="profile-action"></div>
        </div>

        {/* 姓名 */}
        <div className="profile-row">
          <div className="profile-label">姓名</div>
          <div className="profile-value">
            {editingName ? (
              <div className="edit-mode">
                <div className="name-inputs">
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
                    className="edit-input name-input"
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
                    className="edit-input name-input"
                    maxLength={10}
                  />
                </div>
                {nameError && (
                  <span className="edit-hint edit-hint--error">{nameError}</span>
                )}
              </div>
            ) : (
              <div className="value-with-limit">
                <span className="value-text">
                  {userInfo.last_name && userInfo.first_name 
                    ? `${userInfo.last_name}${userInfo.first_name}` 
                    : '-'}
                </span>
                <div className="limit-info-inline">
                  <span className={`limit-text ${nameLimitInfo.remaining_count === 0 ? 'limit-text--exceeded' : ''}`}>
                    {getYearEndDate()}前修改次数：{nameLimitInfo.name_modify_count}/2次
                    {nameLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="profile-action">
            {editingName ? (
              <div className="action-group">
                <button className="action-btn action-btn--text-cancel" onClick={handleNameCancel}>
                  取消
                </button>
                <button className="action-btn action-btn--text-save" onClick={handleNameSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className="action-btn action-btn--primary"
                onClick={() => handleFortuneEdit('name')}
                disabled={nameLimitInfo.remaining_count === 0}
              >
                修改
              </button>
            )}
          </div>
        </div>

        {/* 出生公历 */}
        <div className="profile-row">
          <div className="profile-label">出生公历</div>
          <div className="profile-value">
            {editingBirthTime ? (
              <div className="edit-mode">
                <div className="birth-time-inputs">
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
                    className="edit-input birth-time-input birth-time-year"
                    maxLength={4}
                  />
                  <span className="birth-time-separator">年</span>
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
                    className="edit-input birth-time-input birth-time-month"
                    maxLength={2}
                  />
                  <span className="birth-time-separator">月</span>
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
                    className="edit-input birth-time-input birth-time-day"
                    maxLength={2}
                  />
                  <span className="birth-time-separator">日</span>
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
                    className="edit-input birth-time-input birth-time-hour"
                    maxLength={2}
                  />
                  <span className="birth-time-separator">时</span>
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
                    className="edit-input birth-time-input birth-time-minute"
                    maxLength={2}
                  />
                  <span className="birth-time-separator">分</span>
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
                    className="edit-input birth-time-input birth-time-second"
                    maxLength={2}
                  />
                  <span className="birth-time-separator">秒</span>
                </div>
                {birthTimeError && (
                  <span className="edit-hint edit-hint--error">{birthTimeError}</span>
                )}
              </div>
            ) : (
              <div className="value-with-limit">
                <div className="fortune-time-display">
                  <span className="date-part">{getSolarBirthTimeInfo().date}</span>
                  <span className="time-part">{getSolarBirthTimeInfo().time}</span>
                </div>
                <div className="limit-info-inline">
                  <span className={`limit-text ${birthTimeLimitInfo.remaining_count === 0 ? 'limit-text--exceeded' : ''}`}>
                    {getYearEndDate()}前修改次数：{birthTimeLimitInfo.birth_time_modify_count}/2次
                    {birthTimeLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="profile-action">
            {editingBirthTime ? (
              <div className="action-group">
                <button className="action-btn action-btn--text-cancel" onClick={handleBirthTimeCancel}>
                  取消
                </button>
                <button className="action-btn action-btn--text-save" onClick={handleBirthTimeSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className="action-btn action-btn--primary"
                onClick={() => handleFortuneEdit('birthTime')}
                disabled={birthTimeLimitInfo.remaining_count === 0}
              >
                修改
              </button>
            )}
          </div>
        </div>

        {/* 出生农历 */}
        <div className="profile-row">
          <div className="profile-label">出生农历</div>
          <div className="profile-value">
            <div className="fortune-time-display">
              <span className="date-part">{getLunarBirthTimeInfo().date}</span>
              <span className="time-part">{getLunarBirthTimeInfo().time}</span>
            </div>
          </div>
          <div className="profile-action"></div>
        </div>

        {/* 性别 */}
        <div className="profile-row">
          <div className="profile-label">性别</div>
          <div className="profile-value">
            {editingGender ? (
              <div className="edit-mode">
                <select
                  value={newGender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="edit-input edit-select"
                >
                  <option value="">请选择</option>
                  <option value="0">男</option>
                  <option value="1">女</option>
                </select>
                {genderError && (
                  <span className="edit-hint edit-hint--error">{genderError}</span>
                )}
              </div>
            ) : (
              <div className="value-with-limit">
                <span className="value-text">
                  {userInfo.gender !== undefined && userInfo.gender !== null ? getGenderText(userInfo.gender) : '-'}
                </span>
                <div className="limit-info-inline">
                  <span className={`limit-text ${genderLimitInfo.remaining_count === 0 ? 'limit-text--exceeded' : ''}`}>
                    {getYearEndDate()}前修改次数：{genderLimitInfo.gender_modify_count}/2次
                    {genderLimitInfo.remaining_count === 0 && '（已达上限）'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="profile-action">
            {editingGender ? (
              <div className="action-group">
                <button className="action-btn action-btn--text-cancel" onClick={handleGenderCancel}>
                  取消
                </button>
                <button className="action-btn action-btn--text-save" onClick={handleGenderSave}>
                  保存
                </button>
              </div>
            ) : (
              <button
                className="action-btn action-btn--primary"
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
    <div className="profile-table">
      {/* 手机 */}
      <div className="profile-row">
        <div className="profile-label">手机</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.phone || '-'}</span>
        </div>
        <div className="profile-action">
          <span className="action-hint">暂不可修改</span>
        </div>
      </div>

      {/* 邮箱 */}
      <div className="profile-row">
        <div className="profile-label">邮箱</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.email || '-'}</span>
        </div>
        <div className="profile-action">
          <span className="action-hint">暂不可修改</span>
        </div>
      </div>

      {/* 微信 */}
      <div className="profile-row">
        <div className="profile-label">微信</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.wechat_openid ? '已绑定' : '未绑定'}</span>
        </div>
        <div className="profile-action">
          <span className="action-hint">暂不可修改</span>
        </div>
      </div>

      {/* 密码 */}
      <div className="profile-row">
        <div className="profile-label">密码</div>
        <div className="profile-value">
          <span className="value-text value-text--readonly">{userInfo.password ? '已设置' : '未设置'}</span>
        </div>
        <div className="profile-action">
          <span className="action-hint">暂不可修改</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-profile-content">
      {/* 选项卡 */}
      <div className="profile-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? 'profile-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 选项卡内容 */}
      <div className="profile-tab-content">
        {activeTab === 'basic' ? renderBasicInfo() : activeTab === 'fortune' ? renderFortuneInfo() : renderSecurityCenter()}
      </div>
    </div>
  );
};

export default UserProfileContent;

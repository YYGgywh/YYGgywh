/*
 * @file            frontend/src/components/DivinationInfo/DivinationInfo.jsx
 * @description     占卜信息收集表单，包含姓名、性别、生年、属地、占类、占题和时间戳
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-02-17 09:18:36
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react'; // 导入React核心库和Hooks
import './DivinationInfo.css'; // 导入占卜信息表单样式
import TimestampModal from './timestamp/TimestampModal'; // 导入时间戳设置弹窗组件
import { useDivination } from '../../contexts/DivinationContext'; // 导入占卜上下文Hook

// 定义占卜信息表单组件
const DivinationInfo = () => {
  const { formData, setFormData, setTimestamp } = useDivination(); // 从占卜上下文中获取表单数据和设置函数
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 定义占类下拉菜单打开状态，默认为false
  const [isTimestampModalOpen, setIsTimestampModalOpen] = useState(false); // 定义时间戳弹窗打开状态，默认为false
  const [submittedTimestamp, setSubmittedTimestamp] = useState(null); // 定义已提交的时间戳状态，默认为null
  const typeDropdownRef = useRef(null); // 定义占类下拉菜单引用
  const divinationTypes = ['财富', '职业', '婚恋', '官讼', '健康', '寻失', '出行', '射覆']; // 定义占类选项数组
  const genderOptions = ['男', '女']; // 定义性别选项数组
  // 定义表单输入变化处理函数
  const handleChange = (e) => {
    const { name, value } = e.target; // 从事件对象中获取字段名和值
    // 更新表单数据
    setFormData(prev => ({
      ...prev, // 保留原有数据
      [name]: value // 更新当前字段值
    })); // 结束表单数据更新
  }; // 结束表单输入变化处理函数
  // 定义占类选择处理函数
  const handleTypeSelect = (type) => {
    // 更新表单数据
    setFormData(prev => ({
      ...prev, // 保留原有数据
      divinationType: type // 更新占类字段值
    })); // 结束表单数据更新
    setIsDropdownOpen(false); // 关闭占类下拉菜单
  }; // 结束占类选择处理函数
  // 定义下拉菜单切换函数
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // 切换下拉菜单打开状态
  }; // 结束下拉菜单切换函数
  // 定义性别选择处理函数
  const handleGenderSelect = (gender) => {
    // 更新表单数据
    setFormData(prev => ({
      ...prev, // 保留原有数据
      gender: gender // 更新性别字段值
    })); // 结束表单数据更新
  }; // 结束性别选择处理函数
  // 定义双击清空处理函数
  const handleDoubleClick = (fieldName) => {
    // 更新表单数据
    setFormData(prev => ({
      ...prev, // 保留原有数据
      [fieldName]: '' // 清空指定字段值
    })); // 结束表单数据更新
  }; // 结束双击清空处理函数
  // 定义生年输入变化处理函数
  const handleBirthYearChange = (e) => {
    let value = e.target.value; // 获取输入值
    value = value.replace(/\D/g, ''); // 只允许输入数字,移除非数字字符
    // 限制最大长度为4位
    if (value.length > 4) {
      value = value.slice(0, 4); // 截取前4位
    }
    // 限制最大值为9999
    if (value.length === 4 && parseInt(value) > 9999) {
      value = '9999'; // 设置为最大值
    }    
    // 如果输入完成（达到4位）或失去焦点时，不足4位补0
    if (value.length > 0 && value.length < 4) {
      // 更新表单数据，这里不立即补0，而是在失去焦点时补0
      setFormData(prev => ({
        ...prev, // 保留原有数据
        birthYear: value // 更新生年字段值
      })); // 结束表单数据更新
    }
    // 否则
    else {
      // 更新表单数据
      setFormData(prev => ({
        ...prev, // 保留原有数据
        birthYear: value // 更新生年字段值
      })); // 结束表单数据更新
    }
  }; // 结束生年输入变化处理函数

  // 定义生年失去焦点处理函数
  const handleBirthYearBlur = () => {
    let value = formData.birthYear; // 获取当前生年值
    
    // 如果有值且不足4位，补0
    if (value && value.length > 0 && value.length < 4) {
      value = value.padStart(4, '0'); // 在前面补0到4位
      
      // 如果补0后值为"0000"，则清空
      if (value === '0000') {
        // 更新表单数据
        setFormData(prev => ({
          ...prev, // 保留原有数据
          birthYear: '' // 清空生年字段值
        })); // 结束表单数据更新
      }
      // 否则
      else {
        // 更新表单数据
        setFormData(prev => ({
          ...prev, // 保留原有数据
          birthYear: value // 更新生年字段值
        })); // 结束表单数据更新
      }
    }
    // 如果输入的就是"0000"，也清空
    else if (value === '0000') {
      // 更新表单数据
      setFormData(prev => ({
        ...prev, // 保留原有数据
        birthYear: '' // 清空生年字段值
      })); // 结束表单数据更新
    }
  }; // 结束生年失去焦点处理函数
  // 定义时间戳点击处理函数
  const handleTimestampClick = () => {
    setIsTimestampModalOpen(true); // 打开时间戳弹窗
  }; // 结束时间戳点击处理函数

  // 定义关闭时间戳弹窗处理函数
  const closeTimestampModal = () => {
    setIsTimestampModalOpen(false); // 关闭时间戳弹窗
  }; // 结束关闭时间戳弹窗处理函数
  // 定义时间戳提交处理函数
  const handleTimestampSubmit = (timeData) => {
    setSubmittedTimestamp(timeData); // 设置已提交的时间戳
    setTimestamp(timeData); // 更新上下文中的时间戳
  }; // 结束时间戳提交处理函数

  // 定义表单提交处理函数
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    // 处理表单提交逻辑
    console.log('表单提交数据:', formData); // 打印表单数据到控制台
    // 这里可以添加API请求等逻辑
  }; // 结束表单提交处理函数

  // 监听点击事件，点击菜单外部时自动收起
  // 定义副作用Hook
  useEffect(() => {
    // 定义点击外部处理函数
    const handleClickOutside = (event) => {
      // 检查是否点击了占类下拉菜单外部
      // 检查点击目标是否在下拉菜单外部
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // 关闭占类下拉菜单
      }
    }; // 结束点击外部处理函数
    
    document.addEventListener('mousedown', handleClickOutside); // 添加事件监听器，添加鼠标按下事件监听
    
    // 清理函数：返回清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 移除鼠标按下事件监听
    }; // 结束清理函数
  }, []); // 空依赖数组，仅在组件挂载和卸载时执行

  // 定义获取当前时间戳函数
  const getCurrentTimestamp = () => {
    // 如果有提交的时间数据，返回提交的时间
    if (submittedTimestamp) {
      const { year, month, day, hour, minute, second } = submittedTimestamp; // 解构时间数据
      // 对月、日、时、分、秒进行补零处理
      const paddedMonth = String(month).padStart(2, '0'); // 月份补零到2位
      const paddedDay = String(day).padStart(2, '0'); // 日期补零到2位
      const paddedHour = String(hour).padStart(2, '0'); // 小时补零到2位
      const paddedMinute = String(minute).padStart(2, '0'); // 分钟补零到2位
      const paddedSecond = String(second).padStart(2, '0'); // 秒补零到2位
      return `公历：${year}年${paddedMonth}月${paddedDay}日 ${paddedHour}:${paddedMinute}:${paddedSecond}`; // 返回格式化的时间字符串
    }
    
    // 否则返回当前时间
    const now = new Date(); // 获取当前时间
    const year = now.getFullYear(); // 获取年份
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
    const day = String(now.getDate()).padStart(2, '0'); // 获取日期并补零
    const hours = String(now.getHours()).padStart(2, '0'); // 获取小时并补零
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 获取分钟并补零
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 获取秒数并补零

    return `公历：${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`; // 返回格式化的当前时间字符串
  }; // 结束获取当前时间戳函数

  // 返回JSX
  return (
    <div className="divination-info-container"> {/* 渲染占卜信息容器 */}
      <form className="divination-form" onSubmit={handleSubmit}> {/* 渲染表单元素，绑定提交事件 */}
        <div className="form-row"> {/* 渲染表单行 */}
          <input 
            type="text" // 设置输入类型为文本
            name="firstName" // 设置字段名为firstName
            placeholder="姓" // 设置占位符为姓
            value={formData.firstName} // 绑定姓字段值
            onChange={handleChange} // 绑定输入变化事件
            onDoubleClick={() => handleDoubleClick('firstName')} // 绑定双击清空事件
            className="first-name-input" // 设置CSS类名
          /> {/* 结束输入元素 */}
          <input 
            type="text" // 设置输入类型为文本
            name="lastName" // 设置字段名为lastName
            placeholder="名" // 设置占位符为名
            value={formData.lastName} // 绑定名字段值
            onChange={handleChange} // 绑定输入变化事件
            onDoubleClick={() => handleDoubleClick('lastName')} // 绑定双击清空事件
            className="last-name-input" // 设置CSS类名
          /> {/* 结束输入元素 */}
          <div className="gender-radio-container"> {/* 渲染性别单选容器 */}
            <label className="type-label"></label> {/* 渲染空标签 */}
            <div className="radio-group"> {/* 渲染单选按钮组 */}
              {/* 遍历性别选项数组 */}
              {genderOptions.map((gender) => (
                <label key={gender} className="radio-label" htmlFor={`gender-${gender}`}> {/* 渲染单选标签 */}
                  <input 
                    id={`gender-${gender}`} // 设置输入框ID
                    type="radio" // 设置输入类型为单选
                    name="gender" // 设置字段名为gender
                    value={gender} // 设置值为性别
                    checked={formData.gender === gender} // 绑定选中状态
                    onChange={(e) => handleGenderSelect(e.target.value)} // 绑定选择事件
                    className="radio-input" // 设置CSS类名
                  /> {/* 结束输入元素 */}
                  <span className="radio-custom"></span> {/* 渲染自定义单选按钮 */}
                  <span className="radio-text">{gender}</span> {/* 渲染性别文字 */}
                </label> // 结束单选标签
              ))} {/* 结束性别选项遍历 */}
            </div> {/* 结束单选按钮组 */}
          </div> {/* 结束性别单选容器 */}
          <input 
            type="number" // 设置输入类型为数字
            name="birthYear" // 设置字段名为birthYear
            placeholder="生年" // 设置占位符为生年
            value={formData.birthYear} // 绑定生年字段值
            onChange={handleBirthYearChange} // 绑定输入变化事件
            onBlur={handleBirthYearBlur} // 绑定失去焦点事件
            onDoubleClick={() => handleDoubleClick('birthYear')} // 绑定双击清空事件
            className="birth-year-input" // 设置CSS类名
            maxLength="4" // 设置最大长度为4
          /> {/* 结束输入元素 */}
          <input 
            type="text" // 设置输入类型为文本
            name="location" // 设置字段名为location
            placeholder="属地" // 设置占位符为属地
            value={formData.location} // 绑定属地字段值
            onChange={handleChange} // 绑定输入变化事件
            onDoubleClick={() => handleDoubleClick('location')} // 绑定双击清空事件
            className="location-input" // 设置CSS类名
          /> {/* 结束输入元素 */}
        </div> {/* 结束表单行 */}

        <div className="form-row"> {/* 渲染表单行 */}
          <div className="divination-type-container"> {/* 渲染占类容器 */}
            <label className="type-label"></label> {/* 渲染空标签 */}
            <div className="dropdown-container" ref={typeDropdownRef}> {/* 渲染下拉菜单容器，绑定引用 */}
              <div 
                className="dropdown-select" // 设置CSS类名
                onClick={toggleDropdown} // 绑定点击事件
              > {/* 结束下拉选择元素 */}
                {formData.divinationType || '占类'} {/* 显示占类或占类占位符 */}
                <span className="dropdown-arrow">▼</span> {/* 渲染下拉箭头 */}
              </div> {/* 结束下拉选择元素 */}
              {/* 如果下拉菜单打开 */}
              {isDropdownOpen && (
                <div className="dropdown-menu"> {/* 渲染下拉菜单 */}
                  {divinationTypes.map((type) => ( // 遍历占类选项数组
                    <div 
                      key={type} // 设置key为占类名称
                      className="dropdown-item" // 设置CSS类名
                      onClick={() => handleTypeSelect(type)} // 绑定点击事件
                    > {/* 结束下拉菜单项 */}
                      {type} {/* 渲染占类名称 */}
                    </div> // 结束下拉菜单项
                  ))} {/* 结束占类选项遍历 */}
                </div> // 结束下拉菜单
              )} {/* 结束下拉菜单条件渲染 */}
            </div> {/* 结束下拉菜单容器 */}
          </div> {/* 结束占类容器 */}
          <input 
            type="text" // 设置输入类型为文本
            name="subType" // 设置字段名为subType
            placeholder="自建子类" // 设置占位符为自建子类
            value={formData.subType} // 绑定自建子类字段值
            onChange={handleChange} // 绑定输入变化事件
            onDoubleClick={() => handleDoubleClick('subType')} // 绑定双击清空事件
            className="sub-type-input" // 设置CSS类名
          /> {/* 结束输入元素 */}
          <input 
            type="text" // 设置输入类型为文本
            name="question" // 设置字段名为question
            placeholder="占题（简要描述求占内容）" // 设置占位符为占题
            value={formData.question} // 绑定占题字段值
            onChange={handleChange} // 绑定输入变化事件
            onDoubleClick={() => handleDoubleClick('question')} // 绑定双击清空事件
            className="question-textarea" // 设置CSS类名
          /> {/* 结束输入元素 */}
        </div> {/* 结束表单行 */}

        <div className="form-row form-row-timestamp"> {/* 渲染时间戳表单行 */}
          <div 
            className="timestamp" // 设置CSS类名
            onClick={handleTimestampClick} // 绑定点击事件
          > {/* 结束时间戳元素 */}
            {getCurrentTimestamp()} {/* 渲染当前时间戳 */}
          </div> {/* 结束时间戳元素 */}
        </div> {/* 结束时间戳表单行 */}
      </form> {/* 结束表单元素 */}

      {/* 时间戳设置弹窗 */}
      {/* 如果时间戳弹窗打开 */}
      {isTimestampModalOpen && (
        <TimestampModal onClose={closeTimestampModal} onSubmit={handleTimestampSubmit} /> // 渲染时间戳弹窗组件
      )} {/* 结束时间戳弹窗条件渲染 */}
    </div> // 结束占卜信息容器
  ); // 结束return
}; // 结束组件定义

export default DivinationInfo; // 导出占卜信息表单组件作为默认导出
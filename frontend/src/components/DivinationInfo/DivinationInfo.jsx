// 路径:src/components/DivinationInfo/DivinationInfo.jsx 时间:2026-02-10 10:00
// 功能:占卜信息收集表单，包含姓名、性别、生年、属地、占类、占题和时间戳
import React, { useState, useRef, useEffect } from 'react';
import './DivinationInfo.css';
import TimestampModal from './timestamp/TimestampModal';
import { useDivination } from '../../contexts/DivinationContext';

const DivinationInfo = () => {
  const { formData, setFormData, setTimestamp } = useDivination();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTimestampModalOpen, setIsTimestampModalOpen] = useState(false);
  const [submittedTimestamp, setSubmittedTimestamp] = useState(null);

  const typeDropdownRef = useRef(null);

  const divinationTypes = ['财富', '职业', '婚恋', '官讼', '健康', '寻失', '出行', '射覆'];
  const genderOptions = ['男', '女'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      divinationType: type
    }));
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const handleTimestampClick = () => {
    setIsTimestampModalOpen(true);
  };

  const closeTimestampModal = () => {
    setIsTimestampModalOpen(false);
  };

  const handleTimestampSubmit = (timeData) => {
    setSubmittedTimestamp(timeData);
    setTimestamp(timeData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理表单提交逻辑
    console.log('表单提交数据:', formData);
    // 这里可以添加API请求等逻辑
  };

  // 监听点击事件，点击菜单外部时自动收起
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查是否点击了占类下拉菜单外部
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCurrentTimestamp = () => {
    // 如果有提交的时间数据，返回提交的时间
    if (submittedTimestamp) {
      const { year, month, day, hour, minute, second } = submittedTimestamp;
      // 对月、日、时、分、秒进行补零处理
      const paddedMonth = String(month).padStart(2, '0');
      const paddedDay = String(day).padStart(2, '0');
      const paddedHour = String(hour).padStart(2, '0');
      const paddedMinute = String(minute).padStart(2, '0');
      const paddedSecond = String(second).padStart(2, '0');
      return `公历：${year}年${paddedMonth}月${paddedDay}日 ${paddedHour}:${paddedMinute}:${paddedSecond}`;
    }
    
    // 否则返回当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `公历：${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="divination-info-container">
      <form className="divination-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input 
            type="text" 
            name="firstName" 
            placeholder="姓" 
            value={formData.firstName}
            onChange={handleChange}
            className="first-name-input"
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="名" 
            value={formData.lastName}
            onChange={handleChange}
            className="last-name-input"
          />
          <div className="gender-radio-container">
            <label className="type-label"></label>
            <div className="radio-group">
              {genderOptions.map((gender) => (
                <label key={gender} className="radio-label" htmlFor={`gender-${gender}`}>
                  <input 
                    id={`gender-${gender}`}
                    type="radio" 
                    name="gender" 
                    value={gender} 
                    checked={formData.gender === gender}
                    onChange={(e) => handleGenderSelect(e.target.value)}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">{gender}</span>
                </label>
              ))}
            </div>
          </div>
          <input 
            type="text" 
            name="birthYear" 
            placeholder="生年" 
            value={formData.birthYear}
            onChange={handleChange}
            className="birth-year-input"
          />
          <input 
            type="text" 
            name="location" 
            placeholder="属地" 
            value={formData.location}
            onChange={handleChange}
            className="location-input"
          />
        </div>

        <div className="form-row">
          <div className="divination-type-container">
            <label className="type-label"></label>
            <div className="dropdown-container" ref={typeDropdownRef}>
              <div 
                className="dropdown-select"
                onClick={toggleDropdown}
              >
                {formData.divinationType || '占类'}
                <span className="dropdown-arrow">▼</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {divinationTypes.map((type) => (
                    <div 
                      key={type}
                      className="dropdown-item"
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <input 
            type="text" 
            name="subType" 
            placeholder="自建子类" 
            value={formData.subType}
            onChange={handleChange}
            className="sub-type-input"
          />
          <input 
            type="text" 
            name="question" 
            placeholder="占题（简要描述求占内容）" 
            value={formData.question}
            onChange={handleChange}
            className="question-textarea"
          />
        </div>

        <div className="form-row form-row-timestamp">
          <div 
            className="timestamp"
            onClick={handleTimestampClick}
          >
            {getCurrentTimestamp()}
          </div>
        </div>
      </form>

      {/* 时间戳设置弹窗 */}
      {isTimestampModalOpen && (
        <TimestampModal onClose={closeTimestampModal} onSubmit={handleTimestampSubmit} />
      )}
    </div>
  );
};

export default DivinationInfo;
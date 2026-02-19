/*
 * @file            frontend/src/components/GenderSelector.jsx
 * @description     性别选择组件，提供男/女单选按钮
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 10:30:00
 * @lastModified    2026-02-18 20:11:11
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React库

// 性别选择组件
const GenderSelector = ({ selectedGender, onGenderChange }) => {
  const genderOptions = ['男', '女']; // 性别选项数组

  // 渲染性别选择组件
  return (
    <div className="gender-radio-container"> {/* 性别选择组件容器 */}
      <label className="type-label">性别：</label> {/* 性别选择组件标题 */}
      <div className="radio-group"> {/* 性别选择组件单选按钮组 */}
        {/* 性别选择组件单选按钮 */}
        {genderOptions.map((gender) => (
          <label key={gender} className="radio-label" htmlFor={`gender-${gender}`}> {/* 性别选择组件单选按钮标签 */}
            {/* 性别选择组件单选按钮 */}
            <input
              id={`gender-${gender}`} // 性别选择组件单选按钮ID
              type="radio" // 性别选择组件单选按钮类型
              name="gender" // 性别选择组件单选按钮名称
              value={gender} // 性别选择组件单选按钮值
              checked={selectedGender === gender} // 性别选择组件单选按钮是否选中
              onChange={(e) => onGenderChange(e.target.value)} // 性别选择组件单选按钮改变事件
              className="radio-input" // 性别选择组件单选按钮类名
            />
            <span className="radio-custom"></span> {/* 性别选择组件自定义单选按钮 */}
            <span className="radio-text">{gender}</span> {/* 性别选择组件单选按钮文本 */}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenderSelector; // 导出性别选择组件

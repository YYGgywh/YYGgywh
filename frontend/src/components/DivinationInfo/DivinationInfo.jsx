/*
 * @file            frontend/src/components/DivinationInfo/DivinationInfo.jsx
 * @description     占卜信息收集表单，包含姓名、性别、生年、属地、占类、占题和时间戳
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-02-18 20:28:29
 * Copyright © All rights reserved
*/

// 引入 React 核心钩子：useState 用于管理组件内部状态
import React, {
  useState   // 状态管理钩子，用于声明和更新组件内部状态
} from 'react';
import './DivinationInfo.css'; // 导入占卜信息表单样式
import TimestampModal from './timestamp/TimestampModal'; // 导入时间戳设置弹窗组件
import { useApp } from '../../contexts/AppContext'; // 导入应用全局上下文Hook
import FormInput from '../FormInput'; // 导入可复用的输入框组件
import GenderSelector from '../GenderSelector'; // 导入性别选择组件
import DivinationTypeDropdown from '../DivinationTypeDropdown'; // 导入占类下拉选择组件
import NumberInput from '../NumberInput'; // 导入通用数字输入组件
import TimestampDisplay from '../TimestampDisplay'; // 导入时间戳显示组件

// 定义占卜信息表单组件
const DivinationInfo = () => {
  const { formData, setFormData, setTimestamp } = useApp(); // 从应用全局上下文中获取表单数据和设置函数
  const [isTimestampModalOpen, setIsTimestampModalOpen] = useState(false); // 定义时间戳弹窗打开状态，默认为false
  const [submittedTimestamp, setSubmittedTimestamp] = useState(null); // 定义已提交的时间戳状态，默认为null

  // 提取通用的字段更新函数
  const updateField = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value })); // 使用函数式更新，基于前一个状态对象，创建新的状态对象，并更新指定字段的值
  };

  // 定义表单输入变化处理函数
  const handleChange = (e) => {
    const { name, value } = e.target; // 从事件对象中提取字段名和输入值
    updateField(name, value); // 调用通用更新函数，将新值写入对应字段
  };
  
  // 定义占类选择处理函数
  const handleTypeSelect = (type) => {
    updateField('divinationType', type); // 更新占类字段为选中的类型
  };

  // 定义性别选择处理函数
  const handleGenderSelect = (gender) => {
    updateField('gender', gender); // 更新性别字段为选中的性别值
  };

  // 定义双击清空处理函数
  const handleDoubleClick = (fieldName) => {
    updateField(fieldName, ''); // 更新指定字段为空字符串，实现双击清空效果
  };

  // 定义时间戳点击处理函数
  const handleTimestampClick = () => {
    setIsTimestampModalOpen(true); // 点击时间戳输入框时，打开时间戳弹窗
  };

  // 定义关闭时间戳弹窗处理函数
  const closeTimestampModal = () => {
    setIsTimestampModalOpen(false); // 点击弹窗外部或关闭按钮时，关闭时间戳弹窗
  };

  // 定义时间戳提交处理函数
  const handleTimestampSubmit = (timeData) => {
    setSubmittedTimestamp(timeData); // 更新已提交的时间戳状态为用户选择的时间
    setTimestamp(timeData); // 更新时间戳字段为用户选择的时间
  };

  // 定义表单提交处理函数
  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为，避免页面刷新
    console.log('表单提交数据:', formData); // 打印表单提交数据，用于调试
  };

  // 返回JSX
  return (
    <div className="divination-info-container"> {/* 包含整个占卜信息表单的容器 */}
      <form className="divination-form" onSubmit={handleSubmit}> {/* 占卜信息表单 */}
        <div className="form-row"> {/* 姓名行 */}
          {/* 姓输入框 */}
          <FormInput
            name="firstName" // 姓输入框的名称，用于表单提交时识别
            placeholder="姓" // 姓输入框的占位符
            value={formData.firstName} // 姓输入框的当前值，从表单数据中获取
            onChange={handleChange} // 姓输入框值改变时的处理函数，用于更新表单数据
            onDoubleClick={() => handleDoubleClick('firstName')} // 双击姓输入框时的处理函数，用于清空输入框
            className="first-name-input" // 姓输入框的类名，用于样式化
          />
          {/* 名输入框 */}
          <FormInput
            name="lastName" // 名输入框的名称，用于表单提交时识别
            placeholder="名" // 名输入框的占位符
            value={formData.lastName} // 名输入框的当前值，从表单数据中获取
            onChange={handleChange} // 名输入框值改变时的处理函数，用于更新表单数据
            onDoubleClick={() => handleDoubleClick('lastName')} // 双击名输入框时的处理函数，用于清空输入框
            className="last-name-input" // 名输入框的类名，用于样式化
          />

          <GenderSelector
            selectedGender={formData.gender}
            onGenderChange={handleGenderSelect}
          />
          <NumberInput
            name="birthYear"
            value={formData.birthYear}
            onChange={(value) => updateField('birthYear', value)}
            onBlur={(value) => updateField('birthYear', value)}
            onDoubleClick={() => handleDoubleClick('birthYear')}
            className="birth-year-input"
            maxLength={4}
            maxValue={9999}
            minValue={1}
            padLength={4}
            placeholder="生年"
          />
          {/* 月日输入框 */}
          <FormInput
            name="location" // 月日输入框的名称，用于表单提交时识别
            placeholder="属地" // 月日输入框的占位符
            value={formData.location} // 月日输入框的当前值，从表单数据中获取
            onChange={handleChange} // 月日输入框值改变时的处理函数，用于更新表单数据
            onDoubleClick={() => handleDoubleClick('location')} // 双击月日输入框时的处理函数，用于清空输入框
            className="location-input" // 月日输入框的类名，用于样式化
          />
        </div>

        <div className="form-row"> {/* 占类选择行 */}
          <DivinationTypeDropdown
            selectedType={formData.divinationType}
            onTypeSelect={handleTypeSelect}
          />
          {/* 自建子类输入框 */}
          <FormInput
            name="subType" // 自建子类输入框的名称，用于表单提交时识别
            placeholder="自建子类" // 自建子类输入框的占位符
            value={formData.subType} // 自建子类输入框的当前值，从表单数据中获取
            onChange={handleChange} // 自建子类输入框值改变时的处理函数，用于更新表单数据
            onDoubleClick={() => handleDoubleClick('subType')} // 双击自建子类输入框时的处理函数，用于清空输入框
            className="sub-type-input" // 自建子类输入框的类名，用于样式化
          />
          {/* 占题输入框 */}
          <FormInput
            name="question" // 占题输入框的名称，用于表单提交时识别
            placeholder="占题（简要描述求占内容）" // 占题输入框的占位符
            value={formData.question} // 占题输入框的当前值，从表单数据中获取
            onChange={handleChange} // 占题输入框值改变时的处理函数，用于更新表单数据
            onDoubleClick={() => handleDoubleClick('question')} // 双击占题输入框时的处理函数，用于清空输入框
            className="question-textarea" // 占题输入框的类名，用于样式化
          />
        </div>

        <div className="form-row form-row-timestamp"> {/* 占题时间戳行 */}
          <TimestampDisplay
            timestamp={submittedTimestamp}
            onClick={handleTimestampClick}
          />
        </div>
      </form>

      {/* 占题时间戳弹窗 */}
      {isTimestampModalOpen && (
        <TimestampModal onClose={closeTimestampModal} onSubmit={handleTimestampSubmit} /> //* 占题时间戳弹窗组件，显示当前时间戳并允许用户选择新时间戳
      )}
    </div>
  );
};

export default DivinationInfo; // 导出占卜信息表单组件作为默认导出
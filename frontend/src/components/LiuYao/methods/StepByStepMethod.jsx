/*
 * @file            frontend/src/components/LiuYao/methods/StepByStepMethod.jsx
 * @description     逐爻起卦组件，完全模拟传统六爻投掷三枚铜钱
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-29 10:00:00
 * @lastModified    2026-02-19 12:53:11
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import { getYaoComponent } from '../utils/yaoUtils';  // 导入爻组件工具函数
import '../LiuYaoQiGua/LiuYaoQiGua.css';  // 导入组件样式文件

/**
 * @description     逐爻起卦组件
 * @param           {Object}    yaoValues           爻值状态对象
 * @param           {Object}    yaoOddCounts        爻奇数计数状态对象
 * @param           {Function}  onThrow             投掷回调函数
 * @param           {Function}  onReset             重置回调函数
 * @param           {number}    currentYaoIndex     当前爻位索引
 * @param           {Array}     yaoOrder            爻位顺序数组
 * @param           {boolean}   isResetEnabled       是否启用重置按钮
 * @return          {JSX}                          逐爻起卦界面 JSX 元素
 */

// 定义 StepByStepMethod 组件
const StepByStepMethod = ({
  yaoValues,       // 爻值状态对象
  yaoOddCounts,    // 爻奇数计数状态对象
  onThrow,         // 投掷回调函数
  onReset,         // 重置回调函数
  currentYaoIndex, // 当前爻位索引
  yaoOrder,        // 爻位顺序数组
  isResetEnabled   // 是否启用重置按钮
}) => {

  /**
   * @description     获取按钮文字
   * @return          {string}                     按钮文字
   */

  // 定义获取按钮文字的函数
  const getButtonText = () => {
    // 如果所有爻位已完成
    if (currentYaoIndex >= 6) {
      return '投掷结束';  // 返回结束文字
    }
    // 获取当前爻位名称
    const currentYaoName = yaoOrder[currentYaoIndex];  // 获取当前爻位名称
    return `投掷${currentYaoName}爻`;  // 返回投掷当前爻位文字
  };

  const isButtonDisabled = currentYaoIndex >= 6;  // 如果所有爻位已完成，禁用按钮
  
  // 定义渲染逐爻起卦界面的函数
  return (
    <div className="step-by-step-method">  {/* 逐爻起卦容器 */}
      <div className="content-row">  {/* 内容行 */}
        <div className="liu-yao-info">  {/* 六爻信息区域 */}
          <h3>逐爻起卦：</h3>  {/* 标题 */}
          <p>完全模拟传统六爻投掷三枚铜钱阴阳属性，是首选的起卦方式。</p>  {/* 描述 */}
          <ol>  {/* 操作步骤列表 */}
            <li>诚心静默，排除杂念</li>  {/* 步骤1 */}
            <li>心念占事，点击投掷</li>  {/* 步骤2 */}
            <li>每投必缓，六掷卦成</li>  {/* 步骤3 */}
          </ol>
          <div className="divination-actions">  {/* 操作按钮区域 */}
            <button 
              className="throw-button"  // 按钮样式
              onClick={onThrow}  // 点击事件
              disabled={isButtonDisabled}  // 禁用状态
            >
              {getButtonText()}  {/* 按钮文字 */}
            </button>
            <button 
              className="reset-button"  // 按钮样式
              onClick={onReset}  // 点击事件
              disabled={!isResetEnabled}  // 禁用状态
            >
              重新投掷  {/* 按钮文字 */}
            </button>
        </div>
        </div>

        <div className="yao-display">  {/* 爻位显示区域 */}
          <div className="yao-item">  {/* 上爻项 */}
            <span className="yao-label">上爻：</span>  {/* 上爻标签 */}
            {/* 上爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.shang === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.shang === '待生成' ? '' : yaoValues.shang}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.shang)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 五爻项 */}
            <span className="yao-label">五爻：</span>  {/* 五爻标签 */}
            {/* 五爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.wu === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.wu === '待生成' ? '' : yaoValues.wu}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.wu)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 四爻项 */}
            <span className="yao-label">四爻：</span>  {/* 四爻标签 */}
            {/* 四爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.si === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.si === '待生成' ? '' : yaoValues.si}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.si)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 三爻项 */}
            <span className="yao-label">三爻：</span>  {/* 三爻标签 */}
            {/* 三爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.san === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.san === '待生成' ? '' : yaoValues.san}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.san)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 二爻项 */}
            <span className="yao-label">二爻：</span>  {/* 二爻标签 */}
            {/* 二爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.er === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.er === '待生成' ? '' : yaoValues.er}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.er)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 初爻项 */}
            <span className="yao-label">初爻：</span>  {/* 初爻标签 */}
            {/* 初爻输入框 */}
            <input 
              className={`yao-value ${yaoValues.chu === '待生成' ? 'yao-value-placeholder' : ''}`}  // 输入框样式
              placeholder="待生成"  // 占位符
              value={yaoValues.chu === '待生成' ? '' : yaoValues.chu}  // 输入值
              disabled  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.chu)}</div>  {/* 爻组件 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepByStepMethod;  // 导出逐爻起卦组件
/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/StepByStepMethod/StepByStepMethod.jsx
 * @description     逐爻起卦组件，完全模拟传统六爻投掷三枚铜钱
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-01-29 10:00:00
 * @lastModified    2026-03-09 12:55:05
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import commonStyles from '../MethodCommon.desktop.module.css';  // 导入通用样式文件
import YaoDisplay from '../../YaoComponents/YaoDisplay/YaoDisplay';  // 导入 YaoDisplay 组件
import ActionButton from '../../../../components/ActionButton/ActionButton';  // 导入 ActionButton 组件

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
    <div className={commonStyles.methodContainer}>  {/* 逐爻起卦容器 */}
      <div className={commonStyles.contentRow}>  {/* 内容行 */}
        <div className={commonStyles.liuYaoInfo}>  {/* 六爻信息区域 */}
          <div className={commonStyles.contentContainer}>  {/* 内容容器 */}
            <h3>逐爻起卦：</h3>  {/* 标题 */}
            <p>完全模拟传统六爻投掷三枚铜钱阴阳属性，是首选的起卦方式。</p>  {/* 描述 */}
            <ol>  {/* 操作步骤列表 */}
              <li>诚心静默，排除杂念。心念占事，勿作他想。</li>  {/* 步骤1 */}
              <li>点击投掷，每投必缓。六掷完毕，六爻卦成。</li>  {/* 步骤2 */}
            </ol>
          </div>
          <div className={commonStyles.divinationActions}>  {/* 操作按钮区域 */}
            <ActionButton
              type="primary"
              onClick={onThrow}
              disabled={isButtonDisabled}
              size="medium"
            >
              {getButtonText()}
            </ActionButton>
            <ActionButton
              type="secondary"
              onClick={onReset}
              disabled={!isResetEnabled}
              size="medium"
            >
              重新投掷
            </ActionButton>
          </div>
        </div>
        
        <YaoDisplay
          className={commonStyles.yaoDisplay}
          mode="display"
          yaoValues={yaoValues}
          yaoOddCounts={yaoOddCounts}
          currentYaoIndex={currentYaoIndex}
        />
      </div>
    </div>
  );
};

export default StepByStepMethod;  // 导出逐爻起卦组件

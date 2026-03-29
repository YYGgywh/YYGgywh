/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/StepByStepMethod/StepByStepMethod.jsx
 * @description     逐爻起卦组件，完全模拟传统六爻投掷三枚铜钱
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-01-29 10:00:00
 * @lastModified    2026-03-28 10:00:00
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import desktopStyles from '../MethodCommon.desktop.module.css';  // 导入桌面端通用样式文件
import mobileStyles from '../MethodCommon.mobile.module.css';  // 导入移动端通用样式文件
import YaoDisplay from '../../YaoComponents/YaoDisplay/YaoDisplay';  // 导入 YaoDisplay 组件
import ActionButton from '../../../../components/ActionButton/ActionButton';  // 导入 ActionButton 组件
import MethodDescription from '../MethodDescription/MethodDescription';  // 导入 MethodDescription 组件

/**
 * @description     逐爻起卦组件
 * @param           {boolean}   isMobile            是否为移动端
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
  isMobile,        // 是否为移动端
  yaoValues,       // 爻值状态对象
  yaoOddCounts,    // 爻奇数计数状态对象
  onThrow,         // 投掷回调函数
  onReset,         // 重置回调函数
  currentYaoIndex, // 当前爻位索引
  yaoOrder,        // 爻位顺序数组
  isResetEnabled   // 是否启用重置按钮
}) => {
  // 选择样式
  const currentStyles = isMobile ? mobileStyles : desktopStyles;

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
    <div className={currentStyles.methodContainer}>  {/* 逐爻起卦容器 */}
      {isMobile ? (
        <div className={currentStyles.contentRow}>  {/* 内容行 - 移动端 */}
          <MethodDescription
            title="逐爻起卦："
            description="完全模拟传统六爻投掷三枚铜钱阴阳属性，是首选的起卦方式。"
            steps={[
              "诚心静默，排除杂念。心念占事，勿作他想。",
              "点击投掷，每投必缓。六掷完毕，六爻卦成。"
            ]}
            className={currentStyles.contentContainer}
          />
          
          <YaoDisplay
            isMobile={isMobile}
            className={currentStyles.yaoDisplay}
            mode="display"
            yaoValues={yaoValues}
            yaoOddCounts={yaoOddCounts}
            currentYaoIndex={currentYaoIndex}
          />
          
          <ActionButton className={currentStyles.divinationActions}>
            <ActionButton
              type="primary"
              onClick={onThrow}
              disabled={isButtonDisabled}
            >
              {getButtonText()}
            </ActionButton>
            <ActionButton
              type="danger"
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              重新投掷
            </ActionButton>
          </ActionButton>
        </div>
      ) : (
        <div className={currentStyles.contentRow}>  {/* 内容行 - 桌面端 */}
          <div className={currentStyles.liuYaoInfo}>  {/* 六爻信息区域 */}
            <MethodDescription
              title="逐爻起卦："
              description="完全模拟传统六爻投掷三枚铜钱阴阳属性，是首选的起卦方式。"
              steps={[
                "诚心静默，排除杂念。心念占事，勿作他想。",
                "点击投掷，每投必缓。六掷完毕，六爻卦成。"
              ]}
              className={currentStyles.contentContainer}
            />
            <ActionButton className={currentStyles.divinationActions}>
              <ActionButton
                type="primary"
                onClick={onThrow}
                disabled={isButtonDisabled}
              >
                {getButtonText()}
              </ActionButton>
              <ActionButton
                type="danger"
                onClick={onReset}
                disabled={!isResetEnabled}
              >
                重新投掷
              </ActionButton>
            </ActionButton>
          </div>
          
          <YaoDisplay
            isMobile={isMobile}
            className={currentStyles.yaoDisplay}
            mode="display"
            yaoValues={yaoValues}
            yaoOddCounts={yaoOddCounts}
            currentYaoIndex={currentYaoIndex}
          />
        </div>
      )}
    </div>
  );
};

export default StepByStepMethod;  // 导出逐爻起卦组件

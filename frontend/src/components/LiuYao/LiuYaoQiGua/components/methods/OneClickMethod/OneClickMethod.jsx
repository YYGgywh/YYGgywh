/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/OneClickMethod/OneClickMethod.jsx
 * @description     一键成卦组件，快速生成完整卦象
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-02-08 12:10:00
 * @lastModified    2026-03-09 12:49:41
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import commonStyles from '../MethodCommon.desktop.module.css';  // 导入通用样式文件
import LiuYaoService from '../../../../../../services/liuyaoService';  // 导入六爻服务层
import YaoDisplay from '../../YaoComponents/YaoDisplay/YaoDisplay';  // 导入 YaoDisplay 组件
import ActionButton from '../../../../components/ActionButton/ActionButton';  // 导入 ActionButton 组件

/**
 * @description     一键成卦组件
 * @param           {Object}    yaoValues             爻值状态对象
 * @param           {Object}    yaoOddCounts          爻奇数计数状态对象
 * @param           {Function}  onReset               重置回调函数
 * @param           {Function}  onOneClickDivination   一键成卦回调函数
 * @param           {number}    currentYaoIndex        当前爻位索引
 * @param           {boolean}   isResetEnabled         是否启用重置按钮
 * @return          {JSX}                          一键成卦界面 JSX 元素
 */

// 定义一键成卦组件
const OneClickMethod = ({
  yaoValues, // 爻值状态对象
  yaoOddCounts, // 爻奇数计数状态对象
  onReset, // 重置回调函数
  onOneClickDivination, // 一键成卦回调函数
  currentYaoIndex, // 当前爻位索引
  isResetEnabled }) => { // 是否启用重置按钮

  /**
   * @description     处理一键成卦
   */

  // 处理一键成卦点击事件
  const handleOneClickDivination = async () => {

    console.log('执行一键成卦');  // 打印日志

    // 尝试执行
    try {
      // 1. 生成六个随机数字
      const digitsArray = await LiuYaoService.generateSixDigits();  // 调用服务生成六个数字

      console.log('生成的数字数组:', digitsArray);  // 打印生成的数字数组
      
      // 2. 前端计算奇偶、正背
      const yaoData = LiuYaoService.calculateYaoDataFromDigits(digitsArray);  // 调用服务计算爻位数据
      
      console.log('计算的爻位数据:', yaoData);  // 打印计算的爻位数据
      
      // 3. 更新UI状态
      await onOneClickDivination(yaoData.yaoValues, yaoData.yaoOddCounts, digitsArray);  // 调用父组件回调
    }
    // 捕获异常
    catch (error) {
      console.error('一键成卦失败:', error);  // 打印错误信息
    }
  };

  /**
   * @description     获取按钮文字
   * @return          {string}                    按钮文字
   */

  // 获取按钮文字
  const getButtonText = () => {
    // 如果当前爻位索引大于等于6
    if (currentYaoIndex >= 6) {
      return '起卦完成';  // 返回完成文字
    }
    return '一键成卦';  // 返回默认文字
  };
  
  const isButtonDisabled = currentYaoIndex >= 6;  // 按钮禁用状态
  
  // 渲染一键成卦组件
  return (
    <div className={commonStyles.methodContainer}>  {/* 一键成卦容器 */}
      <div className={commonStyles.contentRow}>  {/* 内容行 */}
        <div className={commonStyles.liuYaoInfo}>  {/* 六爻信息区域 */}
          <div className={commonStyles.contentContainer}>  {/* 内容容器 */}
            <h3>一键起卦：</h3>  {/* 标题 */}
            <p>快速生成完整卦象，适合初学者或需要快速起卦的场景。</p>  {/* 描述 */}
            <ol>  {/* 操作步骤列表 */}
              <li>诚心静默，排除杂念。</li>  {/* 步骤1 */}
              <li>心念占事，一键成卦。</li>  {/* 步骤2 */}
            </ol>
          </div>
          <div className={commonStyles.divinationActions}>  {/* 操作按钮区域 */}
            <ActionButton
              type="primary"
              onClick={handleOneClickDivination}
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
              重新起卦
            </ActionButton>
          </div>
        </div>
        
        <YaoDisplay
          className={commonStyles.yaoDisplay}
          mode="display"
          yaoValues={yaoValues}
          yaoOddCounts={yaoOddCounts}
          isOneClick={true}
        />
      </div>
    </div>
  );
};

export default OneClickMethod;  // 导出一键成卦组件

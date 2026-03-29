/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/OneClickMethod/OneClickMethod.jsx
 * @description     一键成卦组件，快速生成完整卦象
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-02-08 12:10:00
 * @lastModified    2026-03-28 10:00:00
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import desktopStyles from '../MethodCommon.desktop.module.css';  // 导入桌面端通用样式文件
import mobileStyles from '../MethodCommon.mobile.module.css';  // 导入移动端通用样式文件
import LiuYaoService from '../../../../../../services/liuyaoService';  // 导入六爻服务层
import YaoDisplay from '../../YaoComponents/YaoDisplay/YaoDisplay';  // 导入 YaoDisplay 组件
import ActionButton from '../../../../components/ActionButton/ActionButton';  // 导入 ActionButton 组件
import MethodDescription from '../MethodDescription/MethodDescription';  // 导入 MethodDescription 组件

/**
 * @description     一键成卦组件
 * @param           {boolean}   isMobile              是否为移动端
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
  isMobile,        // 是否为移动端
  yaoValues, // 爻值状态对象
  yaoOddCounts, // 爻奇数计数状态对象
  onReset, // 重置回调函数
  onOneClickDivination, // 一键成卦回调函数
  currentYaoIndex, // 当前爻位索引
  isResetEnabled }) => { // 是否启用重置按钮
  // 选择样式
  const currentStyles = isMobile ? mobileStyles : desktopStyles;

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
    <div className={currentStyles.methodContainer}>  {/* 一键成卦容器 */}
      {isMobile ? (
        <div className={currentStyles.contentRow}>  {/* 内容行 - 移动端 */}
          <MethodDescription
            title="一键起卦："
            description="快速生成完整卦象，适合初学者或需要快速起卦的场景。"
            steps={[
              "诚心静默，排除杂念。",
              "心念占事，一键成卦。"
            ]}
            className={currentStyles.contentContainer}
          />
          
          <YaoDisplay
            isMobile={isMobile}
            className={currentStyles.yaoDisplay}
            mode="display"
            yaoValues={yaoValues}
            yaoOddCounts={yaoOddCounts}
            isOneClick={true}
          />
          
          <ActionButton className={currentStyles.divinationActions}>
            <ActionButton
              type="primary"
              onClick={handleOneClickDivination}
              disabled={isButtonDisabled}
            >
              {getButtonText()}
            </ActionButton>
            <ActionButton
              type="danger"
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              重新起卦
            </ActionButton>
          </ActionButton>
        </div>
      ) : (
        <div className={currentStyles.contentRow}>  {/* 内容行 - 桌面端 */}
          <div className={currentStyles.liuYaoInfo}>  {/* 六爻信息区域 */}
            <MethodDescription
              title="一键起卦："
              description="快速生成完整卦象，适合初学者或需要快速起卦的场景。"
              steps={[
                "诚心静默，排除杂念。",
                "心念占事，一键成卦。"
              ]}
              className={currentStyles.contentContainer}
            />
            <ActionButton className={currentStyles.divinationActions}>
              <ActionButton
                type="primary"
                onClick={handleOneClickDivination}
                disabled={isButtonDisabled}
              >
                {getButtonText()}
              </ActionButton>
              <ActionButton
                type="danger"
                onClick={onReset}
                disabled={!isResetEnabled}
              >
                重新起卦
              </ActionButton>
            </ActionButton>
          </div>
          
          <YaoDisplay
            isMobile={isMobile}
            className={currentStyles.yaoDisplay}
            mode="display"
            yaoValues={yaoValues}
            yaoOddCounts={yaoOddCounts}
            isOneClick={true}
          />
        </div>
      )}
    </div>
  );
};

export default OneClickMethod;  // 导出一键成卦组件

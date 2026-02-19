/*
 * @file            frontend/src/components/LiuYao/methods/OneClickMethod.jsx
 * @description     一键成卦组件，快速生成完整卦象
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-08 12:10:00
 * @lastModified    2026-02-19 10:52:39
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import { getYaoComponent } from '../utils/yaoUtils';  // 导入爻组件工具函数
import '../LiuYaoQiGua/LiuYaoQiGua.css';  // 导入组件样式文件
import LiuYaoService from '../../../services/liuyaoService';  // 导入六爻服务层

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
      // 一键生成六个数字
      const digitsArray = await LiuYaoService.generateSixDigits();  // 调用服务生成六个数字

      console.log('生成的数字数组:', digitsArray);  // 打印生成的数字数组
      
      // 执行排盘
      const divinationResult = await LiuYaoService.performDivination(digitsArray);  // 调用服务执行排盘

      console.log('排盘结果:', divinationResult);  // 打印排盘结果
      
      // 更新UI状态
      if (divinationResult && divinationResult.data) {  // 如果排盘结果存在
        const { yaoValues, yaoOddCounts } = divinationResult.data;  // 解构爻值和爻奇数计数
        console.log('更新的yaoValues:', yaoValues);  // 打印爻值
        console.log('更新的yaoOddCounts:', yaoOddCounts);  // 打印爻奇数计数
        
        // 调用父组件的onOneClickDivination方法更新状态，同时传递digitsArray
        await onOneClickDivination(yaoValues, yaoOddCounts, digitsArray);  // 调用父组件回调
      }
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
    <div className="one-click-method">  {/* 一键成卦容器 */}
      <div className="content-row">  {/* 内容行 */}
        <div className="liu-yao-info">  {/* 六爻信息区域 */}
          <h3>一键起卦：</h3>  {/* 标题 */}
          <p>快速生成完整卦象，适合初学者或需要快速起卦的场景。</p>  {/* 描述 */}
          <ol>  {/* 操作步骤列表 */}
            <li>诚心静默，排除杂念</li>  {/* 步骤1 */}
            <li>心念占事，一键成卦</li>  {/* 步骤2 */}
            <li>系统自动生成完整卦象</li>  {/* 步骤3 */}
          </ol>
          <div className="divination-actions">  {/* 操作按钮区域 */}
            <button 
              className="throw-button"  // 按钮样式
              onClick={handleOneClickDivination}  // 点击事件
              disabled={isButtonDisabled}  // 禁用状态
            >
              {getButtonText()}  {/* 按钮文字 */}
            </button>
            <button 
              className="reset-button"  // 按钮样式
              onClick={onReset}  // 点击事件
              disabled={!isResetEnabled}  // 禁用状态
            >
              重新起卦  {/* 按钮文字 */}
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

export default OneClickMethod;  // 导出一键成卦组件
/*
 * @file            frontend/src/components/LiuYao/components/MethodContent.jsx
 * @description     方法内容组件，根据选择的起卦方式显示对应的内容
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-28 12:00
 * @lastModified    2026-02-18 22:31:26
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import StepByStepMethod from '../methods/StepByStepMethod'; // 导入逐爻起卦组件
import OneClickMethod from '../methods/OneClickMethod'; // 导入一键起卦组件
import NumberMethod from '../methods/NumberMethod'; // 导入报数起卦组件
import SpecifiedMethod from '../methods/SpecifiedMethod'; // 导入指定起卦组件

// 定义方法内容组件
const MethodContent = ({
  selectedMethod, // 选择的起卦方式
  yaoValues, // 爻值
  yaoOddCounts, // 爻奇数个数
  onThrow, // 投掷回调
  onReset, // 重置回调
  onOneClickDivination, // 一键起卦回调
  onNumberDivination, // 报数起卦回调
  onSpecifiedDivination, // 指定起卦回调
  currentYaoIndex, // 当前爻索引
  yaoOrder, // 爻位顺序
  isResetEnabled // 重置按钮启用状态
}) => {
  // 定义渲染方法内容的函数
  const renderMethodContent = () => {
    // 根据选择的起卦方式进行条件渲染
    switch (selectedMethod) {
      case '逐爻起卦': // 如果选择逐爻起卦
        // 返回逐爻起卦组件
        return (
          // 逐爻起卦组件
          <StepByStepMethod 
            yaoValues={yaoValues} // 传递爻值
            yaoOddCounts={yaoOddCounts} // 传递爻奇数个数
            onThrow={onThrow} // 传递投掷回调
            onReset={onReset} // 传递重置回调
            currentYaoIndex={currentYaoIndex} // 传递当前爻索引
            yaoOrder={yaoOrder} // 传递爻位顺序
            isResetEnabled={isResetEnabled} // 传递重置按钮启用状态
          />
        );
      // 如果选择一键起卦
      case '一键起卦': 
        // 返回一键起卦组件
        return (
          // 一键起卦组件
          <OneClickMethod 
            yaoValues={yaoValues} // 传递爻值
            yaoOddCounts={yaoOddCounts} // 传递爻奇数个数
            onThrow={onThrow} // 传递投掷回调
            onReset={onReset} // 传递重置回调
            onOneClickDivination={onOneClickDivination} // 传递一键起卦回调
            currentYaoIndex={currentYaoIndex} // 传递当前爻索引
            yaoOrder={yaoOrder} // 传递爻位顺序
            isResetEnabled={isResetEnabled} // 传递重置按钮启用状态
          />
        );
      // 如果选择报数起卦
      case '报数起卦': 
        // 返回报数起卦组件
        return (
          // 报数起卦组件
          <NumberMethod 
            onReset={onReset} // 传递重置回调
            onNumberDivination={onNumberDivination} // 传递报数起卦回调
          />
        );
      // 如果选择指定起卦
      case '指定起卦': 
        // 返回指定起卦组件
        return (
          // 指定起卦组件
          <SpecifiedMethod 
            onReset={onReset} // 传递重置回调
            onSpecifiedDivination={onSpecifiedDivination} // 传递指定起卦回调
          />
        );
      // 默认情况
      default: 
        // 返回逐爻起卦组件作为默认
        return (
          // 逐爻起卦组件
          <StepByStepMethod 
            yaoValues={yaoValues} // 传递爻值
            yaoOddCounts={yaoOddCounts} // 传递爻奇数个数
            onThrow={onThrow} // 传递投掷回调
            onReset={onReset} // 传递重置回调
            currentYaoIndex={currentYaoIndex} // 传递当前爻索引
            yaoOrder={yaoOrder} // 传递爻位顺序
            isResetEnabled={isResetEnabled} // 传递重置按钮启用状态
          />
        );
    }
  };

  return <div className="method-content">{renderMethodContent()}</div>; // 返回方法内容容器，包含渲染的方法内容
}; // 结束组件定义

export default MethodContent; // 导出MethodContent组件作为默认导出
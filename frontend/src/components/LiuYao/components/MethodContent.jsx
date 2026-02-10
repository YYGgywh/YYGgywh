// 路径:src/components/LiuYao/components/MethodContent.jsx 时间:2026-01-28 12:00
// 功能:方法内容组件，根据选择的起卦方式显示对应的内容
import React from 'react';
import StepByStepMethod from '../methods/StepByStepMethod';
import OneClickMethod from '../methods/OneClickMethod';
import NumberMethod from '../methods/NumberMethod';
import SpecifiedMethod from '../methods/SpecifiedMethod';

const MethodContent = ({ selectedMethod, yaoValues, yaoOddCounts, onThrow, onReset, onOneClickDivination, onNumberDivination, onSpecifiedDivination, currentYaoIndex, yaoOrder, isResetEnabled }) => {
  const renderMethodContent = () => {
    switch (selectedMethod) {
      case '逐爻起卦':
        return (
          <StepByStepMethod 
            yaoValues={yaoValues} 
            yaoOddCounts={yaoOddCounts}
            onThrow={onThrow} 
            onReset={onReset} 
            currentYaoIndex={currentYaoIndex}
            yaoOrder={yaoOrder}
            isResetEnabled={isResetEnabled}
          />
        );
      case '一键起卦':
        return (
          <OneClickMethod 
            yaoValues={yaoValues} 
            yaoOddCounts={yaoOddCounts}
            onThrow={onThrow} 
            onReset={onReset}
            onOneClickDivination={onOneClickDivination}
            currentYaoIndex={currentYaoIndex}
            yaoOrder={yaoOrder}
            isResetEnabled={isResetEnabled}
          />
        );
      case '报数起卦':
        return (
          <NumberMethod 
            onReset={onReset} 
            onNumberDivination={onNumberDivination}
          />
        );
      case '指定起卦':
        return (
          <SpecifiedMethod 
            onReset={onReset} 
            onSpecifiedDivination={onSpecifiedDivination}
          />
        );
      default:
        return (
          <StepByStepMethod 
            yaoValues={yaoValues} 
            yaoOddCounts={yaoOddCounts}
            onThrow={onThrow} 
            onReset={onReset} 
            currentYaoIndex={currentYaoIndex}
            yaoOrder={yaoOrder}
            isResetEnabled={isResetEnabled}
          />
        );
    }
  };

  return <div className="method-content">{renderMethodContent()}</div>;
};

export default MethodContent;
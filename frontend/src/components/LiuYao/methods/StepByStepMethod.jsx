// 路径:src/components/LiuYao/methods/StepByStepMethod.jsx 时间:2026-01-29 10:00
// 功能:逐爻起卦组件，完全模拟传统六爻投掷三枚铜钱
import React from 'react';
import { YangYao, YinYao } from '../../common/YaoComponents';
import '../LiuYaoQiGua/LiuYaoQiGua.css';

const StepByStepMethod = ({ yaoValues, yaoOddCounts, onThrow, onReset, currentYaoIndex, yaoOrder, isResetEnabled }) => {
  // 根据odd_count值确定爻的形状和颜色
  const getYaoComponent = (oddCount) => {
    if (oddCount === null || oddCount === undefined) return null;
    
    const oddCountStr = oddCount.toString();
    
    switch (oddCountStr) {
      case '1':
        return <YangYao backgroundColor="#000000" />;
      case '2':
        return <YinYao backgroundColor="#000000" />;
      case '3':
        return <YangYao backgroundColor="#C00000" />;
      case '0':
        return <YinYao backgroundColor="#0070C0" />;
      default:
        return null;
    }
  };
  // 计算当前按钮文字
  const getButtonText = () => {
    if (currentYaoIndex >= 6) {
      return '投掷结束';
    }
    const currentYaoName = yaoOrder[currentYaoIndex];
    return `投掷${currentYaoName}爻`;
  };
  
  // 检查是否应该禁用按钮
  const isButtonDisabled = currentYaoIndex >= 6;
  
  return (
    <div className="step-by-step-method">
      <div className="content-row">
        <div className="liu-yao-info">
          <h3>逐爻起卦：</h3>
          <p>完全模拟传统六爻投掷三枚铜钱阴阳属性，是首选的起卦方式。</p>
          <ol>
            <li>诚心静默，排除杂念</li>
            <li>心念占事，点击投掷</li>
            <li>每投必缓，六掷卦成</li>
          </ol>
          <div className="divination-actions">
            <button 
              className="throw-button" 
              onClick={onThrow}
              disabled={isButtonDisabled}
            >
              {getButtonText()}
            </button>
            <button 
              className="reset-button" 
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              重新投掷
            </button>
        </div>
        </div>

        <div className="yao-display">
          <div className="yao-item">
            <span className="yao-label">上爻：</span>
            <input 
              className={`yao-value ${yaoValues.shang === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.shang === '待生成' ? '' : yaoValues.shang}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.shang)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">五爻：</span>
            <input 
              className={`yao-value ${yaoValues.wu === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.wu === '待生成' ? '' : yaoValues.wu}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.wu)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">四爻：</span>
            <input 
              className={`yao-value ${yaoValues.si === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.si === '待生成' ? '' : yaoValues.si}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.si)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">三爻：</span>
            <input 
              className={`yao-value ${yaoValues.san === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.san === '待生成' ? '' : yaoValues.san}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.san)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">二爻：</span>
            <input 
              className={`yao-value ${yaoValues.er === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.er === '待生成' ? '' : yaoValues.er}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.er)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">初爻：</span>
            <input 
              className={`yao-value ${yaoValues.chu === '待生成' ? 'yao-value-placeholder' : ''}`}
              placeholder="待生成"
              value={yaoValues.chu === '待生成' ? '' : yaoValues.chu}
              disabled
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.chu)}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepByStepMethod;
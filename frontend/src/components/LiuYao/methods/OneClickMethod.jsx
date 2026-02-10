// 路径:src/components/LiuYao/methods/OneClickMethod.jsx 时间:2026-02-08 12:10
// 功能:一键成卦组件，快速生成完整卦象
import React from 'react';
import { YangYao, YinYao } from '../../common/YaoComponents';
import '../LiuYaoQiGua/LiuYaoQiGua.css';
import LiuYaoService from '../../../services/liuyaoService';

const OneClickMethod = ({ yaoValues, yaoOddCounts, onThrow, onReset, onOneClickDivination, currentYaoIndex, yaoOrder, isResetEnabled }) => {
  const handleOneClickDivination = async () => {
    console.log('执行一键成卦');
    try {
      // 一键生成六个数字
      const digitsArray = await LiuYaoService.generateSixDigits();
      console.log('生成的数字数组:', digitsArray);
      
      // 执行排盘
      const divinationResult = await LiuYaoService.performDivination(digitsArray);
      console.log('排盘结果:', divinationResult);
      
      // 更新UI状态
      if (divinationResult && divinationResult.data) {
        const { yaoValues, yaoOddCounts } = divinationResult.data;
        console.log('更新的yaoValues:', yaoValues);
        console.log('更新的yaoOddCounts:', yaoOddCounts);
        
        // 调用父组件的onOneClickDivination方法更新状态，同时传递digitsArray
        await onOneClickDivination(yaoValues, yaoOddCounts, digitsArray);
      }
    } catch (error) {
      console.error('一键成卦失败:', error);
    }
  };

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
  
  const getButtonText = () => {
    if (currentYaoIndex >= 6) {
      return '起卦完成';
    }
    return '一键成卦';
  };
  
  const isButtonDisabled = currentYaoIndex >= 6;
  
  return (
    <div className="one-click-method">
      <div className="content-row">
        <div className="liu-yao-info">
          <h3>一键起卦：</h3>
          <p>快速生成完整卦象，适合初学者或需要快速起卦的场景。</p>
          <ol>
            <li>诚心静默，排除杂念</li>
            <li>心念占事，一键成卦</li>
            <li>系统自动生成完整卦象</li>
          </ol>
          <div className="divination-actions">
            <button 
              className="throw-button" 
              onClick={handleOneClickDivination}
              disabled={isButtonDisabled}
            >
              {getButtonText()}
            </button>
            <button 
              className="reset-button" 
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              重新起卦
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

export default OneClickMethod;
// 路径:src/components/LiuYao/methods/SpecifiedMethod.jsx 时间:2026-02-09 18:00
// 功能:指定起卦组件，手动输入爻值生成卦象
import React, { useState } from 'react';
import { YangYao, YinYao } from '../../common/YaoComponents';
import '../LiuYaoQiGua/LiuYaoQiGua.css';
import LiuYaoService from '../../../services/liuyaoService';

const SpecifiedMethod = ({ onReset, onSpecifiedDivination }) => {
  // 跟踪每个爻位的阳阴选择状态：'yang' | 'yin' | 'yang-active' | 'yin-active' | null (未选中)
  const [yaoSelections, setYaoSelections] = useState({
    shang: null,
    wu: null,
    si: null,
    san: null,
    er: null,
    chu: null
  });
  
  // 爻值状态（正背组合）
  const [yaoValues, setYaoValues] = useState({
    shang: '待生成',
    wu: '待生成',
    si: '待生成',
    san: '待生成',
    er: '待生成',
    chu: '待生成'
  });
  
  // 爻奇数个数状态
  const [yaoOddCounts, setYaoOddCounts] = useState({
    shang: null,
    wu: null,
    si: null,
    san: null,
    er: null,
    chu: null
  });
  
  // 三数字符串数组
  const [threeDigitsArray, setThreeDigitsArray] = useState([]);
  
  // 跟踪是否所有爻位都有合法输入
  const [hasAllValidInputs, setHasAllValidInputs] = useState(false);
  
  // 跟踪是否有至少一个爻位被选中
  const [hasAnySelection, setHasAnySelection] = useState(false);
  
  // 按钮状态与三数字符串映射表
  const BUTTON_STATE_TO_THREE_DIGITS = {
    'yang': '100',      // 阳按钮第一次选中
    'yin': '110',       // 阴按钮第一次选中
    'yang-active': '111', // 阳按钮第二次选中
    'yin-active': '000'  // 阴按钮第二次选中
  };
  
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

  const handleSpecifiedDivination = () => {
    // 指定起卦逻辑
    console.log('执行指定起卦', {
      yaoSelections,
      yaoValues,
      yaoOddCounts,
      threeDigitsArray
    });
    
    // 向父组件传递数据
    if (onSpecifiedDivination) {
      onSpecifiedDivination(yaoValues, yaoOddCounts, threeDigitsArray);
    }
  };

  // 处理阳阴按钮点击
  const handleYaoButtonClick = (position, type) => {
    setYaoSelections(prev => {
      const currentSelection = prev[position];
      let newSelection;
      
      if (type === 'yang') {
        if (currentSelection === null || currentSelection === 'yin' || currentSelection === 'yin-active') {
          newSelection = 'yang'; // 第一次点击：选中状态
        } else if (currentSelection === 'yang') {
          newSelection = 'yang-active'; // 第二次点击：激活状态
        } else {
          newSelection = 'yang'; // 已激活状态下点击：切换回选中状态
        }
      } else {
        if (currentSelection === null || currentSelection === 'yang' || currentSelection === 'yang-active') {
          newSelection = 'yin'; // 第一次点击：选中状态
        } else if (currentSelection === 'yin') {
          newSelection = 'yin-active'; // 第二次点击：激活状态
        } else {
          newSelection = 'yin'; // 已激活状态下点击：切换回选中状态
        }
      }
      
      const updatedSelections = {
        ...prev,
        [position]: newSelection
      };
      
      // 实时更新三数字符串、爻值和奇数个数
      updateYaoData(updatedSelections);
      
      return updatedSelections;
    });
  };
  
  // 更新爻数据
  const updateYaoData = (selections) => {
    const updatedYaoValues = { ...yaoValues };
    const updatedYaoOddCounts = { ...yaoOddCounts };
    const newThreeDigitsArray = [];
    
    // 爻位顺序：初、二、三、四、五、上
    const yaoOrder = ['chu', 'er', 'san', 'si', 'wu', 'shang'];
    
    // 记录数据变动
    const dataChanges = {};
    
    // 更新每个爻位的数据
    Object.entries(selections).forEach(([position, state]) => {
      if (state !== null) {
        // 生成三数字符串
        const threeDigitsStr = BUTTON_STATE_TO_THREE_DIGITS[state];
        const threeDigits = parseInt(threeDigitsStr);
        
        // 计算正背组合
        const parityStr = LiuYaoService.calculateParityStr(threeDigits);
        
        // 计算奇数个数
        const oddCount = LiuYaoService.calculateOddCount(threeDigits);
        
        // 记录数据变动
        dataChanges[position] = {
          buttonState: state,
          threeDigits: threeDigitsStr,
          parityStr: parityStr,
          oddCount: oddCount
        };
        
        // 更新状态
        updatedYaoValues[position] = parityStr;
        updatedYaoOddCounts[position] = oddCount;
      } else {
        // 未选择状态
        updatedYaoValues[position] = '待生成';
        updatedYaoOddCounts[position] = null;
      }
    });
    
    // 收集三数字符串数组（使用字符串形式）
    yaoOrder.forEach(position => {
      if (selections[position] !== null) {
        newThreeDigitsArray.push(BUTTON_STATE_TO_THREE_DIGITS[selections[position]]);
      }
    });
    
    // 打印数据变动
    console.log('指定起卦数据变动:', {
      selections: selections,
      dataChanges: dataChanges,
      updatedYaoValues: updatedYaoValues,
      updatedYaoOddCounts: updatedYaoOddCounts,
      threeDigitsArray: newThreeDigitsArray
    });
    
    // 更新状态
    setYaoValues(updatedYaoValues);
    setYaoOddCounts(updatedYaoOddCounts);
    setThreeDigitsArray(newThreeDigitsArray);
    
    // 检查是否所有爻位都有合法输入
    const allPositionsFilled = Object.values(selections).every(state => state !== null);
    setHasAllValidInputs(allPositionsFilled);
    
    // 检查是否有至少一个爻位被选中
    const anyPositionFilled = Object.values(selections).some(state => state !== null);
    setHasAnySelection(anyPositionFilled);
    
    // 动态传递数据给父组件
    if (onSpecifiedDivination) {
      onSpecifiedDivination(updatedYaoValues, updatedYaoOddCounts, newThreeDigitsArray, allPositionsFilled);
    }
  };

  const handleReset = () => {
    // 重置阳阴选择状态
    const resetSelections = {
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    };
    
    setYaoSelections(resetSelections);
    
    // 重置爻值状态
    setYaoValues({
      shang: '待生成',
      wu: '待生成',
      si: '待生成',
      san: '待生成',
      er: '待生成',
      chu: '待生成'
    });
    
    // 重置爻奇数个数状态
    setYaoOddCounts({
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    
    // 重置三数字符串数组
    setThreeDigitsArray([]);
    
    // 重置所有爻位都有合法输入的状态
    setHasAllValidInputs(false);
    
    // 重置是否有至少一个爻位被选中的状态
    setHasAnySelection(false);
    
    // 调用父组件的重置函数
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="specified-method">
      <div className="content-row">
        <div className="liu-yao-info">
          <h3>指定起卦：</h3>
          <p>手动指定六爻值，适合有经验的使用者。</p>
          <ol>
            <li>根据已知信息，填写各爻值</li>
            <li>点击起卦，系统根据指定值生成卦象</li>
          </ol>
          <div className="divination-actions">
            <button 
              className="throw-button" 
              onClick={handleSpecifiedDivination}
            >
              指定起卦
            </button>
            <button 
              className="reset-button" 
              onClick={handleReset}
              disabled={!hasAnySelection}
            >
              重新输入
            </button>
          </div>
        </div>

        <div className="yao-display">
          <div className="yao-item">
            <span className="yao-label">上爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.shang === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.shang === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('shang', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.shang === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.shang === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('shang', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.shang)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">五爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.wu === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.wu === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('wu', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.wu === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.wu === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('wu', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.wu)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">四爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.si === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.si === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('si', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.si === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.si === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('si', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.si)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">三爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.san === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.san === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('san', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.san === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.san === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('san', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.san)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">二爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.er === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.er === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('er', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.er === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.er === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('er', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.er)}</div>
          </div>
          <div className="yao-item">
            <span className="yao-label">初爻：</span>
            <div className="yao-buttons-container">
              <button
                className={`yao-button yang-button ${yaoSelections.chu === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.chu === 'yang-active' ? 'yang-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('chu', 'yang')}
              >
                阳
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.chu === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.chu === 'yin-active' ? 'yin-button-active' : ''}`}
                onClick={() => handleYaoButtonClick('chu', 'yin')}
              >
                阴
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.chu)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecifiedMethod;
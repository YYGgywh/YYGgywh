/*
 * @file            frontend/src/components/LiuYao/methods/SpecifiedMethod.jsx
 * @description     指定起卦组件，用户手动指定每爻爻象生成卦象
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-09 18:00:00
 * @lastModified    2026-02-19 12:42:54
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';  // 导入 React 核心库和 Hooks
import { getYaoComponent } from '../utils/yaoUtils';  // 导入爻组件工具函数
import '../LiuYaoQiGua/LiuYaoQiGua.css';  // 导入组件样式文件
import LiuYaoService from '../../../services/liuyaoService';  // 导入六爻服务层

/**
 * @description     指定起卦组件
 * @param           {Function}  onReset               重置回调函数
 * @param           {Function}  onSpecifiedDivination   指定起卦回调函数
 * @return          {JSX}                          指定起卦界面 JSX 元素
 */

// 定义 SpecifiedMethod 组件
const SpecifiedMethod = ({ onReset, onSpecifiedDivination }) => {
  // 爻位选择状态，跟踪每个爻位的阳阴选择状态：'yang' | 'yin' | 'yang-active' | 'yin-active' | null (未选中)
  const [yaoSelections, setYaoSelections] = useState({
    shang: null,  // 上爻选择
    wu: null,     // 五爻选择
    si: null,     // 四爻选择
    san: null,    // 三爻选择
    er: null,     // 二爻选择
    chu: null     // 初爻选择
  });
  
  // 爻值状态（正背组合）
  const [yaoValues, setYaoValues] = useState({  // 爻值状态
    shang: '待生成',  // 上爻值
    wu: '待生成',     // 五爻值
    si: '待生成',     // 四爻值
    san: '待生成',    // 三爻值
    er: '待生成',     // 二爻值
    chu: '待生成'     // 初爻值
  });
  
  // 爻奇数个数状态
  const [yaoOddCounts, setYaoOddCounts] = useState({  // 爻奇数计数状态
    shang: null,  // 上爻奇数个数
    wu: null,     // 五爻奇数个数
    si: null,     // 四爻奇数个数
    san: null,    // 三爻奇数个数
    er: null,     // 二爻奇数个数
    chu: null     // 初爻奇数个数
  });
  
  const [threeDigitsArray, setThreeDigitsArray] = useState([]);  // 三数字符串数组状态
  const [hasAnySelection, setHasAnySelection] = useState(false);  // 跟踪是否有至少一个爻位被选中状态

  /**
   * @description     处理指定起卦
   */

  // 处理指定起卦点击事件
  const handleSpecifiedDivination = () => {
    // 指定起卦逻辑
    // 打印日志
    console.log('执行指定起卦', {
      yaoSelections,  // 爻位选择
      yaoValues,  // 爻值
      yaoOddCounts,  // 爻奇数计数
      threeDigitsArray  // 三位数组
    });
    
    // 向父组件传递数据
    // 如果回调函数存在
    if (onSpecifiedDivination) {
      onSpecifiedDivination(yaoValues, yaoOddCounts, threeDigitsArray);  // 调用回调函数
    }
  };

  /**
   * @description     处理阳阴按钮点击
   * @param           {string}    position           爻位名称
   * @param           {string}    type               按钮类型（'yang' 或 'yin'）
   */

  // 处理阳阴按钮点击事件
  const handleYaoButtonClick = (position, type) => {
    // 更新爻位选择状态
    setYaoSelections(prev => {
      const currentSelection = prev[position];  // 获取当前爻位的选择状态
      let newSelection;  // 新的选择状态

      // 如果点击的是阳按钮
      if (type === 'yang') {
        // 如果当前未选中或选中了阴
        if (currentSelection === null || currentSelection === 'yin' || currentSelection === 'yin-active') {
          newSelection = 'yang';  // 第一次点击：选中状态
        }
        // 如果当前是选中状态
        else if (currentSelection === 'yang') {
          newSelection = 'yang-active';  // 第二次点击：激活状态
        }
        // 如果当前是激活状态
        else {
          newSelection = 'yang';  // 已激活状态下点击：切换回选中状态
        }
      }
      // 如果点击的是阴按钮
      else {
        // 如果当前未选中或选中了阳
        if (currentSelection === null || currentSelection === 'yang' || currentSelection === 'yang-active') {
          newSelection = 'yin';  // 第一次点击：选中状态
        }
        // 如果当前是选中状态
        else if (currentSelection === 'yin') {
          newSelection = 'yin-active';  // 第二次点击：激活状态
        }
        // 如果当前是激活状态
        else {
          newSelection = 'yin';  // 已激活状态下点击：切换回选中状态
        }
      }
      
      // 创建更新后的选择对象
      const updatedSelections = {
        ...prev,  // 保留原有状态
        [position]: newSelection  // 更新指定爻位的选择状态
      };
      
      updateYaoData(updatedSelections);  // 调用更新函数，实时更新三数字符串、爻值和奇数个数
      
      return updatedSelections;  // 返回更新后的选择对象
    });
  };
  
  /**
   * @description     更新爻数据
   * @param           {Object}    selections          爻位选择状态对象
   */

  // 更新爻数据函数
  const updateYaoData = (selections) => {
    const updatedYaoValues = { ...yaoValues };  // 创建爻值副本
    const updatedYaoOddCounts = { ...yaoOddCounts };  // 创建爻奇数计数副本
    const newThreeDigitsArray = [];  // 新的三位数组
    
    const yaoOrder = LiuYaoService.YAO_ORDER_KEYS;  // 获取爻位顺序
    
    const dataChanges = {};  // 数据变动记录
    
    // 更新每个爻位的数据
    // 遍历所有爻位
    Object.entries(selections).forEach(([position, state]) => {
      // 如果爻位有选择
      if (state !== null) {
        const threeDigitsStr = LiuYaoService.BUTTON_STATE_TO_THREE_DIGITS[state];  // 获取三位数字字符串
        const threeDigits = parseInt(threeDigitsStr);  // 转换为数字
        const parityStr = LiuYaoService.calculateParityStr(threeDigits);  // 计算奇偶字符串
        const oddCount = LiuYaoService.calculateOddCount(threeDigits);  // 计算奇数个数
        
        // 记录爻位数据变动
        dataChanges[position] = {
          buttonState: state,  // 按钮状态
          threeDigits: threeDigitsStr,  // 三位数字字符串
          parityStr: parityStr,  // 奇偶字符串
          oddCount: oddCount  // 奇数个数
        };
        
        // 更新状态
        updatedYaoValues[position] = parityStr;  // 更新爻值
        updatedYaoOddCounts[position] = oddCount;  // 更新爻奇数计数
      }
      // 如果爻位未选择
      else {
        // 未选择状态
        updatedYaoValues[position] = '待生成';  // 设置为待生成
        updatedYaoOddCounts[position] = null;  // 设置为空
      }
    });
    
    // 收集三数字符串数组（使用字符串形式）
    // 遍历爻位顺序
    yaoOrder.forEach(position => {
      // 如果爻位有选择
      if (selections[position] !== null) {
        newThreeDigitsArray.push(LiuYaoService.BUTTON_STATE_TO_THREE_DIGITS[selections[position]]);  // 添加三位数字字符串
      }
    });
    
    // 打印数据变动
    // 打印日志
    console.log('指定起卦数据变动:', {
      selections: selections,  // 爻位选择
      dataChanges: dataChanges,  // 数据变动
      updatedYaoValues: updatedYaoValues,  // 更新后的爻值
      updatedYaoOddCounts: updatedYaoOddCounts,  // 更新后的爻奇数计数
      threeDigitsArray: newThreeDigitsArray  // 更新后的三位数组
    });
    
    // 更新状态
    setYaoValues(updatedYaoValues);  // 更新爻值状态
    setYaoOddCounts(updatedYaoOddCounts);  // 更新爻奇数计数状态
    setThreeDigitsArray(newThreeDigitsArray);  // 更新三位数组状态
    
    const allPositionsFilled = Object.values(selections).every(state => state !== null);  // 检查是否所有爻位都有合法输入
    
    // 检查是否有至少一个爻位被选中
    const anyPositionFilled = Object.values(selections).some(state => state !== null);  // 检查是否有爻位被选中
    setHasAnySelection(anyPositionFilled);  // 更新是否有爻位被选中状态
    
    // 只在所有爻位都选中时才传递数据给父组件，避免频繁更新父组件状态
    if (allPositionsFilled && onSpecifiedDivination) {
      onSpecifiedDivination(
        updatedYaoValues,    // 更新后的爻值
        updatedYaoOddCounts, // 更新后的爻奇数计数
        newThreeDigitsArray, // 更新后的三位数组
        allPositionsFilled   // 是否所有爻位都有合法输入
      );  // 调用回调函数
    }
  };

  /**
   * @description     处理重置操作
   */

  // 重置阳阴选择状态
  const handleReset = () => {
    // 创建重置选择对象
    const resetSelections = {
      shang: null,  // 上爻重置
      wu: null,     // 五爻重置
      si: null,     // 四爻重置
      san: null,    // 三爻重置
      er: null,     // 二爻重置
      chu: null     // 初爻重置
    };
    
    setYaoSelections(resetSelections);  // 重置爻位选择状态
    
    // 重置爻值状态
    setYaoValues({
      shang: '待生成',     // 上爻值
      wu: '待生成',        // 五爻值
      si: '待生成',        // 四爻值
      san: '待生成',       // 三爻值
      er: '待生成',        // 二爻值
      chu: '待生成'        // 初爻值
    });
    
    // 重置爻奇数个数状态
    setYaoOddCounts({
      shang: null,     // 上爻奇数个数
      wu: null,        // 五爻奇数个数
      si: null,        // 四爻奇数个数
      san: null,       // 三爻奇数个数
      er: null,        // 二爻奇数个数
      chu: null        // 初爻奇数个数
    });
    
    // 重置三数字符串数组
    setThreeDigitsArray([]);  // 清空三位数组
    
    // 重置是否有至少一个爻位被选中的状态
    setHasAnySelection(false);  // 重置是否有爻位被选中状态
    
    // 调用父组件的重置函数
    // 如果回调函数存在
    if (onReset) {
      onReset();  // 调用回调函数
    }
  };

  // 渲染指定起卦组件
  return (
    <div className="specified-method">  {/* 指定起卦容器 */}
      <div className="content-row">  {/* 内容行 */}
        <div className="liu-yao-info">  {/* 六爻信息区域 */}
          <h3>指定起卦：</h3>  {/* 标题 */}
          <p>根据线下卜具摇卦，用本六爻排盘自动生成卦象，完成装卦。</p>  {/* 描述 */}
          <ol>  {/* 操作步骤列表 */}
            <li>已得卦象，依象装纳</li>  {/* 步骤1 */}
            <li>对应爻位，点选阴阳</li>  {/* 步骤2 */}
            <li>若为动爻，再点即可</li>  {/* 步骤3 */}
          </ol>
          <div className="divination-actions">  {/* 操作按钮区域 */}
            {/* 暂时隐藏指定起卦按钮，目前该按钮没有任何需求功能 */}
            <button 
              className="throw-button"  // 按钮样式
              onClick={handleSpecifiedDivination}  // 点击事件
              style={{ visibility: 'hidden' }}  // 隐藏按钮但保留占位空间
            >
              指定起卦  {/* 按钮文字 */}
            </button>
            <button 
              className="reset-button"  // 按钮样式
              onClick={handleReset}  // 点击事件
              disabled={!hasAnySelection}  // 禁用状态
            >
              全部重设  {/* 按钮文字 */}
            </button>
          </div>
        </div>

        <div className="yao-display">  {/* 爻位显示区域 */}
          <div className="yao-item">  {/* 上爻项 */}
            <span className="yao-label">上爻：</span>  {/* 上爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.shang === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.shang === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('shang', 'yang')}  // 点击事件
              >
                {yaoSelections.shang === 'yang-active' ? '动' : yaoSelections.shang === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.shang === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.shang === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('shang', 'yin')}  // 点击事件
              >
                {yaoSelections.shang === 'yin-active' ? '动' : yaoSelections.shang === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.shang)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 五爻项 */}
            <span className="yao-label">五爻：</span>  {/* 五爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.wu === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.wu === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('wu', 'yang')}  // 点击事件
              >
                {yaoSelections.wu === 'yang-active' ? '动' : yaoSelections.wu === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.wu === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.wu === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('wu', 'yin')}  // 点击事件
              >
                {yaoSelections.wu === 'yin-active' ? '动' : yaoSelections.wu === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.wu)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 四爻项 */}
            <span className="yao-label">四爻：</span>  {/* 四爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.si === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.si === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('si', 'yang')}  // 点击事件
              >
                {yaoSelections.si === 'yang-active' ? '动' : yaoSelections.si === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.si === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.si === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('si', 'yin')}  // 点击事件
              >
                {yaoSelections.si === 'yin-active' ? '动' : yaoSelections.si === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.si)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 三爻项 */}
            <span className="yao-label">三爻：</span>  {/* 三爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.san === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.san === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('san', 'yang')}  // 点击事件
              >
                {yaoSelections.san === 'yang-active' ? '动' : yaoSelections.san === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.san === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.san === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('san', 'yin')}  // 点击事件
              >
                {yaoSelections.san === 'yin-active' ? '动' : yaoSelections.san === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.san)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 二爻项 */}
            <span className="yao-label">二爻：</span>  {/* 二爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.er === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.er === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('er', 'yang')}  // 点击事件
              >
                {yaoSelections.er === 'yang-active' ? '动' : yaoSelections.er === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.er === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.er === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('er', 'yin')}  // 点击事件
              >
                {yaoSelections.er === 'yin-active' ? '动' : yaoSelections.er === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.er)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 初爻项 */}
            <span className="yao-label">初爻：</span>  {/* 初爻标签 */}
            <div className="yao-buttons-container">  {/* 爻按钮容器 */}
              <button
                className={`yao-button yang-button ${yaoSelections.chu === 'yang' ? 'yang-button-selected' : ''} ${yaoSelections.chu === 'yang-active' ? 'yang-button-active' : ''}`}  // 阳按钮样式
                onClick={() => handleYaoButtonClick('chu', 'yang')}  // 点击事件
              >
                {yaoSelections.chu === 'yang-active' ? '动' : yaoSelections.chu === 'yang' ? '静' : '阳'}  {/* 按钮文字 */}
              </button>
              <button
                className={`yao-button yin-button ${yaoSelections.chu === 'yin' ? 'yin-button-selected' : ''} ${yaoSelections.chu === 'yin-active' ? 'yin-button-active' : ''}`}  // 阴按钮样式
                onClick={() => handleYaoButtonClick('chu', 'yin')}  // 点击事件
              >
                {yaoSelections.chu === 'yin-active' ? '动' : yaoSelections.chu === 'yin' ? '静' : '阴'}  {/* 按钮文字 */}
              </button>
            </div>
            <div className="yao-component">{getYaoComponent(yaoOddCounts.chu)}</div>  {/* 爻组件 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecifiedMethod;  // 导出指定起卦组件
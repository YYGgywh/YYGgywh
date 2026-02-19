/*
 * @file            frontend/src/components/LiuYao/methods/NumberMethod.jsx
 * @description     报数起卦组件，通过输入数字生成卦象，实现顺序输入
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-08 16:30:00
 * @lastModified    2026-02-19 10:30:42
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react';  // 导入 React 核心库和 Hooks
import { getYaoComponent } from '../utils/yaoUtils';  // 导入爻组件工具函数
import LiuYaoService from '../../../services/liuyaoService';  // 导入六爻服务层
import '../LiuYaoQiGua/LiuYaoQiGua.css';  // 导入组件样式文件

/**
 * @description     报数起卦组件
 * @param           {Function}  onReset              重置回调函数
 * @param           {Function}  onNumberDivination    报数起卦回调函数
 * @return          {JSX}                          报数起卦界面 JSX 元素
 */

// 定义 NumberMethod 组件
const NumberMethod = ({ onReset, onNumberDivination }) => {
  // 爻值状态
  const [yaoValues, setYaoValues] = useState({
    shang: '', // 上爻值
    wu: '',    // 五爻值
    si: '',    // 四爻值
    san: '',   // 三爻值
    er: '',    // 二爻值
    chu: ''    // 初爻值
  });

  // 爻位禁用状态
  const [disabledYaos, setDisabledYaos] = useState({
    shang: true,
    wu: true,
    si: true,
    san: true,
    er: true,
    chu: false  // 初爻初始可输入
  });

  const [hasValidInput, setHasValidInput] = useState(false);  // 跟踪是否有合法输入
  const [allInputsValid, setAllInputsValid] = useState(false);  // 跟踪是否所有输入框都有有效值
  // 爻奇数计数状态
  const [yaoOddCounts, setYaoOddCounts] = useState({
    shang: null,
    wu: null,
    si: null,
    san: null,
    er: null,
    chu: null
  });  // 存储每个爻位的奇数个数

  // 爻位输入框 ref 引用
  const yaoRefs = {
    shang: useRef(null),
    wu: useRef(null),
    si: useRef(null),
    san: useRef(null),
    er: useRef(null),
    chu: useRef(null)
  };

  const generateButtonRef = useRef(null);  // 生成卦象按钮 ref 引用

  const yaoOrder = LiuYaoService.YAO_ORDER_KEYS;  // 爻位顺序

  // 初始化时聚焦到初爻
  useEffect(() => {
    // 初始化时聚焦到初爻
    // 如果初爻未禁用
    if (!disabledYaos.chu) {
      yaoRefs.chu.current?.focus();  // 聚焦到初爻输入框
    }
  }, []);  // 空依赖数组，仅在组件挂载时执行

  // 监听 disabledYaos 变化，当某个爻位变为可输入时自动聚焦
  useEffect(() => {
    // 遍历所有爻位
    for (const yao of yaoOrder) {
      // 如果爻位未禁用
      if (!disabledYaos[yao]) {
        // 延迟聚焦
        setTimeout(() => {
          yaoRefs[yao].current?.focus();  // 聚焦到该爻位输入框
        }, 200);  // 延迟200毫秒
        break;  // 找到第一个可输入的爻位后退出循环
      }
    }
  }, [disabledYaos]);  // 依赖 disabledYaos 状态

  /**
   * @description     处理爻位输入变化
   * @param           {string}    yao               爻位名称
   * @param           {string}    value              输入值
   */

  // 处理爻位输入变化
  const handleInputChange = (yao, value) => {
    // 只调用一次setYaoValues，避免状态更新冲突
    // 更新爻值状态
    setYaoValues(prev => {
      // 创建新值对象
      const newValues = {
        ...prev,  // 保留原有值
        [yao]: value  // 更新指定爻位的值
      };
      
      // 检查是否有任何输入框有值
      const hasAnyInput = Object.values(newValues).some(val => val.length > 0);  // 检查是否有非空输入
      setHasValidInput(hasAnyInput);  // 更新是否有合法输入状态
      
      // 检查所有输入框是否都有有效值（3位数字）
      const allValid = Object.values(newValues).every(val => val.length === 3);  // 检查所有输入是否都是3位数字
      setAllInputsValid(allValid);  // 更新所有输入是否有效状态
      
      // 如果所有输入都有效，聚焦到生成卦象按钮      
      if (allValid) {
        // 延迟聚焦
        setTimeout(() => {
          generateButtonRef.current?.focus();  // 聚焦到生成卦象按钮
        }, 300);  // 延迟300毫秒
      }
      
      return newValues;  // 返回新值对象
    });

    // 检查输入是否完成（3位数字）
    // 如果输入长度为3
    if (value.length === 3) {
      // 计算下一个要输入的爻位
      const currentIndex = yaoOrder.indexOf(yao);  // 获取当前爻位索引
      // 如果不是最后一个爻位
      if (currentIndex < yaoOrder.length - 1) {
        const nextYao = yaoOrder[currentIndex + 1];  // 获取下一个爻位
        // 同时更新禁用状态
        setDisabledYaos(prev => ({
          ...prev,  // 保留原有状态
          [yao]: true,  // 禁用当前爻位
          [nextYao]: false  // 启用下一个爻位
        }));
      } else {  // 如果是最后一个爻位

        // 所有爻位输入完成
        // 更新禁用状态
        setDisabledYaos(prev => ({
          ...prev,  // 保留原有状态
          [yao]: true  // 禁用当前爻位
        }));
      }
    }
    // 如果输入为空
    else if (value.length === 0) {
      // 不需要在这里再次检查hasValidInput，因为上面已经检查过了
    }
  };

  /**
   * @description     处理双击清空爻位
   * @param           {string}    yao               爻位名称
   */

  // 只有当前可输入的爻位可以双击清空
  const handleDoubleClick = (yao) => {
    // 如果爻位未禁用
    if (!disabledYaos[yao]) {
      // 更新爻值状态
      setYaoValues(prev => {
        // 创建新值对象
        const newValues = {
          ...prev,  // 保留原有值
          [yao]: ''  // 清空指定爻位的值
        };
        
        // 检查是否有任何输入框有值
        const hasAnyInput = Object.values(newValues).some(val => val.length > 0);  // 检查是否有非空输入
        setHasValidInput(hasAnyInput);  // 更新是否有合法输入状态
        
        // 检查所有输入框是否都有有效值（3位数字）
        setAllInputsValid(false);  // 重置所有输入有效状态
        
        return newValues;  // 返回新值对象
      });
    }
  };

  /**
   * @description     处理重置操作
   */

  // 处理重置操作
  const handleReset = () => {
    // 清空所有输入框（重置爻值状态）
    setYaoValues({
      shang: '',
      wu: '',
      si: '',
      san: '',
      er: '',
      chu: ''
    });
    
    // 重置禁用状态，只有初爻可输入（重置禁用状态）
    setDisabledYaos({
      shang: true,
      wu: true,
      si: true,
      san: true,
      er: true,
      chu: false  // 初爻可输入
    });
    
    // 重置输入状态
    setHasValidInput(false);  // 重置是否有合法输入状态
    setAllInputsValid(false);  // 重置所有输入是否有效状态
    
    // 重置爻象数据
    setYaoOddCounts({  // 重置爻奇数计数状态
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    
    // 调用父组件的重置函数
    onReset();  // 调用父组件重置回调
  };

  /**
   * @description     处理生成卦象
   */
  const handleGenerateDivination = () => {
    // 将用户输入的6个3位数字转换为字符串数组
    const digitsArray = [  // 创建字符串数组
      yaoValues.chu,  // 初爻数字（字符串）
      yaoValues.er,  // 二爻数字（字符串）
      yaoValues.san,  // 三爻数字（字符串）
      yaoValues.si,  // 四爻数字（字符串）
      yaoValues.wu,  // 五爻数字（字符串）
      yaoValues.shang  // 上爻数字（字符串）
    ];
    
    // 调用liuyaoService计算爻象数据
    const yaoData = LiuYaoService.calculateYaoDataFromDigits(digitsArray);  // 计算爻象数据
    
    // 更新爻象数据
    setYaoOddCounts(yaoData.yaoOddCounts);  // 更新爻奇数计数状态
    
    // 调用父组件的回调函数，传递数据
    if (onNumberDivination) {  // 如果回调函数存在
      onNumberDivination(yaoValues, yaoData.yaoOddCounts, digitsArray);  // 调用回调函数
    }
  };

  /**
   * @description     处理输入验证
   * @param           {Event}     e                 输入事件对象
   */

  // 处理输入验证
  const handleInputValidation = (e) => {
    const value = e.target.value;  // 获取输入值
    // 如果输入为空
    if (value === '') {
      return;  // 直接返回
    }
    // 1. 只允许数字输入
    // 如果输入包含非数字字符
    if (!/^\d+$/.test(value)) {  
      e.target.value = value.replace(/\D/g, '');  // 移除非数字字符
    }
    // 2. 限制长度为恰好3位
    // 如果输入长度超过3位
    if (value.length > 3) {
      e.target.value = value.slice(0, 3);  // 截取前3位
    }
  };

  // 渲染组件
  return (
    <div className="number-method">  {/* 报数起卦容器 */}
      <div className="content-row">  {/* 内容行 */}
        <div className="liu-yao-info">  {/* 六爻信息区域 */}
          <h3>报数起卦：</h3>  {/* 标题 */}
          <p>根据您随机报出的数字生成卦象，简单快捷。</p>  {/* 描述 */}
          <ol>  {/* 操作步骤列表 */}
            <li>诚心静默，排除杂念</li>  {/* 步骤1 */}
            <li>心念占事，随机报出一个数字</li>  {/* 步骤2 */}
            <li>点击起卦，系统根据数字生成卦象</li>  {/* 步骤3 */}
          </ol>
          <div className="divination-actions">  {/* 操作按钮区域 */}
            <button 
              ref={generateButtonRef}  // 按钮引用
              className="throw-button"  // 按钮样式
              disabled={!allInputsValid}  // 所有输入有效时才可点击
              onClick={handleGenerateDivination}  // 点击事件
            >
              生成卦象  {/* 按钮文字 */}
            </button>
            <button 
              className="reset-button"  // 按钮样式
              onClick={handleReset}  // 点击事件
              disabled={!hasValidInput}  // 有输入时才可点击
            >
              重新报数  {/* 按钮文字 */}
            </button>
          </div>
        </div>

        <div className="yao-display">  {/* 爻位显示区域 */}
          <div className="yao-item">  {/* 上爻项 */}
            <span className={`yao-label ${disabledYaos.shang ? 'yao-label-disabled' : ''} ${!disabledYaos.shang ? 'yao-label-active' : ''}`}>上爻：</span>  {/* 上爻标签 */}
            {/* 上爻输入框 */}
            <input 
              ref={yaoRefs.shang}  // 输入框引用
              className={`yao-value ${disabledYaos.shang ? 'yao-value-disabled' : ''} ${!disabledYaos.shang ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.shang}  // 输入值
              onChange={(e) => handleInputChange('shang', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('shang')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.shang}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.shang)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 五爻项 */}
            <span className={`yao-label ${disabledYaos.wu ? 'yao-label-disabled' : ''} ${!disabledYaos.wu ? 'yao-label-active' : ''}`}>五爻：</span>  {/* 五爻标签 */}
            {/* 五爻输入框 */}
            <input 
              ref={yaoRefs.wu}  // 输入框引用
              className={`yao-value ${disabledYaos.wu ? 'yao-value-disabled' : ''} ${!disabledYaos.wu ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.wu}  // 输入值
              onChange={(e) => handleInputChange('wu', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('wu')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.wu}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.wu)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 四爻项 */}
            <span className={`yao-label ${disabledYaos.si ? 'yao-label-disabled' : ''} ${!disabledYaos.si ? 'yao-label-active' : ''}`}>四爻：</span>  {/* 四爻标签 */}
            {/* 四爻输入框 */}
            <input 
              ref={yaoRefs.si}  // 输入框引用
              className={`yao-value ${disabledYaos.si ? 'yao-value-disabled' : ''} ${!disabledYaos.si ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.si}  // 输入值
              onChange={(e) => handleInputChange('si', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('si')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.si}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.si)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 三爻项 */}
            <span className={`yao-label ${disabledYaos.san ? 'yao-label-disabled' : ''} ${!disabledYaos.san ? 'yao-label-active' : ''}`}>三爻：</span>  {/* 三爻标签 */}
            {/* 三爻输入框 */}
            <input 
              ref={yaoRefs.san}  // 输入框引用
              className={`yao-value ${disabledYaos.san ? 'yao-value-disabled' : ''} ${!disabledYaos.san ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.san}  // 输入值
              onChange={(e) => handleInputChange('san', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('san')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.san}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.san)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 二爻项 */}
            <span className={`yao-label ${disabledYaos.er ? 'yao-label-disabled' : ''} ${!disabledYaos.er ? 'yao-label-active' : ''}`}>二爻：</span>  {/* 二爻标签 */}
            {/* 二爻输入框 */}
            <input 
              ref={yaoRefs.er}  // 输入框引用
              className={`yao-value ${disabledYaos.er ? 'yao-value-disabled' : ''} ${!disabledYaos.er ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.er}  // 输入值
              onChange={(e) => handleInputChange('er', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('er')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.er}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.er)}</div>  {/* 爻组件 */}
          </div>
          <div className="yao-item">  {/* 初爻项 */}
            <span className={`yao-label ${disabledYaos.chu ? 'yao-label-disabled' : ''} ${!disabledYaos.chu ? 'yao-label-active' : ''}`}>初爻：</span>  {/* 初爻标签 */}
            {/* 初爻输入框 */}
            <input 
              ref={yaoRefs.chu}  // 输入框引用
              className={`yao-value ${disabledYaos.chu ? 'yao-value-disabled' : ''} ${!disabledYaos.chu ? 'yao-value-active' : ''}`}  // 输入框样式
              type="text"  // 输入类型
              placeholder="待输入"  // 占位符
              value={yaoValues.chu}  // 输入值
              onChange={(e) => handleInputChange('chu', e.target.value)}  // 输入变化事件
              onDoubleClick={() => handleDoubleClick('chu')}  // 双击清空事件
              onInput={handleInputValidation}  // 输入验证事件
              minLength={3}  // 最小长度
              maxLength={3}  // 最大长度
              pattern="\d{3}"  // 正则模式
              disabled={disabledYaos.chu}  // 禁用状态
            />
            <div className="yao-component">{getYaoComponent(yaoOddCounts?.chu)}</div>  {/* 爻组件 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberMethod;  // 导出报数起卦组件
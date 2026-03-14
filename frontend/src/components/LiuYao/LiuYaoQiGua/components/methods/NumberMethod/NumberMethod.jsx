/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/NumberMethod/NumberMethod.jsx
 * @description     报数起卦组件，通过输入数字生成卦象，实现顺序输入
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-02-08 16:30:00
 * @lastModified    2026-03-09 12:48:40
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react';  // 导入 React 核心库和 Hooks
import LiuYaoService from '../../../../../../services/liuyaoService';  // 导入六爻服务层
import commonStyles from '../MethodCommon.desktop.module.css';  // 导入通用样式文件
import YaoDisplay from '../../YaoComponents/YaoDisplay/YaoDisplay';  // 导入 YaoDisplay 组件
import ActionButton from '../../../../components/ActionButton/ActionButton';  // 导入 ActionButton 组件

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
  const [isGenerating, setIsGenerating] = useState(false);  // 跟踪是否正在生成卦象
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
        const timer = setTimeout(() => {
          yaoRefs[yao].current?.focus();  // 聚焦到该爻位输入框
        }, 200);  // 延迟200毫秒
        
        // 清除定时器
        return () => clearTimeout(timer);
      }
    }
  }, [disabledYaos]);  // 依赖 disabledYaos 状态

  /**
   * @description     处理爻位输入变化
   * @param           {string}    yao               爻位名称
   * @param           {string}    value              输入值
   */

  // 处理爻位输入变化
  const handleYaoChange = (yao, value) => {
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
        const timer = setTimeout(() => {
          generateButtonRef.current?.focus();  // 聚焦到生成卦象按钮
        }, 300);  // 延迟300毫秒
        
        // 清除定时器
        return () => clearTimeout(timer);
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
  const handleYaoDoubleClick = (yao) => {
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
    setIsGenerating(false);  // 重置生成状态
    
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
    // 设置为正在生成卦象状态
    setIsGenerating(true);
    
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
    <div className={commonStyles.methodContainer}>  {/* 报数起卦容器 */}
      <div className={commonStyles.contentRow}>  {/* 内容行 */}
        <div className={commonStyles.liuYaoInfo}>  {/* 六爻信息区域 */}
          <div className={commonStyles.contentContainer}>  {/* 内容容器 */}
            <h3>报数起卦：</h3>  {/* 标题 */}
            <p>根据占时的心念，随机填入数字，每爻3个数，可以0开头，随心报数则可。以数字拟六爻阴阳成卦机制，简单快捷。</p>  {/* 描述 */}
            <ol>  {/* 操作步骤列表 */}
              <li>诚心静默，排除杂念。心念占事，勿作他想。</li>  {/* 步骤1 */}
              <li>心念占事，随心报数。每爻三数，六爻卦成。</li>  {/* 步骤2 */}
            </ol>
          </div>
          <div className={commonStyles.divinationActions}>  {/* 操作按钮区域 */}
            <ActionButton
              ref={generateButtonRef}
              type="primary"
              onClick={handleGenerateDivination}
              disabled={!allInputsValid || isGenerating}
              size="medium"
            >
              {isGenerating ? '卦象已成' : '生成卦象'}
            </ActionButton>
            <ActionButton
              type="secondary"
              onClick={handleReset}
              disabled={!hasValidInput}
              size="medium"
            >
              重新报数
            </ActionButton>
          </div>
        </div>
        
        <YaoDisplay
          className={commonStyles.yaoDisplay}
          mode="input"
          yaoValues={yaoValues}
          yaoOddCounts={yaoOddCounts}
          disabledYaos={disabledYaos}
          onYaoChange={handleYaoChange}
          onYaoDoubleClick={handleYaoDoubleClick}
          onYaoInputValidation={handleInputValidation}
          yaoRefs={yaoRefs}
          inputProps={{
            placeholder: '待输入',
            minLength: 3,
            maxLength: 3,
            pattern: '\\d{3}'
          }}
        />
      </div>
    </div>
  );
};

export default NumberMethod;  // 导出报数起卦组件

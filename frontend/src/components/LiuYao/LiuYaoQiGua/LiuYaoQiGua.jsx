// 路径:src/components/LiuYao/LiuYaoQiGua/LiuYaoQiGua.jsx 时间:2026-02-08 12:20
// 功能:六爻起卦主容器组件，协调各子组件的状态和布局
import React, { useState, useRef } from 'react';
import './LiuYaoQiGua.css';
import NavigationSidebar from '../components/NavigationSidebar';
import MethodContent from '../components/MethodContent';
import LiuYaoService from '../../../services/liuyaoService';

const LiuYaoQiGua = () => {
  const [selectedMethod, setSelectedMethod] = useState('逐爻起卦');
  const [yaoValues, setYaoValues] = useState({
    shang: '待生成',
    wu: '待生成',
    si: '待生成',
    san: '待生成',
    er: '待生成',
    chu: '待生成'
  });
  const [yaoOddCounts, setYaoOddCounts] = useState({
    shang: null,
    wu: null,
    si: null,
    san: null,
    er: null,
    chu: null
  });
  const [currentYaoIndex, setCurrentYaoIndex] = useState(0);
  const [isResetEnabled, setIsResetEnabled] = useState(false);
  const [isDivinationButtonEnabled, setIsDivinationButtonEnabled] = useState(false); // 开始排盘按钮状态
  const [threeDigitsArray, setThreeDigitsArray] = useState([]);
  const threeDigitsArrayRef = useRef([]);
  
  // 爻位顺序
  const yaoOrder = ['初', '二', '三', '四', '五', '上'];

  const divinationMethods = [
    '逐爻起卦',
    '一键起卦',
    '报数起卦',
    '指定起卦'
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    // 切换起卦方式时重置所有状态
    setYaoValues({
      shang: '待生成',
      wu: '待生成',
      si: '待生成',
      san: '待生成',
      er: '待生成',
      chu: '待生成'
    });
    setYaoOddCounts({
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    setCurrentYaoIndex(0);
    setIsResetEnabled(false);
    setIsDivinationButtonEnabled(false); // 重置开始排盘按钮状态
    setThreeDigitsArray([]);
    threeDigitsArrayRef.current = [];
  };

  const handleThrow = async () => {
    // 检查是否已完成六次点击
    if (currentYaoIndex >= 6) return;
    
    // 获取当前要投掷的爻位
    const currentYaoName = yaoOrder[currentYaoIndex];
    const yaoKey = LiuYaoService.getYaoKeyMap()[currentYaoName];
    
    console.log(`投掷${currentYaoName}爻`);
    
    try {
      // 调用服务层获取随机数字
      const resultData = await LiuYaoService.generateRandomThreeDigits();
      
      // 打印结果到控制台
      console.log('API响应结果:', resultData);
      
      // 处理数据并更新状态
      const updatedData = LiuYaoService.processYaoData(yaoValues, yaoOddCounts, yaoKey, resultData);
      setYaoValues(updatedData.yaoValues);
      setYaoOddCounts(updatedData.yaoOddCounts);
      
      // 收集three_digits值到数组中
      if (resultData.three_digits) {
        setThreeDigitsArray(prev => {
          const newArray = [...prev, resultData.three_digits];
          threeDigitsArrayRef.current = newArray; // 更新ref引用
          console.log('收集的three_digits数组:', newArray);
          return newArray;
        });
      }
    } catch (error) {
      console.error('请求错误:', error);
    } finally {
      // 无论请求成功与否，都更新点击计数
      const newIndex = currentYaoIndex + 1;
      setCurrentYaoIndex(newIndex);
      // 第一次点击后启用重新投掷按钮
      if (currentYaoIndex === 0) {
        setIsResetEnabled(true);
      }
      // 完成六次投掷后执行排盘
      if (newIndex === 6) {
        setTimeout(async () => {
          try {
            // 使用ref获取最新的数组值
            await LiuYaoService.performDivination(threeDigitsArrayRef.current);
            // 启用开始排盘按钮
            setIsDivinationButtonEnabled(true);
          } catch (error) {
            console.error('排盘失败:', error);
          }
        }, 500); // 延迟执行，确保状态更新完成
      }
    }
  };

  const handleReset = () => {
    setYaoValues({
      shang: '待生成',
      wu: '待生成',
      si: '待生成',
      san: '待生成',
      er: '待生成',
      chu: '待生成'
    });
    // 重置odd_count状态
    setYaoOddCounts({
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    // 重置点击计数
    setCurrentYaoIndex(0);
    // 重置重新投掷按钮状态
    setIsResetEnabled(false);
    // 重置开始排盘按钮状态
    setIsDivinationButtonEnabled(false);
    // 重置three_digits数组
    setThreeDigitsArray([]);
    threeDigitsArrayRef.current = []; // 重置ref引用
    console.log('重置three_digits数组');
  };
  
  // 处理排盘请求
  const handleDivination = async (digitsArray) => {
    if (!digitsArray || digitsArray.length < 6) {
      console.error('排盘失败：需要完成六次投掷');
      return;
    }
    
    console.log('开始排盘，使用的three_digits数组:', digitsArray);
    
    try {
      // 这里可以添加向后端排盘API发起请求的逻辑
      // 例如：
      // const response = await fetch('http://localhost:8000/api/v1/divination', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ numbers: digitsArray })
      // });
      // const result = await response.json();
      // console.log('排盘结果:', result);
      
      console.log('排盘请求已发送，使用参数:', digitsArray);
    } catch (error) {
      console.error('排盘请求错误:', error);
    }
  };

  // 处理一键成卦的状态更新
  const handleOneClickDivination = async (yaoValues, yaoOddCounts, digitsArray) => {
    console.log('处理一键成卦状态更新:', yaoValues, yaoOddCounts, digitsArray);
    
    // 直接更新所有爻位的状态
    setYaoValues(yaoValues);
    setYaoOddCounts(yaoOddCounts);
    
    // 更新 threeDigitsArray（如果提供了digitsArray）
    if (digitsArray && digitsArray.length === 6) {
      setThreeDigitsArray(digitsArray);
      threeDigitsArrayRef.current = digitsArray;
      console.log('一键起卦收集的three_digits数组:', digitsArray);
    }
    
    // 更新状态为完成
    setCurrentYaoIndex(6);
    setIsResetEnabled(true);
    // 启用开始排盘按钮
    setIsDivinationButtonEnabled(true);
    
    console.log('一键成卦状态更新完成');
  };
  
  // 处理报数起卦的状态更新
  const handleNumberDivination = async (yaoValues, yaoOddCounts, digitsArray) => {
    console.log('处理报数起卦状态更新:', yaoValues, yaoOddCounts, digitsArray);
    
    // 直接更新所有爻位的状态
    setYaoValues(yaoValues);
    setYaoOddCounts(yaoOddCounts);
    
    // 更新 threeDigitsArray（如果提供了digitsArray）
    if (digitsArray && digitsArray.length === 6) {
      setThreeDigitsArray(digitsArray);
      threeDigitsArrayRef.current = digitsArray;
      console.log('报数起卦收集的three_digits数组:', digitsArray);
    }
    
    // 更新状态为完成
    setCurrentYaoIndex(6);
    setIsResetEnabled(true);
    // 启用开始排盘按钮
    setIsDivinationButtonEnabled(true);
    
    console.log('报数起卦状态更新完成');
  };
  
  // 处理指定起卦的状态更新
  const handleSpecifiedDivination = async (yaoValues, yaoOddCounts, digitsArray, allPositionsFilled) => {
    console.log('处理指定起卦状态更新:', yaoValues, yaoOddCounts, digitsArray, allPositionsFilled);
    
    // 直接更新所有爻位的状态
    setYaoValues(yaoValues);
    setYaoOddCounts(yaoOddCounts);
    
    // 更新 threeDigitsArray（如果提供了digitsArray）
    if (digitsArray && digitsArray.length === 6) {
      setThreeDigitsArray(digitsArray);
      threeDigitsArrayRef.current = digitsArray;
      console.log('指定起卦收集的three_digits数组:', digitsArray);
    }
    
    // 更新状态为完成
    setCurrentYaoIndex(6);
    setIsResetEnabled(true);
    // 根据是否所有爻位都有合法输入来启用或禁用开始排盘按钮
    setIsDivinationButtonEnabled(!!allPositionsFilled);
    
    console.log('指定起卦状态更新完成');
  };

  return (
    <div className="liu-yao-wrapper">
      <div className="liu-yao-container">
        <NavigationSidebar
          methods={divinationMethods}
          selectedMethod={selectedMethod}
          onMethodSelect={handleMethodSelect}
        />
        <div className="liu-yao-content">
          <MethodContent
            selectedMethod={selectedMethod}
            yaoValues={yaoValues}
            yaoOddCounts={yaoOddCounts}
            onThrow={handleThrow}
            onReset={handleReset}
            onOneClickDivination={handleOneClickDivination}
            onNumberDivination={handleNumberDivination}
            onSpecifiedDivination={handleSpecifiedDivination}
            currentYaoIndex={currentYaoIndex}
            yaoOrder={yaoOrder}
            isResetEnabled={isResetEnabled}
          />
        </div>
      </div>
      <div className="divination-button-container">
        <button 
          className="divination-button" 
          disabled={!isDivinationButtonEnabled}
        >
          开始排盘
        </button>
      </div>
    </div>
  );
};

export default LiuYaoQiGua;
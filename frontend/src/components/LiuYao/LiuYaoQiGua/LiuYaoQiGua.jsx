/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/LiuYaoQiGua.jsx
 * @description     六爻起卦主容器组件，协调各子组件的状态和布局
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-02-19 19:19:49
 * Copyright © All rights reserved
*/

// 导入 React 核心库和 Hooks
import React, {
  useState, // 状态 Hook，用于管理组件状态
  useRef, // ref Hook，用于创建对 DOM 元素或值的引用
  useEffect // 副作用 Hook，用于处理组件挂载、更新和卸载时的操作
} from 'react';  
import './LiuYaoQiGua.css';  // 导入组件样式文件
import NavigationSidebar from '../components/NavigationSidebar';  // 导入侧边导航组件
import MethodContent from '../components/MethodContent';  // 导入方法内容组件
import LiuYaoService from '../../../services/liuyaoService';  // 导入六爻服务层
import { useApp } from '../../../contexts/AppContext';  // 导入应用全局上下文 Hook
import { useLiuyao } from '../../../contexts/LiuyaoContext';  // 导入六爻排盘上下文 Hook

/**
 * @description     六爻起卦主容器组件
 * @return          {JSX}                        六爻起卦界面 JSX 元素
 */

// 定义 LiuYaoQiGua 组件
const LiuYaoQiGua = () => {
  const {
    formData, // 表单数据状态
    timestamp // 时间戳状态
  } = useApp();  // 从应用全局上下文获取状态
  
  const {
    setThreeDigitsArray, // 设置三位数数组方法
    setDivineResult // 设置排盘结果方法
  } = useLiuyao();  // 从六爻排盘上下文获取方法
  
  // 使用 ref 来存储最新的状态值
  const formDataRef = useRef(formData);  // 表单数据的 ref 引用
  const timestampRef = useRef(timestamp);  // 时间戳的 ref 引用
  
  // 当状态更新时，更新 ref 的值
  useEffect(() => {
    formDataRef.current = formData;  // 更新表单数据 ref
  }, [formData]);  // 依赖 formData
  
  useEffect(() => {
    timestampRef.current = timestamp;  // 更新时间戳 ref
  }, [timestamp]);  // 依赖 timestamp
  
  const [selectedMethod, setSelectedMethod] = useState('逐爻起卦');  // 当前选中的起卦方式
  // 爻值状态
  const [yaoValues, setYaoValues] = useState({
    shang: '待生成',
    wu: '待生成',
    si: '待生成',
    san: '待生成',
    er: '待生成',
    chu: '待生成'
  });
  // 爻奇数计数状态
  const [yaoOddCounts, setYaoOddCounts] = useState({
    shang: null,
    wu: null,
    si: null,
    san: null,
    er: null,
    chu: null
  });
  const [currentYaoIndex, setCurrentYaoIndex] = useState(0);  // 当前爻位索引
  const [isResetEnabled, setIsResetEnabled] = useState(false);  // 重置按钮是否启用
  const [isDivinationButtonEnabled, setIsDivinationButtonEnabled] = useState(false);  // 开始排盘按钮状态
  const [isThrowing, setIsThrowing] = useState(false);  // 是否正在投掷（防止并发请求）
  const threeDigitsArrayRef = useRef([]);  // 三位数数组的 ref 引用
  
  const yaoOrder = LiuYaoService.YAO_ORDER;  // 爻位顺序

  // API 基础地址配置
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';  // 从环境变量获取API基础地址，默认为本地地址

  // 起卦方式列表
  const divinationMethods = [
    '逐爻起卦',
    '一键起卦',
    '报数起卦',
    '指定起卦'
  ];

  /**
   * @description     处理起卦方式选择
   * @param           {string}    method            选中的起卦方式
   */

  // 处理起卦方式选择
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);  // 设置选中的起卦方式
    // 切换起卦方式时重置所有状态
    // 重置爻值
    setYaoValues({
      shang: '待生成',
      wu: '待生成',
      si: '待生成',
      san: '待生成',
      er: '待生成',
      chu: '待生成'
    });
    // 重置爻奇数计数
    setYaoOddCounts({
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    setCurrentYaoIndex(0);  // 重置当前爻位索引
    setIsResetEnabled(false);  // 禁用重置按钮
    setIsDivinationButtonEnabled(false);  // 重置开始排盘按钮状态
    setThreeDigitsArray([]);  // 清空三位数数组
    threeDigitsArrayRef.current = [];  // 清空 ref 引用
  };

  /**
   * @description     处理投掷爻位操作
   */

  // 处理投掷爻位操作
  const handleThrow = async () => {
    // 检查是否已完成六次点击或正在投掷中
    if (currentYaoIndex >= 6 || isThrowing) return;  // 如果已完成六次或正在投掷，直接返回
    
    // 设置正在投掷状态
    setIsThrowing(true);  // 防止并发请求
    
    // 获取当前要投掷的爻位
    const currentYaoName = yaoOrder[currentYaoIndex];  // 获取当前爻位名称
    const yaoKey = LiuYaoService.YAO_ORDER_KEYS[currentYaoIndex];  // 获取爻位键值
    
    console.log(`投掷${currentYaoName}爻`);  // 打印投掷信息
    
    // 保存当前索引，用于后续检查
    const currentIndex = currentYaoIndex;  // 保存当前索引
    
    // 发起异步请求，调用服务层生成随机三位数
    try {
      const resultData = await LiuYaoService.generateRandomThreeDigits();  // 调用服务层获取随机数字，生成随机三位数

      console.log('API响应结果:', resultData);  // 打印 API 响应结果
      
      // 处理数据并更新状态
      const updatedData = LiuYaoService.processYaoData(yaoValues, yaoOddCounts, yaoKey, resultData);  // 处理爻数据
      setYaoValues(updatedData.yaoValues);  // 更新爻值状态
      setYaoOddCounts(updatedData.yaoOddCounts);  // 更新爻奇数计数状态
      
      // 收集three_digits值到数组中 - 只有当当前索引小于6时才添加
      // 检查是否有三位数且索引小于6
      if (resultData.three_digits && currentIndex < 6) {
        // 更新三位数数组
        setThreeDigitsArray(prev => {
          // 确保数组长度不超过6
          if (prev.length >= 6) return prev;  // 如果数组长度已达到6，直接返回
          
          const newArray = [...prev, resultData.three_digits];  // 添加新的三位数
          
          threeDigitsArrayRef.current = newArray;  // 更新ref引用
          
          console.log('收集的three_digits数组:', newArray);  // 打印收集的数组

          return newArray;  // 返回新数组
        });
      }
    }
    // 捕获异步请求过程中抛出的任何异常
    catch (error) {
      console.error('请求错误:', error);  // 打印错误信息
    } finally {
      // 无论请求成功与否，都更新点击计数
      const newIndex = currentYaoIndex + 1;  // 计算新索引
      setCurrentYaoIndex(newIndex);  // 更新当前爻位索引

      // 第一次点击后启用重新投掷按钮
      // 如果是第一次点击
      if (currentYaoIndex === 0) {  
        setIsResetEnabled(true);  // 启用重置按钮
      }
      // 完成六次投掷后执行排盘
      // 如果已完成六次投掷
      if (newIndex === 6) {
        // 延迟执行，确保状态更新完成
        setTimeout(() => {
          setIsDivinationButtonEnabled(true);  // 启用排盘按钮
        }, 500);  // 延迟执行，确保状态更新完成
      }
      
      // 重置正在投掷状态
      setIsThrowing(false);  // 允许下次投掷
    }
  };

  /**
   * @description     处理重置操作
   */

  // 处理重置操作
  const handleReset = () => {
    // 重置爻值
    setYaoValues({
      shang: '待生成',
      wu: '待生成',
      si: '待生成',
      san: '待生成',
      er: '待生成',
      chu: '待生成'
    });
    // 重置odd_count状态（重置爻奇数计数）
    setYaoOddCounts({
      shang: null,
      wu: null,
      si: null,
      san: null,
      er: null,
      chu: null
    });
    
    setCurrentYaoIndex(0);  // 重置点击计数（重置当前爻位索引）
    setIsResetEnabled(false);  // 重置重新投掷按钮状态（禁用重置按钮）
    setIsDivinationButtonEnabled(false);  // 重置开始排盘按钮状态（禁用排盘按钮）
    setThreeDigitsArray([]);  // 重置three_digits数组（清空数组）
    threeDigitsArrayRef.current = [];  // 重置ref引用（清空数组）
    
    console.log('重置three_digits数组');  // 打印重置信息
  };
  
  /**
   * @description     处理排盘请求
   * @param           {Array}     digitsArray       三位数数组
   */

  // 处理排盘请求
  const handleDivination = async (digitsArray) => {
    // 检查数组是否有效
    if (!digitsArray || digitsArray.length < 6) {
      console.error('排盘失败：需要完成六次投掷');  // 打印错误信息
      return;  // 直接返回
    }
    
    console.log('开始排盘，使用的three_digits数组:', digitsArray);  // 打印排盘信息
    
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
      
      console.log('排盘请求已发送，使用参数:', digitsArray);  // 打印请求参数
    }
    // 捕获异步请求过程中抛出的任何异常
    catch (error) {
      console.error('排盘请求错误:', error);  // 打印错误信息
    }
  };

  /**
   * @description     处理起卦状态更新的公共逻辑
   * @param           {Object}    yaoValues         爻值对象
   * @param           {Object}    yaoOddCounts      爻奇数计数对象
   * @param           {Array}     digitsArray       三位数数组
   * @param           {boolean}   allPositionsFilled 是否所有爻位都已填充（默认为true）
   */

  // 处理起卦状态更新的公共逻辑
  const handleDivinationUpdate = (yaoValues, yaoOddCounts, digitsArray, allPositionsFilled = true) => {
    setYaoValues(yaoValues);  // 更新爻值状态
    setYaoOddCounts(yaoOddCounts);  // 更新爻奇数计数状态
    
    // 更新 threeDigitsArray（如果提供了digitsArray）
    if (digitsArray && digitsArray.length === 6) {
      setThreeDigitsArray(digitsArray);  // 更新三位数数组
      threeDigitsArrayRef.current = digitsArray;  // 更新ref引用
    }
    
    // 更新状态为完成
    setCurrentYaoIndex(6);  // 设置当前爻位索引为6（完成）
    setIsResetEnabled(true);  // 启用重置按钮
    setIsDivinationButtonEnabled(!!allPositionsFilled);  // 根据填充状态设置按钮启用状态
  };

  /**
   * @description     处理一键成卦的状态更新
   * @param           {Object}    yaoValues         爻值对象
   * @param           {Object}    yaoOddCounts      爻奇数计数对象
   * @param           {Array}     digitsArray       三位数数组
   */

  // 处理一键成卦的状态更新
  const handleOneClickDivination = async (yaoValues, yaoOddCounts, digitsArray) => {
    console.log('处理一键成卦状态更新:', yaoValues, yaoOddCounts, digitsArray);  // 打印状态更新信息
    handleDivinationUpdate(yaoValues, yaoOddCounts, digitsArray);  // 调用公共逻辑
    console.log('一键成卦状态更新完成');  // 打印完成信息
  };
  
  /**
   * @description     处理报数起卦的状态更新
   * @param           {Object}    yaoValues         爻值对象
   * @param           {Object}    yaoOddCounts      爻奇数计数对象
   * @param           {Array}     digitsArray       三位数数组
   */

  // 处理报数起卦的状态更新
  const handleNumberDivination = async (yaoValues, yaoOddCounts, digitsArray) => {
    console.log('处理报数起卦状态更新:', yaoValues, yaoOddCounts, digitsArray);  // 打印状态更新信息
    handleDivinationUpdate(yaoValues, yaoOddCounts, digitsArray);  // 调用公共逻辑
    console.log('报数起卦状态更新完成');  // 打印完成信息
  };
  
  /**
   * @description     处理指定起卦的状态更新
   * @param           {Object}    yaoValues         爻值对象
   * @param           {Object}    yaoOddCounts      爻奇数计数对象
   * @param           {Array}     digitsArray       三位数数组
   * @param           {boolean}   allPositionsFilled 是否所有爻位都已填充
   */

  // 处理指定起卦的状态更新
  const handleSpecifiedDivination = async (yaoValues, yaoOddCounts, digitsArray, allPositionsFilled) => {
    console.log('处理指定起卦状态更新:', yaoValues, yaoOddCounts, digitsArray, allPositionsFilled);  // 打印状态更新信息
    handleDivinationUpdate(yaoValues, yaoOddCounts, digitsArray, allPositionsFilled);  // 调用公共逻辑
    console.log('指定起卦状态更新完成');  // 打印完成信息
  };
  
  /**
   * @description     处理开始排盘按钮点击事件
   */

  // 处理开始排盘按钮点击事件
  const handleStartDivination = async () => {
    
    // 开始排盘：捕获异常并记录错误
    try {
      // 1. 从 ref 获取最新的表单数据和时间数据
      const collectedFormData = formDataRef.current;  // 获取表单数据
      let collectedTimestamp = timestampRef.current;  // 获取时间戳
      
      let requestData;  // 请求数据对象
      // 如果是 Date 对象
      if (collectedTimestamp instanceof Date) {
        // 构造请求数据对象：将时间信息统一格式化为后端接口所需字段
        requestData = {
          numbers: threeDigitsArrayRef.current.map(String),  // 转换为字符串数组
          year: collectedTimestamp.getFullYear(),  // 获取年份
          month: collectedTimestamp.getMonth() + 1,  // 获取月份（0-11，需要+1）
          day: collectedTimestamp.getDate(),  // 获取日期
          hour: collectedTimestamp.getHours(),  // 获取小时
          minute: collectedTimestamp.getMinutes(),  // 获取分钟
          second: collectedTimestamp.getSeconds()  // 获取秒数
        };
      }
      // 如果是普通对象
      else if (collectedTimestamp && typeof collectedTimestamp === 'object') {
        // 将普通对象格式的时间戳解析为后端接口所需的字段
        requestData = {
          numbers: threeDigitsArrayRef.current.map(String),  // 转换为字符串数组
          year: parseInt(collectedTimestamp.year),  // 解析年份
          month: parseInt(collectedTimestamp.month),  // 解析月份
          day: parseInt(collectedTimestamp.day),  // 解析日期
          hour: parseInt(collectedTimestamp.hour),  // 解析小时
          minute: parseInt(collectedTimestamp.minute),  // 解析分钟
          second: parseInt(collectedTimestamp.second)  // 解析秒数
        };
      }
      // 使用当前时间
      else {
        // 如果 collectedTimestamp 既不是 Date 对象也不是普通对象，则使用当前时间构造请求数据
        requestData = {
          numbers: threeDigitsArrayRef.current.map(String),  // 转换为字符串数组
          year: new Date().getFullYear(),  // 获取当前年份
          month: new Date().getMonth() + 1,  // 获取当前月份（0-11，需要+1）
          day: new Date().getDate(),  // 获取当前日期
          hour: new Date().getHours(),  // 获取当前小时
          minute: new Date().getMinutes(),  // 获取当前分钟
          second: new Date().getSeconds()  // 获取当前秒数
        };
      }
      
      // 3. 打印所有传递的数据
      console.log('传递的数据:');  // 打印标题
      console.log('表单数据:', collectedFormData);  // 打印表单数据
      console.log('请求数据:', requestData);  // 打印请求数据
      
      // 4. 调用统一排盘接口
      let divineResult = null;  // 排盘结果
      // 尝试调用后端排盘接口，获取排盘结果
      try {
        // 发起排盘请求
        const divineResponse = await fetch(`${API_BASE_URL}/api/v1/liuyao/assemble-liuya`, {  // 使用环境变量配置的API基础地址
          method: 'POST',  // 请求方法
          // 请求头，指定发送 JSON 格式数据
          headers: {
            'Content-Type': 'application/json'  // 请求头
          },
          body: JSON.stringify(requestData)  // 请求体
        });
        divineResult = await divineResponse.json();  // 解析响应
        console.log('排盘结果:', divineResult);  // 打印排盘结果
        setDivineResult(divineResult);  // 设置排盘结果
      }
      // 处理排盘接口调用失败
      catch (error) {
        console.error('排盘接口调用失败:', error);  // 打印错误信息
      }
      
      // 5. 存储数据到 localStorage
      // 所有数据对象
      const allData = {
        formData: collectedFormData,  // 表单数据
        requestData,  // 请求数据
        divineResult  // 排盘结果
      };
      
      localStorage.setItem('divinationResult', JSON.stringify(allData));  // 存储到本地存储
      
      // 6. 在新标签页中打开结果页面
      window.open('/divination-result', '_blank');  // 打开新标签页
    }
    // 处理开始排盘错误
    catch (error) {
      console.error('开始排盘错误:', error);  // 打印错误信息
    }
  };

  // 7. 返回 JSX 元素
  return (
    <div className="liu-yao-wrapper"> {/* 六爻起卦外层容器 */}
      <div className="liu-yao-container"> {/* 六爻起卦主容器 */}
        {/* 侧边导航组件 */}
        <NavigationSidebar
          methods={divinationMethods} // 起卦方法数组
          selectedMethod={selectedMethod} // 当前选中的起卦方法
          onMethodSelect={handleMethodSelect} // 方法选择回调函数
        />
        <div className="liu-yao-content"> {/* 起卦内容容器 */}
          {/* 起卦方法内容组件 */}
          <MethodContent
            selectedMethod={selectedMethod} // 当前选中的起卦方法
            yaoValues={yaoValues} // 六爻值数组
            yaoOddCounts={yaoOddCounts} // 六爻奇数计数数组
            onThrow={handleThrow} // 抛掷骰子回调函数
            onReset={handleReset} // 重置回调函数
            onOneClickDivination={handleOneClickDivination} // 一键起卦回调函数
            onNumberDivination={handleNumberDivination} // 数字起卦回调函数
            onSpecifiedDivination={handleSpecifiedDivination} // 指定起卦回调函数
            currentYaoIndex={currentYaoIndex} // 当前抛掷的爻索引
            yaoOrder={yaoOrder} // 六爻顺序数组
            isResetEnabled={isResetEnabled} // 是否启用重置按钮
          />
        </div>
      </div>
      <div className="divination-button-container"> {/* 排盘按钮容器 */}
          {/* 排盘按钮 */}
          <button 
            className="divination-button" // 排盘按钮类名
            disabled={!isDivinationButtonEnabled} // 是否禁用排盘按钮
            onClick={handleStartDivination} // 点击事件处理，调用 handleStartDivination 回调
          >
            开始排盘
          </button>
        </div>
    </div>
  );
};

export default LiuYaoQiGua;  // 导出六爻起卦主容器组件
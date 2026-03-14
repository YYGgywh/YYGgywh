/*
 * @file            frontend/src/components/LiuYao/LiuYaoReault/LiuYaoReault.jsx
 * @description     六爻排盘结果展示页面，包含个人信息、卦象信息和补充说明
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-03-13 12:05:00
 * Copyright © All rights reserved
*/

// 导入React核心库和相关hooks
import React, { useEffect, useState, useRef } from 'react';
// 导入桌面端样式（CSS Modules）
import styles from './LiuYaoReault.desktop.module.css';
// 导入四柱展示组件
import FourPillarsDisplay from '../../FourPillarsDisplay/FourPillarsDisplay';
// 导入占卜信息展示组件和简短占卜查询组件
import DivinationInfoDisplay, { BriefDivinationQuery } from '../../DivinationInfo/components/DisplayComponents/DivinationInfoDisplay/DivinationInfoDisplay';


// 导入六爻网格展示组件
import LiuYaoGridDisplay from './LiuYaoGridDisplay/LiuYaoGridDisplay';
// 导入显示控制组件
import DisplayControl from '../../common/DisplayControl/DisplayControl';
// 导入排盘API
import { savePan } from '../../../api/panApi';
// 导入登录状态检查工具
import { isLoggedIn } from '../../../utils/storage';
// 导入起卦方式映射工具
import { methodToEnglish } from '../../../utils/methodMapping';

/**
 * 解析占卜数据
 * @param {string} data - 从localStorage获取的JSON字符串
 * @returns {Object|null} 返回解析后的数据对象，包含divinationData和formData，解析失败返回null
 */
const parseDivinationData = (data) => {
  try {
    // 解析JSON字符串为JavaScript对象
    const parsedData = JSON.parse(data);
    
    // 打印调试信息：传递的数据
    console.log('★传递的数据★:');
    console.log('　F-表单数据:', parsedData.formData);
    
    // 判断是否为新数据结构（通过是否存在requestData字段）
    const isNewDataStructure = !!parsedData.requestData;
    
    if (isNewDataStructure) {
      // 新数据结构处理逻辑
      console.log('　F-请求数据:', parsedData.requestData);
      console.log('　F-起卦三位数数组:', parsedData.requestData?.numbers || []);
      return {
        // 优先使用liuyao_config_data，不存在则使用divineResult
        divinationData: parsedData.divineResult?.liuyao_config_data || parsedData.divineResult,
        formData: parsedData.formData
      };
    } else {
      // 旧数据结构处理逻辑
      console.log(' old-公历时间:', parsedData.calendarData || {});
      console.log(' old-起卦三位数数组:', parsedData.threeDigitsArray || []);
      return {
        divinationData: parsedData.divineResult,
        formData: parsedData.formData
      };
    }
  } catch (error) {
    // 捕获解析异常并输出错误日志
    console.error('解析排盘结果数据失败:', error);
    return null;
  }
};

/**
 * 验证占卜数据结构
 * @param {Object} data - 待验证的占卜数据对象
 * @returns {Object|null} 返回有效的占卜数据对象，验证失败返回null
 */
const validateDivinationData = (data) => {
  // 检查数据是否存在
  if (!data) return null;
  
  // 优先检查并返回liuyao_config_data字段
  if (data.liuyao_config_data) {
    return data.liuyao_config_data;
  }
  
  // 检查是否包含本卦头部和主体数据
  if (data.ben_gua_head && data.ben_gua_body && data.calendar_info) {
    return data;
  }
  
  // 数据结构不符合要求，输出警告并返回null
  console.warn('排盘数据结构不正确:', data);
  return null;
};

/**
 * 六爻排盘结果展示组件
 * 使用React.memo进行性能优化，避免不必要的重新渲染
 * @returns {JSX.Element} 返回排盘结果展示的JSX元素
 */
const LiuYaoReault = React.memo(() => {
  // 占卜数据状态，存储从后端返回的排盘结果
  const [divinationData, setDivinationData] = useState(null);
  // 表单数据状态，存储用户提交的表单信息
  const [formData, setFormData] = useState(null);
  // 错误状态，存储数据加载或解析过程中的错误信息
  const [error, setError] = useState(null);
  // 初始化标志，确保useEffect只执行一次
  const [hasInitialized, setHasInitialized] = useState(false);
  // 显示控制状态，存储激活的按钮ID
  const [activeButtons, setActiveButtons] = useState(['liuqin', 'fuchen', 'yinyang', 'colorChange']);
  // 保存状态，跟踪排盘记录是否已保存
  const [hasSaved, setHasSaved] = useState(false);
  // 保存中状态
  const [saving, setSaving] = useState(false);
  // 使用ref确保只有一个保存请求正在执行
  const saveInProgress = useRef(false);

  /**
   * 自动保存排盘记录
   * @param {Object} panResult - 排盘结果数据
   * @param {Object} panFormData - 排盘表单数据
   */
  const autoSavePanRecord = async (panResult, panFormData) => {
    // 使用ref锁防止并发调用
    if (saveInProgress.current || hasSaved) {
      console.log('排盘记录正在保存或已保存，避免重复调用');
      return;
    }

    saveInProgress.current = true;
    setSaving(true);

    try {
      // 从localStorage获取完整数据，确保保存所有信息
      const originalData = localStorage.getItem('divinationResult');
      let requestData = {};
      
      if (originalData) {
        try {
          const parsedData = JSON.parse(originalData);
          requestData = parsedData.requestData || {};
        } catch (err) {
          console.error('解析原始数据失败:', err);
        }
      }

      // 使用映射工具将中文起卦方式转换为英文标识
      const mappedMethod = methodToEnglish(panFormData?.method) || 'number';

      // 构建完整的排盘参数（避免数据重复）
      const panParams = {
        method: mappedMethod,
        numbers: requestData?.numbers || [], // 起卦三位数数组
        time: {
          year: requestData?.year,
          month: requestData?.month,
          day: requestData?.day,
          hour: requestData?.hour,
          minute: requestData?.minute,
          second: requestData?.second
        }, // 起卦时间
        form_data: panFormData || {} // 完整表单数据
      };

      console.log('保存的排盘参数:', panParams);

      // 调用保存API
      const response = await savePan(
        'liuyao', // 排盘类型
        panParams, // 排盘参数（完整数据）
        panResult, // 排盘结果
        panFormData?.question || '' // 补充说明
      );

      console.log('排盘记录保存成功:', response);
      setHasSaved(true);
    } catch (err) {
      console.error('自动保存排盘记录失败:', err);
      // 保存失败不影响用户查看结果，只在控制台记录错误
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };

  /**
   * 处理显示控制按钮点击事件
   * @param {string} buttonId - 被点击的按钮ID
   */
  const handleDisplayControlClick = (buttonId) => {
    setActiveButtons(prev => {
      if (prev.includes(buttonId)) {
        return prev.filter(id => id !== buttonId);
      } else {
        return [...prev, buttonId];
      }
    });
  };

  /**
   * 组件初始化副作用钩子
   * 从localStorage读取排盘结果数据并初始化组件状态
   * 只在组件首次挂载时执行一次
   */
  useEffect(() => {
    if (!hasInitialized) {
      try {
        // 从localStorage获取排盘结果数据
        const data = localStorage.getItem('divinationResult');
        
        if (data) {
          // 解析并处理排盘数据
          const result = parseDivinationData(data);
          
          if (result) {
            console.log('★后端返回的数据★:');
            console.log('　B-排盘结果:', result.divinationData || null);
            
            // 验证数据结构
            const validatedData = validateDivinationData(result.divinationData);
            
            if (validatedData) {
              // 数据验证通过，更新组件状态
              setDivinationData(validatedData);
              setFormData(result.formData);
              
              // 自动保存排盘记录（仅在用户登录时）
              if (isLoggedIn()) {
                autoSavePanRecord(validatedData, result.formData);
              }
            } else {
              // 数据格式不正确，设置错误状态
              setError(new Error('排盘数据格式不正确'));
            }
          } else {
            // 数据解析失败，设置错误状态
            setError(new Error('解析排盘数据失败'));
          }
        } else {
          // 无数据时的调试日志
          console.log('☆传递的数据☆:');
          console.log('　F-表单数据:', {});
          console.log('　F-请求数据:', {});
          console.log('　F-起卦三位数数组:', []);
          console.log('☆后端返回的数据☆:');
          console.log('　B-排盘结果:', null);
        }
        
      } catch (err) {
        // 捕获并处理数据读取异常
        console.error('读取排盘结果数据失败:', err);
        setError(err);
      }
      
      // 标记组件已初始化，防止重复执行
      setHasInitialized(true);
      // 不要立即删除localStorage，以便在保存时能获取完整数据
      // 延迟删除，确保保存逻辑能获取到数据
      const timer = setTimeout(() => {
        localStorage.removeItem('divinationResult');
      }, 1000);
      
      // 清除定时器
      return () => clearTimeout(timer);
    }
  }, [hasInitialized]); // 移除hasSaved依赖，防止重复执行



  /**
   * 错误状态渲染
   * 当数据加载或解析失败时显示错误信息
   */
  if (error) {
    return (
      <div id="LiuYaoReault" className={styles.liuYaoReaultContainer}>
        <div className="error-message">
          加载失败：{error.message}
        </div>
      </div>
    );
  }

  /**
   * 加载状态渲染
   * 当数据尚未加载完成时显示加载提示
   */
  if (!divinationData) {
    return (
      <div id="LiuYaoReault" className={styles.liuYaoReaultContainer}>
        <div className="loading">加载中...</div>
      </div>
    );
  }

  /**
   * 主内容渲染
   * 数据加载成功后显示完整的排盘结果页面
   */
  return (
    <div id="LiuYaoReault" className={styles.liuYaoReaultContainer}>
      {/* 占卜信息展示组件，显示基本信息 */}
      <DivinationInfoDisplay formData={formData} divinationData={divinationData} />

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.liuYaoInfo}>
            {/* 简短占卜查询组件，显示占卜问题 */}
            <BriefDivinationQuery formData={formData} />
            {/* 四柱展示组件，显示干支信息 */}
            <FourPillarsDisplay
              ganzhiInfo={divinationData.calendar_info?.ganzhi_info || {}}
              isColorMode={activeButtons.includes('colorChange')}
            />

            {/* 六爻网格展示组件，显示卦象信息 */}
            <LiuYaoGridDisplay
              divinationData={divinationData}
              isColorMode={activeButtons.includes('colorChange')}
            />

            {/* 显示控制组件，用于控制展示样式和模式切换 */}
            <DisplayControl
              activeButtons={activeButtons}
              onButtonClick={handleDisplayControlClick}
            />
          </div>

          {/* 补充信息区域，待开发功能 */}
          <div className={styles.supplementInfo}>
            <div className={styles.textBox}>
              <p>求占者补充说明（待开发）</p>
            </div>
            <div className={styles.textBox}>
              <p>待开发</p>
            </div>
            <div className={styles.textBox}>
              <p>待开发</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 导出LiuYaoReault组件供其他模块使用
export default LiuYaoReault;

/*
 * @file            frontend/src/components/LiuYao/LiuYaoReault/LiuYaoReault.jsx
 * @description     六爻排盘结果展示页面，包含个人信息、卦象信息和补充说明
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-10 10:00:00
 * @lastModified    2026-03-16 13:42:38
 * Copyright © All rights reserved
*/

// 导入React核心库和相关hooks
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
// 导入桌面端样式（CSS Modules）
import styles from './LiuYaoReault.desktop.module.css';
// 导入占卜信息展示组件
import DivinationInfoDisplay from '../../DivinationInfo/components/DisplayComponents/DivinationInfoDisplay/DivinationInfoDisplay';
// 导入六爻信息容器组件
import LiuYaoInfoContainer from './LiuYaoInfoContainer/LiuYaoInfoContainer';
// 导入占卜补充信息组件
import DivinationGridAccessory from '../../common/DivinationGridAccessory/DivinationGridAccessory';
// 导入补充说明输入组件
import SupplementInput from '../../common/SupplementInput/SupplementInput';
// 导入排盘API
import { savePan, updatePan, getPanDetail } from '../../../api/panApi';
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
  // 从 URL 参数获取 recordId
  const { recordId: urlRecordId } = useParams();
  
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
  // 补充说明状态
  const [supplement, setSupplement] = useState('');
  // 补充信息相关时间和修改次数
  const [supplementCreateTime, setSupplementCreateTime] = useState(null);
  const [supplementUpdateTime, setSupplementUpdateTime] = useState(null);
  const [supplementModifyCount, setSupplementModifyCount] = useState(0);
  // 排盘记录ID状态（用于更新）
  const [recordId, setRecordId] = useState(urlRecordId || null);
  // 操作状态
  const [operationLoading, setOperationLoading] = useState(false);
  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 自动保存排盘记录
   * @param {Object} panResult - 排盘结果数据
   * @param {Object} panFormData - 排盘表单数据
   * @param {string} supplementText - 补充说明文本
   * @param {boolean} isManualSave - 是否是手动保存（点击按钮）
   */
  const autoSavePanRecord = async (panResult, panFormData, supplementText, isManualSave = false) => {
    // 使用ref锁防止并发调用
    if (saveInProgress.current && !isManualSave) {
      console.log('排盘记录正在保存，避免重复调用');
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
      console.log('保存的补充说明:', supplementText);

      // 根据是否存在 recordId 决定是创建新记录还是更新现有记录
      let response;
      if (recordId) {
        // 更新现有记录
        response = await updatePan(recordId, {
          supplement: supplementText || ''
        });
        console.log('排盘记录更新成功:', response);
      } else {
        // 创建新记录
        response = await savePan(
          'liuyao', // 排盘类型
          panParams, // 排盘参数（完整数据）
          panResult, // 排盘结果
          supplementText || '' // 补充说明
        );
        console.log('排盘记录保存成功:', response);
        if (response?.data?.record_id) {
          setRecordId(response.data.record_id);
        }
      }
      
      // 保存成功后清除草稿
      SupplementInput.clearDraft();
      
      // 只有自动保存时才设置 hasSaved 为 true，手动保存不设置，以便用户可以多次保存
      if (!isManualSave) {
        setHasSaved(true);
      }
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
   * 处理保存操作
   */
  const handleSave = async () => {
    if (!divinationData || !formData) return;
    
    // 检查用户是否登录
    if (!isLoggedIn()) {
      // 非登录用户，在新标签页打开注册/登录页
      window.open('/login', '_blank');
      return;
    }
    
    setOperationLoading(true);
    try {
      await autoSavePanRecord(divinationData, formData, supplement, true);
      console.log('排盘记录保存成功');
      // 登录用户，在新标签页打开用户中心页
      window.open('/user', '_blank');
    } catch (err) {
      console.error('保存排盘记录失败:', err);
      alert('保存失败，请稍后重试');
    } finally {
      setOperationLoading(false);
    }
  };

  /**
   * 处理发布操作
   */
  const handlePublish = async () => {
    if (!divinationData || !formData) return;
    
    // 检查用户是否登录
    if (!isLoggedIn()) {
      // 非登录用户，在新标签页打开注册/登录页
      window.open('/login', '_blank');
      return;
    }
    
    setOperationLoading(true);
    try {
      // 先保存排盘记录
      await autoSavePanRecord(divinationData, formData, supplement, true);
      
      // 然后更新审核状态为已发布
      if (recordId) {
        await updatePan(recordId, {
          audit_status: 1 // 1表示已发布
        });
        console.log('排盘记录发布成功');
      }
      
      // 登录用户，在新标签页打开用户中心页
      window.open('/user', '_blank');
    } catch (err) {
      console.error('发布排盘记录失败:', err);
      alert('发布失败，请稍后重试');
    } finally {
      setOperationLoading(false);
    }
  };

  /**
   * 处理补充说明变化
   */
  const handleSupplementChange = (value) => {
    setSupplement(value);
  };

  /**
   * 从后端加载排盘记录详情
   * 当 URL 中有 recordId 参数时执行
   */
  useEffect(() => {
    const loadPanDetail = async () => {
      if (!urlRecordId) {
        return;
      }

      try {
        setLoading(true);
        console.log('从后端加载排盘记录详情，recordId:', urlRecordId);
        
        const response = await getPanDetail(urlRecordId);
        console.log('后端完整响应:', response);
        console.log('response.data:', response.data);
        
        // 检查响应格式，尝试不同的提取方式
        let record = response.data.data;
        if (!record) {
          // 尝试直接使用 response.data
          record = response.data;
          console.log('使用 response.data 作为记录:', record);
        }
        
        console.log('后端返回的排盘记录:', record);
        
        // 从 pan_params 中提取数据
        const panParams = record?.pan_params || {};
        console.log('提取的 panParams:', panParams);
        
        const panResult = record?.pan_result || {};
        console.log('提取的 panResult:', panResult);
        
        const formData = panParams.form_data || {};
        console.log('提取的 formData:', formData);
        
        // 验证数据结构
        const validatedData = validateDivinationData(panResult);
        
        if (validatedData) {
          // 数据验证通过，更新组件状态
          console.log('更新状态前 - formData:', formData);
          setDivinationData(validatedData);
          setFormData(formData);
          setSupplement(record.supplement || '');
          setSupplementCreateTime(record.supplement_create_time || null);
          setSupplementUpdateTime(record.supplement_update_time || null);
          setSupplementModifyCount(record.supplement_modify_count || 0);
          setRecordId(record.id);
          setHasSaved(true); // 已保存的记录，标记为已保存
          console.log('更新状态后 - formData 状态已设置');
        } else {
          // 数据格式不正确，设置错误状态
          setError(new Error('排盘数据格式不正确'));
        }
      } catch (err) {
        console.error('加载排盘记录详情失败:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPanDetail();
  }, [urlRecordId]);

  /**
   * 组件初始化副作用钩子
   * 从localStorage读取排盘结果数据并初始化组件状态
   * 只在组件首次挂载时执行一次，并且只在没有URL参数时执行
   */
  useEffect(() => {
    if (!hasInitialized && !urlRecordId) {
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
              
              console.log('LiuYaoReault - setFormData:', result.formData);
              
              // 自动保存排盘记录（仅在用户登录时）
              if (isLoggedIn()) {
                autoSavePanRecord(validatedData, result.formData, '');
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
    } else if (!hasInitialized && urlRecordId) {
      // 有URL参数时，只标记已初始化，不执行本地存储读取逻辑
      setHasInitialized(true);
    }
  }, [hasInitialized, urlRecordId]); // 添加 urlRecordId 依赖



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
  if (loading || !divinationData || !formData) {
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
            {/* 六爻信息容器组件，整合所有六爻相关信息的展示 */}
            <LiuYaoInfoContainer
              formData={formData}
              divinationData={divinationData}
              activeButtons={activeButtons}
              onButtonClick={handleDisplayControlClick}
              isColorMode={activeButtons.includes('colorChange')}
            />
          </div>

          {/* 补充信息区域 */}
          <div className={styles.accessoryInfo}>
            <DivinationGridAccessory
              value={supplement}
              onChange={handleSupplementChange}
              onSave={handleSave}
              onPublish={handlePublish}
              loading={operationLoading}
              disabled={false}
              maxLength={500}
              placeholder="请输入补充说明，记录您的求占背景、心境或其他相关信息..."
              autoSave={true}
              supplementCreateTime={supplementCreateTime}
              supplementUpdateTime={supplementUpdateTime}
              supplementModifyCount={supplementModifyCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// 导出LiuYaoReault组件供其他模块使用
// 为 LiuYaoReault 组件添加 displayName，便于在 React DevTools 中调试
LiuYaoReault.displayName = 'LiuYaoReault';

export default LiuYaoReault;

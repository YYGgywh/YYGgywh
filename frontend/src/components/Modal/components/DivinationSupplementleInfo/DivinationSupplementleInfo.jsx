/*
 * @file            frontend/src/components/Modal/components/DivinationSupplementleInfo/DivinationSupplementleInfo.jsx
 * @description     排盘信息展示组件，包含起卦方式和补充信息
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-20 14:03:37
 * Copyright © All rights reserved
*/

// 导入 React
import React from 'react';
// 导入样式文件
import styles from './DivinationSupplementleInfo.desktop.module.css';
// 导入映射工具
import { methodToChinese } from '../../../../utils/methodMapping';
// 导入时间格式化工具
import { formatStandardTime } from '../../../../utils/formatTime';

// 排盘信息组件，接收数据和配置参数作为 props
const DivinationSupplementleInfo = ({ 
  data, // 排盘数据对象
  showMethod = true, // 是否显示起卦方式，默认为 true
  showSupplement = true, // 是否显示补充信息，默认为 true
  showSupplementTime = true, // 是否显示补充信息时间和修改次数，默认为 true
  onEditSupplement, // 编辑补充信息的回调函数
  canEdit = true // 是否可以编辑补充信息，默认为 true
}) => {
  // 调试：打印 data 对象结构
  console.log('DivinationSupplementleInfo data:', data);
  // 解析 pan_params JSON 数据
  const getMethod = () => {
    try {
      // 首先尝试从 data.method 获取
      if (data.method) {
        return methodToChinese(data.method);
      }
      
      // 然后尝试从 data.pan_params 获取
      if (data.pan_params) {
        let panParams;
        
        // 检查 data.pan_params 是字符串还是对象
        if (typeof data.pan_params === 'string') {
          // 处理可能的额外引号问题
          let panParamsStr = data.pan_params;
          // 移除开头和结尾的引号
          if (panParamsStr.startsWith('"') && panParamsStr.endsWith('"')) {
            panParamsStr = panParamsStr.substring(1, panParamsStr.length - 1);
          }
          // 处理转义字符
          panParamsStr = panParamsStr.replace(/\\"/g, '"');
          
          panParams = JSON.parse(panParamsStr);
        } else {
          // 如果已经是对象，直接使用
          panParams = data.pan_params;
        }
        
        // 尝试从 pan_params.method 获取
        if (panParams.method) {
          return methodToChinese(panParams.method);
        }
        
        // 尝试从 pan_params.form_data.method 获取
        if (panParams.form_data && panParams.form_data.method) {
          return panParams.form_data.method;
        }
      }
      
      return "未知";
    } catch (error) {
      console.error('解析 pan_params 失败:', error);
      return "未知";
    }
  };

  const method = getMethod();
  
  // 格式化补充信息，处理换行和缩进
  const formatSupplement = (text) => {
    if (!text) return '求占者暂无任何补充信息……';
    
    return text.split('\n').map((paragraph, index) => {
      // 跳过空行
      if (!paragraph.trim()) return null;
      return (
        <p key={index} className={styles.paragraph}>
          {paragraph}
        </p>
      );
    });
  };
  
  // 渲染组件
  return (
    <div className={styles.divinationInfo}>
      {/* 条件渲染：如果 showMethod 为 true，则显示起卦方式 */}
      {showMethod && (
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>起卦方式：</span>
          <span className={styles.infoValue}>
            {/* 显示起卦方式，如果没有则显示 "未知" */}
            {method}
          </span>
        </div>
      )}
      
      {/* 条件渲染：如果 showSupplement 为 true，则显示补充信息 */}
      {showSupplement && (
        <div className={styles.infoRowSupplement}>
          <div className={styles.infoLabelRow}>
            <span className={styles.infoLabel}>补充信息：</span>
            {canEdit && (
              <button 
                className={styles.editButton}
                onClick={() => onEditSupplement && onEditSupplement(data)}
              >
                编辑
              </button>
            )}
          </div>
          <div className={styles.infoValue}>
            {formatSupplement(data.supplement)}
          </div>
          
          {/* 条件渲染：如果 showSupplementTime 为 true 且有补充信息时间数据，则显示补充信息时间和修改次数 */}
          {showSupplementTime && (data.supplement_create_time || data.supplement_update_time) && (
            <div className={styles.supplementTimeContainer}>
              <span className={styles.supplementTime}>
                {data.supplement_create_time && `创建: ${formatStandardTime(data.supplement_create_time)}`}
                {data.supplement_create_time && data.supplement_update_time && data.supplement_create_time !== data.supplement_update_time && ` | `}
                {data.supplement_update_time && data.supplement_create_time !== data.supplement_update_time && `修改: ${formatStandardTime(data.supplement_update_time)}`}
                {data.supplement_modify_count > 0 && ` (修改 ${data.supplement_modify_count} 次)`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 设置组件的 displayName，便于在 React DevTools 中识别
DivinationSupplementleInfo.displayName = 'DivinationSupplementleInfo';
// 导出组件
export default DivinationSupplementleInfo;
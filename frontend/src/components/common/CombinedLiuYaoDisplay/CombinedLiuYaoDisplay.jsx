/*
 * @file            frontend/src/components/common/CombinedLiuYaoDisplay/CombinedLiuYaoDisplay.jsx
 * @description     整合四柱与六爻排盘的展示组件
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-06 17:00:00
 * @lastModified    2026-03-13 10:00:00
 * Copyright © All rights reserved
*/

import React from "react";
import FourPillarsDisplay from "../../FourPillarsDisplay/FourPillarsDisplay";
import LiuYaoGridDisplay from "../../LiuYao/LiuYaoReault/LiuYaoGridDisplay/LiuYaoGridDisplay";

// 导入桌面端样式
import styles from "./CombinedLiuYaoDisplay.desktop.module.css";

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
  console.warn("排盘数据结构不正确:", data);
  return null;
};

/**
 * 整合四柱与六爻排盘的展示组件
 * 用于在弹窗中展示完整的排盘结果
 * 使用React.memo进行性能优化，避免不必要的重新渲染
 * @param {Object} panResult - 排盘结果数据
 * @returns {JSX.Element} 返回排盘结果展示的JSX元素
 */
const CombinedLiuYaoDisplay = React.memo(({ panResult }) => {
  // 验证排盘结果数据
  const validatedData = validateDivinationData(panResult);

  /**
   * 错误状态渲染
   * 当数据加载或解析失败时显示错误信息
   */
  if (!validatedData) {
    return (
      <div id="CombinedLiuYaoDisplay" className={styles.root}>
        <div className={styles.errorMessage}>
          排盘数据解析失败
        </div>
      </div>
    );
  }

  // 提取四柱信息
  const calendarInfo = validatedData.calendar_info || {};
  const ganzhiInfo = calendarInfo.ganzhi_info || {};

  /**
   * 主内容渲染
   * 数据加载成功后显示完整的排盘结果页面
   */
  return (
    <div id="CombinedLiuYaoDisplay" className={styles.root}>
      <div className={styles.mainContent}> 
        <div className={styles.contentWrapper}>
          <div className={styles.liuYaoInfo}>
            {/* 四柱信息展示 */}
            <div className={styles.fourPillarsSection}>
              <FourPillarsDisplay ganzhiInfo={ganzhiInfo} />
            </div>
            
            {/* 六爻排盘网格展示 */}
            <div className={styles.liuYaoGridSection}>
              <LiuYaoGridDisplay divinationData={validatedData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 导出CombinedLiuYaoDisplay组件供其他模块使用
export default CombinedLiuYaoDisplay;

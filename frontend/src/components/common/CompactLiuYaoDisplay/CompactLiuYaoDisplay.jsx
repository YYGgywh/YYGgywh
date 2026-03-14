/*
 * @file            frontend/src/components/common/CompactLiuYaoDisplay/CompactLiuYaoDisplay.jsx
 * @description     紧凑型六爻排盘结果展示组件，专为卡片设计
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-05 15:00:00
 * @lastModified    2026-03-13 10:30:00
 * Copyright © All rights reserved
*/

// 导入React核心库和相关hooks
import React, { useState } from 'react';
// 导入六爻网格展示组件
import LiuYaoGridDisplay from '../../LiuYao/LiuYaoReault/LiuYaoGridDisplay/LiuYaoGridDisplay';

// 导入桌面端样式
import styles from "./CompactLiuYaoDisplay.desktop.module.css";

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
 * 紧凑型六爻排盘结果展示组件
 * 专为首页卡片设计，显示核心卦象信息
 * 使用React.memo进行性能优化，避免不必要的重新渲染
 * @param {Object} panResult - 排盘结果数据
 * @returns {JSX.Element} 返回排盘结果展示的JSX元素
 */
const CompactLiuYaoDisplay = React.memo(({ panResult }) => {
  // 状态管理
  const [activeButtons, setActiveButtons] = useState(['liuqin', /*'fushen',*/ 'yinyang', 'colorChange', /*'liushen', 'shiying'*/]);

  // 验证排盘结果数据
  const validatedData = validateDivinationData(panResult);

  /**
   * 错误状态渲染
   * 当数据加载或解析失败时显示错误信息
   */
  if (!validatedData) {
    return (
      <div id="CompactLiuYaoDisplay" className={styles.root}>
        <div className={styles.errorMessage}>
          排盘数据解析失败
        </div>
      </div>
    );
  }

  /**
   * 主内容渲染
   * 数据加载成功后显示完整的排盘结果页面
   */
  // 计算需要显示的列
  const showLiuShen = activeButtons.includes('liushen');
  const showShiYing = activeButtons.includes('shiying');
  const showFuShen = activeButtons.includes('fushen');
  
  return (
    <div id="CompactLiuYaoDisplay" className={styles.root}>
      <div className={styles.mainContent}> 
        <div className={styles.contentWrapper}>
          <div className={styles.liuYaoInfo}>
            {/* 六爻网格展示组件，显示卦象信息 */}
            <LiuYaoGridDisplay 
              divinationData={validatedData}
              isColorMode={activeButtons.includes('colorChange')}
              showAccessory={false}  // 隐藏卦身信息等附件内容
              showLiuShen={showLiuShen}
              showShiYing={showShiYing}
              showFuShen={showFuShen}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// 导出CompactLiuYaoDisplay组件供其他模块使用
export default CompactLiuYaoDisplay;

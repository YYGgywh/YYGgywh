/*
 * @file            frontend/src/components/UserCenter/MobileUserCenter/StatsSection/StatsSection.jsx
 * @description     移动端用户中心数据统计组件，显示获赞、互关、关注、粉丝数据
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-30 15:00:00
 * @lastModified    2026-03-30 15:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './StatsSection.mobile.module.css';

/**
 * 移动端用户中心数据统计组件
 * 显示获赞、互关、关注、粉丝数据
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.stats 统计数据对象
 * @param {number} props.stats.likes 获赞数（所有发帖与评论的获赞总和数）
 * @param {number} props.stats.mutualFollows 互关数（对方关注我、我也关注对方的总和数）
 * @param {number} props.stats.follows 关注数（被我关注的总和数）
 * @param {number} props.stats.followers 粉丝数（关注我的总和数）
 * @returns {JSX.Element} 数据统计组件
 */
const StatsSection = ({ stats }) => {
  return (
    <div className={styles.statsSection}>
      <div className={styles.statItem}>
        <span className={styles.statValue}>{stats.likes || 0}</span>
        <span className={styles.statLabel}>获赞</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>{stats.mutualFollows || 0}</span>
        <span className={styles.statLabel}>互关</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>{stats.follows || 0}</span>
        <span className={styles.statLabel}>关注</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statValue}>{stats.followers || 0}</span>
        <span className={styles.statLabel}>粉丝</span>
      </div>
    </div>
  );
};

// PropTypes 类型定义
StatsSection.propTypes = {
  stats: PropTypes.shape({
    likes: PropTypes.number,
    mutualFollows: PropTypes.number,
    follows: PropTypes.number,
    followers: PropTypes.number
  }).isRequired
};

// 组件显示名称
StatsSection.displayName = 'StatsSection';

export default StatsSection;
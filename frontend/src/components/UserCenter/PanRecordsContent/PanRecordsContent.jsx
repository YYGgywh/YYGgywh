/*
 * @file            frontend/src/components/UserCenter/PanRecordsContent/PanRecordsContent.jsx
 * @description     排盘记录内容组件，展示用户的排盘历史记录
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:52:00
 * @lastModified    2026-03-23 20:41:33
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import styles from './PanRecordsContent.desktop.module.css';
import BriefDivinationQuery from '../../DivinationInfo/components/DisplayComponents/BriefDivinationQuery/BriefDivinationQuery';
import CardTags from '../../Card/CardTags/CardTags';
import InteractionButtons from '../../Modal/components/InteractionButtons/InteractionButtons';
import GuaResultDisplay from '../../Card/GuaResultDisplay/GuaResultDisplay';
import Button from '../../common/Button/Button';
import { updatePan } from '../../../api/panApi';

/**
 * 排盘记录内容组件
 * @param {Object} props - 组件属性
 * @param {Array} props.records - 排盘记录列表
 * @param {boolean} props.loading - 是否加载中
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {Function} props.onPageChange - 页码变化回调
 * @param {Function} props.onViewDetail - 查看详情回调
 * @param {Function} props.onLike - 点赞回调
 * @param {Function} props.onCollect - 收藏回调
 * @param {Function} props.onComment - 评论回调
 * @param {Function} props.onShare - 分享回调
 * @param {Function} props.onDelete - 删除回调
 * @param {Function} props.formatTime - 时间格式化函数
 * @param {Function} props.panTypeToChinese - 排盘类型转中文函数
 */
const PanRecordsContent = ({
  records,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetail,
  onLike,
  onCollect,
  onComment,
  onShare,
  onDelete,
  formatTime,
  panTypeToChinese,
  onRefresh
}) => {
  // 加载状态管理
  const [loadingStates, setLoadingStates] = useState({});
  
  // 处理发布/隐藏操作
  const handlePublishToggle = async (record, e) => {
    e.stopPropagation();
    
    // 设置加载状态
    setLoadingStates(prev => ({
      ...prev,
      [record.id]: true
    }));
    
    try {
      // 计算新的审核状态
      const newStatus = record.audit_status === 1 ? 0 : 1;
      
      // 调用API更新状态
      const response = await updatePan(record.id, {
        audit_status: newStatus
      });
      
      if (response.code === 200) {
        // 操作成功，刷新记录列表
        if (onRefresh) {
          onRefresh();
        }
        
        // 显示成功提示
        const action = newStatus === 1 ? '发布' : '隐藏';
        alert(`${action}成功！`);
      } else {
        // 操作失败
        alert('操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('发布/隐藏操作失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      // 清除加载状态
      setLoadingStates(prev => ({
        ...prev,
        [record.id]: false
      }));
    }
  };

  if (loading) {
    return (
      <div className={styles.panRecordsLoading}>
        <div className={styles.loadingSpinner}></div>
        <span>加载中...</span>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className={styles.panRecordsEmpty}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emptyIcon}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0H9v0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>暂无排盘记录</p>
        <span>您还没有进行过任何排盘</span>
      </div>
    );
  }

  return (
    <div className={styles.panRecordsContent}>
      {/* 记录列表 */}
      <div className={styles.recordsList}>
        {records.map((record) => (
          <div 
            key={record.id} 
            className={styles.recordCard}
            onClick={() => onViewDetail && onViewDetail(record)}
            style={{ cursor: 'pointer' }}
          >
            {/* 上半部分：横向布局 */}
            <div className={styles.recordCardTop}>
              {/* 左侧：时间 + 问卜详情 */}
              <div className={styles.recordCardLeft}>
                <BriefDivinationQuery 
                  formData={record.formData || {}}
                  divinationData={record.divinationData || {}}
                  className={styles.briefDivinationQueryMain}
                />
              </div>
              {/* 右侧：卦象结果 */}
              <div className={styles.recordCardRight}>
                <GuaResultDisplay 
                  panResult={record.pan_result}
                />
              </div>
            </div>
            
            {/* 分隔线 */}
            <div className={styles.recordCardDivider}></div>
            
            {/* 下半部分：标签 + 交互按钮 + 操作按钮 */}
            <div className={styles.recordCardBottom}>
              <CardTags 
                tags={record.tags || [panTypeToChinese ? panTypeToChinese(record.pan_type || 'liuyao') : '六爻', '职业']} 
                className={styles.cardTagsMain}
              />
              <InteractionButtons 
                likeCount={record.like_count || 0}
                collectCount={record.collect_count || 0}
                commentCount={record.comment_count || 0}
                viewCount={record.view_count || 0}
                showViewCount={true}
                showShare={true}
                isLiked={record.is_liked || false}
                isCollected={record.is_collected || false}
                variant="default"
                className={styles.interactionButtonsMain}
                readOnly={true}
              />
              <div className={styles.actionButtons}>
                <Button 
                  type={record.audit_status === 1 ? 'primary' : 'confirm'} 
                  size="small"
                  className={styles.publishButton}
                  onClick={(e) => handlePublishToggle(record, e)}
                  loading={loadingStates[record.id]}
                >
                  {record.audit_status === 1 ? '隐藏' : '发布'}
                </Button>
                <Button 
                  type="danger" 
                  size="small"
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) {
                      onDelete(record.id);
                    }
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className={styles.recordsPagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            上一页
          </button>
          <span className={styles.pageInfo}>
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default PanRecordsContent;

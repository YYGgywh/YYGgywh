/*
 * @file            frontend/src/components/Modal/components/CommentsSection/CommentsSection.jsx
 * @description     评论区域组件，包含评论列表和互动功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-18 09:40:16
 * Copyright © All rights reserved
*/

// 导入必要的 React 钩子和工具函数
import React, { useState, useEffect } from 'react';
import { formatStandardTime } from '../../../../utils';
import styles from './CommentsSection.desktop.module.css';

// 评论区域组件，接收数据作为 props
const CommentsSection = ({ data }) => {
  // 状态管理：评论列表数据
  const [comments, setComments] = useState([]);
  // 状态管理：评论数
  const [commentCount, setCommentCount] = useState(0);

  // 虚拟评论数据，用于展示效果
  const mockComments = [
    {
      id: 1,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%201&image_size=square',
      user_nickname: '易经爱好者',
      create_time: new Date(Date.now() - 3600000).toISOString(), // 1小时前
      location: '北京',
      content: '这个卦象非常有意思，我之前也遇到过类似的情况，确实很准！',
      like_count: 12,
      reply_count: 2,
      is_author: false
    },
    {
      id: 2,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%202&image_size=square',
      user_nickname: '风水大师',
      create_time: new Date(Date.now() - 7200000).toISOString(), // 2小时前
      location: '上海',
      content: '从卦象来看，近期可能会有一些变动，建议保持低调，等待时机。',
      like_count: 8,
      reply_count: 1,
      is_author: false
    },
    {
      id: 3,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%203&image_size=square',
      user_nickname: '易学初学者',
      create_time: new Date(Date.now() - 10800000).toISOString(), // 3小时前
      location: '广东',
      content: '请问大师，这个卦象的变爻如何解读？我不太明白其中的含义。',
      like_count: 5,
      reply_count: 3,
      is_author: false
    },
    {
      id: 4,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%204&image_size=square',
      user_nickname: '命理专家',
      create_time: new Date(Date.now() - 14400000).toISOString(), // 4小时前
      location: '江苏',
      content: '此卦象显示近期有贵人相助，可把握机会，放手一搏。',
      like_count: 15,
      reply_count: 4,
      is_author: false
    },
    {
      id: 5,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%205&image_size=square',
      user_nickname: '卦象研究者',
      create_time: new Date(Date.now() - 18000000).toISOString(), // 5小时前
      location: '浙江',
      content: '从五行相生相克的角度来看，此卦象非常有利，尤其是在事业方面。',
      like_count: 9,
      reply_count: 2,
      is_author: false
    },
    {
      id: 6,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%206&image_size=square',
      user_nickname: '易经入门者',
      create_time: new Date(Date.now() - 21600000).toISOString(), // 6小时前
      location: '四川',
      content: '感谢分享，学习了很多，希望能看到更多类似的分析。',
      like_count: 4,
      reply_count: 0,
      is_author: false
    },
    {
      id: 7,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%207&image_size=square',
      user_nickname: '占卜爱好者',
      create_time: new Date(Date.now() - 25200000).toISOString(), // 7小时前
      location: '湖北',
      content: '这个卦象我之前也卜过，结果确实和大师说的一样，太神奇了！',
      like_count: 11,
      reply_count: 1,
      is_author: false
    },
    {
      id: 8,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%208&image_size=square',
      user_nickname: '易学研究者',
      create_time: new Date(Date.now() - 28800000).toISOString(), // 8小时前
      location: '湖南',
      content: '从卦象的变爻来看，近期可能会有一些意外的收获，值得期待。',
      like_count: 7,
      reply_count: 2,
      is_author: false
    },
    {
      id: 9,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%209&image_size=square',
      user_nickname: '风水顾问',
      create_time: new Date(Date.now() - 32400000).toISOString(), // 9小时前
      location: '河南',
      content: '建议在西北角摆放一些绿植，有助于增强运势。',
      like_count: 6,
      reply_count: 1,
      is_author: false
    },
    {
      id: 10,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2010&image_size=square',
      user_nickname: '易经大师',
      create_time: new Date(Date.now() - 36000000).toISOString(), // 10小时前
      location: '山东',
      content: '此卦象为吉兆，近期会有好消息传来，保持积极心态。',
      like_count: 20,
      reply_count: 5,
      is_author: true
    },
    {
      id: 11,
      user_avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2011&image_size=square',
      user_nickname: '命理爱好者',
      create_time: new Date(Date.now() - 39600000).toISOString(), // 11小时前
      location: '河北',
      content: '大师分析得非常透彻，学习了，谢谢分享！',
      like_count: 3,
      reply_count: 0,
      is_author: false
    }
  ];

  // 初始化评论数据，在组件挂载时执行
  useEffect(() => {
    // 设置评论列表为虚拟数据
    setComments(mockComments);
    // 设置评论数为虚拟评论的长度
    setCommentCount(mockComments.length);
  }, []); // 空依赖数组，表示只在组件挂载时执行一次



  // 确定要显示的评论数据：优先使用传入的真实数据，否则使用虚拟数据
  const displayComments = data?.comments && data.comments.length > 0 ? data.comments : comments;
  // 确定要显示的评论数：优先使用传入的真实数据，否则使用状态中的评论数
  const displayCommentCount = data?.comment_count || commentCount;

  // 渲染组件
  return (
    <div className={styles.commentsSection}>
      {/* 评论列表区域 */}
      <div className={styles.commentsList}>
        {/* 评论标题和计数 */}
        <h3>评论 ({displayCommentCount})</h3>
        {/* 根据评论数据渲染评论列表 */}
        {displayComments.length > 0 ? (
          displayComments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              {/* 用户头像 */}
              <div className={styles.commentUserAvatar}>
                <img
                  src={comment.user_avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij7lm688L3RleHQ+PC9zdmc+"}
                  alt={comment.user_nickname}
                />
              </div>
              {/* 评论内容区域 */}
              <div className={styles.commentContentSection}>
                {/* 评论头部信息 */}
                <div className={styles.commentHeader}>
                  {/* 左侧：用户名和作者标识 */}
                  <div className={styles.commentHeaderLeft}>
                    <span className={styles.commentUserName}>{comment.user_nickname}</span>
                    {comment.is_author && <span className={styles.authorBadge}>作者</span>}
                  </div>
                  {/* 右侧：时间和地点 */}
                  <div className={styles.commentHeaderRight}>
                    <span className={styles.commentTime}>{formatStandardTime(comment.create_time)}</span>
                    {comment.location && <span className={styles.commentLocation}>{comment.location}</span>}
                  </div>
                </div>
                {/* 评论内容 */}
                <div className={styles.commentText}>{comment.content}</div>
                {/* 评论操作按钮 */}
                <div className={styles.commentActions}>
                  {/* 点赞按钮 */}
                  <button className={styles.commentActionBtn}>
                    <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span className={styles.actionCount}>{comment.like_count || 0}</span>
                  </button>
                  {/* 回复按钮 */}
                  <button className={styles.commentActionBtn}>
                    <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className={styles.actionCount}>{comment.reply_count || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // 如果没有评论，显示提示信息
          <div className={styles.noComments}>
            暂无评论，快来抢沙发吧！
          </div>
        )}
      </div>


    </div>
  );
};

// 设置组件的displayName，便于在React DevTools中识别
CommentsSection.displayName = 'CommentsSection';
// 导出组件
export default CommentsSection;
/*
 * @file            frontend/src/pages/HomePage.jsx
 * @description     首页组件 - 显示公开排盘记录列表，支持瀑布流布局和交互功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-05 13:38:55
 * @lastModified    2026-03-07 16:36:49
 * Copyright © All rights reserved
*/

/* eslint-disable */
// 禁用 ESLint 检查，允许某些代码风格
import React, { useState, useEffect } from 'react'; // 导入 React 核心库和 Hooks：useState（状态管理）、useEffect（副作用处理）
import Navigation from '../components/Header/Navigation/Navigation'; // 导入导航栏组件
import BackToTop from '../components/BackToTop'; // 导入返回顶部按钮组件
import { getPublicPanList } from '../api/panApi'; // 导入获取公开排盘列表的 API 接口
import hexagram1 from '../assets/images/hexagram-1.svg'; // 导入卦象图片资源 1
import hexagram2 from '../assets/images/hexagram-2.svg'; // 导入卦象图片资源 2
import hexagram3 from '../assets/images/hexagram-3.svg'; // 导入卦象图片资源 3
import hexagram4 from '../assets/images/hexagram-4.svg'; // 导入卦象图片资源 4
import avatar1 from '../assets/images/avatar-1.svg'; // 导入用户头像图片资源 1
import avatar2 from '../assets/images/avatar-2.svg'; // 导入用户头像图片资源 2
import avatar3 from '../assets/images/avatar-3.svg'; // 导入用户头像图片资源 3
import avatar4 from '../assets/images/avatar-4.svg'; // 导入用户头像图片资源 4
import avatar5 from '../assets/images/avatar-5.svg'; // 导入用户头像图片资源 5
import avatar6 from '../assets/images/avatar-6.svg'; // 导入用户头像图片资源 6
import avatar7 from '../assets/images/avatar-7.svg'; // 导入用户头像图片资源 7
import avatar8 from '../assets/images/avatar-8.svg'; // 导入用户头像图片资源 8
import avatar9 from '../assets/images/avatar-9.svg'; // 导入用户头像图片资源 9
import avatar10 from '../assets/images/avatar-10.svg'; // 导入用户头像图片资源 10
// 导入样式文件 - CSS Modules（桌面端样式）
import styles from './HomePage.desktop.module.css'; // 导入桌面端样式模块
// 移动端样式模块暂不导入，避免变量冲突
import LikeButton from '../components/common/LikeButton'; // 导入点赞按钮组件
import { getUserInfo } from '../utils/storage'; // 导入获取用户信息的工具函数
import CompactLiuYaoDisplay from '../components/common/CompactLiuYaoDisplay'; // 导入紧凑型六爻显示组件
import PanDetailModal from '../components/Modal/PanDetailModal'; // 导入排盘详情弹窗组件

/**
 * 首页组件 - HomePage
 * 功能：显示公开排盘记录列表，支持瀑布流布局、卡片点击、点赞等交互
 */
const HomePage = () => {
  // ==================== 状态管理 ====================
  // panRecords: 存储排盘记录列表，初始值为空数组
  const [panRecords, setPanRecords] = useState([]);
  // loading: 控制加载状态，初始值为 true（加载中）
  const [loading, setLoading] = useState(true);
  // error: 存储错误信息，初始值为 null（无错误）
  const [error, setError] = useState(null);
  // showModal: 控制弹窗显示状态，初始值为 false（不显示）
  const [showModal, setShowModal] = useState(false);
  // selectedPanData: 存储当前选中的排盘数据，初始值为 null（未选中）
  const [selectedPanData, setSelectedPanData] = useState(null);

  // ==================== 事件处理函数 ====================
  // 处理卡片点击事件
  const handleCardClick = (item) => {
    // 设置当前选中的排盘数据
    setSelectedPanData(item);
    // 显示详情弹窗
    setShowModal(true);
  };

  // 处理弹窗关闭事件
  const handleModalClose = () => {
    // 隐藏详情弹窗
    setShowModal(false);
    // 清空选中的排盘数据
    setSelectedPanData(null);
  };

  // ==================== 静态资源 ====================
  // 头像和卦象图片资源
  const avatarImages = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10]; // 用户头像数组，共10个
  const hexagramImages = [hexagram1, hexagram2, hexagram3, hexagram4]; // 卦象图片数组，共4个

  // 标签数据 - 可用于排盘记录的标签池
  const availableTags = ["学习", "心得", "实例", "解析", "八卦", "详解", "梅花易数", "技巧", "风水", "居家", "八字", "命理", "奇门遁甲", "教程", "面相", "运势", "姓名学", "起名", "塔罗牌", "占卜"];

  // ==================== 数据获取函数 ====================
  // 获取公开排盘记录
  const fetchPanRecords = async () => {
    try {
      // 设置加载状态为 true，显示加载动画
      setLoading(true);
      // 获取当前登录用户信息
      const userInfo = getUserInfo();
      // 提取用户 ID，兼容不同的字段名（id 或 user_id）
      const userId = userInfo?.id || userInfo?.user_id;
      
      // 调用 API 获取公开排盘列表
      const response = await getPublicPanList({
        page: 1, // 页码：第1页
        size: 12, // 每页数量：12条
        sort: "newest", // 排序方式：最新优先
        pan_type: "liuyao", // 排盘类型：六爻
        user_id: userId // 用户 ID：用于个性化推荐
      });

      // 检查 API 响应是否成功
      if (response.code === 200 || response.success) {
        // 处理API返回的数据，提取记录列表
        const records = response.data || [];
        
        // 格式化数据，确保与组件期望的结构一致
        const formattedRecords = records.map((record, index) => {
          // 初始化排盘参数和结果对象
          let panParams = {};
          let panResult = {};
          try {
            // 解析排盘参数：如果是字符串则解析为对象，否则直接使用
            panParams = typeof record.pan_params === 'string' ? JSON.parse(record.pan_params) : record.pan_params || {};
            // 解析排盘结果：如果是字符串则解析为对象，否则直接使用
            panResult = typeof record.pan_result === 'string' ? JSON.parse(record.pan_result) : record.pan_result || {};
          } catch (e) {
            // 解析失败时输出错误日志
            console.error('解析排盘数据失败:', e);
          }

          // 生成随机标签（用于演示）
          const randomTags = [];
          const tagCount = Math.floor(Math.random() * 2) + 1; // 随机生成 1-2 个标签
          for (let i = 0; i < tagCount; i++) {
            // 从标签池中随机选择标签
            const randomTag = availableTags[Math.floor(Math.random() * availableTags.length)];
            // 避免重复标签
            if (!randomTags.includes(randomTag)) {
              randomTags.push(randomTag);
            }
          }

          // 返回格式化后的记录对象
          return {
            id: record.id, // 记录 ID
            title: record.supplement || panParams.question || "未填写标题", // 标题：优先使用补充信息，其次使用问题，最后使用默认值
            tags: randomTags, // 随机生成的标签
            user_nickname: record.user?.nickname || "匿名用户", // 用户昵称：优先使用用户昵称，否则使用默认值
            user_avatar: record.user?.avatar_url || avatarImages[index % avatarImages.length], // 用户头像：优先使用用户头像，否则使用默认头像数组
            create_time: record.create_time, // 创建时间
            hexagram_image: hexagramImages[index % hexagramImages.length], // 卦象图片：根据索引循环使用卦象数组
            like_count: record.like_count || 0, // 点赞数：默认为 0
            collect_count: record.collect_count || 0, // 收藏数：默认为 0
            view_count: record.view_count || 0, // 浏览数：默认为 0
            comment_count: record.comment_count || 0, // 评论数：默认为 0
            is_liked: record.is_liked || false, // 是否已点赞：默认为 false
            pan_result: panResult // 排盘结果对象
          };
        });

        // 更新排盘记录状态
        setPanRecords(formattedRecords);
      } else {
        // API 响应失败，抛出错误
        throw new Error(response.msg || "获取排盘记录失败");
      }
    } catch (error) {
      // 捕获错误并输出日志
      console.error('获取排盘记录失败:', error);
      // 设置错误状态
      setError(error.message || "网络错误，请稍后重试");
      
      // ==================== 备用方案 ====================
      // 当 API 调用失败时，使用静态数据作为备用方案
      const fallbackRecords = [
        {
          id: 1, // 记录 ID
          title: "学习易经心得分享，如何快速入门", // 标题
          tags: ["学习", "心得"], // 标签
          user_nickname: "易经爱好者", // 用户昵称
          user_avatar: avatar1, // 用户头像
          create_time: new Date(Date.now() - 3600000).toISOString(), // 创建时间：1小时前
          hexagram_image: hexagram1, // 卦象图片
          like_count: 234, // 点赞数
          collect_count: 156, // 收藏数
          view_count: 3500, // 浏览数
          comment_count: 67, // 评论数
          is_liked: false // 是否已点赞
        },
        {
          id: 2, // 记录 ID
          title: "六爻排盘实例解析，初学者必看", // 标题
          tags: ["实例", "解析"], // 标签
          user_nickname: "易学大师", // 用户昵称
          user_avatar: avatar2, // 用户头像
          create_time: new Date(Date.now() - 7200000).toISOString(), // 创建时间：2小时前
          hexagram_image: hexagram2, // 卦象图片
          like_count: 567, // 点赞数
          collect_count: 342, // 收藏数
          view_count: 8900, // 浏览数
          comment_count: 123, // 评论数
          is_liked: false // 是否已点赞
        }
      ];
      // 设置备用数据
      setPanRecords(fallbackRecords);
    } finally {
      // 无论成功或失败，都设置加载状态为 false
      setLoading(false);
    }
  };

  // ==================== 副作用处理 ====================
  // 组件挂载时获取数据
  useEffect(() => {
    // 调用数据获取函数
    fetchPanRecords();
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // ==================== 渲染函数 ====================
  // 渲染排盘记录
  const renderPanRecords = () => {
    // 加载状态：显示加载动画
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          {/* 加载动画 */}
          <div className={styles.loadingSpinner}></div>
          {/* 加载提示文本 */}
          <p>加载中...</p>
        </div>
      );
    }

    // 错误状态：显示错误信息和重试按钮
    if (error) {
      return (
        <div className={styles.errorContainer}>
          {/* 错误信息 */}
          <p>{error}</p>
          {/* 重试按钮 */}
          <button className={styles.retryButton} onClick={fetchPanRecords}>
            重试
          </button>
        </div>
      );
    }

    // 空状态：显示暂无数据提示
    if (panRecords.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          {/* 空状态提示 */}
          <p>暂无排盘记录</p>
        </div>
      );
    }

    // 正常状态：显示排盘记录列表
    return (
      <div className={styles.waterfallContainer}>
        {/* 瀑布流网格布局 */}
        <div className={styles.waterfallGrid}>
          {/* 遍历排盘记录，渲染每个卡片 */}
          {panRecords.map((item) => (
            <div 
              key={item.id} // 使用记录 ID 作为唯一 key
              className={styles.waterfallCard} // 卡片样式
              onClick={() => handleCardClick(item)} // 点击事件：显示详情弹窗
              style={{ cursor: 'pointer' }} // 鼠标样式：手型光标
            >
              {/* 卡片图片容器 */}
              <div className={styles.cardImageContainer}>
                {/* 六爻排盘结果可视化展示 */}
                <div className={styles.hexagramDisplay}>
                  {/* 如果有本卦卦体，显示紧凑型六爻组件 */}
                  {item.pan_result?.ben_gua_body ? (
                    <CompactLiuYaoDisplay panResult={item.pan_result} />
                  ) : (
                    // 否则显示占位符 
                    <div className={styles.hexagramPlaceholder}>
                      <div className={styles.placeholderContent}>
                        <span>六爻卦象</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* 如果有标签，显示标签 */}
                {item.tags && item.tags.length > 0 && (
                  <div className={styles.cardTags}>
                    {/* 最多显示2个标签 */}
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className={styles.cardTag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 卡片内容区域 */}
              <div className={styles.cardContent}>
                {/* 卡片标题 */}
                <h3 className={styles.cardTitle}>{item.title}</h3>
                
                {/* 卡片元信息：用户信息和发布时间 */}
                <div className={styles.cardMeta}>
                  {/* 用户信息 */}
                  <div className={styles.userInfo}>
                    {/* 用户头像 */}
                    <div className={styles.userAvatar}>
                      <img src={item.user_avatar} alt={item.user_nickname} />
                    </div>
                    {/* 用户昵称 */}
                    <span className={styles.userName}>{item.user_nickname}</span>
                  </div>
                  
                  {/* 发布时间 */}
                  <span className={styles.postTime}>2小时前</span>
                </div>
                
                {/* 卡片统计信息：点赞等 */}
                <div className={styles.cardStats}>
                  {/* 点赞按钮组件 */}
                  <LikeButton
                    panId={item.id} // 排盘记录 ID
                    isLiked={item.is_liked || false} // 是否已点赞
                    likeCount={item.like_count || 0} // 点赞数
                    onLikeSuccess={(newLiked, newCount) => {
                      // 点赞成功后的回调，可以更新本地数据
                      console.log('点赞成功 - 状态:', newLiked, '数量:', newCount);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== 组件渲染 ====================
  // 返回组件的 JSX 结构
  return (
    <div className={styles.appContainer}>
      {/* 页面头部：固定导航栏 */}
      <header className={styles.appHeader}>
        {/* 导航栏组件 */}
        <Navigation />
      </header>
      
      {/* 页面主内容区域 */}
      <main className={styles.appMain}>
        {/* 首页容器：包含推荐标签和瀑布流内容 */}
        <div className={styles.homeContainer}>
          {/* 推荐标签栏 */}
          <div className={styles.recommendedTags}>
            {/* 全部标签 - 激活状态 */}
            <div className={`${styles.tagItem} ${styles.active}`}>全部</div>
            {/* 六爻标签 */}
            <div className={styles.tagItem}>六爻</div>
            {/* 四柱标签 */}
            <div className={styles.tagItem}>四柱</div>
            {/* 风水标签 */}
            <div className={styles.tagItem}>风水</div>
            {/* 命理标签 */}
            <div className={styles.tagItem}>命理</div>
            {/* 占卜标签 */}
            <div className={styles.tagItem}>占卜</div>
          </div>
          
          {/* 瀑布流容器：根据状态渲染加载、错误、空状态或正常内容 */}
          {renderPanRecords()}
        </div>
      </main>
      
      {/* 返回顶部按钮 */}
      <BackToTop />
      
      {/* 排盘详情弹窗 */}
      <PanDetailModal
        isOpen={showModal} /* 控制弹窗显示/隐藏 */
        onClose={handleModalClose} /* 关闭弹窗的回调函数 */
        data={selectedPanData} /* 传递给弹窗的排盘数据 */
      />
    </div>
  );
};

// 导出 HomePage 组件作为默认导出
export default HomePage;

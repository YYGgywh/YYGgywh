/*
 * @file            frontend/src/test/CommentTestPage.jsx
 * @description     评论区功能测试页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-21 12:00:00
 * @lastModified    2026-03-21 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { addComment, listComment, updateComment, deleteComment } from '../api/commentApi';
import { getFrontendToken } from '../utils/storage';
import Avatar from '../components/common/Avatar';
import styles from './CommentTestPage.module.css';

const CommentTestPage = () => {
  // 状态管理
  const [panRecordId, setPanRecordId] = useState(1);
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 表单状态
  const [newContent, setNewContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);

  // 检查登录状态
  const token = getFrontendToken();
  
  // 加载评论列表
  const loadComments = async () => {
    if (!token) {
      setError('请先登录');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await listComment(panRecordId, page, size);
      if (response.code === 200) {
        setComments(response.data.list);
        setTotal(response.data.total);
      } else {
        setError(response.msg || '加载失败');
      }
    } catch (err) {
      setError(err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadComments();
  }, [panRecordId, page]);

  // 添加评论
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newContent.trim()) {
      alert('请输入评论内容');
      return;
    }
    
    if (newContent.length > 1000) {
      alert('评论内容不能超过1000字符');
      return;
    }
    
    try {
      const response = await addComment(panRecordId, newContent, isPublic);
      if (response.code === 200) {
        alert('评论添加成功！');
        setNewContent('');
        setIsPublic(false);
        loadComments(); // 刷新列表
      } else {
        alert(response.msg || '添加失败');
      }
    } catch (err) {
      alert(err.message || '添加失败');
    }
  };

  // 开始编辑
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setEditIsPublic(comment.is_public);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditIsPublic(false);
  };

  // 更新评论
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) {
      alert('请输入评论内容');
      return;
    }
    
    if (editContent.length > 1000) {
      alert('评论内容不能超过1000字符');
      return;
    }
    
    try {
      const response = await updateComment(editingId, editContent, editIsPublic);
      if (response.code === 200) {
        alert('评论更新成功！');
        setEditingId(null);
        loadComments(); // 刷新列表
      } else {
        alert(response.msg || '更新失败');
      }
    } catch (err) {
      alert(err.message || '更新失败');
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) {
      return;
    }
    
    try {
      const response = await deleteComment(commentId);
      if (response.code === 200) {
        alert('评论删除成功！');
        loadComments(); // 刷新列表
      } else {
        alert(response.msg || '删除失败');
      }
    } catch (err) {
      alert(err.message || '删除失败');
    }
  };

  // 格式化时间戳
  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  // 未登录提示
  if (!token) {
    return (
      <div className={styles.container}>
        <h1>评论区功能测试</h1>
        <div className={styles.error}>
          <p>⚠️ 请先登录后再进行测试</p>
          <button onClick={() => window.location.href = '/login'}>
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>评论区功能测试</h1>
      
      {/* 配置区域 */}
      <div className={styles.configSection}>
        <label>
          排盘记录ID：
          <input
            type="number"
            value={panRecordId}
            onChange={(e) => setPanRecordId(Number(e.target.value))}
            min={1}
          />
        </label>
        <button onClick={loadComments} disabled={loading}>
          {loading ? '加载中...' : '刷新列表'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={styles.error}>
          <p>❌ {error}</p>
        </div>
      )}

      {/* 添加评论表单 */}
      <div className={styles.addSection}>
        <h2>添加评论</h2>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="请输入评论内容（1-1000字符）"
            maxLength={1000}
            rows={4}
          />
          <div className={styles.charCount}>
            {newContent.length} / 1000 字符
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            公开评论
          </label>
          <button type="submit" disabled={!newContent.trim()}>
            添加评论
          </button>
        </form>
      </div>

      {/* 评论列表 */}
      <div className={styles.listSection}>
        <h2>
          评论列表
          <span className={styles.total}>（共 {total} 条）</span>
        </h2>
        
        {loading ? (
          <p className={styles.loading}>加载中...</p>
        ) : comments.length === 0 ? (
          <p className={styles.empty}>暂无评论</p>
        ) : (
          <>
            <div className={styles.commentList}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  {editingId === comment.id ? (
                    // 编辑模式
                    <form onSubmit={handleUpdateComment} className={styles.editForm}>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={1000}
                        rows={3}
                      />
                      <div className={styles.charCount}>
                        {editContent.length} / 1000 字符
                      </div>
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={editIsPublic}
                          onChange={(e) => setEditIsPublic(e.target.checked)}
                        />
                        公开评论
                      </label>
                      <div className={styles.actions}>
                        <button type="submit">保存</button>
                        <button type="button" onClick={cancelEdit} className={styles.cancel}>
                          取消
                        </button>
                      </div>
                    </form>
                  ) : (
                    // 展示模式
                    <>
                      <div className={styles.commentHeader}>
                        <div className={styles.userInfo}>
                          <Avatar 
                            src={comment.user_avatar}
                            alt={comment.user_nickname}
                            size="small"
                            nickname={comment.user_nickname}
                          />
                          <span className={styles.userName}>
                            {comment.user_nickname}
                            {comment.is_author && <span className={styles.authorBadge}>作者</span>}
                          </span>
                        </div>
                        <span className={styles.time}>
                          {formatTime(comment.create_time)}
                        </span>
                        <span className={styles.visibility}>
                          {comment.is_public ? '🌐 公开' : '🔒 私密'}
                        </span>
                      </div>
                      <div className={styles.commentContent}>
                        {comment.content}
                      </div>
                      <div className={styles.actions}>
                        <button onClick={() => startEdit(comment)}>
                          编辑
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className={styles.delete}
                        >
                          删除
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 分页 */}
            {total > size && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  上一页
                </button>
                <span>
                  第 {page} 页 / 共 {Math.ceil(total / size)} 页
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / size)}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 调试信息 */}
      <div className={styles.debugSection}>
        <h3>调试信息</h3>
        <pre>{JSON.stringify({ comments, total, page }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CommentTestPage;

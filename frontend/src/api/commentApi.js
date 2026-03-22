/*
 * @file            frontend/src/api/commentApi.js
 * @description     评论相关接口（添加、查询、更新、删除）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-21 14:30:00
 * Copyright © All rights reserved
*/

import api from './index';

// 添加评论
export const addComment = async (panRecordId, content, isPublic = false) => {
  const response = await api.post('/comment/add', {
    pan_record_id: panRecordId,
    content,
    is_public: isPublic
  });
  return response;
};

// 查询评论列表
export const listComment = async (panRecordId, page = 1, size = 10) => {
  const response = await api.get('/comment/list', {
    params: {
      pan_record_id: panRecordId,
      page,
      size
    }
  });
  return response;
};

// 更新评论
export const updateComment = async (commentId, content, isPublic) => {
  const response = await api.post('/comment/update', {
    comment_id: commentId,
    content,
    is_public: isPublic
  });
  return response;
};

// 删除评论
export const deleteComment = async (commentId) => {
  const response = await api.post('/comment/delete', {
    comment_id: commentId
  });
  return response;
};

// 点赞/取消点赞评论
export const toggleCommentLike = async (commentId) => {
  const response = await api.post('/comment/like/toggle', {
    comment_id: commentId
  });
  return response;
};

// 回复评论
export const replyComment = async (panRecordId, parentId, content, isPublic = false, replyToUserId = null) => {
  const response = await api.post('/comment/reply', {
    pan_record_id: panRecordId,
    parent_id: parentId,
    content,
    is_public: isPublic,
    reply_to_user_id: replyToUserId
  });
  return response;
};

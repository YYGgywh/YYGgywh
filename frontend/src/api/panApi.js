/*
 * @file            frontend/src/api/panApi.js
 * @description     排盘记录接口（保存、查询、更新、删除）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-02 17:54:25
 * Copyright © All rights reserved
*/

import api from './index';

// 保存排盘记录
export const savePan = async (panType, panParams, panResult, supplement) => {
  try {
    const response = await api.post('/pan/save', {
      pan_type: panType,
      pan_params: JSON.stringify(panParams),
      pan_result: JSON.stringify(panResult),
      supplement
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 查询排盘记录
export const listPan = async (panType = 'liuyao', page = 1, size = 10, startTime = null, endTime = null) => {
  try {
    const params = {
      pan_type: panType,
      page,
      size
    };
    
    if (startTime) {
      params.start_time = startTime;
    }
    
    if (endTime) {
      params.end_time = endTime;
    }
    
    const response = await api.get('/pan/list', {
      params
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 更新排盘记录
export const updatePan = async (recordId, updateData) => {
  try {
    const response = await api.put(`/pan/update/${recordId}`, updateData);
    return response;
  } catch (error) {
    throw error;
  }
};

// 删除排盘记录
export const deletePan = async (recordId) => {
  try {
    const response = await api.delete(`/pan/delete/${recordId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取公开排盘记录列表
export const getPublicPanList = async (params) => {
  try {
    const response = await api.get('/pan/public/list', {
      params
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取排盘记录详情
export const getPanDetail = async (recordId) => {
  try {
    const response = await api.get(`/pan/detail/${recordId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 点赞/取消点赞
export const toggleLike = async (panId) => {
  try {
    const response = await api.post('/pan/like/toggle', {
      pan_id: panId
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取点赞状态
export const getLikeStatus = async (panId) => {
  try {
    const response = await api.get('/pan/like/status', {
      params: { pan_id: panId }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 收藏/取消收藏
export const toggleCollect = async (panId) => {
  try {
    const response = await api.post('/pan/collect/toggle', {
      pan_id: panId
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取收藏状态
export const getCollectStatus = async (panId) => {
  try {
    const response = await api.get('/pan/collect/status', {
      params: { pan_id: panId }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
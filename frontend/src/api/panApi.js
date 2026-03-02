/*
 * @file            frontend/src/api/panApi.js
 * @description     排盘记录接口（保存、查询）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-02-27 10:00:00
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
export const listPan = async (panType = 'liuyao', page = 1, size = 10) => {
  try {
    const response = await api.get('/pan/list', {
      params: {
        pan_type: panType,
        page,
        size
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
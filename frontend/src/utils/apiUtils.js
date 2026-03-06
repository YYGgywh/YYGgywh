/**
 * API请求工具
 */

/**
 * 构建查询参数
 * @param {Object} params 查询参数对象
 * @returns {string} 查询参数字符串
 */
export const buildQueryParams = (params) => {
  if (!params) return '';
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `?${queryString}` : '';
};

/**
 * 处理API响应
 * @param {Object} response API响应
 * @returns {Promise} 处理后的响应
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.msg || '请求失败');
  }
  
  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.msg || '请求失败');
  }
  
  return data;
};

/**
 * 生成请求头
 * @param {boolean} includeToken 是否包含token
 * @returns {Object} 请求头
 */
export const getHeaders = (includeToken = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeToken) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};
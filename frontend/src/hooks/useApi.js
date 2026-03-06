import { useState, useCallback } from 'react';

/**
 * API请求Hook
 * @returns {Object} API请求相关方法
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * 执行API请求
   * @param {Function} apiFn API函数
   * @param {Object} options 配置选项
   * @returns {Promise} 请求结果
   */
  const execute = useCallback(async (apiFn, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFn(options);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);
  
  return {
    execute,
    loading,
    error
  };
};
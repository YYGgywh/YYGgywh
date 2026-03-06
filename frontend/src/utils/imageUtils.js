/**
 * 图片处理工具
 */

/**
 * 生成图片缩略图URL
 * @param {string} url 原始图片URL
 * @param {number} width 宽度
 * @param {number} height 高度
 * @returns {string} 缩略图URL
 */
export const getThumbnailUrl = (url, width = 200, height = 200) => {
  // 这里可以根据实际情况实现图片缩略图生成逻辑
  // 例如使用CDN服务或后端API
  return url;
};

/**
 * 验证图片URL是否有效
 * @param {string} url 图片URL
 * @returns {boolean} 是否有效
 */
export const isValidImageUrl = (url) => {
  return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(url);
};

/**
 * 生成图片占位符
 * @param {number} width 宽度
 * @param {number} height 高度
 * @returns {string} 占位符URL
 */
export const getImagePlaceholder = (width = 200, height = 200) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ccc' font-size='14'%3E${width}x${height}%3C/text%3E%3C/svg%3E`;
};
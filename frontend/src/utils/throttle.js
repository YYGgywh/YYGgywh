/**
 * 节流函数
 * @param {Function} func 要执行的函数
 * @param {number} limit 时间限制
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  let timer;
  
  const throttled = function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      timer = setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
  
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      inThrottle = false;
    }
  };
  
  return throttled;
};
/**
 * 检查URL查询参数是否包含指定的追踪参数
 * @returns {boolean} 如果包含任何一个指定参数，则在localStorage中设置md_marketing_baidu_channel
 */
function hasBdChannelTracking() {
  const TRACKING_PARAMS = [
    'qhclickid',
    'bd_vid',
    'qz_gdt',
    'gdt_vid',
    'msclkid',
    'cb',
    'utm_channel',
    'utm_source',
    'utm_keyword'
  ];

  const queryParams = new URLSearchParams(window.location.search);
  const hasBdChannel = TRACKING_PARAMS.some(param => queryParams.has(param));

  if (hasBdChannel) {
    localStorage.setItem('md_marketing_baidu_channel', location.href);
  }
}

hasBdChannelTracking();
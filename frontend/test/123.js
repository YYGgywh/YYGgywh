const { Solar } = require('lunar-javascript');

try {
  // 获取当前时间的分、秒值
  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  const l = Solar.fromBaZi('庚子', '辛巳', '庚午', '丁丑', 1, 1);
  console.log('匹配的阳历日期数量:', l.length);
  console.log('当前时间的分:', currentMinute, '秒:', currentSecond);
  console.log('====================');
  
  for (let i = 0, j = l.length; i < j; i++) {
    const d = l[i];
    // 打印原始值
    console.log('原始值:', d.toFullString());
    // 由于 Solar 对象的方法可能不支持直接修改分秒，我们可以构造新的时间字符串
    const year = d.getYear();
    const month = d.getMonth();
    const day = d.getDay();
    const hour = d.getHour();
    // 使用当前的分、秒值
    const modifiedDateTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}:${String(currentSecond).padStart(2, '0')}`;
    console.log('修改后:', modifiedDateTime);
    console.log('------------------');
  }
} catch (error) {
  console.error('测试失败:', error);
}
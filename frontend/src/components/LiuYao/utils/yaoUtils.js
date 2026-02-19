/*
 * @file            frontend/src/components/LiuYao/utils/yaoUtils.js
 * @description     爻组件工具函数，根据odd_count值确定爻的形状和颜色
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 22:00:00
 * @lastModified    2026-02-19 13:09:11
 * Copyright © All rights reserved
*/

import { YangYao, YinYao } from '../../common/YaoComponents';  // 导入阳爻和阴爻组件

/**
 * @description     获取爻组件
 * @param           {number|null}    oddCount           爻奇数个数（0-3）或null
 * @return          {JSX|null}                  爻组件或null
 */

// 导出获取爻组件的函数
export const getYaoComponent = (oddCount) => {
  if (oddCount === null || oddCount === undefined) return null;  // 如果奇数个数为null或undefined，返回null
  
  const oddCountStr = oddCount.toString();  // 将奇数个数转换为字符串
  
  // 根据奇数个数字符串返回对应的爻组件
  switch (oddCountStr) {
    case '1':  // 1个奇数：阳爻（黑色）
      return <YangYao backgroundColor="#000000" />;  // 返回黑色阳爻
    case '2':  // 2个奇数：阴爻（黑色）
      return <YinYao backgroundColor="#000000" />;  // 返回黑色阴爻
    case '3':  // 3个奇数：阳爻（红色，动爻）
      return <YangYao backgroundColor="#C00000" />;  // 返回红色阳爻
    case '0':  // 0个奇数：阴爻（红色，动爻）
      return <YinYao backgroundColor="#0070C0" />;  // 返回红色阴爻
    default:  // 其他情况
      return null;  // 返回null
  }
};

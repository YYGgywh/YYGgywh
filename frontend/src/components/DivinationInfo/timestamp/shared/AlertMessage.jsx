/*
 * @file            frontend/src/components/DivinationInfo/timestamp/shared/AlertMessage.jsx
 * @description     错误提示组件，用于显示时间输入验证错误
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 21:15:00
 * @lastModified    2026-02-18 21:16:17
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库

// 定义AlertMessage组件
const AlertMessage = ({ showAlert, alertMessage, onClose }) => {
  if (!showAlert) return null; // 如果不显示警告，直接返回null

  // 如果显示警告，返回警告弹窗JSX
  return (
    <div className="alert-overlay"> {/* 警告遮罩层 */}
      <div className="alert-content"> {/* 警告内容容器 */}
        <div className="alert-message">{alertMessage}</div> {/* 显示警告消息 */}
        <button className="alert-close" onClick={onClose}>确定</button> {/* 确定按钮,点击关闭警告 */}
      </div>
    </div>
  );
};

export default AlertMessage; // 导出AlertMessage组件作为默认导出

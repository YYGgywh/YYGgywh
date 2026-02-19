/*
 * @file            frontend/src/components/DivinationTypeDropdown.jsx
 * @description     占类下拉选择组件，提供财富、职业、婚恋等占类选项
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 10:30:00
 * @lastModified    2026-02-18 20:05:49
 * Copyright © All rights reserved
*/

// 引入 React 核心 Hook：状态管理、引用和副作用
import React, {
  useState,    // 用于组件内部状态管理
  useRef,      // 用于获取 DOM 节点或保存可变引用
  useEffect    // 用于处理组件挂载、更新及卸载时的副作用
} from 'react';

// 占类下拉选择组件
const DivinationTypeDropdown = ({ selectedType, onTypeSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // 下拉菜单是否展开状态
  const dropdownRef = useRef(null); // 下拉菜单容器引用
  const divinationTypes = ['财富', '职业', '婚恋', '官讼', '健康', '寻失', '出行', '射覆']; // 占类选项数组

  // 切换下拉菜单展开状态
  const handleToggle = () => {
    setIsOpen(!isOpen); // 切换下拉菜单展开状态
  };

  // 处理占类选项点击事件
  const handleTypeSelect = (type) => {
    onTypeSelect(type); // 调用父组件传递的占类选择回调函数
    setIsOpen(false); // 点击占类选项后关闭下拉菜单
  };

  // 处理点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 忽略点击下拉菜单容器内的事件
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return; // 点击下拉菜单容器内的事件，不关闭下拉菜单
      }
      // 点击外部区域关闭下拉菜单
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // 点击外部区域关闭下拉菜单
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // 监听文档点击事件

    // 组件卸载时移除点击事件监听
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 组件卸载时移除点击事件监听
    };
  }, []);// 组件挂载时添加点击事件监听，组件卸载时移除点击事件监听

  // 渲染占类下拉选择组件
  return (
    <div className="divination-type-container"> {/* 占类下拉选择组件容器 */}
      <label className="type-label"></label> {/* 占类下拉选择组件标签 */}
      <div className="dropdown-container" ref={dropdownRef}> {/* 占类下拉选择组件容器 */}
        <div className="dropdown-select" onClick={handleToggle}> {/* 占类下拉选择组件选择框 */}
          {selectedType || '占类'} {/* 占类下拉选择组件选择框文本 */}
          <span className="dropdown-arrow">▼</span> {/* 占类下拉选择组件选择框下拉箭头 */}
        </div>
        {/* 占类下拉选择组件菜单 */}
        {isOpen && (
          <div className="dropdown-menu"> {/* 占类下拉选择组件菜单 */}
            {/* 占类下拉选择组件菜单选项 */}
            {divinationTypes.map((type) => (
              // 占类下拉选择组件菜单选项
              <div
                key={type} // 占类下拉选择组件菜单选项键值
                className="dropdown-item" // 占类下拉选择组件菜单选项类名
                onClick={() => handleTypeSelect(type)} // 占类下拉选择组件菜单选项点击事件
              >
                {type} {/* 占类下拉选择组件菜单选项文本 */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivinationTypeDropdown; // 导出占类下拉选择组件

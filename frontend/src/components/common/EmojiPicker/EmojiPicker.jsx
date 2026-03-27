/*
 * @file            frontend/src/components/common/EmojiPicker/EmojiPicker.jsx
 * @description     表情选择器组件，提供常用表情符号的快速输入
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 17:00:00
 * @lastModified    2026-03-21 17:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react';
import styles from './EmojiPicker.desktop.module.css';
import mobileStyles from './EmojiPicker.mobile.module.css';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
  '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
  '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝',
  '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐',
  '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
  '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢',
  '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠',
  '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮',
  '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰',
  '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
  '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
  '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻',
  '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼',
  '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋',
  '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕',
  '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙',
  '💜', '🖤', '🤍', '🤎', '💯', '💢', '💥', '💫',
  '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️',
  '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌',
  '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
  '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊',
  '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
  '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵',
  '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀',
  '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑',
  '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍',
  '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🤦', '🤷',
  '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️',
  '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭',
  '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤',
  '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒',
  '👮', '🕵️', '💂', '👷', '🤴', '👸', '👳', '👲',
  '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶',
  '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞',
  '🧟', '💆', '💇', '🚶', '🏃', '💃', '🕺', '🕴️',
  '👯', '🧖', '🧘', '🧗', '🤺', '⛷️', '🏂', '🏌️',
  '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸',
  '🤼', '🤽', '🤾', '🤹', '🛀', '🛌', '👭', '👫',
  '👬', '💏', '💑', '👪', '🗣️', '👤', '👥', '👣',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
  '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣',
  '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
  '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
  '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖',
  '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠',
  '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
  '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫',
  '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏',
  '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈',
  '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇', '🦝',
  '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'
];

const EmojiPicker = ({ onSelect, onClose }) => {
  const pickerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleEmojis, setVisibleEmojis] = useState(EMOJIS);
  
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setVisibleEmojis(EMOJIS);
    } else {
      const filtered = EMOJIS.filter(emoji => emoji.includes(term));
      setVisibleEmojis(filtered);
    }
  };

  const handleEmojiClick = (emoji) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <div className={currentStyles.emojiPicker} ref={pickerRef}>
      <div className={currentStyles.emojiPickerHeader}>
        <input
          type="text"
          placeholder="搜索表情..."
          value={searchTerm}
          onChange={handleSearch}
          className={currentStyles.emojiSearch}
        />
      </div>
      <div className={currentStyles.emojiGrid}>
        {visibleEmojis.map((emoji, index) => (
          <button
            key={index}
            className={currentStyles.emojiButton}
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      {visibleEmojis.length === 0 && (
        <div className={currentStyles.noResults}>没有找到表情</div>
      )}
    </div>
  );
};

export default EmojiPicker;
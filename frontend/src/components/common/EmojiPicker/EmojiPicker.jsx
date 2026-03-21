/*
 * @file            frontend/src/components/common/EmojiPicker/EmojiPicker.jsx
 * @description     表情选择器组件，提供常用表情符号的快速输入
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 17:00:00
 * @lastModified    2026-03-21 17:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react';
import styles from './EmojiPicker.module.css';

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
    <div className={styles.emojiPicker} ref={pickerRef}>
      <div className={styles.emojiPickerHeader}>
        <input
          type="text"
          placeholder="搜索表情..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.emojiSearch}
        />
      </div>
      <div className={styles.emojiGrid}>
        {visibleEmojis.map((emoji, index) => (
          <button
            key={index}
            className={styles.emojiButton}
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      {visibleEmojis.length === 0 && (
        <div className={styles.noResults}>没有找到表情</div>
      )}
    </div>
  );
};

export default EmojiPicker;
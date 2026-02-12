// 路径:src/contexts/DivinationContext.jsx 时间:2026-02-10 10:00
// 功能:占卜信息上下文，用于共享表单数据、时间数据和起卦数据
import React, { createContext, useState, useContext } from 'react';

// 创建 Context
const DivinationContext = createContext();

// 自定义 Hook，方便组件使用 Context
export const useDivination = () => {
  const context = useContext(DivinationContext);
  if (!context) {
    throw new Error('useDivination must be used within a DivinationProvider');
  }
  return context;
};

// Context Provider 组件
export const DivinationProvider = ({ children }) => {
  // 表单数据
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '男',
    birthYear: '',
    location: '',
    divinationType: '',
    subType: '',
    question: ''
  });

  // 时间数据
  const [timestamp, setTimestamp] = useState(null);

  // 起卦数据
  const [threeDigitsArray, setThreeDigitsArray] = useState([]);

  // 后端返回数据
  const [calendarResult, setCalendarResult] = useState(null);
  const [divineResult, setDivineResult] = useState(null);

  return (
    <DivinationContext.Provider
      value={{
        formData,
        setFormData,
        timestamp,
        setTimestamp,
        threeDigitsArray,
        setThreeDigitsArray,
        calendarResult,
        setCalendarResult,
        divineResult,
        setDivineResult
      }}
    >
      {children}
    </DivinationContext.Provider>
  );
};

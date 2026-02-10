// 路径:frontend/test/SixYaoDisplayTest.jsx 时间:2024-07-01 10:00

import React from 'react';
import ReactDOM from 'react-dom';
import SixYaoDisplay from '../src/components/common/SixYaoDisplay';

/**
 * SixYaoDisplay组件测试
 * 用于验证六爻显示组件的功能
 */
const SixYaoDisplayTest = () => {
  // 测试数据：六爻类型数组，'yang'表示阳爻，'yin'表示阴爻
  const testYaoTypes = ['yang', 'yin', 'yang', 'yang', 'yin', 'yin'];
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>SixYaoDisplay组件测试</h1>
      
      <h2>默认样式测试</h2>
      <SixYaoDisplay yaoTypes={testYaoTypes} />
      
      <h2>自定义样式测试</h2>
      <SixYaoDisplay 
        yaoTypes={testYaoTypes}
        yaoWidth={150}
        yaoHeight={25}
        yangColor="#ff0000"
        yinColor="#0000ff"
        style={{ 
          backgroundColor: '#f0f8ff',
          border: '1px solid #b0e0e6',
          borderRadius: '12px',
          padding: '20px'
        }}
        yaoLabelStyle={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#4682b4'
        }}
      />
      
      <h2>部分爻测试</h2>
      <SixYaoDisplay 
        yaoTypes={['yang', 'yin', 'yang']}
        style={{ 
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}
      />
    </div>
  );
};

// 渲染测试组件
ReactDOM.render(<SixYaoDisplayTest />, document.getElementById('root'));

export default SixYaoDisplayTest;
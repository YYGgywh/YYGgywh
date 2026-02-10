// 路径:test/test_clear_button.jsx 时间:2026-02-06 10:30
// 功能:测试"全清"按钮的启用状态
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimestampModal from '../src/components/DivinationInfo/timestamp/TimestampModal';

// 模拟 onClose 和 onSubmit 回调
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

describe('全清按钮测试', () => {
  test('初始化时全清按钮应该禁用', () => {
    render(<TimestampModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // 切换到四柱选项卡
    fireEvent.click(screen.getByText('四柱'));
    
    // 检查全清按钮是否禁用
    const clearButton = screen.getByText('全清');
    expect(clearButton).toBeDisabled();
  });
  
  test('输入有效数据后全清按钮应该启用', () => {
    render(<TimestampModal onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    
    // 切换到四柱选项卡
    fireEvent.click(screen.getByText('四柱'));
    
    // 这里需要模拟输入有效数据，但是由于四柱组件的复杂性，我们需要检查TimestampModal的逻辑
    // 实际上，我们需要检查的是当selectedTime.fourPillars有有效值时，全清按钮是否启用
  });
});

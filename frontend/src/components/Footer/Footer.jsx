import React, { Component } from 'react'
import desktopStyles from './Footer.desktop.module.css'
import mobileStyles from './Footer.mobile.module.css'

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: window.innerWidth < 768
    };
  }

  componentDidMount() {
    // 添加窗口大小变化监听器
    this.handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        this.setState({ isMobile: window.innerWidth < 768 });
      }, 100);
    };
    
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // 移除窗口大小变化监听器
    window.removeEventListener('resize', this.handleResize);
    clearTimeout(window.resizeTimeout);
  }

  render() {
    // 根据屏幕尺寸选择样式
    const styles = this.state.isMobile ? mobileStyles : desktopStyles;
    
    return (
      <div className={styles.footer}>

      </div>
    )
  }
}

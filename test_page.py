#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

def test_page():
    # 配置Chrome浏览器选项
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')

    try:
        # 创建Chrome浏览器实例
        driver = webdriver.Chrome(options=chrome_options)
        
        # 访问页面
        driver.get('http://localhost:3003')
        
        # 等待页面加载
        time.sleep(5)
        
        # 获取页面标题
        print('页面标题:', driver.title)
        
        # 检查是否显示排盘记录
        cards = driver.find_elements(By.CLASS_NAME, 'waterfall-card')
        print('找到的瀑布流卡片数量:', len(cards))
        
        if len(cards) > 0:
            print('页面成功显示排盘记录！')
        else:
            # 检查是否显示'暂无排盘记录'
            no_records = driver.find_elements(By.XPATH, '//*[contains(text(), "暂无排盘记录")]')
            if no_records:
                print('页面显示"暂无排盘记录"')
            else:
                print('页面未找到排盘记录相关内容')
        
        # 检查是否有错误信息
        errors = driver.find_elements(By.CLASS_NAME, 'error-container')
        if errors:
            print('页面显示错误信息:', errors[0].text)
            
    except Exception as e:
        print('测试过程中出错:', e)
        
    finally:
        # 关闭浏览器
        driver.quit()

if __name__ == '__main__':
    test_page()

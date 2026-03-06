#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

def test_delete_div():
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
        driver.get('http://localhost:3004')
        
        # 等待页面加载
        time.sleep(5)
        
        print('页面标题:', driver.title)
        
        # 检查是否显示排盘记录
        cards = driver.find_elements(By.CLASS_NAME, 'waterfall-card')
        print('找到的瀑布流卡片数量:', len(cards))
        
        if len(cards) > 0:
            print('第1个卡片的HTML结构:')
            card_html = cards[0].get_attribute('outerHTML')
            
            # 检查卡片统计信息div是否存在
            if 'card-stats' in card_html:
                print('卡片统计信息div仍然存在')
                print('统计信息div的内容:')
                try:
                    card_stats = cards[0].find_element(By.CLASS_NAME, 'card-stats')
                    print(card_stats.get_attribute('outerHTML'))
                except Exception as e:
                    print('获取统计信息div内容失败:', e)
            else:
                print('卡片统计信息div已成功删除')
                
            # 打印卡片的基本信息
            print('\n卡片标题:')
            try:
                title = cards[0].find_element(By.CLASS_NAME, 'card-title')
                print(title.text)
            except Exception as e:
                print('获取卡片标题失败:', e)
                
            print('作者信息:')
            try:
                user_name = cards[0].find_element(By.CLASS_NAME, 'user-name')
                print(user_name.text)
            except Exception as e:
                print('获取作者信息失败:', e)
                
    except Exception as e:
        print('测试过程中出错:', e)
        
    finally:
        # 关闭浏览器
        driver.quit()

if __name__ == '__main__':
    test_delete_div()

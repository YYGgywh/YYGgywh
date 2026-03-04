#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
 * @file            backend/scripts/add_virtual_gender_column.py
 * @description     为用户表添加虚拟性别字段
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-04 15:00:00
 * @lastModified    2026-03-04 15:00:00
 * Copyright © All rights reserved
"""

import sqlite3
import os

# 获取数据库路径
db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'db', 'yyggywh.db')

print(f"数据库路径: {db_path}")

# 连接数据库
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # 检查虚拟性别字段是否已存在
    cursor.execute("PRAGMA table_info(user)")
    columns = [column[1] for column in cursor.fetchall()]
    
    # 添加虚拟性别字段
    if 'virtual_gender' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN virtual_gender INTEGER DEFAULT 2")
        print("成功添加虚拟性别字段 (virtual_gender) 到用户表")
        print("默认值设置为 2 (保密)")
    else:
        print("虚拟性别字段 (virtual_gender) 已存在，跳过添加")
    
    # 添加虚拟性别修改次数字段
    if 'virtual_gender_modify_count' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN virtual_gender_modify_count INTEGER DEFAULT 0")
        print("成功添加虚拟性别修改次数字段 (virtual_gender_modify_count) 到用户表")
    else:
        print("虚拟性别修改次数字段 (virtual_gender_modify_count) 已存在，跳过添加")
    
    # 添加虚拟性别修改时间字段
    if 'virtual_gender_modify_time' not in columns:
        cursor.execute("ALTER TABLE user ADD COLUMN virtual_gender_modify_time INTEGER DEFAULT 0")
        print("成功添加虚拟性别修改时间字段 (virtual_gender_modify_time) 到用户表")
    else:
        print("虚拟性别修改时间字段 (virtual_gender_modify_time) 已存在，跳过添加")
    
    # 提交事务
    conn.commit()
    print("数据库迁移成功完成")
    
except Exception as e:
    print(f"错误: {e}")
    conn.rollback()
finally:
    # 关闭连接
    conn.close()

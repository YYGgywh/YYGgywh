#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试API接口
"""

import requests
import json

def test_public_pan_list_api():
    """测试获取公开排盘记录列表API"""
    try:
        url = "http://localhost:8000/api/pan/public/list"
        params = {
            "page": 1,
            "size": 12,
            "sort": "newest",
            "pan_type": "liuyao"
        }
        
        print(f"请求URL: {url}")
        print(f"请求参数: {params}")
        
        # 发送GET请求
        response = requests.get(url, params=params)
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        # 解析JSON响应
        result = response.json()
        print(f"解析后的JSON数据: {json.dumps(result, ensure_ascii=False, indent=2)}")
        
        if result.get("code") == 200:
            data = result.get("data")
            print(f"获取到的记录数: {len(data)}" if data else "没有数据")
            if data:
                # 打印第一条记录的详细信息
                first_record = data[0]
                print("\n第一条记录的详细信息:")
                print(f"ID: {first_record.get('id')}")
                print(f"排盘类型: {first_record.get('pan_type')}")
                print(f"用户信息: {first_record.get('user')}")
                print(f"补充说明: {first_record.get('supplement')}")
                print(f"点赞数: {first_record.get('like_count')}")
                print(f"收藏数: {first_record.get('collect_count')}")
                print(f"评论数: {first_record.get('comment_count')}")
                print(f"浏览数: {first_record.get('view_count')}")
                print(f"创建时间: {first_record.get('create_time')}")
                print(f"排盘参数: {first_record.get('pan_params')}")
                print(f"排盘结果: {first_record.get('pan_result')}")
        
    except Exception as e:
        print(f"请求出错: {e}")

def test_pan_detail_api():
    """测试获取排盘记录详情API"""
    try:
        record_id = 1
        url = f"http://localhost:8000/api/pan/detail/{record_id}"
        
        print(f"\n\n请求URL: {url}")
        
        # 发送GET请求
        response = requests.get(url)
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        # 解析JSON响应
        result = response.json()
        print(f"解析后的JSON数据: {json.dumps(result, ensure_ascii=False, indent=2)}")
        
        if result.get("code") == 200:
            data = result.get("data")
            print("\n排盘记录详情:")
            print(f"ID: {data.get('id')}")
            print(f"排盘类型: {data.get('pan_type')}")
            print(f"用户信息: {data.get('user')}")
            print(f"补充说明: {data.get('supplement')}")
            print(f"点赞数: {data.get('like_count')}")
            print(f"收藏数: {data.get('collect_count')}")
            print(f"评论数: {data.get('comment_count')}")
            print(f"浏览数: {data.get('view_count')}")
            print(f"创建时间: {data.get('create_time')}")
            print(f"排盘参数: {data.get('pan_params')}")
            print(f"排盘结果: {data.get('pan_result')}")
        
    except Exception as e:
        print(f"请求出错: {e}")

if __name__ == "__main__":
    print("测试公开排盘记录列表API:")
    test_public_pan_list_api()
    
    print("\n" + "="*50 + "\n")
    
    print("测试排盘记录详情API:")
    test_pan_detail_api()

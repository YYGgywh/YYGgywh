# backend/app/utils/verify_code.py 2026-02-26 17:15:00
# 功能：验证码工具，用于生成和管理验证码

import random
import time
from typing import Dict, Optional
from datetime import datetime

# 验证码存储，实际环境中可使用Redis
code_store: Dict[str, Dict[str, any]] = {}
CODE_EXPIRE_TIME = 600  # 验证码有效期10分钟
SEND_INTERVAL = 60  # 发送间隔60秒
MAX_DAILY_SEND = 5  # 单日最多发送5次

# 发送记录，用于频率限制
send_record: Dict[str, Dict[str, any]] = {}


def generate_verify_code(phone: str) -> str:
    """
    生成6位数字验证码（手机号）
    
    Args:
        phone: 手机号
    
    Returns:
        6位数字验证码
    
    Raises:
        Exception: 发送频率超限
    """
    key = f"phone_{phone}"
    
    # 检查发送频率限制
    current_time = time.time()
    if key in send_record:
        last_send_time = send_record[key]["last_send_time"]
        if current_time - last_send_time < SEND_INTERVAL:
            raise Exception(f"发送过于频繁，请{SEND_INTERVAL - int(current_time - last_send_time)}秒后再试")
        
        # 检查单日发送次数
        today = datetime.now().strftime("%Y-%m-%d")
        if send_record[key]["date"] == today and send_record[key]["count"] >= MAX_DAILY_SEND:
            raise Exception(f"今日发送次数已达上限（{MAX_DAILY_SEND}次）")
    
    code = ''.join(random.choices('0123456789', k=6))
    
    # 存储验证码及过期时间
    code_store[key] = {
        "code": code,
        "expire_time": current_time + CODE_EXPIRE_TIME
    }
    
    # 更新发送记录
    today = datetime.now().strftime("%Y-%m-%d")
    if key not in send_record or send_record[key]["date"] != today:
        send_record[key] = {
            "last_send_time": current_time,
            "count": 1,
            "date": today
        }
    else:
        send_record[key]["last_send_time"] = current_time
        send_record[key]["count"] += 1
    
    # 模拟发送验证码（实际环境中应调用短信API）
    print(f"向手机号 {phone} 发送验证码：{code}")
    return code


def generate_email_verify_code(email: str) -> str:
    """
    生成6位数字验证码（邮箱）
    
    Args:
        email: 邮箱地址
    
    Returns:
        6位数字验证码
    
    Raises:
        Exception: 发送频率超限
    """
    key = f"email_{email}"
    
    # 检查发送频率限制
    current_time = time.time()
    if key in send_record:
        last_send_time = send_record[key]["last_send_time"]
        if current_time - last_send_time < SEND_INTERVAL:
            raise Exception(f"发送过于频繁，请{SEND_INTERVAL - int(current_time - last_send_time)}秒后再试")
        
        # 检查单日发送次数
        today = datetime.now().strftime("%Y-%m-%d")
        if send_record[key]["date"] == today and send_record[key]["count"] >= MAX_DAILY_SEND:
            raise Exception(f"今日发送次数已达上限（{MAX_DAILY_SEND}次）")
    
    code = ''.join(random.choices('0123456789', k=6))
    
    # 存储验证码及过期时间
    code_store[key] = {
        "code": code,
        "expire_time": current_time + CODE_EXPIRE_TIME
    }
    
    # 更新发送记录
    today = datetime.now().strftime("%Y-%m-%d")
    if key not in send_record or send_record[key]["date"] != today:
        send_record[key] = {
            "last_send_time": current_time,
            "count": 1,
            "date": today
        }
    else:
        send_record[key]["last_send_time"] = current_time
        send_record[key]["count"] += 1
    
    # 模拟发送验证码（实际环境中应调用邮件API）
    print(f"向邮箱 {email} 发送验证码：{code}")
    return code


def verify_code(phone: str, code: str) -> bool:
    """
    验证验证码是否正确（手机号）
    
    Args:
        phone: 手机号
        code: 验证码
    
    Returns:
        验证码是否正确且未过期
    """
    key = f"phone_{phone}"
    if key not in code_store:
        return False
    
    stored_info = code_store[key]
    current_time = time.time()
    
    # 检查验证码是否过期
    if current_time > stored_info["expire_time"]:
        del code_store[key]  # 删除过期验证码
        return False
    
    # 检查验证码是否正确
    if stored_info["code"] != code:
        return False
    
    # 验证成功后删除验证码
    del code_store[key]
    return True


def verify_email_code(email: str, code: str) -> bool:
    """
    验证验证码是否正确（邮箱）
    
    Args:
        email: 邮箱地址
        code: 验证码
    
    Returns:
        验证码是否正确且未过期
    """
    key = f"email_{email}"
    if key not in code_store:
        return False
    
    stored_info = code_store[key]
    current_time = time.time()
    
    # 检查验证码是否过期
    if current_time > stored_info["expire_time"]:
        del code_store[key]  # 删除过期验证码
        return False
    
    # 检查验证码是否正确
    if stored_info["code"] != code:
        return False
    
    # 验证成功后删除验证码
    del code_store[key]
    return True


def get_code_expire_time(phone: str) -> Optional[float]:
    """
    获取验证码过期时间（手机号）
    
    Args:
        phone: 手机号
    
    Returns:
        过期时间戳，如果验证码不存在则返回None
    """
    key = f"phone_{phone}"
    if key in code_store:
        return code_store[key]["expire_time"]
    return None


def get_email_code_expire_time(email: str) -> Optional[float]:
    """
    获取验证码过期时间（邮箱）
    
    Args:
        email: 邮箱地址
    
    Returns:
        过期时间戳，如果验证码不存在则返回None
    """
    key = f"email_{email}"
    if key in code_store:
        return code_store[key]["expire_time"]
    return None

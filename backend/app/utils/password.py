# backend/app/utils/password.py 2026-02-26 17:05:00
# 功能：密码哈希工具，用于密码加密和验证

import bcrypt
import re


def check_password_strength(password: str) -> dict:
    """
    检查密码强度
    
    Args:
        password: 密码
    
    Returns:
        密码强度信息：{level: 强度等级, score: 分数, message: 提示信息}
    """
    score = 0
    messages = []
    
    # 长度检查
    if len(password) >= 6:
        score += 20
    else:
        messages.append("密码长度至少6位")
    
    if len(password) >= 8:
        score += 10
    
    if len(password) >= 12:
        score += 10
    
    # 复杂度检查（允许数字、字母和下划线的任意组合）
    if re.search(r'[a-z]', password):
        score += 10
    if re.search(r'[A-Z]', password):
        score += 10
    if re.search(r'\d', password):
        score += 10
    if re.search(r'_', password):
        score += 10
    
    # 检查是否包含非法字符
    if re.search(r'[^a-zA-Z0-9_]', password):
        score -= 10
        messages.append("密码只能包含数字、字母和下划线")
    
    # 重复字符检查
    if len(set(password)) < len(password) * 0.6:
        score -= 10
        messages.append("密码中重复字符过多")
    
    # 常见密码检查
    common_passwords = ["123456", "password", "123456789", "qwerty", "abc123"]
    if password.lower() in common_passwords:
        score = 0
        messages.append("密码过于简单，请使用更复杂的密码")
    
    # 确定强度等级
    if score >= 70:
        level = "强"
    elif score >= 50:
        level = "中"
    elif score >= 30:
        level = "弱"
    else:
        level = "极弱"
    
    return {
        "level": level,
        "score": score,
        "message": "、".join(messages) if messages else "密码强度良好"
    }


def hash_password(password: str) -> str:
    """
    对密码进行哈希加密
    
    Args:
        password: 原始密码
    
    Returns:
        哈希后的密码
    """
    # 限制密码长度为72字节
    password = password[:72]
    # 生成盐并哈希密码
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    验证密码是否正确
    
    Args:
        plain_password: 原始密码
        hashed_password: 哈希后的密码
    
    Returns:
        密码是否正确
    """
    # 限制密码长度为72字节
    plain_password = plain_password[:72]
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

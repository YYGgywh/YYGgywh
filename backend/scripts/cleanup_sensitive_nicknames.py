"""
清理历史敏感词昵称
将已存在的敏感词昵称重置为临时昵称
"""
import sqlite3
import os
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

# 需要清理的敏感词列表
SENSITIVE_WORDS = [
    'admin', 'Admin', 'ADMIN',
    'administrator', 'Administrator',
    'root', 'Root', 'ROOT',
    'superadmin', 'superuser',
    'system', 'System',
    '习近平', '江泽民', '胡锦涛', '温家宝', '李克强',
    '法轮功', '台独', '藏独', '疆独',
]

def generate_temp_nickname(user_id):
    """生成临时昵称"""
    return f"用户_{user_id}_{int(time.time()) % 10000}"

def cleanup_sensitive_nicknames():
    """清理敏感词昵称"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cleaned_count = 0
    current_time = int(time.time())
    
    print("开始清理敏感词昵称...")
    print(f"检查 {len(SENSITIVE_WORDS)} 个敏感词\n")
    
    for word in SENSITIVE_WORDS:
        # 查找包含敏感词的用户
        cursor.execute(
            "SELECT id, login_name, nickname FROM user WHERE nickname = ?",
            (word,)
        )
        users = cursor.fetchall()
        
        for user in users:
            user_id, login_name, old_nickname = user
            new_nickname = generate_temp_nickname(user_id)
            
            # 更新昵称
            cursor.execute(
                "UPDATE user SET nickname = ?, nickname_modify_time = ? WHERE id = ?",
                (new_nickname, current_time, user_id)
            )
            
            cleaned_count += 1
            print(f"[CLEANED] ID:{user_id}, 登录名:{login_name}")
            print(f"          原昵称:{old_nickname} -> 新昵称:{new_nickname}")
    
    conn.commit()
    conn.close()
    
    print(f"\n{'='*50}")
    print(f"清理完成!")
    print(f"共清理 {cleaned_count} 个违规昵称")
    print(f"{'='*50}")

if __name__ == "__main__":
    cleanup_sensitive_nicknames()

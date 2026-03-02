import sqlite3
import os
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

SYSTEM_RESERVED_WORDS = [
    ("admin", "系统保留", 2, "系统管理员账户名"),
    ("Admin", "系统保留", 2, "系统管理员账户名"),
    ("ADMIN", "系统保留", 2, "系统管理员账户名"),
    ("Administrator", "系统保留", 2, "系统管理员账户名"),
    ("administrator", "系统保留", 2, "系统管理员账户名"),
    ("root", "系统保留", 2, "超级管理员账户名"),
    ("Root", "系统保留", 2, "超级管理员账户名"),
    ("ROOT", "系统保留", 2, "超级管理员账户名"),
    ("superadmin", "系统保留", 2, "超级管理员账户名"),
    ("superuser", "系统保留", 2, "超级用户账户名"),
    ("system", "系统保留", 2, "系统保留名称"),
    ("System", "系统保留", 2, "系统保留名称"),
    ("test", "系统保留", 1, "测试账户名"),
    ("Test", "系统保留", 1, "测试账户名"),
    ("guest", "系统保留", 1, "访客账户名"),
    ("Guest", "系统保留", 1, "访客账户名"),
    ("user", "系统保留", 1, "通用用户名"),
    ("User", "系统保留", 1, "通用用户名"),
    ("demo", "系统保留", 1, "演示账户名"),
    ("Demo", "系统保留", 1, "演示账户名"),
    ("api", "系统保留", 2, "API接口保留名"),
    ("API", "系统保留", 2, "API接口保留名"),
    ("manager", "系统保留", 2, "管理器账户名"),
    ("Manager", "系统保留", 2, "管理器账户名"),
    ("moderator", "系统保留", 2, "版主账户名"),
    ("Moderator", "系统保留", 2, "版主账户名"),
]

def add_system_reserved_words():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    success_count = 0
    skip_count = 0
    current_time = int(time.time())
    
    print("开始添加系统保留敏感词...")
    print(f"共 {len(SYSTEM_RESERVED_WORDS)} 条待添加\n")
    
    for word, category, level, description in SYSTEM_RESERVED_WORDS:
        try:
            cursor.execute(
                """INSERT INTO sensitive_word 
                   (word, category, level, description, create_time, update_time, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?, 1)""",
                (word, category, level, description, current_time, current_time)
            )
            success_count += 1
            print(f"[OK] 添加成功: {word} [{category}]")
        except sqlite3.IntegrityError:
            skip_count += 1
            print(f"[SKIP] 已存在跳过: {word}")
        except Exception as e:
            print(f"[ERROR] 添加失败: {word} - {str(e)}")
    
    conn.commit()
    conn.close()
    
    print(f"\n{'='*50}")
    print(f"添加完成!")
    print(f"成功: {success_count} 条")
    print(f"跳过: {skip_count} 条")
    print(f"总计: {len(SYSTEM_RESERVED_WORDS)} 条")

if __name__ == "__main__":
    add_system_reserved_words()

import sqlite3
import os
import time

# 获取数据库路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

def create_tables():
    """
    创建敏感词相关表
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 创建敏感词表
        print("正在创建 sensitive_word 表...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensitive_word (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word VARCHAR(100) NOT NULL UNIQUE,
                category VARCHAR(50),
                level INTEGER DEFAULT 1,
                description TEXT,
                create_time INTEGER,
                update_time INTEGER,
                create_user_id INTEGER,
                update_user_id INTEGER,
                is_active INTEGER DEFAULT 1
            )
        """)
        
        # 创建索引
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word ON sensitive_word(word)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word_category ON sensitive_word(category)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word_active ON sensitive_word(is_active)")
        
        # 创建敏感词操作日志表
        print("正在创建 sensitive_word_log 表...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensitive_word_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word_id INTEGER,
                word VARCHAR(100) NOT NULL,
                action VARCHAR(20) NOT NULL,
                old_value TEXT,
                new_value TEXT,
                operator_id INTEGER,
                operator_name VARCHAR(50),
                operate_time INTEGER,
                remark TEXT
            )
        """)
        
        # 创建索引
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word_log_word ON sensitive_word_log(word_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word_log_time ON sensitive_word_log(operate_time)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sensitive_word_log_operator ON sensitive_word_log(operator_id)")
        
        conn.commit()
        print("敏感词相关表创建成功！")
        
        # 插入一些默认敏感词
        print("正在插入默认敏感词...")
        default_words = [
            ("排盘作弊", "业务", 2, "涉及作弊相关词汇"),
            ("算命骗子", "业务", 2, "涉及诈骗相关词汇"),
            ("封建迷信", "业务", 1, "涉及敏感表述"),
        ]
        
        for word, category, level, desc in default_words:
            try:
                cursor.execute(
                    "INSERT OR IGNORE INTO sensitive_word (word, category, level, description, create_time, is_active) VALUES (?, ?, ?, ?, ?, 1)",
                    (word, category, level, desc, int(time.time()))
                )
            except:
                pass
        
        conn.commit()
        print("默认敏感词插入完成！")
        
    except Exception as e:
        conn.rollback()
        print(f"创建表失败: {str(e)}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("开始创建敏感词相关表...")
    create_tables()
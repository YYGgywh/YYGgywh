import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

def verify_sensitive_words():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 统计各分类数量
    cursor.execute("""
        SELECT category, COUNT(*) as count 
        FROM sensitive_word 
        WHERE is_active = 1 
        GROUP BY category
        ORDER BY count DESC
    """)
    
    print("=" * 50)
    print("敏感词统计（按分类）")
    print("=" * 50)
    
    total = 0
    for row in cursor.fetchall():
        print(f"  {row[0] or '未分类'}: {row[1]} 条")
        total += row[1]
    
    print("-" * 50)
    print(f"  总计: {total} 条")
    print("=" * 50)
    
    # 显示部分敏感词
    cursor.execute("""
        SELECT word, category, level 
        FROM sensitive_word 
        WHERE is_active = 1 
        LIMIT 10
    """)
    
    print("\n前10条敏感词示例：")
    for row in cursor.fetchall():
        level_name = "禁止" if row[2] == 2 else "警告"
        print(f"  [{row[1]}] {row[0]} ({level_name})")
    
    conn.close()

if __name__ == "__main__":
    verify_sensitive_words()

"""
 * @file            backend/app/db/migrations/migrate_comment_text.py
 * @description     评论表 content 字段类型迁移脚本（String -> Text）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-21 11:30:00
 * @lastModified    2026-03-21 11:30:00
 * Copyright © All rights reserved
"""

import sqlite3
import os
import sys
import shutil
from datetime import datetime

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import DB_PATH


def create_backup():
    """创建数据库备份"""
    backup_dir = os.path.join(os.path.dirname(DB_PATH), 'backups')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = os.path.join(backup_dir, f'yyggywh_backup_{timestamp}.db')
    
    try:
        shutil.copy2(DB_PATH, backup_path)
        print(f"✅ 数据库备份已创建: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"❌ 备份失败: {str(e)}")
        return None


def check_disk_space():
    """检查磁盘空间是否充足"""
    try:
        stat = os.statvfs(os.path.dirname(DB_PATH))
        free_space = stat.f_frsize * stat.f_bavail
        db_size = os.path.getsize(DB_PATH)
        
        # 需要至少 2 倍数据库大小的空间
        required_space = db_size * 2
        
        if free_space < required_space:
            print(f"⚠️  磁盘空间不足！")
            print(f"   可用空间: {free_space / (1024*1024):.2f} MB")
            print(f"   需要空间: {required_space / (1024*1024):.2f} MB")
            return False
        
        print(f"✅ 磁盘空间充足: {free_space / (1024*1024):.2f} MB")
        return True
    except Exception as e:
        print(f"⚠️  无法检查磁盘空间: {str(e)}")
        return True  # 默认通过


def verify_data_integrity(conn, original_count):
    """验证数据完整性"""
    cursor = conn.cursor()
    
    # 1. 检查数据条数
    cursor.execute("SELECT COUNT(*) FROM comment")
    new_count = cursor.fetchone()[0]
    
    if new_count != original_count:
        print(f"❌ 数据条数不匹配！原表: {original_count}, 新表: {new_count}")
        return False
    
    print(f"✅ 数据条数验证通过: {new_count} 条")
    
    # 2. 抽样验证数据内容
    cursor.execute("SELECT id, content FROM comment LIMIT 5")
    samples = cursor.fetchall()
    
    print("✅ 抽样数据验证:")
    for row in samples:
        content_preview = row[1][:50] + '...' if len(row[1]) > 50 else row[1]
        print(f"   ID {row[0]}: {content_preview}")
    
    return True


def migrate_comment_content_to_text():
    """
    将 comment 表的 content 字段从 VARCHAR 迁移到 TEXT
    
    SQLite 不支持直接修改列类型，需要：
    1. 创建新表
    2. 复制数据
    3. 删除旧表
    4. 重命名新表
    """
    
    print("=" * 60)
    print("开始执行评论表 content 字段迁移")
    print("=" * 60)
    
    # 1. 检查磁盘空间
    if not check_disk_space():
        return False
    
    # 2. 创建备份
    print("\n📦 创建数据库备份...")
    backup_path = create_backup()
    if not backup_path:
        response = input("备份失败，是否继续？(yes/no): ")
        if response.lower() not in ['yes', 'y', '是']:
            print("已取消迁移")
            return False
    
    # 连接数据库
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 3. 检查表是否存在
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='comment'")
        if not cursor.fetchone():
            print("❌ comment 表不存在，无需迁移")
            return False
        
        # 4. 获取原始数据条数
        cursor.execute("SELECT COUNT(*) FROM comment")
        original_count = cursor.fetchone()[0]
        print(f"📊 当前评论数据: {original_count} 条")
        
        # 5. 检查当前字段类型
        cursor.execute("PRAGMA table_info(comment)")
        columns = cursor.fetchall()
        content_column = None
        for col in columns:
            if col[1] == 'content':
                content_column = col
                break
        
        if not content_column:
            print("❌ content 字段不存在")
            return False
        
        current_type = content_column[2]
        print(f"📊 当前 content 字段类型: {current_type}")
        
        # 如果已经是 TEXT 类型，无需迁移
        if current_type.upper() == 'TEXT':
            print("✅ content 字段已经是 TEXT 类型，无需迁移")
            return True
        
        # 6. 确认执行
        print("\n⚠️  警告: 此操作将修改数据库结构")
        print(f"   备份文件: {backup_path}")
        response = input("\n确认执行迁移？(yes/no): ")
        if response.lower() not in ['yes', 'y', '是']:
            print("已取消迁移")
            return False
        
        # 7. 开始迁移
        print("\n🔄 开始迁移...")
        
        # 7.1 创建新表
        print("  1. 创建新表 comment_new...")
        cursor.execute('''
            CREATE TABLE comment_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pan_record_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                create_time INTEGER DEFAULT 0,
                update_time INTEGER DEFAULT 0,
                is_public BOOLEAN DEFAULT 0,
                ext_info VARCHAR DEFAULT '{}',
                audit_status INTEGER DEFAULT 0,
                audit_time INTEGER,
                audit_user_id INTEGER,
                audit_remark VARCHAR,
                is_visible INTEGER DEFAULT 1,
                deleted_at INTEGER,
                FOREIGN KEY (pan_record_id) REFERENCES pan_record (id),
                FOREIGN KEY (user_id) REFERENCES user (id),
                FOREIGN KEY (audit_user_id) REFERENCES user (id)
            )
        ''')
        
        # 7.2 复制数据
        print("  2. 复制数据到新表...")
        cursor.execute('''
            INSERT INTO comment_new 
            SELECT * FROM comment
        ''')
        copied_count = cursor.rowcount
        print(f"     已复制 {copied_count} 条数据")
        
        # 7.3 删除旧表
        print("  3. 删除旧表...")
        cursor.execute("DROP TABLE comment")
        
        # 7.4 重命名新表
        print("  4. 重命名新表...")
        cursor.execute("ALTER TABLE comment_new RENAME TO comment")
        
        # 7.5 重建索引
        print("  5. 重建索引...")
        cursor.execute('''
            CREATE INDEX idx_comment_pan_user ON comment (pan_record_id, user_id)
        ''')
        cursor.execute('''
            CREATE INDEX idx_comment_time ON comment (create_time)
        ''')
        
        # 提交事务
        conn.commit()
        
        # 8. 验证迁移结果
        print("\n🔍 验证迁移结果...")
        cursor.execute("PRAGMA table_info(comment)")
        columns = cursor.fetchall()
        for col in columns:
            if col[1] == 'content':
                print(f"✅ content 字段类型: {col[2]}")
                break
        
        # 9. 数据完整性验证
        if not verify_data_integrity(conn, original_count):
            print("\n❌ 数据完整性验证失败！")
            print(f"请从备份恢复: {backup_path}")
            return False
        
        print("\n" + "=" * 60)
        print("✅ 迁移脚本执行成功！")
        print(f"📦 备份文件: {backup_path}")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ 迁移失败: {str(e)}")
        print(f"📦 请从备份恢复: {backup_path}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        conn.close()


def check_migration_needed():
    """检查是否需要迁移"""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ 数据库文件不存在: {DB_PATH}")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("PRAGMA table_info(comment)")
        columns = cursor.fetchall()
        
        for col in columns:
            if col[1] == 'content':
                if col[2].upper() == 'TEXT':
                    print("✅ content 字段已经是 TEXT 类型，无需迁移")
                    return False
                else:
                    print(f"⚠️  content 字段当前类型: {col[2]}，需要迁移到 TEXT")
                    return True
        
        print("❌ content 字段不存在")
        return False
        
    finally:
        conn.close()


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("评论表 Content 字段迁移工具")
    print("=" * 60 + "\n")
    
    # 检查是否需要迁移
    if check_migration_needed():
        success = migrate_comment_content_to_text()
        sys.exit(0 if success else 1)
    else:
        print("\n无需执行迁移")
        sys.exit(0)

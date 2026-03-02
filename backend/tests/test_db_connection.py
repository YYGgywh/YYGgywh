#!/usr/bin/env python3
# 测试数据库连接

from app.db.database import engine, get_db
from sqlalchemy import inspect

print("测试数据库连接...")

# 测试引擎连接
try:
    with engine.connect() as conn:
        print("✅ 数据库引擎连接成功")
        
        # 测试数据库检查器
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"✅ 数据库中有 {len(tables)} 个表")
        print(f"表名: {tables}")
        
        # 测试用户表
        if 'user' in tables:
            columns = inspector.get_columns('user')
            print(f"✅ 用户表有 {len(columns)} 个字段")
            print("用户表字段:")
            for col in columns[:5]:  # 只显示前5个字段
                print(f"  - {col['name']}")
            if len(columns) > 5:
                print(f"  ... 等 {len(columns) - 5} 个字段")
        else:
            print("❌ 用户表不存在")
            
    # 测试会话
    db = next(get_db())
    print("✅ 数据库会话创建成功")
    db.close()
    
    print("\n✅ 数据库连接测试通过！")
    
except Exception as e:
    print(f"❌ 数据库连接失败: {str(e)}")
    exit(1)
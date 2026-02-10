#!/usr/bin/env python3
"""
组件回滚脚本
用于在组件废弃后需要恢复时快速回滚到之前的状态
"""

import os
import shutil
from pathlib import Path

class ComponentRollback:
    def __init__(self, backup_dir="backup"):
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(exist_ok=True)
        
    def backup_component(self, file_path, component_name):
        """备份组件文件"""
        source_path = Path(file_path)
        if not source_path.exists():
            print(f"⚠️  警告: 源文件 {file_path} 不存在")
            return False
            
        backup_path = self.backup_dir / f"{component_name}.py"
        shutil.copy2(source_path, backup_path)
        print(f"✅ 已备份 {component_name} 到 {backup_path}")
        return True
    
    def restore_component(self, component_name, target_path):
        """恢复组件文件"""
        backup_path = self.backup_dir / f"{component_name}.py"
        target_path = Path(target_path)
        
        if not backup_path.exists():
            print(f"❌ 错误: 备份文件 {backup_path} 不存在")
            return False
            
        # 确保目标目录存在
        target_path.parent.mkdir(parents=True, exist_ok=True)
        
        shutil.copy2(backup_path, target_path)
        print(f"✅ 已恢复 {component_name} 到 {target_path}")
        return True
    
    def list_backups(self):
        """列出所有备份文件"""
        if not self.backup_dir.exists():
            print("❌ 备份目录不存在")
            return
            
        print("📋 可用备份文件:")
        for file in self.backup_dir.glob("*.py"):
            print(f"  - {file.stem}")

def main():
    rollback = ComponentRollback()
    
    # 定义需要备份的组件列表
    components_to_backup = [
        {
            "name": "lunar_calculator",
            "path": "src/algorithms/lunar_calculator.py"
        },
        {
            "name": "validators", 
            "path": "src/utils/validators.py"
        }
    ]
    
    print("🚀 组件回滚系统启动")
    print("=" * 50)
    
    # 备份所有组件
    print("📦 开始备份组件...")
    for component in components_to_backup:
        rollback.backup_component(component["path"], component["name"])
    
    print("\n" + "=" * 50)
    print("✅ 备份完成")
    
    # 显示备份列表
    rollback.list_backups()

if __name__ == "__main__":
    main()
# backend/src/validators/liuyao_validator.py 2026-02-13 10:30:00
# 功能：六爻排盘输入验证器，验证起卦数列的有效性（时间验证复用calendar_validator）

from typing import Dict, List, Any  # 导入类型注解工具：Dict（字典类型）、List（列表类型）、Any（任意类型）

# 定义六爻排盘输入验证器类
class LiuYaoValidator:
    # 定义验证起卦数列数据格式的方法，接收爻位列表参数，返回验证结果字典
    def validate_yao_data(self, yao_list: List[str]) -> Dict[str, Any]:        
        # 检查列表长度
        if not isinstance(yao_list, list):  # 判断爻位列表是否为列表类型
            return {"valid": False, "error": "起卦数列必须是列表类型"}  # 如果不是列表类型，返回验证失败和错误信息
        
        if len(yao_list) != 6:  # 判断爻位列表长度是否为6
            return {"valid": False, "error": "起卦数列必须包含6个元素"}  # 如果长度不为6，返回验证失败和错误信息
        
        # 检查每个爻位的格式
        # 遍历爻位列表，同时获取索引和爻位值
        for i, yao in enumerate(yao_list):
            # 判断当前爻位是否为字符串类型
            if not isinstance(yao, str):
                return {"valid": False, "error": f"第{i+1}个爻位必须是字符串类型"}  # 如果不是字符串类型，返回验证失败和错误信息
            # 判断当前爻位长度是否为3
            if len(yao) != 3:
                return {"valid": False, "error": f"第{i+1}个爻位必须是3位数"}  # 如果长度不为3，返回验证失败和错误信息
            
            # 判断当前爻位是否全为数字
            if not yao.isdigit():
                return {"valid": False, "error": f"第{i+1}个爻位必须由数字组成"}  # 如果不全是数字，返回验证失败和错误信息
        
        return {"valid": True, "error": ""}  # 所有检查通过，返回验证成功和空错误信息


# 创建全局验证器实例  # 注释：创建验证器的全局实例
liuyao_validator = LiuYaoValidator()  # 实例化LiuYaoValidator类，创建全局验证器实例供其他模块使用
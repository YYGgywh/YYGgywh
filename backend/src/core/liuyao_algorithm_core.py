# backend/src/core/liuyao_algorithm_core.py 2026-02-11 13:15:00
# 功能：六爻排盘核心算法实现，提供完整的六爻计算功能

import random
from typing import List, Dict, Any, Optional

# 导入静态配置数据
from data.liuyao_configuration_data import SIXTY_FOUR_GUA, GUA_PALACES, TIAN_GAN_TO_LIU_SHEN


class LiuYaoAlgorithmCore:
    """六爻排盘核心算法类"""
    
    def __init__(self):
        self.sixty_four_gua = SIXTY_FOUR_GUA
        self.gua_palaces = GUA_PALACES
        self.tian_gan_to_liu_shen = TIAN_GAN_TO_LIU_SHEN
    
    def validate_yao_data(self, yao_list: List[str]) -> bool:
        """
        验证前端提交的爻位数据格式
        
        Args:
            yao_list: 前端提交的6个三位数组成的爻位列表
            
        Returns:
            bool: 数据格式是否有效
        """
        # 检查列表长度
        if len(yao_list) != 6:
            return False
        
        # 检查每个爻位的格式
        for yao in yao_list:
            if len(yao) != 3 or not yao.isdigit():
                return False
        
        return True
    
    def count_odd_digits(self, yao_list: List[str]) -> List[int]:
        """
        统计每个爻位中奇数的个数
        
        Args:
            yao_list: 6个三位数组成的爻位列表
            
        Returns:
            List[int]: 每个爻位中奇数个数的列表
        """
        if len(yao_list) != 6:
            raise ValueError("爻位列表必须包含6个元素")
        
        odd_counts_list = []
        for yao in yao_list:
            if len(yao) != 3:
                raise ValueError("每个爻位必须是3位数")
            if not yao.isdigit():
                raise ValueError("爻位必须由数字组成")
            
            odd_count = sum(1 for digit in yao if int(digit) % 2 == 1)
            odd_counts_list.append(odd_count)
        return odd_counts_list
    
    def ben_gua_najia(self, odd_counts_list: List[int]) -> Dict[str, Any]:
        """
        本卦纳甲计算
        
        Args:
            odd_counts_list: 奇数个数列表
            
        Returns:
            Dict: 本卦信息字典
        """
        # 将奇数个数转换为阴阳爻（1为阳爻，0为阴爻）
        ben_gua_list = [1 if v % 2 == 1 else 0 for v in odd_counts_list]
        ben_gua_str = ''.join(map(str, ben_gua_list))
        
        # 查找对应的卦象
        ben_gua_info_dict = self.sixty_four_gua.get(ben_gua_str, {})
        ben_gua_info_dict['数列'] = ben_gua_list
        
        return ben_gua_info_dict
    
    def dong_yao(self, odd_counts_list: List[int]) -> tuple[List[int], List[str]]:
        """
        动爻判断
        
        Args:
            odd_counts_list: 奇数个数列表
            
        Returns:
            tuple: (动爻位列表, 动爻符号列表)
        """
        dong_yao_wei_list = [i + 1 for i, v in enumerate(odd_counts_list) if v in (0, 3)]
        
        # 根据奇数个数生成动爻符号列表
        dong_yao_list = []
        for v in odd_counts_list:
            if v == 0:
                dong_yao_list.append('×→')
            elif v == 3:
                dong_yao_list.append('○→')
            else:
                dong_yao_list.append('')
        
        return dong_yao_wei_list, dong_yao_list
    
    def bian_gua_najia(self, odd_counts_list: List[int], ben_gua_info_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        变卦纳甲计算
        
        Args:
            odd_counts_list: 奇数个数列表
            ben_gua_info_dict: 本卦信息字典
            
        Returns:
            Dict: 变卦信息字典，无动爻时返回空字典
        """
        # 检查是否有动爻
        dong_yao_wei_list = [i + 1 for i, v in enumerate(odd_counts_list) if v in (0, 3)]
        if len(dong_yao_wei_list) == 0:
            return {}
        
        # 计算变卦
        bian_gua_list = [1 if v == 0 else 0 if v in (2, 3) else 1 for v in odd_counts_list]
        bian_gua_str = ''.join(map(str, bian_gua_list))
        
        # 查找对应的卦象
        bian_gua_info_dict = self.sixty_four_gua.get(bian_gua_str, {})
        
        # 重新计算变卦六亲
        ben_gua_gong = ben_gua_info_dict.get('卦宫', '未知卦宫')
        if ben_gua_gong in self.gua_palaces:
            bian_gua_liuqin_list = []
            for dizhi in bian_gua_info_dict.get('纳支', []):
                liuqin = self.gua_palaces[ben_gua_gong].get(dizhi, '未知六亲')
                bian_gua_liuqin_list.append(liuqin)
            bian_gua_info_dict['六亲'] = bian_gua_liuqin_list
        
        bian_gua_info_dict['数列'] = bian_gua_list
        
        return bian_gua_info_dict
    
    def calculate_liu_shen(self, day_gan: str) -> List[str]:
        """
        计算六神分布
        
        Args:
            day_gan: 日干（甲、乙、丙、丁、戊、己、庚、辛、壬、癸）
            
        Returns:
            List[str]: 六神分布列表（从初爻到上爻）
        """
        valid_day_gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
        if day_gan not in valid_day_gans:
            raise ValueError(f"无效的日干: {day_gan}，必须是{valid_day_gans}中的一个")
        
        return self.tian_gan_to_liu_shen.get(day_gan, [])
    
    def calculate_paipan(self, yao_list: List[str], day_gan: str) -> Dict[str, Any]:
        """
        完整的六爻排盘计算
        
        Args:
            yao_list: 起卦列表数据（6个三位数）
            day_gan: 日干信息
            
        Returns:
            Dict: 完整的排盘结果
        """
        # 1. 统计奇数个数
        odd_counts_list = self.count_odd_digits(yao_list)
        
        # 2. 计算本卦
        ben_gua_info = self.ben_gua_najia(odd_counts_list)
        
        # 3. 判断动爻
        dong_yao_wei_list, dong_list = self.dong_yao(odd_counts_list)
        
        # 4. 计算变卦（如果有动爻）
        bian_gua_info = self.bian_gua_najia(odd_counts_list, ben_gua_info)
        
        # 5. 计算六神
        liu_shen_list = self.calculate_liu_shen(day_gan)
        
        # 6. 构建完整结果
        result = {
            "yao_list": yao_list,
            "odd_counts": odd_counts_list,
            "ben_gua": ben_gua_info,
            "dong_yao": {
                "positions": dong_yao_wei_list,
                "symbols": dong_list
            },
            "bian_gua": bian_gua_info,
            "liu_shen": liu_shen_list,
            "day_gan": day_gan
        }
        
        return result
    
    def get_hexagram_list(self) -> List[Dict[str, Any]]:
        """
        获取六十四卦列表
        
        Returns:
            List[Dict]: 六十四卦信息列表
        """
        hexagram_list = []
        for gua_code, gua_info in self.sixty_four_gua.items():
            hexagram_info = {
                "code": gua_code,
                "name": gua_info.get("卦名", ""),
                "palace": gua_info.get("卦宫", ""),
                "nature": gua_info.get("宫属", ""),
                "upper": gua_info.get("上卦", ""),
                "lower": gua_info.get("下卦", "")
            }
            hexagram_list.append(hexagram_info)
        
        return hexagram_list


# 默认导出列表
__all__ = ['LiuYaoAlgorithmCore']
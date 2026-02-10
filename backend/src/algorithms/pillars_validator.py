"""
四柱验证器
用于验证四柱干支组合的合法性
"""
from typing import Dict, List, Tuple


class PillarsValidator:
    """四柱验证器类"""
    
    # 天干列表
    TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    
    # 地支列表
    DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    
    # 六十甲子组合
    JIA_ZI_COMBINATIONS = [
        "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
        "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
        "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
        "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
        "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
        "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
    ]
    
    # 五虎遁表（年干 -> 正月月干）
    WU_HU_DUN = {
        "甲": "丙", "乙": "戊", "丙": "庚", "丁": "壬", "戊": "甲",
        "己": "丙", "庚": "戊", "辛": "庚", "壬": "壬", "癸": "甲"
    }
    
    # 五鼠遁表（日干 -> 子时时干）
    WU_SHU_DUN = {
        "甲": "甲", "乙": "丙", "丙": "戊", "丁": "庚", "戊": "壬",
        "己": "甲", "庚": "丙", "辛": "戊", "壬": "庚", "癸": "壬"
    }
    
    def __init__(self):
        pass
    
    def validate_pillars(self, pillars: str) -> Dict:
        """
        验证四柱干支组合的合法性
        
        Args:
            pillars: 四柱字符串，格式为"年干支月干支日干支时干支"，如"甲子丙寅戊辰庚午"
            
        Returns:
            验证结果字典，包含valid字段和错误信息
        """
        # 第一步：基础格式验证
        format_result = self._validate_format(pillars)
        if not format_result["valid"]:
            return format_result
        
        # 提取四柱
        year_pillar = pillars[0:2]  # 年柱
        month_pillar = pillars[2:4]  # 月柱
        day_pillar = pillars[4:6]    # 日柱
        time_pillar = pillars[6:8]   # 时柱
        
        # 第二步：干支组合验证（六十甲子）
        jiazi_result = self._validate_jiazi_combinations([year_pillar, month_pillar, day_pillar, time_pillar])
        if not jiazi_result["valid"]:
            return jiazi_result
        
        # 第三步：月干推算验证（五虎遁）
        wuhu_result = self._validate_wuhu_dun(year_pillar[0], month_pillar)
        if not wuhu_result["valid"]:
            return wuhu_result
        
        # 第四步：时干推算验证（五鼠遁）
        wushu_result = self._validate_wushu_dun(day_pillar[0], time_pillar)
        if not wushu_result["valid"]:
            return wushu_result
        
        return {
            "valid": True,
            "message": "四柱验证通过",
            "pillars": {
                "year": year_pillar,
                "month": month_pillar,
                "day": day_pillar,
                "time": time_pillar
            }
        }
    
    def _validate_format(self, pillars: str) -> Dict:
        """验证四柱格式"""
        if not pillars:
            return {"valid": False, "message": "四柱不能为空"}
        
        if len(pillars) != 8:
            return {"valid": False, "message": f"四柱长度必须为8个字符，当前为{len(pillars)}个"}
        
        # 检查每个字符是否在有效范围内
        for i, char in enumerate(pillars):
            if i % 2 == 0:  # 天干位置
                if char not in self.TIAN_GAN:
                    return {"valid": False, "message": f"第{i+1}个字符'{char}'不是有效的天干"}
            else:  # 地支位置
                if char not in self.DI_ZHI:
                    return {"valid": False, "message": f"第{i+1}个字符'{char}'不是有效的地支"}
        
        return {"valid": True, "message": "格式验证通过"}
    
    def _validate_jiazi_combinations(self, pillars: List[str]) -> Dict:
        """验证干支组合是否符合六十甲子"""
        for pillar in pillars:
            if pillar not in self.JIA_ZI_COMBINATIONS:
                return {
                    "valid": False, 
                    "message": f"干支组合'{pillar}'不符合六十甲子规则"
                }
        
        return {"valid": True, "message": "干支组合验证通过"}
    
    def _validate_wuhu_dun(self, year_gan: str, month_pillar: str) -> Dict:
        """验证五虎遁规则（月干推算）"""
        # 根据年干获取正月（寅月）的月干
        expected_first_month_gan = self.WU_HU_DUN.get(year_gan)
        if not expected_first_month_gan:
            return {"valid": False, "message": f"年干'{year_gan}'无效"}
        
        # 获取月柱的地支
        month_zhi = month_pillar[1]
        
        # 计算地支在列表中的索引
        zhi_index = self.DI_ZHI.index(month_zhi)
        
        # 计算正月（寅月）在地支列表中的索引
        yin_index = self.DI_ZHI.index("寅")
        
        # 计算月数差
        month_diff = (zhi_index - yin_index) % 12
        
        # 根据正月月干推算当前月的月干
        first_month_gan_index = self.TIAN_GAN.index(expected_first_month_gan)
        expected_month_gan_index = (first_month_gan_index + month_diff) % 10
        expected_month_gan = self.TIAN_GAN[expected_month_gan_index]
        
        # 验证月干是否匹配
        actual_month_gan = month_pillar[0]
        if actual_month_gan != expected_month_gan:
            return {
                "valid": False,
                "message": f"月干验证失败：年干{year_gan}，月支{month_zhi}，期望月干{expected_month_gan}，实际月干{actual_month_gan}"
            }
        
        return {"valid": True, "message": "五虎遁验证通过"}
    
    def _validate_wushu_dun(self, day_gan: str, time_pillar: str) -> Dict:
        """验证五鼠遁规则（时干推算）"""
        # 根据日干获取子时的时干
        expected_first_time_gan = self.WU_SHU_DUN.get(day_gan)
        if not expected_first_time_gan:
            return {"valid": False, "message": f"日干'{day_gan}'无效"}
        
        # 获取时柱的地支
        time_zhi = time_pillar[1]
        
        # 计算地支在列表中的索引
        zhi_index = self.DI_ZHI.index(time_zhi)
        
        # 计算子时在地支列表中的索引
        zi_index = self.DI_ZHI.index("子")
        
        # 计算时辰差
        time_diff = (zhi_index - zi_index) % 12
        
        # 根据子时时干推算当前时辰的时干
        first_time_gan_index = self.TIAN_GAN.index(expected_first_time_gan)
        expected_time_gan_index = (first_time_gan_index + time_diff) % 10
        expected_time_gan = self.TIAN_GAN[expected_time_gan_index]
        
        # 验证时干是否匹配
        actual_time_gan = time_pillar[0]
        if actual_time_gan != expected_time_gan:
            return {
                "valid": False,
                "message": f"时干验证失败：日干{day_gan}，时支{time_zhi}，期望时干{expected_time_gan}，实际时干{actual_time_gan}"
            }
        
        return {"valid": True, "message": "五鼠遁验证通过"}
    
    def get_jiazi_list(self) -> List[str]:
        """获取六十甲子列表"""
        return self.JIA_ZI_COMBINATIONS.copy()
    
    def get_tiangan_list(self) -> List[str]:
        """获取天干列表"""
        return self.TIAN_GAN.copy()
    
    def get_dizhi_list(self) -> List[str]:
        """获取地支列表"""
        return self.DI_ZHI.copy()
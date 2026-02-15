# backend/src/core/liuyao_algorithm_core.py 2026-02-14 10:00:00
# 功能：六爻排盘核心算法实现，集成历法转换功能，提供完整的六爻计算与历法信息

from typing import List, Dict, Any, Optional, Tuple  # 导入类型注解工具：List（列表类型）、Dict（字典类型）、Any（任意类型）、Optional（可选类型）、Tuple（元组类型）
from collections import OrderedDict  # 导入有序字典，用于实现LRU缓存
from data.liuyao_configuration_data import SIXTY_FOUR_GUA, GUA_PALACES, TIAN_GAN_TO_LIU_SHEN  # 导入六十四卦、卦宫和天干转六神的静态数据
from src.core.calendar_algorithm_core import calendar_algorithm_core  # 导入历法算法核心实例，用于公历农历转换和干支计算
from src.validators.liuyao_validator import liuyao_validator  # 导入六爻验证器实例，用于Core层验证

# 六爻排盘核心算法类
class LiuYaoAlgorithmCore:
    # 初始化六爻算法核心类
    def __init__(self, max_cache_size: int = 100):
        self.sixty_four_gua = SIXTY_FOUR_GUA  # 存储六十四卦静态数据
        self.gua_palaces = GUA_PALACES  # 存储卦宫静态数据
        self.tian_gan_to_liu_shen = TIAN_GAN_TO_LIU_SHEN  # 存储天干转六神的静态数据
        self.calendar_cache = OrderedDict()  # 使用有序字典实现LRU缓存
        self.max_cache_size = max_cache_size  # 最大缓存大小

    # 统计每个爻位中奇数的个数
    def count_odd_digits(self, yao_list: List[str], validate: bool = True) -> List[int]:
        # Core层验证：使用六爻验证器进行详细验证（可通过参数控制是否验证）
        if validate:
            validation_result = liuyao_validator.validate_yao_data(yao_list)
            # 如果验证结果无效，则抛出带有Core层标识的值错误异常
            if not validation_result["valid"]:
                raise ValueError(f"[Core层验证] {validation_result['error']}")
        
        odd_counts_list = []  # 初始化奇数个数列表
        # 遍历每个爻位
        for yao in yao_list:
            odd_count = sum(1 for digit in yao if int(digit) % 2 == 1)  # 统计奇数个数
            odd_counts_list.append(odd_count)  # 将奇数个数添加到列表中
        return odd_counts_list  # 返回奇数个数列表
    
    # 本卦纳甲计算
    def ben_gua_najia(self, odd_counts_list: List[int]) -> Tuple[Dict[str, Any], str]:
        # 将奇数个数转换为阴阳爻（1为阳爻，0为阴爻）
        ben_gua_list = [1 if v % 2 == 1 else 0 for v in odd_counts_list]  # 列表推导式，转换为阴阳爻列表
        ben_gua_str = ''.join(map(str, ben_gua_list))  # 将列表转换为字符串
        
        # 查找对应的卦象
        ben_gua_info_dict = self.sixty_four_gua.get(ben_gua_str, {})  # 从六十四卦中查找对应的纳甲信息
        ben_gua_info_dict['数列'] = ben_gua_list  # 添加数列信息到卦象字典中
        
        return ben_gua_info_dict, ben_gua_str  # 返回本卦信息字典和本卦字符串
    
    # 动爻判断
    def dong_yao(self, odd_counts_list: List[int]) -> Tuple[List[int], List[str]]:
        dong_yao_positions = []  # 动爻位置列表
        dong_yao_symbols = []  # 动爻符号列表
        
        # 遍历奇数个数列表，一次遍历完成动爻位和符号的判断
        for i, v in enumerate(odd_counts_list):
            if v == 0:  # 如果奇数个数为0
                dong_yao_positions.append(i + 1)
                dong_yao_symbols.append('×→')  # 添加阴爻动爻符号
            elif v == 3:  # 如果奇数个数为3
                dong_yao_positions.append(i + 1)
                dong_yao_symbols.append('○→')  # 添加阳爻动爻符号
            else:  # 如果不是动爻
                dong_yao_symbols.append('')  # 添加空字符串
        
        return dong_yao_positions, dong_yao_symbols  # 返回动爻位置列表和动爻符号列表
    
    # 判断是否有伏神
    def has_fu_shen(self, odd_counts_list: List[int]) -> Tuple[bool, List[int]]:
        dong_yao_positions = [i + 1 for i, v in enumerate(odd_counts_list) if v in (0, 3)]  # 计算动爻位
        if len(dong_yao_positions) == 0:  # 如果没有动爻
            return False, []  # 返回False和空列表
        # 判断是否有伏神（动爻位是否包含1或2）
        has_fu_shen = any(pos in dong_yao_positions for pos in [1, 2])
        return has_fu_shen, dong_yao_positions  # 返回是否有伏神和动爻位置列表
    
    # 变卦纳甲计算
    def bian_gua_najia(self, odd_counts_list: List[int], ben_gua_info_dict: Dict[str, Any]) -> Tuple[Dict[str, Any], str]:
        # 检查是否有动爻
        dong_yao_positions = [i + 1 for i, v in enumerate(odd_counts_list) if v in (0, 3)]  # 计算动爻位
        if len(dong_yao_positions) == 0:  # 如果没有动爻
            return {}, ""  # 返回空字典和空字符串
        
        bian_gua_list = [1 if v == 0 else 0 if v in (2, 3) else 1 for v in odd_counts_list]  # 列表推导式，计算变卦的阴阳爻列表
        bian_gua_str = ''.join(map(str, bian_gua_list))  # 将列表转换为字符串
        bian_gua_info_dict = self.sixty_four_gua.get(bian_gua_str, {})  # 从六十四卦中查找对应的变卦信息
        
        # 重新计算变卦六亲
        ben_gua_gong = ben_gua_info_dict.get('卦宫', '未知卦宫')  # 获取本卦的卦宫
        if ben_gua_gong in self.gua_palaces:  # 如果本卦卦宫在卦宫数据中
            bian_gua_liuqin_list = []  # 初始化变卦六亲列表
            for dizhi in bian_gua_info_dict.get('纳支', []):  # 遍历变卦的纳支
                liuqin = self.gua_palaces[ben_gua_gong].get(dizhi, '未知六亲')  # 根据卦宫和地支获取六亲
                bian_gua_liuqin_list.append(liuqin)  # 将六亲添加到列表中
            bian_gua_info_dict['六亲'] = bian_gua_liuqin_list  # 添加六亲信息到变卦字典中
        
        bian_gua_info_dict['数列'] = bian_gua_list  # 添加数列信息到变卦字典中
        
        return bian_gua_info_dict, bian_gua_str  # 返回变卦信息字典和变卦字符串
    
    # 六神分布计算
    def calculate_liu_shen(self, day_gan: str) -> List[str]:
        valid_day_gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]  # 有效的日干列表
        if day_gan not in valid_day_gans:  # 检查日干是否有效
            raise ValueError(f"[Core层验证] 无效的日干: {day_gan}，必须是{valid_day_gans}中的一个")  # 抛出带有Core层标识的值错误异常
        
        return self.tian_gan_to_liu_shen.get(day_gan, [])  # 从天干转六神数据中获取六神分布列表
    
    # 私有方法：获取历法信息（带LRU缓存）
    def _get_calendar_info_with_cache(self, **kwargs) -> Dict[str, Any]:
        
        cache_key = str(sorted(kwargs.items())) # 生成缓存键，将参数转换为字符串
        
        # 检查缓存中是否存在该历法信息
        if cache_key in self.calendar_cache:
            # 移动到末尾（最近使用）
            self.calendar_cache.move_to_end(cache_key)
            return self.calendar_cache[cache_key]  # 返回缓存的历法信息
        
        # 缓存中不存在，调用历法核心计算
        if 'lunar_year' in kwargs:
            # 农历转公历
            calendar_info = calendar_algorithm_core.convert_lunar_to_solar(**kwargs)
        else:
            # 公历转农历
            calendar_info = calendar_algorithm_core.convert_solar_to_lunar(**kwargs)
        
        # 将计算结果存入缓存
        self.calendar_cache[cache_key] = calendar_info
        
        # 检查缓存大小，如果超过限制，删除最旧的
        if len(self.calendar_cache) > self.max_cache_size:
            self.calendar_cache.popitem(last=False)
        
        return calendar_info  # 返回历法信息
    
    # 私有方法：安全获取数组元素
    def _safe_get_array_element(self, data: Dict[str, Any], key: str, index: int) -> str:
        """安全获取数组元素，避免索引越界"""
        array = data.get(key, [])
        return array[index] if index < len(array) else ""
    
    # 私有方法：获取爻的阴阳属性
    def _get_yao_nature(self, data: Dict[str, Any], index: int) -> str:
        """获取爻的阴阳属性（阳爻为"阳"，阴爻为"阴"）"""
        array = data.get("数列", [])
        if index >= len(array):
            return ""
        return "阳" if array[index] == 1 else "阴"
    
    # 私有方法：统一计算逻辑
    def _calculate_paipan_common(self, yao_list: List[str], calendar_info: Dict[str, Any], validate: bool = True) -> Dict[str, Any]:
        # 从历法信息中提取日干
        day_gan = calendar_info.get('ganzhi_info', {}).get('lunar_day_in_gan_exact', '甲')
        
        # 统计奇数个数（传递验证控制参数）
        odd_counts_list = self.count_odd_digits(yao_list, validate=validate)  # 调用count_odd_digits方法统计奇数个数，传递验证控制参数
        
        # 计算本卦
        ben_gua_info, ben_gua_str = self.ben_gua_najia(odd_counts_list)  # 调用ben_gua_najia方法计算本卦，获取本卦字符串
        
        # 判断动爻
        dong_yao_positions, dong_yao_symbols = self.dong_yao(odd_counts_list)  # 调用dong_yao方法判断动爻
        
        # 判断是否有动爻
        has_dong_yao = len(dong_yao_positions) > 0  # 判断是否有动爻（动爻位置列表长度大于0）
        
        # 计算变卦（如果有动爻）
        bian_gua_info, bian_gua_str = self.bian_gua_najia(odd_counts_list, ben_gua_info) if has_dong_yao else ({}, "")  # 如果有动爻则计算变卦，否则返回空字典和空字符串
        
        # 计算六神
        liu_shen_list = self.calculate_liu_shen(day_gan)  # 调用calculate_liu_shen方法计算六神分布
        
        # 获取伏神爻位信息（根据伏干列表判断哪些爻位有伏神）
        fu_gan_list = ben_gua_info.get("伏干", [])  # 获取伏干列表
        fu_shen_wei_list = []  # 初始化伏神爻位列表
        
        # 遍历伏干列表，找出所有伏神爻位
        for i, fu_gan in enumerate(fu_gan_list):
            if fu_gan:  # 如果伏干不为空，说明该爻位有伏神
                fu_shen_wei_list.append(i + 1)  # 添加爻位位置（从下往上：1→6）
        
        # 旧返回格式（已注释）
        # result = {
        #     "calendar_info": calendar_info,  # 历法信息
        #     "yao_list": yao_list,  # 原始爻位列表
        #     "odd_counts": odd_counts_list,  # 奇数个数列表
        #     "ben_gua": ben_gua_info,  # 本卦信息
        #     "dong_yao": {
        #         "positions": dong_yao_positions,  # 动爻位置列表
        #         "symbols": dong_yao_symbols  # 动爻符号列表
        #     },
        #     "bian_gua": bian_gua_info,  # 变卦信息
        #     "liu_shen": liu_shen_list,  # 六神分布列表
        #     "day_gan": day_gan  # 日干信息
        # }
        
        # 新的响应格式：整合爻位信息（从上往下：6→1）
        ben_gua_body = []  # 初始化本卦主体
        bian_gua_body = []  # 初始化变卦主体
        dong_yao_details = []  # 初始化动爻详细信息
        
        # 从上往下遍历主、动、变（第六爻到第一爻）
        for i in range(6):            
            original_index = 5 - i # 原始索引（从下往上：0→5）            
            position = 6 - i # 调整后的position（从上往下：6→1）            
            # 本卦爻位信息（构建公共字段，根据是否有伏神决定是否包含伏神字段）
            # 构建公共字段（无论是否有伏神都包含）
            ben_gua_body_info = {
                "position": position,  # 爻位位置，从上往下排列（6→1）
                "liu_shen": liu_shen_list[original_index] if original_index < len(liu_shen_list) else "",  # 逆序分解六神分布
                "liu_qin": self._safe_get_array_element(ben_gua_info, "六亲", original_index),  # 逆序分解六亲
                "na_gan": self._safe_get_array_element(ben_gua_info, "纳干", original_index),  # 逆序分解纳干
                "na_zhi": self._safe_get_array_element(ben_gua_info, "纳支", original_index),  # 逆序分解纳支
                "shi_ying": self._safe_get_array_element(ben_gua_info, "世应", original_index),  # 逆序分解世应位置
                "yao_nature": self._get_yao_nature(ben_gua_info, original_index)  # 逆序分解爻的阴阳属性（1为阳爻，0为阴爻）
            }
            # 如果有伏神，添加伏神字段
            if fu_shen_wei_list:
                ben_gua_body_info.update({
                    "fu_qin": self._safe_get_array_element(ben_gua_info, "伏亲", original_index),  # 逆序分解伏亲
                    "fu_gan": self._safe_get_array_element(ben_gua_info, "伏干", original_index),  # 逆序分解伏干
                    "fu_zhi": self._safe_get_array_element(ben_gua_info, "伏支", original_index)  # 逆序分解伏支
                })
            ben_gua_body.append(ben_gua_body_info)            
            
            # 如果有动爻，才构建动爻详细信息和变卦爻位信息
            if has_dong_yao:
                # 构建动爻详细信息（6~1爻都需要）
                dong_yao_detail = {
                    "position": position,  # 动爻位置（从上往下：6→1）
                    "symbol": "○→" if odd_counts_list[original_index] == 3 else "×→" if odd_counts_list[original_index] == 0 else "",  # 动爻符号（阳爻动为○→，阴爻动为×→，不动爻为空）
                    "yao_nature": "阳" if odd_counts_list[original_index] in (1, 3) else "阴" if odd_counts_list[original_index] in (0, 2) else ""  # 动爻的阴阳属性（阳爻为"阳"，阴爻为"阴"，不动爻为空）
                }
                dong_yao_details.append(dong_yao_detail)  # 将动爻详细信息添加到列表中，最终dong_yao_details包含6~1爻的完整信息
                
                # 变卦爻位信息
                bian_gua_body_info = {
                    "position": position,  # 逆序分解爻位位置，从上往下排列（6→1）
                    "liu_qin": self._safe_get_array_element(bian_gua_info, "六亲", original_index),  # 逆序分解六亲
                    "na_gan": self._safe_get_array_element(bian_gua_info, "纳干", original_index),  # 逆序分解纳天干
                    "na_zhi": self._safe_get_array_element(bian_gua_info, "纳支", original_index),  # 逆序分解纳地支
                    "shi_ying": self._safe_get_array_element(bian_gua_info, "世应", original_index),  # 逆序分解世应位置
                    "yao_nature": self._get_yao_nature(bian_gua_info, original_index)  # 爻的阴阳属性（1为阳爻，0为阴爻）
                }
                bian_gua_body.append(bian_gua_body_info)

        # 构建新的返回结果（移除冗余的success字段，Core层通过异常表示失败）
        result = {
            "liuyao_config_data": {
                "calendar_info": calendar_info,
                "ben_gua_head": {
                    "ben_gua_name": ben_gua_info.get("卦名", ""),  # 本卦卦名
                    "ben_gua_code": ben_gua_str,  # 本卦字符串（如"111111"）
                    "ben_gua_palace": ben_gua_info.get("卦宫", ""),  # 本卦卦宫
                    "ben_gua_nature": ben_gua_info.get("宫属", ""),  # 本卦宫属（金木水火土）
                    "ben_gua_upper": ben_gua_info.get("上卦", ""),  # 本卦上卦
                    "ben_gua_lower": ben_gua_info.get("下卦", ""),  # 本卦下卦
                    "fu_shen_wei_list": fu_shen_wei_list,  # 伏神爻位列表（从下往上：1→6），始终返回，用于判断是否有伏神
                },                
                "ben_gua_body": ben_gua_body  # 本卦主体（六个爻位的详细信息，包含世应信息）
            },
            "message": "六爻排盘计算成功"
        }
        
        # 如果有动爻，才添加动爻和变卦信息
        if has_dong_yao:
            result["liuyao_config_data"]["dong_yao_info"] = {
                "positions": dong_yao_positions,  # 动爻位置列表（从下往上：1→6）
                "count": len(dong_yao_positions),  # 动爻数量
                "details": dong_yao_details  # 动爻详细信息列表（6~1爻的完整信息）
            }
            result["liuyao_config_data"]["bian_gua_head"] = {
                "name": bian_gua_info.get("卦名", ""),  # 变卦卦名
                "code": bian_gua_str,  # 变卦字符串（如"011111"）
                "palace": bian_gua_info.get("卦宫", ""),  # 变卦卦宫
                "nature": bian_gua_info.get("宫属", ""),  # 变卦宫属（金木水火土）
                "upper": bian_gua_info.get("上卦", ""),  # 变卦上卦
                "lower": bian_gua_info.get("下卦", "")  # 变卦下卦
            }
            result["liuyao_config_data"]["bian_gua_body"] = bian_gua_body  # 变卦主体（六个爻位的详细信息，包含世应信息）
        
        return result  # 返回完整的排盘结果
    
    # 完整六爻排盘计算（包含公历信息）
    def calculate_paipan_with_solar_calendar(self, yao_list: List[str], year: int, month: int, day: int, hour: int = 0, minute: int = 0, second: int = 0, validate: bool = True) -> Dict[str, Any]:
        # 1. 获取历法信息（使用缓存）
        calendar_info = self._get_calendar_info_with_cache(
            year=year, month=month, day=day, hour=hour, minute=minute, second=second
        )
        
        # 2. 调用统一计算逻辑（传递验证控制参数）
        return self._calculate_paipan_common(yao_list, calendar_info, validate=validate)
    
    # 集成农历信息的完整六爻排盘计算
    def calculate_paipan_with_lunar_calendar(self, yao_list: List[str], lunar_year: int, lunar_month: int, lunar_day: int, hour: int = 0, minute: int = 0, second: int = 0, is_leap_month: bool = False, validate: bool = True) -> Dict[str, Any]:
        # 1. 获取历法信息（使用缓存）
        calendar_info = self._get_calendar_info_with_cache(
            lunar_year=lunar_year, lunar_month=lunar_month, lunar_day=lunar_day,
            hour=hour, minute=minute, second=second, is_leap_month=is_leap_month
        )
        
        # 2. 调用统一计算逻辑（传递验证控制参数）
        return self._calculate_paipan_common(yao_list, calendar_info, validate=validate)
    


# 默认导出列表
__all__ = ['LiuYaoAlgorithmCore']  # 定义模块的公开导出列表

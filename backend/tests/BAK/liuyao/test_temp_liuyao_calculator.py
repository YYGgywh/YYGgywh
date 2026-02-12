# backend/tests/test_liuyao_calculator.py 2025-11-30
# 功能：六爻计算器测试文件

# 独立测试，无需外部依赖
# datetime模块已移除，使用lunar库替代
from lunar_python import Solar
import random
import sys
import os

# 添加backend/src目录到Python路径，以便导入calendar_calculator
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

# 开始


SIXTY_FOUR_GUA = {
    # 乾宫八卦（完整）
    "乾为天": {"code": "111111", "upper": "乾", "lower": "乾", "number": 1, "sequence": 1, "palace": "乾",
               "nature": "乾健", "attribute": "纯阳", "gua_ci": "元亨利贞",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["甲", "甲", "甲", "壬", "壬", "壬"],
               "branches": ["子", "寅", "辰", "午", "申", "戌"],
               "liu_qin": ["子孙", "妻财", "父母", "官鬼", "兄弟", "父母"]},
    "天风姤": {"code": "011111", "upper": "乾", "lower": "巽", "number": 44, "sequence": 2, "palace": "乾",
               "nature": "天下有风", "attribute": "消息卦", "gua_ci": "女壮，勿用取女",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["辛", "辛", "辛", "壬", "壬", "壬"],
               "branches": ["丑", "亥", "酉", "午", "申", "戌"],
               "liu_qin": ["父母", "子孙", "兄弟", "官鬼", "兄弟", "父母"]},
    "天山遁": {"code": "001111", "upper": "乾", "lower": "艮", "number": 33, "sequence": 3, "palace": "乾",
               "nature": "天下有山", "attribute": "退避", "gua_ci": "亨，小利贞",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["丙", "丙", "丙", "壬", "壬", "壬"],
               "branches": ["辰", "午", "申", "午", "申", "戌"],
               "liu_qin": ["父母", "官鬼", "兄弟", "官鬼", "兄弟", "父母"]},
    "天地否": {"code": "000111", "upper": "乾", "lower": "坤", "number": 12, "sequence": 4, "palace": "乾",
               "nature": "天地不交", "attribute": "闭塞", "gua_ci": "否之匪人，不利君子贞",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["乙", "乙", "乙", "壬", "壬", "壬"],
               "branches": ["未", "巳", "卯", "午", "申", "戌"],
               "liu_qin": ["父母", "官鬼", "妻财", "官鬼", "兄弟", "父母"]},
    "风地观": {"code": "000011", "upper": "巽", "lower": "坤", "number": 20, "sequence": 5, "palace": "乾",
               "nature": "风行地上", "attribute": "观察", "gua_ci": "盥而不荐，有孚颙若",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["乙", "乙", "乙", "辛", "辛", "辛"],
               "branches": ["未", "巳", "卯", "未", "巳", "卯"],
               "liu_qin": ["父母", "官鬼", "妻财", "父母", "官鬼", "妻财"]},
    "山地剥": {"code": "000001", "upper": "艮", "lower": "坤", "number": 23, "sequence": 6, "palace": "乾",
               "nature": "山附于地", "attribute": "剥落", "gua_ci": "不利有攸往",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["乙", "乙", "乙", "丙", "丙", "丙"],
               "branches": ["未", "巳", "卯", "戌", "子", "寅"],
               "liu_qin": ["父母", "官鬼", "妻财", "父母", "子孙", "妻财"]},
    "火地晋": {"code": "000101", "upper": "离", "lower": "坤", "number": 35, "sequence": 7, "palace": "乾",
               "nature": "明出地上", "attribute": "前进", "gua_ci": "康侯用锡马蕃庶，昼日三接",
               "shi_yao": 4, "shi_type": "游魂",
               "stems": ["乙", "乙", "乙", "己", "己", "己"],
               "branches": ["未", "巳", "卯", "酉", "未", "巳"],
               "liu_qin": ["父母", "官鬼", "妻财", "兄弟", "父母", "官鬼"]},
    "火天大有": {"code": "111101", "upper": "离", "lower": "乾", "number": 14, "sequence": 8, "palace": "乾",
                 "nature": "火在天上", "attribute": "丰盛", "gua_ci": "元亨",
                 "shi_yao": 3, "shi_type": "归魂",
                 "stems": ["甲", "甲", "甲", "己", "己", "己"],
                 "branches": ["子", "寅", "辰", "酉", "未", "巳"],
                 "liu_qin": ["子孙", "妻财", "父母", "兄弟", "父母", "官鬼"]},

    # 兑宫八卦（完整）
    "兑为泽": {"code": "110110", "upper": "兑", "lower": "兑", "number": 58, "sequence": 9, "palace": "兑",
               "nature": "丽泽", "attribute": "悦乐", "gua_ci": "亨，利贞",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["丁", "丁", "丁", "丁", "丁", "丁"],
               "branches": ["巳", "卯", "丑", "亥", "酉", "未"],
               "liu_qin": ["官鬼", "妻财", "父母", "子孙", "兄弟", "父母"]},
    "泽水困": {"code": "010110", "upper": "兑", "lower": "坎", "number": 47, "sequence": 10, "palace": "兑",
               "nature": "泽无水", "attribute": "困顿", "gua_ci": "亨，贞，大人吉，无咎",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["戊", "戊", "戊", "丁", "丁", "丁"],
               "branches": ["寅", "辰", "午", "亥", "酉", "未"],
               "liu_qin": ["妻财", "父母", "官鬼", "子孙", "兄弟", "父母"]},
    "泽地萃": {"code": "000110", "upper": "兑", "lower": "坤", "number": 45, "sequence": 11, "palace": "兑",
               "nature": "泽于地", "attribute": "聚集", "gua_ci": "亨，王假有庙",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["乙", "乙", "乙", "丁", "丁", "丁"],
               "branches": ["未", "巳", "卯", "亥", "酉", "未"],
               "liu_qin": ["父母", "官鬼", "妻财", "子孙", "兄弟", "父母"]},
    "泽山咸": {"code": "001110", "upper": "兑", "lower": "艮", "number": 31, "sequence": 12, "palace": "兑",
               "nature": "山泽通气", "attribute": "感应", "gua_ci": "亨，利贞，取女吉",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["丙", "丙", "丙", "丁", "丁", "丁"],
               "branches": ["辰", "午", "申", "亥", "酉", "未"],
               "liu_qin": ["父母", "官鬼", "兄弟", "子孙", "兄弟", "父母"]},
    "水山蹇": {"code": "001010", "upper": "坎", "lower": "艮", "number": 39, "sequence": 13, "palace": "兑",
               "nature": "山上有水", "attribute": "艰难", "gua_ci": "利西南，不利东北",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["丙", "丙", "丙", "戊", "戊", "戊"],
               "branches": ["辰", "午", "申", "申", "戌", "子"],
               "liu_qin": ["父母", "官鬼", "兄弟", "兄弟", "父母", "子孙"]},
    "地山谦": {"code": "001000", "upper": "坤", "lower": "艮", "number": 15, "sequence": 14, "palace": "兑",
               "nature": "地中有山", "attribute": "谦虚", "gua_ci": "亨，君子有终",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["丙", "丙", "丙", "癸", "癸", "癸"],
               "branches": ["辰", "午", "申", "丑", "亥", "酉"],
               "liu_qin": ["父母", "官鬼", "兄弟", "父母", "子孙", "兄弟"]},
    "雷山小过": {"code": "001100", "upper": "震", "lower": "艮", "number": 62, "sequence": 15, "palace": "兑",
                 "nature": "山上有雷", "attribute": "小有过失", "gua_ci": "亨，利贞",
                 "shi_yao": 4, "shi_type": "游魂",
                 "stems": ["丙", "丙", "丙", "庚", "庚", "庚"],
                 "branches": ["辰", "午", "申", "午", "申", "戌"],
                 "liu_qin": ["父母", "官鬼", "兄弟", "官鬼", "兄弟", "父母"]},
    "雷泽归妹": {"code": "110100", "upper": "震", "lower": "兑", "number": 54, "sequence": 16, "palace": "兑",
                 "nature": "泽上有雷", "attribute": "婚嫁", "gua_ci": "征凶，无攸利",
                 "shi_yao": 3, "shi_type": "归魂",
                 "stems": ["丁", "丁", "丁", "庚", "庚", "庚"],
                 "branches": ["巳", "卯", "丑", "午", "申", "戌"],
                 "liu_qin": ["官鬼", "妻财", "父母", "官鬼", "兄弟", "父母"]},

    # 离宫八卦（完整）
    "离为火": {"code": "101101", "upper": "离", "lower": "离", "number": 30, "sequence": 17, "palace": "离",
               "nature": "明两作", "attribute": "附丽", "gua_ci": "利贞，亨",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["己", "己", "己", "己", "己", "己"],
               "branches": ["卯", "丑", "亥", "酉", "未", "巳"],
               "liu_qin": ["父母", "妻财", "官鬼", "妻财", "子孙", "兄弟"]},
    "火山旅": {"code": "001101", "upper": "离", "lower": "艮", "number": 56, "sequence": 18, "palace": "离",
               "nature": "山上有火", "attribute": "旅行", "gua_ci": "小亨，旅贞吉",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["丙", "丙", "丙", "己", "己", "己"],
               "branches": ["辰", "午", "申", "酉", "未", "巳"],
               "liu_qin": ["子孙", "兄弟", "妻财", "妻财", "子孙", "兄弟"]},
    "火风鼎": {"code": "011101", "upper": "离", "lower": "巽", "number": 50, "sequence": 19, "palace": "离",
               "nature": "木上有火", "attribute": "鼎新", "gua_ci": "元吉，亨",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["辛", "辛", "辛", "己", "己", "己"],
               "branches": ["丑", "亥", "酉", "酉", "未", "巳"],
               "liu_qin": ["子水", "官鬼", "妻财", "妻财", "子孙", "兄弟"]},
    "火水未济": {"code": "010101", "upper": "离", "lower": "坎", "number": 64, "sequence": 20, "palace": "离",
                 "nature": "火在水上", "attribute": "未完成", "gua_ci": "亨，小狐汔济",
                 "shi_yao": 3, "shi_type": "三世",
                 "stems": ["戊", "戊", "戊", "己", "己", "己"],
                 "branches": ["寅", "辰", "午", "酉", "未", "巳"],
                 "liu_qin": ["父母", "子孙", "兄弟", "妻财", "子孙", "兄弟"]},
    "山水蒙": {"code": "010001", "upper": "艮", "lower": "坎", "number": 4, "sequence": 21, "palace": "离",
               "nature": "山下出泉", "attribute": "蒙昧", "gua_ci": "亨。匪我求童蒙，童蒙求我",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["戊", "戊", "戊", "丙", "丙", "丙"],
               "branches": ["寅", "辰", "午", "戌", "子", "寅"],
               "liu_qin": ["父母", "子孙", "兄弟", "子孙", "官鬼", "父母"]},
    "风水涣": {"code": "010011", "upper": "巽", "lower": "坎", "number": 59, "sequence": 22, "palace": "离",
               "nature": "风行水上", "attribute": "涣散", "gua_ci": "亨。王假有庙",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["戊", "戊", "戊", "辛", "辛", "辛"],
               "branches": ["寅", "辰", "午", "未", "巳", "卯"],
               "liu_qin": ["父母", "子孙", "兄弟", "子孙", "兄弟", "父母"]},
    "天水讼": {"code": "010111", "upper": "乾", "lower": "坎", "number": 6, "sequence": 23, "palace": "离",
               "nature": "天与水违行", "attribute": "争讼", "gua_ci": "有孚，窒惕，中吉",
               "shi_yao": 4, "shi_type": "游魂",
               "stems": ["戊", "戊", "戊", "壬", "壬", "壬"],
               "branches": ["寅", "辰", "午", "午", "申", "戌"],
               "liu_qin": ["父母", "子孙", "兄弟", "兄弟", "妻财", "子孙"]},
    "天火同人": {"code": "101111", "upper": "乾", "lower": "离", "number": 13, "sequence": 24, "palace": "离",
                 "nature": "天与火", "attribute": "同心", "gua_ci": "同人于野，亨",
                 "shi_yao": 3, "shi_type": "归魂",
                 "stems": ["己", "己", "己", "壬", "壬", "壬"],
                 "branches": ["卯", "丑", "亥", "午", "申", "戌"],
                 "liu_qin": ["父母", "子孙", "官鬼", "兄弟", "妻财", "子孙"]},

    # 震宫八卦（完整）
    "震为雷": {"code": "100100", "upper": "震", "lower": "震", "number": 51, "sequence": 25, "palace": "震",
               "nature": "洊雷", "attribute": "震动", "gua_ci": "亨，震来虩虩，笑言哑哑",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["庚", "庚", "庚", "庚", "庚", "庚"],
               "branches": ["子", "寅", "辰", "午", "申", "戌"],
               "liu_qin": ["父母", "兄弟", "妻财", "子孙", "官鬼", "妻财"]},
    "雷地豫": {"code": "000100", "upper": "震", "lower": "坤", "number": 16, "sequence": 26, "palace": "震",
               "nature": "雷出地奋", "attribute": "愉悦", "gua_ci": "利建侯行师",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["乙", "乙", "乙", "庚", "庚", "庚"],
               "branches": ["未", "巳", "卯", "午", "申", "戌"],
               "liu_qin": ["妻财", "子孙", "兄弟", "子孙", "官鬼", "妻财"]},
    "雷水解": {"code": "010100", "upper": "震", "lower": "坎", "number": 40, "sequence": 27, "palace": "震",
               "nature": "雷雨作", "attribute": "解除", "gua_ci": "利西南",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["戊", "戊", "戊", "庚", "庚", "庚"],
               "branches": ["寅", "辰", "午", "午", "申", "戌"],
               "liu_qin": ["兄弟", "妻财", "子孙", "子孙", "官鬼", "妻财"]},
    "雷风恒": {"code": "011100", "upper": "震", "lower": "巽", "number": 32, "sequence": 28, "palace": "震",
               "nature": "雷风相与", "attribute": "恒久", "gua_ci": "亨，无咎，利贞",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["辛", "辛", "辛", "庚", "庚", "庚"],
               "branches": ["丑", "亥", "酉", "午", "申", "戌"],
               "liu_qin": ["妻财", "父母", "官鬼", "子孙", "官鬼", "妻财"]},
    "地风升": {"code": "011000", "upper": "坤", "lower": "巽", "number": 46, "sequence": 29, "palace": "震",
               "nature": "地中生木", "attribute": "上升", "gua_ci": "元亨，用见大人",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["辛", "辛", "辛", "癸", "癸", "癸"],
               "branches": ["丑", "亥", "酉", "丑", "亥", "酉"],
               "liu_qin": ["妻财", "父母", "官鬼", "妻财", "父母", "官鬼"]},
    "水风井": {"code": "011010", "upper": "坎", "lower": "巽", "number": 48, "sequence": 30, "palace": "震",
               "nature": "木上有水", "attribute": "水井", "gua_ci": "改邑不改井",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["辛", "辛", "辛", "戊", "戊", "戊"],
               "branches": ["丑", "亥", "酉", "申", "戌", "子"],
               "liu_qin": ["妻财", "父母", "官鬼", "官鬼", "妻财", "父母"]},
    "泽风大过": {"code": "011110", "upper": "兑", "lower": "巽", "number": 28, "sequence": 31, "palace": "震",
                 "nature": "泽灭木", "attribute": "过度", "gua_ci": "栋桡，利有攸往",
                 "shi_yao": 4, "shi_type": "游魂",
                 "stems": ["辛", "辛", "辛", "丁", "丁", "丁"],
                 "branches": ["丑", "亥", "酉", "亥", "酉", "未"],
                 "liu_qin": ["妻财", "父母", "官鬼", "父母", "官鬼", "妻财"]},
    "泽雷随": {"code": "100110", "upper": "兑", "lower": "震", "number": 17, "sequence": 32, "palace": "震",
               "nature": "泽中有雷", "attribute": "随从", "gua_ci": "元亨利贞，无咎",
               "shi_yao": 3, "shi_type": "归魂",
               "stems": ["庚", "庚", "庚", "丁", "丁", "丁"],
               "branches": ["子", "寅", "辰", "亥", "酉", "未"],
               "liu_qin": ["父母", "兄弟", "妻财", "父母", "官鬼", "妻财"]},

    # 巽宫八卦（完整）
    "巽为风": {"code": "011011", "upper": "巽", "lower": "巽", "number": 57, "sequence": 33, "palace": "巽",
               "nature": "随风", "attribute": "顺从", "gua_ci": "小亨，利有攸往，利见大人",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["辛", "辛", "辛", "辛", "辛", "辛"],
               "branches": ["丑", "亥", "酉", "未", "巳", "卯"],
               "liu_qin": ["妻财", "父母", "官鬼", "妻财", "子孙", "兄弟"]},
    "风天小畜": {"code": "111011", "upper": "巽", "lower": "乾", "number": 9, "sequence": 34, "palace": "巽",
                 "nature": "风行天上", "attribute": "小积", "gua_ci": "亨。密云不雨",
                 "shi_yao": 1, "shi_type": "一世",
                 "stems": ["甲", "甲", "甲", "辛", "辛", "辛"],
                 "branches": ["子", "寅", "辰", "未", "巳", "卯"],
                 "liu_qin": ["父母", "兄弟", "妻财", "妻财", "子孙", "兄弟"]},
    "风火家人": {"code": "101011", "upper": "巽", "lower": "离", "number": 37, "sequence": 35, "palace": "巽",
                 "nature": "风自火出", "attribute": "家庭", "gua_ci": "利女贞",
                 "shi_yao": 2, "shi_type": "二世",
                 "stems": ["己", "己", "己", "辛", "辛", "辛"],
                 "branches": ["卯", "丑", "亥", "未", "巳", "卯"],
                 "liu_qin": ["兄弟", "妻财", "父母", "妻财", "子孙", "兄弟"]},
    "风雷益": {"code": "100011", "upper": "巽", "lower": "震", "number": 42, "sequence": 36, "palace": "巽",
               "nature": "风雷相益", "attribute": "增益", "gua_ci": "利有攸往，利涉大川",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["庚", "庚", "庚", "辛", "辛", "辛"],
               "branches": ["子", "寅", "辰", "未", "巳", "卯"],
               "liu_qin": ["父母", "兄弟", "妻财", "妻财", "子孙", "兄弟"]},
    "天雷无妄": {"code": "100111", "upper": "乾", "lower": "震", "number": 25, "sequence": 37, "palace": "巽",
                 "nature": "天下雷行", "attribute": "无妄", "gua_ci": "元亨利贞",
                 "shi_yao": 4, "shi_type": "四世",
                 "stems": ["庚", "庚", "庚", "壬", "壬", "壬"],
                 "branches": ["子", "寅", "辰", "午", "申", "戌"],
                 "liu_qin": ["父母", "兄弟", "妻财", "子孙", "官鬼", "妻财"]},
    "火雷噬嗑": {"code": "100101", "upper": "离", "lower": "震", "number": 21, "sequence": 38, "palace": "巽",
                 "nature": "电雷", "attribute": "咬合", "gua_ci": "亨，利用狱",
                 "shi_yao": 5, "shi_type": "五世",
                 "stems": ["庚", "庚", "庚", "己", "己", "己"],
                 "branches": ["子", "寅", "辰", "酉", "未", "巳"],
                 "liu_qin": ["父母", "兄弟", "妻财", "官鬼", "妻财", "子孙"]},
    "山雷颐": {"code": "100001", "upper": "艮", "lower": "震", "number": 27, "sequence": 39, "palace": "巽",
               "nature": "山下有雷", "attribute": "颐养", "gua_ci": "贞吉",
               "shi_yao": 4, "shi_type": "游魂",
               "stems": ["庚", "庚", "庚", "丙", "丙", "丙"],
               "branches": ["子", "寅", "辰", "戌", "子", "寅"],
               "liu_qin": ["父母", "兄弟", "妻财", "妻财", "父母", "兄弟"]},
    "山风蛊": {"code": "011001", "upper": "艮", "lower": "巽", "number": 18, "sequence": 40, "palace": "巽",
               "nature": "山下有风", "attribute": "蛊惑", "gua_ci": "元亨，利涉大川",
               "shi_yao": 3, "shi_type": "归魂",
               "stems": ["辛", "辛", "辛", "丙", "丙", "丙"],
               "branches": ["丑", "亥", "酉", "戌", "子", "寅"],
               "liu_qin": ["妻财", "父母", "官鬼", "妻财", "父母", "兄弟"]},

    # 坎宫八卦（完整）
    "坎为水": {"code": "010010", "upper": "坎", "lower": "坎", "number": 29, "sequence": 41, "palace": "坎",
               "nature": "水洊至", "attribute": "险陷", "gua_ci": "习坎，有孚维心，亨",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["戊", "戊", "戊", "戊", "戊", "戊"],
               "branches": ["寅", "辰", "午", "申", "戌", "子"],
               "liu_qin": ["子孙", "官鬼", "妻财", "父母", "官鬼", "兄弟"]},
    "水泽节": {"code": "110010", "upper": "坎", "lower": "兑", "number": 60, "sequence": 42, "palace": "坎",
               "nature": "泽上有水", "attribute": "节制", "gua_ci": "亨。苦节不可贞",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["丁", "丁", "丁", "戊", "戊", "戊"],
               "branches": ["巳", "卯", "丑", "申", "戌", "子"],
               "liu_qin": ["妻财", "子孙", "官鬼", "父母", "官鬼", "兄弟"]},
    "水雷屯": {"code": "100010", "upper": "坎", "lower": "震", "number": 3, "sequence": 43, "palace": "坎",
               "nature": "云雷屯", "attribute": "初生", "gua_ci": "元亨利贞",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["庚", "庚", "庚", "戊", "戊", "戊"],
               "branches": ["子", "寅", "辰", "申", "戌", "子"],
               "liu_qin": ["兄弟", "子孙", "官鬼", "父母", "官鬼", "兄弟"]},
    "水火既济": {"code": "101010", "upper": "坎", "lower": "离", "number": 63, "sequence": 44, "palace": "坎",
                 "nature": "水在火上", "attribute": "完成", "gua_ci": "亨小，利贞",
                 "shi_yao": 3, "shi_type": "三世",
                 "stems": ["己", "己", "己", "戊", "戊", "戊"],
                 "branches": ["卯", "丑", "亥", "申", "戌", "子"],
                 "liu_qin": ["子孙", "官鬼", "兄弟", "父母", "官鬼", "兄弟"]},
    "泽火革": {"code": "101110", "upper": "兑", "lower": "离", "number": 49, "sequence": 45, "palace": "坎",
               "nature": "泽中有火", "attribute": "变革", "gua_ci": "己日乃孚，元亨利贞",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["己", "己", "己", "丁", "丁", "丁"],
               "branches": ["卯", "丑", "亥", "亥", "酉", "未"],
               "liu_qin": ["子孙", "官鬼", "兄弟", "兄弟", "父母", "官鬼"]},
    "雷火丰": {"code": "101100", "upper": "震", "lower": "离", "number": 55, "sequence": 46, "palace": "坎",
               "nature": "雷电皆至", "attribute": "丰盛", "gua_ci": "亨，王假之",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["己", "己", "己", "庚", "庚", "庚"],
               "branches": ["卯", "丑", "亥", "午", "申", "戌"],
               "liu_qin": ["子孙", "官鬼", "兄弟", "妻财", "父母", "官鬼"]},
    "地火明夷": {"code": "101000", "upper": "坤", "lower": "离", "number": 36, "sequence": 47, "palace": "坎",
                 "nature": "明入地中", "attribute": "光明受伤", "gua_ci": "利艰贞",
                 "shi_yao": 4, "shi_type": "游魂",
                 "stems": ["己", "己", "己", "癸", "癸", "癸"],
                 "branches": ["卯", "丑", "亥", "丑", "亥", "酉"],
                 "liu_qin": ["子孙", "官鬼", "兄弟", "官鬼", "兄弟", "父母"]},
    "地水师": {"code": "010000", "upper": "坤", "lower": "坎", "number": 7, "sequence": 48, "palace": "坎",
               "nature": "地中有水", "attribute": "师旅", "gua_ci": "贞，丈人吉",
               "shi_yao": 3, "shi_type": "归魂",
               "stems": ["戊", "戊", "戊", "癸", "癸", "癸"],
               "branches": ["寅", "辰", "午", "丑", "亥", "酉"],
               "liu_qin": ["子孙", "官鬼", "妻财", "官鬼", "兄弟", "父母"]},

    # 艮宫八卦（完整）
    "艮为山": {"code": "001001", "upper": "艮", "lower": "艮", "number": 52, "sequence": 49, "palace": "艮",
               "nature": "兼山", "attribute": "静止", "gua_ci": "艮其背，不获其身",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["丙", "丙", "丙", "丙", "丙", "丙"],
               "branches": ["辰", "午", "申", "戌", "子", "寅"],
               "liu_qin": ["兄弟", "父母", "子孙", "兄弟", "妻财", "官鬼"]},
    "山火贲": {"code": "101001", "upper": "艮", "lower": "离", "number": 22, "sequence": 50, "palace": "艮",
               "nature": "山下有火", "attribute": "装饰", "gua_ci": "亨。小利有攸往",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["己", "己", "己", "丙", "丙", "丙"],
               "branches": ["卯", "丑", "亥", "戌", "子", "寅"],
               "liu_qin": ["官鬼", "兄弟", "妻财", "兄弟", "妻财", "官鬼"]},
    "山天大畜": {"code": "111001", "upper": "艮", "lower": "乾", "number": 26, "sequence": 51, "palace": "艮",
                 "nature": "天在山中", "attribute": "大积蓄", "gua_ci": "利贞",
                 "shi_yao": 2, "shi_type": "二世",
                 "stems": ["甲", "甲", "甲", "丙", "丙", "丙"],
                 "branches": ["子", "寅", "辰", "戌", "子", "寅"],
                 "liu_qin": ["妻财", "官鬼", "兄弟", "兄弟", "妻财", "官鬼"]},
    "山泽损": {"code": "110001", "upper": "艮", "lower": "兑", "number": 41, "sequence": 52, "palace": "艮",
               "nature": "山下有泽", "attribute": "减损", "gua_ci": "有孚，元吉",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["丁", "丁", "丁", "丙", "丙", "丙"],
               "branches": ["巳", "卯", "丑", "戌", "子", "寅"],
               "liu_qin": ["父母", "官鬼", "兄弟", "兄弟", "妻财", "官鬼"]},
    "火泽睽": {"code": "110101", "upper": "离", "lower": "兑", "number": 38, "sequence": 53, "palace": "艮",
               "nature": "上火下泽", "attribute": "乖离", "gua_ci": "小事吉",
               "shi_yao": 4, "shi_type": "四世",
               "stems": ["丁", "丁", "丁", "己", "己", "己"],
               "branches": ["巳", "卯", "丑", "酉", "未", "巳"],
               "liu_qin": ["父母", "官鬼", "兄弟", "子水", "兄弟", "父母"]},
    "天泽履": {"code": "110111", "upper": "乾", "lower": "兑", "number": 10, "sequence": 54, "palace": "艮",
               "nature": "上天下泽", "attribute": "履行", "gua_ci": "履虎尾，不咥人",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["丁", "丁", "丁", "壬", "壬", "壬"],
               "branches": ["巳", "卯", "丑", "午", "申", "戌"],
               "liu_qin": ["父母", "官鬼", "兄弟", "父母", "子孙", "兄弟"]},
    "风泽中孚": {"code": "110011", "upper": "巽", "lower": "兑", "number": 61, "sequence": 55, "palace": "艮",
                 "nature": "泽上有风", "attribute": "诚信", "gua_ci": "豚鱼吉",
                 "shi_yao": 4, "shi_type": "游魂",
                 "stems": ["丁", "丁", "丁", "辛", "辛", "辛"],
                 "branches": ["巳", "卯", "丑", "未", "巳", "卯"],
                 "liu_qin": ["父母", "官鬼", "兄弟", "兄弟", "父母", "官鬼"]},
    "风山渐": {"code": "001011", "upper": "巽", "lower": "艮", "number": 53, "sequence": 56, "palace": "艮",
               "nature": "山上有木", "attribute": "渐进", "gua_ci": "女归吉，利贞",
               "shi_yao": 3, "shi_type": "归魂",
               "stems": ["丙", "丙", "丙", "辛", "辛", "辛"],
               "branches": ["辰", "午", "申", "未", "巳", "卯"],
               "liu_qin": ["兄弟", "父母", "子孙", "兄弟", "父母", "官鬼"]},

    # 坤宫八卦（完整）
    "坤为地": {"code": "000000", "upper": "坤", "lower": "坤", "number": 2, "sequence": 57, "palace": "坤",
               "nature": "地势坤", "attribute": "柔顺", "gua_ci": "元亨，利牝马之贞",
               "shi_yao": 6, "shi_type": "本宫",
               "stems": ["乙", "乙", "乙", "癸", "癸", "癸"],
               "branches": ["未", "巳", "卯", "丑", "亥", "酉"],
               "liu_qin": ["兄弟", "父母", "官鬼", "兄弟", "妻财", "子孙"]},
    "地雷复": {"code": "100000", "upper": "坤", "lower": "震", "number": 24, "sequence": 58, "palace": "坤",
               "nature": "雷在地中", "attribute": "回复", "gua_ci": "亨。出入无疾",
               "shi_yao": 1, "shi_type": "一世",
               "stems": ["庚", "庚", "庚", "癸", "癸", "癸"],
               "branches": ["子", "寅", "辰", "丑", "亥", "酉"],
               "liu_qin": ["妻财", "官鬼", "兄弟", "兄弟", "妻财", "子孙"]},
    "地泽临": {"code": "110000", "upper": "坤", "lower": "兑", "number": 19, "sequence": 59, "palace": "坤",
               "nature": "泽上有地", "attribute": "临察", "gua_ci": "元亨利贞",
               "shi_yao": 2, "shi_type": "二世",
               "stems": ["丁", "丁", "丁", "癸", "癸", "癸"],
               "branches": ["巳", "卯", "丑", "丑", "亥", "酉"],
               "liu_qin": ["父母", "官鬼", "兄弟", "兄弟", "妻财", "子孙"]},
    "地天泰": {"code": "111000", "upper": "坤", "lower": "乾", "number": 11, "sequence": 60, "palace": "坤",
               "nature": "天地交", "attribute": "通达", "gua_ci": "小往大来，吉亨",
               "shi_yao": 3, "shi_type": "三世",
               "stems": ["甲", "甲", "甲", "癸", "癸", "癸"],
               "branches": ["子", "寅", "辰", "丑", "亥", "酉"],
               "liu_qin": ["妻财", "官鬼", "兄弟", "兄弟", "妻财", "子孙"]},
    "雷天大壮": {"code": "111100", "upper": "震", "lower": "乾", "number": 34, "sequence": 61, "palace": "坤",
                 "nature": "雷在天上", "attribute": "强壮", "gua_ci": "利贞",
                 "shi_yao": 4, "shi_type": "四世",
                 "stems": ["甲", "甲", "甲", "庚", "庚", "庚"],
                 "branches": ["子", "寅", "辰", "午", "申", "戌"],
                 "liu_qin": ["妻财", "官鬼", "兄弟", "父母", "子孙", "兄弟"]},
    "泽天夬": {"code": "111110", "upper": "兑", "lower": "乾", "number": 43, "sequence": 62, "palace": "坤",
               "nature": "泽上于天", "attribute": "决断", "gua_ci": "扬于王庭",
               "shi_yao": 5, "shi_type": "五世",
               "stems": ["甲", "甲", "甲", "丁", "丁", "丁"],
               "branches": ["子", "寅", "辰", "亥", "酉", "未"],
               "liu_qin": ["妻财", "官鬼", "兄弟", "妻财", "子孙", "兄弟"]},
    "水天需": {"code": "111010", "upper": "坎", "lower": "乾", "number": 5, "sequence": 63, "palace": "坤",
               "nature": "云上于天", "attribute": "等待", "gua_ci": "有孚，光亨",
               "shi_yao": 4, "shi_type": "游魂",
               "stems": ["甲", "甲", "甲", "戊", "戊", "戊"],
               "branches": ["子", "寅", "辰", "申", "戌", "子"],
               "liu_qin": ["妻财", "官鬼", "兄弟", "子孙", "兄弟", "妻财"]},
    "水地比": {"code": "000010", "upper": "坎", "lower": "坤", "number": 8, "sequence": 64, "palace": "坤",
               "nature": "地上有水", "attribute": "亲比", "gua_ci": "吉。原筮元永贞",
               "shi_yao": 3, "shi_type": "归魂",
               "stems": ["乙", "乙", "乙", "戊", "戊", "戊"],
               "branches": ["未", "巳", "卯", "申", "戌", "子"],
               "liu_qin": ["兄弟", "父母", "官鬼", "子孙", "兄弟", "妻财"]}
}

# 六十四卦卦序列表（按传统卦序）
SixtyFourGua = [
    "乾为天", "坤为地", "水雷屯", "山水蒙", "水天需", "天水讼", "地水师", "水地比",
    "风天小畜", "天泽履", "地天泰", "天地否", "天火同人", "火天大有", "地山谦", "雷地豫",
    "泽雷随", "山风蛊", "地泽临", "风地观", "火雷噬嗑", "山火贲", "山地剥", "地雷复",
    "天雷无妄", "山天大畜", "山雷颐", "泽风大过", "坎为水", "离为火", "泽山咸", "雷风恒",
    "天山遁", "雷天大壮", "火地晋", "地火明夷", "风火家人", "火泽睽", "水山蹇", "雷水解",
    "山泽损", "风雷益", "泽天夬", "天风姤", "泽地萃", "地风升", "泽水困", "水风井",
    "泽火革", "火风鼎", "震为雷", "艮为山", "风山渐", "雷泽归妹", "雷火丰", "火山旅",
    "巽为风", "兑为泽", "风水涣", "水泽节", "风泽中孚", "雷山小过", "水火既济", "火水未济"
]

# 八卦宫位归属及六亲地支映射
GUA_PALACES = {
    "乾": {
        "guas": ["乾为天", "天风姤", "天山遁", "天地否", "风地观", "山地剥", "火地晋", "火天大有"],
        "兄弟": ["申", "酉"],
        "父母": ["丑", "辰", "未", "戌"],
        "子孙": ["亥", "子"],
        "官鬼": ["巳", "午"],
        "妻财": ["寅", "卯"]
    },
    "兑": {
        "guas": ["兑为泽", "泽水困", "泽地萃", "泽山咸", "水山蹇", "地山谦", "雷山小过", "雷泽归妹"],
        "兄弟": ["申", "酉"],
        "父母": ["丑", "辰", "未", "戌"],
        "子孙": ["亥", "子"],
        "官鬼": ["巳", "午"],
        "妻财": ["寅", "卯"]
    },
    "离": {
        "guas": ["离为火", "火山旅", "火风鼎", "火水未济", "山水蒙", "风水涣", "天水讼", "天火同人"],
        "兄弟": ["巳", "午"],
        "父母": ["卯", "寅"],
        "子孙": ["丑", "辰", "未", "戌"],
        "官鬼": ["亥", "子"],
        "妻财": ["酉", "申"]
    },
    "震": {
        "guas": ["震为雷", "雷地豫", "雷水解", "雷风恒", "地风升", "水风井", "泽风大过", "泽雷随"],
        "兄弟": ["寅", "卯"],
        "父母": ["子", "亥"],
        "子孙": ["午", "巳"],
        "官鬼": ["申", "酉"],
        "妻财": ["辰", "戌", "丑", "未"]
    },
    "巽": {
        "guas": ["巽为风", "风天小畜", "风火家人", "风雷益", "天雷无妄", "火雷噬嗑", "山雷颐", "山风蛊"],
        "兄弟": ["寅", "卯"],
        "父母": ["子", "亥"],
        "子孙": ["午", "巳"],
        "官鬼": ["申", "酉"],
        "妻财": ["辰", "戌", "丑", "未"]
    },
    "坎": {
        "guas": ["坎为水", "水泽节", "水雷屯", "水火既济", "泽火革", "雷火丰", "地火明夷", "地水师"],
        "兄弟": ["子", "亥"],
        "父母": ["申", "酉"],
        "子孙": ["寅", "卯"],
        "官鬼": ["辰", "戌", "丑", "未"],
        "妻财": ["午", "巳"]
    },
    "艮": {
        "guas": ["艮为山", "山火贲", "山天大畜", "山泽损", "火泽睽", "天泽履", "风泽中孚", "风山渐"],
        "兄弟": ["辰", "戌", "丑", "未"],
        "父母": ["午", "巳"],
        "子孙": ["申", "酉"],
        "官鬼": ["寅", "卯"],
        "妻财": ["子", "亥"]
    },
    "坤": {
        "guas": ["坤为地", "地雷复", "地泽临", "地天泰", "雷天大壮", "泽天夬", "水天需", "水地比"],
        "兄弟": ["辰", "戌", "丑", "未"],
        "父母": ["午", "巳"],
        "子孙": ["申", "酉"],
        "官鬼": ["寅", "卯"],
        "妻财": ["子", "亥"]
    }
}

# 六十四卦五行属性
GUA_WUXING = {
    "乾为天": "金", "兑为泽": "金", "离为火": "火", "震为雷": "木",
    "巽为风": "木", "坎为水": "水", "艮为山": "土", "坤为地": "土"
}

# ==================== 六神定义 ====================
LIU_SHEN_NAMES = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"]

# ==================== 天干与六神对应表（修正版） ====================
TIAN_GAN_TO_LIU_SHEN = {
    "甲": ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"],
    "乙": ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"],
    "丙": ["朱雀", "勾陈", "螣蛇", "白虎", "玄武", "青龙"],
    "丁": ["朱雀", "勾陈", "螣蛇", "白虎", "玄武", "青龙"],
    "戊": ["勾陈", "螣蛇", "白虎", "玄武", "青龙", "朱雀"],
    "己": ["螣蛇", "白虎", "玄武", "青龙", "朱雀", "勾陈"],
    "庚": ["白虎", "玄武", "青龙", "朱雀", "勾陈", "螣蛇"],
    "辛": ["白虎", "玄武", "青龙", "朱雀", "勾陈", "螣蛇"],
    "壬": ["玄武", "青龙", "朱雀", "勾陈", "螣蛇", "白虎"],
    "癸": ["玄武", "青龙", "朱雀", "勾陈", "螣蛇", "白虎"]
}

# ==================== 六神五行属性 ====================
LIU_SHEN_WUXING = {
    "青龙": "木",
    "朱雀": "火",
    "勾陈": "土",
    "螣蛇": "土",
    "白虎": "金",
    "玄武": "水"
}

# ==================== 六神吉凶属性 ====================
LIU_SHEN_JIXIONG = {
    "青龙": "吉",
    "朱雀": "凶",
    "勾陈": "凶",
    "螣蛇": "凶",
    "白虎": "凶",
    "玄武": "凶"
}

# ==================== 六神方位 ====================
LIU_SHEN_FANGWEI = {
    "青龙": "东",
    "朱雀": "南",
    "勾陈": "中",
    "螣蛇": "中",
    "白虎": "西",
    "玄武": "北"
}


# ==================== 基于日天干的六神计算函数 ====================

def get_day_gan_from_calendar():
    """从calendar_calculator获取当前日期的日天干"""
    try:
        from algorithms.calendar_calculator import CalendarCalculator
        
        # 创建历法计算器实例
        calculator = CalendarCalculator()
        
        # 获取当前日期
        from datetime import datetime
        current_datetime = datetime.now()
        current_time = Solar.fromDate(current_datetime)
        year = current_time.getYear()
        month = current_time.getMonth()
        day = current_time.getDay()
        
        # 获取综合历法信息
        calendar_info = calculator.get_comprehensive_calendar_info(year, month, day)
        
        # 提取日干支
        ganzhi_info = calendar_info.get("ganzhi", {})
        day_ganzhi = ganzhi_info.get("day_ganzhi", "")
        
        # 提取日天干（干支的第一个字）
        if day_ganzhi and len(day_ganzhi) >= 1:
            day_gan = day_ganzhi[0]
            return day_gan
        else:
            print("警告：无法获取有效的日天干，使用默认天干'甲'")
            return "甲"
            
    except ImportError:
        print("警告：无法导入calendar_calculator模块，使用默认天干'甲'")
        return "甲"
    except Exception as e:
        print(f"警告：获取日天干时发生错误: {e}，使用默认天干'甲'")
        return "甲"

def calculate_liu_shen_by_day_gan(day_gan=None):
    """基于日天干计算六神排列
    
    六神排列规则（根据日天干确定起始六神）：
    - 甲乙日：青龙起初爻
    - 丙丁日：朱雀起初爻  
    - 戊日：勾陈起初爻
    - 己日：螣蛇起初爻
    - 庚辛日：白虎起初爻
    - 壬癸日：玄武起初爻
    
    然后按青龙→朱雀→勾陈→螣蛇→白虎→玄武的顺序循环排列
    """
    if day_gan is None:
        day_gan = get_day_gan_from_calendar()
    
    # 确定起始六神
    start_liu_shen = None
    if day_gan in ["甲", "乙"]:
        start_liu_shen = "青龙"
    elif day_gan in ["丙", "丁"]:
        start_liu_shen = "朱雀"
    elif day_gan == "戊":
        start_liu_shen = "勾陈"
    elif day_gan == "己":
        start_liu_shen = "螣蛇"
    elif day_gan in ["庚", "辛"]:
        start_liu_shen = "白虎"
    elif day_gan in ["壬", "癸"]:
        start_liu_shen = "玄武"
    else:
        print(f"警告：未知天干'{day_gan}'，使用默认起始六神'青龙'")
        start_liu_shen = "青龙"
    
    # 六神顺序
    liu_shen_order = ["青龙", "朱雀", "勾陈", "螣蛇", "白虎", "玄武"]
    
    # 找到起始六神在顺序中的位置
    start_index = liu_shen_order.index(start_liu_shen)
    
    # 生成六神排列（从初爻到上爻）
    liu_shen_arrangement = []
    for i in range(6):
        liu_shen_index = (start_index + i) % 6
        liu_shen_arrangement.append(liu_shen_order[liu_shen_index])
    
    return liu_shen_arrangement, day_gan

def get_liu_shen_details(liu_shen_list):
    """获取六神的详细信息（五行、吉凶、方位）"""
    details = []
    for liu_shen in liu_shen_list:
        wuxing = LIU_SHEN_WUXING.get(liu_shen, "未知")
        jixiong = LIU_SHEN_JIXIONG.get(liu_shen, "未知")
        fangwei = LIU_SHEN_FANGWEI.get(liu_shen, "未知")
        details.append({
            "name": liu_shen,
            "wuxing": wuxing,
            "jixiong": jixiong,
            "fangwei": fangwei
        })
    return details


# ==================== 辅助函数 ====================

testArr = [179, 210, 214, 700, 115, 250]  # 模拟前端传来的六个三位数组成的数组，用于测试结果是否准确
print("测试数组:", testArr)

def count_odd_digits_in_triplets(testArr): # 统计数组中每个三位数的奇数个数 返回一个列表，每个元素为对应三位数中奇数数字的个数
   
    result = []
    for num in testArr:
        
        if 0 <= num <= 999: # 判断数字是否在0到999之间（允许首位为0的三位数字）           
            hundreds = num // 100 # 取出百位数字           
            tens = (num // 10) % 10 # 取出十位数字           
            units = num % 10 # 取出个位数字           
            odd_count = 0 # 初始化奇数个数计数器           
            if hundreds % 2 == 1: # 判断百位是否为奇数               
                odd_count += 1 # 百位是奇数，计数器加1           
            if tens % 2 == 1: # 判断十位是否为奇数               
                odd_count += 1 # 十位是奇数，计数器加1           
            if units % 2 == 1: # 判断个位是否为奇数               
                odd_count += 1 # 个位是奇数，计数器加1           
            result.append(odd_count) # 将当前数字的奇数位数统计结果加入结果列表
        else:           
            result.append(-1) # 非三位数时标记为-1，便于后续排查
    return result

def calculate_ying_yao(shi_yao_position):
    """根据世爻位置计算应爻位置
    
    六爻排盘中，世爻与应爻的对应关系：
    - 世爻在初爻（1），应爻在四爻（4）
    - 世爻在二爻（2），应爻在五爻（5）
    - 世爻在三爻（3），应爻在上爻（6）
    - 世爻在四爻（4），应爻在初爻（1）
    - 世爻在五爻（5），应爻在二爻（2）
    - 世爻在上爻（6），应爻在三爻（3）
    """
    ying_yao_mapping = {
        1: 4,  # 世爻在初爻，应爻在四爻
        2: 5,  # 世爻在二爻，应爻在五爻
        3: 6,  # 世爻在三爻，应爻在上爻
        4: 1,  # 世爻在四爻，应爻在初爻
        5: 2,  # 世爻在五爻，应爻在二爻
        6: 3   # 世爻在上爻，应爻在三爻
    }
    
    if shi_yao_position in ying_yao_mapping:
        return ying_yao_mapping[shi_yao_position]
    else:
        raise ValueError(f"无效的世爻位置: {shi_yao_position}，应为1-6之间的整数")

def parse_ben_gua(result):
    """解析本卦信息"""
    # 本卦数组：每个元素 %2
    ben_gua_arr = [x % 2 for x in result]
    
    # 本卦六位数 → 本卦卦名
    ben_gua_code = ''.join(map(str, ben_gua_arr))
    
    for gua_name, gua_info in SIXTY_FOUR_GUA.items():
        if gua_info["code"] == ben_gua_code:
            return {
                "name": gua_name,
                "code": ben_gua_code,
                "info": SIXTY_FOUR_GUA[gua_name],
                "stems": SIXTY_FOUR_GUA[gua_name]["stems"],
                "branches": SIXTY_FOUR_GUA[gua_name]["branches"],
                "liu_qin": SIXTY_FOUR_GUA[gua_name]["liu_qin"],
                "shi_yao": SIXTY_FOUR_GUA[gua_name]["shi_yao"],
                "shi_type": SIXTY_FOUR_GUA[gua_name]["shi_type"],
                "palace": SIXTY_FOUR_GUA[gua_name]["palace"]
            }
    
    raise ValueError(f"未找到匹配的本卦卦名，卦码: {ben_gua_code}")

def parse_dong_yao(result):
    """解析动爻信息"""
    # 动爻：0→老阴，3→老阳
    return [i for i, v in enumerate(result) if v in (0, 3)]

def parse_bian_gua(result, ben_gua_info):
    """解析变卦信息"""
    # 变卦数组：0→1，3→0，其余 %2
    bian_gua_arr = []
    for v in result:
        if v == 0:
            bian_gua_arr.append(1)
        elif v == 3:
            bian_gua_arr.append(0)
        else:
            bian_gua_arr.append(v % 2)
    
    # 变卦六位数 → 变卦卦名
    bian_gua_code = ''.join(map(str, bian_gua_arr))
    
    for gua_name, gua_info in SIXTY_FOUR_GUA.items():
        if gua_info["code"] == bian_gua_code:
            return {
                "name": gua_name,
                "code": bian_gua_code,
                "info": SIXTY_FOUR_GUA[gua_name],
                "stems": SIXTY_FOUR_GUA[gua_name]["stems"],
                "branches": SIXTY_FOUR_GUA[gua_name]["branches"],
                "liu_qin": SIXTY_FOUR_GUA[gua_name]["liu_qin"],
                "shi_type": SIXTY_FOUR_GUA[gua_name]["shi_type"]
            }
    
    raise ValueError(f"未找到匹配的变卦卦名，卦码: {bian_gua_code}")

def get_palace_info(ben_gua_info):
    """获取宫卦信息"""
    ben_palace = ben_gua_info["palace"]
    palace_info = GUA_PALACES[ben_palace]
    
    # 宫卦地支对应的六亲关系
    return {
        "palace_name": ben_palace,
        "liu_qin_mapping": {
            "兄弟": palace_info.get("兄弟", []),
            "父母": palace_info.get("父母", []),
            "子孙": palace_info.get("子孙", []),
            "官鬼": palace_info.get("官鬼", []),
            "妻财": palace_info.get("妻财", [])
        }
    }

def calculate_shi_ying(ben_gua_info):
    """计算世爻应爻信息"""
    shi_yao_position = ben_gua_info["shi_yao"]  # 世爻位置（1-6）
    ying_yao_position = calculate_ying_yao(shi_yao_position)  # 应爻位置
    
    return {
        "shi_yao": {
            "position": shi_yao_position,
            "stem": ben_gua_info['stems'][shi_yao_position-1],
            "branch": ben_gua_info['branches'][shi_yao_position-1],
            "liu_qin": ben_gua_info['liu_qin'][shi_yao_position-1]
        },
        "ying_yao": {
            "position": ying_yao_position,
            "stem": ben_gua_info['stems'][ying_yao_position-1],
            "branch": ben_gua_info['branches'][ying_yao_position-1],
            "liu_qin": ben_gua_info['liu_qin'][ying_yao_position-1]
        }
    }

def calculate_liu_shen():
    """计算六神信息"""
    liu_shen_arrangement, day_gan = calculate_liu_shen_by_day_gan()
    liu_shen_details = get_liu_shen_details(liu_shen_arrangement)
    
    return {
        "day_gan": day_gan,
        "arrangement": liu_shen_arrangement,
        "details": liu_shen_details
    }

def print_detailed_results(ben_gua_info, bian_gua_info, dong_yao_indices, 
                          palace_info, shi_ying_info, liu_shen_info):
    """打印详细结果信息"""
    
    print("\n" + "="*60)
    print("                   六爻排盘详细结果")
    print("="*60)
    
    # 1. 本卦信息
    print("\n【本卦信息】")
    print("-"*40)
    print(f"卦名: {ben_gua_info['name']}")
    print(f"卦码: {ben_gua_info['code']}")
    print(f"所属宫: {ben_gua_info['palace']}")
    print(f"宫内类型: {ben_gua_info['shi_type']}")
    print("纳干: " + " ".join(ben_gua_info["stems"]))
    print("纳支: " + " ".join(ben_gua_info["branches"]))
    print("六亲: " + " ".join(ben_gua_info["liu_qin"]))
    
    # 2. 变卦信息
    print("\n【变卦信息】")
    print("-"*40)
    print(f"卦名: {bian_gua_info['name']}")
    print(f"卦码: {bian_gua_info['code']}")
    print(f"宫内类型: {bian_gua_info['shi_type']}")
    print("纳干: " + " ".join(bian_gua_info["stems"]))
    print("纳支: " + " ".join(bian_gua_info["branches"]))
    print("六亲: " + " ".join(bian_gua_info["liu_qin"]))
    
    # 3. 动爻信息
    print("\n【动爻信息】")
    print("-"*40)
    if dong_yao_indices:
        for idx in dong_yao_indices:
            print(f"第 {idx + 1} 爻发动")
    else:
        print("无动爻")
    
    # 4. 世爻应爻信息
    print("\n【世爻应爻信息】")
    print("-"*40)
    print(f"世爻位置: 第{shi_ying_info['shi_yao']['position']}爻")
    print(f"应爻位置: 第{shi_ying_info['ying_yao']['position']}爻")
    
    print(f"\n世爻（第{shi_ying_info['shi_yao']['position']}爻）:")
    print(f"  天干: {shi_ying_info['shi_yao']['stem']}")
    print(f"  地支: {shi_ying_info['shi_yao']['branch']}")
    print(f"  六亲: {shi_ying_info['shi_yao']['liu_qin']}")
    
    print(f"\n应爻（第{shi_ying_info['ying_yao']['position']}爻）:")
    print(f"  天干: {shi_ying_info['ying_yao']['stem']}")
    print(f"  地支: {shi_ying_info['ying_yao']['branch']}")
    print(f"  六亲: {shi_ying_info['ying_yao']['liu_qin']}")
    
    # 5. 宫卦六亲对照
    print("\n【宫卦六亲对照】")
    print("-"*40)
    print(f"{palace_info['palace_name']} 宫地支六亲映射:")
    for liuqin, branches in palace_info['liu_qin_mapping'].items():
        print(f"  {liuqin}: {branches}")
    
    # 6. 六神计算
    print("\n【六神计算】")
    print("-"*40)
    print(f"当前日天干: {liu_shen_info['day_gan']}")
    print("六神排列（从初爻到上爻）:")
    
    # 创建漂亮的表格格式
    print("-"*50)
    print(f"{'爻位':<8} {'六神':<8} {'五行':<6} {'吉凶':<6} {'方位'}")
    print("-"*50)
    
    for i, liu_shen in enumerate(liu_shen_info['arrangement']):
        details = liu_shen_info['details'][i]
        yao_position = f"第{i+1}爻"
        print(f"{yao_position:<8} {liu_shen:<8} {details['wuxing']:<6} {details['jixiong']:<6} {details['fangwei']}")
    
    print("-"*50)
    
    print("\n" + "="*60)
    print("                   六爻排盘结果结束")
    print("="*60)

def format_frontend_data(ben_gua_info, bian_gua_info, dong_yao_indices,
                        palace_info, shi_ying_info, liu_shen_info):
    """格式化前端数据"""
    from datetime import datetime
    
    # 构建完整的爻位信息
    yao_positions = []
    for i in range(6):
        yao_info = {
            "position": i + 1,
            "ben_gua": {
                "stem": ben_gua_info["stems"][i],
                "branch": ben_gua_info["branches"][i],
                "liu_qin": ben_gua_info["liu_qin"][i],
                "is_dong_yao": i in dong_yao_indices
            },
            "bian_gua": {
                "stem": bian_gua_info["stems"][i],
                "branch": bian_gua_info["branches"][i],
                "liu_qin": bian_gua_info["liu_qin"][i]
            },
            "liu_shen": {
                "name": liu_shen_info["arrangement"][i],
                "wuxing": liu_shen_info["details"][i]["wuxing"],
                "jixiong": liu_shen_info["details"][i]["jixiong"],
                "fangwei": liu_shen_info["details"][i]["fangwei"]
            }
        }
        yao_positions.append(yao_info)
    
    return {
        "summary": {
            "ben_gua_name": ben_gua_info["name"],
            "bian_gua_name": bian_gua_info["name"],
            "palace": ben_gua_info["palace"],
            "dong_yao_count": len(dong_yao_indices),
            "shi_yao_position": shi_ying_info["shi_yao"]["position"],
            "ying_yao_position": shi_ying_info["ying_yao"]["position"],
            "day_gan": liu_shen_info["day_gan"]
        },
        "ben_gua": {
            "name": ben_gua_info["name"],
            "code": ben_gua_info["code"],
            "stems": ben_gua_info["stems"],
            "branches": ben_gua_info["branches"],
            "liu_qin": ben_gua_info["liu_qin"],
            "shi_yao": ben_gua_info["shi_yao"],
            "shi_type": ben_gua_info["shi_type"],
            "palace": ben_gua_info["palace"],
            "full_info": ben_gua_info["info"]
        },
        "bian_gua": {
            "name": bian_gua_info["name"],
            "code": bian_gua_info["code"],
            "stems": bian_gua_info["stems"],
            "branches": bian_gua_info["branches"],
            "liu_qin": bian_gua_info["liu_qin"],
            "shi_type": bian_gua_info["shi_type"],
            "full_info": bian_gua_info["info"]
        },
        "dong_yao": {
            "positions": dong_yao_indices,
            "count": len(dong_yao_indices),
            "details": [{
                "position": idx + 1,
                "ben_gua_liu_qin": ben_gua_info["liu_qin"][idx],
                "bian_gua_liu_qin": bian_gua_info["liu_qin"][idx]
            } for idx in dong_yao_indices]
        },
        "palace": {
            "name": palace_info["palace_name"],
            "liu_qin_mapping": palace_info["liu_qin_mapping"]
        },
        "shi_ying": {
            "shi_yao": {
                "position": shi_ying_info["shi_yao"]["position"],
                "stem": shi_ying_info["shi_yao"]["stem"],
                "branch": shi_ying_info["shi_yao"]["branch"],
                "liu_qin": shi_ying_info["shi_yao"]["liu_qin"],
                "liu_shen": liu_shen_info["arrangement"][shi_ying_info["shi_yao"]["position"] - 1]
            },
            "ying_yao": {
                "position": shi_ying_info["ying_yao"]["position"],
                "stem": shi_ying_info["ying_yao"]["stem"],
                "branch": shi_ying_info["ying_yao"]["branch"],
                "liu_qin": shi_ying_info["ying_yao"]["liu_qin"],
                "liu_shen": liu_shen_info["arrangement"][shi_ying_info["ying_yao"]["position"] - 1]
            }
        },
        "liu_shen": {
            "day_gan": liu_shen_info["day_gan"],
            "arrangement": liu_shen_info["arrangement"],
            "details": liu_shen_info["details"]
        },
        "yao_positions": yao_positions,
        "timestamp": Solar.fromDate(datetime.now()).toYmdHms()
    }

def print_frontend_data(frontend_data):
    """打印前端数据格式"""
    print("\n" + "="*60)
    print("                   前端数据格式展示")
    print("="*60)
    
    import json
    
    # 1. 显示摘要信息
    print("\n【摘要信息】")
    print("-"*40)
    summary = frontend_data["summary"]
    print(f"本卦: {summary['ben_gua_name']}")
    print(f"变卦: {summary['bian_gua_name']}")
    print(f"所属宫: {summary['palace']}")
    print(f"动爻数量: {summary['dong_yao_count']}个")
    print(f"世爻位置: 第{summary['shi_yao_position']}爻")
    print(f"应爻位置: 第{summary['ying_yao_position']}爻")
    print(f"日天干: {summary['day_gan']}")
    
    # 2. 显示爻位信息（简化显示）
    print("\n【爻位信息（简化）】")
    print("-"*40)
    print(f"{'爻位':<6} {'本卦六亲':<8} {'变卦六亲':<8} {'六神':<8} {'动爻'}")
    print("-"*40)
    for yao in frontend_data["yao_positions"]:
        dong_yao_mark = "✓" if yao["ben_gua"]["is_dong_yao"] else ""
        print(f"第{yao['position']}爻: {yao['ben_gua']['liu_qin']:<8} {yao['bian_gua']['liu_qin']:<8} {yao['liu_shen']['name']:<8} {dong_yao_mark}")
    
    # 3. 显示动爻详细信息
    if frontend_data["dong_yao"]["count"] > 0:
        print("\n【动爻详细信息】")
        print("-"*40)
        for dong_yao in frontend_data["dong_yao"]["details"]:
            print(f"第{dong_yao['position']}爻: 本卦六亲={dong_yao['ben_gua_liu_qin']}, 变卦六亲={dong_yao['bian_gua_liu_qin']}")
    
    # 4. 显示世爻应爻信息
    print("\n【世爻应爻信息】")
    print("-"*40)
    shi_ying = frontend_data["shi_ying"]
    print(f"世爻（第{shi_ying['shi_yao']['position']}爻）:")
    print(f"  天干: {shi_ying['shi_yao']['stem']}, 地支: {shi_ying['shi_yao']['branch']}")
    print(f"  六亲: {shi_ying['shi_yao']['liu_qin']}, 六神: {shi_ying['shi_yao']['liu_shen']}")
    
    print(f"\n应爻（第{shi_ying['ying_yao']['position']}爻）:")
    print(f"  天干: {shi_ying['ying_yao']['stem']}, 地支: {shi_ying['ying_yao']['branch']}")
    print(f"  六亲: {shi_ying['ying_yao']['liu_qin']}, 六神: {shi_ying['ying_yao']['liu_shen']}")
    
    # 5. 显示六神信息
    print("\n【六神信息】")
    print("-"*40)
    print(f"日天干: {frontend_data['liu_shen']['day_gan']}")
    print("六神排列:")
    for i, liu_shen in enumerate(frontend_data["liu_shen"]["arrangement"]):
        print(f"  第{i+1}爻: {liu_shen}")
    
    # 6. 显示完整JSON数据
    print("\n【完整JSON数据】")
    print("-"*40)
    formatted_data = json.dumps(frontend_data, ensure_ascii=False, indent=2)
    print(formatted_data)
    
    print("\n" + "="*60)
    print("                   前端数据展示结束")
    print("="*60)

def analyze_liuyao_result(result):
    """分析六爻排盘结果"""
    print("计算结果:", result)
    print()
    
    # 1. 解析本卦
    ben_gua_info = parse_ben_gua(result)
    
    # 2. 解析动爻
    dong_yao_indices = parse_dong_yao(result)
    
    # 3. 解析变卦
    bian_gua_info = parse_bian_gua(result, ben_gua_info)
    
    # 4. 获取宫卦信息
    palace_info = get_palace_info(ben_gua_info)
    
    # 5. 计算世爻应爻
    shi_ying_info = calculate_shi_ying(ben_gua_info)
    
    # 6. 计算六神
    liu_shen_info = calculate_liu_shen()
    
    # 7. 打印详细结果
    print_detailed_results(ben_gua_info, bian_gua_info, dong_yao_indices, 
                          palace_info, shi_ying_info, liu_shen_info)
    
    # 8. 返回前端数据格式
    frontend_data = format_frontend_data(ben_gua_info, bian_gua_info, dong_yao_indices,
                                        palace_info, shi_ying_info, liu_shen_info)
    
    # 9. 打印前端数据
    print_frontend_data(frontend_data)
    
    return frontend_data

# ==================== 测试函数 ====================

def test_liuyao_basic_operations():
    """测试六爻基础操作功能"""
    print("\n=== 测试六爻基础操作 ===")
    
    # 测试奇数统计函数
    print("测试奇数统计函数:")
    result = count_odd_digits_in_triplets(testArr)
    print(f"输入数组: {testArr}")
    print(f"奇数统计结果: {result}")
    
    # 测试六爻排盘分析
    print("\n测试六爻排盘分析:")
    analysis_result = analyze_liuyao_result(result)
    
    # 测试卦象识别
    print("\n测试卦象识别:")
    test_gua_code = "111111"  # 乾为天
    for gua_name, gua_info in SIXTY_FOUR_GUA.items():
        if gua_info["code"] == test_gua_code:
            print(f"卦象代码 {test_gua_code} 对应卦名: {gua_name}")
            print(f"卦性: {gua_info['nature']}")
            print(f"卦辞: {gua_info['gua_ci']}")
            break
    
    print("基础操作测试完成!")

def test_liuyao_advanced_features():
    """测试六爻高级功能"""
    print("\n=== 测试六爻高级功能 ===")
    
    # 测试六神系统
    print("测试六神系统:")
    test_tian_gan = "甲"
    if test_tian_gan in TIAN_GAN_TO_LIU_SHEN:
        liu_shen_list = TIAN_GAN_TO_LIU_SHEN[test_tian_gan]
        print(f"天干 {test_tian_gan} 对应的六神: {liu_shen_list}")
    
    # 测试宫位归属
    print("\n测试宫位归属:")
    test_palace = "乾"
    if test_palace in GUA_PALACES:
        guas_in_palace = GUA_PALACES[test_palace]["guas"]
        print(f"{test_palace}宫包含的卦象: {guas_in_palace}")
    
    print("高级功能测试完成!")

def test_liuyao_integration():
    """测试六爻历法集成功能"""
    print("\n=== 测试六爻历法集成 ===")
    from datetime import datetime
    
    current_datetime = datetime.now()
    current_solar = Solar.fromDate(current_datetime)
    current_time = current_solar.toYmdHms()
    print(f"当前时间: {current_time}")
    
    # 模拟摇卦过程
    print("模拟摇卦过程:")
    yao_values = []
    yao_types = []
    
    for i in range(6):
        # 模拟随机生成爻值 (6,7,8,9)
        yao_value = random.choice([6, 7, 8, 9])
        yao_values.append(yao_value)
        
        # 根据爻值确定爻类型
        if yao_value == 6:
            yao_type = "老阴"
        elif yao_value == 7:
            yao_type = "少阳"
        elif yao_value == 8:
            yao_type = "少阴"
        else:  # yao_value == 9
            yao_type = "老阳"
        yao_types.append(yao_type)
        
        print(f"第{i+1}爻: 值={yao_value}, 类型={yao_type}")
    
    print("历法集成测试完成!")

def main():
    """主测试函数"""
    from datetime import datetime
    
    print("=== 六爻计算器测试开始 ===")
    current_datetime = datetime.now()
    current_solar = Solar.fromDate(current_datetime)
    print(f"测试时间: {current_solar.toYmdHms()}")
    
    # 执行所有测试
    test_liuyao_basic_operations()
    test_liuyao_advanced_features()
    test_liuyao_integration()
    
    print("\n=== 六爻计算器测试完成 ===")

# === 程序入口 ===
if __name__ == "__main__":
    main()



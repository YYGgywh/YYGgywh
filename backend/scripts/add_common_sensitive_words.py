import sqlite3
import os
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'app', 'db', 'yyggywh.db')

COMMON_SENSITIVE_WORDS = [
    ("习近平", "政治", 2, "国家领导人姓名"),
    ("江泽民", "政治", 2, "国家领导人姓名"),
    ("胡锦涛", "政治", 2, "国家领导人姓名"),
    ("温家宝", "政治", 2, "国家领导人姓名"),
    ("李鹏", "政治", 2, "国家领导人姓名"),
    ("朱镕基", "政治", 2, "国家领导人姓名"),
    ("李克强", "政治", 2, "国家领导人姓名"),
    ("六四", "政治", 2, "敏感历史事件"),
    ("天安门", "政治", 2, "敏感地点"),
    ("法轮功", "政治", 2, "非法组织"),
    ("台独", "政治", 2, "分裂势力"),
    ("藏独", "政治", 2, "分裂势力"),
    ("疆独", "政治", 2, "分裂势力"),
    ("反共", "政治", 2, "反动言论"),
    ("反华", "政治", 2, "反动言论"),
    
    ("性爱", "色情", 2, "色情内容"),
    ("做爱", "色情", 2, "色情内容"),
    ("强奸", "色情", 2, "违法行为"),
    ("乱伦", "色情", 2, "色情内容"),
    ("嫖娼", "色情", 2, "违法行为"),
    ("卖淫", "色情", 2, "违法行为"),
    ("约炮", "色情", 2, "不良信息"),
    ("一夜情", "色情", 2, "不良信息"),
    ("AV", "色情", 2, "色情内容"),
    ("黄片", "色情", 2, "色情内容"),
    ("裸聊", "色情", 2, "色情内容"),
    ("裸体", "色情", 1, "色情内容"),
    
    ("杀人", "暴力", 2, "暴力内容"),
    ("杀你", "暴力", 2, "暴力威胁"),
    ("砍死", "暴力", 2, "暴力威胁"),
    ("打死", "暴力", 2, "暴力威胁"),
    ("爆炸", "暴力", 2, "危险行为"),
    ("炸弹", "暴力", 2, "危险物品"),
    ("恐怖袭击", "暴力", 2, "恐怖主义"),
    ("恐怖分子", "暴力", 2, "恐怖主义"),
    ("自杀", "暴力", 2, "危险行为"),
    
    ("傻逼", "辱骂", 2, "侮辱性词汇"),
    ("操你", "辱骂", 2, "侮辱性词汇"),
    ("妈的", "辱骂", 1, "脏话"),
    ("他妈的", "辱骂", 1, "脏话"),
    ("王八蛋", "辱骂", 2, "侮辱性词汇"),
    ("畜生", "辱骂", 2, "侮辱性词汇"),
    ("滚蛋", "辱骂", 1, "不文明用语"),
    ("去死", "辱骂", 2, "侮辱性词汇"),
    ("贱人", "辱骂", 2, "侮辱性词汇"),
    ("婊子", "辱骂", 2, "侮辱性词汇"),
    ("狗日的", "辱骂", 2, "侮辱性词汇"),
    
    ("代开发票", "广告", 2, "违法广告"),
    ("办证", "广告", 1, "可疑广告"),
    ("刷单", "广告", 2, "违法行为"),
    ("兼职刷信誉", "广告", 2, "诈骗信息"),
    ("日赚千元", "广告", 2, "虚假广告"),
    ("免费领取", "广告", 1, "营销信息"),
    
    ("排盘作弊", "业务", 2, "业务违规"),
    ("算命骗子", "业务", 2, "业务违规"),
    ("封建迷信", "业务", 1, "敏感表述"),
    ("骗钱", "业务", 2, "投诉词汇"),
]

def add_sensitive_words():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    success_count = 0
    skip_count = 0
    current_time = int(time.time())
    
    print("开始添加常用敏感词...")
    print(f"共 {len(COMMON_SENSITIVE_WORDS)} 条待添加\n")
    
    for word, category, level, description in COMMON_SENSITIVE_WORDS:
        try:
            cursor.execute(
                """INSERT INTO sensitive_word 
                   (word, category, level, description, create_time, update_time, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?, 1)""",
                (word, category, level, description, current_time, current_time)
            )
            success_count += 1
            print(f"[OK] 添加成功: {word} [{category}]")
        except sqlite3.IntegrityError:
            skip_count += 1
            print(f"[SKIP] 已存在跳过: {word}")
        except Exception as e:
            print(f"[ERROR] 添加失败: {word} - {str(e)}")
    
    conn.commit()
    conn.close()
    
    print(f"\n{'='*50}")
    print(f"添加完成!")
    print(f"成功: {success_count} 条")
    print(f"跳过: {skip_count} 条")
    print(f"总计: {len(COMMON_SENSITIVE_WORDS)} 条")

if __name__ == "__main__":
    add_sensitive_words()

from typing import Tuple, List
from sqlalchemy.orm import Session
from app.models.sensitive_word import SensitiveWord

class SensitiveWordFilter:
    """敏感词过滤器"""
    
    def __init__(self, db: Session):
        self.db = db
        self._load_words()
    
    def _load_words(self):
        """加载敏感词库"""
        self.words = self.db.query(SensitiveWord).filter(
            SensitiveWord.is_active == 1
        ).all()
        
        # 按长度降序排序，确保长词优先匹配
        self.words.sort(key=lambda x: len(x.word), reverse=True)
    
    def filter(self, text: str) -> Tuple[bool, str, List[dict]]:
        """
        过滤敏感词
        
        Args:
            text: 待过滤的文本
            
        Returns:
            (is_safe, filtered_text, found_words)
        """
        if not text:
            return True, text, []
        
        found_words = []
        filtered_text = text
        
        for word_obj in self.words:
            word = word_obj.word
            if word in filtered_text:
                found_words.append({
                    "word": word,
                    "level": word_obj.level,
                    "category": word_obj.category
                })
                
                # 替换敏感词
                if word_obj.level == 2:  # 禁止级别
                    replace_text = "*" * len(word)
                else:  # 警告级别
                    replace_text = word[0] + "*" * (len(word) - 1)
                
                filtered_text = filtered_text.replace(word, replace_text)
        
        is_safe = len(found_words) == 0
        return is_safe, filtered_text, found_words
    
    def check(self, text: str) -> Tuple[bool, List[dict]]:
        """
        检查是否包含敏感词（不替换）
        
        Args:
            text: 待检查的文本
            
        Returns:
            (is_safe, found_words)
        """
        if not text:
            return True, []
        
        found_words = []
        
        for word_obj in self.words:
            word = word_obj.word
            if word in text:
                found_words.append({
                    "word": word,
                    "level": word_obj.level,
                    "category": word_obj.category
                })
        
        is_safe = len(found_words) == 0
        return is_safe, found_words


def create_filter(db: Session) -> SensitiveWordFilter:
    """创建敏感词过滤器实例"""
    return SensitiveWordFilter(db)
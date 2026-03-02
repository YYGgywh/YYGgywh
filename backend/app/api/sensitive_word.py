from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel, Field
from typing import Optional, List
from app.db.database import get_db
from app.models.sensitive_word import SensitiveWord, SensitiveWordLog
from app.utils.dependencies import get_current_admin_user, get_super_admin
from app.utils.response_formatter import create_success_response, create_error_response
import json
import time
import csv
from io import StringIO

router = APIRouter(tags=["敏感词管理"])

# 请求模型
class SensitiveWordCreateRequest(BaseModel):
    word: str = Field(..., min_length=1, max_length=100, description="敏感词")
    category: Optional[str] = Field(None, max_length=50, description="分类")
    level: int = Field(1, ge=1, le=2, description="级别：1=警告，2=禁止")
    description: Optional[str] = Field(None, description="说明")

class SensitiveWordUpdateRequest(BaseModel):
    word: Optional[str] = Field(None, min_length=1, max_length=100, description="敏感词")
    category: Optional[str] = Field(None, max_length=50, description="分类")
    level: Optional[int] = Field(None, ge=1, le=2, description="级别")
    description: Optional[str] = Field(None, description="说明")
    is_active: Optional[int] = Field(None, ge=0, le=1, description="是否启用")

# 响应模型
class SensitiveWordResponse(BaseModel):
    id: int
    word: str
    category: Optional[str]
    level: int
    description: Optional[str]
    create_time: int
    update_time: int
    is_active: int

class SensitiveWordListResponse(BaseModel):
    list: List[SensitiveWordResponse]
    total: int
    page: int
    page_size: int

# 日志记录函数
def log_sensitive_word_action(db: Session, word_id: Optional[int], word: str, action: str, 
                              old_value: Optional[dict], new_value: Optional[dict],
                              operator_id: Optional[int], operator_name: Optional[str], remark: Optional[str] = None):
    """记录敏感词操作日志"""
    log = SensitiveWordLog(
        word_id=word_id,
        word=word,
        action=action,
        old_value=json.dumps(old_value, ensure_ascii=False) if old_value else None,
        new_value=json.dumps(new_value, ensure_ascii=False) if new_value else None,
        operator_id=operator_id,
        operator_name=operator_name,
        operate_time=int(time.time()),
        remark=remark
    )
    db.add(log)
    db.commit()

@router.get("/list", response_model=dict)
async def get_sensitive_word_list(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    category: Optional[str] = Query(None, description="分类"),
    level: Optional[int] = Query(None, ge=1, le=2, description="级别"),
    is_active: Optional[int] = Query(None, ge=0, le=1, description="是否启用"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """获取敏感词列表"""
    query = db.query(SensitiveWord)
    
    # 筛选条件
    if keyword:
        query = query.filter(SensitiveWord.word.contains(keyword))
    if category:
        query = query.filter(SensitiveWord.category == category)
    if level is not None:
        query = query.filter(SensitiveWord.level == level)
    if is_active is not None:
        query = query.filter(SensitiveWord.is_active == is_active)
    
    # 总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * page_size
    words = query.order_by(SensitiveWord.create_time.desc()).offset(offset).limit(page_size).all()
    
    return create_success_response({
        "list": [
            {
                "id": w.id,
                "word": w.word,
                "category": w.category,
                "level": w.level,
                "description": w.description,
                "create_time": w.create_time,
                "update_time": w.update_time,
                "is_active": w.is_active
            }
            for w in words
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    })

@router.get("/{word_id}", response_model=dict)
async def get_sensitive_word_detail(
    word_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """获取敏感词详情"""
    word = db.query(SensitiveWord).filter(SensitiveWord.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="敏感词不存在")
    
    return create_success_response({
        "id": word.id,
        "word": word.word,
        "category": word.category,
        "level": word.level,
        "description": word.description,
        "create_time": word.create_time,
        "update_time": word.update_time,
        "is_active": word.is_active
    })

@router.post("/create", response_model=dict)
async def create_sensitive_word(
    request: SensitiveWordCreateRequest,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """创建敏感词"""
    # 检查是否已存在
    existing = db.query(SensitiveWord).filter(SensitiveWord.word == request.word).first()
    if existing:
        raise HTTPException(status_code=400, detail="该敏感词已存在")
    
    # 创建敏感词
    new_word = SensitiveWord(
        word=request.word,
        category=request.category,
        level=request.level,
        description=request.description,
        create_user_id=current_admin.id,
        create_time=int(time.time()),
        update_time=int(time.time()),
        is_active=1
    )
    
    db.add(new_word)
    db.commit()
    db.refresh(new_word)
    
    # 记录日志
    new_value = {
        "word": new_word.word,
        "category": new_word.category,
        "level": new_word.level,
        "description": new_word.description
    }
    log_sensitive_word_action(
        db, new_word.id, new_word.word, "create",
        None, new_value, current_admin.id, current_admin.nickname
    )
    
    return create_success_response({
        "id": new_word.id,
        "word": new_word.word
    }, "创建成功")

@router.put("/update/{word_id}", response_model=dict)
async def update_sensitive_word(
    word_id: int,
    request: SensitiveWordUpdateRequest,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """更新敏感词"""
    word = db.query(SensitiveWord).filter(SensitiveWord.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="敏感词不存在")
    
    # 记录旧值
    old_value = {
        "word": word.word,
        "category": word.category,
        "level": word.level,
        "description": word.description,
        "is_active": word.is_active
    }
    
    # 如果要修改word，检查是否已存在
    if request.word and request.word != word.word:
        existing = db.query(SensitiveWord).filter(SensitiveWord.word == request.word).first()
        if existing:
            raise HTTPException(status_code=400, detail="该敏感词已存在")
        word.word = request.word
    
    # 更新其他字段
    if request.category is not None:
        word.category = request.category
    if request.level is not None:
        word.level = request.level
    if request.description is not None:
        word.description = request.description
    if request.is_active is not None:
        word.is_active = request.is_active
    
    word.update_user_id = current_admin.id
    word.update_time = int(time.time())
    
    db.commit()
    db.refresh(word)
    
    # 记录新值
    new_value = {
        "word": word.word,
        "category": word.category,
        "level": word.level,
        "description": word.description,
        "is_active": word.is_active
    }
    
    # 记录日志
    log_sensitive_word_action(
        db, word.id, word.word, "update",
        old_value, new_value, current_admin.id, current_admin.nickname
    )
    
    return create_success_response({
        "id": word.id,
        "word": word.word
    }, "更新成功")

@router.delete("/delete/{word_id}", response_model=dict)
async def delete_sensitive_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_super_admin)
):
    """删除敏感词"""
    word = db.query(SensitiveWord).filter(SensitiveWord.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="敏感词不存在")
    
    # 记录旧值
    old_value = {
        "word": word.word,
        "category": word.category,
        "level": word.level,
        "description": word.description
    }
    
    # 记录日志（在删除前）
    log_sensitive_word_action(
        db, word.id, word.word, "delete",
        old_value, None, current_admin.id, current_admin.nickname
    )
    
    # 删除
    db.delete(word)
    db.commit()
    
    return create_success_response(None, "删除成功")

@router.post("/batch_import", response_model=dict)
async def batch_import_sensitive_words(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """批量导入敏感词（CSV格式）"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="只支持CSV格式文件")
    
    content = await file.read()
    content_str = content.decode('utf-8')
    
    # 解析CSV
    import_count = 0
    skip_count = 0
    errors = []
    
    try:
        csv_reader = csv.DictReader(StringIO(content_str))
        
        for row in csv_reader:
            try:
                word = row.get('word', '').strip()
                if not word:
                    continue
                
                # 检查是否已存在
                existing = db.query(SensitiveWord).filter(SensitiveWord.word == word).first()
                if existing:
                    skip_count += 1
                    continue
                
                category = row.get('category', '').strip() or None
                level = int(row.get('level', 1))
                description = row.get('description', '').strip() or None
                
                # 创建敏感词
                new_word = SensitiveWord(
                    word=word,
                    category=category,
                    level=level if 1 <= level <= 2 else 1,
                    description=description,
                    create_user_id=current_admin.id,
                    create_time=int(time.time()),
                    update_time=int(time.time()),
                    is_active=1
                )
                
                db.add(new_word)
                import_count += 1
                
                # 记录日志
                new_value = {"word": word, "category": category, "level": level, "description": description}
                log_sensitive_word_action(
                    db, None, word, "create",
                    None, new_value, current_admin.id, current_admin.nickname, "批量导入"
                )
                
            except Exception as e:
                errors.append(f"行 {csv_reader.line_num}: {str(e)}")
                continue
        
        db.commit()
        
        return create_success_response({
            "import_count": import_count,
            "skip_count": skip_count,
            "errors": errors
        }, f"导入完成：成功导入 {import_count} 条，跳过 {skip_count} 条")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"文件解析失败：{str(e)}")

@router.get("/export/download", response_model=dict)
async def export_sensitive_words(
    category: Optional[str] = Query(None, description="分类"),
    level: Optional[int] = Query(None, ge=1, le=2, description="级别"),
    is_active: Optional[int] = Query(None, ge=0, le=1, description="是否启用"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """导出敏感词为CSV"""
    query = db.query(SensitiveWord)
    
    if category:
        query = query.filter(SensitiveWord.category == category)
    if level is not None:
        query = query.filter(SensitiveWord.level == level)
    if is_active is not None:
        query = query.filter(SensitiveWord.is_active == is_active)
    
    words = query.order_by(SensitiveWord.create_time.desc()).all()
    
    # 生成CSV
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['word', 'category', 'level', 'description', 'is_active', 'create_time'])
    
    for w in words:
        writer.writerow([
            w.word,
            w.category or '',
            w.level,
            w.description or '',
            w.is_active,
            w.create_time
        ])
    
    from fastapi.responses import StreamingResponse
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=sensitive_words_{int(time.time())}.csv"
        }
    )

@router.get("/logs/list", response_model=dict)
async def get_sensitive_word_logs(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    word_id: Optional[int] = Query(None, description="敏感词ID"),
    action: Optional[str] = Query(None, description="操作类型"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin_user)
):
    """获取敏感词操作日志"""
    query = db.query(SensitiveWordLog)
    
    if word_id:
        query = query.filter(SensitiveWordLog.word_id == word_id)
    if action:
        query = query.filter(SensitiveWordLog.action == action)
    
    total = query.count()
    offset = (page - 1) * page_size
    logs = query.order_by(SensitiveWordLog.operate_time.desc()).offset(offset).limit(page_size).all()
    
    return create_success_response({
        "list": [
            {
                "id": log.id,
                "word_id": log.word_id,
                "word": log.word,
                "action": log.action,
                "old_value": json.loads(log.old_value) if log.old_value else None,
                "new_value": json.loads(log.new_value) if log.new_value else None,
                "operator_id": log.operator_id,
                "operator_name": log.operator_name,
                "operate_time": log.operate_time,
                "remark": log.remark
            }
            for log in logs
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    })

@router.get("/check", response_model=dict)
async def check_sensitive_words(
    text: str = Query(..., description="待检查的文本"),
    db: Session = Depends(get_db)
):
    """检查文本中的敏感词（公开接口，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, found_words = filter.check(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "found_words": found_words
    })


@router.get("/filter", response_model=dict)
async def filter_sensitive_words(
    text: str = Query(..., description="待过滤的文本"),
    db: Session = Depends(get_db)
):
    """过滤文本中的敏感词（公开接口，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, filtered_text, found_words = filter.filter(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "filtered_text": filtered_text,
        "found_words": found_words
    })

@router.get("/public/check", response_model=dict)
async def public_check_sensitive_words(
    text: str = Query(..., description="待检查的文本"),
    db: Session = Depends(get_db)
):
    """公开检查文本中的敏感词（完全公开，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, found_words = filter.check(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "found_words": found_words
    })

@router.get("/public/filter", response_model=dict)
async def public_filter_sensitive_words(
    text: str = Query(..., description="待过滤的文本"),
    db: Session = Depends(get_db)
):
    """公开过滤文本中的敏感词（完全公开，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, filtered_text, found_words = filter.filter(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "filtered_text": filtered_text,
        "found_words": found_words
    })
async def public_check_sensitive_words(
    text: str = Query(..., description="待检查的文本"),
    db: Session = Depends(get_db)
):
    """公开检查文本中的敏感词（完全公开，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, found_words = filter.check(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "found_words": found_words
    })


@router.get("/public/filter", response_model=dict)
async def public_filter_sensitive_words(
    text: str = Query(..., description="待过滤的文本"),
    db: Session = Depends(get_db)
):
    """公开过滤文本中的敏感词（完全公开，不需要身份验证）"""
    from app.utils.sensitive_word_filter import create_filter
    
    filter = create_filter(db)
    is_safe, filtered_text, found_words = filter.filter(text)
    
    return create_success_response({
        "is_safe": is_safe,
        "filtered_text": filtered_text,
        "found_words": found_words
    })
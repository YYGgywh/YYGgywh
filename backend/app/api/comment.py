# backend/app/api/comment.py 2026-02-27 10:00:00
# 功能：评论相关接口实现

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.comment import Comment
from app.models.user import User
from app.models.pan_record import PanRecord
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency, security_validation_dependency

router = APIRouter(tags=["comment"])

# 根据payload获取当前用户
def get_current_user_from_payload(payload: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """根据payload获取当前用户"""
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="用户未认证")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return user

# 请求模型
class AddCommentRequest(BaseModel):
    pan_record_id: int = Field(..., description="排盘记录ID")
    content: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="评论内容（1-1000字符）"
    )
    is_public: bool = Field(default=False, description="是否公开")

class UpdateCommentRequest(BaseModel):
    comment_id: int = Field(..., description="评论ID")
    content: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="评论内容（1-1000字符）"
    )
    is_public: bool = Field(..., description="是否公开")

class DeleteCommentRequest(BaseModel):
    comment_id: int = Field(..., description="评论ID")

# 响应模型
class AddCommentResponse(BaseModel):
    code: int = 200
    msg: str = "评论添加成功"
    data: dict

class CommentResponse(BaseModel):
    id: int
    content: str
    create_time: int
    user_id: int
    user_nickname: str
    user_avatar: str
    is_author: bool
    is_public: bool

class ListCommentResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: dict

class UpdateCommentResponse(BaseModel):
    code: int = 200
    msg: str = "评论更新成功"
    data: None = None

class DeleteCommentResponse(BaseModel):
    code: int = 200
    msg: str = "评论删除成功"
    data: None = None

@router.post("/add", response_model=AddCommentResponse)
async def add_comment(request: AddCommentRequest, current_user: User = Depends(get_current_user_from_payload), db: Session = Depends(get_db), req: Request = Depends(rate_limit_dependency), sec: Request = Depends(security_validation_dependency)):
    """
    添加评论
    
    **请求示例**:
    ```json
    {
        "pan_record_id": 123,
        "content": "这是一条评论内容",
        "is_public": true
    }
    ```
    
    **响应示例**:
    ```json
    {
        "code": 200,
        "msg": "评论添加成功",
        "data": {
            "comment_id": 456
        }
    }
    ```
    """
    # 敏感词检测
    from app.utils.sensitive_word_filter import create_filter
    filter = create_filter(db)
    is_safe, found_words = filter.check(request.content)
    
    if not is_safe:
        forbidden_words = [w for w in found_words if w['level'] == 2]
        if forbidden_words:
            word_list = ", ".join([w['word'] for w in forbidden_words])
            raise HTTPException(
                status_code=400, 
                detail=f"评论内容包含禁止使用的敏感词：{word_list}，请修改后重试"
            )
    
    # 创建评论
    new_comment = Comment(
        pan_record_id=request.pan_record_id,
        user_id=current_user.id,
        content=request.content,
        is_public=request.is_public
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    # 更新评论计数
    pan_record = db.query(PanRecord).filter(PanRecord.id == request.pan_record_id).first()
    if pan_record:
        pan_record.comment_count = (pan_record.comment_count or 0) + 1
        db.commit()
    
    return AddCommentResponse(data={"comment_id": new_comment.id})

@router.get("/list", response_model=ListCommentResponse)
async def list_comment(
    pan_record_id: int = Query(..., description="排盘记录ID"),
    page: int = Query(default=1, ge=1, description="页码"),
    size: int = Query(default=10, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user_from_payload),
    db: Session = Depends(get_db),
    req: Request = Depends(rate_limit_dependency)
):
    """
    查询评论列表
    
    **响应示例**:
    ```json
    {
        "code": 200,
        "msg": "查询成功",
        "data": {
            "list": [
                {
                    "id": 1,
                    "content": "评论内容",
                    "create_time": 1711022400,
                    "user_id": 123,
                    "user_nickname": "用户昵称",
                    "user_avatar": "头像URL",
                    "is_author": false,
                    "is_public": true
                }
            ],
            "total": 100,
            "page": 1,
            "size": 10
        }
    }
    ```
    """
    # 计算偏移量
    offset = (page - 1) * size
    
    # 获取排盘作者 ID
    pan_record = db.query(PanRecord).filter(PanRecord.id == pan_record_id).first()
    author_id = pan_record.user_id if pan_record else None
    
    # 查询评论（关联用户信息和排盘记录，根据权限过滤）
    from sqlalchemy import or_
    comments = db.query(Comment, User).join(
        User, Comment.user_id == User.id
    ).join(
        PanRecord, Comment.pan_record_id == PanRecord.id
    ).filter(
        Comment.pan_record_id == pan_record_id,
        Comment.is_visible == 1,
        Comment.deleted_at.is_(None),
        # 权限过滤：公开评论 或 评论作者是当前用户 或 排盘作者是当前用户
        or_(
            Comment.is_public == 1,
            Comment.user_id == current_user.id,
            PanRecord.user_id == current_user.id
        )
    ).order_by(Comment.create_time.desc()).offset(offset).limit(size).all()
    
    # 查询总数（使用相同的过滤条件）
    total = db.query(Comment).join(
        PanRecord, Comment.pan_record_id == PanRecord.id
    ).filter(
        Comment.pan_record_id == pan_record_id,
        Comment.is_visible == 1,
        Comment.deleted_at.is_(None),
        # 权限过滤：公开评论 或 评论作者是当前用户 或 排盘作者是当前用户
        or_(
            Comment.is_public == 1,
            Comment.user_id == current_user.id,
            PanRecord.user_id == current_user.id
        )
    ).count()
    
    # 构建响应数据
    items = []
    for comment, user in comments:
        items.append({
            "id": comment.id,
            "content": comment.content,
            "create_time": comment.create_time,
            "user_id": comment.user_id,
            "user_nickname": user.nickname or f"用户{user.id}",
            "user_avatar": user.avatar or "",
            "is_author": comment.user_id == author_id,
            "is_public": comment.is_public
        })
    
    return ListCommentResponse(data={
        "list": items,
        "total": total,
        "page": page,
        "size": size
    })

@router.post("/update", response_model=UpdateCommentResponse)
async def update_comment(request: UpdateCommentRequest, current_user: User = Depends(get_current_user_from_payload), db: Session = Depends(get_db), req: Request = Depends(rate_limit_dependency), sec: Request = Depends(security_validation_dependency)):
    """
    更新评论
    """
    # 查找评论
    comment = db.query(Comment).filter(
        Comment.id == request.comment_id,
        Comment.user_id == current_user.id
    ).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在或无权限")
    
    # 敏感词检测
    from app.utils.sensitive_word_filter import create_filter
    filter = create_filter(db)
    is_safe, found_words = filter.check(request.content)
    
    if not is_safe:
        forbidden_words = [w for w in found_words if w['level'] == 2]
        if forbidden_words:
            word_list = ", ".join([w['word'] for w in forbidden_words])
            raise HTTPException(
                status_code=400, 
                detail=f"评论内容包含禁止使用的敏感词：{word_list}，请修改后重试"
            )
    
    # 更新评论
    comment.content = request.content
    comment.is_public = request.is_public
    db.commit()
    
    return UpdateCommentResponse()

@router.post("/delete", response_model=DeleteCommentResponse)
async def delete_comment(request: DeleteCommentRequest, current_user: User = Depends(get_current_user_from_payload), db: Session = Depends(get_db), req: Request = Depends(rate_limit_dependency)):
    """
    删除评论
    """
    # 查找评论
    comment = db.query(Comment).filter(
        Comment.id == request.comment_id,
        Comment.user_id == current_user.id
    ).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在或无权限")
    
    # 获取 pan_record_id 用于更新计数
    pan_record_id = comment.pan_record_id
    
    # 删除评论
    db.delete(comment)
    db.commit()
    
    # 更新评论计数
    pan_record = db.query(PanRecord).filter(PanRecord.id == pan_record_id).first()
    if pan_record and pan_record.comment_count > 0:
        pan_record.comment_count -= 1
        db.commit()
    
    return DeleteCommentResponse()

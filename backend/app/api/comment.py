# backend/app/api/comment.py 2026-02-27 10:00:00
# 功能：评论相关接口实现

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.comment import Comment
from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.dependencies import rate_limit_dependency, security_validation_dependency

router = APIRouter(prefix="/comment", tags=["comment"])

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
    content: str = Field(..., description="评论内容")
    is_public: bool = Field(default=False, description="是否公开")

class UpdateCommentRequest(BaseModel):
    comment_id: int = Field(..., description="评论ID")
    content: str = Field(..., description="评论内容")
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
    is_public: bool

class ListCommentResponse(BaseModel):
    code: int = 200
    msg: str = "查询成功"
    data: list[CommentResponse]

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
    """
    # 计算偏移量
    offset = (page - 1) * size
    
    # 查询评论
    comments = db.query(Comment).filter(
        Comment.pan_record_id == pan_record_id
    ).order_by(Comment.create_time.desc()).offset(offset).limit(size).all()
    
    # 构建响应数据
    data = []
    for comment in comments:
        data.append(CommentResponse(
            id=comment.id,
            content=comment.content,
            create_time=comment.create_time,
            user_id=comment.user_id,
            is_public=comment.is_public
        ))
    
    return ListCommentResponse(data=data)

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
    
    # 删除评论
    db.delete(comment)
    db.commit()
    
    return DeleteCommentResponse()

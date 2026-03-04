# backend/app/api/user.py 2026-02-26 18:00:00
# 功能：用户相关接口实现

from fastapi import APIRouter, Depends, HTTPException, Request, Header, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db.database import get_db
from app.models.user import User
from app.utils.password import hash_password, verify_password, check_password_strength
from app.utils.token import create_access_token
from app.utils.verify_code import generate_verify_code, verify_code, generate_email_verify_code, verify_email_code
from app.utils.file_upload import save_uploaded_file, get_file_url
from app.utils.dependencies import rate_limit_dependency, security_validation_dependency
import re
import json

# 敏感信息脱敏函数
def mask_phone(phone: str) -> str:
    """
    脱敏手机号
    
    Args:
        phone: 手机号
    
    Returns:
        脱敏后的手机号，如：138****1234
    """
    if not phone or len(phone) < 7:
        return phone
    return f"{phone[:3]}****{phone[-4:]}"


def mask_email(email: str) -> str:
    """
    脱敏邮箱
    
    Args:
        email: 邮箱地址
    
    Returns:
        脱敏后的邮箱，如：***@example.com
    """
    if not email or "@" not in email:
        return email
    username, domain = email.split("@", 1)
    if len(username) <= 3:
        masked_username = "***"
    else:
        masked_username = f"{username[:2]}***"
    return f"{masked_username}@{domain}"

router = APIRouter(tags=["用户管理"])

# 请求模型
class SendCodeRequest(BaseModel):
    phone: str = Field(..., pattern="^1[3-9]\\d{9}$", description="手机号")

class SendEmailCodeRequest(BaseModel):
    email: str = Field(..., pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description="邮箱地址")

class RegisterRequest(BaseModel):
    phone: str | None = Field(None, pattern="^1[3-9]\\d{9}$", description="手机号")
    email: str | None = Field(None, pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description="邮箱地址")
    login_name: str | None = Field(None, min_length=4, max_length=20, description="登录名")
    code: str = Field(..., pattern="^\\d{6}$", description="验证码")
    password: str = Field(..., min_length=6, pattern="^[a-zA-Z0-9_]{6,}$", description="密码，至少6位，允许字母、数字和下划线")

class LoginRequest(BaseModel):
    phone: str | None = Field(None, pattern="^1[3-9]\\d{9}$", description="手机号")
    login_name: str | None = Field(None, description="登录名")
    code: str | None = Field(None, pattern="^\\d{6}$", description="验证码")
    password: str | None = Field(None, min_length=6, description="密码")

class UpdateLoginNameRequest(BaseModel):
    new_login_name: str = Field(..., min_length=4, max_length=20, description="新登录名")

class UploadAvatarResponse(BaseModel):
    code: int = 200
    msg: str = "头像上传成功"
    data: dict

# 响应模型
class SendCodeResponse(BaseModel):
    code: int = 200
    msg: str = "验证码发送成功"
    data: None = None

class SendEmailCodeResponse(BaseModel):
    code: int = 200
    msg: str = "验证码发送成功"
    data: None = None

class RegisterResponse(BaseModel):
    code: int = 200
    msg: str = "注册成功"
    data: dict

class LoginResponse(BaseModel):
    code: int = 200
    msg: str = "登录成功"
    data: dict

class UpdateLoginNameResponse(BaseModel):
    code: int = 200
    msg: str = "登录名修改成功"
    data: dict

@router.post("/send_code", response_model=SendCodeResponse)
async def send_code(request: SendCodeRequest):
    """
    发送注册/登录验证码（手机号）
    """
    # 生成并发送验证码
    generate_verify_code(request.phone)
    return SendCodeResponse()

@router.post("/send_email_code", response_model=SendEmailCodeResponse)
async def send_email_code(request: SendEmailCodeRequest):
    """
    发送注册/登录验证码（邮箱）
    """
    try:
        # 生成并发送验证码
        generate_email_verify_code(request.email)
        return SendEmailCodeResponse()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/register", response_model=RegisterResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    用户注册（支持手机或邮箱）
    """
    try:
        import random
        import string
        
        # 检查是否提供了手机号或邮箱
        if not request.phone and not request.email:
            raise HTTPException(status_code=400, detail="请提供手机号或邮箱")
        
        # 验证验证码
        if request.phone:
            if not verify_code(request.phone, request.code):
                raise HTTPException(status_code=400, detail="验证码错误或已过期")
            # 检查手机号是否已注册
            existing_user = db.query(User).filter(User.phone == request.phone).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="手机号已注册")
        elif request.email:
            if not verify_email_code(request.email, request.code):
                raise HTTPException(status_code=400, detail="验证码错误或已过期")
            # 检查邮箱是否已注册
            existing_user = db.query(User).filter(User.email == request.email).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="邮箱已注册")
        
        # 处理登录名
        login_name = request.login_name
        if not login_name:
            # 自动生成登录名：YYG_xxxxxxxx
            while True:
                suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
                generated_login_name = f"YYG_{suffix}"
                # 检查是否已存在
                if not db.query(User).filter(User.login_name == generated_login_name).first():
                    login_name = generated_login_name
                    break
        else:
            # 检查登录名是否已存在
            if db.query(User).filter(User.login_name == login_name).first():
                raise HTTPException(status_code=400, detail="登录名已被使用")
        
        # 敏感词检测（登录名和昵称）
        from app.utils.sensitive_word_filter import create_filter
        filter = create_filter(db)
        
        # 检查登录名敏感词
        is_safe, found_words = filter.check(login_name)
        
        if not is_safe:
            forbidden_words = [w for w in found_words if w['level'] == 2]
            if forbidden_words:
                word_list = ", ".join([w['word'] for w in forbidden_words])
                raise HTTPException(
                    status_code=400, 
                    detail=f"登录名包含禁止使用的敏感词：{word_list}，请修改后重试"
                )
        
        # 检查昵称敏感词（昵称默认与登录名相同）
        is_safe, found_words = filter.check(login_name)
        
        if not is_safe:
            forbidden_words = [w for w in found_words if w['level'] == 2]
            if forbidden_words:
                word_list = ", ".join([w['word'] for w in forbidden_words])
                raise HTTPException(
                    status_code=400, 
                    detail=f"昵称包含禁止使用的敏感词：{word_list}，请修改后重试"
                )
        
        # 检查密码强度（只拒绝极弱的密码）
        password_strength = check_password_strength(request.password)
        if password_strength['level'] in ['极弱']:
            raise HTTPException(status_code=400, detail=f"密码强度不足：{password_strength['message']}")
        
        # 创建新用户
        hashed_password = hash_password(request.password)
        new_user = User(
            phone=request.phone,
            email=request.email,
            login_name=login_name,
            nickname=login_name,  # 默认昵称为登录名
            password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return RegisterResponse(data={"user_id": new_user.id, "login_name": new_user.login_name})
    except HTTPException:
        raise
    except Exception as e:
        print(f"注册失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"注册失败: {str(e)}")

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db), fastapi_request: Request = None):
    """
    用户登录
    支持：手机号/登录名 + 验证码/密码
    """
    # 查找用户
    user = None
    if request.phone:
        user = db.query(User).filter(User.phone == request.phone).first()
    elif request.login_name:
        user = db.query(User).filter(User.login_name == request.login_name).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="用户未注册")
    
    # 验证方式
    if request.code:
        # 验证码登录
        if not verify_code(request.phone or user.phone, request.code):
            raise HTTPException(status_code=400, detail="验证码错误或已过期")
    elif request.password:
        # 密码登录
        if not verify_password(request.password, user.password):
            raise HTTPException(status_code=400, detail="密码错误")
    else:
        raise HTTPException(status_code=400, detail="请提供验证码或密码")
    
    # 更新登录信息
    import time
    current_time = int(time.time())
    user.last_login_time = current_time
    user.last_login_ip = fastapi_request.client.host if fastapi_request else ''
    user.login_count += 1
    db.commit()
    db.refresh(user)
    
    # 生成Token
    access_token = create_access_token(
        data={"user_id": user.id, "phone": user.phone, "login_name": user.login_name},
        is_admin=False
    )
    
    return LoginResponse(
        data={
            "token": access_token,
            "user_id": user.id,
            "login_name": user.login_name,
            "nickname": user.nickname,
            "avatar": user.avatar,
            "phone": mask_phone(user.phone),
            "email": mask_email(user.email) if user.email else None,
            "role": user.role,
            "create_time": user.create_time,
            "update_time": user.update_time,
            "last_login_time": user.last_login_time,
            "last_login_ip": user.last_login_ip,
            "login_count": user.login_count
        }
    )

@router.post("/update_login_name", response_model=UpdateLoginNameResponse)
async def update_login_name(
    request: UpdateLoginNameRequest, 
    db: Session = Depends(get_db),
    authorization: str = Header(None, description="Bearer Token")
):
    """
    修改登录名
    一年最多可修改4次
    """
    import time
    from app.utils.token import decode_access_token
    
    # 验证Token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    # 获取当前用户
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    # 检查新登录名是否已存在
    if db.query(User).filter(User.login_name == request.new_login_name).first():
        raise HTTPException(status_code=400, detail="登录名已被使用")
    
    # 敏感词检测
    from app.utils.sensitive_word_filter import create_filter
    filter = create_filter(db)
    is_safe, found_words = filter.check(request.new_login_name)
    
    if not is_safe:
        # 记录敏感词检测日志
        forbidden_words = [w for w in found_words if w['level'] == 2]
        warning_words = [w for w in found_words if w['level'] == 1]
        
        if forbidden_words:
            # 禁止级别敏感词 - 拒绝修改
            word_list = ", ".join([w['word'] for w in forbidden_words])
            raise HTTPException(
                status_code=400, 
                detail=f"登录名包含禁止使用的敏感词：{word_list}，请修改后重试"
            )
        elif warning_words:
            # 警告级别敏感词 - 允许但记录警告
            word_list = ", ".join([w['word'] for w in warning_words])
            # 继续执行修改，但可以在日志中记录
    
    # 检查修改次数限制
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年
    if current_user.login_name_modify_time < one_year_ago:
        # 重置修改次数
        current_user.login_name_modify_count = 0
    
    # 检查是否超过修改次数限制
    if current_user.login_name_modify_count >= 4:
        raise HTTPException(status_code=400, detail="一年最多只能修改4次登录名")
    
    # 更新登录名
    current_user.login_name = request.new_login_name
    current_user.login_name_modify_count += 1
    current_user.login_name_modify_time = current_time
    current_user.update_time = current_time  # 手动更新 update_time
    
    db.commit()
    db.refresh(current_user)
    
    return UpdateLoginNameResponse(data={"login_name": current_user.login_name, "modify_count": current_user.login_name_modify_count})

class UpdateUserInfoRequest(BaseModel):
    nickname: str | None = Field(None, min_length=1, max_length=20, description="昵称")
    last_name: str | None = Field(None, min_length=1, max_length=10, description="姓")
    first_name: str | None = Field(None, min_length=1, max_length=10, description="名")
    email: str | None = Field(None, pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description="邮箱地址")
    gender: int | None = Field(None, ge=0, le=2, description="性别：0=男, 1=女, 2=保密")

class UpdateUserInfoResponse(BaseModel):
    code: int = 200
    msg: str = "用户信息更新成功"
    data: dict

@router.post("/update_user_info", response_model=UpdateUserInfoResponse)
async def update_user_info(
    request: UpdateUserInfoRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None, description="Bearer Token")
):
    """
    更新用户信息
    """
    from app.utils.token import decode_access_token
    
    # 验证Token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    # 获取当前用户
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    # 更新用户信息
    if request.nickname:
        # 检查昵称修改次数限制（每年最多12次）
        import time
        current_time = int(time.time())
        one_year_ago = current_time - 365 * 24 * 3600
        
        # 如果是第一次修改或者已经过了一年，重置修改次数
        if current_user.nickname_modify_time < one_year_ago:
            current_user.nickname_modify_count = 0
        
        # 检查修改次数限制
        if current_user.nickname_modify_count >= 12:
            raise HTTPException(status_code=400, detail="一年最多只能修改12次昵称")
        
        # 敏感词检测
        from app.utils.sensitive_word_filter import create_filter
        filter = create_filter(db)
        is_safe, found_words = filter.check(request.nickname)
        
        if not is_safe:
            # 记录敏感词检测日志
            forbidden_words = [w for w in found_words if w['level'] == 2]
            warning_words = [w for w in found_words if w['level'] == 1]
            
            if forbidden_words:
                # 禁止级别敏感词 - 拒绝修改
                word_list = ", ".join([w['word'] for w in forbidden_words])
                raise HTTPException(
                    status_code=400, 
                    detail=f"昵称包含禁止使用的敏感词：{word_list}，请修改后重试"
                )
            elif warning_words:
                # 警告级别敏感词 - 允许但记录警告
                word_list = ", ".join([w['word'] for w in warning_words])
                # 继续执行修改，但可以在日志中记录
        
        current_user.nickname = request.nickname
        current_user.nickname_modify_count += 1
        current_user.nickname_modify_time = current_time
    
    if request.email:
        # 检查邮箱是否已被其他用户使用
        if db.query(User).filter(User.email == request.email, User.id != current_user.id).first():
            raise HTTPException(status_code=400, detail="邮箱已被使用")
        current_user.email = request.email
    
    if request.gender is not None:
        current_user.gender = request.gender
    
    # 更新姓名字段
    if request.last_name is not None:
        import time
        current_time = int(time.time())
        one_year_ago = current_time - 365 * 24 * 3600
        
        # 如果是第一次修改或者已经过了一年，重置修改次数
        if current_user.name_modify_time < one_year_ago:
            current_user.name_modify_count = 0
        
        # 检查姓名修改次数限制（每年最多2次）
        if current_user.name_modify_count >= 2:
            raise HTTPException(status_code=400, detail="一年最多只能修改2次姓名")
        
        current_user.last_name = request.last_name
        current_user.first_name = request.first_name
        current_user.name_modify_count += 1
        current_user.name_modify_time = current_time
    
    # 更新性别字段
    if request.gender is not None:
        import time
        current_time = int(time.time())
        one_year_ago = current_time - 365 * 24 * 3600
        
        # 如果是第一次修改或者已经过了一年，重置修改次数
        if current_user.gender_modify_time < one_year_ago:
            current_user.gender_modify_count = 0
        
        # 检查性别修改次数限制（每年最多2次）
        if current_user.gender_modify_count >= 2:
            raise HTTPException(status_code=400, detail="一年最多只能修改2次性别")
        
        current_user.gender = request.gender
        current_user.gender_modify_count += 1
        current_user.gender_modify_time = current_time
    
    # 如果有任何信息被修改，手动更新 update_time
    if request.nickname or request.email or request.gender is not None or request.last_name or request.first_name:
        import time
        current_user.update_time = int(time.time())
    
    db.commit()
    db.refresh(current_user)
    
    return UpdateUserInfoResponse(
        data={
            "nickname": current_user.nickname,
            "last_name": current_user.last_name,
            "first_name": current_user.first_name,
            "email": mask_email(current_user.email) if current_user.email else None,
            "gender": current_user.gender
        }
    )


@router.get("/get_nickname_limit_info", response_model=dict)
async def get_nickname_limit_info(
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """获取昵称修改限制信息"""
    from app.utils.token import decode_access_token
    from app.utils.response_formatter import create_success_response
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    import time
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年，重置修改次数
    if current_user.nickname_modify_time < one_year_ago:
        current_user.nickname_modify_count = 0
        db.commit()
        db.refresh(current_user)
    
    return create_success_response({
        "nickname_modify_count": current_user.nickname_modify_count,
        "nickname_modify_time": current_user.nickname_modify_time,
        "remaining_count": max(0, 12 - current_user.nickname_modify_count)
    })


@router.get("/get_login_name_limit_info", response_model=dict)
async def get_login_name_limit_info(
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """获取登录名修改限制信息"""
    from app.utils.token import decode_access_token
    from app.utils.response_formatter import create_success_response
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    import time
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年，重置修改次数
    if current_user.login_name_modify_time < one_year_ago:
        current_user.login_name_modify_count = 0
        db.commit()
        db.refresh(current_user)
    
    return create_success_response({
        "login_name_modify_count": current_user.login_name_modify_count,
        "login_name_modify_time": current_user.login_name_modify_time,
        "remaining_count": max(0, 4 - current_user.login_name_modify_count)
    })


@router.get("/get_name_limit_info", response_model=dict)
async def get_name_limit_info(
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """获取姓名修改限制信息"""
    from app.utils.token import decode_access_token
    from app.utils.response_formatter import create_success_response
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    import time
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年，重置修改次数
    if current_user.name_modify_time < one_year_ago:
        current_user.name_modify_count = 0
        db.commit()
        db.refresh(current_user)
    
    return create_success_response({
        "name_modify_count": current_user.name_modify_count,
        "name_modify_time": current_user.name_modify_time,
        "remaining_count": max(0, 2 - current_user.name_modify_count)
    })


@router.get("/get_gender_limit_info", response_model=dict)
async def get_gender_limit_info(
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """获取性别修改限制信息"""
    from app.utils.token import decode_access_token
    from app.utils.response_formatter import create_success_response
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    import time
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年，重置修改次数
    if current_user.gender_modify_time < one_year_ago:
        current_user.gender_modify_count = 0
        db.commit()
        db.refresh(current_user)
    
    return create_success_response({
        "gender_modify_count": current_user.gender_modify_count,
        "gender_modify_time": current_user.gender_modify_time,
        "remaining_count": max(0, 2 - current_user.gender_modify_count)
    })


@router.get("/get_birth_time_limit_info", response_model=dict)
async def get_birth_time_limit_info(
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """获取生时修改限制信息"""
    from app.utils.token import decode_access_token
    from app.utils.response_formatter import create_success_response
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    import time
    current_time = int(time.time())
    one_year_ago = current_time - 365 * 24 * 3600
    
    # 如果是第一次修改或者已经过了一年，重置修改次数
    if current_user.birth_time_modify_time < one_year_ago:
        current_user.birth_time_modify_count = 0
        db.commit()
        db.refresh(current_user)
    
    return create_success_response({
        "birth_time_modify_count": current_user.birth_time_modify_count,
        "birth_time_modify_time": current_user.birth_time_modify_time,
        "remaining_count": max(0, 2 - current_user.birth_time_modify_count)
    })


@router.post("/upload_avatar", response_model=UploadAvatarResponse)
def upload_avatar(
    file: UploadFile = None,
    authorization: str = Header(None, description="Bearer Token"),
    db: Session = Depends(get_db)
):
    """
    上传用户头像
    """
    from app.utils.token import decode_access_token
    
    # 验证Token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证信息")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="无效的Token")
    
    # 获取当前用户
    current_user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    # 检查是否上传了文件
    if not file:
        raise HTTPException(status_code=400, detail="请选择要上传的文件")
    
    # 处理文件上传
    is_valid, result = save_uploaded_file(file)
    if not is_valid:
        raise HTTPException(status_code=400, detail=result)
    
    # 保存头像路径
    import time
    current_user.avatar = get_file_url(result)
    current_user.update_time = int(time.time())  # 手动更新 update_time
    db.commit()
    db.refresh(current_user)
    
    return UploadAvatarResponse(data={"avatar": current_user.avatar})

# backend/app/utils/file_upload.py 2026-02-28 10:00:00
# 功能：文件上传工具，用于处理用户头像上传

import os
import uuid
from fastapi import UploadFile, HTTPException
from typing import Tuple

# 配置
UPLOAD_DIR = "uploads"  # 上传目录
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}  # 允许的文件扩展名
MAX_FILE_SIZE = 2 * 1024 * 1024  # 最大文件大小2MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif"}  # 允许的MIME类型


def validate_file(file: UploadFile) -> Tuple[bool, str]:
    """
    验证上传的文件
    
    Args:
        file: 上传的文件
    
    Returns:
        (是否通过验证, 错误信息)
    """
    # 检查文件名
    if not file.filename:
        return False, "文件名不能为空"
    
    # 检查文件扩展名
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"不支持的文件类型，仅支持{', '.join(ALLOWED_EXTENSIONS)}"
    
    # 检查MIME类型
    if file.content_type not in ALLOWED_MIME_TYPES:
        return False, f"不支持的文件类型，仅支持{', '.join(ALLOWED_MIME_TYPES)}"
    
    # 检查文件大小
    file.file.seek(0, 2)  # 移动到文件末尾
    file_size = file.file.tell()
    file.file.seek(0)  # 重置文件指针
    
    if file_size > MAX_FILE_SIZE:
        return False, f"文件大小超过限制（最大{MAX_FILE_SIZE // (1024 * 1024)}MB）"
    
    return True, ""


def save_uploaded_file(file: UploadFile, subfolder: str = "avatars") -> Tuple[bool, str]:
    """
    保存上传的文件
    
    Args:
        file: 上传的文件
        subfolder: 子文件夹名称
    
    Returns:
        (是否成功, 文件路径或错误信息)
    """
    try:
        # 验证文件
        is_valid, error_msg = validate_file(file)
        if not is_valid:
            return False, error_msg
        
        # 生成唯一文件名
        file_ext = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        
        # 创建上传目录
        upload_path = os.path.join(UPLOAD_DIR, subfolder)
        os.makedirs(upload_path, exist_ok=True)
        
        # 保存文件
        file_path = os.path.join(upload_path, unique_filename)
        content = file.file.read()
        with open(file_path, 'wb') as f:
            f.write(content)
        
        # 返回相对路径
        relative_path = os.path.join(subfolder, unique_filename).replace("\\", "/")
        return True, relative_path
    
    except Exception as e:
        return False, f"文件保存失败：{str(e)}"


def get_file_url(file_path: str, base_url: str = "http://localhost:8000") -> str:
    """
    获取文件访问URL
    
    Args:
        file_path: 文件相对路径
        base_url: 基础URL
    
    Returns:
        文件访问URL
    """
    return f"{base_url}/static/{file_path}"


def delete_file(file_path: str) -> bool:
    """
    删除文件
    
    Args:
        file_path: 文件相对路径
    
    Returns:
        是否删除成功
    """
    try:
        full_path = os.path.join(UPLOAD_DIR, file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
    except Exception as e:
        print(f"删除文件失败：{str(e)}")
        return False
#!/usr/bin/env python3
# 测试文件上传工具的get_file_url函数

from app.utils.file_upload import get_file_url

# 测试get_file_url函数
def test_get_file_url():
    print("测试get_file_url函数...")
    
    # 测试默认情况
    file_path = "avatars/test_avatar.png"
    url = get_file_url(file_path)
    print(f"生成的URL: {url}")
    
    # 检查URL是否使用了正确的生产环境地址
    if "115.191.48.226" in url:
        print("✅ 头像URL使用了正确的生产环境地址")
    else:
        print("❌ 头像URL未使用正确的生产环境地址")
    
    # 测试自定义base_url
    custom_url = get_file_url(file_path, "http://custom-domain.com")
    print(f"自定义base_url生成的URL: {custom_url}")

if __name__ == "__main__":
    test_get_file_url()

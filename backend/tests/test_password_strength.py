from app.utils.password import check_password_strength

# 测试不同强度的密码
test_passwords = [
    '12345',      # 太短
    '123456',     # 刚好6位，数字
    'abc123',     # 6位，字母+数字
    'ABC123',     # 6位，大写字母+数字
    'aBc123',     # 6位，大小写字母+数字
    'aBc_123',    # 7位，包含下划线
    'aBc1234',    # 8位，大小写字母+数字
    'aBc_1234',   # 8位，大小写字母+数字+下划线
    '1234567890', # 10位，纯数字
    'abcdefghij', # 10位，纯字母
]

print('密码强度测试结果：')
print('=' * 50)
for password in test_passwords:
    result = check_password_strength(password)
    print(f'密码: {password:<10} 强度: {result["level"]:<4} 分数: {result["score"]:<3} 提示: {result["message"]}')

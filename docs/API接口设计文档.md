# 用户注册/登录功能扩展与优化 API接口设计文档

## 一、API版本控制

- **API基础路径**：`/api`
- **版本**：
  - v1：现有接口
  - v2：新增接口

## 二、现有API接口

### 2.1 发送验证码

- **路径**：`/api/v1/user/send_code`
- **方法**：POST
- **功能**：发送手机验证码
- **请求参数**：
  ```json
  {
    "phone": "13800138000"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "验证码发送成功",
    "data": null
  }
  ```

### 2.2 用户注册

- **路径**：`/api/v1/user/register`
- **方法**：POST
- **功能**：手机号注册
- **请求参数**：
  ```json
  {
    "phone": "13800138000",
    "code": "123456",
    "password": "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "注册成功",
    "data": {"user_id": 1}
  }
  ```

### 2.3 用户登录

- **路径**：`/api/v1/user/login`
- **方法**：POST
- **功能**：手机号登录（支持验证码或密码）
- **请求参数**：
  ```json
  {
    "phone": "13800138000",
    "code": "123456", // 或 password: "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token",
      "user_id": 1,
      "phone": "13800138000"
    }
  }
  ```

## 三、新增API接口

### 3.1 验证码接口

#### 3.1.1 发送邮箱验证码

- **路径**：`/api/v2/verify-code/email`
- **方法**：POST
- **功能**：发送邮箱验证码
- **请求参数**：
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "验证码发送成功",
    "data": null
  }
  ```

### 3.2 注册接口

#### 3.2.1 邮箱注册

- **路径**：`/api/v2/register/email`
- **方法**：POST
- **功能**：邮箱+验证码注册
- **请求参数**：
  ```json
  {
    "email": "user@example.com",
    "code": "123456",
    "login_name": "user123", // 可选，不填则自动生成
    "password": "password123",
    "password_confirm": "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "注册成功",
    "data": {
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123"
    }
  }
  ```

#### 3.2.2 微信注册

- **路径**：`/api/v2/register/wechat`
- **方法**：POST
- **功能**：微信扫码注册
- **请求参数**：
  ```json
  {
    "wechat_openid": "openid123",
    "login_name": "user123", // 可选，不填则自动生成
    "phone": "13800138000", // 可选，与email二选一
    "email": "user@example.com" // 可选，与phone二选一
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "注册成功",
    "data": {
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123",
      "token": "jwt_token"
    }
  }
  ```

### 3.3 登录接口

#### 3.3.1 登录名登录

- **路径**：`/api/v2/login/login-name`
- **方法**：POST
- **功能**：登录名+密码登录
- **请求参数**：
  ```json
  {
    "login_name": "user123",
    "password": "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token",
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "138****0000",
      "email": "user@example.com"
    }
  }
  ```

#### 3.3.2 邮箱登录

- **路径**：`/api/v2/login/email`
- **方法**：POST
- **功能**：邮箱+密码登录
- **请求参数**：
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token",
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "138****0000",
      "email": "user@example.com"
    }
  }
  ```

#### 3.3.3 手机登录

- **路径**：`/api/v2/login/phone`
- **方法**：POST
- **功能**：手机+密码登录
- **请求参数**：
  ```json
  {
    "phone": "13800138000",
    "password": "password123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token",
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "138****0000",
      "email": "user@example.com"
    }
  }
  ```

#### 3.3.4 微信登录

- **路径**：`/api/v2/login/wechat`
- **方法**：POST
- **功能**：微信扫码登录
- **请求参数**：
  ```json
  {
    "wechat_openid": "openid123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token",
      "user_id": 1,
      "login_name": "user123",
      "nickname": "user123",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "138****0000",
      "email": "user@example.com"
    }
  }
  ```

### 3.4 用户信息接口

#### 3.4.1 老用户完善登录名

- **路径**：`/api/v2/user/perfect-login-name`
- **方法**：POST
- **功能**：老用户完善登录名
- **请求参数**：
  ```json
  {
    "login_name": "user123"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "登录名完善成功",
    "data": {
      "login_name": "user123",
      "nickname": "user123"
    }
  }
  ```

#### 3.4.2 修改昵称

- **路径**：`/api/v2/user/update-nickname`
- **方法**：POST
- **功能**：修改用户昵称
- **请求参数**：
  ```json
  {
    "nickname": "新昵称"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "昵称修改成功",
    "data": {
      "nickname": "新昵称"
    }
  }
  ```

#### 3.4.3 微信解绑

- **路径**：`/api/v2/user/unbind-wechat`
- **方法**：POST
- **功能**：解除微信账号绑定
- **请求参数**：
  ```json
  {
    "password": "password123" // 或 code: "123456"
  }
  ```
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "微信解绑成功",
    "data": null
  }
  ```

#### 3.4.4 头像上传

- **路径**：`/api/v2/user/upload-avatar`
- **方法**：POST
- **功能**：上传用户头像
- **请求参数**：
  - FormData格式，包含文件字段 `avatar`
- **响应**：
  ```json
  {
    "code": 200,
    "msg": "头像上传成功",
    "data": {
      "avatar_url": "https://example.com/avatar.jpg"
    }
  }
  ```

## 四、请求/响应格式

### 4.1 通用请求格式

- **Content-Type**：`application/json`
- **Authorization**：Bearer token（需要认证的接口）

### 4.2 通用响应格式

```json
{
  "code": 200, // 状态码
  "msg": "操作成功", // 消息
  "data": {} // 数据
}
```

### 4.3 错误响应格式

```json
{
  "code": 400, // 错误码
  "msg": "错误信息", // 错误消息
  "data": null // 数据
}
```

## 五、接口权限

| 接口类型 | 权限要求 | 认证方式 |
|---------|----------|----------|
| 公开接口 | 无需认证 | 无 |
| 注册接口 | 无需认证 | 无 |
| 登录接口 | 无需认证 | 无 |
| 验证码接口 | 无需认证 | 无 |
| 用户信息接口 | 需要认证 | JWT token |

## 六、速率限制

- **验证码发送**：每60秒可发送一次，单日最多5次
- **登录尝试**：连续5次密码错误，锁定账号15分钟
- **注册尝试**：每IP每分钟最多5次注册请求

## 七、安全措施

- **密码加密**：使用bcrypt算法加密存储
- **敏感信息**：接口返回时隐藏敏感信息
- **参数验证**：所有参数进行严格验证
- **防SQL注入**：使用ORM框架，避免直接拼接SQL
- **防XSS攻击**：对输入进行过滤

## 八、结论

本次API接口设计方案覆盖了所有新增功能，包括多渠道注册/登录、用户信息管理等。通过合理的版本控制和权限管理，确保接口的安全性和可扩展性。同时，通过统一的请求/响应格式，提高了接口的一致性和可维护性。

**编制日期**：2026-02-28
**编制人**：项目组
**审核人**：项目负责人
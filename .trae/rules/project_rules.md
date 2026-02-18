# 项目技术依赖规则

## 前端依赖规则
### 核心框架
- 使用React 18+ 与 ReactDOM 18+ 作为前端页面渲染核心。

### UI组件库
- 可选用Ant Design或Element React，用于提供表单、时间选择器、按钮等UI组件。

### 辅助工具
- 使用dayjs进行起卦时间格式化与干支计算。

### 状态管理
- 采用React Context进行黑白模式全局状态管理。
- 配置方式：使用原生React API，无需额外安装。

### 构建/预览
- 使用TRAE内置Web Server进行本地预览和热更新。

### 临时测试文件
- 前端所有用于临时测试的代码文件，统一保存到前端项目目录下的`test`文件夹中。

### 说明文档文件
- 前端所有用于说明和说明文档的代码文件，统一保存到前端项目目录下的`docs`文件夹中。

## 前端样式设计规则
### 设计原则
- 前端样式设计仅针对桌面端浏览器优化，不包含响应式设计。
- 移动端将开发独立的样式系统，与桌面端分离。

### 技术要求
- 禁止使用@media查询进行响应式适配。
- 禁止使用`@media (max-width: 1023px)`、`@media (max-width: 768px)`、`@media (max-width: 480px)`等屏幕宽度响应式。
- 禁止使用`@media (prefers-color-scheme: dark)`等颜色主题响应式。
- 允许使用视口单位（vh、vw）进行布局。
- 允许使用rem单位进行统一的字体和间距管理。

### CSS文件规范
- CSS文件命名必须采用驼峰命名法，首字母大写。
  示例：`UserProfile.css`, `DataProcessor.css`
- CSS文件名不得包含响应式相关词汇，如`responsive`、`mobile`、`adaptive`等。
- CSS注释中不得包含"响应式"、"移动端"、"平板端"等词汇。

### 代码审查检查点
- 检查CSS文件中是否存在@media查询。
- 检查CSS文件中是否存在响应式注释。
- 检查CSS文件名是否包含响应式相关词汇。
- 确保所有样式仅针对桌面端浏览器优化。

### 测试验证
- 仅测试桌面端浏览器（Chrome、Firefox、Edge、Safari）。
- 不测试移动端设备（手机、平板）。
- 不测试不同屏幕尺寸的适配。

## 后端依赖规则
### 运行环境
- 使用Python作为后端代码运行核心。

### 核心库
- 使用flask作为轻量级Web框架，提供排卦接口。

### 辅助库
- 使用lunar - python进行公历转干支、时辰判断等排卦核心逻辑处理。

### 跨域支持
- 使用flask - cors解决前端调用后端接口的跨域问题。

### 部署
- 使用TRAE内置WSGI服务器进行后端接口部署和端口映射。

### 临时测试文件
- 后端所有用于临时测试的代码文件，统一保存到后端项目目录下的`test`文件夹中。

### 说明文档文件
- 后端所有用于说明和说明文档的代码文件，统一保存到后端项目目录下的`docs`文件夹中。

## 命名规范
- 所有变量名必须采用驼峰命名法（CamelCase），首字母小写，后续单词首字母大写。
  示例：`userName`, `totalCount`, `isActive`
- 常量名必须全部大写，单词之间用下划线分隔。
  示例：`MAX_COUNT`, `DEFAULT_TIMEOUT`
- 类名必须采用驼峰命名法，首字母大写。
  示例：`UserProfile`, `DataProcessor`
- 函数名必须采用驼峰命名法，首字母小写。
  示例：`calculateTotal`, `validateInput`
- js文件名必须采用驼峰命名法，首字母小写。
  示例：`calculateTotal.js`, `validateInput.js`
- 前端文件名必须采用驼峰命名法，首字母大写。
  示例：`UserProfile.jsx`, `DataProcessor.jsx`
- 后端文件名必须采用小写字母，单词之间用下划线分隔。
  示例：`user_profile.py`, `data_processor.py` 

## 注释规范
- 文件注释：
  -每个文件的顶部必须添加注释，注释内容必须包含文件名、功能描述、作者、创建时间、最后修改时间和版权信息。
  示例：
/*
 * @file            frontend/src/reset.css
 * @description     全局CSS Reset和基础标准设置，1rem = 16px
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-16 11:19:08
 * @lastModified    2026-02-16 11:24:11
 * Copyright © All rights reserved
*/
  -JSX 文件中，注释格式需要遵循 JavaScript 和 JSX 的语法规则，主要有两种常用方式：
    1.单行注释 在 JSX 代码的 JavaScript 逻辑部分（如函数内、变量定义处），使用 // 进行单行注释；
      示例：
      // 这是一个行内注释
    2.多行注释 在 JSX 标签内部或跨多行的注释，必须用 {/* ... */} 包裹（因为 JSX 会解析 HTML 风格的 <!-- --> 为文本，而非注释）；
      示例：
      {/* 这是一个多行注释 */}
      {/*
      * @description     这是一个块级注释
      * @param           {string}    param1    这是一个参数
      * @return          {object}             这是一个返回值
      */}
      3. 格式细节
        - 行尾注释 ：代码与注释之间隔一个空格
        - 代码行上方注释 ：独占一行
        - 复杂逻辑 ：上方注释 + 行尾注释结合使用


### CSS Modules
- 所有前端组件的CSS样式必须采用CSS Modules进行管理，文件名必须与组件文件名相同，后缀为.module.css。
- 组件的CSS类名必须采用驼峰命名法，首字母大写。
- 组件的CSS类名必须在组件文件中引入，不能在全局样式文件中引入。
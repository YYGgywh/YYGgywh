# 文件头部注释规范

## 描述
项目中所有文件都应在头部添加注释，说明文件相关信息，确保代码可维护性和可读性，便于团队成员理解文件用途、作者、创建及修改时间等内容。

## 注释格式要求
所有文件头部需使用多行注释形式，内容包括文件路径、功能描述、作者、创建时间、最后修改时间等信息。示例格式如下：
```javascript/jsx
/*
 * @file            文件相对项目根目录的路径
 * @description     文件功能描述
 * @author          作者姓名及联系方式
 * @createTime      创建时间，格式为YYYY-MM-DD HH:mm:ss
 * @lastModified    最后修改时间，格式为YYYY-MM-DD HH:mm:ss
 * Copyright © All rights reserved
*/

```CSS/SCSS
/*
 * @file            文件相对项目根目录的路径
 * @description     文件功能描述
 * @author          作者姓名及联系方式
 * @createTime      创建时间，格式为YYYY-MM-DD HH:mm:ss
 * @lastModified    最后修改时间，格式为YYYY-MM-DD HH:mm:ss
 * Copyright © All rights reserved
*/

``` python
"""
 * @file            文件相对项目根目录的路径
 * @description     文件功能描述
 * @author          作者姓名及联系方式
 * @createTime      创建时间，格式为YYYY-MM-DD HH:mm:ss
 * @lastModified    最后修改时间，格式为YYYY-MM-DD HH:mm:ss
 * Copyright © All rights reserved
"""

 - 注意,不同文件格式对注释格式的要求。

## 生效文件范围
alwaysApply: true
globs: ["*.js", "*.jsx", "*.css", "*.md", "*.py"]  // 对所有 JavaScript、JSX、CSS、Markdown、Python 文件生效
# 项目 CSS 开发规范文档

## 1. 文件组织
- **CSS Modules 结构**：采用模块化组织方式，每个组件对应独立的 CSS 文件
- **命名规则**：文件名使用 PascalCase 格式，与组件名保持一致（如：Button.module.css）
- **文件头注释**：包含文件用途、创建日期、作者信息，格式如下：
  ```css
    /*
    * @file            文件相对项目根目录的路径
    * @description     文件功能描述
    * @author          作者姓名及联系方式
    * @createTime      创建时间，格式为YYYY-MM-DD HH:mm:ss
    * @lastModified    最后修改时间，格式为YYYY-MM-DD HH:mm:ss
    * Copyright © All rights reserved
    */
  ```

## 2. 选择器规范
- **命名规则**：采用小驼峰命名法（camelCase），如：`buttonPrimary`、`userAvatar`
- **组织顺序**：按「基础样式 → 状态样式 → 子元素样式」顺序组织
- **选择器层级**：避免超过3级嵌套，优先使用直接子选择器（>）

## 3. CSS 变量
- **定义层级**：
  - 全局变量：`src/styles/variables.css`
  - 组件变量：在组件 CSS 文件顶部定义
- **命名规范**：使用 kebab-case，前缀区分作用域，如：`--global-primary-color`
- **全局变量引用**：通过 `@import` 引入全局变量文件，统一使用变量而非硬编码值

## 4. 注释规范
- **区块注释**：使用 `/* */` 包裹，用于描述组件或大功能区块
  ```css
  /* 主要内容区域样式 */
  .contentArea { ... }
  ```
- **行内注释**：使用 `/* 注释内容 */`，位于被注释代码上方
  ```css
  /* 修复iOS下按钮点击闪烁问题 */
  -webkit-tap-highlight-color: transparent;
  ```

## 5. 响应式设计
- **文件分离**：基础样式与响应式样式分离，响应式部分统一放在文件底部
- **移动端适配**：
  - 使用 `@media` 查询，按「移动端优先」原则设计
  - 断点设置：`@media (min-width: 768px)`、`@media (min-width: 1024px)`
  - 避免使用固定像素宽度，优先使用百分比和弹性布局

## 6. 样式结构
- **标准模板**：
  ```css
  /* 文件头注释 */
  @import 'variables.css';
  
  /* 组件基础样式 */
  .componentName { ... }
  
  /* 状态样式 */
  .componentName.active { ... }
  
  /* 子元素样式 */
  .componentName > .childElement { ... }
  
  /* 响应式样式 */
  @media (min-width: 768px) { ... }
  ```
- **属性组织顺序**：按「布局 → 盒模型 → 视觉 → 其他」顺序排列

## 7. 单位标准
- **推荐单位**：
  - 尺寸：`rem`（根元素相对单位）、`px`（固定尺寸）
  - 间距：`rem` 或 `px`
  - 百分比：用于宽度、高度等相对尺寸
- **避免使用**：`em`（易产生嵌套计算问题）、`pt`（打印单位）

## 8. 颜色定义
- **变量使用**：所有颜色必须使用 CSS 变量定义，禁止直接使用色值
- **常用颜色映射**：
  - 主色：`--global-primary-color`
  - 辅助色：`--global-secondary-color`
  - 文本色：`--global-text-color`、`--global-text-secondary`
  - 背景色：`--global-bg-color`、`--global-bg-secondary`

## 9. 特殊处理
- **Flex 布局**：统一使用 `display: flex`，避免使用旧版语法
- **按钮样式**：
  - 定义基础按钮类，通过修饰类扩展样式
  - 包含默认、 hover、active、disabled 状态
- **阴影效果**：使用预定义阴影变量，如 `--global-shadow-sm`、`--global-shadow-md`

## 10. 最佳实践
- **代码复用**：提取公共样式为 mixin 或基础类
- **避免嵌套**：减少选择器嵌套，保持层级简洁
- **状态管理**：使用 BEM 命名规范表示状态（如：`button--active`）
- **性能优化**：避免使用通配符选择器，减少样式计算复杂度

## 11. 检查清单
- 创建 CSS 文件时确认：
  - 文件命名符合规范
  - 已添加文件头注释
  - 引入全局变量文件
  - 使用 CSS Modules 语法
  - 颜色、单位使用符合规范
  - 响应式适配已考虑
  - 无冗余或未使用的样式代码
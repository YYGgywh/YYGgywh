# 项目样式开发规范（CSS Modules 专用版）

## 一、规范目的
统一项目样式开发方式，采用 **CSS Modules** 实现样式隔离，避免类名冲突，简化组件间样式差异化适配，降低维护成本。

## 二、核心原则
1. **组件私有样式必用 CSS Modules**，全局公共样式用传统 CSS；
2. **极简适配**，优先通过 CSS 变量实现样式差异化，减少复杂选择器；
3. **命名清晰**，类名与变量名见名知意，无冗余。

## 三、文件命名规则
1. **组件样式文件**：与组件同名，后缀为 `.module.css`，例：`AAA.jsx` 对应 `AAA.module.css`；
2. **全局样式文件**：使用普通 CSS 后缀，例：`global.css`（重置样式）、`common.css`（通用类名）；
3. **第三方样式覆盖文件**：命名为 `custom-[插件名].css`，例：`custom-antd.css`。

## 四、类名使用规则
1. **组件私有类名**：在 `.module.css` 中定义，JSX 中通过 `styles.类名` 引用，例：

   ```CSS
   /* AAA.module.css */
   .root { padding: 8px; }
   .content { font-size: 14px; }
   ```

   ```JavaScript
   // AAA.jsx
   <div className={styles.root}><div className={styles.content}>内容</div></div>
   ```

2. **类名命名**：采用  **短横线** 或**小驼峰**，仅包含字母/数字，例：`btn-primary`、`cardTitle`，禁止无意义命名（如 `div1`、`box`）；
3. **类名透传**：可复用组件需预留 `className` 属性，合并私有类名与父组件传参，例：

   ```JavaScript
   const AAA = ({ className }) => (
     <div className={`${styles.root} ${className || ''}`}>内容</div>
   );
   ```

4. **全局类名**：仅在普通 CSS 文件中定义（如 `.flex`、`.text-center`），JSX 中直接以字符串引用，无需 `styles`。

## 五、样式差异化适配规则（核心）
1. **默认值定义**：组件内可差异化的样式，通过 **CSS 变量** 在组件根类名中设置默认值，例：

   ```CSS
   /* AAA.module.css */
   .root {
     --text-size: 10px;
     --text-weight: normal;
   }
   .content {
     font-size: var(--text-size);
     font-weight: var(--text-weight);
   }
   ```

2. **父组件覆盖**：父组件通过传参类名，重定义 CSS 变量，无需使用复杂选择器，例：

   ```CSS
   /* BBB.module.css */
   .customCard { --text-size: 20px; }
   ```

   ```JavaScript
   // BBB.jsx
   <AAA className={styles.customCard} />
   ```

3. **特殊覆盖**：仅在未定义 CSS 变量时，使用 `:global()` 定位子组件原始类名，例：

   ```CSS
   /* BBB.module.css */
   .root :global(.content) { color: red; }
   ```

## 六、全局样式管理规则
1. **全局样式范围**：仅包含浏览器重置、body/html 基础样式、全局通用类名，禁止写入组件私有样式；
2. **引入方式**：全局 CSS 文件在项目入口（如 `index.js`）一次性引入，无需在组件内重复引入。

## 七、调试与兼容规则
1. **调试优化**：保持打包工具默认配置，使哈希类名包含「组件名+原类名」，便于调试；
2. **兼容性**：CSS Modules 编译后为原生 CSS，无兼容问题；CSS 变量不兼容 IE，项目无需适配 IE。

## 八、桌面端与移动端适配规则
1. 样式文件分离：桌面端样式与移动端样式分别编写，通过媒体查询实现差异化加载。
2. 文件名命名规范，组件样式文件命名遵循「组件名 + 设备标识 + .module.css」格式：
   - 桌面端样式文件：`组件名.desktop.module.css`；
   - 移动端样式文件：`组件名.mobile.module.css`；
3. 设备标识统一用小写：桌面端为desktop/pc、移动端为mobile/m，项目内二选一且全程统一；
4. 组件名与对应 JSX 组件名一致，无多余前缀 / 后缀；
5. 全局样式文件命名为「用途+设备标识+.css」，通用样式不加设备标识。

# 生成范围
alwaysApply: true
globs: ["**/*.module.css"]  // 仅对 CSS Modules 文件生效
# LiuYao 组件抽离与 CSS Modules 改造实施计划

## 文档信息

- **文档名称**: LiuYao 组件抽离与 CSS Modules 改造实施计划
- **创建时间**: 2026-03-08 17:00:00
- **最后修改**: 2026-03-08 17:00:00
- **适用范围**: frontend/src/components/LiuYao 目录下所有组件
- **优先级**: 高

---

## 一、项目背景与目标

### 1.1 当前问题分析

通过对 `frontend/src/components/LiuYao` 目录下三个文件夹的全面代码审查，发现以下主要问题：

#### 1.1.1 样式耦合严重

```
LiuYaoQiGua.css（共享样式文件）
├── .method-content     ← MethodContent 使用
├── .method-sidebar     ← NavigationSidebar 使用（已改造）
├── .yao-display        ← 所有方法组件使用
├── .yao-item           ← 所有方法组件使用
├── .throw-button       ← 所有方法组件使用
├── .reset-button       ← 所有方法组件使用
└── ... 其他共享样式
```

**问题影响**:
- 修改一个组件样式可能影响其他组件
- 样式冲突难以定位和解决
- 不利于主题切换和样式定制

#### 1.1.2 代码重复严重

| 重复元素 | 出现次数 | 所在文件 |
|---------|---------|---------|
| 爻位输入框 (YaoInput) | 12次 | StepByStepMethod, OneClickMethod |
| 阴阳选择按钮 (YaoButton) | 12次 | SpecifiedMethod |
| 操作按钮 (ActionButton) | 8次 | 所有方法组件 |
| 爻位展示项 (YaoItem) | 6次 | 所有方法组件 |
| 方法说明区域 | 4次 | 所有方法组件 |

#### 1.1.3 单一职责原则违反

- **StepByStepMethod**: 包含UI渲染、状态管理、事件处理、样式定义
- **SpecifiedMethod**: 包含阴阳按钮逻辑、数据处理、样式定义
- **LiuYaoQiGua**: 包含全局状态管理、子组件协调、共享样式

### 1.2 改造目标

1. **实现组件抽离**: 将可复用UI元素抽离为独立组件
2. **实现样式隔离**: 每个组件拥有独立的 CSS Modules 样式
3. **提升可维护性**: 单一职责，便于测试和修改
4. **支持主题切换**: 通过 CSS 变量实现动态主题

---

## 二、组件抽离方案

### 2.1 可抽离组件清单

#### 2.1.1 高优先级组件 (P0)

| 组件名称 | 功能描述 | 当前重复次数 | 抽离后收益 |
|---------|---------|-------------|-----------|
| **YaoInput** | 爻位输入框，支持占位符和禁用状态 | 12次 | 减少60行重复代码 |
| **YaoButton** | 阴阳选择按钮，支持三种状态切换 | 12次 | 减少100行重复代码 |

#### 2.1.2 中优先级组件 (P1)

| 组件名称 | 功能描述 | 当前重复次数 | 抽离后收益 |
|---------|---------|-------------|-----------|
| **ActionButton** | 操作按钮（投掷/重置/生成） | 8次 | 统一按钮样式和行为 |
| **YaoDisplay** | 爻位展示区域 | 6次 | 统一展示逻辑 |
| **YaoItem** | 单个爻位项（标签+输入+展示） | 6次 | 组合组件复用 |

#### 2.1.3 低优先级组件 (P2)

| 组件名称 | 功能描述 | 当前重复次数 | 抽离后收益 |
|---------|---------|-------------|-----------|
| **MethodInfo** | 方法说明区域（标题+描述+步骤） | 4次 | 统一说明样式 |
| **DivinationActions** | 操作按钮组容器 | 4次 | 统一布局 |

### 2.2 组件详细设计

#### 2.2.1 YaoInput 组件设计

**功能描述**:
- 爻位数值输入框
- 支持占位符显示（"待生成"）
- 支持禁用状态
- 支持自定义样式

**Props 接口**:
```typescript
interface YaoInputProps {
  value: string;                    // 当前值
  placeholder?: string;             // 占位符文本，默认"待生成"
  disabled?: boolean;               // 是否禁用，默认false
  isPlaceholder?: boolean;          // 是否显示占位符状态
  className?: string;               // 额外类名
}
```

**使用示例**:
```jsx
<YaoInput 
  value={yaoValues.shang}
  isPlaceholder={yaoValues.shang === '待生成'}
  disabled
/>
```

#### 2.2.2 YaoButton 组件设计

**功能描述**:
- 阴阳属性选择按钮
- 支持三种状态：未选中、选中（静）、激活（动）
- 支持点击切换
- 内置脉冲动画效果

**Props 接口**:
```typescript
interface YaoButtonProps {
  type: 'yang' | 'yin';             // 按钮类型：阳或阴
  state: YaoButtonState;            // 按钮状态
  onClick: () => void;              // 点击回调
  className?: string;               // 额外类名
}

type YaoButtonState = null | 'selected' | 'active';
```

**状态映射**:
| 状态 | 阳按钮显示 | 阴按钮显示 |
|------|-----------|-----------|
| null | 阳 | 阴 |
| selected | 静 | 静 |
| active | 动 | 动 |

**使用示例**:
```jsx
<YaoButton 
  type="yang"
  state={yaoSelections.shang}
  onClick={() => handleYaoButtonClick('shang', 'yang')}
/>
```

#### 2.2.3 ActionButton 组件设计

**功能描述**:
- 通用操作按钮
- 支持主按钮和次按钮样式
- 支持禁用状态
- 支持加载状态

**Props 接口**:
```typescript
interface ActionButtonProps {
  type: 'primary' | 'secondary';    // 按钮类型
  onClick: () => void;              // 点击回调
  disabled?: boolean;               // 是否禁用
  loading?: boolean;                // 是否加载中
  children: React.ReactNode;        // 按钮内容
  className?: string;               // 额外类名
}
```

**使用示例**:
```jsx
<ActionButton 
  type="primary"
  onClick={handleThrow}
  disabled={isButtonDisabled}
>
  {getButtonText()}
</ActionButton>
```

---

## 三、CSS Modules 改造方案

### 3.1 改造范围

#### 3.1.1 第一阶段：组件抽离 (P0)

```
frontend/src/components/LiuYao/
└── components/
    ├── YaoInput/
    │   ├── YaoInput.jsx
    │   ├── YaoInput.desktop.module.css
    │   └── YaoInput.mobile.module.css
    ├── YaoButton/
    │   ├── YaoButton.jsx
    │   ├── YaoButton.desktop.module.css
    │   └── YaoButton.mobile.module.css
    └── ActionButton/
        ├── ActionButton.jsx
        ├── ActionButton.desktop.module.css
        └── ActionButton.mobile.module.css
```

#### 3.1.2 第二阶段：方法组件改造 (P1)

```
frontend/src/components/LiuYao/methods/
├── StepByStepMethod/
│   ├── StepByStepMethod.jsx
│   ├── StepByStepMethod.desktop.module.css
│   └── StepByStepMethod.mobile.module.css
├── OneClickMethod/
│   ├── OneClickMethod.jsx
│   ├── OneClickMethod.desktop.module.css
│   └── OneClickMethod.mobile.module.css
├── NumberMethod/
│   ├── NumberMethod.jsx
│   ├── NumberMethod.desktop.module.css
│   └── NumberMethod.mobile.module.css
└── SpecifiedMethod/
    ├── SpecifiedMethod.jsx
    ├── SpecifiedMethod.desktop.module.css  （改造现有文件）
    └── SpecifiedMethod.mobile.module.css   （新建）
```

#### 3.1.3 第三阶段：容器组件改造 (P2)

```
frontend/src/components/LiuYao/
├── LiuYaoQiGua/
│   ├── LiuYaoQiGua.jsx
│   ├── LiuYaoQiGua.desktop.module.css
│   └── LiuYaoQiGua.mobile.module.css
└── components/
    └── MethodContent/
        ├── MethodContent.jsx
        ├── MethodContent.desktop.module.css
        └── MethodContent.mobile.module.css
```

### 3.2 样式变量架构

#### 3.2.1 三层变量架构

```css
/* 第一层：全局变量 (:root) */
:root {
  --primary-color: #1890ff;
  --spacing-md: 8px;
  --border-radius-md: 6px;
  /* ... 其他全局变量 */
}

/* 第二层：组件变量 */
.yaoInput {
  --yao-input-padding: var(--spacing-md, 8px);
  --yao-input-border-radius: var(--border-radius-md, 6px);
}

/* 第三层：样式属性使用 */
.yaoValue {
  padding: var(--yao-input-padding);
  border-radius: var(--yao-input-border-radius);
}
```

#### 3.2.2 组件变量命名规范

| 组件 | 变量前缀 | 示例 |
|------|---------|------|
| YaoInput | `--yao-input-*` | `--yao-input-padding` |
| YaoButton | `--yao-btn-*` | `--yao-btn-bg-color` |
| ActionButton | `--action-btn-*` | `--action-btn-primary-bg` |

---

## 四、实施步骤

### 4.1 第一阶段：组件抽离 (预计 2 周)

#### 步骤 1：创建 YaoButton 组件 (第 1-2 天)

**任务清单**:
- [ ] 创建 `components/YaoButton/` 目录
- [ ] 创建 `YaoButton.jsx` 组件文件
- [ ] 创建 `YaoButton.desktop.module.css` 桌面端样式
- [ ] 创建 `YaoButton.mobile.module.css` 移动端样式
- [ ] 从 `SpecifiedMethod.module.css` 提取按钮样式
- [ ] 添加三层变量架构
- [ ] 添加详细注释
- [ ] 编写组件使用文档

**验证标准**:
- [ ] 组件能正确渲染三种状态
- [ ] 脉冲动画正常工作
- [ ] 点击事件正确触发
- [ ] 样式与原有实现一致

#### 步骤 2：创建 YaoInput 组件 (第 3-4 天)

**任务清单**:
- [ ] 创建 `components/YaoInput/` 目录
- [ ] 创建 `YaoInput.jsx` 组件文件
- [ ] 创建 `YaoInput.desktop.module.css` 桌面端样式
- [ ] 创建 `YaoInput.mobile.module.css` 移动端样式
- [ ] 从 `LiuYaoQiGua.css` 提取输入框样式
- [ ] 添加三层变量架构
- [ ] 添加详细注释

**验证标准**:
- [ ] 占位符正确显示
- [ ] 禁用状态样式正确
- [ ] 与原有实现视觉一致

#### 步骤 3：创建 ActionButton 组件 (第 5-6 天)

**任务清单**:
- [ ] 创建 `components/ActionButton/` 目录
- [ ] 创建 `ActionButton.jsx` 组件文件
- [ ] 创建 `ActionButton.desktop.module.css` 桌面端样式
- [ ] 创建 `ActionButton.mobile.module.css` 移动端样式
- [ ] 统一按钮样式（投掷/重置/生成）
- [ ] 添加三层变量架构
- [ ] 添加详细注释

**验证标准**:
- [ ] 主按钮和次按钮样式正确
- [ ] 禁用状态样式正确
- [ ] 悬停效果正常工作

### 4.2 第二阶段：方法组件改造 (预计 2 周)

#### 步骤 4：改造 StepByStepMethod (第 7-9 天)

**任务清单**:
- [ ] 创建 `StepByStepMethod/` 目录
- [ ] 移动 `StepByStepMethod.jsx` 到新目录
- [ ] 创建 `StepByStepMethod.desktop.module.css`
- [ ] 创建 `StepByStepMethod.mobile.module.css`
- [ ] 从 `LiuYaoQiGua.css` 提取相关样式
- [ ] 替换为 CSS Modules 导入
- [ ] 使用新的 YaoInput 组件
- [ ] 使用新的 ActionButton 组件
- [ ] 添加三层变量架构
- [ ] 添加详细注释

**验证标准**:
- [ ] 组件正常渲染
- [ ] 样式与原有实现一致
- [ ] 交互功能正常
- [ ] 构建无错误

#### 步骤 5：改造 OneClickMethod (第 10-12 天)

**任务清单**:
- [ ] 创建 `OneClickMethod/` 目录
- [ ] 移动 `OneClickMethod.jsx` 到新目录
- [ ] 创建 `OneClickMethod.desktop.module.css`
- [ ] 创建 `OneClickMethod.mobile.module.css`
- [ ] 从 `LiuYaoQiGua.css` 提取相关样式
- [ ] 替换为 CSS Modules 导入
- [ ] 使用新的 YaoInput 组件
- [ ] 使用新的 ActionButton 组件
- [ ] 添加三层变量架构
- [ ] 添加详细注释

#### 步骤 6：改造 NumberMethod (第 13-15 天)

**任务清单**:
- [ ] 创建 `NumberMethod/` 目录
- [ ] 移动 `NumberMethod.jsx` 到新目录
- [ ] 创建 `NumberMethod.desktop.module.css`
- [ ] 创建 `NumberMethod.mobile.module.css`
- [ ] 从 `LiuYaoQiGua.css` 提取相关样式
- [ ] 替换为 CSS Modules 导入
- [ ] 使用新的 ActionButton 组件
- [ ] 添加三层变量架构
- [ ] 添加详细注释

#### 步骤 7：改造 SpecifiedMethod (第 16-18 天)

**任务清单**:
- [ ] 创建 `SpecifiedMethod/` 目录
- [ ] 移动 `SpecifiedMethod.jsx` 到新目录
- [ ] 重命名 `SpecifiedMethod.module.css` 为 `SpecifiedMethod.desktop.module.css`
- [ ] 创建 `SpecifiedMethod.mobile.module.css`
- [ ] 提取按钮样式到 YaoButton 组件
- [ ] 使用新的 YaoButton 组件
- [ ] 使用新的 ActionButton 组件
- [ ] 添加三层变量架构
- [ ] 添加详细注释

### 4.3 第三阶段：容器组件改造 (预计 1 周)

#### 步骤 8：改造 MethodContent (第 19-20 天)

**任务清单**:
- [ ] 创建 `components/MethodContent/` 目录
- [ ] 移动 `MethodContent.jsx` 到新目录
- [ ] 创建 `MethodContent.desktop.module.css`
- [ ] 创建 `MethodContent.mobile.module.css`
- [ ] 从 `LiuYaoQiGua.css` 提取 `.method-content` 样式
- [ ] 替换为 CSS Modules 导入
- [ ] 添加三层变量架构
- [ ] 添加详细注释

#### 步骤 9：改造 LiuYaoQiGua (第 21-23 天)

**任务清单**:
- [ ] 创建 `LiuYaoQiGua/` 目录
- [ ] 移动 `LiuYaoQiGua.jsx` 到新目录
- [ ] 创建 `LiuYaoQiGua.desktop.module.css`
- [ ] 创建 `LiuYaoQiGua.mobile.module.css`
- [ ] 从 `LiuYaoQiGua.css` 提取容器样式
- [ ] 删除 `LiuYaoQiGua.css`（共享样式文件）
- [ ] 替换为 CSS Modules 导入
- [ ] 添加三层变量架构
- [ ] 添加详细注释

#### 步骤 10：清理和验证 (第 24-25 天)

**任务清单**:
- [ ] 删除废弃的 `LiuYaoQiGua.css` 文件
- [ ] 检查所有导入路径
- [ ] 运行完整构建
- [ ] 进行功能测试
- [ ] 进行视觉回归测试
- [ ] 更新项目文档

---

## 五、代码规范

### 5.1 文件命名规范

```
组件名.jsx
组件名.desktop.module.css
组件名.mobile.module.css
```

### 5.2 类名命名规范

使用 **小驼峰命名法**:
```css
.yaoButton { }
.yaoButtonActive { }
.yaoButtonSelected { }
```

### 5.3 变量命名规范

```css
/* 组件级变量 */
--组件名-属性名: var(--全局变量, fallback值);

/* 示例 */
--yao-btn-bg-color: var(--primary-color, #1890ff);
--yao-input-padding: var(--spacing-md, 8px);
```

### 5.4 注释规范

```css
/*
 * @file            文件路径
 * @description     文件功能描述
 * @author          作者
 * @createTime      创建时间
 * @lastModified    最后修改时间
 * Copyright © All rights reserved
*/

/* ===== 组件容器 ===== */
/* 组件容器样式 - 功能描述 */
.componentName {
  /* ===== 布局变量 ===== */
  --component-padding: var(--spacing-md, 8px);
  
  /* ===== 尺寸与间距 ===== */
  padding: var(--component-padding);
}
```

---

## 六、风险评估与应对

### 6.1 潜在风险

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| 样式不一致 | 中 | 高 | 每步改造后进行视觉对比测试 |
| 功能回归 | 低 | 高 | 编写单元测试，进行全面功能测试 |
| 构建失败 | 低 | 中 | 每步改造后立即构建验证 |
| 性能下降 | 低 | 中 | 监控构建后文件大小 |

### 6.2 回滚方案

1. **Git 分支管理**: 在独立分支进行改造，可随时回滚
2. **分步提交**: 每完成一个步骤就提交，便于回滚到特定版本
3. **保留原文件**: 改造完成并验证前，保留原文件作为备份

---

## 七、预期收益

### 7.1 代码质量提升

| 指标 | 改造前 | 改造后 | 提升 |
|------|--------|--------|------|
| 重复代码行数 | ~300行 | ~50行 | 减少83% |
| 组件平均代码行数 | 200行 | 120行 | 减少40% |
| 样式文件数量 | 2个 | 15个 | 更细粒度管理 |

### 7.2 可维护性提升

- **单一职责**: 每个组件只负责一个功能
- **样式隔离**: 修改一个组件不影响其他组件
- **易于测试**: 组件职责清晰，便于单元测试
- **主题支持**: 通过 CSS 变量轻松实现主题切换

### 7.3 开发效率提升

- **组件复用**: 新功能可直接使用已有组件
- **并行开发**: 组件边界清晰，多人协作不冲突
- **快速定位**: 样式问题可快速定位到具体组件

---

## 八、验证清单

### 8.1 每个步骤的验证标准

- [ ] **代码规范检查**: ESLint 无错误
- [ ] **构建验证**: `npm run build` 成功
- [ ] **功能验证**: 所有交互功能正常
- [ ] **样式验证**: 与原有实现视觉一致
- [ ] **响应式验证**: 移动端和桌面端显示正常

### 8.2 最终验收标准

- [ ] 所有组件都有独立的 CSS Modules 文件
- [ ] 所有组件都遵循三层变量架构
- [ ] 共享样式文件 `LiuYaoQiGua.css` 已删除
- [ ] 构建无警告和错误
- [ ] 功能测试通过率 100%
- [ ] 视觉回归测试通过率 100%

---

## 九、附录

### 9.1 参考文档

- [CSS Modules 官方文档](https://github.com/css-modules/css-modules)
- [React 组件设计最佳实践](https://reactjs.org/docs/thinking-in-react.html)
- [CSS 变量使用指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

### 9.2 相关文件路径

```
frontend/src/components/LiuYao/
├── components/
│   ├── NavigationSidebar/          # 已改造完成
│   ├── MethodContent/              # 待改造
│   ├── YaoInput/                   # 待创建
│   ├── YaoButton/                  # 待创建
│   └── ActionButton/               # 待创建
├── LiuYaoQiGua/
│   ├── LiuYaoQiGua.jsx             # 待改造
│   └── LiuYaoQiGua.css             # 待删除
└── methods/
    ├── StepByStepMethod.jsx        # 待改造
    ├── OneClickMethod.jsx          # 待改造
    ├── NumberMethod.jsx            # 待改造
    ├── SpecifiedMethod.jsx         # 待改造
    └── SpecifiedMethod.module.css  # 待重命名
```

### 9.3 变更记录

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| 1.0 | 2026-03-08 | 初始版本 | Gordon |

---

**文档结束**

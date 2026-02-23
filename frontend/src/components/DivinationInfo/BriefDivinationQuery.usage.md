# BriefDivinationQuery 组件使用说明

## 组件简介

`BriefDivinationQuery` 是一个独立的 React 组件，用于展示简要的占卜查询信息。该组件将求测者信息（属地、姓名、性别、出生年份）和占题合并为一行显示，适用于需要紧凑展示的场景。

## 组件位置

文件路径：`frontend/src/components/DivinationInfo/DivinationInfoDisplay.jsx`

## 导入方式

### 方式一：导入整个模块（默认导出）
```javascript
import DivinationInfoDisplay from './components/DivinationInfo/DivinationInfoDisplay';
```

### 方式二：单独导入 BriefDivinationQuery 组件
```javascript
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';
```

## Props 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|--------|----------|------|
| formData | object | 否 | {} | 表单数据对象，包含求测者信息和占题 |

### formData 对象结构

| 属性名 | 类型 | 必填 | 说明 |
|--------|------|--------|------|
| location | string | 否 | 属地 |
| firstName | string | 否 | 名字 |
| lastName | string | 否 | 姓氏 |
| gender | string | 否 | 性别 |
| birthYear | string | 否 | 出生年份 |
| question | string | 否 | 占题 |

## 使用示例

### 示例 1：基本使用

```javascript
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';

function MyComponent() {
  const formData = {
    location: '北京',
    firstName: '张',
    lastName: '三',
    gender: '男',
    birthYear: '1990',
    question: '今年财运如何'
  };

  return (
    <div>
      <BriefDivinationQuery formData={formData} />
    </div>
  );
}
```

**显示效果**：
```
北京 张三 男 1990生人，占：今年财运如何。
```

### 示例 2：部分数据

```javascript
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';

function MyComponent() {
  const formData = {
    firstName: '李',
    lastName: '四',
    question: '事业运势'
  };

  return (
    <div>
      <BriefDivinationQuery formData={formData} />
    </div>
  );
}
```

**显示效果**：
```
李四 ，占：事业运势。
```

### 示例 3：空数据

```javascript
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';

function MyComponent() {
  const formData = {};

  return (
    <div>
      <BriefDivinationQuery formData={formData} />
    </div>
  );
}
```

**显示效果**：不渲染任何内容

### 示例 4：在六爻结果页面中使用

```javascript
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';

function LiuYaoResult({ formData, divinationData }) {
  return (
    <div className="liu-yao-result">
      {/* 简要占题信息 */}
      <BriefDivinationQuery formData={formData} />
      
      {/* 其他内容... */}
      <FourPillarsDisplay 
        ganzhiInfo={divinationData.calendar_info?.ganzhi_info || {}}
      />
    </div>
  );
}
```

## 组件特性

### 1. 性能优化
- 使用 `React.memo` 包装组件，避免不必要的重渲染
- 使用 `React.useMemo` 缓存格式化结果，只有当 formData 变化时才重新计算

### 2. 数据安全
- 使用可选链操作符和空值合并运算符确保数据安全
- 如果 formData 为空对象，则不渲染任何内容

### 3. 无障碍支持
- 添加了 ARIA 标签（role、aria-label）
- 支持屏幕阅读器

### 4. 类型安全
- 使用 PropTypes 进行类型检查
- 在开发阶段即可捕获类型错误

## 样式说明

组件使用了以下 CSS 类名：

- `.divination-info.brief`：简要占题容器样式
  - `padding: 8px 12px`
  - `margin-bottom: 10px`
  - `background-color: #f5f5f5`
  - `border-radius: 8px`
  - `font-size: 14px`
  - `line-height: 1.6`
  - `color: #333`

## 注意事项

1. **组件独立性**：该组件是完全独立的，不依赖于 `DivinationInfoDisplay` 主组件
2. **导出方式**：通过命名导出 `export { BriefDivinationQuery }` 导出
3. **默认值处理**：所有字段都有默认值，不会因为缺少字段而报错
4. **空数据处理**：如果 formData 为空对象，则不渲染任何内容

## 与其他组件的关系

### 与 DivinationQuery 组件的区别

| 特性 | BriefDivinationQuery | DivinationQuery |
|--------|-------------------|-----------------|
| 显示方式 | 单行紧凑显示 | 分行详细显示 |
| 包含信息 | 求测者信息 + 占题 | 仅占题和占类 |
| 适用场景 | 需要紧凑展示 | 需要详细展示 |
| 组件位置 | 独立导出 | 主组件内部 |

### 与 SeekerInfo 组件的关系

- `SeekerInfo`：只展示求测者信息（姓名、性别、生年、属地）
- `BriefDivinationQuery`：展示求测者信息 + 占题（合并为一行）

## 迁移指南

如果你在 `LiuYaoReault.jsx` 中使用了内联的简要占题代码：

```javascript
// 旧代码
<div className="divination-info" role="listitem" aria-label="简要占题">
  {formData ? `${formData.location || ''} ${formData.firstName || ''}${formData.lastName || ''} ${formData.gender || ''} ${formData.birthYear || ''}${formData.birthYear ? '生人' : ''}，占：${formData.question || ''}${formData.question ? '。' : ''}` : ''}
</div>
```

可以迁移为：

```javascript
// 新代码
import { BriefDivinationQuery } from './components/DivinationInfo/DivinationInfoDisplay';

<BriefDivinationQuery formData={formData} />
```

## 版本历史

- **v1.0.0** (2026-02-22)：初始版本，从 `LiuYaoReault.jsx` 中提取并整合

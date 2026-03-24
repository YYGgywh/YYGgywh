# FourPillarsDisplay 组件修改计划书

## 1. 项目信息

- **文件路径**：`frontend/src/components/FourPillarsDisplay/FourPillarsDisplay.jsx`
- **文件类型**：React 组件
- **修改日期**：2026-03-14
- **修改目标**：添加显示控制功能，支持行、列、元素级别的显示/隐藏控制

## 2. 当前状态分析

### 2.1 现有功能
- 显示年、月、日、时四柱的干支和空亡信息
- 支持彩色模式
- 自动计算时柱信息
- 性能优化（useMemo）

### 2.2 存在问题
- 缺乏显示控制功能
- 无法按需控制特定元素的显示/隐藏
- 不支持响应式自动调整

## 3. 修改方案

### 3.1 核心功能修改

#### 3.1.1 添加显示配置参数
- **修改内容**：添加 `displayConfig` prop，支持三层控制结构
- **实现方式**：
  ```jsx
  const defaultDisplayConfig = {
    rows: { year: true, month: true, day: true, hour: true },
    columns: { label: true, gan: true, zhi: true, vacancy: true },
    elements: {
      year: { label: true, gan: true, zhi: true, vacancy: true },
      month: { label: true, gan: true, zhi: true, vacancy: true },
      day: { label: true, gan: true, zhi: true, vacancy: true },
      hour: { label: true, gan: true, zhi: true, vacancy: true }
    }
  };
  ```

#### 3.1.2 修改 Pillar 子组件
- **修改内容**：添加显示控制逻辑
- **实现方式**：
  ```jsx
  const Pillar = ({ label, gan, zhi, vacancy, className, displayConfig, rowKey }) => {
    const prefix = className;
    
    // 计算各元素的显示状态
    const showLabel = calculateDisplayState(displayConfig, rowKey, 'label');
    const showGan = calculateDisplayState(displayConfig, rowKey, 'gan');
    const showZhi = calculateDisplayState(displayConfig, rowKey, 'zhi');
    const showVacancy = calculateDisplayState(displayConfig, rowKey, 'vacancy');
    
    return (
      <div className={styles[prefix]}>
        {showLabel && <span className={styles[`${prefix}Label`]}>{label}</span>}
        {showGan && <span className={styles[`${prefix}Gan`]}>{gan}</span>}
        {showZhi && <span className={styles[`${prefix}Zhi`]}>{zhi}</span>}
        {showVacancy && <span className={styles[`${prefix}Vacancy`]}>{vacancy}</span>}
      </div>
    );
  };
  ```

#### 3.1.3 添加显示状态计算函数
- **修改内容**：添加 `calculateDisplayState` 函数
- **实现方式**：
  ```jsx
  const calculateDisplayState = (config, rowKey, columnKey) => {
    if (config.rows[rowKey] === false) return false;
    if (config.columns[columnKey] === false) return false;
    const elementConfig = config.elements[rowKey];
    if (elementConfig && elementConfig[columnKey] !== undefined) {
      return elementConfig[columnKey];
    }
    return true;
  };
  ```

#### 3.1.4 修改主组件渲染逻辑
- **修改内容**：过滤整行隐藏的柱，传递配置给子组件
- **实现方式**：
  ```jsx
  const visibleRows = [
    { key: 'year', label: '年', gan: lunar_year_gan_exact, zhi: lunar_year_zhi_exact, vacancy: yearVacancy },
    { key: 'month', label: '月', gan: lunar_month_gan_exact, zhi: lunar_month_zhi_exact, vacancy: monthVacancy },
    { key: 'day', label: '日', gan: lunar_day_in_gan_exact, zhi: lunar_day_in_zhi_exact, vacancy: dayVacancy },
    { key: 'hour', label: '时', gan: hourGan, zhi: lunar_time_in_zhi_exact, vacancy: hourKong }
  ].filter(row => displayConfig.rows[row.key] !== false);
  
  return (
    <div className={styles.root}>
      {visibleRows.map(row => (
        <Pillar
          key={row.key}
          label={row.label}
          gan={row.gan}
          zhi={row.zhi}
          vacancy={row.vacancy}
          className={`${row.key}PillarsInfo`}
          displayConfig={displayConfig}
          rowKey={row.key}
        />
      ))}
    </div>
  );
  ```

### 3.2 响应式支持

#### 3.2.1 添加响应式监听
- **修改内容**：在父组件中添加窗口大小监听
- **实现方式**：
  ```jsx
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDisplayConfig(prev => ({
        ...prev,
        columns: {
          ...prev.columns,
          label: width >= 768, // 小屏幕隐藏标签
          vacancy: width >= 480 // 极小屏幕隐藏旬空
        }
      }));
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  ```

### 3.3 类型定义和文档

#### 3.3.1 更新 PropTypes
- **修改内容**：添加 displayConfig 的类型定义
- **实现方式**：
  ```jsx
  FourPillarsDisplay.propTypes = {
    ganzhiInfo: PropTypes.object,
    hourPillarInfo: PropTypes.object,
    className: PropTypes.string,
    isColorMode: PropTypes.bool,
    displayConfig: PropTypes.shape({
      rows: PropTypes.shape({
        year: PropTypes.bool,
        month: PropTypes.bool,
        day: PropTypes.bool,
        hour: PropTypes.bool
      }),
      columns: PropTypes.shape({
        label: PropTypes.bool,
        gan: PropTypes.bool,
        zhi: PropTypes.bool,
        vacancy: PropTypes.bool
      }),
      elements: PropTypes.shape({
        year: PropTypes.shape({
          label: PropTypes.bool,
          gan: PropTypes.bool,
          zhi: PropTypes.bool,
          vacancy: PropTypes.bool
        }),
        month: PropTypes.shape({
          label: PropTypes.bool,
          gan: PropTypes.bool,
          zhi: PropTypes.bool,
          vacancy: PropTypes.bool
        }),
        day: PropTypes.shape({
          label: PropTypes.bool,
          gan: PropTypes.bool,
          zhi: PropTypes.bool,
          vacancy: PropTypes.bool
        }),
        hour: PropTypes.shape({
          label: PropTypes.bool,
          gan: PropTypes.bool,
          zhi: PropTypes.bool,
          vacancy: PropTypes.bool
        })
      })
    })
  };
  ```

## 4. 性能优化

### 4.1 配置记忆化
- **修改内容**：使用 useMemo 缓存配置计算结果
- **实现方式**：
  ```jsx
  const displayConfigWithDefaults = React.useMemo(() => ({
    ...defaultDisplayConfig,
    ...props.displayConfig,
    rows: { ...defaultDisplayConfig.rows, ...props.displayConfig?.rows },
    columns: { ...defaultDisplayConfig.columns, ...props.displayConfig?.columns },
    elements: {
      ...defaultDisplayConfig.elements,
      ...props.displayConfig?.elements
    }
  }), [props.displayConfig]);
  ```

### 4.2 条件渲染优化
- **修改内容**：使用 && 进行条件渲染，避免不必要的 DOM 元素

## 5. 向后兼容性

- **默认配置**：所有元素默认显示，保持现有行为
- **API 兼容**：新增 prop 为可选，不影响现有使用方式

## 6. 测试计划

### 6.1 功能测试
- 测试整行显示/隐藏
- 测试整列显示/隐藏
- 测试元素级显示/隐藏
- 测试响应式自动调整

### 6.2 兼容性测试
- 测试现有代码是否正常运行
- 测试新功能是否按预期工作

## 7. 预期效果

- **功能增强**：支持精细的显示控制
- **响应式**：自动适应不同屏幕尺寸
- **性能**：保持高性能，避免不必要的渲染
- **兼容性**：保持向后兼容

## 8. 风险评估

### 8.1 潜在风险
- 配置对象结构复杂，可能导致使用错误
- 响应式监听可能影响性能

### 8.2 缓解措施
- 提供详细的文档和示例
- 使用节流优化响应式监听
- 添加类型检查和默认值

## 9. 实施时间估计

| 任务 | 时间估计 |
|------|----------|
| 添加显示配置参数 | 30分钟 |
| 修改 Pillar 子组件 | 30分钟 |
| 添加显示状态计算函数 | 20分钟 |
| 修改主组件渲染逻辑 | 20分钟 |
| 添加响应式支持 | 20分钟 |
| 更新类型定义和文档 | 20分钟 |
| 性能优化 | 15分钟 |
| 测试 | 30分钟 |
| **总计** | **205分钟** |

## 10. 结论

通过本次修改，FourPillarsDisplay 组件将具备更灵活的显示控制能力，支持行、列、元素级别的显示/隐藏控制，同时保持向后兼容性和良好的性能表现。这将为父组件提供更多的控制选项，满足不同场景的显示需求。
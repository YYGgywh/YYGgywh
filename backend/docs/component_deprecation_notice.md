# 组件废弃通知

## 通知概述
本通知正式宣布以下组件已废弃，并已从代码库中移除。

## 废弃组件列表

### 1. LunarCalculator (`src/algorithms/lunar_calculator.py`)
- **废弃日期**：2024年
- **废弃原因**：功能已由更优化的CalendarCalculator组件替代
- **影响范围**：农历计算相关功能
- **替代方案**：使用`src/algorithms/calendar_calculator.py`

### 2. Validators (`src/utils/validators.py`)
- **废弃日期**：2024年
- **废弃原因**：验证逻辑已内联到相关模块，减少依赖
- **影响范围**：数据验证功能
- **替代方案**：使用各模块内的验证逻辑

## 迁移指南

### 从LunarCalculator迁移到CalendarCalculator

#### 旧代码示例
```python
from src.algorithms.lunar_calculator import LunarCalculator

calculator = LunarCalculator()
result = calculator.solar_to_lunar(2024, 1, 1)
```

#### 新代码示例
```python
from src.algorithms.calendar_calculator import CalendarCalculator

calculator = CalendarCalculator()
result = calculator.solar_to_lunar(2024, 1, 1)
```

### 验证功能迁移

#### 旧代码示例
```python
from src.utils.validators import validate_date

is_valid = validate_date("2024-01-01")
```

#### 新代码示例
```python
# 验证逻辑已内联到相关模块
# 例如在API端点中直接进行验证
```

## 测试更新
所有相关测试文件已更新：
- `test_lunar_calculator.py` - 已标记为废弃测试
- `compare_calculators.py` - 性能对比测试已取消
- `test_conversion_consistency.py` - 继续使用CalendarCalculator
- `test_boundary_cases.py` - 继续使用CalendarCalculator

## 回滚机制

### 紧急回滚
如需恢复废弃组件，可使用回滚脚本：
```bash
python scripts/rollback_components.py
```

### 手动恢复
如需手动恢复，请参考`docs/emergency_plan.md`中的详细步骤。

## 技术支持

### 问题报告
如遇到迁移相关问题，请通过以下渠道报告：
- GitHub Issues
- 团队内部沟通渠道
- 技术支持邮箱

### 技术支持时间
- 工作日：9:00-18:00
- 紧急问题：24/7响应

## 时间线

### 已完成的迁移工作
1. ✅ 组件功能分析
2. ✅ 依赖关系清理
3. ✅ 测试文件更新
4. ✅ 组件文件删除
5. ✅ 系统测试验证
6. ✅ 回滚机制建立

### 后续计划
1. 🔄 监控系统稳定性
2. 🔄 收集用户反馈
3. 🔄 优化新组件性能

## 联系方式

### 技术负责人
- 姓名：[负责人姓名]
- 邮箱：[负责人邮箱]
- 电话：[负责人电话]

### 项目维护团队
- 团队邮箱：[团队邮箱]
- 文档链接：[项目文档地址]

---

**通知发布日期**：2024年
**生效日期**：立即生效
**版本**：1.0
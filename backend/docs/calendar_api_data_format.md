# 日历服务API数据格式说明

## 1. 前端提交数据格式

### 1.1 公历转农历请求格式

**请求路径**: `POST /api/v1/calendar/convert`

**请求体格式**:
```json
{
    "year": 2025,
    "month": 12,
    "day": 5,
    "hour": 15,
    "day_ganzhi_method": 2
}
```

**字段说明**:
- `year`: 公历年份 (整数，必填)
- `month`: 公历月份 (整数 1-12，必填)
- `day`: 公历日期 (整数 1-31，必填)
- `hour`: 小时 (整数 0-23，可选，默认0)
- `day_ganzhi_method`: 日干支流派选择 (整数 1或2，可选，默认2)
  - `1`: 流派1 - 晚子时(23:00-24:00)的日柱算明天
  - `2`: 流派2 - 晚子时(23:00-24:00)的日柱算当天

**注意**: 系统会根据传入的`day_ganzhi_method`参数计算对应的日干支，而不是返回所有流派的结果。

### 1.2 农历转公历请求格式

**请求路径**: `POST /api/v1/calendar/convert-from-lunar`

**请求体格式**:
```json
{
    "lunar_year": 2025,
    "lunar_month": 10,
    "lunar_day": 16,
    "is_leap_month": false,
    "hour": 15
}
```

**字段说明**:
- `lunar_year`: 农历年份 (整数，必填)
- `lunar_month`: 农历月份 (整数 1-12，必填)
- `lunar_day`: 农历日期 (整数 1-30，必填)
- `is_leap_month`: 是否为闰月 (布尔值，必填)
- `hour`: 小时 (整数 0-23，可选，默认0)

### 1.3 四柱反推日期请求格式

**请求路径**: `POST /api/v1/calendar/convert-from-pillars`

**请求体格式**:
```json
{
    "year_pillar": "甲子",
    "month_pillar": "丙寅",
    "day_pillar": "戊辰",
    "hour_pillar": "壬子"
}
```

**字段说明**:
- `year_pillar`: 年柱 (字符串，如：甲子，必填)
- `month_pillar`: 月柱 (字符串，如：丙寅，必填)
- `day_pillar`: 日柱 (字符串，如：戊辰，必填)
- `hour_pillar`: 时柱 (字符串，如：壬子，必填)

### 1.4 日期验证请求格式

**请求路径**: `POST /api/v1/calendar/validate`

**请求体格式**:
```json
{
    "year": 2024,
    "month": 2,
    "day": 30,
    "hour": 12
}
```

### 1.5 获取当前时间历法信息

**请求路径**: `GET /api/v1/calendar/current`

**请求体**: 无

### 1.6 测试接口

**请求路径**: `GET /api/v1/calendar/test/{date_str}`

**参数说明**:
- `date_str`: 日期字符串，格式为 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS

## 2. 后端返回数据格式及中文键名对应

### 2.1 完整历法信息返回格式

```json
{
  "success": true,
  "data": {
    "solar": {
      "date": "2025-02-03 22:10:27",
      "year": 2025,
      "month": 2,
      "day": 3,
      "hour": 22,
      "minute": 10,
      "second": 27,
      "week": "一",
      "constellation": "水瓶",
      "festivals": [],
      "other_festivals": []
    },
    "lunar": {
      "full_string": "二〇二五年正月初六 乙巳(蛇)年 丁亥(猪)月 己酉(鸡)日 庚午(马)时",
      "year_chinese": "二〇二五",
      "year": 2025,
      "month_chinese": "正月",
      "month": 1,
      "day_chinese": "初六",
      "day": 6,
      "time_zhi": "午",
      "festivals": [],
      "other_festivals": []
    },
    "ganzhi": {
      "solar_calendar": {
        "year": {
          "year_in_ganzhi_by_lichun": "乙巳",
          "year_gan_by_lichun": "乙",
          "year_zhi_by_lichun": "巳"
        },
        "month": {
          "month_in_ganzhi_by_jie": "丁亥",
          "month_gan_by_jie": "丁",
          "month_zhi_by_jie": "亥"
        },
        "day": {
          "day_in_ganzhi": "己酉",
          "day_gan": "己",
          "day_zhi": "酉"
        },
        "time": {
          "time_in_ganzhi": "庚午",
          "time_gan": "庚",
          "time_zhi": "午"
        }
      },
      "lunar_calendar": {
        "year": {
          "year_in_ganzhi": "乙巳",
          "year_gan": "乙",
          "year_zhi": "巳"
        },
        "month": {
          "month_in_ganzhi": "丁亥",
          "month_gan": "丁",
          "month_zhi": "亥"
        },
        "day": {
          "day_in_ganzhi": "己酉",
          "day_gan": "己",
          "day_zhi": "酉"
        },
        "time": {
          "time_in_ganzhi": "庚午",
          "time_gan": "庚",
          "time_zhi": "午"
        }
      }
    },
    "jieqi": {
      "prev_jie": "小寒 2025-01-05 10:32:47",
      "current_time": "2025-02-03 22:10:27",
      "next_jie": "立春 2025-02-03 22:10:28"
    },
    "jieqi_combination": {
      "prev_jie": "小寒 2025-01-05 10:32:47",
      "prev_qi": "大寒 2025-01-20 03:59:52",
      "next_jie": "立春 2025-02-03 22:10:28"
    }
  },
  "error": null,
  "message": "历法转换成功"
}
```

### 2.2 中文键名对应表

| 英文键名 | 中文含义 | 数据类型 | 说明 |
|---------|---------|---------|------|
| **success** | 请求成功状态 | 布尔值 | true表示成功，false表示失败 |
| **data** | 历法数据 | 对象 | 包含所有历法信息的根对象 |
| **error** | 错误信息 | 对象/null | 错误时包含错误详情，成功时为null |
| **message** | 状态消息 | 字符串 | 操作结果描述 |
| **solar** | 公历信息 | 对象 | 公历日期时间信息 |
| ├── date | 完整日期时间 | 字符串 | 格式：YYYY-MM-DD HH:MM:SS |
| ├── year | 年份 | 整数 | 公历年份 |
| ├── month | 月份 | 整数 | 公历月份 (1-12) |
| ├── day | 日期 | 整数 | 公历日期 (1-31) |
| ├── hour | 小时 | 整数 | 小时 (0-23) |
| ├── minute | 分钟 | 整数 | 分钟 (0-59) |
| ├── second | 秒 | 整数 | 秒 (0-59) |
| ├── week | 星期 | 字符串 | 中文星期几 |
| ├── constellation | 星座 | 字符串 | 星座名称 |
| ├── festivals | 节日 | 数组 | 公历节日列表 |
| └── other_festivals | 其他节日 | 数组 | 其他公历节日 |
| **lunar** | 农历信息 | 对象 | 农历日期时间信息 |
| ├── full_string | 完整农历字符串 | 字符串 | 包含农历年月日时干支等完整信息 |
| ├── year_chinese | 中文年份 | 字符串 | 中文数字年份（如：二〇二五） |
| ├── year | 农历年份 | 整数 | 农历年份 |
| ├── month_chinese | 中文月份 | 字符串 | 中文月份（如：十） |
| ├── month | 农历月份 | 整数 | 农历月份 (1-12) |
| ├── day_chinese | 中文日期 | 字符串 | 中文日期（如：十六） |
| ├── day | 农历日期 | 整数 | 农历日期 (1-30) |
| ├── time_zhi | 时辰地支 | 字符串 | 时辰地支（如：申） |
| ├── festivals | 节日 | 数组 | 农历节日列表 |
| └── other_festivals | 其他节日 | 数组 | 其他农历节日 |
| **ganzhi** | 干支信息 | 对象 | 包含两种算法的干支信息 |
| ├── solar_calendar | 节气交节点算法 | 对象 | 基于节气交节点的干支算法（精确算法） |
| │ ├── year | 年柱信息 | 对象 | 年干支信息（基于立春交节点） |
| │ │ ├── year_in_ganzhi_by_lichun | 年柱 | 字符串 | 完整年柱（如：乙巳），立春交节点计算 |
| │ │ ├── year_gan_by_lichun | 年干 | 字符串 | 年干（如：乙），立春交节点计算 |
| │ │ └── year_zhi_by_lichun | 年支 | 字符串 | 年支（如：巳），立春交节点计算 |
| │ ├── month | 月柱信息 | 对象 | 月干支信息（基于节令交节点） |
| │ │ ├── month_in_ganzhi_by_jie | 月柱 | 字符串 | 完整月柱（如：丁亥），节令交节点计算 |
| │ │ ├── month_gan_by_jie | 月干 | 字符串 | 月干（如：丁），节令交节点计算 |
| │ │ └── month_zhi_by_jie | 月支 | 字符串 | 月支（如：亥），节令交节点计算 |
| │ ├── day | 日柱信息 | 对象 | 日干支信息（根据day_ganzhi_method参数计算） |
| │ │ ├── day_in_ganzhi | 日柱 | 字符串 | 完整日柱（如：戊申），根据流派选择计算 |
| │ │ ├── day_gan | 日干 | 字符串 | 日干（如：戊），根据流派选择计算 |
| │ │ └── day_zhi | 日支 | 字符串 | 日支（如：申），根据流派选择计算 |
| │ └── time | 时柱信息 | 对象 | 时干支信息 |
| │ │ ├── time_in_ganzhi | 时柱 | 字符串 | 完整时柱（如：庚申） |
| │ │ ├── time_gan | 时干 | 字符串 | 时干（如：庚） |
| │ │ └── time_zhi | 时支 | 字符串 | 时支（如：申） |
| ├── lunar_calendar | 农历正月初一算法 | 对象 | 基于农历正月初一的传统干支算法 |
| │ ├── year | 年柱信息 | 对象 | 年干支信息（基于正月初一） |
| │ │ ├── year_in_ganzhi | 年柱 | 字符串 | 完整年柱（如：乙巳），正月初一计算 |
| │ │ ├── year_gan | 年干 | 字符串 | 年干（如：乙），正月初一计算 |
| │ │ └── year_zhi | 年支 | 字符串 | 年支（如：巳），正月初一计算 |
| │ ├── month | 月柱信息 | 对象 | 月干支信息（基于农历月） |
| │ │ ├── month_in_ganzhi | 月柱 | 字符串 | 完整月柱（如：丁亥），农历月计算 |
| │ │ ├── month_gan | 月干 | 字符串 | 月干（如：丁），农历月计算 |
| │ │ └── month_zhi | 月支 | 字符串 | 月支（如：亥），农历月计算 |
| │ ├── day | 日柱信息 | 对象 | 日干支信息（基于农历日） |
| │ │ ├── day_in_ganzhi | 日柱 | 字符串 | 完整日柱（如：戊申），农历日计算 |
| │ │ ├── day_gan | 日干 | 字符串 | 日干（如：戊），农历日计算 |
| │ │ └── day_zhi | 日支 | 字符串 | 日支（如：申），农历日计算 |
| │ └── time | 时柱信息 | 对象 | 时干支信息 |
| │ │ ├── time_in_ganzhi | 时柱 | 字符串 | 完整时柱（如：庚申） |
| │ │ ├── time_gan | 时干 | 字符串 | 时干（如：庚） |
| │ │ └── time_zhi | 时支 | 字符串 | 时支（如：申） |
| **jieqi** | 节气信息 | 对象 | 节气相关信息 |
| ├── jie | 节信息 | 对象 | 节的相关信息 |
| │ ├── prev | 上一个节 | 对象 | 上一个节的信息 |
| │ │ ├── name | 节名称 | 字符串 | 节名（如：立冬） |
| │ │ ├── time | 节时间 | 字符串 | 节的具体时间 |
| │ │ └── solar | 节公历日期 | 字符串 | 节的公历日期 |
| │ └── next | 下一个节 | 对象 | 下一个节的信息 |
| ├── qi | 气信息 | 对象 | 气的相关信息 |
| │ ├── prev | 上一个气 | 对象 | 上一个气的信息 |
| │ └── next | 下一个气 | 对象 | 下一个气的信息 |
| └── current | 当前节气 | 对象 | 当前节气信息 |
| │ ├── name | 节气名称 | 字符串 | 当前节气名（如：无） |
| │ ├── is_jieqi | 是否为节气 | 布尔值 | 当前是否为节气 |
| │ └── current_time | 当前时间 | 字符串 | 当前时间 |
| **jieqi_combination** | 节气组合信息 | 对象 | 节气组合显示信息 |
| ├── prev_jie | 上一个节 | 字符串 | 上一个节的组合显示 |
| ├── prev_qi | 上一个气 | 字符串 | 上一个气的组合显示 |
| └── next_jie | 下一个节 | 字符串 | 下一个节的组合显示 |


### 2.3 四柱反推返回格式

```json
{
    "success": true,
    "data": {
        "multiple_results": true,
        "total_matches": 3,
        "matching_dates": [
            {
                "solar_date": "2024-02-03 22:10:27",
                "calendar_info": {
                    // 完整历法信息（同上）
                }
            },
            {
                "solar_date": "1984-02-03 22:10:27",
                "calendar_info": {
                    // 完整历法信息
                }
            }
        ],
        "primary_result": {
            // 第一个匹配结果的完整历法信息
        }
    },
    "error": null,
    "message": "四柱转换成功"
}
```

### 2.4 日期验证返回格式

```json
{
    "is_valid": true,
    "is_corrected": false,
    "original_date": "2024-02-30 12:00:00",
    "corrected_date": null,
    "message": "日期参数有效"
}
```

### 2.5 错误响应格式

```json
{
    "error": true,
    "message": "日期参数错误：小时超出范围(0-23)",
    "code": "CALENDAR_ERROR"
}
```

## 3. 使用示例

### 3.1 JavaScript调用示例

```javascript
// 公历转农历（使用流派1）
const response = await fetch('/api/v1/calendar/convert', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        year: 2025,
        month: 12,
        day: 5,
        hour: 15,
        day_ganzhi_method: 1
    })
});

const result = await response.json();
if (result.success) {
    console.log(result.data.lunar.full_string); // 二〇二五年十月十六 乙巳(蛇)年 丁亥(猪)月...
    
    // 节气交节点算法（精确算法）- 根据day_ganzhi_method参数计算
    console.log(result.data.ganzhi.solar_calendar.day.day_in_ganzhi); // 戊申 (日柱，根据流派选择计算)
    
    // 农历正月初一算法（传统算法）
    console.log(result.data.ganzhi.lunar_calendar.day.day_in_ganzhi); // 戊申 (日柱，农历日计算)
    
    console.log(result.message); // 公历转农历转换成功
}
```

### 3.2 Python调用示例

```python
import requests

# 获取当前时间历法信息（使用默认流派2）
response = requests.get('http://localhost:8000/api/v1/calendar/current')
data = response.json()

if data['success']:
    print(f"当前公历: {data['data']['solar']['date']}")
    print(f"当前农历: {data['data']['lunar']['full_string']}")
    
    # 节气交节点算法（精确算法）- 根据day_ganzhi_method参数计算
    print(f"日干支(根据流派选择): {data['data']['ganzhi']['solar_calendar']['day']['day_in_ganzhi']}")
    
    # 农历正月初一算法（传统算法）
    print(f"日干支(传统算法): {data['data']['ganzhi']['lunar_calendar']['day']['day_in_ganzhi']}")
    
    print(f"状态: {data['message']}")
else:
    print(f"错误: {data['message']}")
```

## 4. 注意事项

1. **日期自动修正**: 如果输入无效日期（如2月30日），系统会自动修正为有效日期
2. **四柱反推**: 可能返回多个匹配结果，需要前端处理多结果展示
3. **节气时刻**: 节气信息精确到秒，可用于精确排盘
4. **错误处理**: 所有接口都包含详细的错误信息，便于前端展示
5. **数据一致性**: 返回的干支信息与农历信息完全对应，确保排盘准确性
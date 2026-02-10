# 日历转换模块返回数据结构文档

## 1. 概述

本文档详细说明日历转换模块（`calendar_service.py` 和 `calendar_calculator.py`）的返回数据结构，确保两个模块返回完全一致的JSON格式。

## 2. 顶层返回结构

```json
{
  "success": true,
  "valid": true,
  "input_type": "solar",
  "conversion_type": "solar_to_lunar",
  "solar_info": { /* 公历信息 */ },
  "lunar_info": { /* 农历信息 */ },
  "ganzhi_info": { /* 干支信息 */ },
  "jieqi_info": { /* 节气信息 */ },
  "error": "可选：错误信息"
}
```

### 2.1 顶层字段说明

| 字段名 | 数据类型 | 说明 | 必填项 |
|-------|---------|------|-------|
| `success` | `boolean` | 转换请求是否成功接收 | 是 |
| `valid` | `boolean` | 转换结果是否有效 | 是 |
| `input_type` | `string` | 输入日期类型：`solar`(公历) 或 `lunar`(农历) | 是 |
| `conversion_type` | `string` | 转换类型：`solar_to_lunar` 或 `lunar_to_solar` | 是 |
| `solar_info` | `object` | 公历日期详细信息 | 当 `valid=true` 时必填 |
| `lunar_info` | `object` | 农历日期详细信息 | 当 `valid=true` 时必填 |
| `ganzhi_info` | `object` | 干支纪年详细信息 | 当 `valid=true` 时必填 |
| `jieqi_info` | `object` | 节气信息 | 当 `valid=true` 时必填 |
| `error` | `string` | 错误信息，仅当 `valid=false` 时出现 | 否 |

## 3. 公历信息 (solar_info)

```json
{
  "solar_year": 2023,
  "solar_month": 12,
  "solar_day": 25,
  "solar_hour": 12,
  "solar_minute": 0,
  "solar_second": 0,
  "solar_String": "2023-12-25 12:00:00",
  "solar_FullString": "2023年12月25日 12时00分00秒 星期一 摩羯座",
  "solar_Ymd": "2023-12-25",
  "solar_YmdHms": "2023-12-25 12:00:00",
  "solar_week": 1,
  "solar_week_chinese": "一",
  "solar_leap_year": false,
  "solar_festivals": ["圣诞节"],
  "solar_other_festivals": []
}
```

### 3.1 solar_info 字段说明

| 字段名 | 数据类型 | 说明 | 必填项 |
|-------|---------|------|-------|
| `solar_year` | `integer` | 公历年 (1-9999) | 是 |
| `solar_month` | `integer` | 公历月 (1-12) | 是 |
| `solar_day` | `integer` | 公历日 (1-31) | 是 |
| `solar_hour` | `integer` | 公历小时 (0-23) | 是 |
| `solar_minute` | `integer` | 公历分钟 (0-59) | 是 |
| `solar_second` | `integer` | 公历秒 (0-59) | 是 |
| `solar_String` | `string` | 公历默认字符串格式 | 是 |
| `solar_FullString` | `string` | 公历完整字符串格式，包含节气、节日等 | 是 |
| `solar_Ymd` | `string` | 公历日期格式 (YYYY-MM-DD) | 是 |
| `solar_YmdHms` | `string` | 公历完整日期时间格式 (YYYY-MM-DD HH:mm:ss) | 是 |
| `solar_week` | `integer` | 星期数字 (0=星期日, 1=星期一, ..., 6=星期六) | 是 |
| `solar_week_chinese` | `string` | 星期中文 (一, 二, ..., 日) | 是 |
| `solar_leap_year` | `boolean` | 是否为闰年 | 是 |
| `solar_festivals` | `array[string]` | 公历主要节日列表 | 是 |
| `solar_other_festivals` | `array[string]` | 公历其他节日列表 | 是 |

## 4. 农历信息 (lunar_info)

```json
{
  "lunar_year": 2023,
  "lunar_year_in_Chinese": "二零二三年",
  "lunar_year_in_GanZhi": "癸卯",
  "lunar_year_in_Gan": "癸",
  "lunar_year_in_Zhi": "卯",
  "lunar_year_shengxiao": "兔",
  "lunar_year_shengxiao_by_lichun": "兔",
  "lunar_month": 11,
  "lunar_month_in_Chinese": "冬月",
  "lunar_day": 13,
  "lunar_day_in_Chinese": "十三",
  "lunar_time_Zhi": "午",
  "lunar_string": "二〇二三年冬月十三",
  "lunar_full_string": "二〇二三年冬月十三 癸卯(兔)年 甲子(鼠)月 丁巳(蛇)日 午(马)时 ...",
  "lunar_festivals": [],
  "lunar_other_festivals": []
}
```

### 4.1 lunar_info 字段说明

| 字段名 | 数据类型 | 说明 | 必填项 |
|-------|---------|------|-------|
| `lunar_year` | `integer` | 农历年数字 | 是 |
| `lunar_year_in_Chinese` | `string` | 农历年中文 | 是 |
| `lunar_year_in_GanZhi` | `string` | 农历年干支 (以正月初一起算，不包含"年"字) | 是 |
| `lunar_year_in_Gan` | `string` | 农历年天干 (以正月初一起算) | 是 |
| `lunar_year_in_Zhi` | `string` | 农历年地支 (以正月初一起算) | 是 |
| `lunar_year_shengxiao` | `string` | 生肖 (以正月初一起算) | 是 |
| `lunar_year_shengxiao_by_lichun` | `string` | 生肖 (以立春起算) | 是 |
| `lunar_month` | `integer` | 农历月数字 (1-12为正常月，-1~-12为闰月) | 是 |
| `lunar_month_in_Chinese` | `string` | 农历月中文 | 是 |
| `lunar_day` | `integer` | 农历日 | 是 |
| `lunar_day_in_Chinese` | `string` | 农历日中文 | 是 |
| `lunar_time_Zhi` | `string` | 时辰地支 | 是 |
| `lunar_string` | `string` | 农历默认字符串格式 | 是 |
| `lunar_full_string` | `string` | 农历完整字符串格式 | 是 |
| `lunar_festivals` | `array[string]` | 农历主要节日列表 | 是 |
| `lunar_other_festivals` | `array[string]` | 农历其他节日列表 | 是 |

## 5. 干支信息 (ganzhi_info)

```json
{
  "lunar_year_in_ganzhi_exact": "癸卯",
  "lunar_year_gan_exact": "癸",
  "lunar_year_zhi_exact": "卯",
  "lunar_month_in_ganzhi_exact": "甲子",
  "lunar_month_gan_exact": "甲",
  "lunar_month_zhi_exact": "子",
  "lunar_day_in_ganzhi_exact": "辛酉",
  "lunar_day_in_gan_exact": "辛",
  "lunar_day_in_zhi_exact": "酉",
  "lunar_day_in_ganzhi_exact2": "辛酉",
  "lunar_day_in_gan_exact2": "辛",
  "lunar_day_in_zhi_exact2": "酉"
}
```

### 5.1 ganzhi_info 字段说明

| 字段名 | 数据类型 | 说明 | 必填项 |
|-------|---------|------|-------|
| `lunar_year_in_ganzhi_exact` | `string` | 精确干支纪年 (以立春起算) | 是 |
| `lunar_year_gan_exact` | `string` | 精确年天干 (以立春起算) | 是 |
| `lunar_year_zhi_exact` | `string` | 精确年地支 (以立春起算) | 是 |
| `lunar_month_in_ganzhi_exact` | `string` | 精确干支纪月 (以节气交接时刻起算) | 是 |
| `lunar_month_gan_exact` | `string` | 精确月天干 (以节气交接时刻起算) | 是 |
| `lunar_month_zhi_exact` | `string` | 精确月地支 (以节气交接时刻起算) | 是 |
| `lunar_day_in_ganzhi_exact` | `string` | 精确干支纪日 (流派1：晚子时日柱算明天) | 是 |
| `lunar_day_in_gan_exact` | `string` | 精确日天干 (流派1) | 是 |
| `lunar_day_in_zhi_exact` | `string` | 精确日地支 (流派1) | 是 |
| `lunar_day_in_ganzhi_exact2` | `string` | 精确干支纪日 (流派2：晚子时日柱算当天) | 是 |
| `lunar_day_in_gan_exact2` | `string` | 精确日天干 (流派2) | 是 |
| `lunar_day_in_zhi_exact2` | `string` | 精确日地支 (流派2) | 是 |

## 6. 节气信息 (jieqi_info)

```json
{
  "jieqi_result_a": {
    "prev_jie": {
      "name": "大雪",
      "time": "2023-12-07 17:32:44"
    },
    "prev_qi": {
      "name": "冬至",
      "time": "2023-12-22 11:27:09"
    },
    "new": {
      "name": "占时",
      "time": "2023-12-25 12:00:00"
    },
    "next_jie": {
      "name": "小寒",
      "time": "2024-01-06 04:49:09"
    },
    "next_qi": {
      "name": "大寒",
      "time": "2024-01-20 22:07:24"
    }
  }
}
```

### 6.1 jieqi_info 字段说明

| 字段名 | 数据类型 | 说明 | 必填项 |
|-------|---------|------|-------|
| `jieqi_result_a` | `object` | 节气组合信息，根据时间顺序排列 | 是 |
| `jieqi_result_a.prev_jie` | `object` | 上一个节 | 是 |
| `jieqi_result_a.prev_jie.name` | `string` | 上一个节的名称 | 是 |
| `jieqi_result_a.prev_jie.time` | `string` | 上一个节的时间 | 是 |
| `jieqi_result_a.prev_qi` | `object` | 上一个气 | 是 |
| `jieqi_result_a.prev_qi.name` | `string` | 上一个气的名称 | 是 |
| `jieqi_result_a.prev_qi.time` | `string` | 上一个气的时间 | 是 |
| `jieqi_result_a.new` | `object` | 当前占时信息 | 是 |
| `jieqi_result_a.new.name` | `string` | 当前占时的名称（固定为"占时"） | 是 |
| `jieqi_result_a.new.time` | `string` | 当前占时的时间 | 是 |
| `jieqi_result_a.next_jie` | `object` | 下一个节 | 是 |
| `jieqi_result_a.next_jie.name` | `string` | 下一个节的名称 | 是 |
| `jieqi_result_a.next_jie.time` | `string` | 下一个节的时间 | 是 |
| `jieqi_result_a.next_qi` | `object` | 下一个气 | 是 |
| `jieqi_result_a.next_qi.name` | `string` | 下一个气的名称 | 是 |
| `jieqi_result_a.next_qi.time` | `string` | 下一个气的时间 | 是 |

## 7. 错误状态返回结构

当转换失败或输入无效时，返回结构如下：

```json
{
  "success": true,
  "valid": false,
  "input_type": "solar",
  "conversion_type": "solar_to_lunar",
  "error": "输入数据格式错误：月份必须在1-12之间"
}
```

## 8. 字段关系图

```
┌─────────────────────────────────────────────────────────┐
│                       顶层返回结构                      │
├─────────┬─────────┬─────────────┬───────────────────────┤
│ success │  valid  │ input_type  │ conversion_type       │
├─────────┴─────────┴─────────────┴───────────────────────┤
│                         ┌───────────┐                   │
│                         │  error    │                   │
│                         └───────────┘                   │
│                                                         │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│  │  solar_info │   │  lunar_info │   │ ganzhi_info │    │
│  └─────────────┘   └─────────────┘   └─────────────┘    │
│                                                         │
│                     ┌─────────────┐                     │
│                     │ jieqi_info  │                     │
│                     └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

## 9. 数据结构一致性保证

- `calendar_service.py` 和 `calendar_calculator.py` 严格返回完全一致的结构
- 所有字段名、数据类型和嵌套结构保持统一
- 转换结果的有效性由 `valid` 字段明确标识
- 错误信息仅在 `valid=false` 时返回

## 10. 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|---------|
| 1.0 | 2025-02-03 | 初始版本，统一两个模块的返回结构 |
| 1.1 | 2025-02-04 | 更新节气结构，使用嵌套对象格式替代字符串格式 |

## 11. 使用示例

### 公历转农历示例

```json
{
  "success": true,
  "valid": true,
  "input_type": "solar",
  "conversion_type": "solar_to_lunar",
  "solar_info": {
    "solar_year": 2023,
    "solar_month": 12,
    "solar_day": 25,
    "solar_hour": 12,
    "solar_minute": 0,
    "solar_second": 0,
    "solar_String": "2023-12-25 12:00:00",
    "solar_FullString": "2023年12月25日 12时00分00秒 星期一 摩羯座",
    "solar_Ymd": "2023-12-25",
    "solar_YmdHms": "2023-12-25 12:00:00",
    "solar_week": 1,
    "solar_week_chinese": "一",
    "solar_leap_year": false,
    "solar_festivals": ["圣诞节"],
    "solar_other_festivals": []
  },
  "lunar_info": {
    "lunar_year": 2023,
    "lunar_year_in_Chinese": "二零二三年",
    "lunar_year_in_GanZhi": "癸卯",
    "lunar_year_in_Gan": "癸",
    "lunar_year_in_Zhi": "卯",
    "lunar_year_shengxiao": "兔",
    "lunar_year_shengxiao_by_lichun": "兔",
    "lunar_month": 11,
    "lunar_month_in_Chinese": "冬月",
    "lunar_day": 13,
    "lunar_day_in_Chinese": "十三",
    "lunar_time_Zhi": "午",
    "lunar_string": "二〇二三年冬月十三",
    "lunar_full_string": "二〇二三年冬月十三 癸卯(兔)年 甲子(鼠)月 丁巳(蛇)日 午(马)时 ...",
    "lunar_festivals": [],
    "lunar_other_festivals": []
  },
  "ganzhi_info": {
    "lunar_year_in_ganzhi_exact": "癸卯",
    "lunar_year_gan_exact": "癸",
    "lunar_year_zhi_exact": "卯",
    "lunar_month_in_ganzhi_exact": "甲子",
    "lunar_month_gan_exact": "甲",
    "lunar_month_zhi_exact": "子",
    "lunar_day_in_ganzhi_exact": "辛酉",
    "lunar_day_in_gan_exact": "辛",
    "lunar_day_in_zhi_exact": "酉",
    "lunar_day_in_ganzhi_exact2": "辛酉",
    "lunar_day_in_gan_exact2": "辛",
    "lunar_day_in_zhi_exact2": "酉"
  },
  "jieqi_info": {
    "jieqi_result_a": {
      "prev_jie": {
        "name": "大雪",
        "time": "2023-12-07 17:32:44"
      },
      "prev_qi": {
        "name": "冬至",
        "time": "2023-12-22 11:27:09"
      },
      "new": {
        "name": "占时",
        "time": "2023-12-25 12:00:00"
      },
      "next_jie": {
        "name": "小寒",
        "time": "2024-01-06 04:49:09"
      },
      "next_qi": {
        "name": "大寒",
        "time": "2024-01-20 22:07:24"
      }
    }
  }
}
```

### 农历转公历示例

```json
{
  "success": true,
  "valid": true,
  "input_type": "lunar",
  "conversion_type": "lunar_to_solar",
  "solar_info": {
    "solar_year": 2025,
    "solar_month": 2,
    "solar_day": 3,
    "solar_hour": 22,
    "solar_minute": 10,
    "solar_second": 27,
    "solar_String": "2025-02-03 22:10:27",
    "solar_FullString": "2025年2月3日 22时10分27秒 星期一 水瓶座",
    "solar_Ymd": "2025-02-03",
    "solar_YmdHms": "2025-02-03 22:10:27",
    "solar_week": 1,
    "solar_week_chinese": "一",
    "solar_leap_year": false,
    "solar_festivals": [],
    "solar_other_festivals": []
  },
  "lunar_info": {
    "lunar_year": 2025,
    "lunar_year_in_Chinese": "二零二五年",
    "lunar_year_in_GanZhi": "乙巳",
    "lunar_year_in_Gan": "乙",
    "lunar_year_in_Zhi": "巳",
    "lunar_year_shengxiao": "蛇",
    "lunar_year_shengxiao_by_lichun": "蛇",
    "lunar_month": 1,
    "lunar_month_in_Chinese": "正月",
    "lunar_day": 6,
    "lunar_day_in_Chinese": "初六",
    "lunar_time_Zhi": "亥",
    "lunar_string": "二零二五年正月初六",
    "lunar_full_string": "二零二五年正月初六 乙巳(蛇)年 戊寅(虎)月 丁丑(牛)日 亥(猪)时 ...",
    "lunar_festivals": [],
    "lunar_other_festivals": []
  },
  "ganzhi_info": {
    "lunar_year_in_ganzhi_exact": "乙巳",
    "lunar_year_gan_exact": "乙",
    "lunar_year_zhi_exact": "巳",
    "lunar_month_in_ganzhi_exact": "戊寅",
    "lunar_month_gan_exact": "戊",
    "lunar_month_zhi_exact": "寅",
    "lunar_day_in_ganzhi_exact": "癸卯",
    "lunar_day_in_gan_exact": "癸",
    "lunar_day_in_zhi_exact": "卯",
    "lunar_day_in_ganzhi_exact2": "癸卯",
    "lunar_day_in_gan_exact2": "癸",
    "lunar_day_in_zhi_exact2": "卯"
  },
  "jieqi_info": {
    "jieqi_result_a": {
      "prev_jie": {
        "name": "立春",
        "time": "2025-02-03 02:43:35"
      },
      "prev_qi": {
        "name": "雨水",
        "time": "2025-02-18 20:07:58"
      },
      "new": {
        "name": "占时",
        "time": "2025-02-03 22:10:27"
      },
      "next_jie": {
        "name": "惊蛰",
        "time": "2025-03-05 18:24:38"
      },
      "next_qi": {
        "name": "春分",
        "time": "2025-03-20 20:26:16"
      }
    }
  }
}
```

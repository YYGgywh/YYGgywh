/*
 * @file            frontend/src/components/DivinationInfo/timestamp/FourPillarsTime.jsx
 * @description     四柱时间输入和显示组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-06 10:00:00
 * @lastModified    2026-02-18 18:55:18
 * Copyright © All rights reserved
*/

// 导入React核心库和Hooks
import React, { useState, useEffect, useRef } from 'react'; // 导入React及状态管理、副作用和引用钩子
// 导入四柱工具函数
import { getTianGanList, validateYearGanInput, validateYearZhiInput, validateDayGanInput, validateDayZhiInput, validateMonthZhiInput, validateHourZhiInput, calculateMonthGan, calculateHourGan } from '../../../utils/fourPillarsUtils'; // 导入天干地支相关工具函数
import GanZhiSelector from './GanZhiSelector'; // 导入天干地支选择器组件
import CalendarService from '../../../services/calendarService'; // 导入日历服务模块

// 定义四柱时间组件
const FourPillarsTime = ({ // 组件参数解构
  onTimeChange, // 时间数据变化时的回调函数
  confirmedTime, // 确认的时间数据(用于初始化组件状态)
  onSolarListResult, // 阳历列表结果回调函数
  selectedSolar // 选中的阳历结果
}) => {
  // 定义时间数据状态,存储四柱天干地支值
  const [timeData, setTimeData] = useState({ // 定义时间数据状态,存储四柱天干地支值
    yearGan: '', // 年干字段
    monthGan: '', // 月干字段
    dayGan: '', // 日干字段
    hourGan: '', // 时干字段
    yearZhi: '', // 年支字段
    monthZhi: '', // 月支字段
    dayZhi: '', // 日支字段
    hourZhi: '' // 时支字段
  });
  
  // 存储计算结果的状态
  const [solarListResult, setSolarListResult] = useState(null); // 定义阳历列表结果状态,存储计算后的阳历时间列表
  
  // 公历信息状态
  const [solarDate, setSolarDate] = useState(''); // 定义公历日期状态,存储格式化后的公历日期
  const [solarTime, setSolarTime] = useState(''); // 定义公历时间状态,存储格式化后的公历时间
  
  // 农历信息状态
  const [lunarDate, setLunarDate] = useState(''); // 定义农历日期状态,存储格式化后的农历日期
  const [lunarTime, setLunarTime] = useState(''); // 定义农历时间状态,存储格式化后的农历时间
  
  const skipNotifyRef = useRef(false); // 使用ref存储跳过通知的标记,避免不必要的父组件更新
  
  // 菜单相关状态
  const [showGanMenu, setShowGanMenu] = useState(false); // 定义天干菜单显示状态
  const [showZhiMenu, setShowZhiMenu] = useState(false); // 定义地支菜单显示状态
  const [ganMenuPosition, setGanMenuPosition] = useState({ top: 0, left: 0 }); // 定义天干菜单位置状态
  const [zhiMenuPosition, setZhiMenuPosition] = useState({ top: 0, left: 0 }); // 定义地支菜单位置状态
  const [currentFocus, setCurrentFocus] = useState('yearGan'); // 跟踪当前焦点的输入框
  const yearGanRef = useRef(null); // 定义年干输入框引用
  const dayGanRef = useRef(null); // 定义日干输入框引用
  const yearZhiRef = useRef(null); // 定义年支输入框引用
  const dayZhiRef = useRef(null); // 定义日支输入框引用
  const monthZhiRef = useRef(null); // 添加月支输入框的引用
  const hourZhiRef = useRef(null); // 添加时支输入框的引用
  const containerRef = useRef(null); // 定义容器引用
  const ganMenuRef = useRef(null); // 添加天干菜单的引用
  const zhiMenuRef = useRef(null); // 添加地支菜单的引用
  
  // 获取天干列表
  const tianGan = getTianGanList(); // 获取天干列表

  // 处理confirmedTime变化
  useEffect(() => { // 定义副作用钩子,监听confirmedTime变化
    console.log('FourPillarsTime - confirmedTime变化:', confirmedTime); // 输出调试日志
    if (confirmedTime) { // 如果确认时间不为空
      skipNotifyRef.current = true; // 设置跳过通知标记,避免触发父组件更新
      setTimeData({ // 设置时间数据为确认的时间
        yearGan: confirmedTime.yearGan || confirmedTime.yearPillar || '', // 年干字段,优先使用yearGan,否则使用yearPillar
        monthGan: confirmedTime.monthGan || confirmedTime.monthPillar || '', // 月干字段,优先使用monthGan,否则使用monthPillar
        dayGan: confirmedTime.dayGan || confirmedTime.dayPillar || '', // 日干字段,优先使用dayGan,否则使用dayPillar
        hourGan: confirmedTime.hourGan || confirmedTime.hourPillar || '', // 时干字段,优先使用hourGan,否则使用hourPillar
        yearZhi: confirmedTime.yearZhi || confirmedTime.yearPillar2 || '', // 年支字段,优先使用yearZhi,否则使用yearPillar2
        monthZhi: confirmedTime.monthZhi || confirmedTime.monthPillar2 || '', // 月支字段,优先使用monthZhi,否则使用monthPillar2
        dayZhi: confirmedTime.dayZhi || confirmedTime.dayPillar2 || '', // 日支字段,优先使用dayZhi,否则使用dayPillar2
        hourZhi: confirmedTime.hourZhi || confirmedTime.hourPillar2 || '' // 时支字段,优先使用hourZhi,否则使用hourPillar2
      });
      skipNotifyRef.current = false; // 重置跳过通知标记
      console.log('FourPillarsTime - 已更新timeData'); // 输出调试日志
    }
  }, [confirmedTime]); // 依赖数组:监听confirmedTime变化
  
  // 监听年干和月支变化，自动计算月干
  useEffect(() => { // 定义副作用钩子,监听年干和月支变化
    if (timeData.yearGan && timeData.monthZhi) { // 如果年干和月支都有值
      const monthGan = calculateMonthGan(timeData.yearGan, timeData.monthZhi); // 根据年干和月支计算月干
      setTimeData(prev => { // 更新时间数据状态
        if (prev.monthGan !== monthGan) { // 如果月干值发生变化
          return { // 返回新的状态
            ...prev, // 复制之前的状态
            monthGan // 更新月干值
          };
        }
        return prev; // 如果月干值未变化,返回之前的状态
      });
    } else { // 当年干或月支不存在时
      // 当年干或月支不存在时，清空月干
      setTimeData(prev => { // 更新时间数据状态
        if (prev.monthGan !== '') { // 如果月干不为空
          return { // 返回新的状态
            ...prev, // 复制之前的状态
            monthGan: '' // 清空月干值
          };
        }
        return prev; // 如果月干已为空,返回之前的状态
      });
    }
  }, [timeData.yearGan, timeData.monthZhi]); // 依赖数组:监听年干和月支变化
  
  // 监听日干和时支变化，自动计算时干
  useEffect(() => { // 定义副作用钩子,监听日干和时支变化
    if (timeData.dayGan && timeData.hourZhi) { // 如果日干和时支都有值
      const hourGan = calculateHourGan(timeData.dayGan, timeData.hourZhi); // 根据日干和时支计算时干
      setTimeData(prev => { // 更新时间数据状态
        if (prev.hourGan !== hourGan) { // 如果时干值发生变化
          return { // 返回新的状态
            ...prev, // 复制之前的状态
            hourGan // 更新时干值
          };
        }
        return prev; // 如果时干值未变化,返回之前的状态
      });
    } else { // 当日干或时支不存在时
      // 当日干或时支不存在时，清空时干
      setTimeData(prev => { // 更新时间数据状态
        if (prev.hourGan !== '') { // 如果时干不为空
          return { // 返回新的状态
            ...prev, // 复制之前的状态
            hourGan: '' // 清空时干值
          };
        }
        return prev; // 如果时干已为空,返回之前的状态
      });
    }
  }, [timeData.dayGan, timeData.hourZhi]); // 依赖数组:监听日干和时支变化
  
  // 监听 timeData 变化，调用 onTimeChange 回调
  useEffect(() => { // 定义副作用钩子,监听timeData变化
    // 组件挂载时跳过首次调用，避免传递空数据
    if (!skipNotifyRef.current && (Object.values(timeData).some(value => value !== ''))) { // 如果未跳过通知且时间数据有值
      console.log('FourPillarsTime - 调用 onTimeChange:', timeData); // 输出调试日志
      onTimeChange(timeData); // 调用父组件传递的回调函数,传递时间数据
    } else { // 跳过调用
      console.log('FourPillarsTime - 跳过 onTimeChange 调用'); // 输出调试日志
    }
  }, [timeData, onTimeChange]); // 依赖数组:监听timeData和onTimeChange变化
  
  // 监听 timeData 变化，当四柱值输入完整时计算阳历列表
  useEffect(() => { // 定义副作用钩子,监听timeData变化
    // 检查四柱值是否完整
    const isComplete = timeData.yearGan && timeData.yearZhi && timeData.monthGan && timeData.monthZhi && timeData.dayGan && timeData.dayZhi && timeData.hourGan && timeData.hourZhi; // 检查所有四柱字段是否都有值
    
    if (isComplete) { // 如果四柱值完整
      console.log('FourPillarsTime - 四柱值完整，开始计算阳历列表:', timeData); // 输出调试日志
      
      // 构建八字四柱字符串
      const yearGanZhi = timeData.yearGan + timeData.yearZhi; // 构建年柱字符串
      const monthGanZhi = timeData.monthGan + timeData.monthZhi; // 构建月柱字符串
      const dayGanZhi = timeData.dayGan + timeData.dayZhi; // 构建日柱字符串
      const timeGanZhi = timeData.hourGan + timeData.hourZhi; // 构建时柱字符串
      
      // 调用 CalendarService.getSolarListByBaZi 方法计算结果
      const result = CalendarService.getSolarListByBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi); // 调用日历服务计算阳历列表
      console.log('FourPillarsTime - 计算结果:', result); // 输出调试日志
      
      // 更新结果状态
      setSolarListResult(result); // 更新阳历列表结果状态
      
      // 调用回调函数，将结果传递给父组件
      if (onSolarListResult) { // 如果回调函数存在
        onSolarListResult(result); // 调用回调函数,传递计算结果
      }
    } else { // 四柱值不完整
      // 四柱值不完整时清空结果
      setSolarListResult(null); // 清空阳历列表结果状态
      
      // 调用回调函数，通知父组件清空结果
      if (onSolarListResult) { // 如果回调函数存在
        onSolarListResult(null); // 调用回调函数,传递null
      }
    }
  }, [timeData]); // 依赖数组:监听timeData变化
  
  // 处理选中结果，转换为公历和农历显示
  useEffect(() => { // 定义副作用钩子,监听selectedSolar变化
    if (selectedSolar) { // 如果选中的阳历结果不为空
      console.log('FourPillarsTime - 选中的公历结果:', selectedSolar); // 输出调试日志
      
      // 构建公历日期字符串
      const solarDateString = `${selectedSolar.year.toString().padStart(4, '0')}年${selectedSolar.month.toString().padStart(2, '0')}月${selectedSolar.day.toString().padStart(2, '0')}日`; // 构建公历日期字符串,格式为YYYY年MM月DD日
      // 构建公历时间字符串
      const solarTimeString = `${selectedSolar.hour.toString().padStart(2, '0')}:${selectedSolar.minute.toString().padStart(2, '0')}:${selectedSolar.second.toString().padStart(2, '0')}`; // 构建公历时间字符串,格式为HH:MM:SS
      
      // 更新公历信息
      setSolarDate(solarDateString); // 更新公历日期状态
      setSolarTime(solarTimeString); // 更新公历时间状态
      
      // 调用 CalendarService.convertSolarToLunar 方法转换
      const result = CalendarService.convertSolarToLunar({ // 调用日历服务将阳历转换为农历
        year: selectedSolar.year, // 年份
        month: selectedSolar.month, // 月份
        day: selectedSolar.day, // 日期
        hour: selectedSolar.hour, // 小时
        minute: selectedSolar.minute, // 分钟
        second: selectedSolar.second // 秒
      });
      
      if (result.success && result.data) { // 如果转换成功且有数据
        console.log('FourPillarsTime - 转换结果:', result.data); // 输出调试日志
        
        // 构建农历日期字符串
        let lunarDateString = ''; // 初始化农历日期字符串
        if (result.data.lunar_year_in_GanZhi) { // 如果有农历干支年
          lunarDateString += result.data.lunar_year_in_GanZhi + '年'; // 添加农历干支年
        }
        if (result.data.lunar_month_in_Chinese) { // 如果有农历中文月
          lunarDateString += result.data.lunar_month_in_Chinese + '月'; // 添加农历中文月
        }
        if (result.data.lunar_day_in_Chinese) { // 如果有农历中文日
          lunarDateString += result.data.lunar_day_in_Chinese; // 添加农历中文日
        }
        
        // 构建时辰字符串
        let lunarTimeString = ''; // 初始化时辰字符串
        if (selectedSolar.hour !== null && result.data.lunar_time_Zhi) { // 如果小时不为空且有时辰
          if (result.data.lunar_time_Zhi === '子') { // 如果时辰为子时
            const hourNum = parseInt(selectedSolar.hour); // 获取小时数值
            const minuteNum = parseInt(selectedSolar.minute || 0); // 获取分钟数值,默认为0
            const secondNum = parseInt(selectedSolar.second || 0); // 获取秒数值,默认为0
            if (hourNum === 23 && (minuteNum > 0 || secondNum > 0)) { // 如果是23点且分或秒大于0
              lunarTimeString = '晚子时'; // 设置为晚子时
            } else if (hourNum === 23 && minuteNum === 0 && secondNum === 0) { // 如果是23点0分0秒
              lunarTimeString = '晚子时'; // 设置为晚子时
            } else if (hourNum === 0) { // 如果是0点
              lunarTimeString = '早子时'; // 设置为早子时
            } else { // 其他情况
              lunarTimeString = `${result.data.lunar_time_Zhi}时`; // 设置为时辰+时
            }
          } else { // 非子时
            lunarTimeString = `${result.data.lunar_time_Zhi}时`; // 设置为时辰+时
          }
        }
        
        // 更新农历信息
        setLunarDate(lunarDateString); // 更新农历日期状态
        setLunarTime(lunarTimeString); // 更新农历时间状态
      } else { // 转换失败
        console.error('FourPillarsTime - 转换失败:', result.error); // 输出错误日志
        // 清空农历信息
        setLunarDate(''); // 清空农历日期状态
        setLunarTime(''); // 清空农历时间状态
      }
    } else { // 没有选中结果
      // 没有选中结果时，清空所有信息
      setLunarDate(''); // 清空农历日期状态
      setLunarTime(''); // 清空农历时间状态
      setSolarDate(''); // 清空公历日期状态
      setSolarTime(''); // 清空公历时间状态
    }
  }, [selectedSolar]); // 依赖数组:监听selectedSolar变化
  
  // 添加点击其他区域隐藏菜单的功能
  useEffect(() => { // 定义副作用钩子,处理点击外部区域隐藏菜单
    const handleClickOutside = (event) => { // 定义点击外部处理函数
      // 检查点击的目标是否在菜单或输入框之外
      
      // 检查是否点击在所有输入框之外
      const isClickOutsideInputs = ( // 定义点击在输入框之外的标志
        (yearGanRef.current && !yearGanRef.current.contains(event.target)) && // 检查是否点击在年干输入框之外
        (dayGanRef.current && !dayGanRef.current.contains(event.target)) && // 检查是否点击在日干输入框之外
        (yearZhiRef.current && !yearZhiRef.current.contains(event.target)) && // 检查是否点击在年支输入框之外
        (dayZhiRef.current && !dayZhiRef.current.contains(event.target)) && // 检查是否点击在日支输入框之外
        (monthZhiRef.current && !monthZhiRef.current.contains(event.target)) && // 检查是否点击在月支输入框之外
        (hourZhiRef.current && !hourZhiRef.current.contains(event.target)) // 检查是否点击在时支输入框之外
      );
      
      // 检查是否点击在所有菜单之外
      const isClickOutsideMenus = ( // 定义点击在菜单之外的标志
        (!showGanMenu || (ganMenuRef.current && !ganMenuRef.current.contains(event.target))) && // 检查是否点击在天干菜单之外
        (!showZhiMenu || (zhiMenuRef.current && !zhiMenuRef.current.contains(event.target))) // 检查是否点击在地支菜单之外
      );
      
      // 如果点击在所有输入框和菜单之外，则隐藏所有菜单
      if (isClickOutsideInputs && isClickOutsideMenus) { // 如果点击在所有输入框和菜单之外
        setShowGanMenu(false); // 隐藏天干菜单
        setShowZhiMenu(false); // 隐藏地支菜单
      }
    };
    
    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside); // 添加mousedown事件监听器
    
    // 清理事件监听器
    return () => { // 清理函数:组件卸载时移除事件监听器
      document.removeEventListener('mousedown', handleClickOutside); // 移除mousedown事件监听器
    };
  }, [showGanMenu, showZhiMenu]); // 依赖数组:监听天干和地支菜单显示状态变化

  const handleChange = (e) => { // 定义输入框值变化处理函数
    const { name, value } = e.target; // 获取输入框名称和值
    
    // 只处理单个字符的输入
    if (value.length > 1) { // 如果输入值长度大于1
      return; // 直接返回,不处理
    }
    
    setTimeData(prev => { // 更新时间数据状态
      // 验证输入值是否符合限制条件
      let isValid = true; // 初始化验证标志为true
      if (name === 'yearGan') { // 如果是年干字段
        isValid = validateYearGanInput(value, prev.yearZhi); // 验证年干输入值
      } else if (name === 'yearZhi') { // 如果是年支字段
        isValid = validateYearZhiInput(value, prev.yearGan); // 验证年支输入值
      } else if (name === 'dayGan') { // 如果是日干字段
        isValid = validateDayGanInput(value, prev.dayZhi); // 验证日干输入值
      } else if (name === 'dayZhi') { // 如果是日支字段
        isValid = validateDayZhiInput(value, prev.dayGan); // 验证日支输入值
      } else if (name === 'monthZhi') { // 如果是月支字段
        isValid = validateMonthZhiInput(value); // 验证月支输入值
      } else if (name === 'hourZhi') { // 如果是时支字段
        isValid = validateHourZhiInput(value); // 验证时支输入值
      }
      
      if (!isValid) { // 如果验证失败
        return prev; // 返回之前的状态,不更新
      }
      
      return { // 返回新的状态
        ...prev, // 复制之前的状态
        [name]: value // 更新当前字段的值
      };
    });
  };
  
  // 计算菜单位置，使其水平居中
  const calculateMenuPosition = (inputElement, menuType = 'gan') => { // 定义菜单位置计算函数,接收输入框元素和菜单类型参数
    const rect = inputElement.getBoundingClientRect(); // 获取输入框元素的位置信息
    const containerRect = containerRef.current?.getBoundingClientRect(); // 获取容器元素的位置信息
    
    // 计算水平居中位置
    const containerCenter = containerRect ? containerRect.left + containerRect.width / 2 : rect.left + rect.width / 2; // 计算容器中心位置,如果容器不存在则使用输入框中心
    
    // 根据菜单类型设置不同的垂直偏移量
    const verticalOffset = menuType === 'zhi' ? +34 : -40; // 地支菜单向下移动34px,天干菜单向上移动40px
    
    return { // 返回菜单位置对象
      top: rect.top + window.scrollY + verticalOffset, // 设置顶部位置,包含滚动偏移和垂直偏移
      left: containerCenter, // 设置左侧位置为容器中心
      transform: 'translateX(-50%)' // 使用transform使菜单自身水平居中
    };
  };
  
  // 处理年干输入框获取焦点
  const handleYearGanFocus = (e) => { // 定义年干输入框获取焦点处理函数
    setCurrentFocus('yearGan'); // 设置当前焦点为年干输入框
    // 当年支为空时，显示天干菜单
    if (!timeData.yearZhi) { // 如果年支为空
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    } else if (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.yearZhi)) { // 如果年支为阳支
      // 当年支为阳支时，显示阳干菜单
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    } else if (['丑', '卯', '巳', '未', '酉', '亥'].includes(timeData.yearZhi)) { // 如果年支为阴支
      // 当年支为阴支时，显示阴干菜单
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    }
  };
  
  // 处理年干输入框失去焦点
  const handleYearGanBlur = () => { // 定义年干输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理年支输入框获取焦点
  const handleYearZhiFocus = (e) => { // 定义年支输入框获取焦点处理函数
    setCurrentFocus('yearZhi'); // 设置当前焦点为年支输入框
    // 当年干为空时，显示地支菜单
    if (!timeData.yearGan) { // 如果年干为空
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    } else if (['甲', '丙', '戊', '庚', '壬'].includes(timeData.yearGan)) { // 如果年干为阳干
      // 当年干为阳干时，显示阳支菜单
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    } else if (['乙', '丁', '己', '辛', '癸'].includes(timeData.yearGan)) { // 如果年干为阴干
      // 当年干为阴干时，显示阴支菜单
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    }
  };
  
  // 处理年支输入框失去焦点
  const handleYearZhiBlur = () => { // 定义年支输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理月支输入框获取焦点
  const handleMonthZhiFocus = (e) => { // 定义月支输入框获取焦点处理函数
    setCurrentFocus('monthZhi'); // 设置当前焦点为月支输入框
    // 显示四季地支菜单
    const inputElement = e.target; // 获取输入框元素
    setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
    setShowZhiMenu(true); // 显示地支菜单
    setShowGanMenu(false); // 隐藏天干菜单
  };
  
  // 处理月支输入框失去焦点
  const handleMonthZhiBlur = () => { // 定义月支输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理日干输入框获取焦点
  const handleDayGanFocus = (e) => { // 定义日干输入框获取焦点处理函数
    setCurrentFocus('dayGan'); // 设置当前焦点为日干输入框
    // 当日支为空时，显示天干菜单
    if (!timeData.dayZhi) { // 如果日支为空
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    } else if (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.dayZhi)) { // 如果日支为阳支
      // 当日支为阳支时，显示阳干菜单
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    } else if (['丑', '卯', '巳', '未', '酉', '亥'].includes(timeData.dayZhi)) { // 如果日支为阴支
      // 当日支为阴支时，显示阴干菜单
      const inputElement = e.target; // 获取输入框元素
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan')); // 计算并设置天干菜单位置
      setShowGanMenu(true); // 显示天干菜单
      setShowZhiMenu(false); // 隐藏地支菜单
    }
  };
  
  // 处理日干输入框失去焦点
  const handleDayGanBlur = () => { // 定义日干输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理日支输入框获取焦点
  const handleDayZhiFocus = (e) => { // 定义日支输入框获取焦点处理函数
    setCurrentFocus('dayZhi'); // 设置当前焦点为日支输入框
    // 当日干为空时，显示地支菜单
    if (!timeData.dayGan) { // 如果日干为空
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    } else if (['甲', '丙', '戊', '庚', '壬'].includes(timeData.dayGan)) { // 如果日干为阳干
      // 当日干为阳干时，显示阳支菜单
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    } else if (['乙', '丁', '己', '辛', '癸'].includes(timeData.dayGan)) { // 如果日干为阴干
      // 当日干为阴干时，显示阴支菜单
      const inputElement = e.target; // 获取输入框元素
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
      setShowZhiMenu(true); // 显示地支菜单
      setShowGanMenu(false); // 隐藏天干菜单
    }
  };
  
  // 处理日支输入框失去焦点
  const handleDayZhiBlur = () => { // 定义日支输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理时支输入框获取焦点
  const handleHourZhiFocus = (e) => { // 定义时支输入框获取焦点处理函数
    setCurrentFocus('hourZhi'); // 设置当前焦点为时支输入框
    // 显示顺序地支菜单
    const inputElement = e.target; // 获取输入框元素
    setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi')); // 计算并设置地支菜单位置
    setShowZhiMenu(true); // 显示地支菜单
    setShowGanMenu(false); // 隐藏天干菜单
  };
  
  // 处理时支输入框失去焦点
  const handleHourZhiBlur = () => { // 定义时支输入框失去焦点处理函数
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  }; // 空函数,不执行任何操作
  
  // 处理菜单选择
  const handleGanSelect = (gan) => { // 定义天干菜单选择处理函数,接收选中的天干
    setTimeData(prev => { // 更新时间数据状态
      return { // 返回新的状态
        ...prev, // 复制之前的状态
        [currentFocus]: gan // 更新当前焦点字段的天干值
      };
    });
    setShowGanMenu(false); // 选择后关闭菜单
  };
  
  // 处理地支菜单选择
  const handleZhiSelect = (zhi) => { // 定义地支菜单选择处理函数,接收选中的地支
    setTimeData(prev => { // 更新时间数据状态
      return { // 返回新的状态
        ...prev, // 复制之前的状态
        [currentFocus]: zhi // 更新当前焦点字段的地支值
      };
    });
    setShowZhiMenu(false); // 选择后关闭菜单
  };
  
  // 处理菜单关闭
  const handleGanMenuClose = () => { // 定义天干菜单关闭处理函数
    setShowGanMenu(false); // 隐藏天干菜单
  };
  
  // 处理地支菜单关闭
  const handleZhiMenuClose = () => { // 定义地支菜单关闭处理函数
    setShowZhiMenu(false); // 隐藏地支菜单
  };
  
  // 处理输入框双击清空
  const handleDoubleClick = (e) => { // 定义输入框双击清空处理函数
    const { name } = e.target; // 获取输入框名称
    setTimeData(prev => { // 更新时间数据状态
      return { // 返回新的状态
        ...prev, // 复制之前的状态
        [name]: '' // 清空指定字段的值
      };
    });
  };

  // 渲染组件的 JSX 结构
  return (
    <div className="four-pillars-time-container" ref={containerRef}> {/* 四柱时间组件最外层容器，用于整体布局和定位 */}
      {/* 四柱输入区域 */}      
      <div className="timestamp-inputs tiangan-inputs"> {/* 天干输入区域：用于输入年、月、日、时的天干 */}
        {/* 年干输入框：用于输入或显示年柱的天干，支持手动输入、双击清空及获取焦点时弹出对应天干菜单 */}
        <input 
          ref={yearGanRef} // 绑定DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型
          name="yearGan" // 字段名，与timeData中的key对应
          placeholder="年" // 占位提示文字，提示用户输入年干
          className="time-input" // 统一样式类名
          value={timeData.yearGan} // 当前绑定的年干值
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleYearGanFocus} // 获取焦点时根据已有年支动态显示天干菜单
          onBlur={handleYearGanBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前字段
        />
        {/* 月干输入框：仅用于展示自动计算出的月干，禁止手动输入，双击可清空 */}
        <input 
          type="text" // 输入框类型为普通文本，用于输入单个天干或地支字符
          name="monthGan" // 月干字段，仅用于展示自动计算出的月干
          placeholder="月" // 占位提示文字，提示用户该输入框对应月柱的天干
          className="time-input" // 统一样式类名
          value={timeData.monthGan} // 绑定自动计算后的月干值
          onChange={handleChange} // 输入变化时触发统一校验（实际被禁用，不会触发）
          onDoubleClick={handleDoubleClick} // 双击可清空当前字段
          disabled // 禁止手动输入，由年干与月支自动计算
        />
        {/* 日干输入框：仅用于展示自动计算出的日干，禁止手动输入，双击可清空 */}
        <input 
          ref={dayGanRef} // 绑定日干输入框的DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型，仅允许输入单个天干字符
          name="dayGan" // 字段名，与timeData中的dayGhan字段对应
          placeholder="日" // 占位提示文字，提示用户输入日干
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.dayGan} // 当前绑定的日干值，受控组件
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleDayGanFocus} // 获取焦点时根据已有日支动态显示天干菜单
          onBlur={handleDayGanBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前日干字段
        />
        {/* 时干输入框：仅用于展示自动计算出的时干，禁止手动输入，双击可清空 */}
        <input 
          type="text" // 输入框类型为普通文本，仅用于展示单个天干字符
          name="hourGan" // 字段名，与timeData中的hourGan字段对应，表示时柱天干
          placeholder="时" // 占位提示文字，提示用户该输入框对应时辰的天干
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.hourGan} // 当前绑定的时干值，受控组件，由日干和时支自动计算得出
          onChange={handleChange} // 输入变化时触发统一校验（实际被禁用，不会触发）
          onDoubleClick={handleDoubleClick} // 双击快速清空当前时干字段
          disabled // 禁止手动输入，时干由程序根据日干和时支自动计算并展示
        />
      </div>
      
      <div className="timestamp-inputs dizhi-inputs"> {/* 地支输入区域：用于输入年、月、日、时的地支 */}
        {/* 年支输入框：用于输入或显示年柱的地支，支持手动输入、双击清空及获取焦点时弹出对应地支菜单 */}
        <input 
          ref={yearZhiRef} // 绑定DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型
          name="yearZhi" // 字段名，与timeData中的yearZhi字段对应
          placeholder="年" // 占位提示文字，提示用户输入年支
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.yearZhi} // 当前绑定的年支值，受控组件
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleYearZhiFocus} // 获取焦点时根据已有年干动态显示地支菜单
          onBlur={handleYearZhiBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前年支字段
        />
        {/* 月支输入框：仅用于展示自动计算出的月支，禁止手动输入，双击可清空 */}
        <input 
          ref={monthZhiRef} // 绑定月支输入框的DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型，仅允许输入单个地支字符
          name="monthZhi" // 字段名，与timeData中的monthZhi字段对应，表示月柱地支
          placeholder="月" // 占位提示文字，提示用户输入月支
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.monthZhi} // 当前绑定的月支值，受控组件
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleMonthZhiFocus} // 获取焦点时显示四季地支菜单
          onBlur={handleMonthZhiBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前月支字段
        />
        {/* 日支输入框：仅用于展示自动计算出的日支，禁止手动输入，双击可清空 */}
        <input 
          ref={dayZhiRef} // 绑定日支输入框的DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型，仅允许输入单个地支字符
          name="dayZhi" // 字段名，与timeData中的dayZhi字段对应，表示日柱地支
          placeholder="日" // 占位提示文字，提示用户输入日支
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.dayZhi} // 当前绑定的日支值，受控组件，由程序根据已有数据自动计算得出
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleDayZhiFocus} // 获取焦点时根据已有日干动态显示地支菜单
          onBlur={handleDayZhiBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前日支字段
        />
        {/* 时支输入框：仅用于展示自动计算出的时支，禁止手动输入，双击可清空 */}
        <input 
          ref={hourZhiRef} // 绑定时支输入框的DOM引用，便于后续获取位置或操作
          type="text" // 文本输入类型，仅允许输入单个地支字符
          name="hourZhi" // 字段名，与timeData中的hourZhi字段对应，表示时柱地支
          placeholder="时" // 占位提示文字，提示用户输入时支
          className="time-input" // 统一样式类名，保持输入框外观一致
          value={timeData.hourZhi} // 当前绑定的时支值，受控组件，由程序根据已有数据自动计算得出
          onChange={handleChange} // 输入变化时触发统一校验与更新
          onFocus={handleHourZhiFocus} // 获取焦点时根据已有时干动态显示地支菜单
          onBlur={handleHourZhiBlur} // 失去焦点时由外部点击逻辑控制菜单关闭
          onDoubleClick={handleDoubleClick} // 双击快速清空当前时支字段
        />
      </div>
      
      {/* 天干选择菜单 */}
      <div ref={ganMenuRef}> {/* 天干选择菜单外层容器，用于定位及点击外部关闭菜单的引用 */}
        {/* GanZhiSelector 组件：负责渲染天干选择菜单 */}
        <GanZhiSelector
          isVisible={showGanMenu} // 控制菜单是否可见
          onSelect={handleGanSelect} // 选中某天干后的回调
          onClose={handleGanMenuClose} // 关闭菜单的回调
          position={ganMenuPosition} // 菜单相对于视口的定位样式
          menuType={currentFocus === 'yearGan' ? // 判断当前焦点是否在年干输入框
            (timeData.yearZhi ? (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.yearZhi) ? "TIANGAN_YANG" : "TIANGAN_YIN") : "TIANGAN") : // 当前聚焦在年干输入框时，根据年支的阴阳决定显示阳干或阴干菜单；若年支未填则显示全部天干
            (timeData.dayZhi ? (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.dayZhi) ? "TIANGAN_YANG" : "TIANGAN_YIN") : "TIANGAN")// 当前聚焦在日干输入框时，根据日支的阴阳决定显示阳干或阴干菜单；若日支未填则显示全部天干
          }
        />
      </div>
      
      {/* 地支选择菜单 */}
      <div ref={zhiMenuRef}> {/* 地支选择菜单外层容器，用于定位及点击外部关闭菜单的引用 */}
        {/* GanZhiSelector 组件：负责渲染地支选择菜单 */}
        <GanZhiSelector
          isVisible={showZhiMenu} // 控制地支选择菜单是否可见
          onSelect={handleZhiSelect} // 选中某地支后的回调函数
          onClose={handleZhiMenuClose} // 关闭地支菜单的回调函数
          position={zhiMenuPosition} // 菜单相对于视口的定位样式
          menuType={currentFocus === 'yearZhi' ? // 判断当前焦点是否在年支输入框
            (timeData.yearGan ? (['甲', '丙', '戊', '庚', '壬'].includes(timeData.yearGan) ? "DIZHI_YANG" : "DIZHI_YIN") : "DIZHI_ORDERED") : // 如果年干已填：阳干则显示阳支，阴干则显示阴支；未填年干则显示顺序地支
            (currentFocus === 'monthZhi' ? "DIZHI_SEASONAL" : // 如果焦点在月支，显示四季地支
            (currentFocus === 'hourZhi' ? "DIZHI_ORDERED" : // 如果焦点在时支，显示顺序地支
            (timeData.dayGan ? (['甲', '丙', '戊', '庚', '壬'].includes(timeData.dayGan) ? "DIZHI_YANG" : "DIZHI_YIN") : "DIZHI_ORDERED"))) // 如果焦点在日支：日干已填则根据阴阳显示对应地支，未填日干则显示顺序地支
          }
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display"> {/* 时间展示区域：用于显示当前选中的公历与农历日期时间信息 */}
        <div className="solar-info"> {/* 公历信息展示块：包含“公历：”标签、日期字符串及时间字符串 */}
          <span className="solar-label">公历：</span> {/* “公历：”标签 */}
          <span className="date-value">{solarDate}</span> {/* 公历日期值，由 solarDate 状态提供，格式如“2025年06月25日” */}
          <span className="time-value"> {/* 公历时间值，仅当 selectedSolar 存在时显示 solarTime，否则显示空字符串 */}
            {selectedSolar ? solarTime : ''} {/* 当已选中公历时间时显示时间字符串，否则显示空字符串 */}
          </span>
        </div>
        
        <div className="lunar-info"> {/* 农历信息展示块：包含“农历：”标签、日期字符串及时辰字符串 */}
          <span className="date-label">农历：</span> {/* “农历：”标签 */}
          <span className="date-value">{lunarDate}</span> {/* 农历日期值，由 lunarDate 状态提供，格式如“乙巳年五月三十” */}
          <span className="time-value">{lunarTime}</span> {/* 农历时辰值，由 lunarTime 状态提供，格式如“午时”或“早子时” */}
        </div>
      </div>
    </div>
  );
};

export default FourPillarsTime; // 导出当前组件，使其可被其他模块引入使用
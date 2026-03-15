/*
 * @file            frontend/src/components/LiuYao/LiuYaoReault/LiuYaoGridDisplay/LiuYaoGridDisplay.jsx
 * @description     六爻排盘网格展示组件，负责展示主卦、变卦及每爻的详细信息
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-02-22 19:00:00
 * @lastModified    2026-03-15 14:25:39
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建组件和使用 React Hooks
import React from 'react';
// 导入 PropTypes 库，用于组件 props 的类型检查，提升代码健壮性
import PropTypes from 'prop-types';
// 导入桌面端样式（CSS Modules）
import styles from './LiuYaoGridDisplay.desktop.module.css';
// 导入五行颜色样式
import '../../../../styles/elementColors.css';

// 默认显示配置
const defaultDisplayConfig = {
  // 行级别控制
  rows: {
    palace: true,  // 卦宫行
    name: true,    // 卦名行
    yao1: true,    // 初爻
    yao2: true,    // 二爻
    yao3: true,    // 三爻
    yao4: true,    // 四爻
    yao5: true,    // 五爻
    yao6: true     // 上爻
  },
  
  // 列级别控制
  columns: {
    liuShen: true,   // 六神列
    fuShen: true,    // 伏神列
    benGua: true,    // 本卦主体列
    shiYing: true,   // 世应列
    dongSymbol: true, // 动爻符号列
    bianGua: true,   // 变卦主体列
    bianShiYing: true // 变卦世应列
  },
  
  // 元素级别控制（覆盖行列配置）
  elements: {
    palace: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    name: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao1: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao2: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao3: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao4: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao5: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true },
    yao6: { liuShen: true, fuShen: true, benGua: true, shiYing: true, dongSymbol: true, bianGua: true, bianShiYing: true }
  }
};

// 计算最终的显示状态
const calculateDisplayState = (config, rowKey, columnKey) => {
  // 优先级：元素配置 > 行配置 && 列配置
  
  // 1. 检查行级别
  if (config.rows[rowKey] === false) {
    return false; // 整行隐藏
  }
  
  // 2. 检查列级别
  if (config.columns[columnKey] === false) {
    return false; // 整列隐藏
  }
  
  // 3. 检查元素级别（最高优先级）
  const elementConfig = config.elements[rowKey];
  if (elementConfig && elementConfig[columnKey] !== undefined) {
    return elementConfig[columnKey];
  }
  
  // 4. 默认显示
  return true;
};

/**
 * 根据爻性获取爻符号
 * @param {string} yaoNature - 爻性（阳/阴）
 * @returns {string} 爻符号（⚊/⚋）
 */
const getYaoSymbol = (yaoNature) => {
  return yaoNature === '阳' ? '⚊' : '⚋';
};

// 定义 LiuYaoGridDisplay 组件：六爻排盘网格展示组件
// 使用 React.memo 包装组件，避免在父组件重渲染时不必要的重新渲染
// props 参数说明：
//   - divinationData (object): 占卜数据对象，包含本卦、变卦、动爻等信息
//   - isColorMode (boolean): 是否启用彩色模式
//   - showAccessory (boolean): 是否显示卦身信息等附件内容
//   - showLiuShen (boolean): 是否显示六神列
//   - showShiYing (boolean): 是否显示世应列
//   - showFuShen (boolean): 是否显示伏神列
//   - displayConfig (object): 显示配置
const LiuYaoGridDisplay = React.memo(({ 
  divinationData, 
  isColorMode = false, 
  showAccessory = true, 
  showLiuShen = true, 
  showShiYing = true, 
  showFuShen = true,
  displayConfig = defaultDisplayConfig 
}) => {
  // 使用 React.useMemo 缓存是否有伏神的判断结果
  // 依赖项：divinationData.ben_gua_head?.fu_shen_wei_list
  // 优化目的：避免每次渲染都判断是否有伏神
  const hasFuShen = React.useMemo(
    () => !!(divinationData?.ben_gua_head?.fu_shen_wei_list && divinationData.ben_gua_head.fu_shen_wei_list.length > 0),
    [divinationData?.ben_gua_head?.fu_shen_wei_list]
  );

  // 优化 1：使用 React.useMemo 缓存动爻位置集合（Set）
  // 依赖项：divinationData.dong_yao_info?.positions
  // 优化目的：将数组转换为 Set，实现 O(1) 查找，避免在 map 中重复使用 includes
  const dongYaoPositionSet = React.useMemo(() => {
    const positions = divinationData?.dong_yao_info?.positions;
    if (!positions || positions.length === 0) return new Set();
    return new Set(positions);
  }, [divinationData?.dong_yao_info?.positions]);

  // 优化 2：使用 React.useMemo 缓存动爻符号映射（Map）
  // 依赖项：divinationData.dong_yao_info?.details
  // 优化目的：将数组转换为对象，实现 O(1) 查找，避免在 map 中重复使用 find
  const dongYaoSymbolMap = React.useMemo(() => {
    const details = divinationData?.dong_yao_info?.details;
    if (!details || details.length === 0) return {};
    return details.reduce((map, item) => {
      map[item.position] = item.symbol;
      return map;
    }, {});
  }, [divinationData?.dong_yao_info?.details]);

  // 使用 React.useMemo 缓存是否有动爻的判断结果
  // 依赖项：dongYaoPositionSet
  // 优化目的：避免每次渲染都判断是否有动爻
  const hasDongYao = React.useMemo(
    () => dongYaoPositionSet.size > 0,
    [dongYaoPositionSet]
  );

  // 计算实际需要显示的列
  // 保持向后兼容性：当 displayConfig 中未设置时，使用原来的参数
  const shouldShowLiuShen = displayConfig.columns.liuShen !== false && showLiuShen;
  const shouldShowFuShen = displayConfig.columns.fuShen !== false && showFuShen && hasFuShen;
  const shouldShowShiYing = displayConfig.columns.shiYing !== false && showShiYing;
  const shouldShowDongSymbol = displayConfig.columns.dongSymbol !== false;
  const shouldShowBianGua = displayConfig.columns.bianGua !== false;
  const shouldShowBianShiYing = displayConfig.columns.bianShiYing !== false && showShiYing;
  
  // 使用 React.useMemo 缓存网格列数的计算结果
  // 依赖项：shouldShowLiuShen, shouldShowFuShen, shouldShowShiYing, hasDongYao, shouldShowDongSymbol, shouldShowBianGua, shouldShowBianShiYing
  // 优化目的：避免每次渲染都计算网格列数
  const gridColumns = React.useMemo(() => {
    let columns = 0;
    if (shouldShowLiuShen) columns++;
    if (shouldShowFuShen) columns++;
    columns += 1; // 本卦主体列
    if (shouldShowShiYing) columns++; // 本卦世应列
    if (hasDongYao) {
      if (shouldShowDongSymbol) columns++; // 动爻符号列
      if (shouldShowBianGua) columns++; // 变卦主体列
      if (shouldShowBianShiYing) columns++; // 变卦世应列
    }
    return columns;
  }, [shouldShowLiuShen, shouldShowFuShen, shouldShowShiYing, hasDongYao, shouldShowDongSymbol, shouldShowBianGua, shouldShowBianShiYing]);

  // 优化 3：使用 React.useMemo 缓存变卦爻映射表
  // 依赖项：hasDongYao, divinationData.bian_gua_body?.length
  // 优化目的：将数组转换为对象，实现 O(1) 查找，避免在 map 中重复使用 find
  // 优化点：只依赖数组长度，避免数组引用变化导致不必要的重新计算
  const bianYaoMap = React.useMemo(() => {
    if (!hasDongYao || !divinationData?.bian_gua_body) return {};
    return divinationData.bian_gua_body.reduce((map, item) => {
      map[item.position] = item;
      return map;
    }, {});
  }, [hasDongYao, divinationData?.bian_gua_body?.length]);

  // 使用 React.useMemo 缓存本卦六冲六合占位符
  // 依赖项：divinationData.ben_gua_head?.chong_he
  // 优化目的：避免每次渲染都重新计算
  const benChongHePlaceholder = React.useMemo(() => {
    const chongHe = divinationData?.ben_gua_head?.chong_he || '';
    return chongHe.length > 0 ? '　' : '';
  }, [divinationData?.ben_gua_head?.chong_he]);

  // 使用 React.useMemo 缓存本卦六冲六合最后一个字符
  // 依赖项：divinationData.ben_gua_head?.chong_he
  // 优化目的：避免每次渲染都重新计算
  const benChongHeLastChar = React.useMemo(() => {
    const chongHe = divinationData?.ben_gua_head?.chong_he || '';
    return chongHe.length > 0 ? chongHe[chongHe.length - 1] : '';
  }, [divinationData?.ben_gua_head?.chong_he]);

  // 使用 React.useMemo 缓存变卦六冲六合占位符
  // 依赖项：divinationData.bian_gua_head?.chong_he
  // 优化目的：避免每次渲染都重新计算
  const bianChongHePlaceholder = React.useMemo(() => {
    const chongHe = divinationData?.bian_gua_head?.chong_he || '';
    return chongHe.length > 0 ? '　' : '';
  }, [divinationData?.bian_gua_head?.chong_he]);

  // 使用 React.useMemo 缓存变卦六冲六合最后一个字符
  // 依赖项：divinationData.bian_gua_head?.chong_he
  // 优化目的：避免每次渲染都重新计算
  const bianChongHeLastChar = React.useMemo(() => {
    const chongHe = divinationData?.bian_gua_head?.chong_he || '';
    return chongHe.length > 0 ? chongHe[chongHe.length - 1] : '';
  }, [divinationData?.bian_gua_head?.chong_he]);

  // 优化 4：使用 React.useMemo 缓存世身信息
  // 依赖项：divinationData.ben_gua_head?.shi_position, divinationData.ben_gua_body, divinationData.ben_gua_head?.shi_body, divinationData.ben_gua_head?.month_body
  // 优化目的：避免每次渲染都重新计算，直接使用后端返回的世爻位置
  // 优化点：完全消除了 find 调用，直接使用后端计算好的 shi_position
  const shiBodyInfo = React.useMemo(() => {
    const benGuaBody = divinationData?.ben_gua_body || [];
    const shiPosition = divinationData?.ben_gua_head?.shi_position;
    const shiYao = shiPosition ? benGuaBody.find(y => y.position === shiPosition) : null;
    const shiYaoNature = shiYao?.yao_nature || '';
    const shiBody = divinationData?.ben_gua_head?.shi_body || '';
    const monthBody = divinationData?.ben_gua_head?.month_body || '';
    
    return `${shiYao?.na_zhi || ''}爻持世，世卦身在${shiBody}；${shiYaoNature}爻持世，月卦身在${monthBody}`;
  }, [divinationData?.ben_gua_head?.shi_position, divinationData?.ben_gua_body?.length, divinationData?.ben_gua_head?.shi_body, divinationData?.ben_gua_head?.month_body]);

  // 如果没有占卜数据，则不渲染任何内容
  // 注意：必须在所有 React Hooks 调用之后进行早期返回
  if (!divinationData) {
    return null;
  }

  // 使用 try-catch 块捕获渲染过程中可能出现的错误
  // 错误处理策略：捕获任何渲染错误，并显示友好的错误提示
  // 这样可以防止单个组件的错误导致整个应用崩溃
  try {
    // 返回 JSX 元素，渲染六爻排盘网格
    return (
      <>
        <div className={`${styles.liuYaoDetails} ${isColorMode ? 'color-mode' : ''}`} role="listitem" aria-label="六爻详细排盘">
          <div className={`${styles.liuYaoGrid} ${styles[`columns-${gridColumns}`]}`}>
            {/* 卦宫行 */}
            {displayConfig.rows.palace && (
              <div className={styles.gridRow}>
                {shouldShowLiuShen && calculateDisplayState(displayConfig, 'palace', 'liuShen') && (
                  <div className={styles.gridCell}></div>
                )}
                {shouldShowFuShen && calculateDisplayState(displayConfig, 'palace', 'fuShen') && (
                  <div className={styles.gridCell}></div>
                )}
                {calculateDisplayState(displayConfig, 'palace', 'benGua') && (
                  <div className={styles.gridCell}>
                    <span>{divinationData.ben_gua_head?.palace || ''}宫{divinationData.ben_gua_head?.nature || ''}</span>
                  </div>
                )}
                {shouldShowShiYing && calculateDisplayState(displayConfig, 'palace', 'shiYing') && (
                  <div className={styles.gridCell}></div>
                )}
                {hasDongYao && shouldShowDongSymbol && calculateDisplayState(displayConfig, 'palace', 'dongSymbol') && (
                  <div key="dong-symbol-1" className={styles.gridCell}></div>
                )}
                {hasDongYao && shouldShowBianGua && calculateDisplayState(displayConfig, 'palace', 'bianGua') && (
                  <div key="bian-body-1" className={styles.gridCell}>
                    <span>{divinationData.bian_gua_head?.palace || ''}宫{divinationData.bian_gua_head?.nature || ''}</span>
                  </div>
                )}
                {hasDongYao && shouldShowBianShiYing && calculateDisplayState(displayConfig, 'palace', 'bianShiYing') && (
                  <div key="bian-si-ying-1" className={styles.gridCell}></div>
                )}
              </div>
            )}

            {/* 卦名行 */}
            {displayConfig.rows.name && (
              <div className={styles.gridRow}>
                {shouldShowLiuShen && calculateDisplayState(displayConfig, 'name', 'liuShen') && (
                  <div className={styles.gridCell}></div>
                )}
                {shouldShowFuShen && calculateDisplayState(displayConfig, 'name', 'fuShen') && (
                  <div className={styles.gridCell}></div>
                )}
                {calculateDisplayState(displayConfig, 'name', 'benGua') && (
                  <div className={styles.gridCell}>
                    <p>
                      <span className={styles.chongHe} data-element={benChongHeLastChar}>{benChongHePlaceholder}</span>
                      {divinationData.ben_gua_head?.name || ''}
                      <span className={styles.chongHe} data-element={benChongHeLastChar}>{benChongHeLastChar}</span>
                    </p>
                  </div>
                )}
                {shouldShowShiYing && calculateDisplayState(displayConfig, 'name', 'shiYing') && (
                  <div className={styles.gridCell}></div>
                )}
                {hasDongYao && shouldShowDongSymbol && calculateDisplayState(displayConfig, 'name', 'dongSymbol') && (
                  <div key="dong-symbol-2" className={styles.gridCell}></div>
                )}
                {hasDongYao && shouldShowBianGua && calculateDisplayState(displayConfig, 'name', 'bianGua') && (
                  <div key="bian-body-2" className={styles.gridCell}>
                    <p>
                      <span className={styles.chongHe} data-element={bianChongHeLastChar}>{bianChongHePlaceholder}</span>
                      {divinationData.bian_gua_head?.name || ''}
                      <span className={styles.chongHe} data-element={bianChongHeLastChar}>{bianChongHeLastChar}</span>
                    </p>
                  </div>
                )}
                {hasDongYao && shouldShowBianShiYing && calculateDisplayState(displayConfig, 'name', 'bianShiYing') && (
                  <div key="bian-si-ying-2" className={styles.gridCell}></div>
                )}
              </div>
            )}

            {/* 六爻行 */}
            {divinationData.ben_gua_body && divinationData.ben_gua_body.map((yao, index) => {
              const bianYao = hasDongYao ? bianYaoMap[yao.position] : null;
              const rowKey = `yao${7 - yao.position}`; // 生成行键：yao1 (初爻) 到 yao6 (上爻)
              
              // 检查行级别显示控制
              if (!displayConfig.rows[rowKey]) {
                return null;
              }
              
              return (
                <div key={`ben-yao-${index}`} className={styles.gridRow}>
                  {shouldShowLiuShen && calculateDisplayState(displayConfig, rowKey, 'liuShen') && (
                    <div className={styles.gridCell}>
                      <span className={styles.liuShen} data-element={yao.liu_shen || ''}>{yao.liu_shen || ''}</span>
                    </div>
                  )}
                  {shouldShowFuShen && calculateDisplayState(displayConfig, rowKey, 'fuShen') && (
                    <div className={styles.gridCell}>
                      <span>{yao.fu_qin || ''}</span>
                      <span data-element={yao.fu_gan || ''}>{yao.fu_gan || ''}</span>
                      <span className={styles.fuZhi} data-element={yao.fu_zhi || ''}>{yao.fu_zhi || ''}</span>
                    </div>
                  )}
                  {calculateDisplayState(displayConfig, rowKey, 'benGua') && (
                    <div className={styles.gridCell}>
                      <span className={styles.liuQin}>{yao.liu_qin || ''}</span>
                      <span 
                        className={styles.yaoShape}
                        style={isColorMode && dongYaoPositionSet.has(yao.position) ? {
                          color: yao.yao_nature === '阳' ? '#C00000' : '#0070C0'
                        } : {}}
                      >
                        {getYaoSymbol(yao.yao_nature)}
                      </span>
                      <span className={styles.yaoGan} data-element={yao.na_gan || ''}>{yao.na_gan || ''}</span>
                      <span className={styles.yaoZhi} data-element={yao.na_zhi || ''}>{yao.na_zhi || ''}</span>
                    </div>
                  )}
                  {shouldShowShiYing && calculateDisplayState(displayConfig, rowKey, 'shiYing') && (
                    <div className={styles.gridCell}>
                      <span className={styles.yaoSiYin}>{yao.shi_ying || ''}</span>
                    </div>
                  )}
                  {hasDongYao && shouldShowDongSymbol && calculateDisplayState(displayConfig, rowKey, 'dongSymbol') && (
                    <div className={styles.gridCell}>
                      <span className={styles.dongYao}>{dongYaoSymbolMap[yao.position] || ''}</span>
                    </div>
                  )}
                  {hasDongYao && shouldShowBianGua && calculateDisplayState(displayConfig, rowKey, 'bianGua') && (
                    <div className={styles.gridCell}>
                      {bianYao && (
                        <>
                          <span className={styles.liuQin}>{bianYao.liu_qin || ''}</span>
                          <span className={styles.yaoShape}>{getYaoSymbol(bianYao.yao_nature)}</span>
                          <span className={styles.yaoGan} data-element={bianYao.na_gan || ''}>{bianYao.na_gan || ''}</span>
                          <span className={styles.yaoZhi} data-element={bianYao.na_zhi || ''}>{bianYao.na_zhi || ''}</span>
                        </>
                      )}
                    </div>
                  )}
                  {hasDongYao && shouldShowBianShiYing && calculateDisplayState(displayConfig, rowKey, 'bianShiYing') && (
                    <div className={styles.gridCell}>
                      {bianYao && (
                        <span className={styles.yaoSiYin}>{bianYao.shi_ying || ''}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showAccessory && (
          <div className={styles.liuYaoAccessory} role="complementary" aria-label="主卦补充信息">
            <p>
              主卦{shiBodyInfo}
            </p>
          </div>
        )}
      </>
    );
  } catch (error) {
    // 捕获渲染过程中的任何错误
    // 在控制台输出错误信息，便于开发调试
    console.error('LiuYaoGridDisplay 渲染错误:', error);
    
    // 返回错误状态的 JSX 元素
    // 显示友好的错误提示信息，而不是崩溃
    // role="alert"：ARIA 角色，表示这是一个警告信息
    // aria-label="六爻排盘加载失败"：为屏幕阅读器提供描述信息
    return (
      <div className={styles.liuYaoError} role="alert" aria-label="六爻排盘加载失败">
        六爻排盘加载失败，请稍后重试
      </div>
    );
  }
});

// 为 LiuYaoGridDisplay 组件添加 PropTypes 类型定义
// 使用 PropTypes.shape 定义对象类型的详细结构，提升类型安全性
LiuYaoGridDisplay.propTypes = {
  divinationData: PropTypes.shape({
    ben_gua_head: PropTypes.shape({
      palace: PropTypes.string,
      nature: PropTypes.string,
      name: PropTypes.string,
      chong_he: PropTypes.string,
      shi_body: PropTypes.string,
      month_body: PropTypes.string,
      shi_position: PropTypes.number,
      ying_position: PropTypes.number,
      fu_shen_wei_list: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.number,
        fu_qin: PropTypes.string,
        fu_gan: PropTypes.string,
        fu_zhi: PropTypes.string
      }))
    }),
    ben_gua_body: PropTypes.arrayOf(PropTypes.shape({
      position: PropTypes.number,
      liu_shen: PropTypes.string,
      liu_qin: PropTypes.string,
      fu_qin: PropTypes.string,
      fu_gan: PropTypes.string,
      fu_zhi: PropTypes.string,
      yao_nature: PropTypes.string,
      na_gan: PropTypes.string,
      na_zhi: PropTypes.string,
      shi_ying: PropTypes.string
    })),
    bian_gua_head: PropTypes.shape({
      palace: PropTypes.string,
      nature: PropTypes.string,
      name: PropTypes.string,
      shi_position: PropTypes.number,
      ying_position: PropTypes.number
    }),
    bian_gua_body: PropTypes.arrayOf(PropTypes.shape({
      position: PropTypes.number,
      liu_qin: PropTypes.string,
      yao_nature: PropTypes.string,
      na_gan: PropTypes.string,
      na_zhi: PropTypes.string,
      shi_ying: PropTypes.string
    })),
    dong_yao_info: PropTypes.shape({
      positions: PropTypes.arrayOf(PropTypes.number),
      count: PropTypes.number,
      details: PropTypes.arrayOf(PropTypes.shape({
        position: PropTypes.number,
        symbol: PropTypes.string,
        yao_nature: PropTypes.string
      }))
    })
  }),
  isColorMode: PropTypes.bool, /* 是否启用颜色模式 */
  showAccessory: PropTypes.bool, /* 是否显示补充信息 */
  showLiuShen: PropTypes.bool, /* 是否显示六神 */
  showShiYing: PropTypes.bool, /* 是否显示四运 */
  showFuShen: PropTypes.bool, /* 是否显示福神 */
  displayConfig: PropTypes.shape({
    rows: PropTypes.shape({
      palace: PropTypes.bool,
      name: PropTypes.bool,
      yao1: PropTypes.bool,
      yao2: PropTypes.bool,
      yao3: PropTypes.bool,
      yao4: PropTypes.bool,
      yao5: PropTypes.bool,
      yao6: PropTypes.bool
    }),
    columns: PropTypes.shape({
      liuShen: PropTypes.bool,
      fuShen: PropTypes.bool,
      benGua: PropTypes.bool,
      shiYing: PropTypes.bool,
      dongSymbol: PropTypes.bool,
      bianGua: PropTypes.bool,
      bianShiYing: PropTypes.bool
    }),
    elements: PropTypes.shape({
      palace: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      name: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao1: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao2: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao3: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao4: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao5: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      }),
      yao6: PropTypes.shape({
        liuShen: PropTypes.bool,
        fuShen: PropTypes.bool,
        benGua: PropTypes.bool,
        shiYing: PropTypes.bool,
        dongSymbol: PropTypes.bool,
        bianGua: PropTypes.bool,
        bianShiYing: PropTypes.bool
      })
    })
  })
};

// 为 LiuYaoGridDisplay 组件添加 displayName，便于在 React DevTools 中调试
LiuYaoGridDisplay.displayName = 'LiuYaoGridDisplay';

// 导出 LiuYaoGridDisplay 组件作为默认导出
// 这样其他文件可以通过 import LiuYaoGridDisplay from './LiuYaoGridDisplay' 导入使用
export default LiuYaoGridDisplay;
export { defaultDisplayConfig }; // 导出默认显示配置

/*
 * @file            frontend/src/data/ganZhiData.js
 * @description     干支基础数据，包含阳干、阴干、阳支、阴支等基础数据
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-19 15:35:00
 * @lastModified    2026-02-19 15:37:54
 * Copyright © All rights reserved
*/

export const YANG_GANS = ['甲', '丙', '戊', '庚', '壬']; // 定义阳干数组（甲、丙、戊、庚、壬）

export const YIN_GANS = ['乙', '丁', '己', '辛', '癸']; // 定义阴干数组（乙、丁、己、辛、癸）

export const YANG_ZHIS = ['子', '寅', '辰', '午', '申', '戌']; // 定义阳支数组（子、寅、辰、午、申、戌）

export const YIN_ZHIS = ['丑', '卯', '巳', '未', '酉', '亥']; // 定义阴支数组（丑、卯、巳、未、酉、亥）

export const ALL_GANS = [...YANG_GANS, ...YIN_GANS]; // 定义所有天干数组（阳干+阴干）

export const ALL_ZHIS = [...YANG_ZHIS, ...YIN_ZHIS]; // 定义所有地支数组（阳支+阴支）
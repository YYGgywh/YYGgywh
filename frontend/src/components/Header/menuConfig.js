/*
 * @file            frontend/src/components/Header/menuConfig.js
 * @description     导航菜单配置数据
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 21:30:00
 * @lastModified    2026-02-18 21:42:12
 * Copyright © All rights reserved
*/

export const menuItems = [
  { name: '广场', hasDropdown: false },
  {
    name: '排盘',
    hasDropdown: true,
    dropdownConfig: {
      columns: [
        {
          title: '命理排盘',
          className: 'dropdown-col-word',
          items: [
            {
              title: '八字',
              href: '#',
              icon: '★'
            },
            {
              title: '紫微',
              href: '#',
              icon: '★'
            }
          ]
        },
        {
          title: '卦爻排盘',
          className: 'dropdown-col-word',
          items: [
            {
              title: '六爻',
              href: '#',
              icon: '★'
            },
            {
              title: '梅花',
              href: '#',
              icon: '★'
            }
          ]
        },
        {
          title: '三式排盘',
          className: 'dropdown-col-word',
          items: [
            {
              title: '奇门',
              href: '#',
              icon: '★'
            },
            {
              title: '六壬',
              href: '#',
              icon: '★'
            },
            {
              title: '太乙',
              href: '#',
              icon: '★'
            }
          ]
        }
      ]
    }
  },
  { name: '藏经阁', hasDropdown: false },
  { name: 'TEST', hasDropdown: false }
];

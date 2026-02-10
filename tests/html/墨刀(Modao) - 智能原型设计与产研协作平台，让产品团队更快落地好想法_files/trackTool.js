var ENTRY_MAP = {
  'a1': 'A1-官网首页',
  'a2': 'A2-原型页',
  'a3': 'A3-设计协作',
  'a4': 'A4-定价页',
  'a5': 'A5-下载页',
  'a6': 'A6-素材广场',
  'a7': 'A7-素材详情页',
  'a8': 'A8-素材-工作台',
  'a9': 'A9-素材-作者页',
  'a10': 'A10-企业版',
  'a11': 'A11-帮助中心',
  'a12': 'A12-私有化',
  'a13': 'A13-教育',
  'a14': 'A14-搜索-原型',
  'a15': 'A15-搜索-竞品词',
  'a16': 'A16-搜索-AI页面',
  'a17': 'A17-搜索-移动端设计',
  'a18': 'A18-搜索-网站设计',
  'a19': 'A19-搜索-H5设计',
  'a20': 'A20-搜索-UI设计',
  'a21': 'A21-搜索-logo设计',
  'a22': 'A22-搜索-产品原型',
  // -----------------------------------------------------
  'a24': 'A24-搜索-原型b',
  'a25': 'A25-搜索-竞品词b',
  'a23': 'A23-搜索-app设计b',
  'a26': 'A26-搜索-移动端设计b',
  'a27': 'A27-搜索-网站设计b',
  'a28': 'A28-搜索-H5设计b',
  'a29': 'A29-搜索-UI设计b',
  'a31': 'A31-搜索-logo设计b',
  'a30': 'A30-搜索-产品原型b',
  // -----------------------------------------------------
  'a64': 'A64-AI页面',
  'a69': 'A69-搜索-场景化-APP',
  'a71': 'A71-搜索-场景化-后台',
  'a73': 'A73-搜索-场景化-可视化大屏',
  'a75': 'A75-搜索-场景化-web页面',
  'a77': 'A77-搜索-场景化-小程序',
  'a79': 'A79-搜索-场景化-H5',
  'a80': 'A80-广告-原型',
  // ----------------------------------
  'a68': 'A68-场景化-APP',
  'a70': 'A70-场景化-后台',
  'a72': 'A72-场景化-可视化大屏',
  'a74': 'A74-场景化-web页面',
  'a76': 'A76-场景化-小程序',
  'a78': 'A78-场景化-H5',
  'a81': 'A81-axure文件导入',
  'a82': 'A82-搜索-首页新',
  'a84': 'A84-搜索-axure文件导入',
  'a85': 'A85-搜索-素材',
  'a86': 'A86-Axure托管',
  'a87': 'A87-搜索-Axure托管',
  'a88': 'A88-搜索-Axure替代',
  'a89': 'A89-搜索-AI视频',
  'a90': 'A90-搜索-Web视频',
  'a91': 'A91-搜索-APP视频',
  'a92': 'A92-搜索-Backstage视频'
}

var HEAD_TRACK_MAP = {
  '/': 'A1-官网首页',
  '/brand': 'A1-官网首页',
  '/feature/home': 'A1-官网首页',
  '/feature/home.html': 'A1-官网首页',

  '/feature/prototype': 'A2-原型页',
  '/feature/prototype/': 'A2-原型页',
  '/feature/prototype/index.html': 'A2-原型页',

  '/feature/aboard': 'A3-设计协作',
  '/feature/aboard/': 'A3-设计协作',
  '/feature/aboard/index.html': 'A3-设计协作',
  '/feature/aboard/index': 'A3-设计协作',

  '/feature/downloads': 'A5-下载页',
  '/feature/downloads.html': 'A5-下载页',

  '/feature/enterprise': 'A10-企业版',
  '/feature/enterprise.html': 'A10-企业版',

  '/feature/privatize': 'A12-私有化',
  '/feature/privatize.html': 'A12-私有化',

  '/usergrowth/prototype/design': 'A14-搜索-原型',
  '/usergrowth/prototype/design.html': 'A14-搜索-原型',

  '/usergrowth/jinpinsheji': 'A15-搜索-竞品词',
  '/usergrowth/jinpinsheji.html': 'A15-搜索-竞品词',

  '/usergrowth/ai': 'A16-搜索-AI页面',
  '/usergrowth/ai.html': 'A16-搜索-AI页面',

  '/usergrowth/yidongduansheji': 'A17-搜索-移动端设计',
  '/usergrowth/yidongduansheji.html': 'A17-搜索-移动端设计',

  '/usergrowth/wangzhansheji': 'A18-搜索-网站设计',
  '/usergrowth/wangzhansheji.html': 'A18-搜索-网站设计',

  '/usergrowth/h5sheji': 'A19-搜索-H5设计',
  '/usergrowth/h5sheji.html': 'A19-搜索-H5设计',

  '/usergrowth/uisheji': 'A20-搜索-UI设计',
  '/usergrowth/uisheji.html': 'A20-搜索-UI设计',

  '/usergrowth/logosheji': 'A21-搜索-logo设计',
  '/usergrowth/logosheji.html': 'A21-搜索-logo设计',

  '/usergrowth/prototype': 'A22-搜索-产品原型',
  '/usergrowth/prototype.html': 'A22-搜索-产品原型',

  // -----------------------------------------------------

  '/usergrowth/prototype/design-b': 'A24-搜索-原型b',
  '/usergrowth/prototype/design-b.html': 'A24-搜索-原型b',

  '/usergrowth/jinpinsheji-b': 'A25-搜索-竞品词b',
  '/usergrowth/jinpinsheji-b.html': 'A25-搜索-竞品词b',

  '/usergrowth/appsheji-b': 'A23-搜索-app设计b',
  '/usergrowth/appsheji-b.html': 'A23-搜索-app设计b',

  '/usergrowth/yidongduansheji-b': 'A26-搜索-移动端设计b',
  '/usergrowth/yidongduansheji-b.html': 'A26-搜索-移动端设计b',

  '/usergrowth/wangzhansheji-b': 'A27-搜索-网站设计b',
  '/usergrowth/wangzhansheji-b.html': 'A27-搜索-网站设计b',

  '/usergrowth/h5sheji-b': 'A28-搜索-H5设计b',
  '/usergrowth/h5sheji-b.html': 'A28-搜索-H5设计b',

  '/usergrowth/uisheji-b': 'A29-搜索-UI设计b',
  '/usergrowth/uisheji-b.html': 'A29-搜索-UI设计b',

  '/usergrowth/logosheji-b': 'A31-搜索-logo设计b',
  '/usergrowth/logosheji-b.html': 'A31-搜索-logo设计b',

  '/usergrowth/prototype-b': 'A30-搜索-产品原型b',
  '/usergrowth/prototype-b.html': 'A30-搜索-产品原型b',

  // 2023-01-31 新增cms页面

  '/feature/flowchart': 'A34-流程图',
  '/feature/flowchart/': 'A34-流程图',
  '/feature/flowchart/index': 'A34-流程图',
  '/feature/flowchart/index.html': 'A34-流程图',

  '/feature/mind-map': 'A35-思维导图',
  '/feature/mind-map/': 'A35-思维导图',
  '/feature/mind-map/index': 'A35-思维导图',
  '/feature/mind-map/index.html': 'A35-思维导图',

  '/feature/enterprise-case-page': 'A36-行业案例',
  '/feature/enterprise-case-page.html': 'A36-行业案例',

  '/feature/plugin-sketch': 'A38-sketch插件',
  '/feature/plugin-sketch.html': 'A38-sketch插件',

  '/feature/plugin-adobe-xd': 'A39-xd插件',
  '/feature/plugin-adobe-xd.html': 'A39-xd插件',

  '/feature/plugin-photoshop': 'A40-ps插件',
  '/feature/plugin-photoshop.html': 'A40-ps插件',

  '/feature/axure-import/': 'A41-axure上传',
  '/feature/axure-import': 'A41-axure上传',
  '/feature/axure-import/index': 'A41-axure上传',
  '/feature/axure-import/index.html': 'A41-axure上传',

  '/feature/character/': 'A42-特性',
  '/feature/character': 'A42-特性',
  '/feature/character/index': 'A42-特性',
  '/feature/character/index.html': 'A42-特性',

  '/feature/introduction.html': 'A43-向团队介绍',
  '/feature/introduction': 'A43-向团队介绍',

  '/common-page/about-us': 'A48-关于我们',
  '/common-page/about-us.html': 'A48-关于我们',

  '/knowledge-community': 'A47-知识社区',
  '/knowledge-community/': 'A47-知识社区',
  '/knowledge-community/index': 'A47-知识社区',
  '/knowledge-community/index.html': 'A47-知识社区',

  '/common-page/about-us.html': 'A48-关于我们',
  '/common-page/about-us': 'A48-关于我们',
  '/activities/collection.html': 'A51-活动集锦',
  '/activities/collection': 'A51-活动集锦',

  '/feature/design': 'A57-设计页',
  '/feature/design/': 'A57-设计页',
  '/feature/design/index': 'A57-设计页',
  '/feature/design/index.html': 'A57-设计页',

  '/usergrowth.html': 'A61-搜索-首页新',
  '/usergrowth': 'A61-搜索-首页新',

  '/usergrowth/prototype/v8.html': 'A62-搜索-原型新',
  '/usergrowth/prototype/v8': 'A62-搜索-原型新',

  '/usergrowth/aboard.html': 'A63-搜索-协作新',
  '/usergrowth/aboard': 'A63-搜索-协作新',

  // 2024.03.14新增

  '/usergrowth/app': 'A69-搜索-场景化-APP',
  '/usergrowth/app.html': 'A69-搜索-场景化-APP',

  '/usergrowth/backstage': 'A71-搜索-场景化-后台',
  '/usergrowth/backstage.html': 'A71-搜索-场景化-后台',

  '/usergrowth/screen': 'A73-搜索-场景化-可视化大屏',
  '/usergrowth/screen.html': 'A73-搜索-场景化-可视化大屏',

  '/usergrowth/webpage': 'A75-搜索-场景化-web页面',
  '/usergrowth/webpage.html': 'A75-搜索-场景化-web页面',

  '/usergrowth/miniapp': 'A77-搜索-场景化-小程序',
  '/usergrowth/miniapp.html': 'A77-搜索-场景化-小程序',

  '/usergrowth/h5': 'A79-搜索-场景化-H5',
  '/usergrowth/h5.html': 'A79-搜索-场景化-H5',

  '/usergrowth/prototype/new': 'A80-广告-原型',
  '/usergrowth/prototype/new.html': 'A80-广告-原型',

  '/usergrowth/home': 'A82-搜索-品牌页面',
  '/usergrowth/home.html': 'A82-搜索-品牌页面',

  // 2024.04.24新增
  '/feature/ai': 'A64-AI页面',
  '/feature/ai.html': 'A64-AI页面',

  '/feature/app': 'A68-场景化-APP',
  '/feature/app.html': 'A68-场景化-APP',

  '/feature/backstage': 'A70-场景化-后台',
  '/feature/backstage.html': 'A70-场景化-后台',

  '/feature/screen': 'A72-场景化-可视化大屏',
  '/feature/screen.html': 'A72-场景化-可视化大屏',

  '/feature/webpage': 'A74-场景化-web页面',
  '/feature/webpage.html': 'A74-场景化-web页面',

  '/feature/miniapp': 'A76-场景化-小程序',
  '/feature/miniapp.html': 'A76-场景化-小程序',

  '/feature/h5': 'A78-场景化-H5',
  '/feature/h5.html': 'A78-场景化-H5',

  '/feature/axure-import/index.html': 'A81-axure文件导入',
  '/feature/axure-import/index': 'A81-axure文件导入',

  '/usergrowth/axure-import/index.html': 'A84-搜索-axure文件导入',
  '/usergrowth/axure-import/index': 'A84-搜索-axure文件导入',

  '/usergrowth/material': 'A85-搜索-素材',
  '/usergrowth/material.html': 'A85-搜索-素材',

  '/feature/axure-hosting': 'A86-Axure托管',
  '/feature/axure-hosting.html': 'A86-Axure托管',


  '/usergrowth/axure-hosting': 'A87-搜索-Axure托管',
  '/usergrowth/axure-hosting.html': 'A87搜索-Axure托管',

  '/usergrowth/axure-delivery': 'A88-搜索-Axure替代',
  '/usergrowth/axure-delivery.html': 'A88-搜索-Axure替代',

  '/usergrowth/ai-b.html': 'A89-搜索-AI视频',
  '/usergrowth/ai-b': 'A89-搜索-AI视频',

  '/usergrowth/web-b.html': 'A90-搜索-Web视频',
  '/usergrowth/web-b': 'A90-搜索-Web视频',

  '/usergrowth/app-b.html': 'A91-搜索-APP视频',
  '/usergrowth/app-b': 'A91-搜索-App视频',

  '/usergrowth/backstage-b.html': 'A92-搜索-Backstage视频',
  '/usergrowth/backstage-b': 'A92-搜索-Backstage视频',
}

var ENTRY_REG_MAP = [
  [/^\/design(\/[\S]*)*/, 'A54-seo文章-设计'],
  [/^\/prototyping(\/[\S]*)*/, 'A53-seo文章-原型'],
  [/^\/mindmap(\/[\S]*)*/, 'A56-seo文章-思维导图'],
  [/^\/flowchart(\/[\S]*)*/, 'A55-seo文章-流程图']
]

var ENTRY_TERM_NAME_MAP = {
  'guide_sign': '导航-登录/注册',
  'top_free': '头图-免费使用',
  'solo_use_btn': '首页个人使用按钮',
  'org_use_btn': '首页团队使用按钮',
  'top_wx': '头图-微信登录',
  'top_feishu': '头图-飞书登录',
  'foot_free': '底部-免费使用',
  'org_free_use': '企业-免费版-免费使用',
  'org_lite_use': '企业-团队版-立即购买',
  'org_full_use': '企业-企业版-立即购买',
  'solo_free_use': '个人-免费版-立即使用',
  'solo_use': '个人-标准版-立即购买',
  'solo_sea_use': '个人-标准版-按季购买',
  'solo_good_use': '个人-终身版-立即购买',
  'mkt_pub': '发布素材',
  'thumb': '点赞',
  'collect': '收藏',
  'sign_notice': '注册提示',
  'download': '下载',
  'share': '分享',
  'follow': '关注',
  'content_exp_now': '内容-立即体验',
  'guide_free_use': '导航-登录/免费使用',
  'content_free_use': '内容-免费使用',
  'part_design': '分页面-设计',
  'part_proto': '分页面-原型',
  'part_prd': '分页面-prd',
  'part_contact': '分页面-交互',
  'part_share': '分页面-分享',
  // 2024.04.16
  'content_scenario': '内容-工作场景',
  'content_advantage': '内容-优势模块',
  'part_axure': '分页面-axure导入',

  'part_mkt': '分页面-素材',
  'part_require': '分页面-需求文档',
  'part_co': '分页面-在线协作',
  'part_enterprise': '分页面-企业',
  'part_migrate': '分页面-迁移',
  // 2024.03.07新增
  'part_free': '分页面-免费使用',
  'foot_mtk': '底部-素材模块',
  'app_mtk': '底部-APP素材案例',
  'web_mtk': '底部-网页素材案例',
  'screen_mtk': '底部-大屏素材案例',
  'backstage_mtk': '底部-后台素材案例',

  // 1222 新增原型分享埋点
  'sign_top_right': '登录-右上角',
  'free_use': '免费使用',
  'sign_middle': '登录-中间',
  'join_now': '立即加入',
  'no_comment_sign': '无评论注册',
  'has_comment_sign': '有评论注册',

  // 1223 新增微信默认授权注册
  'wechat_auth': '活动拉新授权注册',

  // 2023.1.16新增如下entry_term
  'top_signin_signup': '头图-注册/登录',
  'top_free_trial': '头图-免费试用',
  'content_intro': '内容-介绍文档',
  'content_co': '内容-协作',
  'content_efficient': '内容-效率',
  'content_good': '内容-资产',
  'content_import': '内容-文件导入',

  'free_study': '免费学习',
  'only_buy': '单独购买',
  'content_request': '内容-任务',
  'content_get_vip': '内容-会员领取',

  'center_commit': '中间评论',
  'left_commit': '右上角评论',
  'enter_develop': '左上角开发',
  'double_click_artboard': '点击页面内的图片',

  'content_mkt': '内容-素材按钮',
  'content_inter': '内容-交互按钮',
  'content_doc': '内容-文档按钮',

  // 2023.1.30 为解决形如在 /embed/auth_box 页面进行的登录
  'direct_to_workspace_no_sign': '未登录-访问编辑区链接',

  // 20230330 新增
  'part_work_scenes': '分页面-工作场景',
  'part_proto_temp': '分页面-原型模版',
  'part_multi_char': '分页面-多角色',

  'free_work_scenes': '工作场景-免费使用',
  'free_multi_char': '多角色-免费使用',

  // 20230505 新增官网视频模块
  'video_block': '视频模块',
  // 20240408 新增
  'feature_free': '功能介绍-免费使用',
  'scene_intro_free_app': '场景介绍-APP免费使用',
  'scene_intro_backend_free': '场景介绍-后台免费使用',
  'scene_intro_web_free': '场景介绍-网页免费使用',
  'scene_intro_miniapp_free': '场景介绍-小程序免费使用',
  'scene_intro_h5_free': '场景介绍-H5免费使用',
  'scene_intro_visual_screen_free': '场景介绍-可视化大屏幕免费使用',
  'scene_intro_industrial_hmi_free': '场景介绍-工业HMI免费使用',
  'mkt_explore_more': '素材案例-探索更多灵感',
  'learn_more': '了解更多',

  'upload_zip': '上传原型压缩包',
  'download_zip': '下载浏览器插件',
  'feature_free_hosting': '功能介绍-免费托管',
  'axure_to_md': 'Axure 转向墨刀',
  'towards_mkt': '素材广场'
}

var DOWNLOAD_URL = '/feature/downloads.html'
var DOWNLOAD_PS_URL = '/feature/plugin-photoshop.html'
var DOWNLOAD_XD_URL = '/feature/plugin-adobe-xd.html'
var DOWNLOAD_Sketch_URL = '/feature/plugin-sketch.html'
var PC_DOWNLOAD_ARRAY = ['MacOS-下载客户端', 'win64位', 'win32位', '通用兼容版', 'Linux-下载客户端']
var Phone_DOWNLOAD_ARRAY = ['ios-下载安装包', 'Android-下载安装包']
var DOWNLOAD_TYPE = ['sketch插件', 'Adobe XD', 'PhotoShop', 'MacOS', 'Windows', 'Linux', 'ios', 'Android']

var TrackTool = {
  navigationBarTrack: function (downloadIndex) {
    var downloadPage
    if (location.pathname.indexOf(DOWNLOAD_URL)) {
      downloadPage = '下载页'
    } else if (location.pathname.indexOf(DOWNLOAD_PS_URL)) {
      downloadPage = 'ps页'
    } else if (location.pathname.indexOf(DOWNLOAD_XD_URL)) {
      downloadPage = 'xd页'
    } else if (location.pathname.indexOf(DOWNLOAD_Sketch_URL)) {
      downloadPage = 'sketch页'
    }
    sensors && sensors.track && sensors.track('navigation_bar_download_button_click', {
      avigation_bar: DOWNLOAD_TYPE[downloadIndex],
      download_page: downloadPage
    })
  },

  pcDownloadTrack: function (index) {
    sensors && sensors.track && sensors.track('pc_download_button_click', {
      PC_button: PC_DOWNLOAD_ARRAY[index]
    })
  },

  phoneDownloadTrack: function (index) {
    sensors && sensors.track && sensors.track('phone_download_button_click', {
      PC_button: Phone_DOWNLOAD_ARRAY[index]
    })
  },

  downloadTrack: function (clickEvent, placeType) {
    var place
    if (placeType === 'top') {
      place = 'upwordside_button'
    } else if (placeType === 'down') {
      place = 'upwordside_button'
    } else if (placeType === null) {
      place = 'Sketch旧版插件下载按钮'
    }
    sensors && sensors.track && sensors.track(clickEvent, {
      button_clink_place: place
    })
  },

  eduApplyBtnTrack: function (clickEvent, placeType) {
    var place
    if (placeType === 'top') {
      place = '上方'
    } else if (placeType === 'down') {
      place = '底部'
    } else if (placeType === 'between') {
      place = '中部'
    }
    sensors && sensors.track && sensors.track(clickEvent, {
      bedu_button_place: place
    })
  },

  intrFreeBtnTrack: function (clickEvent, placeType) {
    var place
    if (placeType === 'top') {
      place = '顶部'
    } else if (placeType === 'between1') {
      place = '中1'
    } else if (placeType === 'between2') {
      place = '中2'
    } else if (placeType === 'between3') {
      place = '中3'
    } else if (placeType === 'between4') {
      place = '中4'
    }
    sensors && sensors.track && sensors.track(clickEvent, {
      introduce_trial_button_place: place
    })
  },

  introduceTrack: function (clickEvent) {
    sensors && sensors.track && sensors.track(clickEvent)
  },

  toufangBtns: function (place) {
    sensors && sensors.track && sensors.track('toufang_all_button_click', {
      toufang_clickSource: place
    })
  },

  // https://modao.cc/brand 页面
  brandTrack: {
    clickLoginBtn: function () {
      sensors && sensors.track && sensors.track('brand_login_button')
    },
    clickGoWorkspace: function () {
      sensors && sensors.track && sensors.track('brand_workingarea_button')
    },
    clickGoEachPro: function (proName) {
      sensors && sensors.track && sensors.track('brand_allproduct_button', {
        brand_categorychoose: proName
      })
    },
    clickTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('brand_mianfeishiyong_button')
    }
  },

  // https://modao.cc/feature/prototype/ 页面
  protoTrack: {
    clickLoginBtn: function () {
      sensors && sensors.track && sensors.track('prototype_login_button')
    },
    clickGoWorkspace: function () {
      sensors && sensors.track && sensors.track('prototype_workingarea_button')
    },
    clickVideoPlayBtn: function (isLogin) {
      if (!sensors || !sensors.track) return
      sensors.track('prototype_videoplayer_button')
      sensors.track('video_button_click', { sign_in_out: isLogin ? 1 : 0 })
    },
    clickGuideBtn: function () {
      sensors && sensors.track && sensors.track('prototype_guidebook_button')
    },
    clickAxureBtn: function () {
      sensors && sensors.track && sensors.track('prototype_axureusing_button')
    },
    clickTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('prototype_mianfeishiyong_button')
    },
    clickTransferBtn: function () {
      if (!sensors || !sensors.track) return
      sensors.track('axure_button_click')
    }
  },

  // https://modao.cc/feature/aboard/ 页面
  abordTrack: {
    clickLoginBtn: function () {
      sensors && sensors.track && sensors.track('aboard_login_button')
    },
    clickGoWorkspace: function () {
      sensors && sensors.track && sensors.track('aboard_workingarea_button')
    },
    clickDownloadPlugin: function (param) {
      sensors && sensors.track && sensors.track('aboard_plugIn_button', {
        aboard_plugIn_category: param
      })
    },
    clickTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('aboard_mianfeishiyong_button')
    }
  },

  // https://modao.cc/feature/flowchart/ 页面
  flowChartTrack: {
    clickLoginBtn: function () {
      sensors && sensors.track && sensors.track('flowchart_login_button')
    },
    clickGoWorkspace: function () {
      sensors && sensors.track && sensors.track('flowchart_workingarea_button')
    },
    clickTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('flowchart_mianfeishiyong_button')
    }
  },

  // https://modao.cc/feature/mind-map/ 页面
  mindmapTrack: {
    clickLoginBtn: function () {
      sensors && sensors.track && sensors.track('mindmap_login_button')
    },
    clickGoWorkspace: function () {
      sensors && sensors.track && sensors.track('mindmap_workingarea_button')
    },
    clickTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('mindmap_mianfeishiyong_button')
    }
  },

  // 导航栏埋点
  topNavTrack: {
    // caseName: 圆通、联想、创业邦
    clickCaseBtn: function (caseName) {
      sensors && sensors.track && sensors.track('navigationbar_case_button', {
        case_category: caseName
      })
    },
    clickMoreBtn: function () {
      sensors && sensors.track && sensors.track('navigationbar_case_more')
    }
  },

  // https://modao.cc/feature/enterprise-case-page.html
  caseTrack: {
    clickEachCase: function (caseName) {
      sensors && sensors.track && sensors.track('enterprisecasepage_choice_button', {
        enterprisecasepage_category: caseName
      })
    }
  },

  // 投放页面埋点
  toufangPage: {
    clickLoginBtn: function (caseName) {
      sensors && sensors.track && sensors.track('toufang_login_button', {
        toufang_page: caseName
      })
    },
    clickTopLoginBtn: function () {
      sensors && sensors.track && sensors.track('toufang_top_login_button_new', {
        toufang_page: location.href
      })
    },
    clickTopTryFreeBtn: function () {
      sensors && sensors.track && sensors.track('toufang_top_free_button_new', {
        toufang_page: location.href
      })
    },
    clickTryFreeBtn: function (caseName, place) {
      sensors && sensors.track && sensors.track('toufang_free_experience_button', {
        toufang_page: caseName,
        toufang_button_place: place
      })
    }
  },

  newSignBtnTop: function () {
    sensors && sensors.track && sensors.track('all_page_login_new', {
      page_source_url: location.href,
      button_ClickSource: '顶部导航登录注册按钮'
    })
  },

  newSignBtnMiddle: function () {
    sensors && sensors.track && sensors.track('all_page_login_new', {
      page_source_url: location.href,
      button_ClickSource: '中部登录栏'
    })
  },

  newSignBtnBottom: function () {
    sensors && sensors.track && sensors.track('all_page_login_new', {
      page_source_url: location.href,
      button_ClickSource: '底部免费使用'
    })
  },

  newSignBtnFunc: function () {
    sensors && sensors.track && sensors.track('all_page_login_new', {
      page_source_url: location.href,
      button_ClickSource: '功能使用按钮'
    })
  },

  newBrandTrack: {
    clickLoginBtn: function (btnName) {
      sensors && sensors.track && sensors.track('user_source', {
        page_source_url: location.href,
        btn_name: btnName
      })
    }
  },

  userSourceTrack: function (entryTerm, entry) {
    var pageName = ''
    var btnName = ''

    var pathname = location.pathname

    if (entry && ENTRY_MAP[entry]) {
      pageName = ENTRY_MAP[entry]
    }

    if (!entry) {
      if (HEAD_TRACK_MAP[pathname]) {
        pageName = HEAD_TRACK_MAP[pathname]
      } else {
        ENTRY_REG_MAP.every(([regexp, name]) => {
          const reg = new RegExp(regexp)
          if (reg.test(pathname)) {
            pageName = name
            return false
          }
          return true
        })
      }
    }

    if (ENTRY_TERM_NAME_MAP[entryTerm]) {
      btnName = ENTRY_TERM_NAME_MAP[entryTerm]
    }

    sensors && sensors.track && sensors.track('user_source', {
      page_address: pageName,
      btn_name: btnName
    })
  },

  headerSourceTrack: function (isToufang) {
    var path_name = '';
    // var entry = '';
    var entry_name = '' // all from url when in header

    if (location.pathname) {
      path_name = location.pathname

      if (HEAD_TRACK_MAP[path_name]) {
        entry_name = HEAD_TRACK_MAP[path_name]
      }
    }

    var btn_name

    if (isToufang) {
      btn_name = '导航-登录/免费使用'
    } else {
      btn_name = '导航-登录/注册'
    }

    sensors && sensors.track && sensors.track('user_source', {
      page_address: entry_name,
      btn_name: btn_name
    })
  },

  // 新版首页中的点击页面中的按钮进行埋点
  homePage2023: {
    // 了解详情按钮
    handleDetailBtnTrack: function (source) {
      sensors && sensors.track && sensors.track('index_button_click', {
        source
      })
    }
  },

  adBannerTrack: {
    bannerClick: function (url) {
      sensors && sensors.track && sensors.track('banner_click', {
        banner_name: '官网顶部banner',
        banner_url: url,
        img_name: '会员限时9元起',
        current_plan_product: '官网未知',
        current_plan_category: '官网未知',
        end_on: '2000-01-01',
        seats_taken: 999
      })
    },

    bannerExpose: function (url) {
      sensors && sensors.track && sensors.track('banner_exp', {
        banner_name: '官网顶部banner',
        banner_url: url,
        img_name: '会员限时9元起',
        current_plan_product: '官网未知',
        current_plan_category: '官网未知',
        end_on: '2000-01-01',
        seats_taken: 999
      })
    }
  },

  tvcTrack: {
    beginToPlay: function ({ ele, videoName, pageName }) {
      var isVideoContinue = Math.floor(ele.currentTime) !== 0

      sensors && sensors.track && sensors.track('video_start', {
        video_name: videoName,
        start_type: isVideoContinue ? '继续' : '开始',
        page_name: pageName
      })
    },

    stopToPlay: function ({ ele, videoName, pageName, isLeave }) {
      var isEnd = ele.ended
      var currentTime = Math.floor(ele.currentTime)
      var isPlaying = !!(Math.floor(ele.currentTime) > 0 && !ele.paused && !ele.ended && ele.readyState > 2)

      var stop_type

      if (isLeave) {
        stop_type = '离开界面'
      } else {
        if (isEnd) {
          stop_type = '自然结束'
        } else {
          stop_type = '主动暂停'
        }
      }

      sensors && sensors.track && sensors.track('video_stop', {
        video_name: videoName,
        play_duration: currentTime,
        is_finish: isEnd,
        stop_type: stop_type,
        page_name: pageName
      })
    }
  },

  trackIncentive: {
    clickSource: function (address) {
      sensors && sensors.track('button_name', address)
    },
  },

  trackd11: {
    clickBuyBtn: function (source) {
      sensors && sensors.track('activity_buybutton_click', {
        source
      })
    },
    clickCouponBtn: function (button_name) {
      sensors && sensors.track('coupon_popup_click', {
        button_name
      })
    },
    clickCommonBtn: function (button_name) {
      sensors && sensors.track('activity_button_click', {
        button_name
      })
    },
    clickInviteBtn: function (button_name) {
      sensors && sensors.track('copy_invite_link', {
        button_name
      })
    },
    clickLotteryBtn: function (button_name) {
      sensors && sensors.track('start_lottery', {
        button_name
      })
    }
  },

  trackd2024618: {
    clickBuyBtn: function (source) {
      sensors && sensors.track('activity_buybutton_click', {
        source
      })
    },
    clickCouponBtn: function (button_name) {
      sensors && sensors.track('coupon_popup_click', {
        button_name
      })
    },
    clickCommonBtn: function (button_name) {
      sensors && sensors.track('activity_button_click', {
        button_name
      })
    }
  },

  trackd20240901: {
    clickBuyBtn: function (type) {
      sensors && sensors.track('tenyear_buybutton_click', {
        type
      })
    },
    clickRightsBtn: function (type) {
      sensors && sensors.track('tenyear_rightbutton_click', {
        type
      })
    },
    clickCouponBtn: function (type) {
      sensors && sensors.track('tenyear_coupons_click', {
        type
      })
    },
    clickMktBtn: function (template_name, template_id, type) {
      sensors && sensors.track('tenyear_template_click', {
        template_name,
        template_id,
        type
      })
    },
    clickLotteryBtn: function () {
      sensors && sensors.track('tenyear_lottery_click')
    },
    clickCaseBtn: function () {
      sensors && sensors.track('tenyear_enterprise_case_click')
    },

    trackSectionExposure: function (sectionId) {
      sensors && sensors.track('tenyear_page_view', {
        type: sectionId
      });
    }
  },

  track2024double11: {
    clickBuyBtn: function (type) {
      sensors && sensors.track('241111_buybutton_click', {
        type
      })
    },
    clickCouponBtn: function (type) {
      sensors && sensors.track('241111_coupons_click', {
        type
      })
    },
    clickCommonBtn: function (type) {
      sensors && sensors.track('241111_click', {
        type
      })
    },
    trackSectionExposure: function (sectionId) {
      sensors && sensors.track('241111_view', {
        type: sectionId
      });
    }
  }
}

window.TrackTool = TrackTool

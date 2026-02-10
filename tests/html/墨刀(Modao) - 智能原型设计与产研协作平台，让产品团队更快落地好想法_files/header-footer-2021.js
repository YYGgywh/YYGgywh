!(function () {
  var isIE
  ;(window.ActiveXObject || 'ActiveXObject' in window || navigator.userAgent.indexOf('Trident') > -1) && (window.NodeList.prototype.forEach = window.Array.prototype.forEach)
  var parents = document.querySelectorAll('.wsc-header2020-navbar-item.with-toggle'),
    children = document.querySelectorAll('.wsc-header2020-navbar-nav-toggle'),
    domain = document.domain
  function resetNav() {
    parents.forEach(function (el) {
      el.classList.remove('active')
    }),
      children.forEach(function (el) {
        handleCollapse(el, !0)
      })
  }
  function handleCollapse(el, actived) {
    var height = actived ? 0 : el.children[0].getBoundingClientRect().height
    el.style.height = height + 'px'
  }
  function handleWsNavToggle(e) {
    e.stopPropagation()
    var target = e.target
    ;(actived = target.parentElement.classList.contains('active')), (el_dropdown = target.nextElementSibling), !actived && resetNav()
    var x = document.body.offsetWidth - el_dropdown.getBoundingClientRect().right
    x < 0 && (el_dropdown.style.transform = 'translate3d(' + x + 'px, 0, 0)'), handleCollapse(el_dropdown, actived), target.parentElement.classList.toggle('active')
  }
  document.querySelectorAll('.wsc-header2020 .wsc-header2020-navbar-master a, .wsc-footer2020 a').forEach(function (el) {
    ;(domain || -1 === el.href.indexOf(domain)) && el.href.indexOf('http') > -1 && el.setAttribute('target', '_blank'), el.href.indexOf(domain) > -1 && el.removeAttribute('target')
  }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle.utility strong').forEach(function (el) {
      'Famisafe' === el.innerText && (el.innerText = 'FamiSafe'), 'Dr.fone' === el.innerText && (el.innerText = 'Dr.Fone')
    }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle.productivity strong').forEach(function (el) {
      'MindMaster' === el.innerText && (el.innerText = 'EdrawMind')
    }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle.productivity .border-control a').forEach(function (el) {
      el.href.indexOf('https://pdfcloud.wondershare.com/') > -1 && -1 === el.href.indexOf('document-cloud') && (el.href = el.href.replace('https://pdfcloud.wondershare.com/', 'https://pdf.wondershare.com/document-cloud/')),
        el.href.indexOf('https://www.edrawsoft.com/mindmaster/') > -1 && (el.href = el.href.replace('https://www.edrawsoft.com/mindmaster/', 'https://www.edrawsoft.com/edrawmind/'))
    }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle.creativity strong').forEach(function (el) {
      'Flimora' === el.innerText && (el.innerText = 'Filmora'), 'Flimstock' === el.innerText && (el.innerText = 'Filmstock')
    }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle.productivity .font-size-small,.wsc-header2020-navbar-nav-toggle.utility .font-size-small').forEach(function (el) {
      el.innerText.indexOf('managment') > -1 && (el.innerText = el.innerText.replace('managment', 'management')), el.innerText.indexOf('transfers') > -1 && (el.innerText = el.innerText.replace('transfers', 'transfer'))
    }),
    document.querySelectorAll('.wsc-header2020-navbar-nav-toggle .border-control>div').forEach(function (el) {
      el.innerText.indexOf('Producs') > -1 && (el.innerText = el.innerText.replace('Producs', 'Products'))
    }),
    document.querySelectorAll('.active_menu_a').forEach(function (el) {
      el.addEventListener('click', handleWsNavToggle)
    }),
    children.forEach(function (el) {
      el.addEventListener('transitionend', function (e) {
        var height
        0 === el.getBoundingClientRect().height && (el.style.transform = '')
      })
    }),
    document.body.addEventListener('click', function (e) {
      resetNav(),
        children.forEach(function (el) {
          handleCollapse(el, !0)
        })
    })
  var mobole_panel = document.querySelector('.wondershare-user-panel-mobile'),
    userInfo = getCookie('user_identity')
  if (mobole_panel && userInfo) {
    userInfo && (document.querySelector('.wsc-header2020-navbar-item.wondershare-user-panel.log-out').style.display = 'none')
    var el_log_in = document.querySelector('.wsc-header2020-navbar-item.wondershare-user-panel.log-in'),
      el_log_out = mobole_panel.querySelector('.wondershare-user-panel.log-out'),
      el_dropdown = el_log_in.querySelector('.ws-user-panel-dropdown'),
      img_avatar = el_log_in.querySelector('.wondershare-user-panel.log-in .avatar'),
      requset_url = mobole_panel.querySelector('.wondershare-user-panel.log-out [data-href]').getAttribute('data-href').replace(/\/$/, '')
    ;(el_log_out.style.display = 'none'),
      (el_log_in.style.display = 'block'),
      (userInfo = JSON.parse(getCookie('user_identity'))).avatar && img_avatar.setAttribute('src', userInfo.avatar),
      (el_log_in.querySelector('.ws-user-panel-dropdown .account_name').innerText = userInfo.first_name && userInfo.last_name ? userInfo.first_name + ' ' + userInfo.last_name : userInfo.nickName || userInfo.email),
      el_log_in.querySelector('.ws-user-panel-dropdown .account_url').setAttribute('href', requset_url),
      el_log_in.querySelector('.ws-user-panel-dropdown .account_url_sign_out').setAttribute('href', requset_url + '/v3/user/oauth/logout?redirect=' + (window.ws_redirect_url_logout || location.href)),
      el_log_in.classList.contains('listened') ||
        (el_log_in.classList.add('listened'),
        el_log_in.addEventListener('click', function (e) {
          if (e.target.classList.contains('avatar')) {
            var show = 'none' === getComputedStyle(el_dropdown).display
            el_dropdown.style.display = show ? 'block' : 'none'
            var right = el_dropdown.getBoundingClientRect().right,
              view_width,
              x = document.body.offsetWidth - right
            ;(el_dropdown.style.willChange = 'transform'), (el_dropdown.style.transform = 'translate3d(' + x < 0 ? x : '0px, 0, 0)')
          }
        }))
  }
  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return v ? decodeURIComponent(v[2]) : null
  }
  var style = document.createElement('style')
  style.appendChild(document.createTextNode('.wsc-footer2020 .wsc-footer202004-top .wsc-footer2020-subnav-iconlink{opacity:1 !important}.wsc-footer2020 .wsc-footer202004-top .wsc-footer2020-subnav-iconlink:hover{opacity: 1 !important}')),
    document.head.appendChild(style),
    document.querySelectorAll('.wsc-footer2020-subnav-iconlink').forEach(function (el, index) {
      index <= 3 && el.classList.add('mr-2'), (el.children[0].style.height = '28px'), (el.children[0].style.width = '28px')
    })
  var hosts = [
    'www.wondershare.com',
    'www.wondershare.it',
    'www.wondershare.fr',
    'www.wondershare.de',
    'www.wondershare.com.br',
    'www.wondershare.es',
    'www.wondershare.ar',
    'www.wondershare.kr',
    'www.wondershare.jp',
    'support.wondershare.com'
  ]
  if (document.documentElement.clientWidth < 1280 && hosts.indexOf(location.host) > -1) {
    if (mobole_panel) return
    var mobile_ul = document.createElement('ul')
    mobile_ul.className = 'list-unstyled mb-0'
    var nav_bar_content = document.querySelector('.wsc-header2020-navbar-master .wsc-header2020-navbar-content')
    nav_bar_content.style.setProperty('flex-direction', 'row-reverse'), nav_bar_content.querySelector('.wsc-header2020-navbar-brand').style.setProperty('margin-right', '-42px')
    var log_out = nav_bar_content.querySelector('.log-out'),
      log_in = nav_bar_content.querySelector('.log-in')
    ;(log_out.querySelector('a').style = 'padding: 4px 0px; font-size: 12px; font-weight: bold; margin: 0; text-transform: none;backround-color: none;'),
      mobile_ul.appendChild(log_out),
      mobile_ul.appendChild(log_in),
      nav_bar_content.insertBefore(mobile_ul, nav_bar_content.firstChild)
  }
})()

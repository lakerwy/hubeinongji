export default {
  title: '',
  copyright: 'Copyright © 2021 hgt.com. All rights reserved.',
  isFirstPage: true,// 配置首页不可关闭
  key: 'hgt', // 配置主键,目前用于存储
  whiteList: ['/login', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
  whiteTagList: ['/login', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  },
  //特殊菜单
  spatailRouterPath: ["/agri-data", "/agri-monitoring", "/working-management"],
}

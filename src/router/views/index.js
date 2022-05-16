import Layout from '@/components/layout/index.vue'




/*export default [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/!* webpackChunkName: "page" *!/ '@/views/login/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/',
    name: '登录',
    redirect: '/login'
  },
  {
    path: '/homepage',
    component: Layout,
    redirect: '/agri-data',
    children: [
      {
        path: '/agri-data',
        name: 'agri-data',
        component: () =>import('@/views/agri-data/index.vue'),
        redirect: '/farmStatis',
        children: [
          {
            path: '/farmStatis',
            name: 'farmStatis',
            component: () => import('../../views/agri-data/farmStatis/index')
          },
          {
            path: '/workStatis',
            name: 'workStatis',
            component: () => import('@/views/agri-data/workStatis')
          },
          {
            path: '/onemap',
            name: 'onemap',
            component: () => import('@/views/agri-data/onemap'),

          },
        ]
      }, 
      {
        path: '/agri-monitoring',
        name: 'agri-monitoring',
        component: () => import('@/views/agri-monitoring/index.vue'),
        redirect: '/history-trajectory',
        children: [
          {
            path: '/history-trajectory',
            name: 'history-trajectory',

            component: () =>import('@/views/agri-monitoring/history-trajectory/index.vue')
          },
          {
            path: '/realtime-monitoring',
            name: 'realtime-monitoring',
            component: () =>import('@/views/agri-monitoring/realtime-monitoring/index.vue')
          },
        ]
      },
      {
        path: '/working-management',
        name: 'working-management',
        component: () => import('@/views/working-management/index.vue'),
        redirect: '/working-monitoring',
        children: [
          {
            path: '/working-monitoring',
            name: 'working-monitoring',

            component: () => import('@/views/working-management/working-monitoring/index.vue'),
          },
          {
            path: '/repeat-working',
            name: 'repeat-working',
            component: () => import('@/views/working-management/repeat-working/index.vue'),
          },
          {
            path: '/audit-repeat-working',
            name: 'audit-repeat-working',
            component: () => import('@/views/working-management/audit-repeat-working/index.vue'),
          },
        ]
      },
      {
        path:'/agri-dispatch',
        name:'agri-dispatch',

        component:() => import('@/views/agri-dispatch/index.vue'),
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/index.vue'),
        redirect: '/user',
        children: [
          {
            path: '/user',
            name: 'user',

            component: () => import('@/views/admin/user/index'),
          },
          {
            path: '/role',
            name: 'role',
            component: () => import('@/views/admin/role/index'),
          },
          {
            path: '/dept',
            name: 'dept',
            component: () => import('@/views/admin/dept2/index'),
          },
          {
            path: '/menu',
            name: 'menu',
            component: () => import('@/views/admin/menu/index'),
          },
          {
            path: '/dict',
            name: 'dict',
            component: () => import('@/views/admin/dict/index'),
          },
          {
          path:'/about',
          name:'about',
          component: () => import('@/views/admin/about/index'),
          },
          {
            path: '/setMachineWorking',
            name: 'setMachineWorking',
            component: () => import('@/views/admin/setMachineWorking/index'),
          },
          {
            path: '/opreationSeason',
            name: 'opreationSeason',
            component: () => import('@/views/admin/platform/opreationSeason/index')
          },
          {
            path: '/task',
            name: 'task',
            component: () => import('@/views/admin/platform/task/index')
          },{
            path: '/audit',
            name: 'audit',
            component: () => import('@/views/admin/platform/audit/index')
          },{
            path: '/algorithm',
            name: 'algorithm',
            component: () => import('@/views/admin/platform/algorithm/index')
          },{
            path: '/agreement',
            name: 'agreement',
            component: () => import('@/views/admin/platform/agreement/index')
          },
          {
            path: '/operadata',
            name: 'operadata',
            component: () => import('@/views/admin/operadata/index')
          },
        ]
      },
      {
        path:'/basicInfo',
        name:'basicInfo',
        component:() => import('@/views/basicInfo/index.vue'),
        redirect: '/basic-install',
        children: [
          {
            path:'/basic-machiner',
            name:'basic-machiner',

            component:() => import('@/views/basicInfo/machinerInfo'),
          },
          {
            path:'/basic-terminal',
            name:'basic-terminal',
            component:() => import('@/views/basicInfo/terminalInformation')
          },
          {
            path:'/basic-machtools',
            name:'basic-machtools',
            component:() => import('@/views/basicInfo/machToolsInfo'),
          },
          {
            path:'/basic-resource',
            name:'basic-resource',
            component:() => import('@/views/basicInfo/productResource'),
          },
          {
            path:'/basic-install',
            name:'basic-install',
            component:() => import('@/views/basicInfo//installationAudit'),
          }
        ]
      },
      {
        path:'/basic-product',
        name:'basic-product',
        component:() => import('@/views/basicInfo/productMap'),
      },
      {
        path:'/report-analysis',
        name:'report-analysis',
        component:() => import('@/views/report-analysis/index.vue'),
        redirect: '/taskCompletionReport',
        children:[
          {
            path:'/agriMachineTerminalReport',
            name:'agriMachineTerminalReport',
            component:() => import('@/views/report-analysis/dataAnalysisReport/agriMachineTerminalReport/index.vue'),
          },
          {
            path: '/taskCompletionReport',
            name: 'taskCompletionReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/taskCompletionReport/index'),

        },{
            path: '/regionalDataReport',
            name: 'regionalDataReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/regionalDataReport/index'),
        },{
            path: '/jobDayQueryReport',
            name: 'jobDayQueryReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/jobDayQueryReport/index'),
        },{
            path: '/agriMonthOnlineReport',
            name: 'agriMonthOnlineReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/agriMonthOnlineReport/index'),
        },{
            path: '/DetectionAreaReport',
            name: 'DetectionAreaReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/DetectionAreaReport/index'),
        },{
            path: '/agriMachineTerminalReport',
            name: 'agriMachineTerminalReport',
            component: () => import('@/views/report-analysis/dataAnalysisReport/agriMachineTerminalReport/index'),
        },
        {
          path: '/serviceExpReport',
          name: 'serviceExpReport',
          component: () => import('@/views/report-analysis/infoQueryReport/serviceExpReport/index'),
      },{
          path: '/userLoginStatusReport',
          name: 'userLoginStatusReport',
          component: () => import('@/views/report-analysis/infoQueryReport/userLoginStatusReport/index'),
      },{
          path: '/operationLogReport',
          name: 'operationLogReport',
          component: () => import('@/views/report-analysis/infoQueryReport/operationLogReport/index'),
      },
          {
            path: '/repeatWorkAlarm',
            name: 'repeatWorkAlarm',
            component: () => import('@/views/report-analysis/agriAlarmReport/repeatWorkAlarm/index'),
        },{
            path: '/boundaryAlarm',
            name: 'boundaryAlarm',
            component: () => import('@/views/report-analysis/agriAlarmReport/boundaryAlarm/index'),
        },
          {
            path: '/workSummaryReport',
            name: 'workSummaryReport',
            component: () => import('@/views/report-analysis/workReport/workSummaryReport/index'),
        },{
            path: '/agriWorkDetailReport',
            name: 'agriWorkDetailReport',
            component: () => import('@/views/report-analysis/workReport/agriWorkDetailReport/index'),
        },{
            path: '/agriWorkTypeReport',
            name: 'agriWorkTypeReport',
            component: () => import('@/views/report-analysis/workReport/agriWorkTypeReport/index'),
        },{
            path: '/cooperatWorkSumReport',
            name: 'cooperatWorkSumReport',
            component: () => import('@/views/report-analysis/workReport/cooperatWorkSumReport/index'),
        },{
            path: '/cooperatAgriReport',
            name: 'cooperatAgriReport',
            component: () => import('@/views/report-analysis/workReport/cooperatAgriReport/index'),
        },
          {
            path: '/subsidyDetailReport',
            name: 'subsidyDetailReport',
            component: () => import('@/views/report-analysis/subsidyReport/subsidyDetailReport/index'),
        },{
            path: '/subsidySummaryReport',
            name: 'subsidySummaryReport',
            component: () => import('@/views/report-analysis/subsidyReport/subsidySummaryReport/index'),
        },{
            path: '/workSubsidySumReport',
            name: 'workSubsidySumReport',
            component: () => import('@/views/report-analysis/subsidyReport/workSubsidySumReport/index'),
        },
        ]
      }
    ]
  },
  {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    component: () =>
      import(/!* webpackChunkName: "page" *!/ '@/views/admin/user/info')
  }]
},]*/

export default [{
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
        path: 'index',
        name: '个人信息',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/views/admin/user/info')
    }]
}]

import Layout from '@/components/layout/index.vue'

export default [
    {
        path: '/login',
        name: '登录页',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/views/login/index'),
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/index',
        name: '首页',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/components/layout/index'),
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/aboutUs',
        name: '联系我们',
        component: () => import(/* webpackChunkName: "page" */ '@/components/layout/index'),
        redirect: "/aboutUs/index",
        children: [
            {
                path: 'index',
                component: () => import(/* webpackChunkName: "page" */ '@/views/admin/about/index'),
            },
        ],
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/404',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
        name: '404',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: true
        }

    },
    {
        path: '/403',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
        name: '403',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/500',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
        name: '500',
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    },
    {
        path: '/',
        name: '主页',
        redirect: '/login'
    },
    {
        path: '*',
        redirect: '/404'
    },
    /* {
         path: '/authredirect',
         name: '授权页',
         component: () =>
             import(/!* webpackChunkName: "page" *!/ '@/page/login/authredirect'),
         meta: {
             keepAlive: true,
             isTab: false,
             isAuth: false
         }
     }*/
]

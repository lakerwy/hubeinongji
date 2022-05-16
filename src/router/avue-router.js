import {Object} from "ol";

const RouterPlugin = function () {
    this.$router = null
    this.$store = null
}
RouterPlugin.install = function (router, store) {
    this.$router = router
    this.$store = store

    function isURL(s) {
        return /^http[s]?:\/\/.*/.test(s)
    }

    function objToform(obj) {
        const result = []
        Object.keys(obj).forEach(ele => {
            result.push(`${ele}=${obj[ele]}`)
        })
        return result.join('&')
    }

    this.$router.$avueRouter = {
        // 全局配置
        $website: this.$store.getters.website,
        routerList: [],
        group: '',
        safe: this,
        // 设置标题
        setTitle: function (title) {
            title = title ? `${title}——${this.$website.title}` : this.$website.title
            document.title = title
        },
        closeTag: (value) => {
            const tag = value || this.$store.getters.tag
            this.$store.commit('DEL_TAG', tag)
        },
        // 处理路由
        getPath: function (params) {
            const {
                src
            } = params
            let result = src || '/'
            if (src.includes('http') || src.includes('https')) {
                result = `/myiframe/urlPath?${objToform(params)}`
            }
            return result
        },
        // 正则处理路由
        vaildPath: function (list, path) {
            let result = false
            list.forEach(ele => {
                if (new RegExp('^' + ele + '.*', 'g').test(path)) {
                    result = true
                }
            })
            return result
        },
        // 设置路由值
        getValue: function (route) {
            let value = ''
            if (route.query.src) {
                value = route.query.src
            } else {
                value = route.path
            }
            return value
        },
        // 动态路由
        formatRoutes: function (aMenu = [], first) {
            const aRouter = []
            const propsConfig = this.$website.menu.props
            const propsDefault = {
                label: propsConfig.label || 'label',
                path: propsConfig.path || 'path',
                icon: propsConfig.icon || 'icon',
                children: propsConfig.children || 'children',
                meta: propsConfig.meta || 'meta'
            }
            //const spatailRouterPath = ["/agri-data", "/agri-monitoring", "/working-management"]//即为一级路由，又有子路由的，考虑用增加一个菜单的属性来判断

            if (aMenu.length === 0) return
            for (let i = 0; i < aMenu.length; i++) {
                const oMenu = aMenu[i]

                if (!oMenu[propsDefault.path]) continue
                if (this.routerList.includes(oMenu[propsDefault.path])) continue
                ////console.log("需要动态加载路的path", oMenu[propsDefault.path])
                const path = (() => {
                    if (!oMenu[propsDefault.path]) {
                        return
                    } else if (first) {
                        return oMenu[propsDefault.path].replace('/index', '')
                        //return oMenu[propsDefault.path]
                    } else {
                        return oMenu[propsDefault.path]
                    }
                })()

                //特殊处理组件
                const component = 'views' + oMenu[propsDefault.path]

                const name = oMenu[propsDefault.label]

                const icon = oMenu[propsDefault.icon]

                const children = oMenu[propsDefault.children]

                const meta = {
                    keepAlive: Number(oMenu['keepAlive']) === 1
                }
                const isChild = (children.length !== 0) /*&& (!spatailRouterPath.includes(oMenu[propsDefault.path]))*/
                let hasLeftChild = isChild
                if (hasLeftChild) {
                    //如果全部是按钮，设置isChild=false;
                    let cc = 0
                    children.forEach((val, index) => {
                        if (val.type === '1')//按钮
                            cc++
                    })
                    if (cc === children.length) {
                        hasLeftChild = false
                    }
                }
                const oRouter = {
                    path: path,
                    component(resolve) {
                        // 判断是否为首路由
                        let routerpath = [];
                        if (first) {
                            routerpath = ['../components/layout/index'];
                            require(['../components/layout/index'], resolve)
                            // 判断是否为多层路由
                        } else if (isChild && !first && hasLeftChild) {
                            routerpath = ['../components/layout/layout'];
                            require(['../components/layout/layout'], resolve)
                            // 判断是否为最终的页面视图
                        } else {
                            routerpath = [`../${component}.vue`];
                            require([`../${component}.vue`], resolve)
                        }
                        //console.log("路由得路径", path, routerpath)

                        /* if(routerpath){
                             require(, resolve)
                         }*/
                    },
                    name: name,
                    icon: icon,
                    meta: meta,
                    redirect: (() => {
                        //如果是一级路由，重定向到index路径
                        if (!isChild && first && !isURL(path)) return `${path}/index`
                        else {
                            if (this.$website.spatailRouterPath.includes(oMenu[propsDefault.path])) {
                                return `${path}/index`
                            }
                            return ''
                        }
                    })(),
                    // 处理是否为一级路由
                    children: (() => {
                        if (!isChild) {
                            if (first) {
                                if (!isURL(path)) oMenu[propsDefault.path] = `${path}/index`
                                return [{
                                    component(resolve) {
                                        require([`../${component}/index.vue`], resolve)
                                    },
                                    icon: icon,
                                    name: name,
                                    meta: meta,
                                    path: 'index'
                                }]
                            } else
                                return []
                        } else {
                            let res = this.formatRoutes(children, false);
                            if (this.$website.spatailRouterPath.includes(oMenu[propsDefault.path])) {
                                let spatailChildrenRouter = []
                                spatailChildrenRouter.push({
                                    children: res,
                                    component(resolve) {
                                        require([`../${component}/index.vue`], resolve)
                                    },
                                    icon: icon,
                                    name: name,
                                    meta: meta,
                                    path: 'index',
                                    redirect: res.length > 0 ? res[0].path : ""
                                })
                                return spatailChildrenRouter
                            }
                            return res
                        }
                    })()
                }
                aRouter.push(oRouter)
            }
            if (first && aRouter.length > 0) {
                if (!this.routerList.includes(aRouter[0][propsDefault.path])) {
                    ////console.log("动态增加路由", aRouter)
                    this.safe.$router.addRoutes(aRouter)
                    this.routerList.push(aRouter);
                    //this.safe.$router.push(aRouter[0][propsDefault.path])
                }
            } else {
                return aRouter
            }
        }
    }
}
export default RouterPlugin
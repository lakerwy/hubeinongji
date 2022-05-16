import {getStore, setStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {loginByMobile, loginBySocial, loginByUsername, logout, refreshToken} from '@/api/loginAndRegister'
import {deepClone, encryption} from '@/util/util'
import website from '@/const/website'
import {resetRouter} from '@/router/router'
import {getLeftMenu, getMenu, getTopMenu} from '@/api/admin/menu'

function addPath(ele, first) {
    const menu = website.menu
    const propsConfig = menu.props
    const propsDefault = {
        label: propsConfig.label || 'name',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const icon = ele[propsDefault.icon]
    ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
    if (!isChild) ele[propsDefault.children] = []
    if (!isChild && first && ele[propsDefault.path] && !isURL(ele[propsDefault.path])) {
        //ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    } else {
        ele[propsDefault.children].forEach(child => {
            addPath(child)
        })
    }
}

const user = {
    state: {
        website: website,
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || [],
        roles: [],
        menu: getStore({
            name: 'menu'
        }) || [],
        menuAll: [],
        leftmenu: getStore({
            name: 'leftmenu'
        }) || [],
        expires_in: getStore({
            name: 'expires_in'
        }) || '',
        access_token: getStore({
            name: 'access_token'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || '',
        forcePassWordModify:getStore({
            name: 'forcepassWordmodify'
        }) || false,
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({commit}, userInfo) {
            const user = encryption({
                data: userInfo,
                key: 'pigxpigxpigxpigx',
                param: ['password']
            })
            return new Promise((resolve, reject) => {
                loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
                    //console.log("login", response)
                    const data = response
                    if (data.access_token) {
                        commit('SET_ACCESS_TOKEN', data.access_token)
                        commit('SET_REFRESH_TOKEN', data.refresh_token)
                        commit('SET_EXPIRES_IN', data.expires_in)
                        commit('SET_USER_INFO', data.user_info)
                        //console.log("data.user_info", data.user_info)
                        commit('SET_PERMISSIONS', data.user_info.authorities || [])
                        commit('CLEAR_LOCK')
                        resolve()
                    } else {
                        if (data.code > 0) {
                            reject(data.msg)
                        }
                    }
                    /*if (code === 1) {

                    } else {
                        reject(msg)
                    }*/
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据手机号登录
        LoginByPhone({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                loginByMobile(userInfo.mobile, userInfo.code).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据OpenId登录
        LoginBySocial({commit}, param) {
            return new Promise((resolve, reject) => {
                loginBySocial(param.state, param.code).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 刷新token
        RefreshToken({commit, state}) {
            return new Promise((resolve, reject) => {
                refreshToken(state.refresh_token).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then((res) => {
                    resetRouter();
                    commit('SET_MENU', [])
                    commit('SET_MENU_LEFT', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_EXPIRES_IN', '')
                    commit('SET_ROLES', [])
                    //commit('DEL_ALL_TAG')
                    //commit('CLEAR_LOCK')
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                resetRouter();
                commit('SET_MENU', [])
                commit('SET_MENU_LEFT', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                //commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({commit}, obj) {
            return new Promise(resolve => {
                getMenu(obj.id).then((res) => {
                    const data = res.data
                    const menutemp = deepClone(data)
                    let menu = menutemp.filter((val, index) => {
                        return val.path.length > 0
                    })
                    menu.forEach(ele => {
                        addPath(ele)
                    })
                    let type = obj.type
                    commit('SET_MENU', {type, menu})
                    resolve(menu)
                })
            })
        },
        //顶部菜单
        GetTopMenu({commit}) {
            return new Promise(resolve => {
                getTopMenu().then((res) => {
                    //置空左侧菜单
                    //commit('SET_MENU_LEFT', [])
                    const data = res.data
                    resolve(data)
                })
            })
        },
        // 左侧菜单
        GetLeftMenu({commit}, obj) {
            return new Promise(resolve => {
                getLeftMenu(obj.id).then((res) => {
                    const data = res.data || []
                    const menutem = deepClone(data)
                    //如果全部是按钮，就不需要
                    let menu = [];
                    menutem.forEach(ele => {
                        if (ele.type === "2") {
                            addPath(ele)
                            menu.push(ele)
                        }
                    })
                    let type = obj.type
                    commit('SET_MENU_LEFT', {type, menu})
                    resolve(menu)
                })
            })
        },
    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token
            setStore({
                name: 'access_token',
                content: state.access_token,
                type: 'session'
            })
        },
        SET_EXPIRES_IN: (state, expires_in) => {
            state.expires_in = expires_in
            setStore({
                name: 'expires_in',
                content: state.expires_in,
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: userInfo,
                type: 'session'
            })
        },
        SET_MENU: (state, params = {}) => {
            let {menu, type} = params;
            if (type !== false) state.menu = menu
            setStore({
                name: 'menu',
                content: menu,
                type: 'session'
            })
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll
        },
        SET_MENU_LEFT: (state, params = {}) => {
            let {menu, type} = params;
            if (type !== false) state.leftmenu = menu
            setStore({
                name: 'leftmenu',
                content: menu,
                type: 'session'
            })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i].authority] = true
            }

            state.permissions = list
            setStore({
                name: 'permissions',
                content: list,
                type: 'session'
            })
        },
        SET_USRE_FORCEPASSWORD: (state, value) => {
            state.forcePassWordModify = value;
            setStore({
                name: 'forcepassWordmodify',
                content: value,
                type: 'session'
            })
            // // 农机分组关闭清空数据
            // if(!state.isShowGroupBox) {
            //   state.groupData = {name: '', ids: []};
            // }
        },
    }

}
export default user

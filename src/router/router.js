import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router'
import Store from '../store/'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

//创建路由
export const createRouter = () => new VueRouter({
    routes: [...PageRouter, ...ViewsRouter]
})

const Router = createRouter()
AvueRouter.install(Router, Store)

//console.log("Store.state.user.menu",Store.state.user.menu)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher
  AvueRouter.install(Router, Store)
}
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

let that = this;
Router.beforeEach((to, from, next) => {
  // if (to.meta.isAuth) { // 判断该路由是否需要登录权限
    // //console.log("需要登录")
    if (Store.state.user.access_token || to.path == '/login') { // 通过vuex state获取当前的token是否存在
      next();
    } else {
      // that.$message.error("aaa")
      next({
        path: '/login'
        // query: {
          // redirect: to.fullPath
        // } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  // } else {
  //   next();
  // }
})

export default Router
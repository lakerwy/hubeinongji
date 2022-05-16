import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store'
import './assets/style/common.less'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import basicContainer from './components/basic-container/main'
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import scroll from 'vue-seamless-scroll'
import VueClipboard from 'vue-clipboard2'
import localforage from "localforage"
import { iconfontUrl, iconfontVersion } from '@/config/env'
import { loadStyle } from './util/util'
import Print from './plugins/print/Print'

Vue.prototype.$bus = new Vue();

Vue.use(Print)
Vue.use(scroll)
Vue.use(ElementUI)
Vue.use(Avue)
Vue.use(VueClipboard)

// 注册全局容器
Vue.component('basicContainer', basicContainer)

Vue.config.productionTip = false

// 全局路由守卫
// 分组数数据可共享
router.beforeEach((to, from, next) => {
  // 切换路由清空当前农机分组树的选择（目前采取的方式）
  store.commit('setGroupCheckBox', false)
  // store.commit('setGroupData', {name: '', ids: []})
  // store.commit('setGroupBoxStatus', false)
  store.commit('setGroupBoxType', 1)
  store.commit('setCityAdress', { city: "", county: "", nation: "", province: "湖北省", town: "" })
  next();
})

// 自定义拖拽 div 指令
Vue.directive('drag', {
  inserted: function (e) {
    // 获取 title 的父级元素，即整个弹框 div
    let el = e.parentElement;
    // 设置 title 鼠标样式
    e.style.cursor = 'default';
    let fwidth = document.getElementById('app').offsetWidth;
    let fheight = document.getElementById('app').offsetHeight;
    // //console.log(fwidth - el.offsetWidth, 'width')
    // 鼠标按下事件
    e.onmousedown = function (ev) {
      // 鼠标点击后的位置减去弹框距离左边和上边的位置
      let disX = ev.clientX - el.offsetLeft;
      let disY = ev.clientY - el.offsetTop;
      window.onmousemove = function (ev) {
        let l = ev.clientX - disX;
        let t = ev.clientY - disY;
        // 在范围内移动
        if (l > 0 && t > 0 && l + el.offsetWidth < fwidth && t + el.offsetHeight < fheight) {
          el.style.left = l + 'px';
          el.style.top = t + 'px';
        } else if (l < 0) {
          el.style.left = 0 + 'px';
        } else if (t < 0) {
          el.style.top = 0 + 'px';
        } else if (l + el.offsetWidth > fwidth) {
          el.style.left = fwidth - el.offsetWidth + 'px';
        }
        return false;
      };
      window.onmouseup = function () {
        window.onmousemove = null;
        window.onmouseup = null;
      };
    };
  }
})

Vue.directive('title', {
  inserted: function (el, binding) {
    setTimeout(() => {
      document.title = el.dataset.title
    }, 500);
  }
})
// Vue.directive('title', {
//   inserted: setTimeout((el, binding) => {
//     document.title = el.dataset.title;
//   }, 500)
// })

localforage.config({
  name: 'hbdx_forage'
});
Vue.prototype.$localForage = localforage;


// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

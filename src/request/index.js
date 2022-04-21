import axios from 'axios'
import { getStore } from '../util/store'
import router from '@/router/router'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import qs from 'qs'
import store from '@/store' // progress bar style
axios.defaults.timeout = 60000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true


// HTTPrequest拦截
axios.interceptors.request.use(config => {
  const TENANT_ID = getStore({ name: 'tenantId' })
  const isToken = (config.headers || {}).isToken === false
  // const token = store.getters.access_token || '248ab2ac-88a0-4320-a84c-a65cb073a15d'
  const token = store.getters.access_token || 'a6c64920-ad83-4961-a87d-55735f202114'
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  if (TENANT_ID) {
    config.headers['TENANT-ID'] = TENANT_ID // 租户ID
  }

  if(config.isForm) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.data = qs.stringify(config.data);
  }

  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

let messageInstance = null;
// HTTPresponse拦截
axios.interceptors.response.use(res => {
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    if(messageInstance) {
      messageInstance.close();
    }
    messageInstance = Message({
      message: message,
      type: 'error'
    })
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }
  if (status !== 200 ) {
    if(messageInstance) {
      messageInstance.close();
    }
    messageInstance = Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res.data
}, error => {
  return Promise.reject(new Error(error))
})

export default axios

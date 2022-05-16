import axios from 'axios'
import {getStore} from '../util/store'
import router from '@/router/router'
import errorCode from '@/const/errorCode'
import qs from 'qs'
import { Message } from 'element-ui';
import store from '@/store' // progress bar style
axios.defaults.timeout = 600000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true


// HTTPrequest拦截
axios.interceptors.request.use(config => {
    const TENANT_ID = getStore({name: 'tenantId'})
    const isToken = (config.headers || {}).isToken === false
    const token = store.getters.access_token
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token// token
    }
    if (TENANT_ID) {
        config.headers['TENANT-ID'] = TENANT_ID // 租户ID
    }

    if (config.isForm) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        config.data = qs.stringify(config.data);
    }

    if (config.method === 'get') {
        config.paramsSerializer = function (params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})

let messageInstance = null;
// HTTPresponse拦截
axios.interceptors.response.use(res => {
    //console.log("HTTPresponse拦截",res)
    const status = Number(res.status) || 200
    if(res.data instanceof Blob && status != 200){
        const reader = new FileReader();
        reader.readAsText(res.data, 'utf-8');
        reader.onload = () => {
         //处理报错信息 JSON.parse(reader.result)拿到报错信息
            let errMsg = JSON.parse(reader.result).msg
            Message.warning(errMsg)
        };
    }
    const message = res.data.msg || errorCode[status] || errorCode['default']

    if (status === 401) {
        if (messageInstance) {
            messageInstance.close();
        }
        /*messageInstance = Message({
          message: message,
          type: 'error'
        })*/
        store.dispatch('FedLogOut').then(() => {
            router.push({path: '/login'})
        })
        return
    }
    if (status !== 200) {
        if (messageInstance) {
            messageInstance.close();
        }
        /* messageInstance = Message({
             message: message,
             type: 'error'
         })*/
        return Promise.reject(message)
        //return {msg: message, code: status, data: null}
    }
    return res.data
}, error => {
    return Promise.reject(new Error(error))
})

export default axios

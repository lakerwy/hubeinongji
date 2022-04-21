/**
 * 报表分析-信息查询报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'
 const userLoginUrl = window.globalUrl.HOME_API + 'agri-web/rp/log/userLoginInfo'

 /** 服务到期报表 */
 // 查询数据
export const queryData = (params) => {
  return service.post(`${baseUrl}/serverOver/query`, params, {isForm: true})
}

// 续约
export const updateTime = (params, random) => {
  return service({
    url: `${baseUrl}/serverOver/continue`,
    method: 'post',
    params: {
      random
    },
    data: params
  })
}

// 报表导出
export const excelOutPut = (params) => {
  return service.post(`${baseUrl}/serverOver/excelOutPut`, params)
}


/** 用户登录情况报表 */
// 查询报表数据
export const getLoginData = (params) => {
  return service.post(`${userLoginUrl}/query`, params, {isForm: true})
}


/** 操作日志查询报表 */
// 查询数据
export const selectOperlog = (params) => {
  return service.post(`${baseUrl}/operlog/selectOperlog`, params, {isForm: true})
}
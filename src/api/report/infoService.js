/**
 * 报表分析-信息查询报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'
 const userLoginUrl = window.globalUrl.HOME_API + 'agri-web/rp/log/userLoginInfo'


 //下载exce接口
 export const downloadExcel = (params) => {
  return service.post(`${baseUrl}/dwonloadExcel?filePath=${params}`)
}


 /** 服务到期报表 */
 // 查询数据
export const queryData = (params) => {
  return service.post(`${baseUrl}/serverOver/query`, params)
}

// 续约
export const updateTime = (params) => {
  return service.post(`${baseUrl}/serverOver/continue`,params,{isForm:true})
}

// 报表导出
export const excelOutPut = (params) => {
  return service.post(`${baseUrl}/serverOver/excelOutPut`, params)
}


/** 用户登录情况报表 */
// 查询报表数据
export const getLoginData = (params) => {
  return service.post(`${userLoginUrl}/query`, params)
}

//用户登录情况报表导出
export const exportLoginExcel = (params) => {
  return service.post(`${userLoginUrl}/excelOutPut`,params)
}



/** 操作日志查询报表 */
// 查询数据
export const selectOperlog = (params) => {
  return service.post(`${baseUrl}/operlog/selectOperlog`, params,)
}

//报表导出
export const exportOperlog = (params) => {
  return service.post(`${baseUrl}/operlog/excelOutPut`,params)
}
/**
 * 补助报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'

/**
 * 补助明细查询
 */
// 获取作补助资金明细报表
export const queryAssistanceFunds = (params) => {
  return service.post(`${baseUrl}/assistanceFunds/query`, params)
}

//导出
export const exportAssistanceFunds = (params) =>{
  return service.post(`${baseUrl}/assistanceFunds/excelOutPut`,params)
}

/**
 * 补助情况汇总报表
 */

//获取
 export const queryAssistanceSituationSummary = (params) => {
  return service.post(`${baseUrl}/assistanceSituationSummary/query`, params)
}

//导出
export const exportAssistanceSituationSummary = (params) =>{
  return service.post(`${baseUrl}/assistanceSituationSummary/excelOutPut`,params)
}

/**
 * 作业补贴汇总报表
 */

//获取
export const queryJobAssistanceSituationSummary = (params) => {
  return service.post(`${baseUrl}/jobAssistanceSituationSummary/query`, params)
}

//导出
export const exportJobAssistanceSituationSummary = (params) =>{
  return service.post(`${baseUrl}/jobAssistanceSituationSummary/excelOutPut`,params)
}

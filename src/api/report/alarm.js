/**
 * 补助报表接口管理
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'


/**
 * 重复作业警告报表
 */

// 数据查询
export const queryJobRepeated = (params) => {
  return service.post(`${baseUrl}/jobRepeated/query`, params)
}

//导出报表
export const exportJobRepeated = (params) =>{
  return service.post(`${baseUrl}/jobRepeated/excelOutPut`,params)
}


/**
 * 边界警告报表
 */
// 数据查询
export const queryBoundaryAlarm = (params) => {
  return service.post(`${baseUrl}/boundaryAlarm/query`, params)
}

//导出报表
export const exportBoundaryAlarm = (params) =>{
  return service.post(`${baseUrl}/boundaryAlarm/excelOutPut`,params)
}


/**
 * 报表分析-数据分析报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'

 /**
 * 作业汇总报表
 */
// 获取数据
export const queryJobSummary = (params) => {
  return service.post(`${baseUrl}/jobSummary/query`, params)
}

//报表导出
export const exportJobSummary = (params) => {
  return service.post(`${baseUrl}/jobSummary/excelOutPut`, params)
}

 /**
 * 农机作业明细报表
 */
//查询数据
  export const queryDriverJobDetail = (params) => {
    return service.post(`${baseUrl}/driverJobDetailReport/query`, params)
  }
//导出报表
  export const exportDriverJobDetail  = (params) => {
    return service.post(`${baseUrl}/driverJobDetailReport/excelOutPut`, params)
  }
  

/**
 * 农机作业类型统计报表
 */
//查询数据
export const queryPersonJobTypes = (params) => {
  return service.post(`${baseUrl}/personJobTypesReports/query`, params)
}
//导出报表
export const exportPersonJobTypes  = (params) => {
  return service.post(`${baseUrl}/personJobTypesReports/excelOutPut`, params)
}

/**
 * 合作社作业汇总报表
 */
//查询数据
export const queryCooperationJobSummary = (params) => {
  return service.post(`${baseUrl}/cooperationJobSummary/query`, params)
}
//导出报表
export const exportCooperationJobSummary  = (params) => {
  return service.post(`${baseUrl}/cooperationJobSummary/excelOutPut`, params)
}

/**
 * 合作社农机作业报表
 */
//查询数据
export const queryCooperationMachineJobDetail = (params) => {
  return service.post(`${baseUrl}/cooperationMachineJobDetail/query`, params)
}
//导出报表
export const exportCooperationMachineJobDetail  = (params) => {
  return service.post(`${baseUrl}/cooperationMachineJobDetail/excelOutPut`, params)
}

/**
 * 作业验收报表
 */

//查询数据
export const queryWorkAcceptance = (params) => {
  return service.post(`${baseUrl}/jobReport2/query`, params)
}
//导出报表
export const exportWorkAcceptance  = (params) => {
  return service.post(`${baseUrl}/jobReport2/excelOutPut`, params)
}
/**
 * 补助报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'

/**
 * 补助明细查询
 */
// 获取作补助资金明细报表
export const getsubsidyDetailReportList = (params) => {
  return service.post(`${baseUrl}/assistanceFunds/query`, params)
}

//
/**
 * 基础信息接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/cd/terminal'
 const distUrl = window.globalUrl.HOME_API + 'agri-web/sm/dict'

/**
 * 终端信息管理
 */
// 终端信息分页查询
export const queryTerminalPage = (params) => {
  return service.post(`${baseUrl}/queryTerminalPage`, params)
}
// 分页查询历史记录
export const queryTerminalHistroy = (params) => {
  return service.get(`${baseUrl}/terminalHistroy`, {params})
}
// 编辑数据
export const updateTerminal = (params) => {
  return service.post(`${baseUrl}/update`, params)
}
// 删除数据
export const delCdTerminal = (params) => {
  return service.delete(`${baseUrl}/delCdTerminal`, {params})
}
//报表导出
export const terminalInfoExcelPort = (containSim,groupId,jobType,key,page,limit,manufacturerId,protocolId,simNumber,terminalCode,terminalType,agentFacturer) => {
  return service.post(`${baseUrl}/terminalInfoExcelPort`, {containSim,groupId,jobType,key,page,limit,manufacturerId,protocolId,simNumber,terminalCode,terminalType,agentFacturer})
}

//查询终端详情
export const getTerminalDetail = (params) => {
  return service.get(`${baseUrl}/detail/${params}`)
}

// 字典
export const getDictByListType = (params) => {
  return service.get(`${distUrl}/getDictByListType`, {params})
}

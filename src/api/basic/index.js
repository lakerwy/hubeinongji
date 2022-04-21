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
  return service.get(`${baseUrl}/queryTerminalPage`, {params})
}
// 分页查询历史记录
export const queryTerminalHistroy = (params) => {
  return service.get(`${baseUrl}/terminalHistroy`, {params})
}
// 编辑数据
export const updateTerminal = (params) => {
  return service.post(`${baseUrl}/update`, params)
}



// 字典
export const getDictByListType = (params) => {
  return service.get(`${distUrl}/getDictByListType`, {params})
}

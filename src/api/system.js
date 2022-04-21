/**
 * 系统常用接口
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web'

 // 获取分组农机树/at/job/getCdMachine   /sm/group/getGroupTree
export const getGroupTree = (params) => {
  return service.get(`${baseUrl}/sm/group/getGroupTree`, {params})
}
export const getCdMachine = (params) => {
  return service.get(`${baseUrl}/at/job/getCdMachine`, {params})
}
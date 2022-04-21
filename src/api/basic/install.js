/**
 * 安装审核接口
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API+'agri-web/cd/auditing';

//分页查询
export const getInstallList = (params) => {
  return service.get(`${baseUrl}/list`, {params})
}

//详情
export const getInstallInfo = (params) => {
  return service.get(`${baseUrl}/info/${params}`)
}

//新增
export const addInstall = (params) => {
  return service.post(`${baseUrl}/save`, params)
}

//删除
export const deleteInstall = (params) => {
  return service.delete(`${baseUrl}/delete`, {params})
}

//审核
export const auditInstallInfo = (params) => {
  return service.put(`${baseUrl}/update`, {params})
}

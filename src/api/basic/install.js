/**
 * 安装审核接口
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API + 'agri-web/cd/auditing';
const auditUrl = window.globalUrl.HOME_API + 'agri-web';
//分页查询
export const getInstallList = (params) => {
  return service.post(`${baseUrl}/list`, params)
}

//详情
export const getInstallInfo = (params) => {
  return service.get(`${auditUrl}/machineApprove/getMachineApproveInfo`, { params })
}

//新增
export const addInstall = (params) => {
  return service.post(`${baseUrl}/save`, params)
}

//导出
export const exportExcel = (params) => {
  return service.post(`${auditUrl}/rp/statistics/machineApproval/excelOutPut`, params, { isForm: true })
}

//删除
export const deleteInstall = (params) => {
  return service.get(`${auditUrl}/machineApprove/deleteMachine`, { params })
}


//审核
export const auditInstall = (params) => {
  return service.post(`${auditUrl}/machineApprove/approve`, params, { isForm: true })
}

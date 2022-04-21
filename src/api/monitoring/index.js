/**
 * 农机监控接口管理
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API + 'agri-web/machineryMonitor'

// 获取农机在线统计情况
export const getMachineOverview = (params) => {
  return service.post(`${baseUrl}/getMachineOverview`, params)
}

// 根据在线情况查询农机分布
export const queryLocationByStatus = (params) => {
  return service.get(`${baseUrl}/queryLocationByStatus`, {params})
}

// 请求农机字典数据 停用
export const getMachineTypeDict = (params) => {
  return service.get(`${baseUrl}/getMachineTypeDict`, {params})
}

// 条件查询
export const queryLocationByCondition = (params) => {
  return service.post(`${baseUrl}/queryLocationByCondition`, params)
}

// 分组查询
export const queryLocationByGroup = (params) => {
  return service.post(`${baseUrl}/queryLocationByGroup`, params, {isForm: true})
}

// 查询农机详情数据
export const getDetailByMachinId = (params) => {
  return service.get(`${baseUrl}/getDetailByMachinId`, {params})
}

// 根据月份获取具有历史轨迹的日期
export const getTraceDateByMonth = (params) => {
  return service.get(`${baseUrl}/getTraceDateByMonth`, {params})
}

// 查询轨迹
export const queryLine = (params) => {
  return service.post(`${baseUrl}/queryLineByMachineIdAndTime`, params, {isForm: true})
}

// 查询实时图片
export const getPhoto = (params) => {
  return service.post(`${baseUrl}/getPhotoByMachinIdAndTime`, params, {isForm: true})
}

// 照片拍摄
export const takePhoto = (params) => {
  return service.post(`${baseUrl}/takePhoto`, params, {isForm: true})
}

// 作业质量监控
export const getMachineQuality = (params) => {
  return service.get(`${baseUrl}/getMachineQuality`, {params})
}


// 查询农机实时轨迹
export const queryOnLine = (params) => {
  return service.post(`${baseUrl}/queryOnLine`, params, {isForm: true})
}

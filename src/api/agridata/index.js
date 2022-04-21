/**
 * 农机大数据接口
 */
import service from '@/request/index.js'

const baseUrl = window.globalUrl.HOME_API+'agri-web';
const detaliUrl = window.globalUrl.DETAIL_API;

/**
 * 农机一张图
 */
//上图数据
export const getMapPoint = (params) => {
  return service.post(`${baseUrl}/mapPoi`, params)
}

//point检索
export const searchMapPoint = (params) => {
  return service.post(`${baseUrl}/search`, params)
}

//农机详情
export const getMachineDetail = (params) => {
  return service.get(`${detaliUrl}/machineryMonitor/getDetailByMachinId`,{params})
}

//生产资源详情 http://192.168.99.78:8890/cd/productResources/queryProductResourcesInfo?rowId=10000000055
export const getProductDetail = (params) => {
  return service.get(`${detaliUrl}/cd/productResources/queryProductResourcesInfo`,{params})
}

/**
 * 农机统计
 */
//农机在线数量
export const getOnlineMachine = (params) => {
  return service.post(`${baseUrl}/statMachineOL`, params)
}

//农机分类统计
export const getStaticClass = (params) => {
  return service.post(`${baseUrl}/statMachineData`, params)
}

//机具分类统计
export const getToolsClass = (params) => {
  return service.post(`${baseUrl}/statToolData`, params)
}

// 区域农机，合作社统计
export const getAreaMachine = (params) => {
  return service.post(`${baseUrl}/statMachineBar`, params)
}
export const getAreaCooperative = (params) => {
  return service.post(`${baseUrl}/statCooperativeBar`, params)
}

//安装趋势统计
export const getInstallTrend = (params) => {
  return service.post(`${baseUrl}/statMachineInstallTrend`, params)
}

//农机品牌统计TOP 8
export const getBrand = (params) => {
  return service.post(`${baseUrl}/statMachineBrand`, params)
}
//终端品牌统计TOP 8
export const getTerminalBrand = (params) => {
  return service.post(`${baseUrl}/statTerminalBrand`, params)
}

//各行政区划下，各农机数量统计
export const getGroupData = (params) => {
  return service.post(`${baseUrl}/statMachineDataByGroup`, params)
}

/**
 * 作业统计
 */
//根据选定的作业季时间段，选定的作业类型，逐天统计作业数据
export const getCurrentYearJob = (params) => {
  return service.post(`${baseUrl}/statCurrentYearJobGroupDay`, params )
}

//作业统计数据
export const getStatJob = (params) => {
  return service.post(`${baseUrl}/statJob`, params)
}

//历史作业统计
export const getStatJobArea = (params) => {
  return service.post(`${baseUrl}/statJobAreaWithin10Year`, params)
}

//深松作业统计
export const getStatSubsoilingArea = (params) => {
  return service.post(`${baseUrl}/statSubsoilingAreaWithin5Years`, params)
}

//各行政区划下，各作业类型组的作业数据统计
export const getStatGroupData = (params) => {
  return service.post(`${baseUrl}/statJobDataByGroupAndJobMode`, params)
}

// 查询当年各种作业类型的作业完成量，任务量，昨日完成量
export const getJobCompleted = (params) => {
  return service.post(`${baseUrl}/statCurrentJobCompleted`, params)
}

//区域作业统计
export const getAreaWork = (params) => {
  return service.post(`${baseUrl}/sh/homepage/getWorkDataByTypeAndGroup`, params)
}


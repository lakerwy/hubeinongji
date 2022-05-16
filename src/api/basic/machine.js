/**
 * 农机信息接口
 */

import service from '@/request/index.js'

const baseUrl = window.globalUrl.HOME_API+'agri-web/cd/machine';

/**
 * 农机信息
 */
//农机信息字典
// 终端厂商 listType=ternimal_manufacturer  终端类型  terminal_type  农机类型  machine_type 机具类型 tool_type 终端型号 terminal_model
// 终端有三个 字段需要注意下.终端类型 terminal_type    .终端型号 terminal_model  ,终端真实型号 terminal_model_real

export const getMachineDict = (params) => {
  return service.get(`${window.globalUrl.HOME_API}agri-web/sm/dict/getDictByListType`, {params})
}
//安装账号字典 http://192.168.99.78:9999/agri-web/cd/installsheet/queryCreatedBy
export const getInstallsheet = (params) => {
  return service.get(`${window.globalUrl.HOME_API}agri-web/cd/installsheet/queryCreatedBy`, {params})
}
//农机品牌字典 cd/machine/getAllBrand
export const getAllBrand = (params) => {
  return service.get(`${window.globalUrl.HOME_API}agri-web/cd/machine/getAllBrand`, {params})
}

//农机信息分页查询
export const getMachineInfo = (params) => {
  return service.post(`${baseUrl}/cdMachinePage`, params, {isForm: true})
}

//农机历史记录
export const getMachineHistroy = (params) => {
  return service.get(`${baseUrl}/MachineHistroy`, {params})
}

//激活农机
export const activeMachine = (params) => {
  return service.get(`${baseUrl}/activateCdMachine`, {params})
}

//失效农机
export const unEffectCdMachine = (params) => {
  return service.get(`${baseUrl}/unEffectCdMachine`, {params})
}

//更换终端
export const changeTerminal = (params) => {
  return service.post(`${baseUrl}/alterTerminal`, params, {isForm: true})
}
//查询终端
export const getInquireTerminal = (params) => {
  return service.get(`${baseUrl}/inquireTerminal`, {params})
}

//开启面积计算
export const openComputeArea = (params) => {
  return service.get(`${baseUrl}/openComputeCdMachine`, {params})
}

//开启短信推送
export const openPushMessage = (params) => {
  return service.get(`${baseUrl}/openPushCdMachine`, {params})
}

//关闭面积计算
export const closeComputeArea = (params) => {
  return service.get(`${baseUrl}/closeComputeCdMachine`, {params})
}

//关闭短信推送
export const closePushMessage = (params) => {
  return service.get(`${baseUrl}/closePushCdMachine`, {params})
}

//通过id删除农机
export const delMachineById = (params) => {
  return service.get(`${baseUrl}/delCdMachine`, {params})
}

//上传行驶证图片
export const importDriverPicture = (params) => {
  return service.post(`${baseUrl}/driverPictureImport`, params)
}

//获取Ftp服务器地址
export const getFtpUrl = (params) => {
  return service.get(`${baseUrl}/getFtpUrl`, {params})
}

//下载农机excel导入模板
export const getExcelTemplate = (params) => {
  return service.get(`${baseUrl}/importTemplate`, {params})
}

//根据主键查农机信息
export const getMachineInfoById = (params) => {
  return service.get(`${baseUrl}/machineInfo/${params}`, )
}

//农机信息导出
export const exportMachinbeInfo = (params) => {
  return service.get(`${baseUrl}/machineInfoExcelPort`, {params})
}


//上传农机图片
export const importPicture = (params) => {
  return service.post(`${baseUrl}/pictureImport`, params)
}

//根据农机类型获取农机作业类型
export const getJobType = (params) => {
  return service.get(`${baseUrl}/queryOptionalJobTypeJsp`, {params})
}

//根据农机类型获取机具类型
export const getToolType = (params) => {
  return service.get(`${baseUrl}/queryToolTypeJsp`, {params})
}

//刷新机器缓存
export const refreshTerminalCache = (params) => {
  return service.get(`${baseUrl}/refreshTerminalCache`, {params})
}
//新增农机
export const addCdmachine = (params) => {
  return service.post(`${baseUrl}/addCdmachine`, params)
}

//修改农机
export const updateCdmachine = (params) => {
  return service.post(`${baseUrl}/updateCdmachine`, params)
}

//查询分则下的农机
export const getMachineList  = (params) =>{
  return service.get(`${baseUrl}/queryMachineList`,{params})
}

//电子安装单详情
export const queryMachineDetailInfo  = (params) =>{
  return service.get(`${window.globalUrl.HOME_API}agri-web/cd/installsheet/queryMachineDetailInfo`,{params})
}

//校验当前 toolIfa 与数据库 有无重复
export const checkToolIfaExist = (params) => {
  return service.post(`${baseUrl}/checkToolIfaExist`, params)
}

/**
 * 基础信息接口
 */

 import service from '@/request/index.js'

 const baseUrl = window.globalUrl.HOME_API +'agri-web/cd/productResources';
 
 /**
  * 生产资源管理
  */
 //新增资源
 export const addResourcesInfo = (params) => {
   return service.post(`${baseUrl}/addProductResourcesInfo`, params,{isform:true})
 }

 //删除资源
 export const delResourcesInfo = (params) => {
   return service.delete(`${baseUrl}/deleteCdProductResources`, {params})
 }
 
 //获取资源详情
 export const getResourcesInfo = (params) => {
   return service.get(`${baseUrl}/queryProductResourcesInfo`, {params})
 }
 
 //生产资源分页查询
 export const queryResourcesList = (params) => {
   return service.get(`${baseUrl}/queryProductResourcesList`, {params})
 }
 
  //获取省市名称对应编号
  export const getRegionInfoByLevel = (params) => {
    return service.get(`${baseUrl}/queryRegionInfoByLevel`, {params})
  }
  
   //生产资源编辑
   export const updateResources = (params) => {
    return service.post(`${baseUrl}/updateProductResourcesInfo`, params,{isform:true})
  }
  
//Excel导出
  export const resourcesExcelExport = (params) => {
    return service.post(`${baseUrl}/cdProductResourcesExcelPort`, params)
  }
 
//Excel批量导入
export const resourcesExcelImport = (params) => {
  return service.post(`${baseUrl}/productResourcesImport`, params)
}

//报表分析了里的
export const download = (params) =>{
  return service.post( `${window.globalUrl.HOME_API}agri-web/rp/statistics/downloadExcel`,params)
}
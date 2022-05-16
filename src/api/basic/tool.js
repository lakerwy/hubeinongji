/**
 * 基础信息接口
 */

 import service from '@/request/index.js'

 const baseUrl = window.globalUrl.HOME_API +'agri-web/cd/tool';
 
 /**
  * 机具信息
  */
 //新增机具
 export const addCdTool = (params) => {
   return service.post(`${baseUrl}/addCdTool`, params,{isForm: true})
 }

 //删除农机
 export const delCdTool = (params) => {
   return service.get(`${baseUrl}/delCdTool`, {params})
 }
 
 //分页查询机具信息
 export const queryToolPage = (params) => {
   return service.post(`${baseUrl}/queryToolPage`, params)
 }
 
 //修改机具信息
 export const updateCdTool = (params) => {
   return service.post(`${baseUrl}/updateCdTool`, params, {isForm: true})
 }
 
 //获取分组FullName
 export const getGroupFullName = (params) =>{
   return service.get(`${window.globalUrl.HOME_API}admin/group/getGroupFullNameById`,{params})
 }
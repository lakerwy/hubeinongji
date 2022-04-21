/**
 * 重复作业接口管理
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API + 'agri-web/areaCalculation'

//获取重复面积数据
export const getRepeatAreaInfo = (params) => {
  return service.post(`${baseUrl}/getAreaCalInfo`, params)
}

//地图面积图层
export const selectAreaCheckByMap = (params) => {
  return service.get(`${baseUrl}/selectAreaCheckByMap`, {params})
}

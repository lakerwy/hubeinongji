/**
 * 重复作业接口管理
 */
import service from '@/request/index.js'
const baseUrl = window.globalUrl.HOME_API + 'agri-web/areaCalculation'

//获取重复面积数据
export const getRepeatAreaInfo = (params) => {
  return service.post(`${baseUrl}/getAreaCalInfo`, params)
}

//获取重复面积统计数据
export const countAreaCalInfo = (params) => {
  return service.post(`${baseUrl}/countAreaCalInfo`, params)
}
//地图面积图层
export const selectAreaCheckByMap = (params) => {
  return service.get(`${baseUrl}/selectAreaCheckByMap`, {params})
}

//转换图形成json
export const polygonWktToPolygon = (params) => {
  return service.get(`${baseUrl}/polygonWktToPolygon`, {params})
}


//根据条件自动审核重复区域
export const autoUpdateAuditFlag = (params) => {
  return service.post(`${baseUrl}/autoUpdateAuditFlag`, params)
}


//导出重复作业报表
export const excelAreaCalInfo = (params) => {
  return service({
    url: `${baseUrl}/excelAreaCalInfo`,
    method: 'post',
    responseType: 'blob',
    data: params,
  }).then((response) => { // 处理返回的文件流
    const blob = response
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = params.title;
    document.body.appendChild(link)
    link.click()
    link.remove();
  })
}

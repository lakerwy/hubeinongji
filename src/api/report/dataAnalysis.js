/**
 * 报表分析-数据分析报表接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/rp/statistics'
//  const userLoginUrl = window.globalUrl.HOME_API + 'agri-web/rp/log/userLoginInfo'

 /** 任务完成情况汇总报表 */
 // 查询数据
export const queryTaskCompletion = (params) => {
  return service.post(`${baseUrl}/jobInfo/query`,params)
}
//导出Excel
export const exportTaskCompletion = (params) => {
  return service.post(`${baseUrl}/jobInfo/excelOutPut`,params)
}

/** 区域大数据报表 */
// 查询数据
export const queryRegionBigData = (params) => {
  return service.post(`${baseUrl}/regionBigDate/queryArea`,params,{isForm:true})
}

//导出Excel
export const exportRegionBigData = (params) => {
  return service.post(`${baseUrl}/regionBigDate/excelOutPut`,params,{isForm:true})
}


/** 作业日查询报表 */
// 查询数据
export const queryjobDate = (params) => {
  return service.post(`${baseUrl}/jobDate/query`,params,{isForm:true})
}

//导出Excel
export const exportjobDate = (params) => {
  return service.post(`${baseUrl}/jobDate/excelOutPut`,params,{isForm:true})
}

export const selectAreaDate = (params) => {
  return service.get(`${baseUrl}/selectAreaDate`,{params})
}

/**农机月上线报表 **/
//查询柱状图数据
export const queryMonthHistogram = (params) => {
  return service.post(`${baseUrl}/jobInfo/monthlyOnlineHistogram`,params)
}

export const queryDayHistogram = (params) =>{
  return service.post(`${baseUrl}/jobInfo/dayOnlineHistogram`,params)
}
//导出Excel
export const exportOnlineStatistics = (params) =>{
  return service({
    url: `${baseUrl}/jobInfo/excelOnlineStatistics`,
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

//查询列表数据
export const queryTable = (params) => {
  return service.post(`${baseUrl}/jobInfo/monthlyOnlineStatistics`,params)
}

/**监控面积统计报表**/
//查询列表数据
export const queryDetectionAreaTable = (params) => {
  return service.post(`${baseUrl}/jobInfo/monitoringAreaReport`,params)
}

//导出excel


//导出重复作业报表
export const exportMonitoringAreaReport = (params) => {
  // debugger
  return service({
    url: `${baseUrl}/jobInfo/excelMonitoringAreaReport`,
    method: 'post',
    responseType: 'blob',
    data: params,
  }).then((response) => { // 处理返回的文件流
    // debugger
    const blob = response
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = params.title;
    document.body.appendChild(link)
    link.click()
    link.remove();
  })
}

/**农机终端面积统计报表*/
//当日安装数据
export const queryTodayInstallsChart = (params) => {
  return service.post(`${baseUrl}/jobInfo/todayInstallsChart`,params)
}

//TimeTab数据
export const queryGrandTotalWorkAreaTimeTab = (params) => {
  return service.post(`${baseUrl}/jobInfo/grandTotalWorkAreaTimeTab`,params)
}

//TypeTab数据
export const queryGrandTotalWorkAreaTypeTab = (params) => {
  return service.post(`${baseUrl}/jobInfo/grandTotalWorkArea`,params)
}

//分页数据
export const getAgriTerminalTableData = params => {
  return service.post(`${baseUrl}/jobInfo/grandTotalWorkAreaPagination`,params)
}
//导出excel
export const excelGrandTotalWorkArea = (params) => {
  return service({
    url: `${baseUrl}/jobInfo/excelGrandTotalWorkArea`,
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
/**
 * 作业管理接口管理
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API + 'agri-web/jobManagement'

/**
 * 作业审核
 */
// 获取作业标记时间
export const getWorkingDateByMonth = (params) => {
  return service.get(`${baseUrl}/getDateByMonth`, {params})
}

// 作业审核根据条件查询
export const queryByCondition = (params) => {
  return service.post(`${baseUrl}/queryByCondition`, params)
}

// 获取统计数据
export const getSummaryData = (params) => {
  return service.post(`${baseUrl}/getSummaryData`, params)
}

// 作业审核-删除
export const deleteJobArea = (params) => {
  return service.post(`${baseUrl}/deleteJobArea`, params, {isForm: true})
}

// 审核通过 不通过
export const updateAuditFlagStatus = (params) => {
  return service.post(`${baseUrl}/updateAuditFlagStatus`, params, {isForm: true})
}

// 审核不通过原因list
export const getReasonList = (params) => {
  return service.get(`${baseUrl}/getReasonList`, {params})
}

// 获取省市区数据
export const selectProvince = (params) => {
  return service.get(`${baseUrl}/selectProvince`, {params})
}

// 地图上的轨迹点
export const queryTrailLine = (params) => {
  return service.get(`${baseUrl}/queryTrailLineByTerminalIdAndTime2`, {params})
}

// 地图上的轨迹点-地块
export const selectAreaCheckByMap = (params) => {
  return service.get(`${baseUrl}/selectAreaCheckByMap`, {params})
}

// 地图上的深度轨迹点-深度
export const queryTerminalTrailInfo = (params) => {
  return service.post(`${baseUrl}/queryTerminalTrailInfo`, params, {isForm: true})
}

// 地图上的深度轨迹点详情
export const searchForMachineInfo = (params) => {
  return service.get(`${baseUrl}/searchForMachineInfo`, {params})
}

// 深松作业深度点标准
export const queryDepthCriterion = (params) => {
  return service.post(`${baseUrl}/queryDepthCriterion`, params, {isForm: true})
}


// 根据id获取补报回显
export const getDetailByMachinId = (params) => {
  return service.get(`${baseUrl}/getDetailByMachinId`, {params})
}

// 补报提交之前查询
export const selectAreaByTimePlateNumber = (params) => {
  return service.get(`${baseUrl}/selectAreaByTimePlateNumber`, {params})
}

// 补报提交
export const additionalReport = (params) => {
  // return service.post(`${baseUrl}/additionalReport`, params, {isForm: true})
  return service({
    url: `${baseUrl}/additionalReport`,
    method: 'post',
    data: params
  })
}

// 机具类型与作业类型关系
export const selectJobTypeChange = (params) => {
  return service.get(`${baseUrl}/selectJobTypeChange`, {params})
}

// 农机类型与机具类型关系
export const selectToolTypeChange = (params) => {
  return service.get(`${baseUrl}/selectToolTypeChange`, {params})
}

// 批量修改
export const updateJobAreaAlot = (params) => {
  // return service.post(`${baseUrl}/updateJobAreaAlot`, params)
  return service({
    url: `${baseUrl}/updateJobAreaAlot`,
    method: 'post',
    params: params
  })
}

// 作业面积修改
export const updateJobArea = (params) => {
  // return service.post(`${baseUrl}/updateJobArea`, params)
  return service({
    url: `${baseUrl}/updateJobArea`,
    method: 'post',
    data: params,
    // isForm: true
  })
}

// 作业上报
export const insertApperJobArea = (params) => {
  return service({
    url: `${baseUrl}/insertApperJobArea`,
    method: 'post',
    data: params,
    // isForm: true
  })
}

// 深度上报
export const insertApperJobDepth = (params) => {
  return service({
    url: `${baseUrl}/insertApperJobDepth`,
    method: 'post',
    data: params,
  })
}

//上传图片
export const workUploadImg = (params) => {
  return service.post(`${baseUrl}/uploadImg`, params,)
}

//获取重复地块详细信息
export const queryRepeatAreaByRowId = (params) => {
  return service.get(`${baseUrl}/queryRepeatAreaByRowId`, {params})
}

//导出作业报表
export const excelAreaInfo = (params) => {
  return service({
    url: `${baseUrl}/excelAreaInfo`,
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
  }).catch(err=>{
    console.log(err);
  })
}
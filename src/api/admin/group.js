/**
 * 系统常用接口
 */
 import service from '@/request/index.js'
 const baseUrl = window.globalUrl.HOME_API

 // 获取分组农机树/at/job/getCdMachine   /sm/group/getGroupTree
export const getGroupTree = (params) => {
  return service.get(`/admin/group/getGroupTree`, {params})
}
export const getCdMachine = (params) => {
  return service.get(`/admin/group/getMachineTree`, {params})
}
export const getAllGroupTree = (params) => {
    return service.get(`/admin/group/getAllGroupTree`, {params})
}
export const getGroupsByGroupPid = (params) => {
    return service.get(`/admin/group/getGroupsByGroupPid/`+params)
}

export const listGroup = (params) => {
    return service.get(`/admin/group/listGroup`,{params})
}

export const addGroup = (params) => {
    return service.get(`/admin/group/addGroup`,{params})
}

export const updateGroup = (params) => {
    return service.get(`/admin/group/editGroup`,{params})
}

export const deleteGroup= (params) => {
    return service.get(`/admin/group/deleteGroupByGroupId`,{params})
}

export const transerGroup= (params) => {
    return service.get(`/admin/group/transerGroup`,{params})
}



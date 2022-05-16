/**
 * 系统常用接口
 */
import service from '@/request/index.js'
import store from '@/store'

const baseUrl = window.globalUrl.HOME_API

// 获取分组农机树/at/job/getCdMachine   /sm/group/getGroupTree
export const getGroupTree = (params) => {
    params = Object.assign({}, params, store.getters.globalSetting)
    return service.get(`${baseUrl}admin/group/getGroupTree`, {params})
}
export const getCdMachine = (params) => {
    params = Object.assign({}, params, store.getters.globalSetting)
    return service.get(`${baseUrl}admin/group/getMachineTree`, {params})
}
export const getAllGroupTree = (params) => {
    return service.get(`${baseUrl}admin/group/getAllGroupTree`, {params})
}
export const getGroupsByGroupPid = (params) => {
    return service.get(`${baseUrl}admin/group/getGroupsByGroupPid/` + params)
}

export const listGroup = (params) => {
    return service.get(`${baseUrl}admin/group/listGroup`, {params})
}

export const addGroup = (params) => {
    return service.get(`${baseUrl}admin/group/addGroup`, {params})
}

export const updateGroup = (params) => {
    return service.get(`${baseUrl}admin/group/editGroup`, {params})
}

export const deleteGroup = (params) => {
    return service.get(`${baseUrl}admin/group/deleteGroupByGroupId`, {params})
}

export const transerGroup = (params) => {
    return service.get(`${baseUrl}admin/group/transerGroup`, {params})
}



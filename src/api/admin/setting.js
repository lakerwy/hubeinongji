/*
 *    Copyright (c) 2018-2025, intelligence All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: intelligence
 */

import request from '@/request/index'

const adminUrl = window.globalUrl.HOME_API + 'admin/';


/*------------------------------------农机/机具/作业配型配置*/
//获取列表
export function fetchJobtypeList(query) {
    return request({
        url: adminUrl + '/jobtype/page',
        method: 'get',
        params: query
    })
}
//按照农机类型、机具类型、作业类型获取列表
export function fetchJobtypeList2(query) {
    return request({
        url: adminUrl + '/jobtype/list',
        method: 'get',
        params: query
    })
}
//新增
export function addJobtypeObj(obj) {
    return request({
        url: adminUrl + '/jobtype',
        method: 'post',
        data: obj
    })
}

export function getJobtypeObj(id) {
    return request({
        url: adminUrl + '/jobtype/' + id,
        method: 'get'
    })
}
//删除
export function delJobtypeObj(id) {
    return request({
        url: adminUrl + '/jobtype/' + id,
        method: 'delete'
    })
}

//修改
export function updateJobtypeObj(obj) {
    return request({
        url: adminUrl + '/jobtype',
        method: 'put',
        data: obj
    })
}

/*------------------------------------作业季配置管理-----------*/
//获取列表
export function fetchJobseasonList(query) {
    return request({
        url: adminUrl + '/jobseason/page2',
        method: 'get',
        params: query
    })
}

//获取列表
export function fetchJobseasonListByGroup(query) {
    return request({
        url: adminUrl + '/jobseason/findGroupJobSeason',
        method: 'get',
        params: query
    })
}

//新增作业季
export function addJobSeasonObj(query) {
    return request({
        url: adminUrl + '/jobseason/addJobSeason',
        method: 'post',
        data: query
    })
}
//修改作业季
export function updateJobSeasonObj(query) {
    return request({
        url: adminUrl + '/jobseason/updateJobSeason',
        method: 'put',
        data: query
    })
}

//删除作业季
export function delJobSeasonObj(id) {
    return request({
        url: adminUrl + '/jobseason/'+ id,
        method: 'delete',
    })
}
/*------------------------------------作业任务管理-----------*/
//获取列表
export function fetchJobTaskList(query) {
    return request({
        url: adminUrl + '/mission/page',
        method: 'get',
        params: query
    })
}


//新增作业季
export function addJobTaskObj(query) {
    return request({
        url: adminUrl + '/mission',
        method: 'post',
        data: query
    })
}
//修改作业季
export function updateJobTaskObj(query) {
    return request({
        url: adminUrl + '/mission',
        method: 'put',
        data: query
    })
}

//删除作业季
export function delJobTaskObj(id) {
    return request({
        url: adminUrl + '/mission/'+ id,
        method: 'delete',
    })
}
/*------------------------------------分组审核标准-----------*/
//获取列表
export function fetchAuditList(query) {
    return request({
        url: adminUrl + '/auditStandard/page',
        method: 'get',
        params: query
    })
}


//新增审核标准
export function addAuditObj(query) {
    return request({
        url: adminUrl + '/auditStandard',
        method: 'post',
        data: query
    })
}
//修改审核标准
export function updateAuditObj(query) {
    return request({
        url: adminUrl + '/auditStandard',
        method: 'put',
        data: query
    })
}

//删除审核标准
export function delAuditObj(id) {
    return request({
        url: adminUrl + '/auditStandard/'+ id,
        method: 'delete',
    })
}
/*------------------------------------分组算法管理-----------*/
//获取列表
export function fetchComputeList(query) {
    return request({
        url: adminUrl + '/computeType/page',
        method: 'get',
        params: query
    })
}


//新增算法配置
export function addComputeObj(query) {
    return request({
        url: adminUrl + '/computeType',
        method: 'post',
        data: query
    })
}
//修改算法配置
export function updateComputeObj(query) {
    return request({
        url: adminUrl + '/computeType',
        method: 'put',
        data: query
    })
}

//删除算法配置
export function delComputeObj(id) {
    return request({
        url: adminUrl + '/computeType/'+ id,
        method: 'delete',
    })
}
/*------------------------------------用户设置-------------------------------*/
//获取用户作业类型树
export function fetchJobTypeTree(query) {
    return request({
        url: adminUrl + '/setting/jobTypeTree',
        method: 'get',
        params: query
    })
}
//根据作业类型获取用户作业季
export function fetchSeasons(query) {
    return request({
        url: adminUrl + '/setting/seasons',
        method: 'get',
        params: query
    })
}
//获取用户首页设置
export function  fetchGlobalSetting(){
    return request({
        url: adminUrl + '/setting/globalSetting',
        method: 'get',
    })
}

//保存用户首页设置
export function  saveGlobalSetting(data){
    return request({
        url: adminUrl + '/setting/saveGlobalSetting',
        method: 'post',
        data:data
    })
}
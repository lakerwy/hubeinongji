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

//获取用户列表
export function fetchList(query) {
    return request({
        url: adminUrl + '/user/page',
        method: 'get',
        params: query
    })
}

//新增用户
export function addObj(obj) {
    return request({
        url: adminUrl + '/user',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: adminUrl + '/user/' + id,
        method: 'get'
    })
}

//删除用户
export function delObj(id) {
    return request({
        url: adminUrl + '/user/delete/' + id,
        method: 'delete'
    })
}

//修改用户
export function putObj(obj) {
    return request({
        url: adminUrl + '/user/update',
        method: 'put',
        data: obj
    })
}
//重置密码
export function resetPwd(obj) {
  return request({
    url: adminUrl + '/user/resetPwd',
    method: 'post',
    data: obj
  })
}
//获取用户管理范围
export function getGroups(obj) {
  return request({
    url: adminUrl + '/user/getGroups/' + obj,
    method: 'get'
  })
}

//更新用户管理范围
export function updateGroups(obj) {
  return request({
    url: adminUrl + '/user/editGroups',
    method: 'post',
    data:obj
  })
}

export function getDetails(obj) {
    return request({
        url: adminUrl + '/user/details/' + obj,
        method: 'get'
    })
}

// 更改个人信息
export function editInfo(obj) {
    return request({
        url: adminUrl + '/user/edit',
        method: 'put',
        data: obj
    })
}
// 更改个人信息
export function fetchRoles(obj) {
    return request({
        url: adminUrl + '/user/roles/' + obj,
        method: 'get',
    })
}

//修改密码
export function modifyPwd(obj) {
    return request({
        url: adminUrl + '/user/modifypwd',
        method: 'post',
        data:obj
    })
}
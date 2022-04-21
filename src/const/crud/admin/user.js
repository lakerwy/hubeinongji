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
import {getDetails} from '@/api/admin/user'


var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  selection: true,
  stripe: false,
  menuAlign: 'center',
  searchMenuSpan:6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  refreshBtn:false, // 刷新按钮
  columnBtn:false, // 列显隐按钮
  searchBtn:false, // 搜索按钮
  dialogWidth: '750',
  dialogTop: '30%',
  labelWidth: 120,
  column: [{
    // fixed: true,
    label: 'id',
    prop: 'rowId',
    // span: 24,
    hide: true,
    editDisabled: true,
    editDisplay: false,
    addDisplay: false
  }, 
  {
    // fixed: true,
    label: '登录名',
    prop: 'username',
    // addDisplay: false,
  },
  {
    label: '真实姓名',
    prop: 'realName',
  },
  {
    label: '手机号',
    prop: 'mobile',
  },
  {
    width: 180,
    label: '过期时间',
    prop: 'expirationNtime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    // span: 24
  },
  {
    label: '用户类型',
    prop: 'usertype',
    formatter:function (val) {
      console.log("this.userTypes",this.userTypes)
      if(this.userTypes){
        this.userTypes.forEach((ele,index)=>{
          if(ele.itemCode==val){
            return ele.itemName
          }
        })
      }
      return val.usertype
    }
  }, 
  {
    label: '厂商名称',
    prop: 'companyName',
    labelslot: true,
    formslot: true,
    showClomnu: false
  },
  {
    label: '首页标题',
    prop: 'usertitle',
    value: '',
    hide: true,
    // span: 24,
  }
]
}

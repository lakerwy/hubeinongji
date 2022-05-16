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
import {rule} from "@/util/validateRules";

export const tableOption = {
    border: true,
    height: '100%',
    index: true,
    indexLabel: '序号',
    indexWidth: 80,
    selection: true,
    stripe: false,
    menuAlign: 'left',
    menu: true,
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    align: 'left',
    addBtn: false,
    viewBtn: false,
    refreshBtn: false, // 刷新按钮
    columnBtn: false, // 列显隐按钮
    searchBtn: false, // 搜索按钮
    column: [
        {
            label: '角色名称',
            prop: 'roleName',
            width: 300,
            span: 24,
            rules: [
                {required: true, message: '角色名称不能为空', trigger: 'blur'},
                {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'},
                {whitespace:true,message: '不能全部为空格',trigger: 'blur'}
            ]

            //   width: 120,
            //   label: '角色标识',
            //   prop: 'roleCode',
            //   span: 24,
            //   editDisabled: true,
            //   rules: [
            //     { required: true, message: '角色标识不能为空', trigger: 'blur' },
            //     { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
            //     { validator: rule.validatorKey, trigger: 'blur'}
            //   ]
        }, {
            label: '角色描述',
            prop: 'roleDescription',
            overHidden: true,
            type: 'textarea',
            span: 24,
            row: true,
            minRows: 2,
            rules: [
                {max: 100, message: '长度最多100字符', trigger: 'blur'},
            ]
        }
    ]
}

<!--
  -    Copyright (c) 2018-2025, intelligence All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: intelligence
  -->

<template>
    <div class="user">
        <titleBox :headName="'用户管理'"/>
        <basic-container class="basic-con">
            <el-row :span="24">
                <!-- <el-col
                  :xs="24"
                  :sm="24"
                  :md="5"
                  class="user__tree my-form">
                  <avue-tree
                    :option="treeOption"
                    :data="treeData"
                    @node-click="nodeClick">
                    <span class="el-tree-node__label" slot-scope="{ node, data }">
                      <el-tooltip class="item" effect="dark" content="无数据权限" placement="right-start" v-if="data.isLock">
                        <span>{{node.label}}  <i class="el-icon-lock"></i></span>
                      </el-tooltip>
                      <span v-if="!data.isLock">{{node.label}}</span>
                    </span>
                  </avue-tree>
                </el-col> -->
                <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        class="user__main">
                    <el-form :model="searchForm" :inline="true" class="my-form" label-width="90px">
                        <el-form-item label="分组名称:">
                            <el-input v-model="searchForm.groupIds" placeholder="请选择分组"
                                      @focus="setGroupBoxStatus(true)"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名:">
                            <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名:">
                            <el-input v-model="searchForm.realName" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户类型:">
                            <el-select v-model="searchForm.usertype" placeholder="请选择用户类型">
                                <el-option
                                        v-for="item in userTypes"
                                        :key="item.itemCode"
                                        :label="item.itemName"
                                        :value="item.itemCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用户角色:">
                            <el-input v-model="searchForm.roleId" placeholder="请输入角色信息"></el-input>
                        </el-form-item>
                        <el-button style="width: 90px;" class="shadow-btn" plain round size="medium"
                                   @click="searchUser">查询
                        </el-button>
                    </el-form>
                    <avue-crud
                            class="my-table"
                            ref="crud"
                            :option="tableOption"
                            v-model="form"
                            :page="page"
                            :table-loading="listLoading"
                            :before-open="handleOpenBefore"
                            :data="list"
                            @on-load="getList"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            @row-update="update"
                            @row-save="create"
                            @select="handleSelectionChange">
                        <template slot="empty">
                            <avue-empty
                                    image="img/img-zwsj.png"
                                    desc="暂无数据">
                            </avue-empty>
                        </template>
                        <template slot="menuLeft">
                            <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleAdd">新增
                            </el-button>
                          <!--  <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleUpdate">修改
                            </el-button>-->
                            <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="deletes">批量删除
                            </el-button>
                            <!-- <el-button
                               class="shadow-btn"
                               plain
                               round
                               size="mini"
                               @click="handleImport">导入</el-button>
                             <el-button
                               class="shadow-btn"
                               plain
                               round
                               size="mini">导出</el-button>-->
                        </template>
                        <template
                                slot="username"
                                slot-scope="scope">
                            <el-button
                                    type="text"
                                    size="medium"
                                    class="table-text-btn"
                                    @click="viewDetail(scope.row,scope.index)">
                                {{scope.row.username}}
                            </el-button>
                        </template>
                        <!--                        <template
                                                        slot="role"
                                                        slot-scope="scope">
                                      <span
                                              v-for="(role,index) in scope.row.roleList"
                                              :key="index">
                                        <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
                                      </span>
                                                </template>-->
                        <!--                        <template
                                                        slot="lockFlag"
                                                        slot-scope="scope">
                                                    <el-tag>{{ scope.label }}</el-tag>
                                                </template>-->
                        <template
                                slot="menu"
                                slot-scope="scope">
                            <el-button
                                    v-if="userManager_btn_edit"
                                    type="text"
                                    size="small"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row,scope.index)">编辑
                            </el-button>
                            <el-button
                                    v-if="userManager_btn_del"
                                    type="text"
                                    size="small"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.row,scope.index)">删除
                            </el-button>
                            <el-button
                                    v-if="userManager_btn_perm"
                                    type="text"
                                    size="small"
                                    icon="el-icon-plus"
                                    @click="handlePermission(scope.row,scope.index)">数据权限
                            </el-button>
                            <el-button
                                    v-if="userManager_btn_reset"
                                    type="text"
                                    size="small"
                                    icon="el-icon-plus"
                                    @click="handlePermission(scope.row,scope.index)">数据权限
                            </el-button>
                        </template>
                        <template
                                slot="deptIdForm"
                                slot-scope="scope">
                            <avue-input-tree
                                    v-model="form.deptId"
                                    :node-click="getNodeData"
                                    :dic="treeDeptData"
                                    :props="defaultProps"
                                    placeholder="请选择所属部门"/>
                        </template>
                        <template
                                slot="roleForm"
                                slot-scope="scope">
                            <avue-select
                                    v-model="role"
                                    :dic="rolesOptions"
                                    :props="roleProps"
                                    multiple
                                    placeholder="请选择角色"/>
                        </template>
                        <template slot="companyLabel" slot-scope="scope"
                                  v-if="form.userType === 4 || form.userType === 5">
                            {{form.userType === 4 ? '设备厂商' : form.userType === 5 ? '农机厂商' : ''}}
                        </template>
                        <template slot="companyForm" slot-scope="scope"
                                  v-if="form.userType === 4 || form.userType === 5">
                            <avue-select
                                    v-model="company"
                                    :dic="[form.userType === 4 ? rolesOptions : options]"
                                    :props="roleProps"
                                    multiple
                                    placeholder="请选择厂商"/>
                        </template>
                    </avue-crud>
                </el-col>
            </el-row>
        </basic-container>
        <myPagination
                style="margin-top:32px;"
                :currentPage="page.currentPage"
                :pageSize="page.pageSize"
                :total="page.total"
                @current-change="currentChange"
                @size-change="sizeChange"/>

        <importDialog ref="import"/>

    </div>

</template>

<script>
    import {addObj, delObj, fetchList, putObj} from '@/api/admin/user'
    import {deptRoleList} from '@/api/admin/role'
    import {fetchTree} from '@/api/admin/dept'
    //import {tableOption} from '@/const/crud/admin/user'
    import {mapGetters, mapMutations} from 'vuex'
    import titleBox from '_com/contenBox/titleBox.vue'
    import myPagination from '_com/myPagination/index.vue'
    import importDialog from '../components/importDialog'
    import {getUserList} from "../../../api/admin/user";
    import {fetchItemList} from '@/api/admin/dict'

    const searchForm = {
        username: '',
        realName: '',
        usertype: '',
        roleId: '',
        companyName: '',
    }

    export default {
        name: 'SysUser',
        components: {
            titleBox,
            myPagination,
            importDialog
        },
        data() {
            return {
                searchForm: Object.assign({}, searchForm),
                userTypes: [],
                treeOption: {
                    nodeKey: 'id',
                    addBtn: false,
                    menu: false,
                    props: {
                        label: 'name',
                        value: 'id'
                    }
                },
                treeData: [],
                treeDeptData: [],
                checkedKeys: [],
                roleProps: {
                    label: 'roleName',
                    value: 'roleId'
                },
                defaultProps: {
                    label: 'name',
                    value: 'id'
                },
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10, // 每页显示多少条,
                    isAsc: false// 是否倒序
                },
                list: [],
                listLoading: false,
                role: [],
                form: {},
                rolesOptions: [],
                selection: [],
                tableOption: {
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    selection: true,
                    stripe: false,
                    menuAlign: 'center',
                    menuWidth: 300,
                    searchMenuSpan: 6,
                    editBtn: false,
                    delBtn: false,
                    align: 'left',
                    addBtn: false,
                    refreshBtn: false, // 刷新按钮
                    columnBtn: false, // 列显隐按钮
                    searchBtn: false, // 搜索按钮
                    dialogWidth: '750',
                    dialogTop: '30%',
                    labelWidth: 150,
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
                            width: 200,
                            // addDisplay: false,
                        },
                        {
                            label: '真实姓名',
                            prop: 'realName',
                            width: 200,
                        },
                        {
                            label: '手机号',
                            prop: 'mobile',
                            width: 200,
                        },
                        {
                            width: 200,
                            label: '过期时间',
                            prop: 'expirationNtime',
                            type: 'datetime',
                            format: 'yyyy-MM-dd HH:mm',
                            valueFormat: 'yyyy-MM-dd HH:mm:ss',
                            span: 24
                        },
                        {
                            label: '用户类型',
                            width: 200,
                            formatter: this.formatterUserType
                        },
                        /*  {
                              label: '厂商名称',
                              prop: 'companyName',
                              labelslot: true,
                              formslot: true,
                              showClomnu: false,
                              hide: true,
                          },*/
                        /*   {
                               label: '首页标题',
                               prop: 'usertitle',
                               value: '',
                               hide: true,
                               // span: 24,
                           }*/
                    ]
                },
                userManager_btn_add: true,
                userManager_btn_edit: true,
                userManager_btn_del: true,
                userManager_btn_perm: true,
                userManager_btn_reset: true

            }
        },
        computed: {
            ...mapGetters(['permissions', 'groupData'])
        },
        watch: {
            role() {
                this.form.role = this.role
            }
        },


        created() {
            // this.sys_user_add = this.permissions['sys_user_add']
            // this.sys_user_edit = this.permissions['sys_user_edit']
            // this.roleManager_btn_add = this.permissions['sys_role_add']
            // this.roleManager_btn_edit = this.permissions['sys_role_edit']
            // this.roleManager_btn_del = this.permissions['sys_role_del']
            // this.roleManager_btn_perm = this.permissions['sys_role_perm']
            //this.sys_user_del = this.permissions['sys_user_del'] || true
            this.init()
        },
        methods: {
            ...mapMutations({
                setGroupBoxStatus: 'setGroupBoxStatus',
            }),
            init() {
                //初始化用户类型
                this.initUserTypes("user_type");
                this.searchUser();
            },
            nodeClick(data) {
                this.page.page = 1
                this.getList(this.page, {deptId: data.id})
            },
            //可以写成全局的
            initUserTypes(listType) {
                fetchItemList(Object.assign({
                    current: 1,
                    size: 10000
                }, {listType: listType})).then(response => {
                    this.userTypes = Object.assign([], response.data.records);
                })
            },
            //获取用户列表
            searchUser() {
                // this.searchForm = param
                this.page.currentPage = 1
                this.getList(this.page, this.searchForm)
                // done()
            },
            async getList(page, params) {
                this.listLoading = true
                // fetchList(Object.assign({
                //   current: page.currentPage,
                //   size: page.pageSize
                // }, params, this.searchForm)).then(response => {
                //   this.list = response.data.data.records
                //   this.page.total = response.data.data.total
                //   this.listLoading = false
                // })
                let res = await getUserList(Object.assign({
                    current: page.currentPage,
                    size: page.pageSize
                }, params));
                if (res) {
                    this.list = res.data.records;
                    this.page.total = res.data.total;
                    this.listLoading = false;
                }

            },
            getNodeData() {
                deptRoleList().then(response => {
                    this.rolesOptions = response.data.data
                })
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize
            },
            currentChange(current) {
                this.page.currentPage = current;
                this.getList(this.page, this.searchForm);
            },
            refreshChange() {
                this.getList(this.page)
            },
            handleOpenBefore(show, type) {
                window.boxType = type
                // 查询部门树
                fetchTree().then(response => {
                    this.treeDeptData = response.data.data
                })
                // 查询角色列表
                deptRoleList().then(response => {
                    this.rolesOptions = response.data.data
                })

                if (['edit', 'views'].includes(type)) {
                    this.role = []
                    // for (let i = 0; i < this.form.roleList.length; i++) {
                    //   this.role[i] = this.form.roleList[i].roleId
                    // }
                } else if (type === 'add') {
                    this.role = []
                }
                show()
            },
            // 表格选择项发生改变时触发
            handleSelectionChange(selection) {
                this.selection = selection;
            },
            //新增用户
            handleAdd() {
                if (this.groupData.name) {
                    this.$refs.crud.rowAdd();
                } else {
                    this.$confirm('请选择分组', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                    }).catch(() => {
                    });
                }
            },
            // 编辑用户
            handleUpdate() {
                if (this.selection.length <= 0) {
                    this.$message.info('请选择需要修改的用户');
                    return;
                } else if (this.selection.length > 1) {
                    this.$message.info('只能选择一个用户进行修改！');
                    return;
                }
                this.$refs.crud.rowEdit(this.selection[0])
            },
            // 新增保存用户
            create(row, done, loading) {
                console.log(row, 'row')
                if (this.form.phone.indexOf('*') > 0) {
                    this.form.phone = undefined
                }
                addObj(this.form).then(() => {
                    this.getList(this.page)
                    done()
                    this.$notify.success('创建成功')
                }).catch(() => {
                    loading()
                })
            },
            // 编辑更新
            update(row, index, done, loading) {
                if (this.form.phone && this.form.phone.indexOf('*') > 0) {
                    this.form.phone = undefined
                }
                putObj(this.form).then(() => {
                    this.getList(this.page)
                    done()
                    this.$notify.success('修改成功')
                }).catch(() => {
                    loading()
                })
            },
            // 删除
            deletes() {
                if (this.selection.length <= 0) {
                    this.$message.info('请选择需要删除的用户');
                    return;
                }
                this.$confirm('此操作将永久删除选择的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    delObj(row.userId)
                        .then(() => {
                            this.$notify.success('删除成功')
                        }).catch(() => {
                        this.$notify.error('删除失败')
                    })
                })
            },
            // 导入用户
            handleImport() {
                this.$refs.import.dialogVisible = true;
            },
            formatterUserType(val) {
                let userTypeName = val.usertype;
                if (this.userTypes) {
                    this.userTypes.forEach((ele, index) => {
                        if (ele.itemCode == val.usertype) {
                            userTypeName = ele.itemName;
                            return
                        }
                    })
                }
                return userTypeName
            }
        }
    }
</script>
<style lang="less" scoped>
    .user {
        &__tree {
            padding-top: 3px;
            padding-right: 20px;
        }

        &__main {
            .el-card__body {
                padding-top: 0;
            }

            .my-form {
                border-bottom: #133460 1px solid;
            }

        }

        .basic-con {
            .my-form {
                // border-bottom: #133460 1px solid;
                .el-form-item {
                    margin-bottom: 18px;
                    margin-right: 20px;
                }

                /deep/ .el-form-item__label {
                    line-height: 36px;
                }
            }

            .my-table {
                margin-top: 19px;
                height: calc(100% - 84px);

                /deep/ .el-form {
                    height: calc(100% - 54px);
                }
            }
        }
    }
</style>


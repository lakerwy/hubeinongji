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
    <div class="app-container calendar-list-container">
        <titleBox :headName="'角色管理'"/>
        <basic-container class="basic-con">
            <el-form class="my-form" :model="searchForm" :inline="true">
                <el-form-item label="角色名称:" label-width="80px">
                    <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button style="width: 90px;" class="shadow-btn" plain round size="medium" @click="searchChange" v-if="roleManager_btn_view">
                        查询
                    </el-button>
                    <el-button
                            style="width: 90px;"
                            v-if="roleManager_btn_add"
                            class="shadow-btn"
                            plain
                            round
                            size="medium"
                            @click="handleCreate">新增
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- <avue-crud
                    ref="crud"
                    class="my-table"
                    :option="tableOption"
                    :data="list"
                    v-model="form"
                    :table-loading="listLoading"
                    :before-open="handleOpenBefore"
                    @on-load="getList"
                    @refresh-change="refreshChange"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @row-update="update"
                    @row-save="create"
                    @select="handleSelectionChange"> -->
            <avue-crud
                ref="crud"
                class="my-table"
                :page="page"
                :option="tableOption"
                :data="list"
                v-model="form"
                :table-loading="listLoading"
                :before-open="handleOpenBefore"
                @on-load="getList"
                @refresh-change="refreshChange"
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
                <template slot="dsScopeForm" slot-scope="scope">
                    <div v-if="form.dsType == 1">
                        <el-tree
                                ref="scopeTree"
                                :data="dsScopeData"
                                :check-strictly="true"
                                :props="defaultProps"
                                :default-checked-keys="checkedDsScope"
                                class="filter-tree"
                                node-key="id"
                                highlight-current
                                show-checkbox/>
                    </div>
                </template>

                <template
                        slot="menu"
                        slot-scope="scope">
                    <el-button
                            v-if="roleManager_btn_edit"
                            type="text"
                            size="small"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row,scope.index)">编辑
                    </el-button>
                    <el-button
                            v-if="roleManager_btn_del"
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row,scope.index)">删除
                    </el-button>
                    <el-button
                            v-if="roleManager_btn_perm"
                            type="text"
                            size="small"
                            icon="el-icon-plus"
                            @click="handlePermission(scope.row,scope.index)">权限
                    </el-button>
                </template>
            </avue-crud>
        </basic-container>
        <myPagination
                style="margin-top:32px;"
                :currentPage="page.currentPage"
                :pageSize="page.pageSize"
                :total="page.total"
                @current-change="currentChange"
                @size-change="sizeChange" />

        <el-dialog
                class="my-dialog"
                :visible.sync="dialogPermissionVisible"
                :close-on-click-modal="false"
                title="分配权限"
                top="10vh"
                width="350px !important"
                >
            <div class="dialog-main-tree">
                <el-tree
                        class="my-tree"
                        ref="menuTree"
                        :data="treeData"
                        :default-checked-keys="checkedKeys"
                        :check-strictly="false"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        node-key="id"
                        highlight-current
                        show-checkbox
                        default-expand-all/>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button
                        type="primary"
                        size="small"
                        @click="updatePermession(roleId)">更新
                </el-button>
                <el-button
                        type="default"
                        size="small"
                        @click="cancal()">取消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj} from '@/api/admin/role'
    import {tableOption} from '@/const/crud/admin/role'
    import {fetchMenuTree} from '@/api/admin/menu'
    import {mapGetters} from 'vuex'
    import titleBox from '_com/contenBox/titleBox.vue'
    import myPagination from '_com/myPagination/index.vue'

    export default {
        name: 'TableRole',
        components: {
            titleBox,
            myPagination
        },
        data() {
            return {
                searchForm: {},
                tableOption: tableOption,
                dsScopeData: [],
                treeData: [{name: '湖北省', id: '4201120', children: [{name: '武汉市', id: '420552'}]}],
                checkedKeys: [],
                checkedDsScope: [],
                defaultProps: {
                    label: 'name',
                    value: 'id'
                },
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10 // 每页显示多少条
                },
                menuIds: '',
                list: [],
                listLoading: true,
                form: {},
                roleId: undefined,
                roleCode: undefined,
                rolesOptions: undefined,
                dialogPermissionVisible: false,
                dialogVisible: false,
                roleManager_btn_view: false,
                roleManager_btn_add: false,
                roleManager_btn_edit: false,
                roleManager_btn_del: false,
                roleManager_btn_perm: false,
                dialogTitle: '新增角色',
                selection: []
            }
        },
        created() {
            this.getBtnPermis()  //按钮权限
        },
        computed: {
            ...mapGetters(['elements', 'permissions'])
        },
        methods: {
            getBtnPermis(){
              this.roleManager_btn_view = this.permissions[window.global.buttonPremission.roleView]
              this.roleManager_btn_add = this.permissions[window.global.buttonPremission.roleAdd]
              this.roleManager_btn_edit = this.permissions[window.global.buttonPremission.roleEdit]
              this.roleManager_btn_del = this.permissions[window.global.buttonPremission.roleDelete]
              this.roleManager_btn_perm = this.permissions[window.global.buttonPremission.rolePerm]
              //console.log('this.permissions',this.permissions)
            },
            getList() {
                this.listLoading = true
                fetchList(Object.assign({
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, this.searchForm)).then(response => {
                    this.list = response.data.records
                    this.page.total = response.data.total
                    this.listLoading = false
                }).catch(() => {
                    this.listLoading = false
                })
            },
            refreshChange() {
                this.getList()
            },
            searchChange() {
                this.page.currentPage = 1
                this.getList()
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize
                this.refreshChange()
            },
            currentChange(current) {
                this.page.currentPage = current
                this.refreshChange()
            },
            handleCreate() {
                this.$refs.crud.rowAdd()
            },
            // 在弹窗打开之前请求权限数据信息
            handleOpenBefore(show) {
                show()
            },
            // 表格选择项发生改变时触发
            handleSelectionChange(selection) {
                this.selection = selection;
            },
            handleUpdate(row, index) {
                this.$refs.crud.rowEdit(row, index)
            },
            cancal() {
                this.dialogPermissionVisible = false;
            },
            handlePermission(row) {
                fetchRoleTree(row.rowId)
                    .then(response => {
                        this.checkedKeys = response.data
                        return fetchMenuTree()
                    })
                    .then(response => {
                        this.treeData = response.data
                        // 解析出所有的太监节点
                        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
                        this.dialogPermissionVisible = true
                        this.roleId = row.rowId
                    })
            },
            /**
             * 解析出所有的太监节点id
             * @param json 待解析的json串
             * @param idArr 原始节点数组
             * @param temp 临时存放节点id的数组
             * @return 太监节点id数组
             */
            resolveAllEunuchNodeId(json, idArr, temp) {
                for (let i = 0; i < json.length; i++) {
                    const item = json[i]
                    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
                    if (item.children && item.children.length !== 0) {
                        this.resolveAllEunuchNodeId(item.children, idArr, temp)
                    } else {
                        temp.push(idArr.filter(id => id === item.id))
                    }
                }
                return temp
            },
            filterNode(value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            getNodeData(data, done) {
                done()
            },
            // 删除
            handleDelete(row, index) {

                this.$confirm('是否确认删除选中的数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.rowId)
                }).then((respone) => {
                    if(respone.code===0){
                        this.getList(this.page)
                        this.$notify.success('删除成功')
                    }else{
                        this.$notify.error('删除失败')
                    }
                })
            },
            create(row, done, loading) {
                addObj(this.form).then(() => {
                    this.getList(this.page)
                    done()
                    this.$notify.success('创建成功')
                }).catch(() => {
                    loading()
                })
            },
            update(row, index, done, loading) {
                putObj(this.form).then(() => {
                    this.getList(this.page)
                    done()
                    this.$notify.success('修改成功')
                }).catch(() => {
                    loading()
                })
            },
            updatePermession(roleId) {
                this.menuIds = ''
                this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
                permissionUpd(roleId, this.menuIds).then(() => {
                    this.dialogPermissionVisible = false
                    this.$store.dispatch('GetMenu', {type: false})
                    this.$notify.success('权限更新成功')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .basic-con {
        .my-form {
            border-bottom: #133460 1px solid;
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
                height: calc(100% );
            }
        }
    }

    .el-dialog__wrapper {
        .t-title {
            font-family: SourceHanSansCN-Regular;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            color: #67c8ff;
            margin: 0;
            margin-bottom: 10px;
        }

        .el-dialog {
            width: 20% !important;
            .dialog-main-tree {
                max-height: 400px;
                overflow-y: auto;
                .el-tree {
                    background: transparent;
                }
            }
        }

        .el-form-item__label {
            width: 20% !important;
            padding-right: 20px;
        }

        .el-form-item__content {
            margin-left: 20% !important;
        }
    }
    /deep/ .avue-crud__menu {
        display: none;
    }
    /deep/ .avue-crud__pagination{
        display: none;
    }

</style>

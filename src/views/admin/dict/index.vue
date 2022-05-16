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
    <div class="execution">
        <titleBox :headName="'字典管理'"/>
        <div class="center">
            <basic-container ref="basic-con" class="basic-con" :class="[isEdit ? 'half' : 'all']">
                <el-form class="my-form" :model="searchForm" :inline="true">
                    <el-form-item label="字典代码:">
                        <el-input v-model="searchForm.listType" placeholder="请输入字典项代码"></el-input>
                    </el-form-item>
                    <el-form-item label="字典名称:">
                        <el-input v-model="searchForm.listTypeDesc" placeholder="请输入字典项名称"></el-input>
                    </el-form-item>
                    <!--  <el-form-item label="字典项名称:">
                          <el-input v-model="searchForm.itemName" placeholder="请输入字典项名称"></el-input>
                      </el-form-item>-->
                    <el-form-item class="btn">
                        <el-button style="width: 90px;" class="shadow-btn" plain round size="medium" v-if="btnPermis.btnView"
                                   @click="searchChange">查询
                        </el-button>
                    </el-form-item>
                </el-form>
                <avue-crud
                        ref="crud"
                        class="my-table"
                        :page="page"
                        :data="tableData"
                        :table-loading="tableLoading"
                        :option="tableOption"

                        @search-change="searchChange"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        @select="handleSelectionChange">
                    <template slot="menuLeft">
                        <el-button
                                v-if="btnPermis.btnAdd"
                                class="shadow-btn"
                                plain
                                round
                                size="medium"
                                @click="handleAdd">新增
                        </el-button>
                        <el-button
                                v-if="btnPermis.btnDelete"
                                class="shadow-btn"
                                plain
                                round
                                size="medium"
                                @click="handleDel">删除
                        </el-button>
                    </template>
                    <template slot="listType" slot-scope="scope">
                        <!-- v-if="editBtn" -->
                        <el-button
                                v-if="btnPermis.btnEdit"
                                type="text"
                                size="medium"
                                class="table-text-btn"
                                @click="handleUpdate(scope.row,scope.index)">
                            {{scope.row.listType}}
                        </el-button>
                         <span v-else>{{scope.row.listType}}</span>
                    </template>
                    <!-- <template
                      slot-scope="scope"
                      slot="menu">
                      <el-button
                        v-if="permissions.sys_dict_add"
                        type="text"
                        size="small"
                        icon="el-icon-menu"
                        @click="handleItem(scope.row,scope.index)">字典项
                      </el-button>
                    </template> -->
                </avue-crud>
            </basic-container>
            <dictTableForm
                    v-if="isEdit"
                    :listdata="listData"
                    :editstatus="editStatus"
                    @close="closeDict"/>
        </div>
        <myPagination
                style="margin-top:32px;"
                :currentPage="page.currentPage"
                :pageSize="page.pageSize"
                :total="page.total"
                @size-change="sizeChange"
                @current-change="currentChange"
        />
        <!-- <el-dialog
                 class="my-dialog"
                 :visible.sync="dialogFormVisible"
                 title="字典项管理"
                 width="90%"
                 @close="dictItemVisible">
             <avue-crud
                     ref="crudItem"
                     class="my-table"
                     :page="itemPage"
                     :data="tableDictItemData"
                     :permission="permissionList"
                     v-model="form"
                     :before-open="handleBeforeOpen"
                     :option="tableDictItemOption"
                     @size-change="itemSizeChange"
                     @current-change="itemCurrentChange"
                     @row-update="handleItemUpdate"
                     @row-save="handleItemSave"
                     @row-del="rowItemDel"/>
         </el-dialog>-->
    </div>
</template>

<script>
    import {
        addItemObj,
        addObj,
        delItemObj,
        deleteDicts,
        fetchItemList,
        updateItemList,
        fetchList,
        putItemObj,
        putObj
    } from '@/api/admin/dict'
    import {tableDictItemOption, tableOption} from '@/const/crud/admin/dict'
    import {mapGetters} from 'vuex'
    import titleBox from '_com/contenBox/titleBox.vue'
    import myPagination from '_com/myPagination/index.vue'
    import dictTableForm from '../components/dictTableForm'

    export default {
        name: 'Dict',
        components: {
            titleBox,
            myPagination,
            dictTableForm
        },
        data() {
            return {
                editStatus: false,
                searchForm: {
                    listType: undefined,
                    listTypeDesc: undefined,
                    itemName: undefined
                },
                form: {
                    type: undefined,
                    dictId: undefined
                },
                dictType: undefined,
                dictId: undefined,
                dialogFormVisible: false,
                tableData: [],
                tableDictItemData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 10 // 每页显示多少条
                },
                itemPage: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 50 // 每页显示多少条
                },
                tableLoading: false,
                tableOption: tableOption,
                tableDictItemOption: tableDictItemOption,
                isEdit: false, // 新增或编辑
                listData: {
                    data: {
                        records: []
                    }
                }, // 当前行数据
                selection: [], // 选择的数据
                btnPermis: {  //按钮权限
                  btnView: false,
                  btnAdd: false,
                  btnEdit: false,
                  btnDelete: false,
                }
            }
        },
        computed: {
            ...mapGetters(['permissions']),
            // 通过函数精确控制编辑新增删除按钮
            /*permissionList() {
                return {
                    // addBtn: this.vaildData(this.permissions.sys_dict_add, false),
                    // delBtn: this.vaildData(this.permissions.sys_dict_del, false),
                    // editBtn: this.vaildData(this.permissions.sys_dict_edit, false)
                    addBtn: this.vaildData(this.permissions.sys_dict_add, true),
                    delBtn: this.vaildData(this.permissions.sys_dict_del, true),
                    editBtn: this.vaildData(this.permissions.sys_dict_edit, true)
                }
            }*/
        },
        created() {
             this.getBtnPermis();
             if(this.btnPermis.btnView) {
                 this.getList()
             }
        },
        methods: {
            getBtnPermis() {
              this.btnPermis.btnView = this.permissions[window.global.buttonPremission.dictView];
              this.btnPermis.btnAdd = this.permissions[window.global.buttonPremission.dictAdd];
              this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.dictEdit];
              this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.dictDelete];
            },
            //======字典表格相关=====
            getList() {
                this.tableLoading = true
                fetchList(Object.assign({
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, this.searchForm)).then(response => {
                    this.tableData = response.data.records
                    this.page.total = response.data.total
                    this.tableLoading = false
                })
            },
            // 表格选择项发生改变时触发
            handleSelectionChange(selection) {
                this.selection = selection;
            },
            handleAdd: function () {
                this.editStatus = false;
                this.isEdit = true;
                this.listData = Object.assign({}, {
                    listType: null,
                    listTypeDesc: null,
                    data: {
                        records: []
                    }
                });
            },
            handleDel: function () {
                if (this.selection.length <= 0) {
                    this.$message.info('请选择需要删除的数据');
                    return;
                }
                //console.log(this.selection)
                var list = '';
                this.selection.forEach((ele, index) => {
                    //console.log("ele", ele)
                    list += ele.listType + ","
                })
                if (list) list = list.substr(0, list.length - 1);
                this.$confirm('是否确认删除[' + list + ']的所有字典项吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return deleteDicts(list);
                }).then((response) => {
                    if (response.code === 0) {
                        this.$message.success('删除成功')
                        this.getList()
                    } else {
                        this.$message.info('删除失败')
                    }

                }).catch(function () {
                })
            },
            handleUpdate: function (row, index, done) {
                this.editStatus = true;
                this.isEdit = true;
                //获取子项
                fetchItemList(Object.assign({
                    current: this.itemPage.currentPage,
                    size: this.itemPage.pageSize
                }, {listType: row.listType})).then(response => {
                    this.listData = Object.assign({}, row, response);
                    //console.log("listData");
                    //console.log(this.listData);
                })
            },
            handleSave: function (row, done) {
                addObj(row).then(() => {
                    this.$message.success('添加成功')
                    this.getList(this.page)
                    done()
                })
            },
            searchChange() {
                this.page.currentPage = 1
                this.getList();
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize
                this.getList();
            },
            currentChange(current) {
                this.page.currentPage = current
                this.getList();
            },
            //======字典项表格相关=====
            dictItemVisible: function () {
                this.dialogFormVisible = false
                this.itemPage.currentPage = 1
            },
            handleItem: function (row) {
                this.dictId = row.id
                this.dictType = row.type
                this.getDictItemList()
            },
            getDictItemList() {
                this.dialogFormVisible = true
                fetchItemList(Object.assign({
                    current: this.itemPage.currentPage,
                    size: this.itemPage.pageSize
                }, {dictId: this.dictId})).then(response => {
                    //this.tableDictItemData = response.data.data.records
                    //this.itemPage.total = response.data.data.total
                })
            },
            handleBeforeOpen(done) {
                this.form.type = this.dictType
                this.form.dictId = this.dictId
                done()
            },
            handleItemSave: function (row, done) {
                addItemObj(row).then(() => {
                    this.$message.success('添加成功')
                    this.getDictItemList()
                    done()
                })
            },
            handleItemUpdate: function (row, index, done) {
                putItemObj(row).then(() => {
                    this.$message.success('修改成功')
                    this.getDictItemList()
                    done()
                })
            },
            itemSizeChange(pageSize) {
                this.itemPage.pageSize = pageSize
                this.getDictItemList()
            },
            itemCurrentChange(current) {
                this.itemPage.currentPage = current
                this.getDictItemList()
            },
            rowItemDel: function (row) {
                this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delItemObj(row.id)
                }).then(() => {
                    this.getDictItemList()
                    this.$message.success('删除成功')
                }).catch(function () {
                })
            },
            // 关闭字典项编辑
            closeDict(val) {
                this.isEdit = val;
            }
        }
    }
</script>

<style lang="less" scoped>
    .center {
        width: 100%;
        height: calc(100% - 141px);
        display: flex;

        .half {
            width: calc(100% - 787px);
        }

        .all {
            width: 100%;
        }
    }

    .basic-con {
        height: 100%;
        flex: 1;

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
                // height: calc(100% - 54px);
            }
            /deep/ .avue-crud__pagination {
              display: none;
            }
        }
    }
</style>


<template>
    <!-- 分组管理 -->
    <div class="app-container department">
        <titleBox :headName="'分组管理'"/>
        <basic-container class="basic-con">
            <groupBox
                    class="self-box"
                    :showCheckBox="false"
                    :isSelf="true"
                    :isAll="true"
                    @getData="handleNodeClick"/>
            <div style="width:calc(100% - 320px)">
                <el-form class="my-form" :model="searchForm" :inline="true">
                    <el-form-item label="分组名称:">
                        <el-input v-model="searchForm.groupName" placeholder="请输入分组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="上级分组名称:">
                        <el-input v-model="searchForm.groupParName" placeholder="请输入上级分组名称"></el-input>
                    </el-form-item>
                    <el-form-item class="btn">
                        <el-button style="width: 90px;" class="shadow-btn" plain size="medium" round
                                   @click="initData">查询
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="my-table">
                    <div class="avue-crud__menu">
                        <div class="avue-crud__left">
                            <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleCreate()">新增
                            </el-button>
                            <!--   <el-button
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
                                    @click="handleDeleteBacth">批量删除
                            </el-button>
                            <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleTransform">迁移
                            </el-button>
                            <el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleImport">导入
                            </el-button>
                            <!--<el-button
                                    class="shadow-btn"
                                    plain
                                    round
                                    size="mini"
                                    @click="handleUpLevel">上一级
                            </el-button>-->
                        </div>
                    </div>
                    <el-table
                            :data="tableData"
                            :table-loading="tableLoading"
                            style="width: 100%"
                            height="80%"
                            @selection-change="handleSelectChange">
                        <el-table-column
                                type="selection"
                                label="全选"
                                width="50"
                                fixed="left">
                        </el-table-column>
                        <!-- <el-table-column
                                 type="index"
                                 label="序号"
                                 width="50"
                                 fixed="left">
                         </el-table-column>-->
                        <el-table-column prop="groupName" label="分组名称" width="250px">
                            <template slot-scope="scope">
                                <el-button type="text" class="table-text-btn" @click="handleTableClick(scope.row)">{{
                                    scope.row.groupName }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-for="item in columns"
                                :key="item.label"
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.width">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="small"
                                        type="text"
                                        icon="el-icon-plus"
                                        @click="handleCreate(scope.row)"
                                >新增子项
                                    <!--v-if="permissions.sys_menu_add"-->
                                </el-button>
                                <el-button size="small"
                                           type="text"
                                           icon="el-icon-edit"
                                           @click="handleUpdate(scope.row)">修改
                                </el-button>
                                <el-button
                                        size="small"
                                        type="text"
                                        icon="el-icon-delete"
                                        @click="handleDelete(scope.row)"
                                >删除
                                    <!--v-if="permissions.sys_menu_del"-->
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <myPagination
                            style="margin-top:32px;"
                            :currentPage="page.currentPage"
                            :pageSize="page.pageSize"
                            :total="page.total"
                            @current-change="currentChange"
                            @size-change="sizeChange"
                    />
                </div>
            </div>
        </basic-container>
        <el-dialog
                class="my-dialog"
                :visible.sync="groupDialogVisible"
                :close-on-click-modal="false"
                title="选择迁移的分组"
                :modal-append-to-body="false"
                top="10%"
                width="400px"
        >
            <div class="app-container department" style="height:400px">
                <groupBox
                        class="self-box"
                        :showCheckBox="false"
                        :isSelf="true"
                        :isAll="true"
                        @getData="handleNodeClick2"
                />
                <!--  <basic-container class="basic-con" style="height: 90%">

                  </basic-container>-->
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button
                        type="primary"
                        size="small"
                        @click="transGroup">确定
                </el-button>
                <el-button
                        type="default"
                        size="small"
                        @click="cancal2()">取消
                </el-button>
            </div>
        </el-dialog>

        <el-dialog
                class="my-dialog"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :title="dialogTitle"
                :modal-append-to-body="false"
                top="13%"
                width="500px">
            <el-form :model="form" label-width="100px" :rules="rules"
                     ref="form">
                <el-form-item label="上级分组id:" hidden prop="groupPid">
                    <el-input v-model="form.groupPid" placeholder="请选择上级分组"></el-input>
                </el-form-item>
                <el-form-item label="分组路径:">
                    <el-input v-model="form.groupNameFullPath" placeholder="" readOnly></el-input>
                </el-form-item>
                <el-form-item label="分组名称:" prop="groupName">
                    <el-input v-model="form.groupName" placeholder="请选择分组名称" @input="groupNameChange"></el-input>
                </el-form-item>
                <el-form-item label="分组类型:" prop="groupAttribute">
                    <el-select style="width:100%;" v-model="form.groupAttribute" placeholder="请选择分组属性">
                        <el-option
                                v-for="item in subtypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="经度:">
                    <el-input v-model="form.longtude" placeholder="请输入经度"></el-input>
                </el-form-item>
                <el-form-item label="纬度:">
                    <el-input v-model="form.latitude" placeholder="请输入纬度"></el-input>
                </el-form-item>
                <el-form-item label="区域编码:">
                    <el-input v-model="form.groupCode" placeholder="请输入区域编码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button
                        type="primary"
                        size="small"
                        @click="save()">确定
                </el-button>
                <el-button
                        type="default"
                        size="small"
                        @click="cancal()">取消
                </el-button>
            </div>
        </el-dialog>


        <importDialog ref="import"/>
    </div>
</template>

<script>
    import titleBox from '_com/contenBox/titleBox.vue'
    import myPagination from '_com/myPagination/index.vue'
    import groupBox from '_com/groupBox2/index.vue'
    import importDialog from '../components/importDialog'
    import {getGroupsByGroupPid, listGroup, addGroup, updateGroup, deleteGroup, transerGroup} from '@/api/admin/group'
    import {fetchItemList} from '@/api/admin/dict'

    export default {
        name: 'department',
        components: {
            titleBox,
            myPagination,
            groupBox,
            importDialog
        },
        data() {
            const validateGroupName = (rule, value, callback) => {

                if (value.indexOf("/") >= 0) {
                    callback(new Error('分组名称不能包含 /'))
                }
                callback()
            }
            return {
                tableLoading: false,
                searchForm: {
                    groupPid: 0
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                columns: [
                    {prop: 'groupNameFullPath', label: '分组全路径', width: '500'},
                    {prop: 'groupCode', label: '行政区编码', width: '150'},
                ],
                tableData: [],
                selection: [], // 选择的数据
                dialogVisible: false,
                groupDialogVisible: false,
                dialogTitle: '新增分组',
                form: {},
                showMaps: false,
                types: [],
                subtypes: [],
                clickdata: {
                    id: 0,
                    name: "全部分组"
                },
                transform: {},
                rules: {
                    groupName: [
                        {required: true, message: '分组名称必须填写', trigger: 'blur'},
                        {required: true, trigger: 'blur', validator: validateGroupName}
                    ],
                    groupPid: [
                        {required: true, message: '分组父级节点必须选择', trigger: 'blur'}
                    ],
                    groupAttribute: [
                        {required: true, message: '请选择分组类型', trigger: 'change'},
                    ]
                },
            }
        },
        created() {
            this.initData();
            this.initTypes();
        },
        methods: {
            // 树节点点击事件
            initTypes() {
                this.types = [];
                let that = this;
                fetchItemList(Object.assign({
                    current: 1,
                    size: 100
                }, {listType: "group_type"})).then(response => {
                    if (response.code === 0) {
                        response.data.records.forEach((ele, index) => {
                            that.types.push({
                                value: ele.itemCode,
                                label: ele.itemName
                            })
                            that.subtypes.push(
                                {
                                    value: ele.itemCode,
                                    label: ele.itemName
                                }
                            )
                        })

                    }

                })
            },
            handleTableClick(val) {
                this.form = Object.assign({}, val);
                this.searchForm.groupPid = val.rowId;
                this.clickdata.id = val.rowId;
                this.clickdata.groupNameFullPath = val.groupNameFullPath
                this.clickdata.groupAttribute = val.groupAttribute
                this.initData();
            },
            handleNodeClick(val) {
                this.clickdata = Object.assign({}, val);
                this.searchForm.groupPid = val.id;
                this.initData();
            },
            handleNodeClick2(val) {
                this.transform = Object.assign({}, val);
            },
            initData() {
                //获取下一级的分组
                this.tableLoading = true
                let res = listGroup(Object.assign({
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, this.searchForm)).then(res => {
                    this.tableData = res.data.records;
                    this.page.total = res.data.total
                    this.tableLoading = false;
                });
            },

            sizeChange(pageSize) {
                this.page.pageSize = pageSize
                this.initData();
            },
            currentChange(current) {
                this.page.currentPage = current
                this.initData();
            },
            groupNameChange() {
                if (this.submitType == 'add') {
                    this.form.groupNameFullPath = this.form.groupNameFullPathOld ? this.form.groupNameFullPathOld + "/" + this.form.groupName : this.form.groupName
                } else if (this.submitType == 'update') {
                    var index = this.form.groupNameFullPath.lastIndexOf("/");
                    if (index > -1) {
                        this.form.groupNameFullPath = this.form.groupNameFullPath.substring(0, index) + "/" + this.form.groupName;
                    } else {
                        this.form.groupNameFullPath = this.form.groupName;
                    }
                }
            },
            // 选择事件
            handleSelectChange(selection) {
                this.selection = selection;
            },
            // 新增
            handleCreate(row) {
                console.log("clickdata", this.clickdata)
                console.log("row", row);
                this.dialogVisible = true;
                this.form = {};
                this.dialogTitle = "新增分组"
                this.submitType = 'add';
                var groupAttribute = 0;
                if (row) {
                    this.form.groupPid = row.rowId;
                    this.form.groupNameFullPathOld = row.groupNameFullPath;
                    groupAttribute = row.groupAttribute;
                } else {
                    this.form.groupPid = this.clickdata.id;
                    this.form.groupNameFullPathOld = this.clickdata.groupNameFullPath;
                    groupAttribute = this.clickdata.groupAttribute;
                }
                this.form.groupNameFullPath = this.form.groupNameFullPathOld;
                /* if (!this.form.groupPid) {
                     this.$message.info('请选择父级分组');
                     return;
                 }*/
                this.subtypes = this.types.filter((value, index) => {
                    return value.value * 1 > groupAttribute * 1;
                })
                this.subtypes.sort();
            },
            // 修改
            handleUpdate(row) {
                /*if (this.selection.length <= 0) {
                    this.$message.info('请选择需要修改的分组');
                    return;
                } else if (this.selection.length > 1) {
                    this.$message.info('只能选择一个分组进行修改！');
                    return;
                }*/
                this.form = Object.assign({}, row);
                this.dialogTitle = "编辑分组"
                this.submitType = 'update';
                this.dialogVisible = true;
            },
            // 删除
            handleDeleteBacth() {
                if (this.selection.length <= 0) {
                    this.$message.info('请选择需要删除的分组');
                    return;
                }
                let that = this
                this.$confirm('是否确认删除选中的数据?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tmpplandatas = []
                    this.selection.forEach((ele, index) => {
                        tmpplandatas.push(new Promise(function (resolve, reject) {
                                // 此处进行异步请求
                                deleteGroup({rowId: ele.rowId}).then(res => {
                                    res.groupName = ele.groupName;
                                    resolve(res)
                                })
                            }
                        ))
                    })
                    Promise.all(tmpplandatas).then(res => {
                        console.log("Promise", res);
                        var isrefresh = false;
                        var suceessGroup = '';
                        var errorGroup = '';
                        res.forEach((ele, index) => {
                            if (ele.code === 0) {
                                suceessGroup += '删除' + ele.groupName + '成功'
                                if (index < res.length - 1) {
                                    suceessGroup += " <br/>"
                                }
                                isrefresh = true;
                            } else {
                                errorGroup += '删除' + ele.groupName + '失败：' + ele.msg
                                if (index < res.length - 1) {
                                    errorGroup += " <br/>"
                                }
                            }
                        })
                        if (suceessGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: suceessGroup,
                                type: 'success',
                            })
                        }
                        if (errorGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: errorGroup,
                                type: 'error',
                            })
                        }
                        if (isrefresh) this.initData();
                    })
                })
            },
            // 删除
            handleDelete(row) {
                if (!row) {
                    this.$message.info('请选择需要删除的分组');
                    return;
                }
                this.$confirm("是否确认删除分组[ " + row.groupName + " ]?", '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGroup({rowId: row.rowId}).then(respone => {
                        this.$notify.success('删除成功')
                        this.initData()
                    })
                })
            },
            handleUpLevel() {
                /* if (this.form.groupPid) {
                     this.searchForm.groupPid = this.form.groupPid;
                     this.initData();
                 }*/
            },
            handleTransform() {
                if (this.selection.length <= 0) {
                    this.$message.info('请至少选择一个需要迁移的分组');
                    return;
                }
                this.groupDialogVisible = true;
            },

            // 导入
            handleImport() {
                this.$refs.import.dialogVisible = true;
            },
            // 经纬度选择回调事件
            parentFn(val) {
                this.form.lon = val[0];
                this.form.lat = val[1];
            }
            ,
            // 保存
            save() {
                this.$refs.form.validate((valid) => {
                    if (!valid) return false;
                    if (this.submitType == 'add') {
                        addGroup(this.form).then(respone => {
                            if (respone.code === 0) {
                                this.$notify.success('新增成功')
                                this.initData();
                                this.dialogVisible = false;
                            } else {
                                this.$notify.success('新增失败：' + respone.msg);
                            }
                        })
                    } else if (this.submitType == 'update') {
                        updateGroup(this.form).then(respone => {
                            if (respone.code === 0) {
                                this.$notify.success('修改成功')
                                this.initData();
                                this.dialogVisible = false;
                            } else {
                                this.$notify.success('修改失败：' + respone.msg);
                            }
                        })
                    }
                })
            },
            transGroup() {
                if (!this.transform.id) {
                    this.$message.info('请选择迁移的目标分组');
                    return;
                }
                let that = this
                var groupName = ''
                this.selection.forEach((ele, index) => {
                    groupName += ele.groupName + ","
                });
                if (groupName.length > 0) {
                    groupName = groupName.substring(0, groupName.length - 1)
                }
                this.$confirm('是否确认将选择的【' + groupName + '】迁移到【' + this.transform.name + "】下面？", '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tmpplandatas = []
                    this.selection.forEach((ele, index) => {
                        tmpplandatas.push(new Promise(function (resolve, reject) {
                                // 此处进行异步请求
                                transerGroup(
                                    {rowId: ele.rowId, groupPid: that.transform.id}).then(res => {
                                    res.groupName = ele.groupName
                                    resolve(res)
                                })
                            }
                        ))
                    })
                    Promise.all(tmpplandatas).then(res => {
                        console.log("Promise", res);
                        var isrefresh = false;
                        var suceessGroup = '';
                        var errorGroup = '';
                        res.forEach((ele, index) => {
                            if (ele.code === 0) {
                                suceessGroup += '迁移' + ele.groupName + '成功'
                                if (index < res.length - 1) {
                                    suceessGroup += " <br/>"
                                }
                                isrefresh = true;
                            } else {
                                errorGroup += '迁移' + ele.groupName + '失败：' + ele.msg
                                if (index < res.length - 1) {
                                    errorGroup += " <br/>"
                                }
                            }
                        })
                        if (suceessGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: suceessGroup,
                                type: 'success',
                            })
                        }
                        if (errorGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: errorGroup,
                                type: 'error',
                            })
                        }
                        if (isrefresh) {
                            this.initData();
                            this.groupDialogVisible = false;
                        }
                    })
                })

            },
            // 取消关闭
            cancal() {
                this.form = {};
                this.dialogVisible = false;
            },
            cancal2() {
                this.groupDialogVisible = false;
            }

        }
    }
</script>

<style lang="less" scoped>
    .department {
        .basic-con {
            /deep/ .el-card__body {
                width: 100%;
                display: flex;
            }

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

                /deep/ .el-table {
                    height: calc(100% - 54px);
                }
            }

            .self-box {
                position: unset;
                background: transparent;
                height: 100%;
                padding-right: 20px;
                margin-right: 20px;
                border-right: 1px solid #133460;

                .group-box {
                    .box-card {
                        background: transparent !important;
                    }
                }

                div {
                    position: unset;
                }
            }
        }
    }

    .self-box {
        position: unset;
        background: transparent;
        height: 100%;
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #133460;

        .group-box {
            height: 100%;

            .box-card {
                background: transparent !important;
            }
        }

        div {
            position: unset;
        }
    }
</style>
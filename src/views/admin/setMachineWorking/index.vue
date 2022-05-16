<template>
    <!-- 机具作业设置 -->
    <div class="app-container machine">
        <titleBox :headName="'农机机具作业配置'"/>
        <basic-container class="basic-con">
            <el-form class="my-form" :model="searchForm" :inline="true">
                <el-form-item label="农机类型:">
                    <el-input v-model="searchForm.machineTypeName" placeholder="请输入农机类型"></el-input>
                </el-form-item>
                <el-form-item label="机具类型:">
                    <el-input v-model="searchForm.toolTypeName" placeholder="请输入机具类型"></el-input>
                </el-form-item>
                <el-form-item label="作业类型:">
                    <el-input v-model="searchForm.jobTypeName" placeholder="请输入作业类型"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button style="width: 90px;" class="shadow-btn" plain size="medium" round @click="searchChange" v-if="jobtype_btn_view">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="my-table">
                <div class="avue-crud__menu">
                    <div class="avue-crud__left">
                        <el-button
                                v-if="jobtype_btn_add"
                                class="shadow-btn"
                                plain
                                round
                                size="mini"
                                @click="handleCreate">新增
                        </el-button>
                        <!-- <el-button
                                v-if="jobtype_btn_view"
                                class="shadow-btn"
                                plain
                                round
                                size="mini"
                                @click="handleExport">导出
                        </el-button> -->
                    </div>
                </div>
                <el-table
                        :data="tableData"
                        height="100%"
                        @selection-change="handleSelectChange">
                    <el-table-column
                            type="selection"
                            label="全选"
                            width="55"
                            fixed="left">
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="序号"
                            width="100"
                            fixed="left"
                            :index="indexMethod">
                    </el-table-column>
                    <el-table-column
                            v-for="item in columns"
                            :key="item.label"
                            :prop="item.prop"
                            :label="item.label"
                            :width="item.width">
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                        <template slot-scope="scope">
                            <!--                            <el-button type="text" @click="handleUpdate(scope.row, scope.$index)"><img
                                                                :src="[scope.row.isEdit ? 'img/admin/icon_update_active.png' : 'img/admin/icon_update.png']"
                                                                alt=""></el-button>
                                                        <el-button type="text" @click="handleDelete(scope.row, scope.$index)"
                                                                   style="margin-left:14px;"><img src="img/admin/icon_delete.png" alt=""></el-button>-->
                            <el-button
                                    v-if="jobtype_btn_edit"
                                    type="text"
                                    size="small"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row,scope.index)">编辑
                            </el-button>
                            <el-button
                                    v-if="jobtype_btn_del"
                                    type="text"
                                    size="small"
                                    icon="el-icon-delete"
                                    @click="handleDelete(scope.row,scope.index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </basic-container>
        <myPagination
                style="margin-top:10px;"
                :currentPage="page.currentPage"
                :pageSize="page.pageSize"
                :total="page.total"
                @current-change="currentChange"
                @size-change="sizeChange"
        />
        <el-dialog
                class="my-dialog"
                :visible.sync="dialogVisible"
                :before-close="Cancel"
                :close-on-click-modal="false"
                :title="dialogTitle"
                :modal-append-to-body="false"
                top="13%"
                width="500px">
            <el-form :model="form" label-width="100px" :rules="rules"
                     ref="form">
                <el-form-item label="农机类型:" prop="machineType">
                    <el-select style="width:100%;" v-model="form.machineType" placeholder="请选择农机类型"
                               @change="machinetypechange">
                        <el-option
                                v-for="item in machineTypes"
                                :key="item.itemCode"
                                :label="item.itemName"
                                :value="item.itemCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机具类型:" prop="toolType">
                    <el-select style="width:100%;" v-model="form.toolType" placeholder="请选择机具类型"
                               @change="tooltypechange">
                        <el-option
                                v-for="item in toolTypes"
                                :key="item.itemCode"
                                :label="item.itemName"
                                :value="item.itemCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作业类型:" prop="jobType">
                    <el-select style="width:100%;" v-model="form.jobType" placeholder="请选择作业类型" @change="jobtypechange">
                        <el-option
                                v-for="item in jobTypes"
                                :key="item.itemCode"
                                :label="item.itemName"
                                :value="item.itemCode">
                        </el-option>
                    </el-select>
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
                        @click="Cancel">取消
                </el-button>
            </div>
        </el-dialog>


        <setMachineDialog ref="machine"/>
    </div>
</template>

<script>
    import titleBox from '_com/contenBox/titleBox.vue'
    import myPagination from '_com/myPagination/index.vue'
    import setMachineDialog from '../components/setMachineDialog'
    import {fetchItemList} from '@/api/admin/dict'
    import {
        addJobtypeObj,
        delJobtypeObj,
        fetchJobtypeList,
        updateJobtypeObj,
    } from '@/api/admin/setting'
    import {mapGetters} from "vuex";


    export default {
        name: 'department',
        components: {
            titleBox,
            myPagination,
            setMachineDialog
        },
        data() {
            return {
                searchForm: {},
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                form: {},
                columns: [
                    {prop: 'machineTypeName', label: '农机类型', width: 300},
                    {prop: 'toolTypeName', label: '机具类型', width: 300},
                    {prop: 'jobTypeName', label: '作业类型',},
                ],
                tableData: [],
                selection: [], // 选择的数据
                listData: {}, // 操作的数据
                jobtype_btn_view: true,
                jobtype_btn_add: true,
                jobtype_btn_export: true,
                jobtype_btn_edit: true,
                jobtype_btn_del: true,
                machineTypes: [],
                toolTypes: [],
                jobTypes: [],
                dialogVisible: false,
                dialogTitle: '新增',
                rules: {
                    machineType: [
                        {required: true, message: "请选择农机类型", trigger: "change"},
                    ],
                    jobType: [
                        {required: true, message: "请选择作业类型", trigger: "change"},
                    ],
                    toolType: [
                        {required: true, message: "请选择机具类型", trigger: "change"},
                    ]
                },
            }
        },
        created() {
            this.getBtnPermis(); // 按钮权限
            this.initData();
            this.initDicTypes1("machine_type");
            this.initDicTypes2("tool_type");
            this.initDicTypes3("job_type");
        },
        computed: {
          ...mapGetters(['permissions'])
        },
        methods: {
            getBtnPermis() {
                this.jobtype_btn_view = this.permissions[window.global.buttonPremission.jobtypeView];
                this.jobtype_btn_add = this.permissions[window.global.buttonPremission.jobtypeAdd];
                this.jobtype_btn_export = this.permissions[window.global.buttonPremission.jobtypeExport];
                this.jobtype_btn_edit = this.permissions[window.global.buttonPremission.jobtypeEdit];
                this.jobtype_btn_del = this.permissions[window.global.buttonPremission.jobtypeDelete];
                //console.log('this.permissions',this.permissions)
            },
            // 树节点点击事件
            async handleNodeClick(val) {
                this.initData();
            }
            ,
            //可以写成全局的
            async initDicTypes(listType) {
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 10000
                }));
                if (res.code === 0) {
                    return res.data.records
                }
            },
            initDicTypes1(listType) {
                let that = this;
                fetchItemList(Object.assign({
                    current: 1,
                    size: 10000
                }, {listType: listType})).then(
                    (res) => {
                        if (res.code === 0) {
                            that.machineTypes = [...res.data.records]
                        }
                    }
                )
            },
            initDicTypes2(listType) {
                let that = this;
                fetchItemList(Object.assign({
                    current: 1,
                    size: 10000
                }, {listType: listType})).then(
                    (res) => {
                        if (res.code === 0) {
                            that.toolTypes = [...res.data.records]
                        }
                    }
                )
            },
            initDicTypes3(listType) {
                let that = this;
                fetchItemList(Object.assign({
                    current: 1,
                    size: 10000
                }, {listType: listType})).then(
                    (res) => {
                        if (res.code === 0) {
                            that.jobTypes = [...res.data.records]
                        }
                    }
                )
            },
            initData() {
                fetchJobtypeList(Object.assign({}, {
                    current: this.page.currentPage,
                    size: this.page.pageSize
                }, this.searchForm)).then((response) => {
                    if (response.code === 0) {
                        this.tableData = response.data.records;
                        this.page.total = response.data.total;
                    }
                })
            }
            ,
            // 查询
            searchChange() {
                this.page.currentPage = 1;
                this.initData();
            }
            ,
            // 选择事件
            handleSelectChange(selection) {
                // debugger;
                this.selection = selection;
            }
            ,
            // 新增
            handleCreate() {
                this.dialogVisible = true
                this.submitType = 'add'
                this.dialogTitle = '新增'
                this.form = {};
            }
            ,
            // 修改
            handleUpdate(row) {
                this.form = Object.assign({}, row);
                this.submitType = 'update'
                this.dialogTitle = '修改配置'
                this.dialogVisible = true
            },

            save() {
                if (this.submitType == 'add') {
                    this.create();
                }
                if (this.submitType == 'update') {
                    this.update();
                }
            },
            // 新增保存
            create() {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        addJobtypeObj(this.form).then((response) => {
                            if (response.code === 0) {
                                that.$notify.success('新增成功')
                                that.dialogVisible = false
                                that.initData();
                            } else {
                                that.$notify.error('新增失败：' + response.msg)
                            }
                        }).catch(() => {
                        })
                    }
                })
            },
            // 编辑更新
            update() {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        updateJobtypeObj(this.form).then((response) => {
                            if (response.code === 0) {
                                that.$notify.success('修改成功')
                                that.dialogVisible = false
                                that.initData();
                            } else {
                                that.$notify.success('修改失败：' + response.msg)
                            }
                        }).catch(() => {
                        })
                    }
                })
            },

            // 删除
            handleDelete(row) {

                this.$confirm('是否确认删除该条数据？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    delJobtypeObj(row.rowId)
                        .then((respones) => {
                            if (respones.code === 0) {
                                this.$notify.success('删除成功')
                                this.initData();
                            } else {
                                this.$notify.error('删除失败')
                            }
                        }).catch(() => {
                        this.$notify.error('删除失败')
                    })
                })
            }
            ,
            // 导出
            handleExport() {

            },
            // 切换页
            currentChange(val) {
                this.page.currentPage = val;
                this.initData();
            }
            ,
            // 切换每页显示
            sizeChange(val) {
                this.page.pageSize = val
                this.initData();
            }
            ,
            indexMethod(index) {
                return (this.page.currentPage - 1) * this.page.pageSize + index + 1
            },
            machinetypechange(val) {
            //   debugger
                if (this.machineTypes) {
                    let sel = this.machineTypes.filter((item, index) => {
                        return item.itemCode == val
                    })
                    if (sel && sel.length > 0) {
                        this.form.machineTypeName = sel[0].itemName;
                    }
                }
            },
            tooltypechange(val) {
                if (this.toolTypes) {
                    let sel = this.toolTypes.filter((item, index) => {
                        return item.itemCode == val
                    })
                    if (sel && sel.length > 0) {
                        this.form.toolTypeName = sel[0].itemName;
                    }
                }
            },
            jobtypechange(val) {
                if (this.jobTypes) {
                    let sel = this.jobTypes.filter((item, index) => {
                        return item.itemCode == val
                    })
                    if (sel && sel.length > 0) {
                        this.form.jobTypeName = sel[0].itemName;
                    }
                }
            },
            resetForm(){
                this.form = {},
                this.$refs.form.resetFields();
            },
            Cancel(){
                this.resetForm();
                this.dialogVisible = false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .machine {
        .basic-con {
            /deep/ .el-card__body {
                width: 100%;
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
                height: calc(100% - 130px);

                /deep/ .el-table {
                    height: calc(100% - 54px);
                }
            }
        }
    }
</style>
<template>
    <!-- 分组管理 -->
    <div class="opreationSeason">
        <titleBox :headName="'审核标准管理'"/>
        <basic-container class="basic-con">
            <el-row :span="24" style="width: 100%; height: 100%">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height: 100%">
                    <groupBox
                            class="self-box"
                            :showCheckBox="false"
                            :isSelf="true"
                            :isAll="true"
                            @getData="handleNodeClick"
                    />
                </el-col>
                <el-col
                        :xs="18"
                        :sm="18"
                        :md="18"
                        :lg="18"
                        :xl="18"
                        class="opreationSeason__main"
                >
                    <el-form
                            ref="form"
                            class="my-form"
                            :model="form"
                            :inline="true"
                            :rules="rules"
                    >
                        <!-- <el-form-item label="分组名称:">
                                         <el-input v-model="model" placeholder="请选择分组"></el-input>
                                     </el-form-item>-->
                        <el-form-item label="作业年度:">
                            <el-select v-model="searchForm.jobYear" placeholder="请选择年份">
                                <el-option label="全部" value="-1"></el-option>
                                <el-option
                                        created
                                        v-for="item in seasonYears"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="作业类型:">
                            <el-select
                                    v-model="searchForm.jobType"
                                    placeholder="请选择作业类型"
                            >
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                        v-for="item in jobTypes"
                                        :key="item.itemCode"
                                        :label="item.itemName"
                                        :value="item.itemCode"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-button
                                class="shadow-btn"
                                type="primary"
                                round
                                @click="search(1)"
                                v-if="manager_btn_view"
                        >查询
                        </el-button
                        >
                    </el-form>
                    <div class="my-table">
                        <div
                                class="avue-crud__menu"
                                v-if="manager_btn_add || manager_btn_del"
                        >
                            <div class="avue-crud__left">
                                <el-button
                                        v-if="manager_btn_add"
                                        class="shadow-btn"
                                        plain
                                        round
                                        size="mini"
                                        @click="handleCreate"
                                >新增
                                </el-button>
                                <el-button
                                        v-if="manager_btn_del"
                                        class="shadow-btn"
                                        plain
                                        round
                                        size="mini"
                                        @click="handleBatchDelete"
                                >批量删除
                                </el-button>
                            </div>
                        </div>
                        <el-table
                                :data="tableData"
                                style="width: 100%"
                                height="calc(100% - 50px)"
                                @selection-change="handleSelectChange"
                        >
                            <el-table-column
                                    type="selection"
                                    label="全选"
                                    width="55"
                                    fixed="left"
                            >
                            </el-table-column>
                            <el-table-column
                                    type="index"
                                    label="序号"
                                    width="80"
                                    fixed="left"
                                    :index="indexMethod"
                            >
                            </el-table-column>
                            <el-table-column
                                    v-for="item in columns"
                                    :key="item.label"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :width="item.width"
                                    :fixed="item.fixed"
                                    :formatter="item.formatter"
                                    :show-overflow-tooltip="item.showTooltip"
                            >
                            </el-table-column>
                            <el-table-column label="操作" width="150px" fixed="right">
                                <template slot-scope="scope">
                                    <el-button
                                            v-if="manager_btn_edit"
                                            type="text"
                                            size="small"
                                            icon="el-icon-edit"
                                            @click="handleUpdata(scope.row, scope.index)"
                                    >编辑
                                    </el-button>
                                    <el-button
                                            v-if="manager_btn_del"
                                            type="text"
                                            size="small"
                                            icon="el-icon-delete"
                                            @click="handleDelete(scope.row, scope.index)"
                                    >删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <myPagination
                                style="margin-top: 10px"
                                :currentPage="page.currentPage"
                                :pageSize="page.pageSize"
                                :total="page.total"
                                @current-change="currentChange"
                                @size-change="sizeChange"
                        />
                    </div>
                </el-col>
            </el-row>
        </basic-container>

        <el-dialog
                class="dialog"
                :title="editTitle"
                :visible.sync="dialogVisible"
                :before-close="resetForm"
                width="40%"
                min-width="400px"
                top="20vh"
        >
            <div class="content">
                <el-form
                        class="my-form"
                        ref="form"
                        label-position="right"
                        label-width="120px"
                        :model="form"
                        :rules="rules"
                >
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="分组名称：">
                                <el-input
                                        v-model="form.groupNameFullPath"
                                        placeholder="请输入分组名称"
                                        readonly
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作业年份：" prop="jobYear">
                                <el-select
                                        v-model="form.jobYear"
                                        v-bind:disabled="isEdit"
                                        placeholder="请选择年份时间"
                                        @change="jobYearChange"
                                >
                                    <el-option
                                            v-for="item in seasonYears"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作业类型：" prop="jobType">
                                <el-select
                                        v-model="form.jobType"
                                        v-bind:disabled="isEdit"
                                        placeholder="请选择作业类型"
                                        @change="jobTypeChange"
                                >
                                    <el-option
                                            v-for="item in jobTypes"
                                            :key="item.itemCode"
                                            :label="item.itemName"
                                            :value="item.itemCode"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="作业季：" prop="seasonId">
                                <el-select
                                        v-model="form.seasonId"
                                        v-if="!isEdit"
                                        placeholder="请选择作业季"
                                        @change="seasonChange"
                                >
                                    <el-option
                                            v-for="item in jobSeasons"
                                            :key="item.rowId"
                                            :label="item.seasonName"
                                            :value="item.rowId"
                                    >
                                    </el-option>
                                </el-select>
                                <el-input
                                        v-if="isEdit"
                                        v-model="form.seasonName"
                                        readonly
                                        placeholder="请选择作业季以查询作业时间"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="作业时间：">
                                <el-input
                                        v-model="form.time"
                                        readonly
                                        placeholder="请选择作业季以查询作业时间"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="自动审核：" prop="auditFlag">
                                <el-select
                                        v-model="form.auditFlag"
                                        placeholder="请选择自动审核"
                                >
                                    <el-option label="是" value="Y" key="Y"></el-option>
                                    <el-option label="否" value="N" key="N"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核类型：" prop="originFlag">
                                <el-select
                                        v-model="form.originFlag"
                                        placeholder="请选择审核类型"
                                >
                                    <el-option
                                            v-for="item in auditTypes"
                                            :key="item.itemCode"
                                            :label="item.itemName"
                                            :value="item.itemCode"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核深度(公分)：" prop="initDeep">
                                <el-input
                                        v-model="form.initDeep"
                                        placeholder="请输入审核深度"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="深度合格率(%)：" prop="initDeepRate">
                                <el-input
                                        v-model="form.initDeepRate"
                                        placeholder="请输入深度合格率"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="截取深度(公分)：" prop="cutDeep">
                                <el-input
                                        v-model="form.cutDeep"
                                        placeholder="请输入截取深度"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                    label="补贴标准(元/亩)："
                                    prop="initSubsidy"
                                    label-width="125px"
                            >
                                <el-input
                                        v-model="form.initSubsidy"
                                        placeholder="请输入补贴标准"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="shadow-btn" @click="save" round
                >保 存
                </el-button
                >
                <el-button type="primary" class="shadow-btn" @click="resetForm" round
                >返 回
                </el-button
                >
            </div>
        </el-dialog>
        <!-- <EditInfoDialog ref="editInfo" :title="editTitle"></EditInfoDialog>-->
    </div>
</template>
<script>
    import groupBox from "_com/groupBox2/index.vue";
    import titleBox from "_com/contenBox/titleBox.vue";
    import myPagination from "_com/myPagination/index.vue";
    import {
        addAuditObj,
        delAuditObj,
        fetchAuditList,
        updateAuditObj,
        fetchJobseasonListByGroup,
    } from "@/api/admin/setting";
    import {fetchItemList} from "@/api/admin/dict";
    import {mapGetters} from "vuex";

    export default {
        name: "task",
        components: {
            titleBox,
            myPagination,
            groupBox,
        },
        data() {
            return {
                searchForm: {},
                isEdit: true,
                listLoading: false,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0,
                },
                columns: [
                    // {prop: 'sesonName', label: '作业季'},
                    {prop: "seasonName", label: "作业季", width: 200, fixed: "left"},
                    {prop: "groupNameFullPath", label: "分组名称", width: 250},
                    {
                        prop: "jobType",
                        label: "作业类型",
                        width: 150,
                        formatter: this.jobTypeFormatter,
                    },
                    {
                        prop: "auditFlag",
                        label: "自动审核",
                        width: 100,
                        formatter: this.auditFlagFormatter,
                    },
                    {prop: "initDeep", label: "审核深度(公分)", width: 150},
                    {prop: "initDeepRate", label: "审核合格率(%) ", width: 150},
                    {prop: "cutDeep", label: "截取深度(公分) ", width: 150},
                    {prop: "initSubsidy", label: "补贴标准(元/亩) ", width: 150},
                    {
                        prop: "originFlag",
                        label: "审核类型",
                        width: 150,
                        formatter: this.auditTypeFormatter,
                    },
                ],
                tableData: [],
                selection: [], // 选择的数据
                dialogVisible: false,
                dialogTitle: "新增分组",
                form: {},
                model: "",
                showMaps: false,
                editTitle: "",
                jobTypes: [],
                auditTypes: [],
                manager_btn_view: true,
                manager_btn_add: true,
                manager_btn_edit: true,
                manager_btn_del: true,
                seasonYears: [],
                season5Years: [],
                clickdata: {},
                submitType: "add",
                jobSeasons: [],
                rules: {
                    jobYear: [
                        {required: true, message: "请选择作业年度", trigger: "change"},
                    ],
                    jobType: [
                        {required: true, message: "请选择作业类型", trigger: "change"},
                    ],
                    seasonId: [
                        {required: true, message: "请选择作业季", trigger: "change"},
                    ],
                    auditFlag: [
                        {required: true, message: "请选择是否自动审核", trigger: "change"},
                    ],
                    initDeep: [
                        {required: true, message: "请输入审核深度", trigger: "blur"},
                        {pattern:/^(?:100|\d{1,2})(?:\.\d{1,2})?$/ ,message:"请输入0-100的数字,小数最多两位",trigger:"blur"}
                    ],
                    initDeepRate: [
                        {required: true, message: "请输入深度合格率", trigger: "blur"},
                        {pattern:/^(?:100|\d{1,2})(?:\.\d{1,2})?$/ ,message:"请输入0-100的数字,小数最多两位",trigger:"blur"}
                    ],
                    cutDeep: [
                        {required: true, message: "请输入截取深度", trigger: "blur"},
                        {pattern:/^(?:100|\d{1,2})?$/ ,message:"请输入0-100的整数",trigger:"blur"}
                    ],
                    initSubsidy: [
                        {required: true, message: "请输入补贴标准", trigger: "blur"},
                        {pattern:/^(?:100|\d{1,2})(?:\.\d{1,2})?$/ ,message:"请输入0-100的数字,小数最多两位",trigger:"blur"}
                    ],
                    originFlag: [
                        {required: true, message: "请选择审核类型", trigger: "change"},
                    ],
                },
            };
        },
        created() {
            this.getBtnPermis(); //按钮权限
            this.searchForm.jobYear = new Date().getFullYear();
            this.searchForm = {...this.searchForm};
            this.init();
        },
        computed: {
            ...mapGetters(["permissions"]),
        },
        methods: {
            resetForm() {
                this.dialogVisible = false;
                this.$refs.form.resetFields();
                this.form = {};
            },
            getBtnPermis() {
                this.manager_btn_view =
                    this.permissions[window.global.buttonPremission.auditStandardView];
                this.manager_btn_add =
                    this.permissions[window.global.buttonPremission.auditStandardAdd];
                this.manager_btn_edit =
                    this.permissions[window.global.buttonPremission.auditStandardEdit];
                this.manager_btn_del =
                    this.permissions[window.global.buttonPremission.auditStandardDelete];
                //console.log("this.permissions", this.permissions);
            },
            init() {
                this.initseasonYears();
                this.initJobTypes("job_type");
                this.initAuditTypes("audit_type");
                this.search();
            },
            initseasonYears() {
                var date = new Date();
                for (var i = 2016; i <= date.getFullYear() * 1; i++) {
                    this.seasonYears.push({label: i, value: i});
                }
            },
            initJobTypes(listType) {
                let that = this;
                fetchItemList(
                    Object.assign(
                        {
                            current: 1,
                            size: 10000,
                        },
                        {listType: listType}
                    )
                ).then((res) => {
                    if (res.code === 0) {
                        that.jobTypes = [...res.data.records];
                    }
                });
            },
            initAuditTypes(listType) {
                let that = this;
                fetchItemList(
                    Object.assign(
                        {
                            current: 1,
                            size: 10000,
                        },
                        {listType: listType}
                    )
                ).then((res) => {
                    if (res.code === 0) {
                        that.auditTypes = [...res.data.records];
                    }
                });
            },
            search(page) {
                if (page > 0) this.page.currentPage = page;
                if (this.clickdata && this.clickdata.id) {
                    this.searchForm.groupId = this.clickdata.id * 1;
                }
                this.listLoading = true;
                fetchAuditList(
                    Object.assign(
                        {
                            current: this.page.currentPage,
                            size: this.page.pageSize,
                        },
                        this.searchForm
                    )
                ).then((res) => {
                    if (res) {
                        this.tableData = res.data.rows;
                        this.page.total = res.data.total;
                        this.listLoading = false;
                    }
                });
            },
            handleNodeClick(val) {
                if (val && val.id) {
                    //获取所有子id
                    this.searchForm.groupId = val.id;
                    this.clickdata = val;
                }
            },
            // 选择事件
            handleSelectChange(selection) {
                this.selection = selection;
            },
            // 新增
            handleCreate() {
                this.isEdit = false;
                if (!this.clickdata || !this.clickdata.id) {
                    this.$message.info("请先选择分组");
                    return;
                }
                this.submitType = "add";
                var date = new Date();
                this.editTitle = "新增审核标准";
                this.dialogVisible = true;
                this.form = {};
                this.form.jobYear = date.getFullYear();
                /*              this.form.beginTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00"
                                          this.form.endTime = date.getFullYear() + "-12-31 23:59:59";*/
                this.form.groupNameFullPath =
                    this.clickdata.groupNameFullPath || "所有分组";
                this.form.groupId = this.clickdata.id;
                //this.form.time = this.form.beginTime + " ~~ " + this.form.endTime;
                this.form = {...this.form};
            },
            handleUpdata(row) {
                this.submitType = "update";
                this.isEdit = true;
                this.editTitle = "编辑审核标准";
                this.form = row;

                // pbw修改
                // this.form.time = this.form.startTime + " ~~ " + this.form.endTime;
                this.form.time = this.form.startTime + " ~ " + this.form.endTime;

                this.dialogVisible = true;
            },
            // 批量删除
            handleDelete(row) {
                this.$confirm(
                    "是否确认删除 " +
                    row.groupNameFullPath +
                    ":" +
                    row.seasonName +
                    " 的审核标准？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    delAuditObj(row.rowId)
                        .then((respones) => {
                            if (respones.code === 0) {
                                this.$notify.success("删除成功");
                                this.search();
                            } else {
                                this.$notify.error("删除失败");
                            }
                        })
                        .catch(() => {
                            this.$notify.error("删除失败");
                        });
                });
            },
            // 批量删除
            handleBatchDelete() {
                if (this.selection.length <= 0) {
                    this.$message.info("请选择需要删除的数据");
                    return;
                }
                let that = this;
                this.$confirm("是否确认删除选中的数据?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let tmpplandatas = [];
                    that.selection.forEach((ele, index) => {
                        tmpplandatas.push(
                            new Promise(function (resolve, reject) {
                                // 此处进行异步请求
                                delAuditObj(ele.rowId).then((res) => {
                                    res.groupNameFullPath = ele.groupNameFullPath;
                                    res.seasonName = ele.seasonName;
                                    resolve(res);
                                });
                            })
                        );
                    });
                    Promise.all(tmpplandatas).then((res) => {
                        //console.log("Promise", res);
                        var isrefresh = false;
                        var suceessGroup = "";
                        var errorGroup = "";
                        res.forEach((ele, index) => {
                            if (ele.code === 0) {
                                suceessGroup +=
                                    "删除" + ele.groupNameFullPath + ":" + ele.seasonName + " 成功";
                                if (index < res.length - 1) {
                                    suceessGroup += " <br/>";
                                }
                                isrefresh = true;
                            } else {
                                errorGroup +=
                                    "删除" +
                                    ele.groupNameFullPath +
                                    ":" +
                                    ele.seasonName +
                                    "失败：" +
                                    ele.msg;
                                if (index < res.length - 1) {
                                    errorGroup += " <br/>";
                                }
                            }
                        });
                        if (suceessGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: suceessGroup,
                                type: "success",
                            });
                        }
                        if (errorGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: errorGroup,
                                type: "error",
                            });
                        }
                        if (isrefresh) this.search();
                    });
                });
            },

            // 保存
            save() {
                if (this.submitType == "add") {
                    this.create();
                }
                if (this.submitType == "update") {
                    this.update();
                }
            },
            // 新增保存用户
            create() {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        addAuditObj(this.form)
                            .then((response) => {
                                if (response.code === 0) {
                                    that.$notify.success("新增成功");
                                    that.dialogVisible = false;
                                    this.$refs.form.resetFields();
                                    that.search();
                                } else {
                                    that.$notify.error("新增失败：" + response.msg);
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            },
            // 编辑更新
            update() {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        updateAuditObj(this.form)
                            .then((response) => {
                                if (response.code === 0) {
                                    that.$notify.success("修改成功");
                                    that.dialogVisible = false;
                                    this.$refs.form.resetFields();
                                    that.search();
                                } else {
                                    that.$notify.error("修改失败：" + response.msg);
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            },
            // 取消关闭
            cancal() {
                this.form = {};
                this.dialogVisible = false;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.search(this.page, this.searchForm);
                //return false;
            },
            currentChange(current) {
                this.page.currentPage = current;
                this.search(this.page, this.searchForm);
            },
            indexMethod(index) {
                return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
            },
            jobTypeFormatter(val) {
                let jobtypename = val.jobType;
                if (this.jobTypes) {
                    this.jobTypes.forEach((ele, index) => {
                        if (ele.itemCode == val.jobType) {
                            jobtypename = ele.itemName;
                            return;
                        }
                    });
                }
                return jobtypename;
            },
            auditFlagFormatter(val) {
                let auditFlag = val.auditFlag;
                if (auditFlag == "Y") {
                    return "是";
                } else if (auditFlag == "N") {
                    return "否";
                }
                return auditFlag;
            },
            auditTypeFormatter(val) {
                let value = val.originFlag;
                if (value == 1) return "平均深度";
                else if (value == 2) return "深度合格率";
                else if (value == 3) return "深度&合格率";
                else return value;
            },
            jobAreaFormatter(val) {
                return val.jobArea;
            },
            jobTypeChange(val) {
                let obj = this.jobTypes.find(function (item) {
                    return item.itemCode === val;
                });
                this.form.jobTypeName = obj.itemName;

                //获取作业季
                fetchJobseasonListByGroup(
                    Object.assign({
                        groupId: this.form.groupId,
                        jobYear: this.form.jobYear,
                        jobType: this.form.jobType,
                    })
                ).then((res) => {
                    if (res.code === 0) {
                        this.jobSeasons = [];
                        this.jobSeasons.push(...res.data);
                        if (this.jobSeasons.length > 0) {
                            this.form.seasonId = this.jobSeasons[0].rowId;

                            // pbw修改
                            // this.form.time = this.jobSeasons[0].startTime + " ~~ " + this.jobSeasons[0].endTime
                            this.form.time =
                                this.jobSeasons[0].startTime + " ~ " + this.jobSeasons[0].endTime;
                        } else {
                            this.form.seasonId = "";
                            this.form.time = "";
                        }
                        this.form = {...this.form};
                    }
                });
            },
            seasonChange(val) {
                if (this.jobSeasons && this.jobSeasons.length > 0) {
                    let obj = this.jobSeasons.find(function (item) {
                        return item.rowId === val;
                    });
                    if (obj) {
                        // pbw修改
                        // this.form.time = obj.startTime + " ~~ " + obj.endTime
                        this.form.time = obj.startTime + " ~ " + obj.endTime;
                    } else {
                        this.form.time = "";
                    }
                }
            },
            jobYearChange(val) {
                //   this.form.beginTime = val + "-01-01 00:00:00";
                //   this.form.endTime = val + "-12-31 23:59:59";

                if (this.form.jobType) {
                    //获取作业季
                    fetchJobseasonListByGroup(
                        Object.assign({
                            groupId: this.form.groupId,
                            jobYear: val,
                            jobType: this.form.jobType,
                        })
                    ).then((res) => {
                        if (res.code === 0) {
                            this.jobSeasons = [];
                            this.jobSeasons.push(...res.data);
                            if (this.jobSeasons.length > 0) {
                                this.form.seasonId = this.jobSeasons[0].rowId;
                                this.form.jobName =
                                    this.form.jobYear + this.form.jobTypeName + "任务";
                                this.form.time =
                                    this.jobSeasons[0].startTime +
                                    " ~ " +
                                    this.jobSeasons[0].endTime;
                            } else {
                                this.form.seasonId = "";
                                this.form.jobName = "";
                            }
                            this.form = {...this.form};
                        }
                    });
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .opreationSeason {
        &__tree {
            padding-top: 3px;
            padding-right: 20px;
        }

        &__main {
            height: 100%;

            .el-card__body {
                padding-top: 0;
            }

            .my-form {
                border-bottom: #133460 1px solid;
            }

            .my-table {
            }
        }

        .basic-con {
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

            .my-form {
                border-bottom: #133460 1px solid;

                .el-form-item {
                    margin-bottom: 18px;
                    margin-right: 20px;
                }

                /deep/ .el-form-item__label {
                    line-height: 36px;
                }

                .shadow-btn {
                    height: 36px !important;
                }
            }

            .my-table {
                margin-top: 10px;
                height: calc(100% - 120px);
                // overflow: auto !important;

                /deep/ .el-form {
                    height: 440px;
                    width: 100%;
                }

                /deep/ .el-table {
                    // height: auto;
                }
            }
        }

        .content {
            margin-top: 20px;
            margin-left: 10px;

            .el-form-item {
                margin-right: 40px;
            }

            /deep/ .el-form-item__label {
                padding: 0;
            }

            .el-input,
            .el-select {
                width: 100%;
            }

            .datepicker {
                width: 40%;
            }
        }

        .dialog-footer {
            height: 30px;
            padding-right: 25px;
        }
    }
</style>
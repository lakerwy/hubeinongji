<template>
    <!-- 列表模式 -->
    <div class="list-view">
        <div class="list-view-statics">
            <div class="statics-box">
                <!-- <div
                  v-for="(item,index) in staTypes"
                  :key="item.value">
                  <p
                    class="sta"
                    :style="[{'color': item.color},{'textShadow': '0 0 36px ' + item.color}]">
                    <span class="num">{{item.value}}</span> {{item.unit}}</p>
                  <p class="type">{{item.type}}</p> -->
                <!-- </div> -->
                <div

                        v-for="(item, index) in staTypes"
                        :key="index"
                        class="box"
                        :style="{ color: item.color }"
                        v-if="item.show"
                >
                    <div class="point">{{ "●" }}</div>
                    <div class="type" :style="{ color: '#FFFFFF' }">{{ item.type }}</div>
                    <div class="value">{{ item.value }}</div>
                    <div class="unit">{{ item.unit }}</div>
                </div
                >
            </div>
        </div>
        <div class="list-view-table">
            <div class="btns">
                <div class="btn-left">
                    <el-button
                            round
                            type="primary"
                            class="shadow-btn"
                            plain
                            @click="audit(1)"
                            v-if="btnPermis.jobCheck"
                    >审核通过
                    </el-button
                    >
                    <el-button
                            round
                            type="primary"
                            class="shadow-btn"
                            plain
                            @click="audit(0)"
                            v-if="btnPermis.jobCheck"
                    >审核不通过
                    </el-button
                    >
                    <el-button
                            round
                            type="primary"
                            class="shadow-btn"
                            plain
                            @click="add"
                            v-if="btnPermis.jobAdd"
                    >作业补报
                    </el-button
                    >
                    <el-button
                            round
                            type="primary"
                            class="shadow-btn"
                            plain
                            :disabled="flag"
                            @click="report(0)"
                            v-if="btnPermis.jobAppearadd"
                    >{{ flag ? `面积重算(${current})` : "面积重算" }}
                    </el-button>
                    <!--  <el-button
                        round
                        type="primary"
                        class="shadow-btn"
                        plain
                        :disabled="flag2"
                        @click="report(1)"
                        v-if="btnPermis.jobAppeardepthadd"
                        >{{ flag2 ? `深度上报(${current2})` : "深度上报" }}
                      </el-button>-->
                </div>
                <div class="btn-right">
                    <div
                            class="tableTool"
                            @click="updateBantch"
                            v-if="btnPermis.jobUpdateAlot"
                    >
                        <img src="img/table_tool5.png" alt=""/>
                        <span>批量修改</span>
                    </div>
                    <div class="vertical" v-if="btnPermis.jobUpdateAlot"></div>
                    <div
                            class="tableTool"
                            @click="handleExport"
                            v-if="btnPermis.jobExport"
                    >
                        <img src="img/table_tool2.png" alt=""/>
                        <span>报表导出</span>
                    </div>
                    <div class="vertical" v-if="btnPermis.jobExport"></div>
                    <div
                            class="tableTool"
                            @click="handleDelete"
                            v-if="btnPermis.jobDelete"
                    >
                        <img src="img/table_tool4.png" alt=""/>
                        <span>删除作业</span>
                    </div>
                    <!-- <div class="vertical"></div>
                    <el-dropdown @command="handleCommand">
                      <div class="tableTool">
                        <img src="img/table_tool1.png" alt="">
                        <span>更多操作 <i class="el-icon-arrow-down el-icon--right"></i></span>
                      </div>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="a">激活</el-dropdown-item>
                          <el-dropdown-item command="b">失效</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown> -->
                </div>
            </div>
            <div class="my-table">
                <el-table
                        v-loading="loading"
                        :data="tableData"
                        style="width: 100%"
                        border
                        height="100%"
                        @selection-change="handleSelectChange"
                >
                    <el-table-column
                            type="selection"
                            label="全选"
                            width="55"
                            fixed="left"
                    >
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="80" fixed="left" :index="indexMethod">
                    </el-table-column>
                    <el-table-column v-if="btnPermis.jobCheck || btnPermis.jobEdit" label="操作" width="150" fixed="left">
                        <template slot-scope="scope">
                            <el-button
                                    v-if="btnPermis.jobCheck"
                                    type="text"
                                    size="small"
                                    icon="el-icon-partly-cloudy"
                                    @click="handleAudit(scope.$index, scope.row)">审核
                            </el-button>
                            <el-button
                                    v-if="btnPermis.jobEdit"
                                    type="text"
                                    size="small"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.$index, scope.row)">修改
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-for="item in columns"
                            :key="item.prop"
                            :prop="item.prop"
                            :label="item.label"
                            :width="item.width"
                            :formatter="item.formatter"
                            :show-overflow-tooltip="item.showTooltip"
                    >
                        <template slot-scope="scope">
                            <template v-if="item.slot">
                <span v-if="item.prop === 'auditFlag'">
                  <img
                          style="vertical-align: middle; margin-right: 9px"
                          :src="
                      (scope.row[item.prop] == 1||scope.row[item.prop] == 3)
                        ? 'img/working/success-point.png'
                        : scope.row[item.prop] == 2
                        ? 'img/working/falid-point2.png'
                        : 'img/working/default-point.png'
                    "
                          alt=""
                  />
                  {{
                    scope.row[item.prop] == 1
                      ? "通过"
                      : scope.row[item.prop] == 2
                      ? "不通过"
                      : scope.row[item.prop] == 3
                      ? "通过(补报方式)"
                      : "未审核"
                  }}
                </span>
                            </template>
                            <template v-else>
                <span>{{
                  item.formatter
                    ? item.formatter(scope.row)
                    : scope.row[item.prop]
                }}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page">
                <pagination
                        style="margin-top: 13px; margin-left: 29px"
                        :currentPage.sync="page.currentPage"
                        :pageSize="page.pageSize"
                        :total="page.total"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                />
            </div>
        </div>

        <addDialog ref="addDialog"/>
        <reportDialog :type="reportType" ref="report"/>
        <updateDialog ref="update" @refreshData="initData"/>
        <auditDialog ref="audit" :ids="selectedIds" @refreshData="auditData"/>

        <!--<myFooter style="width:calc(100% - 45px)" />-->
    </div>
</template>

<script>
    import pagination from "_com/myPagination/index";
    import myFooter from "_com/footer/index";
    import addDialog from "../dialog/addDialog";
    import reportDialog from "../dialog/reportDialog";
    import updateDialog from "../dialog/updateDialog";
    import auditDialog from "../dialog/auditDialog";
    import {mapGetters} from "vuex";
    import {
        updateAuditFlagStatus,
        queryByCondition,
        getSummaryData,
        deleteJobArea,
    } from "@/api/working/index";
    import {getDictByListType} from "@/api/basic/index";
    import {filterDict} from "@/util/util.js";

    export default {
        name: "listView",
        components: {
            pagination,
            myFooter,
            addDialog,
            reportDialog,
            updateDialog,
            auditDialog,
        },
        props: {
            query: {
                type: Object,
                default: () => {
                },
            },
            queryData: {
                type: Object,
                default: () => {
                },
            },
            summaryData: {
                type: Object,
                default: () => {
                },
            },
            pageP: {
                type: Object,
                default: () => {
                },
            },
            listData: {
                type: Array,
                default: () => [],
            }
        },
        watch: {
            query: {
                handler: function (newV) {
                    if (newV) {
                        this.page.currentPage = 1;
                        //this.initSummary();
                        //this.initData();
                    }
                },
                // immediate: true,
                deep: true,
            },
            listData: {
                handler: function (newV) {
                    this.tableData = newV
                },
                // immediate: true,
                deep: true,
            },
            summaryData: {
                handler: function (newV) {
                    if (newV) {
                        this.staTypes[1].value = newV.done;
                        this.staTypes[2].value = newV.qualifiedRate;
                        this.staTypes[3].value = newV.approved;
                        this.staTypes[4].value = newV.notApproved;
                        if (newV.task > 0) {
                            this.staTypes[0].value = newV.task;
                            this.staTypes[0].show = true
                        } else {
                            this.staTypes[0].show = false
                        }
                    }
                },
                // immediate: true,
                deep: true,
            },
            pageP: {
                handler: function (newV) {
                    //console.log("pageP", newV)
                    if (newV) {
                        this.page = newV
                    }
                },
                // immediate: true,
                deep: true,
            },
        },
        data() {
            return {
                staTypes: [
                    {
                        type: "任务面积",
                        unit: "亩",
                        value: "0",
                        color: "#009cff",
                        class: "box5",
                        show: false
                    },
                    {
                        type: "作业面积",
                        unit: "亩",
                        value: "0",
                        color: "#00deff",
                        class: "box1",
                        show: true
                    },
                    {
                        type: "作业合格率",
                        unit: "%",
                        value: "0",
                        color: "#3cfad3",
                        class: "box2",
                        show: true
                    },
                    {
                        type: "审核通过面积",
                        unit: "亩",
                        value: "0",
                        color: "#b7afff",
                        class: "box3",
                        show: true
                    },
                    {
                        type: "审核未通过面积",
                        unit: "亩",
                        value: "0",
                        color: "#f4b350",
                        class: "box4",
                        show: true
                    },

                    /*{
                      type: "深度合格标准",
                      unit: "cm",
                      value: "5",
                      color: "#009cff",
                      class: "box5",
                    },*/
                ],
                currentIndex: 0,
                page: {
                    currentPage: 1,
                    // pageSize: 12,
                    // pageSizes: [12, 20, 30, 40, 50, 100],
                    total: 0,
                    // pbw修改，页面显示条数
                    pageSize: 10,
                },
                columns: [
                    {prop: "jobStartTime", label: "开始时间", width: "160px"},
                    {prop: "jobEndTime", label: "结束时间", width: "160px"},
                    {prop: "computeArea", label: "作业面积（亩）", width: "120px"},
                    {prop: "avgDepth", label: "平均深度"},
                    {prop: "depthRate", label: "深度合格率", width: "120px", formatter: this.percentFormat},
                    {
                        prop: "groupNameFullPath",
                        label: "农机分组",
                        width: "300px",
                        showTooltip: true,
                    },
                    {prop: "ownerName", label: "机手姓名"},
                    {prop: "ownerPhone", label: "联系电话", width: "120px"},
                    {prop: "plateNumber", label: "农机车牌", width: "120px"},
                    {prop: "terminalCode", label: "终端编号", width: "130px"},
                    {prop: "jobType", label: "作业类型", width: "120px", formatter: this.jobTypeFilter},
                    /*{ prop: "toolType", label: "机具类型", formatter: this.toolTypeFilter },*/
                    {prop: "auditFlag", label: "审核状态", slot: true, width: "100px"},
                    {
                        prop: "checkedWay",
                        label: "审核方式",
                        formatter: this.checkedWayFilter,
                        width: "120px",
                    },
                    {prop: "auditReason", label: "审核原因", width: "200", formatter: this.reasonTypeFilter},
                    {
                        prop: "address",
                        label: "作业地址",
                        width: "300px",
                        showTooltip: true,
                        formatter: this.addressWayFilter,
                    },
                ],
                tableData: [],
                selectedData: [], // 选择的数据
                selectedIds: "", // 选择的数据的ids
                reportType: 0, // 上报类型 0-作业上报 1-深度上报
                loading: false,
                carTypes: [], //  作业类型
                auditReasons: [], //  不通过标志
                toolTypes: [],
                checkWays: [],
                flag: false,
                flag2: false,
                max: 30,
                current: 30,
                decreseInterval: null,
                current2: 30,
                decreseInterval2: null,
                btnPermis: {
                    //按钮权限
                    jobCheck: false,
                    jobAdd: false,
                    jobAppearadd: false,
                    jobAppeardepthadd: false,
                    jobUpdateAlot: false,
                    jobExport: false,
                    jobDelete: false,
                    jobEdit: false,
                },
            };
        },
        computed: {
            ...mapGetters(["groupData", "permissions"]),
        },
        created() {
            this.getBtnPermis();
            this.initJobTypes();
            this.initToolTypes();
            this.initAuditReasons();
            this.initCheckWayTypes();
        },
        methods: {
            getBtnPermis() {
                this.btnPermis.jobCheck =
                    this.permissions[window.global.buttonPremission.jobCheck];
                this.btnPermis.jobAdd =
                    this.permissions[window.global.buttonPremission.jobAdd];
                this.btnPermis.jobEdit =
                    this.permissions[window.global.buttonPremission.jobEdit];
                this.btnPermis.jobAppearadd =
                    this.permissions[window.global.buttonPremission.jobAppearadd];
                this.btnPermis.jobAppeardepthadd =
                    this.permissions[window.global.buttonPremission.jobAppeardepthadd];
                this.btnPermis.jobUpdateAlot =
                    this.permissions[window.global.buttonPremission.jobUpdateAlot];
                this.btnPermis.jobExport =
                    this.permissions[window.global.buttonPremission.jobExport];
                this.btnPermis.jobDelete =
                    this.permissions[window.global.buttonPremission.jobDelete];
                //console.log("this.btnPermis", this.btnPermis);
            },
            // 获取查询结果
            async initData() {
                this.$emit("refreshData");
                /*this.tableData = [];
                this.loading = true;
                let params = Object.assign(this.query, {
                    pageNum: this.page.currentPage,
                    pageSize: this.page.pageSize,
                });
                let res = await queryByCondition(params);
                const {code, data} = res;
                if (code == 0) {
                    this.loading = false;
                    this.tableData = data.list;
                    this.page.total = data.total;
                } else {
                    this.loading = false;
                }*/
            },

            //审核不通过
            async auditData(auditResult) {
                if (this.selectedData && this.selectedData.length) {
                    for (let i = 0; i < this.selectedData.length; i++) {
                        this.selectedData[i].auditFlag = auditResult.auditFlag
                        this.selectedData[i].auditReason = auditResult.auditReason
                        this.selectedData[i].checkedWay = 1;
                    }
                }
            },

            // 获取统计数据
            async initSummary() {
                let params = Object.assign(this.query, {
                    pageNum: this.page.currentPage,
                    pageSize: this.page.pageSize,
                });
                let res = await getSummaryData(params);
                const {code, data} = res;
                if (code == 0) {
                    this.staTypes[0].value = data.done;
                    this.staTypes[1].value = data.qualifiedRate;
                    this.staTypes[2].value = data.approved;
                    this.staTypes[3].value = data.notApproved;
                    if (data.task >= 0) {
                        this.staTypes[4].value = data.task;
                        this.$set(this.staTypes[4], "show", true)

                    }
                }
            },
            // 请求作业字典数据
            async initJobTypes() {
                let params = {
                    listType: "job_type",
                };
                let res = await getDictByListType(params);
                //console.log(res);
                let {code, data} = res;
                //console.log(code);
                if (code == 0) {
                    this.carTypes = data;
                }
            },
            async initToolTypes() {
                let params = {
                    listType: "tool_type",
                };
                let res = await getDictByListType(params);
                let {code, data} = res;
                if (code == 0) {
                    this.toolTypes = data;
                }
            },
            async initCheckWayTypes() {
                let params = {
                    listType: "check_way",
                };
                let res = await getDictByListType(params);
                let {code, data} = res;
                if (code == 0) {
                    this.checkWays = data;
                }
            },
            async initAuditReasons() {
                let params = {
                    listType: "audit_reason",
                };
                let res = await getDictByListType(params);
                let {code, data} = res;
                if (code == 0) {
                    this.auditReasons = data;
                }
            },
            percentFormat(row) {
                return (row.depthRate * 100).toFixed(2) + '%'
            },
            // 作业类型字典回显
            jobTypeFilter(row) {
                return filterDict(
                    row.jobType,
                    {labelKey: "itemName", valueKey: "itemCode"},
                    this.carTypes
                );
            },
            reasonTypeFilter(row) {
                if (row.auditReason) {
                    let reasons = row.auditReason.split(",");
                    let reasonVal = ""
                    for (var i = 0; i < reasons.length; i++) {
                        if (reasons[i]) {
                            reasonVal += filterDict(reasons[i], {
                                labelKey: "itemName",
                                valueKey: "itemCode"
                            }, this.auditReasons) + " "
                        }
                    }
                    return reasonVal
                }
            },
            addressWayFilter(row) {
                return row.address
                //(row.province ? row.province : '') + (row.city ? row.city : '') + (row.country ? row.country : '') + (row.town ? row.town : '') + (row.address ? row.address : '')
            },
            toolTypeFilter(row) {
                return filterDict(
                    row.toolType,
                    {labelKey: "itemName", valueKey: "itemCode"},
                    this.toolTypes
                );
            },
            checkedWayFilter(row) {
                if (row.auditFlag === "0") return "";
                return filterDict(
                    row.checkedWay,
                    {labelKey: "itemName", valueKey: "itemCode"},
                    this.checkWays
                );
            },
            handleCurrentChange(val) {
                this.$emit("currentChange", val)
                /*this.page.currentPage = val;
                this.initData();*/
            },
            handleSizeChange(val) {
                this.$emit("sizeChange", val)
                /* this.page.pageSize = val;
                 this.initData();*/
            },
            // 表格选择改变触发事件
            handleSelectChange(selection) {
                this.selectedData = selection;
                this.selectedIds = this.selectedData
                    .map((item) => {
                        return item.rowId; // 行id
                    })
                    .join(",");
            },
            // 判断当前是否有选择数据
            checkData() {
                if (this.selectedData.length > 0) {
                    return true;
                } else {
                    this.$message({
                        type: "info",
                        message: "请勾选数据",
                    });
                }
                return false;
            },
            // 补报
            add() {
                // this.$refs.addDialog.dialogVisible = true;
                let ids = this.groupData.ids || [];
                if (ids.length == 1) {
                    // 6为农机
                    this.$refs.addDialog.dialogVisible = true;
                } else {
                    this.$message.info("请选择具体车辆！");
                }
            },
            // 删除
            handleDelete() {
                if (this.checkData()) {
                    this.$confirm("确认要删除选中的数据吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(async () => {
                            let params = {
                                rowIdsArry: this.selectedIds,
                            };
                            let res = await deleteJobArea(params);
                            const {code, msg} = res;
                            if (code == 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.$emit("refreshData");
                            } else {
                                this.$message.error(msg || "删除失败");
                            }
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除",
                            });
                        });
                }
            },
            // 作业上报
            report(type) {
                this.reportType = type;
                let ids = this.groupData.ids || [];
                let names = (this.groupData.name && this.groupData.name.split(",")) || [];
                // 根据情况选择赋值
                if (ids.length == 1) {
                    this.$refs.report.form = {
                        apperType: "农机上报",
                    };
                    this.$refs.report.dialogVisible = true;
                } else if (names.length == 1) {
                    this.$refs.report.form = {
                        apperType: "分组上报",
                        name: this.groupData.name,
                    };
                    this.$refs.report.dialogVisible = true;
                } else {
                    this.$message.info("请选择单个分组或具体农机执行上报！");
                }
                if (this.$refs.report.dialogVisible) {
                    if (type == "0") {
                        this.decreseTime("current", "flag", "decreseInterval");
                    } else {
                        this.decreseTime("current2", "flag2", "decreseInterval2");
                    }
                }
            },
            decreseTime(current, flag, interval) {
                this[current] = this.max;
                this[interval] = setInterval(() => {
                    if (this[current] <= this.max && this[current] > 0) {
                        this[current]--;
                        //this[flag] = true;
                    } else if (this.current <= 0) {
                        this[current] = 0;
                        this[flag] = false;
                        clearInterval(this[interval]);
                    }
                }, 1000);
            },
            // 导出
            handleExport() {
                this.$emit("export")
            },
            // 批量修改
            updateBantch() {
                let ids = this.groupData.ids || []; // 农机id
                let data = this.groupData.data || [];
                //console.log(data, "data");
                let attribute = [5, 6, 9]; // groupAttribute合作社 个人终端 农机
                let result = data.every((item) => {
                    return attribute.includes(item.groupAttribute);
                });
                // 根据情况选择赋值
                if (result) {
                    this.$refs.update.dialogVisible = true;
                } else {
                    this.$message.info("只能选择合作社或者个人终端分组或者农机！");
                }
            },
            handleCommand() {
            },
            // 审核通过审核不通过
            audit(type) {
                if (this.checkData()) {
                    this.$confirm("确认要更改这些作业信息审核状态吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(async () => {
                            if (type === 1) {
                                // 审核通过
                                let params = {
                                    auditFlag: 1,
                                    ids: this.selectedIds,
                                };
                                let res = await updateAuditFlagStatus(params);
                                const {code, msg} = res;
                                if (code == 0) {
                                    this.$message.success("审核成功");
                                    //this.initData();
                                    if (this.selectedData && this.selectedData.length) {
                                        for (let i = 0; i < this.selectedData.length; i++) {
                                            this.selectedData[i].auditFlag = 1;
                                            this.selectedData[i].checkedWay = 1;
                                        }
                                    }

                                } else {
                                    this.$message.error(msg);
                                }
                            } else if (type === 0) {
                                // 不通过
                                this.$refs.audit.dialogVisible = true;
                            }
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消",
                            });
                        });
                }
            },
            // 作业审核
            handleAudit(index, row) {
                this.$emit("showMap", {index: index, row: row});
            },
            handleUpdate(index, row) {
                this.$emit("update", row);
            },
            //处理序号问题
            indexMethod(index) {
                return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
            },
        },
    };
</script>

<style lang="less" scoped>
    .list-view {
        padding: 0 0 0 20px;
        height: calc(100% - 20px);
        position: relative;

        .title {
            color: #2d7de9;
            position: absolute;
            left: 0;
            top: -13px;
            font-size: 16px;

            img {
                vertical-align: sub;
                margin-right: 5px;
            }
        }

        &-statics {
            // position: relative;
            // height: 126px;
            border: 1px solid #123b72;
            border-bottom: none;
            // background-image: url('../../../../assets/images/rect1.png');
            // background-size: 100% 100%;
            background-position: 0 0;
            background-repeat: no-repeat;

            .statics-box {
                width: 80%;
                display: flex;
                align-items: center;
                line-height: 70px;
                justify-content: space-around;

                .box {
                    display: flex;
                    flex-direction: row;
                    align-items: baseline;

                    .point {
                        font-size: 20px;
                        margin-right: 5px;
                    }

                    .type {
                        color: #fff;
                        font-size: 16px;
                        margin-right: 16px;
                    }

                    .value {
                        font-size: 30px;
                        font-style: italic;
                        margin-right: 5px;
                    }

                    .unit {
                        font-size: 16px;
                    }
                }

                .active {
                    background-color: #04122c;
                    box-shadow: inset 0px 0px 50px 0px rgba(0, 134, 255, 0.7);
                }
            }
        }

        &-table {
            height: calc(100% - 90px);
            border: 1px solid #123b72;
            background-size: 100% 100%;
            background-position: 0 0;
            background-repeat: no-repeat;
            position: relative;

            .btns {
                padding: 19px 27px 18px 29px;
                display: flex;
                justify-content: space-between;

                .el-button {
                    // min-width: 70px;
                    padding: 0 20px;
                    height: 32px;
                    // border: solid 1px #194260 !important;
                    // color: #80c5ff !important;
                }

                .btn-right {
                    display: flex;
                    align-items: center;
                    color: @base-fontColor;

                    .tableTool {
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        cursor: pointer;
                        color: @base-fontColor;
                    }

                    img {
                        margin-right: 5px;
                        vertical-align: bottom;
                    }
                }

                .vertical {
                    height: 16px;
                    width: 1px;
                    border-right: 1px solid #294166;
                    margin-left: 14px;
                    margin-right: 14px;
                    vertical-align: middle;
                }
            }

            .my-table {
                padding: 0 27px 10px 29px;
                height: calc(100% - 133px);
            }

            .page {
                border-top: solid 1px #123b72;
            }
        }
    }
</style>
<template>
    <!-- 重复作业查询 -->
    <div>
        <div class="repeat-working" v-if="!showAudit" v-loading="isloading">
            <div style="padding: 15px 28px 0 27px">
                <titleBox :headName="'重复作业管理'"/>
            </div>
            <div class="query-con">
                <el-form class="my-form" label-position="right" label-width="80px" :model="form" :inline="true">
                    <el-form-item label="查询范围：">
                        <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
                    </el-form-item>
                    <el-form-item label="作业类型：">
                        <el-select v-model="form.jobType" placeholder="请选择审核状态">
                            <el-option value="" label="全部"></el-option>
                            <el-option
                                    v-for="item in jobTypes"
                                    :key="item.itemCode"
                                    :label="item.itemName"
                                    :value="item.itemCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态：">
                        <el-select v-model="form.auditFlag" placeholder="请选择审核状态">
                            <el-option
                                    v-for="item in status"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="重复程度：">
                        <el-select v-model="form.differenceAnalyze" placeholder="请选择重复程度" style="width: 220px">
                            <el-option
                                    v-for="item in repeatLevel"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="作业时间：">
                        <el-date-picker
                                class="datepicker"
                                style="margin-right:8px;"
                                v-model="form.jobStartTime"
                                type="datetime"
                                :clearable="false"
                                prefix-icon="el-icon-date"
                                placeholder="选择开始时间"
                                :picker-options="startTime"
                                @focus="showPanel"
                        ></el-date-picker>
                        <el-date-picker
                                class="datepicker"
                                v-model="form.jobEndTime"
                                type="datetime"
                                :clearable="false"
                                prefix-icon="el-icon-date"
                                placeholder="选择结束时间"
                                :picker-options="endTime"
                                @focus="showPanel"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="关键字：">
                        <el-input v-model="form.keyword" placeholder="搜索终端号/机手姓名/机号..."></el-input>
                        <!-- /车主手机号/农机车牌 -->
                    </el-form-item>
                    <el-form-item label="重复面积：">
                        <el-input
                                v-model="form.fromJobIntersectionArea"
                                style="margin-right: 8px"
                                placeholder="最小面积（亩）"
                        ></el-input>
                        <span style="diaplay:inline-block;width:80px;"> — </span>
                        <el-input v-model="form.toJobIntersectionArea" placeholder="最大面积（亩）"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <div class="btns" style="margin-left: 6px">
                            <el-button
                                    v-if="btnPermis.btnRepeat"
                                    type="primary"
                                    class="shadow-btn"
                                    @click="getRepeatArea"
                                    round>查询
                            </el-button>
                            <el-button
                                    v-if="btnPermis.btnRepeatProcess"
                                    type="primary"
                                    class="shadow-btn"
                                    @click="gotoAutoAudit"
                                    round
                            >自动审核
                            </el-button>
                            <el-button round type="primary" class="shadow-btn" plain @click="exportExcel">导出</el-button>
                            <el-button
                                    round
                                    type="primary"
                                    class="shadow-btn"
                                    plain
                                    @click="goBack()">返回
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="list-view">
                <div class="list-view-statics" v-loading="loadingStatictis">
                    <div class="statics-box">
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
                <div class="list-view-table" v-loading="loadingPage">
                    <div class="my-table">
                        <el-table
                                :data="tableData"
                                style="width: 100%"
                                height="100%"
                                border
                                fit
                                @selection-change="handleSelectChange"
                        >
                            <el-table-column
                                    type="selection"
                                    label="全选"
                                    width="55"
                                    fixed="left"
                            >
                            </el-table-column>
                            <el-table-column type="index" label="序号" width="60" fixed="left">
                            </el-table-column>
                            <el-table-column label="操作" width="80" fixed="left">
                                <template slot-scope="scope">
                                    <el-button class="table-btn" @click="handleAudit(scope.row)"
                                    >审核
                                    </el-button
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-for="item in columns"
                                    :key="item.label"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :width="item.width"
                                    :align="item.align"
                            >
                                <template v-if="item.children && item.children.length > 0">
                                    <el-table-column
                                            v-for="item2 in item.children"
                                            :key="item2.label"
                                            :prop="item2.prop"
                                            :label="item2.label"
                                            :width="item2.width"
                                            :formatter="item2.formatter"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="item2.prop === 'originalAuditFlag' || item2.prop === 'repeatAuditFlag' ">
                  <img
                          style="vertical-align: middle; margin-right: 9px"
                          :src="
                      scope.row[item2.prop] == '1'
                        ? 'img/working/success-point.png'
                        : scope.row[item2.prop] == '2'
                        ? 'img/working/falid-point2.png'
                        : 'img/working/default-point.png'
                    "
                          alt=""
                  />
                  {{
                    scope.row[item2.prop] == '1'
                      ? "通过"
                      : scope.row[item2.prop] == '2'
                      ? "不通过"
                      : scope.row[item2.prop] == '3'
                      ? "补报"
                      : "未审核"
                  }}
                </span>
                                            <span v-else>{{  item2.formatter
                    ? item2.formatter(scope.row)
                    : scope.row[item2.prop] }}</span>
                                        </template>
                                        >

                                    </el-table-column>
                                </template>
                                <template slot-scope="scope">
              <span v-if="item.prop === 'differenceAnalyze'">
                <img
                        style="vertical-align: middle; margin-right: 9px"
                        :src="
                    scope.row[item.prop] == '重度重复'
                      ? 'img/working/serious-point.png'
                      : scope.row[item.prop] == '严重重复'? 'img/working/normal-point.png':scope.row[item.prop] == '中度重复'?'img/working/larger-point.png':'img/working/little-point.png'
                  "
                        alt=""
                />
                {{ scope.row[item.prop] }}({{ scope.row.percentOfPass }}%)
              </span>
                                    <span v-else>{{ scope.row[item.prop] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="page">
                        <pagination
                                :currentPage="page.currentPage"
                                :total="page.total"
                                :pageSize="page.pageSize"
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                        />
                    </div>
                </div>
                <!--<myFooter style="width:calc(100% - 45px)" />-->
            </div>
            <myFooter/>
        </div>
        <div class="repeat-working" v-if="showAudit">
            <AuditRepeatWorking :repeatData="selectRow" @close="closeAudit"></AuditRepeatWorking>
        </div>
    </div>
</template>

<script>
    import pagination from "_com/myPagination/index";
    import myFooter from "_com/footer/index";
    import titleBox from "_com/contenBox/titleBox.vue";
    import {mapGetters, mapMutations} from "vuex";
    import {
        getRepeatAreaInfo,
        countAreaCalInfo,
        autoUpdateAuditFlag,
        excelAreaCalInfo
    } from "../../../api/working/repeat";
    import {fetchItemList} from '@/api/admin/dict'
    import AuditRepeatWorking from "../audit-repeat-working/index";
    import {filterDict, dateFormat} from "@/util/util.js";

    export default {
        components: {
            pagination,
            myFooter,
            titleBox,
            AuditRepeatWorking
        },
        data() {
            return {
                staTypes: [
                    {
                        type: "作业面积",
                        unit: "亩",
                        value: "0",
                        color: "#00deff",
                        class: "box1",
                        show: true
                    },
                    {
                        type: "重复作业面积",
                        unit: "亩",
                        value: "0",
                        color: "#fa6409",
                        class: "box2",
                        show: true
                    },
                    {
                        type: "重复率",
                        unit: "",
                        value: "0",
                        color: "#b7afff",
                        class: "box3",
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
                loadingStatictis: false,
                loadingPage: false,
                isloading: false,
                form: {
                    auditFlag: 1,
                    jobStartTime: new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000),
                    jobEndTime: new Date((new Date()).setHours(0, 0, 0, 0) - 1000),
                    jobType: '',
                    //keyword:'鄂0163007'
                    keyword: '',
                    differenceAnalyze: "0.5,1"
                },
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0,
                },
                columns: [
                    {prop: "differenceAnalyze", label: "重复程度", width: "200px"},
                    {prop: "intersectArea", label: "重复面积(亩)", width: "160px"},
                    {
                        prop: "",
                        label: "作业信息1",
                        align: "center",
                        children: [
                            {
                                prop: "originalOwnerName",
                                label: "机手信息",
                                width: "200px",
                                formatter: this.OwnerFormatter1,
                            },
                            {
                                prop: "originalPlateNumber",
                                label: "农机信息",
                                width: "200px",
                                formatter: this.machineFormatter1
                            },
                            {
                                prop: "originalJobStartTime",
                                label: "作业时间",
                                width: "300px",
                                formatter: this.jobTimeFormatter1,
                            },
                            {prop: "originalAuditFlag", label: "审核状态", width: "120px"},

                            {
                                prop: "originalJobType",
                                label: "作业类型",
                                width: "120px",
                                formatter: this.jobTypeFilter,
                            },

                            {prop: "originalComputeArea", label: "作业面积(亩)", width: "120px"},
                            /* {prop: "originalAddress", label: "作业地址", width: "300px"},*/
                            {prop: "originalGroupNameFullPath", label: "农机分组", width: "400px"},
                        ],
                    },
                    {
                        prop: "deep",
                        label: "作业信息2",
                        align: "center",
                        children: [
                            {prop: "repeatOwnerName", label: "机手信息", width: "200px", formatter: this.OwnerFormatter2},
                            /* {prop: "repeatOwnerPhone", label: "联系电话", width: "160px"},*/
                            {
                                prop: "repeatPlateNumber",
                                label: "农机信息",
                                width: "200px",
                                formatter: this.machineFormatter2
                            },
                            /* {prop: "repeatTerminalCode", label: "终端号码", width: "160px"},*/
                            {
                                prop: "repeatJobStartTime",
                                label: "作业时间",
                                width: "300px",
                                formatter: this.jobTimeFormatter2,
                            },
                            {prop: "repeatAuditFlag", label: "审核状态", width: "120px"},
                            /*{prop: "repeatJobEndTime", label: "作业结束时间", width: "160px"},*/
                            {
                                prop: "repeatJobType",
                                label: "作业类型",
                                width: "120px",
                                formatter: this.jobTypeFilter,
                            },
                            {prop: "repeatComputeArea", label: "作业面积(亩)", width: "120px"},
                            {prop: "repeatGroupNameFullPath", label: "农机分组", width: "400px"},
                            /*{prop: "repeatAddress", label: "作业地址", width: "300px"},*/
                        ],
                    },
                ],
                tableData: [],
                selection: [],
                jobTypes: [],
                selectRow: {},
                showAudit: false,
                status: [
                    {label: '全部', value: ''},
                    {label: '未审核', value: 0},
                    {label: '审核通过', value: 1},
                    {label: '审核不通过', value: 2},
                ],
                btnPermis: {  //按钮权限
                    btnRepeat: false,
                    btnRepeatProcess: false,
                },
                repeatLevel: [
                    {label: '全部', value: ''},
                    {label: '一般重复（20%以下）', value: "0,0.2"},
                    {label: '中度重复（20%-40%）', value: "0.2,0.4"},
                    {label: '严重重复（40%-70%）', value: "0.4,0.7"},
                    {label: '中度重复及以上（20%以上）', value: "0.2,1"},
                    {label: '严重重复及以上（40%以上）', value: "0.4,1"},
                    {label: '严重重复及以上（50%以上）', value: "0.5,1"},
                    {label: '重度重复（70%以上）', value: "0.7,1"},
                ],
                startTime: {
                    disabledDate: time => {
                        let endDateVal = this.form.jobEndTime;
                        if (endDateVal) {
                            //小于结束时间
                            return time > new Date(endDateVal);
                        }
                    },
                    cellClassName: () => {
                    }
                },
                endTime: {
                    disabledDate: time => {
                        let startDateVal = this.form.jobStartTime;
                        if (startDateVal) {
                            return time < new Date(startDateVal);
                        }
                    },
                    cellClassName: () => {
                    }
                },
            };
        },
        computed: {
            ...mapGetters(['groupData', 'permissions', 'globalSetting'])
        },
        created() {
            this.getBtnPermis()
            this.init()
        },
        methods: {
            ...mapMutations({
                setGroupBoxStatus: 'setGroupBoxStatus',
                setGroupCheckBox: 'setGroupCheckBox',
                setGroupBoxType: 'setGroupBoxType',
            }),
            getBtnPermis() {
                this.btnPermis.btnRepeat = this.permissions[window.global.buttonPremission.workRepeat];
                this.btnPermis.btnRepeatProcess = this.permissions[window.global.buttonPremission.jobAutoAudit];
                // this.btnPermis.btnAuditMap = this.permissions[window.global.buttonPremission.jobAuditMap];
                //console.log('this.btnPermis', this.btnPermis)
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getRepeatPage();
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getRepeatPage();
            },
            closeAudit() {
                this.showAudit = false;
            },
            // 打开农机分组框
            open() {
                this.setGroupCheckBox(true);
                this.setGroupBoxStatus(true);
                this.setGroupBoxType(2);
            },
            jobTypeFilter(row) {
                return filterDict(
                    row.originalJobType,
                    {labelKey: "itemName", valueKey: "itemCode"},
                    this.jobTypes
                );
            },

            OwnerFormatter1(row) {
                return row.originalOwnerName + (row.originalOwnerPhone ? "(" + row.originalOwnerPhone + ")" : "")
            },
            OwnerFormatter2(row) {

                return row.repeatOwnerName + (row.repeatOwnerPhone ? "(" + row.repeatOwnerPhone + ")" : "")
            },
            machineFormatter1(row) {

                return row.originalPlateNumber + (row.originalTerminalCode ? "(" + row.originalTerminalCode + ")" : "")
            },
            machineFormatter2(row) {

                return row.repeatPlateNumber + (row.repeatTerminalCode ? "(" + row.repeatTerminalCode + ")" : "")
            },
            jobTimeFormatter1(row) {
                return row.originalJobStartTime + " ~ " + row.originalJobEndTime.substring(row.originalJobEndTime.indexOf(' ') + 1)
            },
            jobTimeFormatter2(row) {
                return row.repeatJobStartTime + " ~ " + row.repeatJobEndTime.substring(row.repeatJobEndTime.indexOf(' ') + 1)
            },
            getQueryParams() {
                let params = {
                    jobStartTime: dateFormat(this.form.jobStartTime, 'yyyy-MM-dd hh:mm:ss'),
                    jobEndTime: dateFormat(this.form.jobEndTime, 'yyyy-MM-dd hh:mm:ss'),
                    auditFlag: this.form.auditFlag,
                    keyword: this.form.keyword,
                    differenceAnalyze: this.form.differenceAnalyze,
                    jobType: this.form.jobType,
                    fromJobIntersectionArea: this.form.fromJobIntersectionArea,
                    toJobIntersectionArea: this.form.toJobIntersectionArea
                }
                if (this.groupData.ids.length === 1) {
                    params.machineId = this.groupData.ids[0]
                } else {
                    params.machineIdS = this.groupData.ids.join(',')
                }

                // groupIds所有的分组id集合 gAttrs所有的groupAttribute集合 groupId最外层的分组 path最外层分组的path集合
                let groupIds = [], gAttrs = [], groupId = [], path = [];
                this.groupData.data && this.groupData.data.map(item => {
                    // 第一次循环获取所有分组id集合，获取分组groupAttribute集合
                    if (item.groupAttribute !== 6) {
                        // 所有的分组id集合
                        groupIds.push(item.id);
                    }
                    if (!gAttrs.includes(item.groupAttribute)) {
                        // 保存groupAttribute
                        gAttrs.push(item.groupAttribute);
                    }
                })

                this.groupData.data && this.groupData.data.map(item => {
                    // 第二次循环筛选最外层分组id
                    if (item.groupAttribute !== 6) {
                        // debugger
                        // 当前选择的排除农机的数据中，如果该项的pid在id集合中则表示不是最外层，否则时最外层就添加进去
                        if (!groupIds.includes(item.pId)) {
                            groupId.push(item.id);
                            path.push(item.path);
                        }
                    } else {
                        // 当前选择只有农机时添加pId为最外层分组groupId，这里条件是避免重复在groupId添加push（注意：并不是groupIds）
                        if (!groupIds.includes(item.pId) && !groupId.includes(item.pId)) {
                            groupId.push(item.pId);
                            path.push(item.path);
                        }
                    }
                })
                params.groupId = groupId.join(',');
                params.groupFullPath = this.longestCommonPrefix(path);
                params.groupIds = groupIds.join(',');
                params.belongGroupId = groupId[groupId.length - 1];
                params.groupAttribute = gAttrs.join(',');


                return params;
            },
            async getRepeatPage() {
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                let params = this.getQueryParams()
                this.loadingPage = true
                let res = await getRepeatAreaInfo(
                    Object.assign(
                        {
                            pageNum: this.page.currentPage,
                            pageSize: this.page.pageSize,
                        },
                        params
                    )
                );
                this.loadingPage = false
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                }
            },
            //查询
            async getRepeatArea() {
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                let params = this.getQueryParams()
                this.loadingStatictis = true;
                countAreaCalInfo(Object.assign(
                    {},
                    params
                )).then(
                    (res) => {
                        //console.log("countAreaCalInfo", res)
                        if (res.code === 0) {
                            this.staTypes[0].value = res.data.allComputeArea
                            this.staTypes[1].value = res.data.allInterectArea
                            this.staTypes[2].value = res.data.percent
                        }
                        this.loadingStatictis = false;
                    }
                )
                this.loadingPage = true
                let res = await getRepeatAreaInfo(
                    Object.assign(
                        {
                            pageNum: this.page.currentPage,
                            pageSize: this.page.pageSize,
                        },
                        params
                    )
                );
                this.loadingPage = false
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                }
            },


            // 选择事件
            handleSelectChange(selection) {
                this.selection = selection;
            },
            handleAudit(val) {
                this.selectRow = Object.assign(
                    {
                        groupName: this.groupData.name,
                    },
                    val
                );
                this.showAudit = true;


                /*this.$router.push({
                    path: "/audit-repeat-working",
                    query: {row: JSON.stringify(val)},
                });*/
            },

            // pbw修改，添加按钮事件
            goBack() {
                //console.log(this.$router);
                this.$router.go(-1);
            },
            // 日期组件获取焦点事件
            showPanel() {
                return
                // 打开调用一次
                //console.log('show', new Date())
                this.handleQueryMonth();
                this.$nextTick(() => {
                    // 前一月点击事件
                    let prevBtn = document.querySelector('.el-date-picker__header .el-icon-arrow-left');
                    prevBtn.addEventListener('click', this.handleQueryMonth)

                    // 前一年点击事件
                    let prevYearBtn = document.querySelector('.el-date-picker__header .el-icon-d-arrow-left');
                    prevYearBtn.addEventListener('click', this.handleQueryMonth)

                    // 后一月点击事件
                    let nextBtn = document.querySelector('.el-date-picker__header .el-icon-arrow-right');
                    nextBtn.addEventListener('click', this.handleQueryMonth)

                    // 后一年点击事件
                    let nextYearBtn = document.querySelector('.el-date-picker__header .el-icon-d-arrow-right');
                    nextYearBtn.addEventListener('click', this.handleQueryMonth)

                    // 月份点击事件
                    let monthBtn = document.querySelector('.el-picker-panel__content .el-month-table');
                    monthBtn.addEventListener('click', this.handleQueryMonth)

                    // 年份点击事件
                    let yearBtn = document.querySelector('.el-picker-panel__content .el-year-table');
                    yearBtn.addEventListener('click', this.handleQueryMonth)
                })
            },
            async init() {
                //初始化作业类型
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 1000
                }, {listType: "job_type"}))
                if (res.code === 0) this.jobTypes = res.data.records;
                this.initSettings()
            },
            initSettings() {
                //console.log("this.globalSetting", this.globalSetting)
                this.form.jobType = !this.globalSetting.jobType ? "" : this.globalSetting.jobType
                this.form.jobStartTime = !this.globalSetting.bTime ? new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 * 30) : this.globalSetting.bTime
                this.form.jobEndTime = !this.globalSetting.eTime ? new Date((new Date()).setHours(0, 0, 0, 0) - 1000) : this.globalSetting.eTime
            },
            // 相同字符串筛选
            longestCommonPrefix(strs) {
                let tempStr = strs[0];
                while (strs.some(item => item.indexOf(tempStr) !== 0)) {
                    tempStr = tempStr.substring(0, tempStr.length - 1);
                }
                return tempStr;
            },
            //自动审核
            gotoAutoAudit() {
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                let that = this
                let percent = this.form.differenceAnalyze.split(",")[0] * 100;

                this.$confirm(
                    "是否将重复程度【大于" + percent + "%】的作业信息进行自动审核处理？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(async () => {
                    that.isloading = true
                    let params = that.getQueryParams()
                    params.pencent = percent

                    let res = await autoUpdateAuditFlag(params);

                    that.isloading = false;

                    that.$confirm("处理成功");

                });

            },
            async exportExcel() {
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                let params = this.getQueryParams();
                if (params) {
                    params.title = this.groupData.name + "重复作业报表" + dateFormat(new Date()) + ".xls"
                }
                this.isloading = true;
                let res = await excelAreaCalInfo(params);
                this.isloading = false;
            },


        },
    };
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    .repeat-working {
        height: 100%;
        position: relative;

        .query-con {
            padding: 20px 0 0px 28px;
            display: flex;
            justify-content: space-between;

            .el-input {
                width: 168 / @vw;
                // min-width: 160px;
            }

            .el-select {
                width: 168 / @vw;
                // min-width: 160px;
            }

            .el-form-item {
                margin-bottom: 20px;
            }

            .btns {
                // padding-right: 42 / @vw;
                //padding-right: 288 / @vw;
                .el-button {
                    margin-left: 20px;
                    width: 90px;
                    height: 36px;

                }
            }

            .view {
                vertical-align: middle;
                margin-left: 40px;
                cursor: pointer;
            }

            /deep/ .el-form-item__label {
                text-align: right;
                padding: 0;
            }
        }

        .list-view {
            padding: 0 0 0 20px;
            height: calc(100% - 320px);
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
                height: calc(100%);
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
                    padding: 0 0px 0px 0px;
                    height: calc(100% - 80px);
                }

                .page {
                    padding: 20px;
                    border-top: solid 1px #123b72;
                }
            }
        }
    }
</style>
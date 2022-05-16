<template>
    <!-- 作业监控 -->
    <div class="working-monitoring">
        <div class="title">
            <TitleBox class="titlebox" headName="作业监控"></TitleBox>
        </div>
        <div class="query-con">
            <el-form class="my-form" label-position="right" label-width="80px" :model="form" :inline="true">
                <el-form-item label="查询范围:">
                    <el-input v-model="groupData.name" :disabled="backbtnShow" placeholder="请选择分组名称"
                              @focus="open"></el-input>
                </el-form-item>
                <el-form-item label="作业类型:">
                    <el-select v-model="form.jobType" placeholder="请选择作业类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option
                                v-for="item in form.jobTypes"
                                :key="item.itemCode"
                                :label="item.itemName"
                                :value="item.itemCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态:">
                    <el-select v-model="form.auditFlag" placeholder="请选择审核状态">
                        <el-option
                                v-for="item in status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作业时间:">
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
                            @change="startChange"
                    ></el-date-picker>
                    <!-- <span style="diaplay:inline-block;width:12px;"> — </span> -->
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
                <el-form-item label="关键字:">
                    <el-input v-model="form.keyword" placeholder="搜索终端号/机手姓名/机号..."></el-input>
                    <!-- /车主手机号/农机车牌 -->
                </el-form-item>
                <el-button type="primary" style="margin-left:6px;" class="primary-btn shadow-btn" round @click="query"
                           v-if="btnPermis.btnView">查询
                </el-button>
                <el-button type="primary" class="primary-btn shadow-btn" round @click="showMore"
                           v-if="btnPermis.btnRepeat">重复作业
                </el-button>

                <!-- pbw修改 -->
                <el-button type="primary" class="primary-btn shadow-btn" round @click="goback"
                           v-if="backbtnShow">返回
                </el-button>
            </el-form>

            <div class="btns" v-if="btnPermis.btnView">
                <div :class="{'active':!isMap,'view1':true}" @click="ChangeView1()"><img
                        :src="isMap ? view1 : view1Active" alt=""></div>
                <div :class="{'active':isMap,'view2':true}" @click="ChangeView2()"><img
                        :src="isMap ?   view2Active:view2" alt=""></div>
            </div>
        </div>
        <div class="view-con" v-loading="loading">
            <mapView
                    v-show="isMap"
                    ref="map"
                    :summaryData="summaryData"
                    :listData="listData"
                    :current="currentData"
                    :pageP="page"
                    @currentChange="pageCurrentChange"
                    @sizeChange="pageSizeChange"
                    @update="updataArea"
                    @audit="auditArea"
                    @refreshData="searchData"
            />
            <listView
                    v-show="!isMap"
                    ref="list"
                    :pageP="page"
                    :summaryData="summaryData"
                    :listData="listData"
                    @update="updataArea"
                    @audit="auditArea"
                    @showMap="handleAuditByMap"
                    @refreshData="searchData"
                    @currentChange="pageCurrentChange"
                    @sizeChange="pageSizeChange"
                    @export="export2Excel"
            />
        </div>
        <auditDialog
                ref="audit"
                :ids="detailData.rowId"
                :type="'2'"
                @refreshData="searchData"/>

        <updateAreaDialog
                ref="areaDialog"
                :data="detailData"
                @refreshData="searchData"/>
    </div>
</template>

<script>
    import mapView from '../components/mapView/index'
    import listView from '../components/listView/index'
    import {mapGetters, mapMutations} from 'vuex'
    import TitleBox from "../../../components/contenBox/titleBox"
    import auditDialog from '../components/dialog/auditDialog'
    import updateAreaDialog from '../components/dialog/updateAreaDialog'
    import {getWorkingDateByMonth, queryByCondition, getSummaryData, excelAreaInfo} from '@/api/working/index'
    import {dateFormat} from "@/util/util";
    import store from '@/store'
    import {fetchItemList} from '@/api/admin/dict'
    import {isArray} from "../../../util/util";


    export default {
        components: {
            mapView,
            listView,
            TitleBox,
            auditDialog,
            updateAreaDialog
        },
        data() {
            return {
                menu: store.getters.menu,
                loading: false,
                form: {
                    auditFlag: 1,
                    jobStartTime: new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000),
                    jobEndTime: new Date((new Date()).setHours(0, 0, 0, 0) - 1000),
                    jobType: '',
                    //keyword:'鄂0163007'
                    keyword: ''
                },
                status: [
                    {label: '全部', value: -1},
                    {label: '未审核', value: 0},
                    {label: '审核通过', value: 1},
                    {label: '审核不通过', value: 2},
                ],
                view1: require("@/assets/images/view1.png"),
                view1Active: require("@/assets/images/view1-active.png"),
                view2: require("@/assets/images/view2.png"),
                view2Active: require("@/assets/images/view2-active.png"),
                isMap: false, // true 地图模式 false 列表模式
                totalData: {}, // 查询到的数据
                summaryData: {},
                listData: [],
                detailData: {},
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
                queryParams: {},
                currentData: {}, //当前保存的行数据和行序号
                queryMonth: '', // 作为月份查询使用，处理panelCurrentData获取
                btnPermis: {  //按钮权限
                    btnView: false,
                    btnRepeat: false,
                    btnAuditMap: false,
                },
                page: {
                    currentPage: 1,
                    // pageSize: 12,
                    // pageSizes: [12, 20, 30, 40, 50, 100],
                    total: 0,
                    // 页面显示条数
                    pageSize: 10,
                },


                // pbw修改
                backbtnShow: false,
                afterquery:false,
            }
        },
        computed: {
            ...mapGetters(['groupData', 'permissions', 'globalSetting'])
        },
        watch: {
            queryMonth: function (newV) {
                //console.log('watch', this.queryMonth)
                if (this.groupData.ids && this.groupData.ids.length == 1) {
                    // 只有选择单个农机菜加载时间标记
                    this.getDateMarker();
                }
            },
            globalSetting: {
                handler: function (val, oldVal) {
                    this.initSettings(val)
                },
                deep: true
            },
            $route: {
                handler: function (val, oldVal) {
                    //console.log("watch $route:",val,oldVal);
                    this.getquery(val);
                },
                // 深度观察监听
                deep: true
            },
            form:{
                handler: function (val, oldVal) {
                    // console.log("form",val,oldVal);
                    this.afterquery = false;
                },
                deep:true
            }
        },
        created() {
            this.getBtnPermis();
            this.init();
        },
        mounted() {
            this.getquery(this.$route);
        },
        destroyed() {
            //console.log("working-monitoring is destroyed");
        },
        methods: {
            ...mapMutations({
                setGroupBoxStatus: 'setGroupBoxStatus',
                setGroupCheckBox: 'setGroupCheckBox',
                setGroupBoxType: 'setGroupBoxType',
            }),
            getquery(route) {
                if (route.query.data) {
                    // //console.log("working-monitoring query:",this.$route.query);
                    //console.log("working-monitoring query:",JSON.parse(decodeURIComponent(this.$route.query.data)));
                    this.groupData.data = [];
                    this.groupData.ids = [];
                    let qudata = JSON.parse(decodeURIComponent(this.$route.query.data));
                    this.groupData.ids.push(this.$route.query.machineId);
                    this.groupData.data.push(qudata);
                    if (qudata.name) {
                        this.$set(this.groupData, "name", qudata.name);
                    } else {
                        this.$set(this.groupData, "name", qudata.plateNumber);
                    }
                    this.backbtnShow = true;
                } else {
                    this.backbtnShow = false;
                }
            },
            updataArea(detailData) {
                this.detailData = detailData
                this.$refs.areaDialog.dialogVisible = true
            },
            auditArea(detailData) {
                this.detailData = detailData
                this.$refs.audit.dialogVisible = true
            },
            pageCurrentChange(val) {
                this.page.currentPage = val
                this.searchData()
            },
            pageSizeChange(val) {
                this.page.pageSize = val
                this.searchData()
            },
            //导出报表
            async export2Excel() {
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                if (this.queryParams) {
                    this.queryParams.title = this.groupData.name + "作业报表" + dateFormat(new Date()) + ".xls"
                }
                // console.log(this.queryParams);
                // console.log(this.queryParams.machineIdS);
                if(!this.afterquery){
                    this.$message.warning('先点击查询！');
                }else{
                    // this.afterquery = false;
                    if(this.page.total > 50000){
                        this.$message.warning('导出数量不能超过50000条！');
                    }else{
                        this.loading = true;
                        let res = await excelAreaInfo(this.queryParams);
                        this.loading = false;
                    }
                }
            },
            // 打开农机分组框
            open() {
                this.setGroupCheckBox(true);
                this.setGroupBoxStatus(true);
                this.setGroupBoxType(2);
                this.afterquery = false;
            },
            async init() {
                //初始化作业类型
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 1000
                }, {listType: "job_type"}))
                if (res.code === 0) this.form.jobTypes = res.data.records;
                //console.log("init data:",res.data);
                //console.log("jobTypes:",this.form.jobTypes);
                this.initSettings()
                console.log("this.groupData.data", this.groupData.data)
                if (!this.groupData.data || !isArray(this.groupData.data)) {
                  /*  if (this.groupData.data) {
                        this.groupData.data = [].push(this.groupData.data)
                    } else {*/
                        this.groupData.data = []
                        this.groupData.ids = []
                        this.$set(this.groupData, "name", '');
                   // }
                }
            },
            initSettings() {
                //console.log("this.globalSetting", this.globalSetting)
                this.form.jobType = !this.globalSetting.jobType ? "" : this.globalSetting.jobType;
                //console.log("jobType:",this.form.jobType);
                this.form.jobStartTime = !this.globalSetting.bTime ? new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 * 30) : this.globalSetting.bTime
                this.form.jobEndTime = !this.globalSetting.eTime ? new Date((new Date()).setHours(0, 0, 0, 0) - 1000) : this.globalSetting.eTime
            },
            getBtnPermis() {
                this.btnPermis.btnView = this.permissions[window.global.buttonPremission.jobView];
                this.btnPermis.btnRepeat = this.permissions[window.global.buttonPremission.workRepeat];
                this.btnPermis.btnAuditMap = this.permissions[window.global.buttonPremission.jobAuditMap];
                //console.log('this.btnPermis', this.btnPermis)
            },
            ChangeView1() {
                if (this.isMap) {
                    this.isMap = !this.isMap
                }
            },
            ChangeView2() {
                if (!this.isMap) {
                    this.isMap = !this.isMap
                }
            },
            // 选择开始时间改变事件
            startChange(val) {
                // 给结束时间默认值
                //this.form.jobEndTime = new Date(val.getTime() + 24*60*60*1000 - 1);
            },
            // 获取时间标记
            async getDateMarker() {
                let params = {
                    machineId: this.data.machineId,
                    // machineId: '1000000003631',
                    month: this.queryMonth
                }
                let res = await getWorkingDateByMonth(params);
                let {code, data} = res;
                if (code == 0) {
                    let date = [];
                    data.map(d => {
                        let item = new Date(d.date.split(',').join('-'));
                        date.push(item.getTime());
                    });
                    if (date.length > 0) {
                        let className = time => {
                            if (date.includes(time.getTime())) {
                                return 'marktime'
                            }
                        }
                        this.startTime.cellClassName = className;
                        this.endTime.cellClassName = className;
                    }
                    ;
                }
            },
            // 通过头部label获取当前年月，并监听变化
            handleQueryMonth() {
                this.$nextTick(() => {
                    let year = document.getElementsByClassName('el-date-picker__header-label')[0].innerHTML;
                    let month = document.getElementsByClassName('el-date-picker__header-label')[1].innerHTML;
                    this.queryMonth = year.split(' ')[0] + '-' + month.split(' ')[0];
                    //console.log('query', new Date(), this.queryMonth)
                })
            },
            // 日期组件获取焦点事件
            showPanel() {
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
            // 根据条件查询数据
            async query() {
                //console.log("working-monitoring 查询数据:",this.groupData);
                this.afterquery = true;
                if (this.groupData.ids.length <= 0) {
                    this.$message.info('请先选择分组或者农机');
                    return;
                }
                let params = {
                    jobStartTime: dateFormat(this.form.jobStartTime, 'yyyy-MM-dd hh:mm:ss'),
                    jobEndTime: dateFormat(this.form.jobEndTime, 'yyyy-MM-dd hh:mm:ss'),
                    auditFlag: this.form.auditFlag,
                    keyword: this.form.keyword,

                    // pbw修改
                    jobType: this.form.jobType,
                }
                if (this.groupData.ids.length === 1) {
                    params.machineId = this.groupData.ids[0]
                } else {
                    params.machineIdS = this.groupData.ids.join(',')
                }
                let groupIds = [], gAttrs = [], groupId = [], path = []; // groupIds所有的分组id集合 gAttrs所有的groupAttribute集合 groupId最外层的分组 path最外层分组的path集合
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
                //console.log(params, 'params')
                this.queryParams = params;
                this.page.currentPage = 1;
                this.searchData()
            },
            searchData() {
                this.initSummary();
                this.initData();
            },
            // 获取查询结果
            async initData() {
                this.listData = [];
                this.loading = true;
                let params = Object.assign(this.queryParams, {
                    pageNum: this.page.currentPage,
                    pageSize: this.page.pageSize,
                });
                let res = await queryByCondition(params);
                this.loading = false;
                const {code, data} = res;
                if (code == 0) {
                    this.listData = data.list;
                    this.page.total = data.total;
                } else {
                    this.$message.warning(res.msg)
                }
            },
            // 获取统计数据
            async initSummary() {
                let params = Object.assign(this.queryParams, {
                    pageNum: this.page.currentPage,
                    pageSize: this.page.pageSize,
                });
                let res = await getSummaryData(params);
                const {code, data} = res;
                if (code == 0) {
                    this.summaryData = data
                    /*this.staTypes[0].value = data.done;
                    this.staTypes[1].value = data.qualifiedRate;
                    this.staTypes[2].value = data.approved;
                    this.staTypes[3].value = data.notApproved;*/
                }
            },


            // 相同字符串筛选
            longestCommonPrefix(strs) {
                let tempStr = strs[0];
                while (strs.some(item => item.indexOf(tempStr) !== 0)) {
                    tempStr = tempStr.substring(0, tempStr.length - 1);
                }
                return tempStr;
            },
            handleAuditByMap(val) {
                this.isMap = true;
                this.currentData = val;
            },
            // 更多 重复作业查询模块
            showMore() {
                if (this.backbtnShow) {
                    this.$router.push({path: '/working-management/repeat-working/index', query: {data: this.groupData}})
                } else {
                    this.$router.push({path: '/working-management/repeat-working/index'})
                }
            },
            goback() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    .working-monitoring {
        height: calc(100% - 21px) !important;
        position: relative;

        .shadow-btn {
            height: 36px;
        }

        .title {
            margin-top: 15px;
            padding-left: 20px;
            padding-right: 27px;
            width: calc(100% - 47px)
        }

        .query-con {
            padding: 20px 0 14px 20px;
            display: flex;
            justify-content: space-between;

            .el-input {
                width: 200/@vw;
            }

            .el-select {
                width: 150/@vw;
            }

            .el-form-item {
                margin-bottom: 20px;
            }

            .el-form-item:nth-child(1) {
                .el-input {
                    width: 160/@vw;
                }
            }

            .btns {
                display: flex;
                flex-direction: row;
                width: 70px;
                height: 32px;
                padding-right: 42/@vw;
                border-radius: 3px;

                .view1, .view2 {
                    width: 35px;
                    line-height: 35px;
                    cursor: pointer;
                    text-align: center;
                }

                .view1 {
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                    border: #0c4b85 solid 1px;
                    border-right: none;

                }

                .view2 {
                    border-top-right-radius: 3px;
                    background-color: transparent;
                    border-bottom-right-radius: 3px;
                    border: #0c4b85 solid 1px;
                    border-left: none;
                }

                .active {
                    background: #0c4b85;
                }
            }

            .view {
                vertical-align: middle;
                margin-left: 40/@vw;
                cursor: pointer;
            }
        }

        .view-con {
            padding-right: 20/@vw;
            // height: calc(100% - 130px);
            height: calc(100% - 125px);
        }

        .group {
            position: absolute;
            top: 90px;
            left: 0;
            z-index: 5;
        }
    }
</style>

<style lang="less">
    .marktime {
        background-color: rgba(0, 67, 124, .5);;
        color: #0d83df;
    }
</style>
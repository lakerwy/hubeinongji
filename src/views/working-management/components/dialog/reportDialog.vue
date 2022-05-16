<template>
    <!-- 作业上报 深度上报 -->
    <el-dialog
            class="my-dialog"
            :title="type == 0 ? '面积重算' : '深度分析'"
            :visible.sync="dialogVisible"
            :width="preViewShow?'70%':'30%'"
            top="15vh"
            :close-on-click-modal="false"
            v-loading="loading"
            @close="close">
        <div>
            <el-form class="report-form" ref="form" :model="form"
                     label-width="80px">
                <el-row>
                    <el-col :span="preViewShow?8:22">
                        <el-form-item label="农机车牌" v-if="ids && ids.length == 1">
                            <el-input v-model="form.plateNumber" readonly placeholder="请输入农机车牌"></el-input>
                        </el-form-item>
                        <el-form-item label="分组名称" v-else>
                            <el-input v-model="form.name" readonly placeholder="请选择农机分组"></el-input>
                        </el-form-item>
                        <el-form-item label="上报方式" class="special">
                            <el-input v-model="form.apperType" readonly placeholder="请输入上报方式"></el-input>
                        </el-form-item>
                        <el-form-item label="面积算法">
                            <el-select v-model="form.computeType" placeholder="请选择面积算法" ref="computeType">
                                <el-option v-for="(item,index) in computeTypes" :label="item.itemName"
                                           :value="item.itemCode"
                                           :key="item.itemCode"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-date-picker class="datepicker" type="datetime" placeholder="选择日期"
                                            prefix-icon="el-icon-date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :clearable="false" v-model="form.appearBeginTime" style="width: 100%;"
                                            @change="startChange"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-date-picker class="datepicker" type="datetime" placeholder="选择日期"
                                            prefix-icon="el-icon-date"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :clearable="false" v-model="form.appearEndTime"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="作业归属分组" v-if="false">
                            <el-input v-model="form.groupId" placeholder="请选择农机分组"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="preViewShow" :span=16>
                        <el-tabs type="border-card" class="tabs">
                            <el-tab-pane>
                                <span slot="label"><i class="el-icon-date"></i> 当前作业</span>
                                <div class="list-view-statics">
                                    <div class="statics-box">
                                        <div
                                                v-for="(item, index) in staTypes1"
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
                                    <div class="my-table area-table">
                                        <el-table
                                                :data="currentData"
                                                style="width: 100%"
                                                border
                                                height="100%">
                                            <el-table-column type="index" label="序号" width="60"></el-table-column>
                                            <el-table-column prop="jobType" label="作业类型" width="120px"
                                                             :formatter="typeFilter"></el-table-column>
                                            <el-table-column prop="jobEndTimeS" label="开始时间"></el-table-column>
                                            <el-table-column prop="jobEndTimeS" label="结束时间"></el-table-column>
                                            <el-table-column prop="computeArea" label="作业面积（亩）"
                                                             width="120px"></el-table-column>
                                            <el-table-column prop="avgDepth" label="平均深度"
                                                             width="120px"></el-table-column>
                                            <!--                                    <el-table-column prop="toolCode" label="机具识别码" width="200px"></el-table-column>
                                                                                <el-table-column prop="toolWidth" label="机具宽幅（米）" width="120px"></el-table-column>
                                                                                <el-table-column prop="address" label="作业地址" width="200px"></el-table-column>-->
                                        </el-table>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane>
                                <span slot="label"><i class="el-icon-date"></i>{{staTypes[0].value}}  </span>
                                <div class="list-view-statics">
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
                                <div class="list-view-table">
                                    <div class="my-table area-table">
                                        <el-table
                                                :data="preViewData"
                                                style="width: 100%"
                                                border
                                                height="100%">
                                            <el-table-column type="index" label="序号" width="60"></el-table-column>
                                            <el-table-column prop="jobType" label="作业类型" width="120px"
                                                             :formatter="typeFilter"></el-table-column>
                                            <el-table-column prop="btime" label="开始时间"></el-table-column>
                                            <el-table-column prop="etime" label="结束时间"></el-table-column>
                                            <el-table-column prop="area" label="作业面积（亩）"
                                                             width="120px"></el-table-column>
                                            <el-table-column prop="avgDepth" label="平均深度"
                                                             width="120px"></el-table-column>
                                            <!--                                    <el-table-column prop="toolCode" label="机具识别码" width="200px"></el-table-column>
                                                                                <el-table-column prop="toolWidth" label="机具宽幅（米）" width="120px"></el-table-column>
                                                                                <el-table-column prop="address" label="作业地址" width="200px"></el-table-column>-->
                                        </el-table>
                                    </div>
                                </div>
                            </el-tab-pane>

                        </el-tabs>


                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="shadow-btn" plain round @click="preview" v-if="preView">诊断</el-button>
                <el-button type="primary" class="shadow-btn" plain round @click="save">重算</el-button>
                <el-button class="shadow-btn" plain round @click="close">取消</el-button>
            </div>
        </div>


    </el-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {
        insertApperJobArea,
        insertApperJobDepth,
        getDetailByMachinId,
        queryByCondition,
        getSummaryData,
    } from '@/api/working/index'
    import {algorithmAreaPagination} from "@/api/monitoring/index";
    import {dateFormat, filterDict} from "@/util/util";
    import {fetchItemList} from '@/api/admin/dict'

    export default {
        props: {
            type: {
                type: Number,
                default: ''
            },
            machineIds: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                dialogVisible: false,
                form: {
                    apperType: '',
                    plateNumber: '',
                    computeType: '-1',
                    appearBeginTime: new Date((new Date()).setHours(0, 0, 0, 0)) + "",
                    appearEndTime: new Date((new Date()).setHours(23, 59, 59, 999)),

                },
                loading: false,
                computeTypes: [
                    /*{value: '-1', label: '自动计算'},
                    {value: '100', label: '密度算法-基础算法'},
                    {value: '101', label: '密度算法-小宽幅补偿'},
                    {value: '102', label: '密度算法-大宽幅补偿'},
                    {value: '103', label: '密度算法-大宽幅长宽计算'},
                    {value: '104', label: '密度算法-无速度限制'},
                    {value: '105', label: '密度算法-外轮廓地块'},
                    {value: '200', label: '深度算法-基础算法>9'},
                    {value: '201', label: '深度算法-基础算法>20'},
                    {value: '202', label: '深度算法-无速度下限>9'},
                    {value: '203', label: '深度算法-长宽计算>9'},
                    {value: '204', label: '深度算法-有细长地块>20'},
                    {value: '300', label: '深度密度算法-基础算法>9'},
                    {value: '301', label: '深度密度算法-基础算法>20'},
                    {value: '106', label: '密度算法-无速度下限'},
                    {value: '205', label: '深度算法-基础算法>0'},
                    {value: '000', label: '计算-栅格面积计算'},
                    {value: '001', label: '计算-小宽幅栅格计算'},
                    {value: '002', label: '计算-缓冲区面积计算'},
                    {value: '003', label: '计算-长宽面积计算'},
                    {value: '107', label: '密度算法-速度6'},
                    {value: '302', label: '深度密度算法-合肥插秧>0速度<6'},*/
                ],
                depthTypes: [
                    {value: '0', label: '缺省上报'},
                    {value: '1', label: '深松整地'},
                    {value: '2', label: '秸杆还田'},
                ],
                types: [],
                jobTypes: [],
                ids: [],
                preView: false,
                preViewShow: false,
                staTypes: [
                    {
                        type: "算法类型",
                        unit: "",
                        value: "0",
                        color: "#009cff",
                        class: "box5",
                        show: false
                    },
                    {
                        type: "作业数",
                        unit: "条",
                        value: "0",
                        color: "#00deff",
                        class: "box1",
                        show: true
                    },
                    {
                        type: "作业面积",
                        unit: "亩",
                        value: "0",
                        color: "#3cfad3",
                        class: "box2",
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
                staTypes1: [
                    {
                        type: "作业数",
                        unit: "条",
                        value: "0",
                        color: "#00deff",
                        class: "box1",
                        show: true
                    },
                    {
                        type: "作业面积",
                        unit: "亩",
                        value: "0",
                        color: "#3cfad3",
                        class: "box2",
                        show: true
                    },
                    {
                        type: "合格率",
                        unit: "%",
                        value: "0",
                        color: "#ba92fa",
                        class: "box2",
                        show: true
                    },
                    {
                        type: "未通过",
                        unit: "亩",
                        value: "0",
                        color: "#fa981a",
                        class: "box2",
                        show: true
                    },
                ],
                preViewData: [],
                currentData: []
            }
        },
        computed: {
            ...mapGetters(['groupData'])
        },
        watch: {
            dialogVisible(newV) {
                // 通过监听dialog状态来初始化请求
                if (newV) {
                    this.initData();
                }
            }
        },
        created() {
            this.initComputeTypes()
            this.initJobTypes()
        },
        methods: {
            async initComputeTypes() {
                fetchItemList({listType: 'compute_type', current: 1, size: 1000}).then((result) => {
                    if (result.code === 0) {
                        this.computeTypes = result.data.records;
                        ////console.log('this.computeTypes', this.computeTypes)
                        //this.$set(this.form, 'computeType', "-1")
                        this.$set(this.form, 'computeType', this.computeTypes[0].itemCode)
                        //console.log("this.form.computeType",this.form.computeType)
                    }
                })
            },
            async initJobTypes() {
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 1000
                }, {listType: "job_type"}))
                if (res.code === 0) this.jobTypes = res.data.records;

            },
            // 页面部分数据回显
            async initData() {
                if (this.computeTypes.length)
                    this.$set(this.form, 'computeType', this.computeTypes[0].itemCode)

                if (this.machineIds && this.machineIds.length) {
                    this.ids = this.machineIds;
                } else {
                    this.ids = [...this.groupData.ids]
                    this.$set(this.form, 'appearBeginTime', new Date((new Date()).setHours(0, 0, 0, 0)))
                    this.$set(this.form, 'appearEndTime', new Date((new Date()).setHours(23, 59, 59, 999)))
                    this.$set(this.form, 'plateNumber', this.groupData.name)
                }
                if (this.ids && this.ids.length == 1) {
                    this.preView = true
                    /*let params = {
                        machinId: this.ids[0]
                    }
                    let res = await getDetailByMachinId(params);
                    const {code, data} = res;
                    if (code == 0) {
                        // this.form.plateNumber = data.plateNumber;
                        this.$set(this.form, 'plateNumber', data.plateNumber)
                    }
                     */
                } else {
                    this.preView = false
                }
            },
            startChange(val) {
                // 给结束时间默认值
                // this.form.appearEndTime = new Date(val.getTime() + 24 * 60 * 60 * 1000 - 1);
                this.form.appearEndTime = new Date(new Date(val.getTime()).setHours(23, 59, 59, 999));
            },
            async preview() {
                if (!this.ids || this.ids.length == 0)
                {
                    this.$message.info('请至少选择一个农机或者分组');
                    return
                }
                if(!this.form.appearBeginTime||!this.form.appearEndTime){
                    this.$message.info('请选择时间段');
                    return
                }

                this.staTypes[0].value = this.$refs.computeType.selectedLabel;
                this.staTypes[1].value = 0;
                this.staTypes[2].value = 0;

                this.loading = true;
                let params = {
                    algorithm: this.form.computeType,//面积算法
                    machineId: this.ids[0],
                    jobStartTimeS: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
                    jobEndTimeS: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),

                }
                let res = {}
                try {
                    res = await algorithmAreaPagination(params);
                } catch {

                }

                if (res.code === 0) {
                    this.preViewShow = true
                    this.staTypes[1].value = res.data.total || 0;
                    this.staTypes[2].value = res.data.totalArea || 0;
                    this.preViewData = [...res.data.rows]
                }

                params = {
                    jobStartTime: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
                    jobEndTime: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),
                    machineId: this.ids[0],
                }

                let paramsFinal = Object.assign(params, {
                    pageNum: 1,
                    pageSize: 10000,
                });
                try {
                    res = await queryByCondition(params);
                } catch {
                }
                if (res.code === 0 && res.data && res.data.list) {
                    this.currentData = res.data.list;
                    this.staTypes1[0].value = res.data.list.length;
                }
                try {
                    res = await getSummaryData(params);
                } catch {
                }
                if (res.code === 0 && res.data) {
                    this.staTypes1[1].value = res.data.done;
                    this.staTypes1[2].value = res.data.qualifiedRate;
                    this.staTypes1[3].value = res.data.notApproved;
                }

                this.loading = false
            },
            save() {
                if (this.type == '0') {
                    this.reportWorking();
                } else if (this.type == '1') {
                    this.reportDepth();
                }
            },
            async reportWorking() {
                if (!this.ids || this.ids.length == 0)
                {
                    this.$message.info('请至少选择一个农机或者分组');
                    return
                }

                if(!this.form.appearBeginTime||!this.form.appearEndTime){
                    this.$message.info('请选择时间段');
                    return
                }
                //console.log("this.form.computeType",this.form.computeType)

                let params = {
                    jobType: this.form.computeType,
                    appearBeginTime: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
                    appearEndTime: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),
                    machineIdList: this.ids && this.ids.join(','),
                    belongGroupId: this.form.groupId,
                }
                this.loading = true;
                let res = await insertApperJobArea(params);
                this.loading = false;
                const {code, data, msg} = res;
                if (code == 0) {
                    this.$message.success('面积重算提交成功');
                    this.dialogVisible = false;
                } else {
                    this.$message.error(msg || '面积重算提交失败')
                }
            },
            async reportDepth() {
                let params = {
                    jobType: this.form.jobType,
                    appearBeginTime: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
                    appearEndTime: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),
                    machineIdList: this.ids && this.ids.join(',')
                }
                let res = await insertApperJobDepth(params);
                const {code, data, msg} = res;
                if (code == 0) {
                    this.$message.success('深度上报提交成功');
                    this.dialogVisible = false;
                } else {
                    this.$message.error(msg || '深度上报提交失败')
                }
            },
            close() {
                this.form = {};
                this.dialogVisible = false;
                this.preViewShow = false;
                //this.preView = false;
            },
            cancle() {

            },
            typeFilter(row) {
                return filterDict(row.jobType, {labelKey: 'itemName', valueKey: 'itemCode'}, this.jobTypes)
            },
        }
    }
</script>

<style lang="less" scoped>
    .havePreview {
        width: 50%;
    }

    .noPreview {
        width: 30%;
    }

    .report-form {
        width: 100%;
        margin: 0 auto;
        padding: 0 20px;

        .el-select {
            width: 100%;
        }

        .datepicker {
            width: 100% !important;
        }
    }

    .area-detail {
        width: 100%;
        margin: 0 auto;
    }


    .list-view-statics {
        // position: relative;
        // height: 126px;
        margin: 0 10px;
        border: 1px solid #123b72;
        border-bottom: none;
        // background-image: url('../../../../assets/images/rect1.png');
        // background-size: 100% 100%;
        background-position: 0 0;
        background-repeat: no-repeat;

        .statics-box {
            padding: 0 20px;
            width: 100%;
            display: flex;
            align-items: center;
            line-height: 50px;
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
                    font-size: 14px;
                    margin-right: 16px;
                }

                .value {
                    font-size: 20px;
                    font-style: italic;
                    margin-right: 5px;
                }

                .unit {
                    font-size: 14px;
                }
            }

            .active {
                background-color: #04122c;
                box-shadow: inset 0px 0px 50px 0px rgba(0, 134, 255, 0.7);
            }
        }

    }

    .list-view-table {
        //height: calc(100% - 90px);
        margin: 0 10px;
        border: 1px solid #123b72;
        background-size: 100% 100%;
        background-position: 0 0;
        background-repeat: no-repeat;
        position: relative;

        .area-table {

            height: 300px;
            max-height: 600px;

            /deep/ .el-table tr {
                height: 29px;
            }

            /deep/ .el-table th {
                height: 30px;
            }

            /deep/ .el-table__header-wrapper tr {
                background: rgba(0, 160, 233, 0.05);
            }

            /deep/ .el-table tbody tr:nth-child(2n) {
                background: none;
            }

            /deep/ .el-table td, .el-table th.is-leaf {
                border-bottom: 1px solid #07203c;
            }
        }

        .page {
            border-top: solid 1px #123b72;
        }

    }

    .tabs {
        margin-bottom: 20px;
    }

    /deep/ .el-tabs--border-card {
        background: #fff0;
        border: 0;

        .el-tabs__header {
            background-color: #fff0;
        }

    }

    /deep/ .el-tabs--border-card > .el-tabs__header {
        background-color: #fff0;
    }

    /deep/ .el-tabs__header {
        margin-left: 5px;
        margin-right: 5px;
        border-bottom: 0px solid #55adff;

         .el-tabs__item {
            padding: 0 10px;
            border: 0 !important;
        }
    }



    /deep/ .el-tabs__nav-wrap::after {
        height: 0;
    }

    /deep/ .el-tabs__active-bar {
        height: 0;
    }

    /deep/ .el-tabs__item {
        color: #fefefe;
    }


    /deep/ .is-active {
        background-image: url("../../../../assets/images/tab-background.png");
        background-size: 100% 100%;
        background-color:#fff0 !important;
    }
    /deep/ .el-tabs__item:first-child{
        margin-left: 10px !important;
    }

</style>
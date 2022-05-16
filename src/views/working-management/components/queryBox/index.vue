<template>
    <!-- 作业查询组件 -->
    <div class="pbw_animationBox">
        <div :class="show? 'hideicon' : 'showicon'" @click="close">
            <button class="pbw_button"> 点击查询</button>
        </div>

        <div class="working-query-box" :class="show ? 'show':'hide'">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="search-type">
                        <div class="active">
                            <img src="img/monitoring/icon-title.png" alt="">
                            <span>作业查询</span>
                        </div>
                    </div>
                    <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                        <img src="img/monitoring/icon_expand.png" :class="{'rightimg':!show}" alt="">
                    </el-button>
                </div>
                <div class="work-con">
                    <div class="item" v-for="item in types" :key="item.type">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="type">{{item.type}}</span>
                            </div>
                        </div>
                        <span class="num">{{item.value}}</span> <span>{{item.unit}}</span>
                    </div>
                </div>
                <div class="list-con" element-loading-background="rgba(0, 0, 0, 0.1)">
                    <div
                            :class="['list', {'active' : currentIndex == index}]"
                            v-for="(item,index) in tableData"
                            :key="index"
                            @click="handleItemClick(item, index)">
                        <div class="index">{{index + 1 + page.pageSize * (page.currentPage - 1)}}</div>
                        <div class="owner">{{item.ownerName}} [{{item.plateNumber}}]</div>
                        <!--<div class="time">{{item.jobStartTime}}</div>-->
                        <div class="type">{{typeFilter(item.jobType)}}</div>
                        <div class="time">
                            <span>作业时间：{{formattWorkTime(item.jobStartTime,item.jobEndTime)}}</span>
                        </div>
                        <div class="area">
                            <span>作业面积：{{item.computeArea}} 亩</span>
                            <span>合格率：{{Number((item.depthRate * 10000).toFixed(0)) / 100}}%</span>
                        </div>
                    </div>
                </div>
                <myPagination
                        :currentPage="page.currentPage"
                        :pageSize="page.pageSize"
                        :sizes="page.pageSizes"
                        :total="page.total"
                        :Layout="page.layout"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"/>
            </el-card>
        </div>
    </div>
</template>

<script>
    import myPagination from '_com/myPagination/index'
    import {queryByCondition, getSummaryData} from '@/api/working/index'
    import {getDictByListType} from '@/api/basic/index'
    import {filterDict} from '@/util/util.js'

    export default {
        name: 'workingQueryBox',
        components: {
            myPagination
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
            listData: {
                handler: function (newV) {
                    this.tableData = newV
                    // debugger;
                    if (this.currentIndex >= 0) {
                        this.currentWorking = this.tableData[this.currentIndex];
                        //console.log('getCurrent', this.currentWorking)
                        this.$emit('getCurrent', this.currentWorking, this.currentIndex);
                    }
                },
                // immediate: true,
                deep: true,
            },
            summaryData: {
                handler: function (newV) {
                    if (newV) {
                        this.types[0].value = newV.done;
                        this.types[1].value = newV.qualifiedRate;
                        this.types[2].value = newV.approved;
                        this.types[3].value = newV.notApproved;
                    }
                },
                // immediate: true,
                deep: true,
            },
            pageP: {
                handler: function (newV) {
                    this.page = newV
                    this.page.layout = this.layout;
                },
                deep: true,
            }
        },
        data() {
            return {
                types: [
                    {type: '作业面积', value: 0, unit: '亩'},
                    {type: '作业合格率', value: 0, unit: '%'},
                    {type: '审核通过面积', value: 0, unit: '亩'},
                    {type: '审核未通过面积', value: 0, unit: '亩'},
                ],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 40, 50, 100],
                    total: 0,
                    layout: 'sizes, prev, slot, next, ->, total',
                },
                layout: 'sizes, prev, slot, next, ->, total',
                tableData: [],
                currentIndex: -1,
                currentWorking: {},
                loading: false,
                jobTypes: [],
                show: true,
            }
        },
        created() {
            this.initTypes();
        },
        methods: {
            // 获取查询结果
            async initData(isUpdate) {
                this.tableData = [];
                this.currentIndex = -1;
                this.loading = true;
                let params = Object.assign(this.query, {pageNum: this.page.currentPage, pageSize: this.page.pageSize})
                let res = await queryByCondition(params);
                this.loading = false;
                const {code, data} = res;
                if (code === 0) {
                    this.tableData = data.list;
                    this.page.total = data.total;
                    if (isUpdate) {
                        // 用于更新详情数据的,数据更新到了第一条
                        this.handleItemClick(this.tableData[0], 0)
                    }
                }
                this.$forceUpdate()
            },
            formattWorkTime(timeS, timeE) {
                return timeS + " ~ " + timeE.substring(timeE.indexOf(' ') + 1)
            },
            // 获取统计数据
            async initSummary() {
                let params = Object.assign(this.query, {pageNum: this.page.currentPage, pageSize: this.page.pageSize})
                let res = await getSummaryData(params);
                const {code, data} = res;
                if (code == 0) {

                }
            },
            // 请求农机字典数据
            async initTypes() {
                let params = {
                    listType: 'job_type'
                }
                let res = await getDictByListType(params);
                let {code, data} = res;
                if (code == 0) {
                    this.jobTypes = data;
                }
            },
            // 农机类型字典回显
            typeFilter(val) {
                return filterDict(val, {labelKey: 'itemName', valueKey: 'itemCode'}, this.jobTypes)
            },
            handleCurrentChange(val) {
                // debugger;
                this.$emit("current-change", val)
                //this.page.currentPage = val;
                //this.initData();
            },
            handleSizeChange(val) {
                //this.page.pageSize = val;
                //this.initData();
                this.$emit("size-change", val)
            },
            // 收起面板
            close() {
                this.show = !this.show;
            },
            // 查询结果点击某一项
            handleItemClick(item, index) {
                this.currentIndex = index;
                this.currentWorking = item;
                ////console.log(this.currentWorking, 'working')
                this.$emit('getCurrent', this.currentWorking, this.currentIndex);
            }
        }
    }
</script>

<style lang="less" scoped>
    .pbw_animationBox {
        height: calc(100% - 10px);
        position: relative;
    }

    .pbw_button {
        background-color: #07223c;
        color: white;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .hideicon {
        display: none;
    }

    .showicon {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }

    .hide {
        animation: hideanimation 1s linear forwards;
        position: absolute;
    }

    .show {
        animation: showanimation 1s linear forwards;
        position: absolute;
    }

    .rightimg {
        animation: imganimation 0.5s linear forwards;
    }

    @keyframes hideanimation {
        from {
            margin-left: 0;
        }
        to {
            margin-left: -400px;
        }
    }

    @keyframes showanimation {
        from {
            margin-left: -400px;
        }
        to {
            margin-left: 0;
        }
    }

    @keyframes imganimation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(180deg);
        }
    }


    @vw: 19.2vw;
    @vh: 10.8vh;
    .working-query-box {
        width: 400px;
        // height: 879 / @vh;
        // height: calc(100% - 34px);
        height: 100%;

        .box-card {
            background: @base-darkBlue;
            height: 100%;

            .clearfix:after {
                clear: both
            }

            .search-type {
                display: inline-flex;
                line-height: 48px;
                color: @base-fontColor;

                div {
                    // width: 128px;
                    cursor: pointer;

                    img {
                        vertical-align: sub;
                        margin-right: 5px;
                    }
                }

                .active {
                    color: #2d7de9;
                }
            }

            .work-con {
                display: flex;
                flex-wrap: wrap;
                padding: 0 10px;
                justify-content: space-between;
                align-items: center;
                // height: 400px;
                overflow-y: auto;

                .item {
                    width: 165px;
                    height: 58px;
                    background-color: #031636;
                    border: solid 1px #1c91ff;
                    margin-top: 16px;
                    color: @base-fontColor;
                    text-align: center;
                    box-shadow: inset 2px 0px 16px 0px rgba(50, 111, 166, 0.8);

                    .panel-header {
                        height: 25px;
                    }

                    .num {
                        font-size: 24px;
                        font-style: italic;
                        margin: 0;
                        font-family: DINNextW1G-MediumItalic;
                        color: #fff;
                        text-shadow: 0 0 26px #2d7de9;
                    }
                }
            }

            .list-con {
                margin-top: 15px;
                padding: 0 10px;
                // height: 574px;
                // height: 69%;
                height: calc(100% - 223px);
                overflow-y: auto;

                .list {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 25px 218px 94px;
                    grid-template-rows: 36px 36px;
                    grid-template-areas: 'a b c' 'a d d' 'a e e';
                    background: #07223c;
                    margin-bottom: 10px;
                    color: @base-fontColor;
                    text-align: center;
                    cursor: pointer;

                    .index {
                        grid-area: a;
                        background-color: #194260;
                        line-height: 72px;
                    }

                    .owner {
                        grid-area: b;
                        border-right: 1px solid #2e7fa5;
                        line-height: 36px;
                        padding-left: 13px;
                        color: #80c5ff;
                        text-align: left;
                    }

                    .type {
                        line-height: 36px;
                        color: #80c5ff;
                        grid-area: c;
                    }

                    .time {
                        line-height: 36px;
                        grid-area: d;
                        text-align: left;
                        border-top: 1px solid #2e7fa5;
                        padding-left: 13px;
                        /* span:first-child {
                           display: inline-block;
                           width: 148px;
                           margin-left: 13px;
                         }*/
                    }

                    .area {
                        line-height: 36px;
                        grid-area: e;
                        text-align: left;
                        border-top: 1px solid #2e7fa5;

                        span:first-child {
                            display: inline-block;
                            width: 148px;
                            margin-left: 13px;
                        }
                    }
                }

                .active {
                    background-image: linear-gradient(90deg,
                    #061d28 0%,
                    #1a92cb 100%),
                    linear-gradient(#1f5278,
                    #1f5278);

                    .index {
                        background-color: #0a374c;
                    }
                }
            }

            .pagination {
                margin-top: 24px;
            }
        }

        /deep/ .el-card__header {
            border-image-source: url('../../../../assets/images/line.png');
            border-image-slice: 0 0 100% 0;
            border-image-width: 1px;
            // border-image-repeat: repeat;
        }

        /deep/ .el-card__body {
            padding-bottom: 24px;
            padding-top: 4px;
            height: calc(100% - 76px);
            overflow-y: auto;
        }
    }
</style>
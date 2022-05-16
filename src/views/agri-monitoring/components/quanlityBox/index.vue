<template>
    <!-- 作业工况组件 -->
    <div class="quanlity-box">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="search-type">
                    <div class="active">
                        <img src="img/monitoring/icon-title.png" alt="">
                        <span>作业质量监控</span>
                    </div>
                </div>
                <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                    <img src="img/monitoring/icon_unfolded.png" alt="">
                </el-button>
            </div>
            <div class="quanlity-con" id="quanlity"></div>
        </el-card>
    </div>
</template>

<script>
    import chartOptions from './chart'
    import {initEcharts} from '@/util/chart.js'
    import {getMachineQuality} from '@/api/monitoring/index'
    import optionChart from '../../../agri-data/farmStatis/components/optionChart'

    export default {
        name: 'quanlityBox',
        data() {
            return {
                listData: sessionStorage.getItem('currentCar') ? JSON.parse(sessionStorage.getItem('currentCar')) : {},
            }
        },
        props: {
            quanlityData: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            quanlityData: {
                handler: function(newVal){
                    this.initData(newVal);
                },
            }
        },
        created() {
        },
        mounted() {
            //this.initData();
            // initEcharts('quanlity', chartOptions)
        },
        methods: {
            /*async initData() {
                let params = {
                    machineId: this.listData.machineId,
                    // machineId: '1000000003631',
                    pointTime: new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000)
                }
                //console.log("getMachineQuality", params)

                let res = await getMachineQuality(params);
                const {code, data} = res;
                if (code == 0) {
                    let timeList = [];
                    let dataList = [];
                    if (data.length > 0) {
                        data.map(item => {
                            timeList.push(item.time.slice(11, -3));
                            dataList.push(item.jobHeight);
                        })
                    }
                    this.$set(chartOptions.xAxis[0], 'data', timeList);
                    this.$set(chartOptions.series[0], 'data', dataList);
                    initEcharts('quanlity', chartOptions)
                }
            },*/
            
            async initData(data) {
                let timeList = [], dataList = []
                if (data && data.length > 0) {
                    data.map(item => {
                        timeList.push(item.time.slice(11));
                        // timeList.push(item.time);
                        dataList.push(item.jobHeight);
                    })
                }
                //console.log("timeList",timeList)
                //console.log("dataList",dataList)

                if(timeList.length < 10){
                    this.$set(chartOptions.dataZoom[0], 'start', 0);
                }else if(timeList.length < 100){
                    this.$set(chartOptions.dataZoom[0], 'start', 50);
                }else if(timeList.length < 200){
                    this.$set(chartOptions.dataZoom[0], 'start', 90);
                }else if(timeList.length < 2000){
                    this.$set(chartOptions.dataZoom[0], 'start', 98);
                }else{
                    this.$set(chartOptions.dataZoom[0], 'start', 99);
                }
                this.$set(chartOptions.xAxis[0], 'data', timeList);
                this.$set(chartOptions.series[0], 'data', dataList);
                //console.log(chartOptions);
                initEcharts('quanlity', chartOptions)
            },
            // 收起面板
            close() {

            }
        }
    }
</script>

<style lang="less" scoped>
    .quanlity-box {
        width: 400px;
        // height: 350px;
        height: 35%;

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
                    width: 128px;
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

            .quanlity-con {
                height: 100%;
            }
        }

        /deep/ .el-card__body {
            padding: 0;
            height: calc(100% - 48px);
        }
    }
</style>
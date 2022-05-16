<template>
    <div class="leftInfo">
        <ContentBox class="box1" :headName="'农机状态统计'">
            <section class="dash-board-container">
                <div id="online" class="trunk-online"></div>
                <div class="detail-container">
                    <div class="detail" v-for="(item, index) in details" :key="index">
                        <div>{{ item.name }}</div>
                        <div class="number-container">
              <span class="number">{{ item.count }}</span
              >辆
                        </div>
                    </div>
                </div>
                <div class="total">
                    <div>农机总数</div>
                    <div class="total-number">{{ allMachineCount }}</div>
                    <div>辆</div>
                </div>
            </section>
        </ContentBox>
        <ContentBox class="box2" :headName="'农机分类统计'">
            <section>
                <div id="agricul" class="agricul"></div>
            </section>
        </ContentBox>
        <ContentBox class="box3" :headName="'机具分类统计'">
            <section>
                <div id="pbwtools" class="pbwtools"></div>
            </section>
        </ContentBox>
    </div>
</template>

<script>
    import ContentBox from "../../../../components/contenBox";
    import leftChart from "./optionChart";
    import {initEcharts} from "../../../../util/chart";
    import {
        getOnlineMachine,
        getStaticClass,
        getToolsClass,
    } from "../../../../api/agridata";
    import {mapState} from "vuex";

    export default {
        components: {
            ContentBox,
        },
        data() {
            return {
                allMachineCount: 0,
                details: [
                    {
                        name: "在线农机",
                        count: 0,
                    },
                    {
                        name: "离线农机",
                        count: 0,
                    },
                    {
                        name: "报警农机",
                        count: 0,
                    },
                ],
            };
        },
        mounted() {
            this.initChart();
            // initEcharts("online", leftChart.LeftOption);
            // initEcharts('agricul', leftChart.agriculOption);
            // initEcharts('pbwtools', leftChart.machToolOption);
        },
        computed: {
            ...mapState(["cityAdress"]),
        },
        watch: {
            cityAdress: {
                handler(newName, oldName) {
                    //console.log("cityAdress", newName, oldName)
                    this.initChart();
                },
                immediate: false,
            }
        },
        methods: {
            initChart() {
                this.getMachineNum();
                this.getStaticClass();
                this.getToolsClass();
            },
            //获取在线农机数
            async getMachineNum() {
                let res = await getOnlineMachine(Object.assign({}, this.cityAdress));
                let {code, data, msg} = res;
                if (!code) {
                    this.allMachineCount = data.machineAllCount;
                    this.details[0].count = data.machineOnlineCount;
                    //this.details[1].count = data.machineLongOfflineCount;
                    this.details[1].count = data.machineAllCount - data.machineOnlineCount;
                    this.details[2].count = data.machineWarningCount;

                    let value1 = this.detailNumber(
                        data.machineOnlineCount,
                        data.machineAllCount
                    );
                    let value2 = this.detailNumber(
                        data.machineAllCount - data.machineOnlineCount,
                        data.machineAllCount
                    );
                    let value3 = this.detailNumber(
                        data.machineWarningCount,
                        data.machineAllCount
                    );

                    this.$set(leftChart.LeftOption.series[0].data[0], "value", value1);
                    this.$set(leftChart.LeftOption.series[1].data[0], "value", value2);
                    this.$set(leftChart.LeftOption.series[2].data[0], "value", value3);

                    this.$emit("getInfo", data);

                    initEcharts("online", leftChart.LeftOption);
                }
            },
            detailNumber(val, all) {
                if (!all) return 0
                let num = Number((val / all) * 100).toFixed(1)
                return Number(num)
            },
            //获取农机分类统计
            async getStaticClass() {
                let res = await getStaticClass(Object.assign({}, this.cityAdress));
                let {code, data, msg} = res;
                if (!code) {
                    this.$set(leftChart.agriculOption.series[0], "data", data.data);
                    //console.log(leftChart.agriculOption);
                    initEcharts("agricul", leftChart.agriculOption);
                }
            },
            //获取具分类统计
            async getToolsClass() {
                let res = await getToolsClass(Object.assign({}, this.cityAdress));
                let {code, data, msg} = res;
                if (!code) {
                    let name = [],
                        value = [];
                    data.data.forEach((item) => {
                        name.push(item.toolTypeName);
                        value.push(item.toolNumber);
                    });
                    //console.log(value);
                    this.$set(leftChart.machToolOption.yAxis[0], "data", name);
                    this.$set(leftChart.machToolOption.yAxis[1], "data", value);
                    this.$set(leftChart.machToolOption.series[0], "data", value);
                    //console.log(leftChart.machToolOption);

                    if (document.body.scrollHeight < 970) {
                        if (value.length < 9) {
                            document.querySelector(".pbwtools").style.setProperty("min-height", "0");
                            initEcharts("pbwtools", leftChart.machToolOption, true);
                        } else {
                            document.querySelector(".pbwtools").style.setProperty("min-height", "280px");
                            initEcharts("pbwtools", leftChart.machToolOption, true);
                        }
                    }

                    initEcharts("pbwtools", leftChart.machToolOption);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    @vh: 10.8vh;
    @Font-size: 14 / @vw;
    .leftInfo {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;

        .box1, .box2, .box3 {
            margin-top: 2%;
            box-sizing: border-box;
        }

        .box1 {
            margin-top: 20px;
            height: 31%;
            position: relative;
            border: 1px solid #07335d;
        }

        .box2 {
            height: 32%;
            border: 1px solid #07335d;

            section {
                height: 100%;
            }

            .agricul {
                height: 99%;
            }
        }

        .box3 {
            height: 30%;
            border: 1px solid #07335d;

            section {
                height: 100%;
                overflow: scroll;
            }

            .pbwtools {
                height: 99%;
            }
        }
    }

    .dash-board-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;

        .trunk-online {
            width: 100%;
            height: 40%;
        }

        .detail-container {
            // font-size: @Font-size;
            font-size: 16px;
            width: 100%;
            height: 20%;
            color: #80c5ff;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            .detail {
                display: flex;
                flex-direction: column;
                align-items: center;

                .number-container {
                    margin-top: 5px;

                    .number {
                        font-size: 26px;
                        color: #ffffff;
                        font-style: italic;
                        margin-right: 5px;
                    }
                }
            }
        }

        .total {
            display: flex;
            flex-direction: row;
            align-items: center;
            border: 1px solid #105188;
            width: 90%;
            height: 20%;
            justify-content: center;
            // font-size: @Font-size;
            font-size: 16px;
            color: #75b5ec;
            font-weight: 600;
            background-image: url("../../../../assets/images/trunk-total-background.png");

            .total-number {
                margin-left: 20px;
                margin-right: 20px;
                color: #ffffff;
                font-size: 26px;
                font-weight: 800;
                font-style: italic;
                text-shadow: 0px 0px 10px #308cfc;
            }
        }
    }
</style>
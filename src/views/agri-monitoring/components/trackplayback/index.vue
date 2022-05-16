<template>
    <div
            class="panel-common-detail trackback"
            v-if="data"
    >
        <div class="panel-header">
            <div class="panel-title">
                <!-- <span>{{data.plateNumber}} ({{ data.ownerName }}-{{ data.ownerPhone }})</span> -->
                <span>{{data.plateNumber}} ({{ data.ownerName }})</span>
            </div>
            <div class="panel-close">
                <el-button type="text" style="margin-right: 15px;" @click="showHistoryList"><img
                        src="img/monitoring/track.png" style="vertical-align: sub;" alt=""> 轨迹列表
                </el-button>
                <img
                        src="img/monitoring/icon-close.png"
                        style="vertical-align: middle;"
                        alt=""
                        @click='close'
                >
            </div>
        </div>
        <div class="content my-form">
            <div>
                <!-- <el-select class="datepicker" style="margin-top:0;" v-model="type" placeholder="请选择农机">
                  <el-option v-for="item in 4" :key="item" :label="item" :value="item"></el-option>
                </el-select> -->
                <el-input class="datepicker" readonly v-model="data.plateNumber" style="margin-top:0;"
                          placeholder="请输入农机"></el-input>
                <el-date-picker
                        class="datepicker"
                        v-model="queryStartTime"
                        type="datetime"
                        :clearable="false"
                        prefix-icon="el-icon-date"
                        placeholder="选择开始时间"
                        :default-time="'00:00:00'"
                        :picker-options="pickerOptions"
                        @focus="showPanel"
                        @change="startChange"
                ></el-date-picker>
                <el-date-picker
                        class="datepicker"
                        v-model="queryEndTime"
                        type="datetime"
                        :clearable="false"
                        prefix-icon="el-icon-date"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions"
                        :default-time="'23:59:59'"
                        @focus="showPanel"
                ></el-date-picker>
                <el-button class="primary-btn-plain" round @click="queryEvent">查询</el-button>
                <!--<a
                  class="explortTrack"
                  @click="clearEvent"
                >导出</a>-->
                <el-button class="primary-btn-plain" round @click="clearEvent">清除</el-button>
            </div>
            <div>


                <img
                        class="playIcon"
                        :src='playStatus === 0 ? "img/monitoring/Play.png" : playStatus === 1 ? "img/monitoring/Pause.png" : "img/monitoring/Stop.png"'
                        @click="play"
                />
                <!--<img
                  v-else
                  class="playIcon"
                  src="/img/map1/Stop.png"
                  title="结束"
                  @click="stop"
                />-->
                <!-- <i v-if="playStatus === 0" class="el-icon-video-play playIcon" @click="play"></i>
                <i v-else class="el-icon-circle-close playIcon" @click="stop" ></i> -->
                <div class="progress">
                    <playBar ref="playBar" @finish="finish"></playBar>
                </div>
                <el-select
                        class="customSelect"
                        v-model="playSpeed"
                        placeholder="请选择"
                        popper-class="customSelectPopper"
                        @change="updateSpeedEvent"
                >
                    <el-option
                            v-for="item in playSpeeds"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-checkbox
                        v-if="false"
                        class="customCheckbox"
                        v-model="TrackPointVisible"
                        @change="followTrackPoint"
                >跟踪轨迹点
                </el-checkbox>
                <el-checkbox
                        class="customCheckbox"
                        v-model="TrackPointHide"
                        @change="hideTrackPoint"
                >显示轨迹点
                </el-checkbox>
            </div>
        </div>

        <historyDialog ref="history" :machine="data" :time="historyParams"/>
    </div>
</template>
<script>
    import playBar from './playBar.vue';
    import historyDialog from './historyDialog'
    import {getTraceDateByMonth, queryLine} from '@/api/monitoring/index';
    import {dateFormat} from "@/util/util";
    import {queryLineByMachineId} from "../../../../api/monitoring";

    export default {
        props: ['data'],
        components: {
            playBar,
            historyDialog
        },
        data() {
            return {
                type: '', // 查询 类型
                queryStartTime: new Date(new Date().setHours(0, 0, 0, 0)), // 查询 开始时间
                queryEndTime: new Date(new Date().setHours(23, 59, 59, 999)), // 查询 结束时间
                TrackPointVisible: false, // 跟踪轨迹点
                TrackPointHide: false, // 隐藏轨迹点
                TrackDirectionVisible: false, // 显示轨迹方向
                playSpeeds: [{value: 1, label: '1X'}, {value: 2, label: '2X'}, {value: 4, label: '4X'}, {
                    value: 8,
                    label: '8X'
                }],
                threeDTime: '',
                playSpeed: 1, // 播放速度倍率
                playStatus: 0, // 0:'未启动' | 1:'开始' | 2：'结束' | 3: '继续'
                trackData: null, // 轨迹数据集
                pickerOptions: {
                    disabledDate: time => {
                        let maxDate = new Date();
                        // 点击此刻后的问题
                        return time.getTime() >= maxDate.getTime() + 10
                    },
                    cellClassName: () => {
                    }
                },
                nextdateDisabled: true,
                queryMonth: '', // 作为月份查询使用，处理panelCurrentData获取
                currentYear: '', // 当前年份
                currentMonth: '', // 当前月份
                historyParams: {}
            };
        },
        watch: {
            'data': {
                handler(newVal) {
                    this.queryLineByMachineId(newVal.machineId)
                    return newVal
                },
            },

            queryMonth: function (newV) {
                //console.log(newV, 'date')
                this.getDateMarker();
            }
        },
        created() {

        },
        methods: {
            // 获取时间标记
            async getDateMarker() {
                let params = {
                    machineId: this.data.machineId,
                    // machineId: '1000000003631',
                    month: this.queryMonth
                }
                let res = await getTraceDateByMonth(params);
                let {code, data} = res;
                if (code === 0 && data) {
                    let date = [];
                    for (var i = 0; i < data.length; i++) {
                        let item = new Date(data[i].date.split(',').join('/'));
                        date.push(item.getTime());
                    }
                    if (date.length > 0) {
                        this.pickerOptions.cellClassName = time => {
                            if (date.includes(time.getTime())) {
                                ////console.log("marktime",time.getTime())
                                return 'marktime'
                            }
                        }
                    }
                }
            },
            //获取有轨迹的最后一天时间
            async queryLineByMachineId(id) {
                let res = await queryLineByMachineId({
                    machineId: id
                });
                const {code, data, msg} = res;
                if (code === 200 && data) {
                    this.queryStartTime = new Date(data.beginTime)
                    this.queryEndTime = new Date(data.endTime)
                }
            },
            // 通过头部label获取当前年月，并监听变化
            handleQueryMonth() {
                this.$nextTick(() => {
                    let year = document.getElementsByClassName('el-date-picker__header-label')[0].innerHTML;
                    let month = document.getElementsByClassName('el-date-picker__header-label')[1].innerHTML;
                    this.queryMonth = year.split(' ')[0] + '-' + month.split(' ')[0];
                })
            },
            // 日期组件获取焦点事件
            showPanel() {
                // 打开调用一次
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
            dateToString(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, 0);
                return `${year}-${month}`;
            },
            // 选择开始时间改变事件
            startChange(val) {
                // 给结束时间默认值
                //console.log(val);
                // let year = new Date(val.getTime()).getFullYear();
                // let month = new Date(val.getTime()).getMonth() + 1;
                // let day = new Date(val.getTime()).getDate();
                // // this.queryEndTime = new Date(val.getTime() + 24 * 60 * 60 * 1000 - 1);
                // this.queryEndTime = new Date(year,month,day,23,59,59);
                this.queryEndTime = new Date(new Date(val.getTime()).setHours(23, 59, 59, 999));
            },
            // 查询轨迹
            async queryEvent() {
                if (!this.queryStartTime) {
                    this.$message.error('请选择开始时间');
                    return
                }
                if (!this.queryEndTime) {
                    this.$message.error('请选择结束时间')
                    return
                }
                // 先关闭上一次轨迹
                this.$emit('handleTrackEvents', {type: 'close', value: ''})
                this.$nextTick(() => {
                    this.$refs.playBar.percent = 0;
                    this.playStatus = 0;
                });
                let params = {
                    machineId: this.data.machineId,
                    beginTime: dateFormat(this.queryStartTime),//'2021-04-08 00:00:00',
                    endTime: dateFormat(this.queryEndTime),//'2021-04-08 23:59:59'
                }
                let res = await queryLine(params);
                let {code, data, msg} = res;
                if (code == 0 && data) {
                    if (data.traPoiArray) {
                        this.trackData = data;
                    } else {
                        this.$message.info('当前时间无轨迹数据');
                        return
                    }
                    data.showNode = this.TrackPointHide;
                    data.isFollowTrack = this.TrackPointVisible;
                    this.$emit('getData', data);
                } else {
                    this.$message.error(msg || '查询轨迹失败')
                }
            },
            // 清除
            clearEvent() {
                this.queryStartTime = '';
                this.queryEndTime = '';
                // 关闭轨迹
                this.$emit('handleTrackEvents', {type: 'close', value: ''})
            },
            // 跟踪轨迹点
            followTrackPoint(val) {
                // this.$emit('handleTrackEvents', {type: 'node', value: true})
                this.$emit('handleTrackEvents', {type: 'follow', value: val})
            },
            // 隐藏轨迹点
            hideTrackPoint(val) {
                this.$emit('handleTrackEvents', {type: 'node', value: val})
             /* if (val) {
                    // 选中表示不显示轨迹点
                    // this.TrackPointVisible = false;
                    this.$emit('handleTrackEvents', {type: 'node', value: false})
                } else {
                    // 不选代表默认
                    this.$emit('handleTrackEvents', {type: 'node', value: true})
                }*/
            },
            // 选择播放速率
            updateSpeedEvent(val) {
                this.$emit('handleTrackEvents', {type: 'speed', value: val});
            },
            // 关闭组件
            close() {
                // 关闭轨迹
                this.$emit('handleTrackEvents', {type: 'close', value: ''})
                this.$emit('close', 'isShowTrack', false)
            },
            // 播放完成
            finish() {
                this.playStatus = 2;
            },
            // 点击播放
            play() {
                if (!this.trackData) {
                    this.$message("当前时间无轨迹数据")
                    return
                }
                switch (this.playStatus) {
                    case 0:
                        this.$emit('handleTrackEvents', {type: 'play', value: true})
                        this.playStatus = 1; // 开始
                        break;
                    case 1:
                        this.$emit('handleTrackEvents', {type: 'pause', value: true})
                        this.playStatus = 0; // 未开始
                        break;
                    case 2:
                        this.$emit('handleTrackEvents', {type: 'finish', value: true})
                        this.playStatus = 0; // 未开始
                        break;
                    default:
                        break;
                }
            },
            showHistoryList() {
                this.historyParams = {
                    queryStartTime: dateFormat(this.queryStartTime),
                    queryEndTime: dateFormat(this.queryEndTime),
                }
                this.$refs.history.dialogVisible = true;
            }
        },
        beforeDestroy() {
            // 关闭轨迹
            this.$emit('handleTrackEvents', {type: 'close', value: ''})
        },
    };
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    .trackback {
        width: 771px;
        //max-width: 1400px;
        height: 160px;
        background-color: #121a2e;
        border: solid 1px #64bfff;

        .panel-header {
            height: 44px;
            line-height: 44px;

            .el-button--text {
                color: #00acff;
            }
        }

        .content {
            padding: 5px 36px 0 36px;

            > div {
                width: 100%;
                height: 40px;
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                > :not(:first-child) {
                    margin-left: 10px;
                }

                .el-button {
                    width: 68px;
                    height: 34px;
                    background: rgba(0, 208, 251, 0.05);
                    border: 1px solid rgba(0, 208, 251, 1);
                    font-size: 12px;
                    color: rgba(0, 208, 251, 1);
                    padding: 0;

                    & + .el-button {
                        margin-left: 10px;
                    }
                }

                .explortTrack {
                    background: rgba(0, 208, 251, 0.05);
                    border: 1px solid rgba(0, 208, 251, 1);
                    border-radius: 4px;
                    font-size: 12px;
                    color: rgba(0, 208, 251, 1);
                    line-height: 40px;
                    text-decoration: none;
                    padding: 0px 5px;
                }

                .el-checkbox {
                    line-height: 40px;
                }

                .el-select {
                    margin-top: 0;
                }

                .playIcon {
                    width: 22px;
                    height: 22px;
                    line-height: 40px;
                    color: rgba(0, 208, 251, 1);
                    font-size: 20px;
                    display: inline-block;
                    margin-top: 0;
                    cursor: pointer;
                }

                .progress {
                    width: 500px;
                    padding-top: 2px;
                }
            }
        }

        .my-form {
            /deep/ .el-icon-date:before {
                content: url('../../../../assets/images/icon_date2.png');
            }

            .el-icon-date {
                line-height: 38px;
            }
        }
    }
</style>

<style lang="less">
    @vw: 19.2vw;
    .datepicker {
        width: 180px !important;
        font-size: 14px;

        // .el-input__inner {
        //   background-color: transparent !important;
        //   border-radius: 4px;
        //   border: solid 1px #356e97;
        //   color: rgba(129, 160, 192, 1);
        //   height: 40px;
        //   line-height: 40px;
        //   padding: 0 0 0 30px !important;
        // }
        // input::-webkit-input-placeholder {
        //   color: #3a5571;
        // }

        // input::-moz-input-placeholder {
        //   color: #3a5571;
        // }

        // input::-ms-input-placeholder {
        //   color: #3a5571;
        // }

        // .el-input__prefix {
        //   left: 85%;
        // }

        // .el-input__suffix {
        //   right: 5px;
        // }
    }

    .marktime {
        background-color: rgba(0, 67, 124, .5);;
        color: #0d83df;
    }

    .customCheckbox {
        font-size: 14px;
        margin-right: 0;
        color: #aac2d6;

        .el-checkbox__inner {
            border: 1px solid rgba(129, 160, 192, 1);
            border-radius: 2px;
            width: 14px;
            height: 14px;
            background-color: transparent;
        }
    }

    .customSelect {
        width: 60px;
        height: 22px;
        background: rgba(0, 208, 251, 0.05);
        border: 1px solid #00acff;
        border-radius: 13px;

        .el-input {
            font-size: 13px;

            .el-input__inner {
                background-color: transparent;
                border-radius: 13px;
                border: 0;
                color: #00acff;
                height: 22px;
                line-height: 22px;
                padding: 0 12px;
                text-align: left;
            }

            .el-input__suffix {
                // display: none;
                right: 0 !important;

                .el-icon-arrow-up {
                    line-height: 10px;
                }

                .el-icon-arrow-up:before {
                    // margin-left: -10px;
                    content: url('../../../../assets/images/arrow.png');
                }
            }
        }
    }

    .customSelectPopper {
        border: 1px solid #00acff;
        border-radius: 4px;
        background-color: #000;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 5px 0;

        .el-scrollbar .el-scrollbar__wrap {
            overflow-x: scroll;
        }
    }
</style>

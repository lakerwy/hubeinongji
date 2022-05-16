<template>
    <div class="realtime-monitoring">
        <div class="realtime-monitoring-map" id="monitorting-map">
            <my-map ref="mapCom" style="width: 100%; height: 100%" @ready="initMap">
                <MyMapVectorJson
                        ref="trackLine_pre"
                        :dataSource="trackLine_pre"
                        :styles="trackStyle_pre"
                        :isFit="true"
                ></MyMapVectorJson>
                <MyMapVectorJson
                        ref="trackNode_pre"
                        :dataSource="trackNode_pre"
                        :styles="nodeStyle_pre"
                        :minZoom="13"
                ></MyMapVectorJson>
                <MyMapVectorJson
                        ref="trackNode_real"
                        :dataSource="trackNode_real"
                        :styles="nodeStyle_real"
                ></MyMapVectorJson>
                <MyMapVectorJson
                        ref="trackLine_real"
                        :dataSource="trackLine_real"
                        :styles="trackStyle_real"
                ></MyMapVectorJson>
            </my-map>
        </div>

        <pictureBox class="picture"/>
        <videoBox class="video"/>
        <div class="car">
            <img src="img/monitoring/icon-agricar-active.png" alt=""/>
            <span>{{ listData.plateNumber }} 实时监控</span>
            <i class="el-icon-close close" @click="backMonitoring"/>
        </div>
        <!--<div class="backBtn">
            <el-button type="primary" class="shadow-btn" round @click="backMonitoring">
                返回
            </el-button>
        </div>-->
        <workingAreaBox class="area" :data="totalArea" @showDetail="isDetail = true" @refreshArea="getDayArea"
                        v-loading="recalLoading"/>
        <workingBox class="working"/>
        <quanlityBox class="quanlity" :quanlityData="quanlityData"/>
        <areaDetailBox v-show="isDetail" :data="areaData" class="area-detail" @close="isDetail = false"/>
    </div>
</template>

<script>
    import MyMapVectorJson from "@map/components/my-map-vector/Json";
    import MyMap from "@map/components/my-map/Map";
    import pictureBox from "../components/pictureBox/index";
    import videoBox from "../components/videoBox/index";
    import workingBox from "../components/workingBox/index";
    import quanlityBox from "../components/quanlityBox/index";
    import workingAreaBox from '../components/workingArea/index';
    import areaDetailBox from '../components/areaDetail/index'
    import Track from "@map/js/animation/track";
    import {queryOnLine, getCurrendayArea, queryLine, todayAreaRecalculation} from "@/api/monitoring/index";
    import {dateFormat, getAngle} from "@/util/util";
    import {isArray} from "../../../util/util";

    export default {
        name: "agri-monitoring",
        components: {
            MyMap,
            MyMapVectorJson,
            pictureBox,
            videoBox,
            workingBox,
            quanlityBox,
            workingAreaBox,
            areaDetailBox
        },
        data() {
            return {
                trackLine_pre: {},
                trackLine_real: {},
                trackNode_pre: {},
                trackNode_real: {},
                listData: sessionStorage.getItem("currentCar")
                    ? JSON.parse(sessionStorage.getItem("currentCar"))
                    : {}, // 当前的农机数据
                trackStyle_pre: {
                    // 线
                    stroke: {
                        // color: "#2fc1b9",
                        color: "rgb(0, 0, 255)",
                        width: 2,
                    },
                    icon: {
                        src: "img/monitoring/working-car.png",
                    },
                    // 填充色
                    fill: {
                        // color: "#00ff00"
                        color: "rgb(0, 0, 255)",
                    },
                },
                trackStyle_real: {
                    // 线
                    stroke: {
                        // color: "#2fc1b9",
                        color: "rgb(19,160,30)",
                        width: 2,
                    },
                    icon: {
                        src: "img/monitoring/working-car.png",
                    },
                    // 填充色
                    fill: {
                        // color: "#00ff00"
                        color: "rgb(0, 0, 255)",
                    },
                },
                nodeStyle_pre: {
                    // 节点样式
                    circle: {
                        stroke: {
                            color: "#fff",
                            width: 1,
                        },
                        fill: {
                            color: "rgb(0, 0, 255)",
                        },
                        radius: 4,
                    },
                },
                nodeStyle_real: {
                    // 节点样式
                    circle: {
                        /* stroke: {
                             color: "#fff",
                             width: 1,
                         },*/
                        fill: {
                            color: "rgb(171,30,29)",
                        },
                        radius: 4,
                    },
                },
                currentTime: new Date(new Date("2021-07-16").setHours(8, 41, 54, 0)), // 当前时间 new Date()
                trackInterval: null, // 轨迹数据定时器
                recalAreaInterval: null,// 面积计算定时器
                currentPosition: null, // 当前设备的经纬度
                recalLoading: false,
                positions: [], // 记录当前设备已经过的点
                trackData: {},
                index: 1,
                testId: '1000000003631', // 测试农机id
                isDetail: false,
                areaData: [],
                lasteastTime: "",
                isHandleData: false,
                totalArea: 0,
                firstTime: true,
                quanlityData: [],
                trackLastPoint: {},
            };
        },
        created() {
            //10分钟 自动计算面积
            this.getDayArea();
            if (this.recalAreaInterval) {
                clearInterval(this.recalAreaInterval);
            }
            this.recalAreaInterval = setInterval(this.getDayArea, 1000 * 60 * 10);
        },
        methods: {
            // 查询轨迹
            async getTodayTrackLine() {
                let beginTime = new Date((new Date()).setHours(0, 0, 0, 0));
                let endTime = new Date((new Date()).getTime() - 5 * 60 * 1000);//5分钟之前
                let params = {
                    machineId: this.listData.machineId,
                    beginTime: dateFormat(beginTime),//'2021-04-08 00:00:00',
                    endTime: dateFormat(endTime),//'2021-04-08 23:59:59'
                }
                let res = await queryLine(params);
                let {code, data, msg} = res;
                if (code == 0 && data) {
                    if (data.traPoiArray && data.traPoiArray.length > 0) {
                        this.trackLastPoint = data.traPoiArray[data.traPoiArray.length - 1]
                        this.trackLine_pre = {
                            type: "1",
                            data: [
                                {
                                    type: "LineString",
                                    coordinates: data.trailLine.paths[0],
                                    id: "track-line-pre",
                                },
                            ],
                        }
                        let pointList = [];
                        let quanlityList = [];
                        for (var i = 0; i < data.traPoiArray.length; i++) {
                            let x = data.traPoiArray[i];
                            pointList.push({
                                type: "Point",
                                coordinates: [x.geometry.x, x.geometry.y],
                                id: `track_line_point_${i}`,
                                attributes: x.attributes,
                                pointType: "node"
                            })
                            quanlityList.push({
                                time: x.attributes.Time,
                                jobHeight: x.attributes.jobHight
                            })
                        }

                        this.trackNode_pre = {
                            type: "1",
                            data: pointList,
                            id: "track_line_point"
                        }

                        this.quanlityData = [...quanlityList];
                        //console.log("this.quanlityData", this.quanlityData)
                        //this.$refs.trackNode_pre.layer.addData(pointList);
                    } else {
                        this.$message.info('当前时间无轨迹数据');
                    }
                    this.$emit('getData', data);
                } else {
                    this.$message.error(msg || '查询轨迹失败')
                }
            },

            async initMap() {
                //加载当天的轨迹数据
                await this.getTodayTrackLine();

                if (this.trackInterval) {
                    clearInterval(this.trackInterval);
                }
                await this.getLastestPosition();
                this.trackInterval = setInterval(this.getLastestPosition, 5000);
            },
            // 加载轨迹数据
            async getLastestPosition() {
                if (this.isHandleData) return;
                let curDate = new Date()
                let params = {
                    machineId: this.listData.machineId,
                    time: this.lasteastTime || dateFormat(new Date(curDate.getTime() - 5 * 60 * 1000)),//5分钟之前，和轨迹对接上
                };
                let res = await queryOnLine(params);
                let {code, data, msg} = res;
                if (code === 0) {
                    let that = this;
                    if (data && data.length) {
                        this.isHandleData = true;
                        this.firstTime = false
                        for (var i = 0; i < data.length; i++) {
                            let item = data[i];
                            if (item.lon) {
                                //that.trackData = data;
                                // 第一步：获取当前设备的位置 request
                                // 第二步：赋值
                                that.currentPosition = [item.lon, item.lat] // 112.778175, 31.107292
                                if ((that.positions.length > 0 && !(item.lon == that.positions[that.positions.length - 1][0] && item.lat == that.positions[that.positions.length - 1][1])) ||
                                    that.positions.length == 0) {
                                    that.positions.push(that.currentPosition);
                                    that.quanlityData.push({
                                        time: item.time,
                                        jobHeight: item.jobHeight
                                    })
                                    that.lasteastTime = item.time
                                    that.handleData();
                                }
                            }
                            await this.sleep(1000);
                            if (i === (data.length - 1)) {
                                this.isHandleData = false;
                            }
                        }
                    } else {
                        //将当天轨迹的最后一个点作为实时监控点的时间起点
                        if (this.firstTime) {
                            if (this.trackLastPoint) {
                                this.currentPosition = [this.trackLastPoint.geometry.x, this.trackLastPoint.geometry.y]
                                this.positions.push(this.currentPosition);
                                this.lasteastTime = this.trackLastPoint.attributes.Time;
                                this.handleData();
                            }
                            /* let feature = this.$refs.trackLine_pre.source.getFeatureById("track-line-pre");
                             if (feature) {
                                 this.$refs.mapCom.map
                                     .getView()
                                     .fit(feature.getGeometry(), {maxZoom: 18});
                             } else {
                                 //可能由于异步，还没有加载好，就不能

                             }*/
                            this.firstTime = false
                        }

                    }
                }
            },
            async sleep(interval) {
                return new Promise(resolve => {
                    setTimeout(resolve, interval)
                })
            },

            // 处理数据 上图操作
            handleData() {
                // 第三步：上图
                // 点上图，一个是车子的图标点，一个是估计节点，轨迹借点是不会删除的，车子图标点随着位置变化更新位置
                if (this.currentPosition && this.$refs.trackNode_real) {
                    this.$refs.trackNode_real.addData({
                        type: "1",
                        data: [
                            {
                                type: "Point",
                                coordinates: this.currentPosition,
                            },
                        ],
                    });
                }
                let pointFeature = this.$refs.trackLine_real.source.getFeatureById("device-point");
                if (pointFeature) {
                    // 修改点
                    let coordinate = this.$refs.mapCom.map.inputCoordinate(this.currentPosition);
                    pointFeature.getGeometry().setCoordinates(coordinate);
                } else {
                    // 生成点
                    this.$refs.trackLine_real.addData({
                        type: "1",
                        data: [
                            {
                                type: "Point",
                                coordinates: this.currentPosition,
                                id: "device-point",
                            },
                        ],
                    });

                    this.$refs.mapCom.map.home({
                        center: this.currentPosition,
                        zoom: 18,
                    });
                }
                // 修改方向
                if (this.positions.length >= 2) {
                    var angle = getAngle(this.positions[this.positions.length - 1][0], this.positions[this.positions.length - 1][1],
                        this.positions[this.positions.length - 2][0], this.positions[this.positions.length - 2][1]);
                    ////console.log("angle", angle)
                    pointFeature = this.$refs.trackLine_real.source.getFeatureById("device-point");
                    if (pointFeature) {
                        let style = pointFeature.getStyle() || this.$refs.trackLine_real.layer.getStyle();
                        if (style) {
                            let image = style.getImage();
                            //要加上图片的原始方向，图片的原始方向向右,因此需要增加90度
                            image && image.setRotation((angle + 90) * Math.PI / 180);
                            //image && image.setRotation(angle);
                        }
                    }
                }
                // // 线上图
                if (this.positions.length > 2) {
                    // 追加坐标
                    let feature = this.$refs.trackLine_real.source.getFeatureById("track-line");
                    if (feature) {
                        let lastCoordiante = this.positions[this.positions.length - 1];
                        let coordinate = this.$refs.mapCom.map.inputCoordinate(lastCoordiante);
                        feature.getGeometry().appendCoordinate(coordinate);
                    }
                } else if ((this.positions.length == 2)) {
                    // 生成线
                    this.$refs.trackLine_real.addData({
                        type: "1",
                        data: [
                            {
                                type: "LineString",
                                coordinates: this.positions,
                                id: "track-line",
                            },
                        ],
                    });
                }
            }
            ,
            // initTrack() {
            //
            //   if (feature) {
            //     this.$refs.mapCom.map
            //       .getView()
            //       .fit(feature.getGeometry(), { maxZoom: 18 });
            //   }
            //   if (!feature) {
            //     return;
            //   }

            //   this.track = new Track({
            //     map: this.$refs.mapCom.map,
            //     feature: feature,
            //     // showDir: true,
            //     moveStyle: {
            //       icon: {
            //         src: "img/monitoring/working-car.png",
            //       },
            //     },
            //     nodeStyle: {
            //       // 节点样式
            //       circle: {
            //         stroke: {
            //           color: "#fff",
            //           width: 2,
            //         },
            //         fill: {
            //           color: "rgb(0, 0, 255)",
            //         },
            //         radius: 4,
            //       },
            //     },
            //     callback: () => {},
            //   });
            //   this.track.setShowNode(true); // 默认显示轨迹
            //   // this.track.setIsTrack(true);
            //   this.track.start();
            // },
            // 当日作业面积
            async getDayArea() {
                if (this.recalLoading) return
                this.recalLoading = true;
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let params = {
                    machineId: this.listData.machineId,
                    time: `${year}-${month}-${day}`
                }
                let res = await todayAreaRecalculation(params);
                this.recalLoading = false;
                const {code, data} = res;
                if (code === 0) {
                    let result = JSON.parse(data);
                    if (result && isArray(result)) {
                        //console.log("getCurrendayArea", result)
                        this.areaData = result;
                        let total = 0;
                        result.forEach(item => {
                            total += item.area;
                        })
                        this.totalArea = total.toFixed(2)//保留两位小数
                    }
                    //this.areaData = data;
                }

            }
            ,
            //样式
            /*            styles(feature, resolution) {
                            if (feature) {
                                //console.log(feature)
                                if (feature.id_ == 'device-point' || feature.id_ == 'track-line') {
                                    return this.trackStyle
                                } else if (feature.id_.indexOf('node-point') >= 0) {
                                    return this.nodeStyle
                                }
                            }

                        },*/
            //返回农机监控
            backMonitoring() {
                //this.$router.push({path: '/agri-monitoring/history-trajectory/index'})
                // window.history.back();

                this.$emit("showAgriMonitoring","isShowAgriMonitoring",false);
            },
        },
        beforeDestroy() {
            if (this.trackInterval) {
                clearInterval(this.trackInterval);
            }
            if (this.recalAreaInterval) {
                clearInterval(this.recalAreaInterval);
            }
        }
    }
    ;
</script>

<style lang="less" scoped>
    .realtime-monitoring {
        // position: relative;
        &-map {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .picture {
            position: absolute;
            left: 0;
            top: 10px;
        }

        .car {
            // width: 304px;
            padding: 0 10px 0 10px;
            height: 60px;
            line-height: 60px;
            background-color: rgba(12, 28, 46, 0.9);
            border-radius: 4px;
            position: absolute;
            top: 10px;
            color: #fff;
            font-size: 20px;
            // left: calc(50% - 152px);
            left: 42%;
            text-align: center;

            img {
                vertical-align: middle;
                margin-right: 18px;
            }
        }

        .backBtn {
            position: absolute;
            left: 420px;
            top: 10px;
            height: 32px;
        }

        .close {
            margin-left: 10px;
            color: #ecb214;
            cursor: pointer;
        }

        .area {
            position: absolute;
            top: 10px;
            right: 0;
            height: 11.2%;
        }

        .working {
            position: absolute;
            top: 13.1%;
            right: 0;
        }

        .video {
            position: absolute;
            left: 0;
            top: 49%;
        }

        .quanlity {
            position: absolute;
            top: 61.9%;
            right: 0;
        }

        .area-detail {
            position: absolute;
            left: calc(50% - 331px);
            bottom: 30px;
        }

        /deep/ .el-card__header {
            padding: 0 20px;
            height: 48px;
            line-height: 48px;
            border-bottom: 1px solid #0d2346;
        }

        /deep/ .el-card {
            border: 0;
        }
    }
</style>
<template>
    <div class="map-view">
        <div v-show="!repeatAuditShow" style="width: 100%; height: 100%">
            <div class="working-map">
                <my-map ref="mapCom" style="width: 100%; height: 100%" @click="mapClick">
                    <!-- 作业面积图层 -->
                    <MyMapVectorJson
                            ref="area"
                            :dataSource="areaDataSource"
                            :isFit="true"
                            :visible="areaVisible"
                            :fitOption="{padding: [200,400,200,400],maxZoom:18,duration:2000}"
                            :styles="areaStyle"
                            @click="showDetail"></MyMapVectorJson>
                    <!-- 作业轨迹图层 -->
                    <MyMapVectorJson
                            ref="track"
                            :dataSource="trackdataSource"
                            :isFit="false"
                            :fitOption="{padding: [200,400,200,400],maxZoom:18,duration:2000}"
                            :visible="trackVisible"
                            :styles="trailStyle2"></MyMapVectorJson>
                    <!-- 深度点图层 -->
                    <MyMapVectorJson
                            ref="deepPoint"
                            :dataSource="pointDataSource"
                            :isFit="false"
                            :visible="deepVisible"
                            :fitOption="{padding: [200,400,200,400],maxZoom:18,duration:2000}"
                            :styles="initPointStyle"></MyMapVectorJson>

                    <!-- 作业照片图层 -->
                    <MyMapVectorJson
                            ref="photo"
                            :dataSource="photoDataSource"
                            :isFit="false"
                            :visible="photoVisible"
                            :fitOption="{padding: [200,400,200,400],maxZoom:18,duration:2000}"
                            :styles="photoStyle"
                            @click="showPhoto">
                    </MyMapVectorJson>
                </my-map>
            </div>
            <tools class="tools" @handleToolClick="handleToolClick"/>
            <queryBox ref="query" class="query"
                      :query="query"
                      :pageP="page"
                      :summaryData="summaryData2"
                      :listData="listData"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                      @getCurrent="getCurrent"/>
            <detailBox
                    v-if="isShowDetail"
                    class="detail"
                    :data="detailData"
                    @close="handleBoxStatus"
                    @refreshData="refreshData"
                    @handleClick="handleDetailBoxClick"
            />
            <div class="typeBox">
                <el-checkbox-group v-model="type">
                    <el-checkbox
                            v-for="item in types"
                            :label="item.value"
                            :key="item.value"
                            @change="handleChange(item)"
                    >{{ item.label }}
                    </el-checkbox
                    >
                </el-checkbox-group>
                <div class="typeBox-type">
                    <span><img src="img/working/success-point.png" alt=""/>已达标</span>
                    <span><img src="img/working/falid-point.png" alt=""/>未达标</span>
                    <span><img src="img/working/default-point.png" alt=""/>转移中</span>
                </div>
            </div>
            <picDialog ref="picDialog" :url="picUrl" :urlList="urlList"></picDialog>
            <updateAreaDialog
                    ref="areaDialog"
                    :data="detailData"
                    @refreshData="refreshData"/>
            <reportDialog :type="reportType" ref="report" :machineIds="recalMachineIds"/>
        </div>
        <div v-if="repeatAuditShow" style="width: 100%; height: 100%">
            <repeatAudit :repeatData="detailData" @close="closeRepeatAudit"></repeatAudit>
        </div>
        <!--<Footer class="map-footer" />-->
    </div>

</template>

<script>
    import MyMapVectorJson from "@map/components/my-map-vector/Json";
    import MyMap from "@map/components/my-map/Map";
    import Footer from "@/components/footer/index";
    import picDialog from '../dialog/picDialog'
    import tools from "_com/toolsBox/index";
    import queryBox from "../queryBox/index";
    import detailBox from "../detailBox/index";
    import updateAreaDialog from "../dialog/updateAreaDialog"
    import reportDialog from "../dialog/reportDialog";
    import repeatAudit from "../../audit-repeat-working/index";

    import {getLayerInfo, propertiesQuery} from "@map/js/query/query";
    import {zoomIn, zoomOut, toggleFullScreen} from "@map/js/tool/baseTool.js";
    import measureEvent, {clearMeasure} from "@map/js/tool/measure.js";
    import {
        queryTrailLine,
        queryTerminalTrailInfo,
        selectAreaCheckByMap,
        queryDepthCriterion
    } from '@/api/working/index'
    import {queryLine} from "@/api/monitoring/index";


    export default {
        name: "mapView",
        components: {
            MyMapVectorJson,
            MyMap,
            Footer,
            tools,
            queryBox,
            detailBox,
            picDialog,
            updateAreaDialog,
            reportDialog,
            repeatAudit,
        },
        props: {
            query: {
                type: Object,
                default: () => {
                },
            },
            current: {
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
            current: function (newV) {
                if (newV) {
                    //this.$refs.query.initData();
                    this.$refs.query.handleItemClick(newV.row, newV.index);
                }
            },
            listData: {
                handler: function (newV) {
                    this.clearMap()
                    this.isShowDetail = false;
                    this.detailIndex = -1
                    this.tableData = newV
                },
                // immediate: true,
                deep: true,
            },
            summaryData: {
                handler: function (newV) {
                    this.summaryData2 = newV
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
                repeatAuditShow: false,
                urlList: [],
                reportType: 0,
                recalMachineIds: [],
                tableData: [],//查询的列表
                summaryData2: {},//查询的同合计数据
                measureList: [], // 保存画线等操作
                types: [
                    {label: "轨迹", value: 1},
                    {label: "地块", value: 2},
                    {label: "深度", value: 3},
                    {label: "照片", value: 4},
                ],
                type: [],
                isShowDetail: false, // 是否显示详情框
                detailData: {}, // 详细数据
                detailIndex: -1,
                trackdataSource: {},
                pointDataSource: {},
                areaDataSource: {},
                photoDataSource: {},  //所有图片
                trackVisible: true,
                deepVisible: true,
                photoVisible: true,
                areaVisible: true,
                data: {},
                areaData: '', // 地块数据
                trailStyle1: { // 轨迹样式
                    stroke: {
                        color: '#00ffff',
                        width: 2
                    },
                },
                areaStyle: { // 地块样式
                    fill: {
                        color: 'rgba(0,0,238,.5)'
                    },
                    stroke: {
                        color: 'rgb(0,255,255)',
                        width: 4
                    },
                },
                trailStyle2: {
                    // 线
                    stroke: {
                        // color: "#2fc1b9",
                        color: "rgb(0,0,238)",
                        width: 2,
                    },
                    /* icon: {
                         src: "img/monitoring/working-car.png",
                     },*/
                    // 填充色
                    fill: {
                        // color: "#00ff00"
                        color: "rgb(0, 0, 255)",
                    },
                    /*circle: {
                        /!* stroke: {
                             color: "#fff",
                             width: 1,
                         },*!/
                        fill: {
                            color: "rgb(171,30,29)",
                        },
                        radius: 4,
                    },*/
                },
                photoStyle: { // 照片图层样式
                    icon: {
                        src: 'img/working/BluePin1LargeB.png',
                        scale: 0.7
                    }
                },
                picUrl: '', // 当前点击的图片地址
                picDate: new Date('2017-10-16 12:00:00'), // 照片时间处理中间值，在此时间之前为blob数据，之后为地址
                initDeep: 0, // 深度标准数据
                page: {
                    currentPage: 1,
                    // pageSize: 12,
                    // pageSizes: [12, 20, 30, 40, 50, 100],
                    total: 0,
                    // pbw修改，页面显示条数
                    pageSize: 10,
                },
            };
        },
        created() {
        },
        methods: {
            handleCurrentChange(val) {
                this.$emit("currentChange", val);
            },
            handleSizeChange(val) {
                this.$emit("sizeChange", val);
            },

            mapClick(val, f) {
                //console.log(val, f, 'click')
            },
            async initMap() {
                // let layerParam = window.global.xzqh;
                // let layerIndex = [window.global.xzqh.sheng, window.global.xzqh.shi] // 省
                // // 获取地图的坐标系
                // let projection = this.$refs.mapCom.map.getView().getProjection();
                // let info = await getLayerInfo(layerParam);
                // if (info) {
                //   layerIndex.map(async item => {
                //     let res = await propertiesQuery({
                //       layer: layerParam,
                //       layerId: item,
                //       layerProjection: info.projection,
                //       params: { where:[{key:"adcode", operator: "like", value: "'42%'"}] },
                //       featureProjection: projection
                //     });
                //     if (res) {
                //       this.$refs.geo.source.addFeatures(res.features);
                //     }
                //   })
                // }
            },
            handleToolClick(e) {
                switch (e.event) {
                    case "area":
                        this.measureList.push(
                            new measureEvent({map: this.$refs.mapCom.map, type: "Polygon"})
                        );
                        break;
                    case "distance":
                        this.measureList.push(
                            new measureEvent({map: this.$refs.mapCom.map, type: "LineString"})
                        );
                        break;
                    case "clear":
                        this.measureList.forEach((x) => {
                            clearMeasure(x);
                        });
                        this.measureList = [];
                        break;
                    case "zoomIn":
                        zoomIn(this.$refs.mapCom.map);
                        break;
                    case "zoomOut":
                        zoomOut(this.$refs.mapCom.map);
                        break;
                    case "choose":
                        // this.$refs.mapCom.map.dragging = true;
                        break;
                    case "change":
                        break;
                    case "fullScreen":
                        toggleFullScreen(document.getElementById("working-map"));
                        break;
                    default:
                        break;
                }
            },
            // 控制页面组件的显示与隐藏
            handleBoxStatus(box, value) {
                this[box] = value;
            },
            async clearMap() {
                //清空数据
                this.trackdataSource = {};
                this.areaDataSource = {};
                this.photoDataSource = {};
                this.pointDataSource = {};
            },
            // 获取当前选择的作业
            async getCurrent(val, index) {
                this.clearMap();
                //if (this.detailData.machineId === val.machineId) return
                this.detailData = val;
                this.detailIndex = index;
                this.isShowDetail = true;
                setTimeout(async () => {
                    this.type = [1, 2]
                    this.initWorkingTrail(true);
                    this.initArea(true);
                    //this.initPhoto(true);图片请求和地块请求在一个请求里面

                    // 作业类型为深松 深翻时请求深度标准
                    if (this.detailData.jobType == '4' || this.detailData.jobType == '9') {
                        this.type = [1, 2, 3]
                        await this.getDepthCriterion(true);
                        this.initDepthTrail(true)
                    }

                }, 500)
            },

            // 当前作业轨迹上图
            async initWorkingTrail(visible) {
                this.trackVisible = visible
                let pointFeature = this.$refs.track.source.getFeatureById("track-line");
                if (pointFeature || !visible) {
                    //如果已经加载，控制显示隐藏
                    return
                }
                this.getTrackLineAndPoint()
            },
            async getTrackLineAndPoint() {
                let beginTime = new Date((new Date()).setHours(0, 0, 0, 0));
                let endTime = new Date()
                let params = {
                    beginTime: this.detailData.jobStartTime,
                    endTime: this.detailData.jobEndTime,
                    machineId: this.detailData.machineId
                }
                let res = await queryLine(params);
                let {code, data, msg} = res;
                if (code == 0 && data) {
                    if (data.trailLine && data.trailLine.paths && data.trailLine.paths.length > 0) {
                        let trackLine = {
                            type: "1",
                            data: [
                                {
                                    type: "LineString",
                                    coordinates: data.trailLine.paths[0],
                                    id: "track-line",
                                },
                            ],
                        }
                        this.$refs.track.addData(trackLine);
                    } else {
                        this.$message.info('没有查询到该作业地块的作业轨迹');
                    }
                    if (data.traPoiArray && data.traPoiArray.length) {
                        let pointList = []
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
                        }
                        let trackPoints = {
                            type: "1",
                            data: pointList,
                            id: "track_line_point"
                        }
                        this.$refs.track.addData(trackPoints);
                    }

                } else {
                    this.$message.error(msg || '查询轨迹失败')
                }
            },
            async getTrackLine() {
                let params = {
                    begintime: this.detailData.jobStartTime,
                    endtime: this.detailData.jobEndTime,
                    machineId: this.detailData.machineId
                }
                let res = await queryTrailLine(params);
                const {code, data, msg} = res;
                if (code === 0) {
                    if (data.trailLine) {
                        this.trackdataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(data.trailLine).paths,
                                    id: "track-line"
                                },
                            ]
                        }
                    } else {
                        this.$message.warning('没有查询到该作业地块的作业轨迹')
                    }
                } else {
                    this.$message.error(msg || '作业轨迹查询失败')
                }
            },
            // 作业地块
            async initArea(visible) {
                this.areaVisible = visible
                let feature = this.$refs.area.source.getFeatureById("area-polygon");
                if (feature || !visible) {
                    //如果已经加载，控制显示隐藏
                    return
                }

                let params = {
                    areaRowId: this.detailData.rowId
                }
                let res = await selectAreaCheckByMap(params);
                const {code, data} = res;
                if (code == 0) {
                    this.areaData = data;
                    if (data && data.geometryStr) {
                        this.areaDataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(data.geometryStr).rings,
                                    id: "area-polygon"
                                },
                            ]
                        }
                    }
                    //this.initPhoto(visible)
                }
            },
            // 获取深度点标准
            async getDepthCriterion() {
                let params = {
                    machineType: this.detailData.machineType,
                    toolType: this.detailData.toolType,
                    belongGroupId: this.detailData.belongGroupId,
                    areaSTime: this.detailData.jobStartTimeS
                };
                let res = await queryDepthCriterion(params);
                const {code, data, msg} = res;
                if (!code) {
                    this.initDeep = data.init_deep;
                }
            }
            ,
            // 作业深度点
            async initDepthTrail(visible) {
                this.deepVisible = visible
                let pointFeature = this.$refs.deepPoint.source.getFeatureById("deep_point_1");
                if (pointFeature || !visible) {
                    //如果已经加载，控制显示隐藏
                    return
                }
                let params = {
                    begintime: this.detailData.jobStartTime,
                    endtime: this.detailData.jobEndTime,
                    geometryStr: this.areaData.boundary_warning,
                    machineId: this.detailData.machineId
                }
                let res = await queryTerminalTrailInfo(params);
                const {code, data, msg} = res;
                //console.log("queryTerminalTrailInfo", res)

                let dataSource = [];
                if (code === 0 && data) {
                    for (let i = 0; i < data.length; i++) {
                        dataSource.push({
                            geometryType: "Point",
                            coordinates: [data[i].geometry.x, data[i].geometry.y],
                            jobHight: data[i].attributes.jobHight,
                            attributes: data[i].attributes,
                            id: `deep_point_${i + 1}`,
                        })
                    }
                    this.pointDataSource = {
                        type: "1", // list
                        geometryKey: "geometryType",
                        data: dataSource
                    }
                }
            }
            ,
            // 照片
            initPhoto(visible) {
                this.photoVisible = visible
                let feature = this.$refs.photo.source.getFeatureById("job_photo_1");
                if (feature || !visible) {
                    //如果已经加载，控制显示隐藏
                    return
                }

                // let a = '[{"geometry":{"x":114.083396,"y":30.213765,"spatialReference":{"wkid":4326}},"attributes":{"photoTableId":"1000000014973","XCoord":114.083396,"time":"2021-12-12 18:09:10","mediafullpath":"http:\/\/223.75.53.178:8817\/\/machinephotos\/ComServerHB\/202112\/1000000014973\/1000000014973.1639303769409.17598.jpg","YCoord":30.213765}},{"geometry":{"x":114.084025,"y":30.213533,"spatialReference":{"wkid":4326}},"attributes":{"photoTableId":"1000000014973","XCoord":114.084025,"time":"2021-12-12 17:39:04","mediafullpath":"http:\/\/223.75.53.178:8817\/\/machinephotos\/ComServerHB\/202112\/1000000014973\/1000000014973.1639301962140.16785.jpg","YCoord":30.213533}},{"geometry":{"x":114.083656,"y":30.213043,"spatialReference":{"wkid":4326}},"attributes":{"photoTableId":"1000000014973","XCoord":114.083656,"time":"2021-12-12 17:08:58","mediafullpath":"http:\/\/223.75.53.178:8817\/\/machinephotos\/ComServerHB\/202112\/1000000014973\/1000000014973.1639300157726.18686.jpg","YCoord":30.213043}},{"geometry":{"x":114.083508,"y":30.213191,"spatialReference":{"wkid":4326}},"attributes":{"photoTableId":"1000000014973","XCoord":114.083508,"time":"2021-12-12 16:38:49","mediafullpath":"http:\/\/223.75.53.178:8817\/\/machinephotos\/ComServerHB\/202112\/1000000014973\/1000000014973.1639298347635.16109.jpg","YCoord":30.213191}},{"geometry":{"x":114.084619,"y":30.212848,"spatialReference":{"wkid":4326}},"attributes":{"photoTableId":"1000000014973","XCoord":114.084619,"time":"2021-12-12 16:08:43","mediafullpath":"http:\/\/223.75.53.178:8817\/\/machinephotos\/ComServerHB\/202112\/1000000014973\/1000000014973.1639296541373.15923.jpg","YCoord":30.212848}}]'
                // let photoData = JSON.parse(a);

                if (this.areaData.photoPositionJSONArray && this.areaData.photoPositionJSONArray.length > 0) {
                    let photoData = JSON.parse(this.areaData.photoPositionJSONArray[0]);
                    //console.log(photoData);
                    let dataSource = [];
                    if (photoData && photoData.length > 0) {
                        for (let i = 0; i < photoData.length; i++) {
                            dataSource.push({
                                geometryType: "Point",
                                coordinates: [photoData[i].geometry.x, photoData[i].geometry.y],
                                attributes: photoData[i].attributes,
                                id: `job_photo_${i + 1}`
                            })
                        }
                        this.photoDataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: dataSource
                        }
                        this.photoVisible = visible
                    }

                    for (let item of this.photoDataSource.data) {
                        this.urlList.push(item.attributes.mediafullpath);
                    }
                    //console.log(this.urlList);
                } else {
                    this.$message.info('该作业地块未上传照片')
                }
            },
            // 深度点的样式
            initPointStyle(feature) {
                let styles = [];
                let jobHight = feature.get("jobHight")
                if (jobHight) {
                    let pointStyle = {}
                    if (jobHight >= this.initDeep && jobHight < 999) {
                        pointStyle = {
                            circle: {
                                stroke: {
                                    color: "#ffffff",
                                    width: 1.5,
                                },
                                fill: {
                                    color: "#00ff00"
                                },
                                radius: 4,
                            },
                        }
                    } else if (jobHight < this.initDeep) {
                        pointStyle = {
                            circle: {
                                stroke: {
                                    color: "#e30000",
                                    width: 1,
                                },
                                fill: {
                                    color: "#e30000"
                                },
                                radius: 4,
                            },
                        }
                    } else {
                        pointStyle = {
                            circle: {
                                stroke: {
                                    color: "#ffffff",
                                    width: 1.5,
                                },
                                fill: {
                                    color: "#949494"
                                },
                                radius: 4,
                            },
                        }
                    }
                    styles.push(pointStyle)
                }
                return styles;
            }
            ,
            // 图片点 点击展示图片
            showPhoto(e, feature) {
                let data = feature.values_;
                //console.log(data.attributes)
                let time = new Date(data.attributes.time);
                if (time <= this.picDate) {
                    // 在时间点之前为blob数据
                    this.picUrl = `data:image/jpeg;base64,${data.attributes.mediafullpath}`
                } else {
                    this.picUrl = data.attributes.mediafullpath;
                }
                this.$refs.picDialog.dialogVisible = true;
            },
            showDetail(e, feature) {
                this.isShowDetail = true;
            },
            // checkbox选择项
            handleChange(val) {
                // //console.log(this.type.includes(val.value), val, 'change')
                let checked = this.type.includes(val.value);

                switch (val.value) {
                    case 1:
                        //轨迹
                        this.initWorkingTrail(checked);
                        break;
                    case 2:
                        // 地块
                        this.initArea(checked);
                        break;
                    case 3:
                        // 深度
                        this.initDepthTrail(checked);
                        break;
                    case 4:
                        // 照片
                        this.initPhoto(checked);
                        break;
                    default:
                        break;
                }
                /*if (checked) {

                } else {
                    switch (val.value) {
                        case 1:
                            this.dataSource = {};
                            break;
                        case 2:
                            // 地块
                            this.areaDataSource = {};
                            break;
                        case 3:
                            // 深度 清除，展示轨迹
                            this.pointDataSource = {};
                            break;
                        default:
                            break;
                    }
                }*/
            }
            ,
            // 详情框点击事件
            handleDetailBoxClick(type) {
                switch (type) {
                    case 'audit':
                        this.$emit("audit", this.detailData)
                        break;
                    case 'update':
                        this.$emit("update", this.detailData)
                        break;
                    case 'recal':
                        this.report(0)
                        break;
                    case 'repeatAudit':
                        this.repeatAuditShow = true

                        break;
                    default:
                        break;
                }
            }
            ,
            // 更新数据
            refreshData(type) {
                if (type == 'del') {
                    this.isShowDetail = false;
                }
                this.$emit("refreshData")
            },
            // 面积重算
            report(type) {
                this.reportType = type;
                this.recalMachineIds = [this.detailData.machineId] || [];
                //let names = [this.detailData.plateNumber] || [];
                // 根据情况选择赋值
                this.$refs.report.form = {
                    apperType: "农机上报",
                    plateNumber: this.detailData.plateNumber,
                    appearBeginTime:this.detailData.jobStartTime,
                    appearEndTime:this.detailData.jobEndTime,
                };
                this.$refs.report.dialogVisible = true;

                /* if (this.$refs.report.dialogVisible) {
                     if (type == "0") {
                         this.decreseTime("current", "flag", "decreseInterval");
                     } else {
                         this.decreseTime("current2", "flag2", "decreseInterval2");
                     }
                 }*/
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
            closeRepeatAudit(){
                this.repeatAuditShow=false
            }
        },
    }
    ;
</script>

<style lang="less" scoped>
    .map-view {
        width: 100%;
        height: 100%;
        position: relative;

        .working-map {
            width: 100%;
            height: 100%;
        }

        .tools {
            position: absolute;
            top: 26px;
            right: 17px;
        }

        .query {
            position: absolute;
            top: 10px;
            left: 0;
        }

        .detail {
            position: absolute;
            top: 80px;
            right: 27px;
        }

        .typeBox {
            position: absolute;
            bottom: 26px;
            left: 437px;
            background: @base-darkBlue;
            // width: 280px;
            // height: 72px;
            padding: 18px 16px 14px 16px;
            border-radius: 4px;

            &-type {
                margin-top: 12px;
                font-size: 14px;
                color: #4f7ea5;

                img {
                    margin-right: 9px;
                    vertical-align: middle;
                }

                span {
                    margin-right: 8px;
                }
            }

            /deep/ .el-checkbox__label {
                color: @base-fontColor;
                padding-left: 7px;
            }

            /deep/ .el-checkbox__inner {
                background: transparent;
            }

            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
            .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                background: #1298f8;
            }

            .el-checkbox {
                margin-right: 12px;
            }
        }
    }
</style>
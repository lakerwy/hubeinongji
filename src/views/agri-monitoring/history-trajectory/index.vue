<template>
    <div class="agri-monitoring">
        <div v-show="!isShowAgriMonitoring" class="agri-monitoring-map" id="monitorting-map" v-loading="loading"
             element-loading-background="rgba(3,7,11,.7)">
            <my-map ref="mapCom" style="width:100%;height:100%" @ready="initMap" @click="handleMapClick">
                <!-- 地图高亮部分 -->
                <MyMapVectorJson
                        ref="province"
                        :styles="provinceStyles"
                ></MyMapVectorJson>

                <!-- 农机点击 -->
                <MyMapVectorCluster
                        ref="geo"
                        name="mechine"
                        :dataSource="dataSource"
                        :styles="initMachineStyle"
                        :clusterStyles="initMechineClusterStyle"
                        :isFit="false"
                        :fitOption="{padding: [100,100,100,100]}"
                        :scales="[50000, 600000, 1200000]"
                        :distances="[80, 140, 300]"
                        :distance="40"
                        :isCluster="true"
                        @click="handleMachineClick"></MyMapVectorCluster>

                <!-- 轨迹的线 -->
                <MyMapVectorJson
                        ref="track"
                        :dataSource="lineDataSource"
                        :styles="trackStyle"
                ></MyMapVectorJson>

                <!-- 轨迹的点 -->
                <MyMapVectorJson
                        ref="trackPoint"
                        :dataSource="pointDataSource"
                        :styles="trackStyle_node"
                        :visible="trackStyle_node_visible"
                        @click="handleNodeClick"
                ></MyMapVectorJson>
                <MyMapPopup ref="popupNode">
                    <PopupInfo
                            v-if="dataInfo"
                            :data="dataInfo"
                            :selectId="dataInfo ? dataInfo.id : null"
                            @close="clearSelectFeature"
                    ></PopupInfo>
                </MyMapPopup>

                <MyMapPopup ref="popup">
                    <machineDetail v-if="machineDetailData" :data="machineDetailData" @close="closePopup"/>
                </MyMapPopup>
            </my-map>
        </div>

        <staticsBox v-show="!isShowTrack && !isShowAgriMonitoring" ref="view" class="statics" @init="initMachines"
                    @changeLoading="changeLoading"/>

        <searchBox
                v-show="showSearch()"
                class="search"
                @getData="handleMapData"
                @select="handleSelect"
                @getOverview="getOverview"
                @changeLoading="changeLoading"
                :refreshFlag="showSearch()"/>


        <toolsBox v-show="!isShowAgriMonitoring" class="tools" @handleToolClick="handleToolClick"/>

        <detailBox
                v-show="!isShowTrack"
                v-if="isShowDetail"
                class="detail"
                :data="detailData"
                @Emitdata="getdetailData"
                @showTrack="handleBoxStatus"
                @showAgriMonitoring="AgriMonitoringStatus"
                @close="handleBoxStatus"/>

        <trackplayback
                ref="trackBox"
                v-if="isShowTrack"
                class="track"
                :data="pbwdetailData"
                @getData="getTrackLineData"
                @handleTrackEvents="handleTrackEvents"
                @close="handleBoxStatus"/>

        <Agri-Monitoring-Box
                class="pbwagribox"
                v-if="isShowAgriMonitoring"
                @showAgriMonitoring="AgriMonitoringStatus"
        />

    </div>
</template>

<script>
    import MyMapVectorJson from "@map/components/my-map-vector/Json";
    import MyMapVectorCluster from "@map/components/my-map-vector/Cluster";
    import MyMap from "@map/components/my-map/Map";
    import MyMapPopup from "@map/components/my-map-overlay/Popup";
    import PopupInfo from "../../agri-data/onemap/component/PopupInfo";
    import searchBox from '../components/searchBox/index'
    import staticsBox from '../components/staticsBox/index'
    import detailBox from '../components/detailBox/index'
    import trackplayback from '../components/trackplayback/index'
    import toolsBox from '_com/toolsBox/index'
    import Track from "@map/js/animation/track";
    import machineDetail from '../components/machineDetail/index'
    import {zoomIn, zoomOut, toggleFullScreen} from "@map/js/tool/baseTool.js";
    import {getLayerInfo, propertiesQuery} from "@map/js/query/query";
    import measureEvent, {clearMeasure} from "@map/js/tool/measure.js";
    import {viewDmOnMap} from '@/util/mapHanlder.js'
    import {MoreClusterStyles, oneStyles} from "../../../util/mapHanlder";
    import {boundingExtent} from "ol/extent";

    // pbw修改
    import AgriMonitoringBox from "../realtime-monitoring/index"

    export default {
        name: 'agri-monitoring',
        components: {
            MyMap,
            MyMapVectorJson,
            MyMapVectorCluster,
            MyMapPopup,
            searchBox,
            staticsBox,
            detailBox,
            trackplayback,
            machineDetail,
            toolsBox,
            AgriMonitoringBox,
            PopupInfo
        },

        data() {
            return {
                refreshFlag: true,//是否实时刷新
                isShowAgriMonitoring: false, //是否展示实时监控
                loading: false,
                isShowDetail: false, // 是否展示详情框
                isShowTrack: false, // 是否显示轨迹框
                dataSource: {}, // 农机分布数据
                hoverStyles: {
                    icon: {
                        src: 'img/monitoring/ico-choose.png'
                    }
                },
                provinceStyles: {
                    stroke: {
                        color: "rgba(55, 232, 205, 1)",
                        width: 3,
                    },
                    fill: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                selectFeature: null,
                queryData: {},
                detailData: {}, // 农机详细数据
                pbwdetailData: {},
                lineDataSource: {}, // 轨迹线数据
                pointDataSource: {},// 轨迹点数据
                trackStyle_node_visible: true,
                track: null, // 轨迹
                trackStyle: {
                    // 线
                    stroke: {
                        // color: "#2fc1b9",
                        color: "rgb(0, 0, 255)",
                        width: 1,
                    },
                    // 填充色
                    fill: {
                        // color: "#00ff00"
                        color: "rgb(0, 0, 255)"
                    },
                },
                trackStyle_node: {
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
                trackData: {}, // 轨迹数据
                machineDetailData: {}, // 轨迹的详情数据、相关轨迹点数据等
                measureList: [],
                styleCache: {},
                selectFeatureNode: null,
            }
        },
        computed: {
            dataInfo() {
                // 获取详情
                if (this.selectFeatureNode) {
                    return Object.assign({dialogType: "trackPoint"}, this.selectFeatureNode.getProperties())
                }
                return null;
            },
        },
        watch: {
            selectFeature(newVal, oldVal) {
                // 样式还原
                if (oldVal) {
                    let vm = oldVal._layer._vm;
                    vm.setFeatureStyle(oldVal, vm.styles);
                }

                // 设置选中样式
                if (newVal) {
                    let vm = newVal._layer._vm;
                    // vm.setFeatureStyle(newVal, vm.hoverStyles);
                }
            }
        },
        created() {
            //console.log("农机监控created");
        },
        destroyed() {
            //console.log("农机监控destroyed");
        },
        methods: {
            showSearch() {
                if (this.isShowAgriMonitoring || this.isShowTrack) {
                    return false;
                }
                return true;
            },
            AgriMonitoringStatus(box, status) {
                this[box] = status;
                //console.log(status);
            },
            async initMap() {
                let layerParam = window.global.xzqh;
                let layerIndex = [window.global.xzqh.sheng, window.global.xzqh.shi] // 省
                // 获取地图的坐标系
                let projection = this.$refs.mapCom.map.getView().getProjection();
                let info = await getLayerInfo(layerParam);
                if (info) {
                    layerIndex.map(async item => {
                        let res = await propertiesQuery({
                            layer: layerParam,
                            layerId: item,
                            layerProjection: info.projection,
                            params: {where: [{key: "adcode", operator: "like", value: "'42%'"}]},
                            featureProjection: projection
                        });
                        if (res) {
                            this.$refs.province.source.addFeatures(res.features);
                        }
                    })
                }
                // this.initMachines();
            },
            handleToolClick(e) {
                switch (e.event) {
                    case 'area':
                        this.measureList.push(new measureEvent({map: this.$refs.mapCom.map, type: "Polygon"}));
                        break;
                    case 'distance':
                        this.measureList.push(new measureEvent({map: this.$refs.mapCom.map, type: "LineString"}));
                        break;
                    case 'clear':
                        this.measureList.forEach(x => {
                            clearMeasure(x);
                        });
                        this.measureList = [];
                        break;
                    case 'zoomIn':
                        zoomIn(this.$refs.mapCom.map)
                        break;
                    case 'zoomOut':
                        zoomOut(this.$refs.mapCom.map)
                        break;
                    case 'choose':
                        // this.$refs.mapCom.map.dragging = true;
                        break;
                    case 'change':
                        break;
                    case 'fullScreen':
                        toggleFullScreen(document.getElementById('monitorting-map'))
                        break;
                    default:
                        break;
                }
            },
            changeLoading(val) {
                this.loading = val;
            },
            // 加载农机地图数据
            initMachines(data) {
                this.dataSource = {
                    type: "1", // FeatureCollection
                    geometryKey: "geometryType",
                    data: data,
                    idKey: 'machineId',
                }
                // //console.log(this.$refs.geo, 'geo')
                // this.$nextTick(() => {
                //   this.$refs.mapCom.map.getView().fit(this.$refs.geo.source.getExtent());
                //   // this.$refs.geo.fit();
                // })

            },
            // 地图数据上图
            handleMapData(data) {
                // 每次查询都默认关闭详情框
                this.isShowDetail = false;
                //清空轨迹数据
                this.lineDataSource = {};
                this.pointDataSource = {};
                this.initMachines(data);
            },
            getOverview(params) {
                //console.log("getOverview", this.$refs.view)
                this.$refs.view.initData(params, false);
            },
            // 初始化样式
            initMachineStyle(feature, resolution) {
                return oneStyles(feature, resolution, 'img/monitoring/ico-outline.png', 1)
            },
            initMechineClusterStyle(feature, resolution) {
                return MoreClusterStyles(feature, resolution, 'img/monitoring/ico-outline.png', 1, 1);
            },

            // pbw修改
            // 获取农机数据并展示历史轨迹
            getdetailData(data) {
                // //console.log(data);
                this.pbwdetailData = data;
            },
            // 处理点击事件
            handleMachineClick(e, feature) {
                //console.log("单击农机", feature.values_);
                this.$refs.geo.layer.getFeatures(e.pixel).then(clickedFeatures => {
                    if (clickedFeatures && clickedFeatures.length) {
                        const features = clickedFeatures[0].get('features');
                        if (features && features.length > 1) {
                            const extent = boundingExtent(
                                features.map((r) => r.getGeometry().getCoordinates())
                            );
                            this.$refs.mapCom.map.getView().fit(extent, {
                                duration: 1000,
                                padding: [200, 400, 200, 400]
                            });
                        } else {
                            this.selectFeature = feature;
                            this.detailData = feature.values_;
                            this.isShowDetail = true;
                        }
                    }
                })
            },

            handleNodeClick(e, feature) {
                if (feature) {
                    this.selectFeatureNode = feature;
                    this.$refs.popupNode.show(e.coordinate);
                }
            },
            // 地图点击事件
            handleMapClick(e, feature) {
                //console.log(feature, e, 'map')
                if (feature.get("source") == "track") {
                    let index = feature.get("index");
                    this.machineDetailData = this.trackData.traPoiArray[index].attributes;
                    this.$refs.popup.show(e.coordinate);
                    //console.log(index, 'index')
                }
            },

            // 农机列表选择事件
            handleSelect(data) {
                //console.log("点击选择后的data:", data);
                let source = this.$refs.geo.source;
                let feature = source.getFeatureById(data.machineId);
                // 根据元素定位中间
                if (feature) {
                    this.$refs.mapCom.map.getView().fit(feature.getGeometry(), {maxZoom: 14});
                }
                this.detailData = data;
                this.isShowDetail = true;
            },

            // 轨迹查询获取数据事件
            getTrackLineData(data) {
                this.trackData = data;
                let pointList = [];
                if (data && data.traPoiArray) {
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
                    this.pointDataSource = {
                        type: "1",
                        data: pointList,
                        id: "track_line_point"
                    }
                }
                if (data && data.trailLine && data.trailLine.paths) {
                    this.lineDataSource = {
                        type: "1",
                        data: [
                            {
                                type: "LineString",
                                coordinates: data.trailLine.paths[0],
                                id: "track",
                            },
                        ],
                    }
                }
                this.$nextTick(() => {
                    this.initTrack();
                })
            },

            // 初始化轨迹
            initTrack() {
                let feature = this.$refs.track.source.getFeatureById("track");
                if (feature) {
                    /* const extent = boundingExtent(
                         features.map((r) => r.getGeometry().getCoordinates())
                     );
                     this.$refs.mapCom.map.getView().fit(extent, {

                     });*/
                    this.$refs.mapCom.map.getView().fit(feature.getGeometry(), {
                        maxZoom: 18, duration: 1000,
                        padding: [200, 400, 200, 400]
                    });
                }
                if (!feature) {
                    return;
                }
                this.track = new Track({
                    map: this.$refs.mapCom.map,
                    feature: feature,
                    // showDir: true,
                    moveStyle: {
                        icon: {
                            src: 'img/monitoring/working-car.png'
                        }
                    },
                    nodeStyle: { // 节点样式
                        circle: {
                            stroke: {
                                color: "#fff",
                                width: 2,
                            },
                            fill: {
                                color: "rgb(0, 0, 255)"
                            },
                            radius: 4,
                        },
                    },
                    callback: (data) => {
                        // //console.log("路线显示的percent的callback:",data);
                        // this.percent = data.percent;
                        this.$refs.trackBox.$refs.playBar.percent = data.percent;
                        if (data.percent === 1) {
                            this.$refs.trackBox.finish();
                        }
                        // //console.log(this.$refs.trackBox.$refs.playBar.percent, 'percent');
                    },
                });
                //this.track.setShowNode(this.trackData); // 默认显示轨迹
                this.track.setIsTrack(this.trackData.isFollowTrack);
                this.trackStyle_node_visible = this.trackData.showNode;
            },
            // 轨迹组件操作的事件，包括轨迹点显隐
            handleTrackEvents(data) {
                let {type, value} = data;
                switch (type) {
                    case 'node':
                        //this.track && this.track.setShowNode(value);
                        this.trackStyle_node_visible = value;
                        break;
                    case 'follow':
                        this.track && this.track.setIsTrack(value);
                        break;
                    case 'play':
                        this.track && this.track.start();
                        break;
                    case 'pause':
                        this.track && this.track.pause();
                        break;
                    case 'finish':
                        this.track && this.track.finish(value);
                        break;
                    case 'speed':
                        this.track && this.track.setSpeed(value);
                        break;
                    case 'close':
                        this.track && this.track.destroy();
                        this.lineDataSource = {};
                        this.pointDataSource = {};
                        break;
                    default:
                        break;
                }
            },
            // 关闭轨迹点详情弹框
            closePopup() {
                this.machineDetailData = null;
            },
            // 控制页面组件的显示与隐藏
            handleBoxStatus(box, value) {
                this[box] = value;
            },
            clearSelectFeature() {
                this.selectFeatureNode = null;
            },
        }
    }
</script>

<style lang="less" scoped>
    .agri-monitoring {
        // position: relative;
        &-map {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .search {
            position: absolute;
            left: 0;
            bottom: 0;
            top: 10px;
        }

        .statics {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translate(-50%, 0);
        }

        @media screen and (max-width: 1920px) {
            .statics {
                transform: translate(-55%, 0);
            }
        }

        .tools {
            position: absolute;
            top: 50px;
            right: 20px;
        }

        .detail {
            position: absolute;
            top: 100px;
            right: 20px;
        }

        .track {
            position: absolute;
            left: calc(50% - 385px);
            bottom: 30px;
        }
    }

    .pbwagribox {
        z-index: 1000;
    }
</style>
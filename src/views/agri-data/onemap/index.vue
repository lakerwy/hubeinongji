<!--
存在的问题：
1.整个页面逻辑有问题，按钮是控制显示和隐藏，不是需要重新加载
2.没有做好比例尺显示控制的配置（btnTools）
-->

<template>
    <div class="onemap" v-loading="loading">
        <mapCom
                ref="map2d"
                class="map-container"
                @ready="ready"
        ></mapCom>
        <div class="mapBg"></div>
        <LeftTab v-if="false" :typeList="typeList" :dataTypeList="dataTypeList" :map2d="map2d"></LeftTab>
        <BtnTools @setPoint="setPoint" :iconList="iconList"></BtnTools>
    </div>
</template>

<script>
    import LeftTab from "./component/LeftTab.vue"
    import BtnTools from "./component/BtnTools";
    import mapCom from "./map/aggreMap";
    import * as mapHanlder from "../../../util/mapHanlder"
    import {farmData} from "./map/testData";
    import {getMapPoint} from "../../../api/agridata";
    import {delArrayVal} from "@/util/util"

    export default {
        components: {
            mapCom,
            LeftTab,
            BtnTools
        },
        data() {
            return {
                dataTypeList: [],
                map2d: null,
                loading: false,
                iconList: [
                    {
                        id: 1,
                        src: 'img/icon_point1.png',
                        title: '农机',
                        type: 'machine',
                        searchkey: "machine",
                        visible: true,
                        minZoom: 0,
                        icon: 'img/agricul/icon-machine.png',
                        isCluster: true,
                        maxScaleForClusterStyle: 160000,
                        clusterStyleType: 1,//表示聚合成数字圈
                        iconScale: 1,
                        zIndex: 99
                    },
                    {
                        id: 2,
                        src: 'img/icon_point2.png',
                        title: '合作社',
                        type: 'cooperative',
                        searchkey: "4",
                        visible: true,
                        minZoom: 0,
                        icon: 'img/agricul/icon-group.png',
                        isCluster: true,
                        maxScaleForClusterStyle: 200000,
                        iconScale: 0.7,
                        clusterStyleType: 2,//表示不加数字
                        zIndex: 10
                    },
                    {
                        id: 3,
                        src: 'img/icon_point3.png',
                        title: '维修站',
                        type: 'pit',
                        searchkey: "2",
                        visible: false,
                        minZoom: 0,
                        visible: true,
                        icon: 'img/agricul/icon-repair.png',
                        isCluster: true,
                        maxScaleForClusterStyle: 200000,
                        iconScale: 0.7,
                        clusterStyleType: 2,//表示不加数字
                        zIndex: 11
                    },
                    {
                        id: 4,
                        src: 'img/icon_point4.png',
                        title: '加油站',
                        type: 'gasstation',
                        searchkey: "1",
                        visible: true,
                        icon: 'img/agricul/icon-gas.png',
                        minZoom: 0,
                        isCluster: true,
                        maxScaleForClusterStyle: 200000,
                        iconScale: 0.7,
                        clusterStyleType: 2,//表示不加数字
                        zIndex: 12
                    },
                    {
                        id: 5,
                        src: 'img/icon_point5.png',
                        title: '销售站点',
                        type: 'sales',
                        icon: 'img/agricul/icon-sail.png',
                        searchkey: "5",
                        visible: true,
                        minZoom: 0,
                        maxScaleForClusterStyle: 200000,
                        iconScale: 0.7,
                        zIndex: 13
                    },
                    {
                        id: 6,
                        src: 'img/icon_point6.png',
                        title: '耕作地块',
                        type: 'farming',
                        searchkey: "",
                        minZoom: 0,
                        visible: false,
                        iconScale: 1
                    },
                    {
                        id: 7,
                        src: 'img/icon_point8.png',
                        title: '农资信息',
                        type: 'agricul',
                        searchkey: "3",
                        visible: true,
                        minZoom: 0,
                        iconScale: 0.7
                    },
                ],
            }
        },
        created() {
        },
        mounted() {
            this.map2d = this.$refs.map2d;
            this.dataRefreh();
        },
        destroyed() {
            this.clearTimer();
        },
        methods: {
            ready() {
                //底图加载完成以后，加载图层
                this.changeAllLayer()
            },
            // 定时刷新数据函数
            dataRefreh() {
                // 计时器正在进行中，退出函数
                if (this.intervalId != null) {
                    return;
                }
                // 计时器为空，操作
                this.intervalId = setInterval(() => {
                    //console.log()
                }, 1000 * 60 * 5);
            },
            clearTimer() {
                clearInterval(this.intervalId); //清除计时器
                this.intervalId = null; //设置为null
            },
            async setPoint(e, showLoading = true) {
                switch (e.type) {
                    case "machine":
                    case "cooperative":
                    case "pit":
                    case "gasstation":
                    case "sales":
                    case "agricul":
                        await this.changeLayerVisible(e, showLoading)
                        break;
                    case "farming":
                        await this.$refs.map2d.changeFarmArea(e.visible, showLoading);
                        break;
                    case "all":
                        await this.changeAllLayer(e.visible, true)
                        break;
                    default:
                        break;
                }
            },
            async changeLayerVisible(e, showLoading = true) {
                let vectorData = e.isCluster ? 'vectorClusterDataSource' : 'vectorDataSource';
                let layers = this.$refs.map2d[vectorData];
                let layer = layers[e.type];
                if (layer) {
                    //console.log("layer", layer)
                    this.$refs.map2d.$set(layer, 'visible', e.visible);
                    // debugger
                } else {
                    if (e.visible) {
                        await this.loadMapPoint(e, showLoading);
                    }
                }

            },
            //获取地图上的标记
            async loadMapPoint(e, showload = true) {
                if (showload) {
                    this.loading = true;
                }
                let res = await getMapPoint({
                    currentPage: 0,
                    dataTypeList: [e.searchkey],
                    pageSize: 0,
                    searchWord: "",
                });
                debugger
                let {code, data, msg} = res;
                if (!code) {
                    mapHanlder.addPointsOnMap({
                        component: this.map2d,
                        data: data.data,
                        lonKey: "lon",
                        latKey: "lat",
                        icon: e.icon,
                        hoverIcon: "",
                        parameters: e
                    });
                    if (showload) {
                        this.loading = false;
                    }

                } else {
                    this.$message.error(msg);
                    if (showload) {
                        this.loading = false;
                    }
                }
            },
            async getOnemapPoint() {
                this.loading = true;
                let res = await getMapPoint({
                    currentPage: 0,
                    dataTypeList: this.dataTypeList,
                    pageSize: 0,
                    searchWord: "",
                });
                let {code, data, msg} = res;
                if (!code) {
                    data.data.forEach(item => {
                        this.typeList[item.resoucesType].data.push(item);
                    })
                    for (let key in this.typeList) {
                        if (this.typeList[key].data.length) {
                            mapHanlder.addPointsOnMap({
                                component: this.map2d,
                                data: this.typeList[key].data,
                                lonKey: "lon",
                                latKey: "lat",
                                dialogType: this.typeList[key].name,
                                icon: this.typeList[key].icon,
                                hoverIcon: "",
                            });
                        }
                        this.loading = false;
                    }
                } else {
                    this.$message.error(msg);
                    this.loading = false;
                }
            },

            async changeAllLayer(visible, showloading = true) {
                if (showloading) {
                    this.loading = true;
                    //console.log("showloading1",new Date())

                }
                this.iconList.forEach(async(item, index) => {
                    if (visible instanceof Boolean) {
                        item.visible = visible;
                    }
                    await this.setPoint(item, !showloading);
                })
                this.loading = false;
                //console.log("showloading2",new Date())
            },
            async getAllMapPoint() {
                this.loading = true;
                let tmpplandatas = []
                for (let key in this.typeList) {
                    let temp = await getMapPoint({
                        currentPage: 0,
                        dataTypeList: [key],
                        pageSize: 0,
                        searchWord: "",
                    })
                    let {code, data, msg} = temp;
                    if (!code) {
                        mapHanlder.addPointsOnMap({
                            component: this.map2d,
                            data: data.data,
                            lonKey: "lon",
                            latKey: "lat",
                            dialogType: this.typeList[key].name,
                            icon: this.typeList[key].icon,
                            hoverIcon: "",
                        });
                    } else {
                        this.$message.error(msg);
                    }
                    tmpplandatas.push(temp)
                }
                await Promise.all(tmpplandatas).then(res => {
                    //console.log("Promise", res);
                    this.loading = false;
                }).catch(error => {
                    //console.log("error", error);
                    this.loading = false;
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    @vh: 10.8vh;
    .onemap {
        height: 100%;

        .map-container {
            width: 100%;
            height: 100%;
        }

        .mapBg {
            position: absolute;
            bottom: 0;
            height: 100%;
            width: 100%;
            background: url("../../../assets/images/mapBg_zz.png") no-repeat;
            background-size: 100% 100%;
            pointer-events: none;
        }
    }
</style>
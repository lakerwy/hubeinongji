<template>
    <!-- 重复作业查询 -->
    <div class="audit-repeat-working">
        <div id="working-map">
            <my-map ref="mapCom" style="width:100%;height:100%" @ready="initMap">
                <template v-for="(item, name, index) in vectorDataSource">
                    <MyMapVectorJson
                            :ref="name"
                            :id="item.id"
                            :key="index"
                            :name="item.name"
                            :dataSource="item.dataSource"
                            :styles="item.styles"
                            :hoverStyles="item.hoverStyles"
                            :zindex="item.zindex"
                            :isFit="item.isFit"
                            :fitOption="item.fitOption"
                            :visible="item.visible"
                            @click="handleClick"
                    ></MyMapVectorJson>
                </template>
            </my-map>
        </div>
        <tools class="tools" @handleToolClick="handleToolClick"/>
        <auditBox class="audit" :row="repeatRow" @close="close" @click="boxClick" @handleAudit="handleAudit"/>
        <div class="typeBox">
            <el-checkbox v-for="item in types" :key="item.value" :label="item.value" v-model="item.checked"
                         @change="checked=>handleCheckedChange(checked,item)">
                <div class="symbol" :style="{'background': item.bg}"></div>
                {{ item.label }}
            </el-checkbox>
        </div>
        <div class="auditBox">
            <el-radio-group v-model="auditFlag" @change="initRepeatInfo">
                <el-radio v-for="item in auditFlags" :label="item.value" v-model="item.checked">{{ item.label }}
                </el-radio>
            </el-radio-group>
        </div>
        <AuditDialog
                ref="audit"
                :ids="detailData.rowId"
                :type="'2'"
                :auditFlag="detailData.auditType"
                :auditReason="detailData.auditReason"
                @refreshData="initRepeatInfo"/>
        <!-- <Footer class="map-footer"/> -->
    </div>
</template>

<script>
    import MyMap from "@map/components/my-map/Map";
    import MyMapVectorJson from "@map/components/my-map-vector/Json";
    import Footer from '@/components/footer/index';
    import tools from '_com/toolsBox/index';
    import auditBox from '../components/auditBox/index'
    import AuditDialog from '../components/dialog/auditDialog'
    import {
        zoomIn,
        zoomOut,
        toggleFullScreen
    } from "@map/js/tool/baseTool.js";
    import measureEvent, {clearMeasure} from "@map/js/tool/measure.js";
    import {selectAreaCheckByMap, polygonWktToPolygon} from "../../../api/working/repeat";
    import {queryRepeatAreaByRowId} from "../../../api/working/index";

    export default {
        components: {
            MyMap,
            MyMapVectorJson,
            Footer,
            tools,
            auditBox,
            AuditDialog
        },
        data() {
            return {
                measureList: [], // 保存画线等操作
                types: [
                    {label: '当前作业地块', value: 1, bg: '#13a01e', checked: true},
                    {label: '重复作业地块', value: 2, bg: '#2F75C6', checked: true},
                    {label: '重复作业区域', value: 3, bg: '#ff0000', checked: false},
                ],
                auditFlags: [
                    {label: '全部', value: '', bg: '#13a01e', checked: true},
                    {label: '审核通过', value: 1, bg: '#2F75C6', checked: true},
                    {label: '审核不通过', value: 2, bg: '#ff0000', checked: false},
                ],
                checkList: [],
                vectorDataSource: {},
                repeatRow: {},
                detailData: {},
                auditFlag: 1
            }
        },

        created() {
            // //console.log(this.$route.query.row);
            //this.repeatRow = Object.assign({}, JSON.parse(this.$route.query.row));
            // this.getAreaCheckByMap();
        },
        mounted() {
            //console.log("audit-repeat-working:",this.repeatData)
            //this.initMap()
        },
        props: {
            repeatData: {
                type: Object,
                default: () => {
                }
            }
        },
        watch: {
            repeatData: {
                handler: function (newVal, oldVal) {
                    //this.repeatRow = newVal
                    this.initMap();
                }
            }
        },
        methods: {
            initMap() {
                if (!this.repeatData) return;
                this.repeatRow = Object.assign({}, this.repeatData)

                this.initRepeatInfo();
                //this.getAreaMap();
                //this.getReapetAreaMap();
            },
            async initRepeatInfo() {
                this.vectorDataSource = {}

                let res = await queryRepeatAreaByRowId({
                    rowId: this.repeatData.originalRowId||this.repeatData.rowId,
                    auditFlag: this.auditFlag
                })
                //console.log("queryRepeatAreaByRowId", res)
                if(res.code===0 && res.data){
                    this.repeatRow = {...res.data}
                    //加载重复地块
                    this.loadPolygon2Map(res.data.list)
                }
            },
            //获取面积图层
            async getAreaCheckByMap(id) {
                let res = await selectAreaCheckByMap({
                    areaRowId: this.repeatData.originalRowId
                })
            },
            async loadPolygon2Map(layers) {

                if (!layers || layers.length == 0) return

                let mainLayer = layers[0];
                //加载主体地块
                if (mainLayer && mainLayer.geometryStr) {
                    let dataSource = {
                        type: "1", // list
                        geometryKey: "geometryType",
                        data: [
                            {
                                geometryType: "Polygon",
                                coordinates: JSON.parse(mainLayer.geometryStr).rings,
                            },
                        ]
                    }
                    let item = {
                        dataSource: dataSource,
                        isFit: true,

                        fitOption: {
                            maxZoom: 18,
                            padding: [300, 300, 300, 150]
                        },
                        zindex: 0,
                        visible: this.types[0].checked,
                        styles: [
                            {
                                stroke: {
                                    color: "rgba(29, 93, 226, 1)",
                                    width: 1,
                                },
                                fill: {
                                    color: "rgba(19,160,30,0.8)",
                                },
                            },
                        ],
                        hoverStyles: [
                            {
                                stroke: {
                                    color: "rgb(33,226,220)",
                                    width: 2,
                                },
                                fill: {
                                    color: "rgba(19,160,30, 0.8)",
                                },
                            },
                        ]
                    }
                    this.$set(this.vectorDataSource, 'layer' + mainLayer.rowId, item)
                }
                this.repeatLayerIds = [];
                for (var i = 1; i < layers.length; i++) {
                    let repeatLayer = layers[i];
                    this.repeatLayerIds.push(repeatLayer.rowId)
                    if (repeatLayer && repeatLayer.geometryStr) {
                        let dataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(repeatLayer.geometryStr).rings,
                                },
                            ]
                        }
                        let item = {
                            dataSource: dataSource,
                            isFit: true,
                            zindex: i,
                            fitOption: {
                                maxZoom: 18,
                                padding: [300, 300, 300, 150]
                            },
                            visible: this.types[1].checked,
                            styles: [
                                {
                                    stroke: {
                                        color: "rgba(29, 93, 226, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(47, 117, 198, 0.4)",
                                    },
                                },
                            ],
                            hoverStyles: [
                                {
                                    stroke: {
                                        color: "rgb(33,226,220)",
                                        width: 2,
                                    },
                                    fill: {
                                        color: "rgba(47, 117, 198, 0.6)",
                                    },
                                },
                            ]
                        }
                        this.$set(this.vectorDataSource, 'layer' + repeatLayer.rowId, item)
                    }
                    if (repeatLayer && repeatLayer.intersectGeometryStr) {
                        let dataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(repeatLayer.intersectGeometryStr).rings,
                                },
                            ]
                        }
                        let item = {
                            dataSource: dataSource,
                            isFit: true,
                            zindex: 999,
                            visible: this.types[2].checked,
                            fitOption: {
                                maxZoom: 18,
                                padding: [300, 300, 300, 150]
                            },
                            styles: [
                                {
                                    stroke: {
                                        color: "rgba(216, 15, 40, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(176, 55, 71, 0.6)",
                                    },
                                },
                            ],
                            hoverStyles: [
                                {
                                    stroke: {
                                        color: "rgba(216, 15, 40, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(176, 55, 71, 0.6)",
                                    },
                                },
                            ]
                        }
                        this.$set(this.vectorDataSource, 'layer' + repeatLayer.rowId + 'repeat', item)

                        //this.$set(this.vectorDataSource['layer' + repeatLayer.rowId + 'repeat'],'visible', false)
                    }
                }


                //console.log("his.vectorDataSource", this.vectorDataSource)

            },
            //作业地块
            async getAreaMap() {
                /* let res = await polygonWktToPolygon({
                     wkt: this.repeatData.originalGeometryString
                 })*/
                ////console.log("wkt", res)
                const {code, data, msg} = res;
                if (code === 0 && data) {
                    //this.$set(this.repeatRow, 'original', data)

                    if (data) {

                        let dataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(data).rings,
                                },
                            ]
                        }
                        let item = {
                            dataSource: dataSource,
                            isFit: true,
                            fitOption: {
                                maxZoom: 18,
                                padding: [300, 300, 300, 150]
                            },
                            styles: [
                                {
                                    stroke: {
                                        color: "rgba(29, 93, 226, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(47, 117, 198, 0.6)",
                                    },
                                },
                            ],
                            hoverStyles: [
                                {
                                    stroke: {
                                        color: "rgba(29, 93, 226, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(47, 117, 198, 0.6)",
                                    },
                                },
                            ]
                        }
                        this.$set(this.vectorDataSource, 'workPlot', item)
                    }
                }
            },
            //重复作业地块
            async getReapetAreaMap() {
                let res = await selectAreaCheckByMap({
                    areaRowId: this.repeatData.repeatRowId
                })
                const {code, data} = res;
                if (code === 0 && data) {
                    //this.$set(this.repeatRow, 'repeat', data)
                    if (data.geometryStr) {
                        let dataSource = {
                            type: "1", // list
                            geometryKey: "geometryType",
                            data: [
                                {
                                    geometryType: "Polygon",
                                    coordinates: JSON.parse(data.geometryStr).rings,
                                },
                            ]
                        }
                        let item = {
                            dataSource: dataSource,
                            isFit: true,
                            zindex: 999,
                            fitOption: {
                                maxZoom: 18,
                                padding: [300, 300, 300, 150]
                            },
                            styles: [
                                {
                                    stroke: {
                                        color: "rgba(216, 15, 40, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(176, 55, 71, 0.6)",
                                    },
                                },
                            ],
                            hoverStyles: [
                                {
                                    stroke: {
                                        color: "rgba(216, 15, 40, 1)",
                                        width: 1,
                                    },
                                    fill: {
                                        color: "rgba(176, 55, 71, 0.6)",
                                    },
                                },
                            ]
                        }
                        this.$set(this.vectorDataSource, 'reapetWorkPlot', item)
                    }

                }
            },
            //多选框事件
            handleCheckedChange(checked, item) {
                switch (item.value) {
                    case 1:
                        this.$set(this.vectorDataSource['layer' + this.repeatRow.list[0].rowId], 'visible', checked)
                        break;
                    case 2:
                        if (this.repeatLayerIds && this.repeatLayerIds.length) {
                            let that = this;
                            this.repeatLayerIds.forEach((item, index) => {
                                that.$set(that.vectorDataSource['layer' + item], 'visible', checked)
                            })
                        }
                        break;
                    case 3:
                        if (this.repeatLayerIds && this.repeatLayerIds.length) {
                            let that = this;
                            this.repeatLayerIds.forEach((item, index) => {
                                that.$set(that.vectorDataSource['layer' + item + 'repeat'], 'visible', checked)
                            })
                        }
                        break;
                    default:
                        break;
                }
            },
            handleClick(e, feature) {
                if (feature) {

                }
            },
            //工具栏
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
                        toggleFullScreen(document.getElementById('working-map'))
                        break;
                    default:
                        break;
                }
            },
            close() {
                this.$emit("close");
            },

            boxClick(item) {
                let visible = !this.vectorDataSource['layer' + item.rowId].visible
                if (item.interectArea > 0) {
                    //表示相交地块，把其他的涂层都关掉
                    if (visible) {
                        if (this.repeatLayerIds && this.repeatLayerIds.length) {
                            let that = this;
                            this.repeatLayerIds.forEach((item, index) => {
                                that.$set(that.vectorDataSource['layer' + item], 'visible', !visible)
                                that.$set(that.vectorDataSource['layer' + item + 'repeat'], 'visible', !visible)
                            })
                        }
                    }
                    this.$set(this.vectorDataSource['layer' + item.rowId], 'visible', visible)
                    this.$set(this.vectorDataSource['layer' + item.rowId + 'repeat'], 'visible', visible)
                } else {

                    this.$set(this.vectorDataSource['layer' + item.rowId], 'visible', visible)
                }


            },
            handleAudit(agrs) {
                //console.log("agrs", agrs)
                this.detailData = agrs
                this.$refs.audit.dialogVisible = true
            },
        }
    }
</script>

<style lang="less" scoped>
    .audit-repeat-working {
        width: 100%;
        height: 100%;
        position: relative;

        #working-map {
            width: 100%;
            height: 100%;
        }

        .tools {
            position: absolute;
            top: 22px;
            right: 80px;
        }

        .audit {
            position: absolute;
            top: 20px;
            left: 0px;
        }

        .typeBox {
            position: absolute;
            bottom: 81px;
            right: 30px;
            background-color: #121a2e;
            width: 191px;
            // height: 98px;
            padding: 22px 0 22px 29px;

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

            .symbol {
                display: inline-block;
                width: 18px;
                height: 8px;
                background-color: #ff0000;
                margin-right: 12px;
            }

            .el-checkbox {
                display: block;
            }

            .el-checkbox {
                margin-bottom: 10px;
            }

            /deep/ .el-checkbox__label {
                color: @base-fontColor;
                padding-left: 12px;
            }

            /deep/ .el-checkbox__inner {
                background: transparent;
            }

            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                background: #1298f8;
            }

            .el-checkbox {
                margin-right: 12px;
            }
        }


        .auditBox {
            position: absolute;
            bottom: 201px;
            right: 30px;
            background-color: #121a2e;
            width: 191px;
            // height: 98px;
            padding: 22px 0 22px 29px;

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

            .symbol {
                display: inline-block;
                width: 18px;
                height: 8px;
                background-color: #ff0000;
                margin-right: 12px;
            }

            .el-radio {
                display: block;
            }

            .el-radio {
                margin-bottom: 10px;
            }

            /deep/ .el-radio__label {
                color: @base-fontColor;
                padding-left: 12px;
            }

            /deep/ .el-radio__inner {
                background: transparent;
            }

            /deep/ .el-radio__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                background: #1298f8;
            }

            .el-radio {
                margin-right: 12px;
            }

        }
    }
</style>
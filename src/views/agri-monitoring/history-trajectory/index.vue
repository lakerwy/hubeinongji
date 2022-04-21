<template>
  <div class="agri-monitoring">
    <div class="agri-monitoring-map" id="monitorting-map" v-loading="loading" element-loading-background="rgba(3,7,11,.7)">
      <my-map ref="mapCom" style="width:100%;height:100%" @ready="initMap" @click="handleMapClick">
        <MyMapVectorJson 
          ref="province" 
          :styles="provinceStyles"
          ></MyMapVectorJson>
        <MyMapVectorCluster 
          ref="geo" 
          name="mechine"
          :dataSource="dataSource"
          :styles="initMachineStyle"
          :clusterStyles="initMechineClusterStyle" 
          :isFit="false"
          :fitOption="{padding: [100,100,100,100]}"
          :isCluster="true"
          @click="handleMachineClick"></MyMapVectorCluster>

        <MyMapVectorJson 
          ref="track" 
          :dataSource="lineDataSource"
          :styles="trackStyle">
          </MyMapVectorJson>

        <MyMapPopup ref="popup">
          <machineDetail v-if="machineDetailData" :data="machineDetailData" @close="closePopup" />
        </MyMapPopup>
      </my-map>
    </div>

    <searchBox 
      class="search"
      @getData="handleMapData"
      @select="handleSelect"
      @getOverview="getOverview" />

    <staticsBox ref="view" class="statics" @init="initMachines" @cahngeLoading="cahngeLoading" />

    <toolsBox class="tools" @handleToolClick="handleToolClick" />

    <detailBox 
      v-if="isShowDetail" 
      class="detail"
      :data="detailData"
      @showTrack="handleBoxStatus"
      @close="handleBoxStatus" />

    <trackplayback 
      ref="trackBox"
      v-if="isShowTrack" 
      class="track" 
      :data="detailData"
      @getData="getTrackLineData"
      @handleTrackEvents="handleTrackEvents"
      @close="handleBoxStatus" />
  </div>
</template>

<script>
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapVectorCluster from "@map/components/my-map-vector/Cluster";
import MyMap from "@map/components/my-map/Map";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import searchBox from '../components/searchBox/index'
import staticsBox from '../components/staticsBox/index'
import detailBox from '../components/detailBox/index'
import trackplayback from '../components/trackplayback/index'
import toolsBox from '_com/toolsBox/index'
import Track from "@map/js/animation/track";
import machineDetail from '../components/machineDetail/index'
import { zoomIn, zoomOut, toggleFullScreen } from "@map/js/tool/baseTool.js";
import { getLayerInfo, propertiesQuery } from "@map/js/query/query";
import measureEvent, { clearMeasure } from "@map/js/tool/measure.js";
import { viewDmOnMap } from '@/util/mapHanlder.js'

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
    toolsBox
  },
  data() {
    return {
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
      lineDataSource: {}, // 轨迹数据
      track: null, // 轨迹
      trackStyle: {
        // 线
        stroke:{
          // color: "#2fc1b9",
          color: "rgb(0, 0, 255)",
          width: 1,
        },
         // 填充色
        fill:{
          // color: "#00ff00"
          color: "rgb(0, 0, 255)"
        },
      },
      trackData: {}, // 轨迹数据
      machineDetailData: {}, // 轨迹的详情数据、相关轨迹点数据等
      measureList: [],
      styleCache: {},
    }
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
  methods: {
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
            params: { where:[{key:"adcode", operator: "like", value: "'42%'"}] },
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
      switch(e.event) {
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
    cahngeLoading(val) {
      this.loading = val;
    },
    // 加载机具地图数据
    initMachines(data) {
      this.dataSource = {
        type: "1", // FeatureCollection
        geometryKey: "geometryType",
        data: data,
        idKey: 'machineId',
      }
      // console.log(this.$refs.geo, 'geo')
      // this.$nextTick(() => {
      //   this.$refs.mapCom.map.getView().fit(this.$refs.geo.source.getExtent());
      //   // this.$refs.geo.fit();
      // })
      
    },
    // 地图数据上图
    handleMapData(data) {
      // 每次查询都默认关闭详情框
      this.isShowDetail = false;
      this.initMachines(data);
    },
    getOverview(params) {
      this.$refs.view.initData(params, false);
    },
    // 初始化样式
    initMachineStyle(feature) {
      let { status } = feature.values_;
      let styles = {
        icon: {
          src: status == '在线' ? 'img/monitoring/ico-online.png' : 'img/monitoring/ico-outline.png'
        }
      }
      return styles;
    },
    initMechineClusterStyle(feature) {
      var size = feature.get("features").length;
      var style = this.styleCache[size];
      if (!style) {
        let sizeImg = ''
        if (size < 500) {
          sizeImg = 'img/cluster_1.png'
        } else if (size >= 500 && size < 2000) {
          sizeImg = 'img/cluster_2.png'
        } else {
          sizeImg = 'img/cluster_3.png'
        }
        style = {
          icon: {
            src: sizeImg,
          },
          text: {
            text: size.toString(),
            fill: {
              color: "#fff",
            },
            font: "normal 16px 思源黑体",
          }
        };
        this.styleCache[size] = style;
      }
      return style;
    },
    // 处理点击事件
    handleMachineClick(e, feature) {
      // console.log(feature, e, 'feature')
      this.selectFeature = feature;
      // if (feature){
      //   this.$refs.mapCom.map.getView().fit(feature.getGeometry(),{maxZoom: 14});
      // }
      this.detailData = feature.values_;
      this.isShowDetail = true;
      // feature.setStyle(() => {
      //   return new Style({
      //     image: new Icon({
      //       src: 'img/monitoring/ico-choose.png'
      //     })
      //   })
      // })
    },
    // 地图点击事件
    handleMapClick(e, feature) {
      console.log(feature, 'map')
      if(feature.get("source") == "track"){
        let index = feature.get("index");
        this.machineDetailData = this.trackData.traPoiArray[index].attributes;
        this.$refs.popup.show(e.coordinate);
        console.log(index, 'index')
      }
    },
    // 农机列表选择事件
    handleSelect(data) {
      let source = this.$refs.geo.source;
      let feature = source.getFeatureById(data.machineId);
      // 根据元素定位中间
      // if (feature){
      //   this.$refs.mapCom.map.getView().fit(feature.getGeometry(),{maxZoom: 14});
      // }
      this.detailData = data;
      this.isShowDetail = true;
    },
    // 轨迹查询获取数据事件
    getTrackLineData(data) {
      this.trackData = data;
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
      this.$nextTick(() => {
        this.initTrack();
      })
    },
    // 初始化轨迹
    initTrack() {
      let feature = this.$refs.track.source.getFeatureById("track");
      if(feature) {
        this.$refs.mapCom.map.getView().fit(feature.getGeometry(), {maxZoom: 18});
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
          circle:{
            stroke:{
              color: "#fff",
              width: 2,
            },
            fill:{
              color: "rgb(0, 0, 255)"
            },
            radius:4,
          },
        },
        callback: (data) => {
          // this.percent = data.percent;
          this.$refs.trackBox.$refs.playBar.percent = data.percent;
          if(data.percent === 1) {
            this.$refs.trackBox.finish();
          }
          // console.log(this.$refs.trackBox.$refs.playBar.percent, 'percent');
        },
      });
      this.track.setShowNode(true); // 默认显示轨迹
      this.track.setIsTrack(true);
    },
    // 轨迹组件操作的事件，包括轨迹点显隐
    handleTrackEvents(data) {
      let { type, value } = data;
      switch(type) {
        case 'node':
          this.track && this.track.setShowNode(value);
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
    }
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
  }
  .statics {
    position: absolute;
    top: 10px;
    left: calc(50% - 328px);
    // margin-left: -328px;
  }
  .tools {
    position: absolute;
    top: 22px;
    right: 20px;
  }
  .detail {
    position: absolute;
    top: 80px;
    right: 20px;
  }
  .track {
    position: absolute;
    left: calc(50% - 385px);
    bottom: 20px;
  }
}
</style>
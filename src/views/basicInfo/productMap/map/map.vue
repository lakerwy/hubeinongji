<template>
  <div v-if="reloadVal">
    <MyMap ref="mapCom" style="width: 100%; height: 100%" @ready="init" @nullselect="clearSelectFeature">
      <template v-for="(item, name, index) in vectorRegionDataSource">
        <MyMapVectorJson
          :ref="name"
          :id="item.id"
          :key="item.id"
          :name="item.name"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :hoverStyles="item.hoverStyles"
          :zindex="item.zindex"
          :isFit="item.isFit"
          :fitOption="item.fitOption"
          @click="handleClick"
        ></MyMapVectorJson>
      </template>
      <template v-for="(item, name, index) in vectorDataSource">
        <MyMapVectorCluster
          :ref="name"
          :id="item.id"
          :key="item.id"
          :name="item.name"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :hoverStyles="item.hoverStyles"
          :zindex="item.zindex"
          :isFit="item.isFit"
          :fitOption="item.fitOption"
          :clusterStyles="item.clusterStyles"
          @click="handleClick"
          :scales="[60000, 600000, 1200000]"
          :distances="[100, 160, 320]"
          :distance="20"
          :isCluster="true"
        ></MyMapVectorCluster>
      </template>
      <MyMapPopup ref="popup">
        <PopupInfo v-if="info" :data="info" :selectId="info ? info.id : null" @close="clearSelectFeature"></PopupInfo>
      </MyMapPopup>
    </MyMap>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapVectorCluster from "@map/components/my-map-vector/Cluster";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import PopupInfo from "../component/PopupInfo";
import * as mapHandler from "../../../../util/mapHanlder";
import { getCenterByFeature } from "@map/js/feature";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapVectorCluster,
    MyMapPopup,
    PopupInfo,
  },
  data() {
    return {
      vectorDataSource: {},
      vectorRegionDataSource: {},
      selectFeature: null,
      reloadVal: true,
      layer: {},
      plotInfo: null,
    };
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
        vm.setFeatureStyle(newVal, vm.hoverStyles);
      }
    },
  },
  computed: {
    info() {
      // 获取详情
      if (this.selectFeature) {
        return this.selectFeature.getProperties();
      }
      return null;
    },
  },
  mounted() {
    // this.reload()
  },
  methods: {
    reload() {
      this.reloadVal = false;
      this.$nextTick(() => {
        this.reloadVal = true;
      })
    },
    async init() {
      // 行政区划
      let region = mapHandler.getRegionData();
      if (region) {
        // this.vectorDataSource[region.id] = region;
        this.$set(this.vectorRegionDataSource, region.id, region)
      }

    },
    getMap() {
      return this.$refs.mapCom.map;
    },
    handleClick(e, feature) {
      if(feature._layer.layerDateType=== "cluster"){
        return;
      }
      if (feature) {
        this.selectFeature = feature;
        this.$refs.popup.show(e.coordinate);
      }
    },
    clearSelectFeature() {
      this.selectFeature = null;
    },
  },
}
</script>
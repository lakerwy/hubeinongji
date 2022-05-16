<template>
  <div v-if="reloadVal">
    <MyMap ref="mapCom" style="width: 100%; height: 100%" @ready="init" @nullselect="clearSelectFeature">
      <template v-for="(item, name, index) in vectorDataSource">
        <MyMapVectorJson
          :ref="name"
          :id="item.id"
          :key="index"
          :name="item.name"
          :visble="item.visible"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :hoverStyles="item.hoverStyles"
          :zindex="item.zindex"
          :isFit="item.isFit"
          :fitOption="item.fitOption"
          @click="handleClick"
        ></MyMapVectorJson>
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
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import PopupInfo from "../component/PopupInfo";
import * as mapHandler from "../../../../util/mapHanlder";
import { getCenterByFeature } from "@map/js/feature";


export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapPopup,
    PopupInfo
  },
  data() {
    return {
      vectorDataSource: {},
      selectFeature: null,
      reloadVal: true,
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
    init() {
      // 行政区划
      let region = mapHandler.getRegionData();
      if (region) {
        // this.vectorDataSource[region.id] = region;
        this.$set(this.vectorDataSource, region.id, region)
      }
    },
    getMap() {
      return this.$refs.mapCom.map;
    },
    handleClick(e, feature) {
      if (feature) {
        this.selectFeature = feature;
        // this.$refs.mapCom.map.getView().fit(feature.getGeometry(),{maxZoom: 14});
        let coordinate = getCenterByFeature(feature);
        this.$refs.mapCom.map.getView().fit(feature.getGeometry(), {
          maxZoom: 15,
          duration: 1000,
          callback: () => {
            // 弹出要素事件
            // this.handleClick({ coordinate: c }, feature);
            this.$refs.popup.show(coordinate);
          },
        });
      }
    },
    clearSelectFeature() {
      this.selectFeature = null;
    },
  },
}
</script>
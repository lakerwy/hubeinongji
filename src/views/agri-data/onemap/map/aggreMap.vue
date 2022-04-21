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
        <PopupupInfoPlot v-if="plotInfo" :data="plotInfo" @close="plotInfo=null"></PopupupInfoPlot>
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
import PopupupInfoPlot from "../component/PopupupInfoPlot";
import * as mapHandler from "../../../../util/mapHanlder";
import { getCenterByFeature } from "@map/js/feature";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapVectorCluster,
    MyMapPopup,
    PopupInfo,
    PopupupInfoPlot
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
  beforeDestroy() {
    let map = this.$refs.mapCom.map;
    map.un("singleclick", this.getFeatureInfoByClick)
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
      // 地块上图
      this.getMachineFarmArea();

    },
    //地块上图
    async getMachineFarmArea() {
      let map = this.$refs.mapCom.map;
      if(map){
        this.layer = await map.addImageLayer({
          type:"geoserver",
          url: "http://223.75.53.178:8884/geoserver/agri_420000/wms",
          layers:"agri_420000:agri_420000_area_2021",
          projection:"EPSG:900913",
        });

        map.on('singleclick', this.getFeatureInfoByClick)
        // map.un("singleclick", this.getFeatureInfoByClick)
        // map.removeLayer(layer);
      }
    },
    getFeatureInfoByClick(evt){
      let map = this.$refs.mapCom.map;
      const viewResolution = map.getView().getResolution();
      const url = this.layer.getSource().getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        "EPSG:900913",
        {'INFO_FORMAT': 'application/json',
          QUERY_LAYERS: "agri_420000:agri_420000_area_2021",
          cql_filter: "job_type='4' AND ( province_id='170000' OR city_id='170000' OR country_id='170000')"
        }
      );
      if (url) {
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            if(json.features.length){
              this.$refs.popup.show(evt.coordinate);
              this.plotInfo = json.features[0].properties;
            } else {
              this.plotInfo = null;
            }
          });
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
        // let coordinate = getCenterByFeature(feature);
        // this.$refs.mapCom.map.getView().fit(feature.getGeometry(), {
        //   maxZoom: 15,
        //   duration: 500,
        //   callback: () => {
        //     // 弹出要素事件
        //     // this.handleClick({ coordinate: c }, feature);
        //     this.$refs.popup.show(coordinate);
        //   },
        // });
      }
    },
    clearSelectFeature() {
      this.selectFeature = null;
    },
  },
}
</script>
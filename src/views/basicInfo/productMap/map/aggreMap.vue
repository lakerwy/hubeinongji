<template>
  <div v-if="reloadVal">
    <MyMap
      ref="mapCom"
      style="width: 100%; height: 100%"
      @ready="init"
      @nullselect="clearSelectFeature"
    >
      <template v-for="(item, name, index) in vectorDataSource">
        <MyMapVectorJson
          :ref="name"
          :id="item.id"
          :key="item.id"
          :name="item.name"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :hoverStyles="item.hoverStyles"
          :zindex="item.zindex"
          :visible="item.visible"
          :isFit="item.isFit"
          :fitOption="item.fitOption"
          :minZoom="item.minZoom"
          :maxZoom="item.maxZoom"
          @click="handleClick"
        ></MyMapVectorJson>
      </template>
      <template v-for="(item, name, index) in vectorClusterDataSource">
        <MyMapVectorCluster
          :ref="name"
          :id="item.id"
          :name="item.name"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :hoverStyles="item.hoverStyles"
          :zindex="item.zindex"
          :isFit="item.isFit"
          :visible="item.visible"
          :fitOption="item.fitOption"
          :clusterStyles="item.clusterStyles"
          :maxScaleForClusterStyle="item.maxScaleForClusterStyle"
          @click="handleClickCluster"
          :scales="[50000, 600000, 1200000]"
          :distances="[80, 140, 300]"
          :distance="40"
          :isCluster="true"
        ></MyMapVectorCluster>
      </template>
      <MyMapPopup ref="popup">
        <PopupInfo
          v-if="dataInfo"
          :data="dataInfo"
          :selectId="dataInfo ? dataInfo.id : null"
          @close="clearSelectFeature"
        ></PopupInfo>
      </MyMapPopup>
      <MyMapPopup ref="popupPlot">
        <PopupupInfoPlot
          v-if="plotVisible"
          :data="plotInfo"
          @close="plotVisible = false"
          v-loading="loadInfo"
        ></PopupupInfoPlot>
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
import { zoomIn } from "@map/js/tool/baseTool.js";
import { boundingExtent } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import request from "@/request/index";
import LayerGroup from "ol/layer/Group";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapVectorCluster,
    MyMapPopup,
    PopupInfo,
    PopupupInfoPlot,
  },
  data() {
    return {
      vectorDataSource: {},
      vectorClusterDataSource: {},
      vectorRegionDataSource: {},
      selectFeature: null,
      reloadVal: true,
      layer: null,
      plotInfo: null,
      plotVisible: false,
      loadInfo: false,
    };
  },
  watch: {
    selectFeature: {
      handler: function (newVal, oldVal) {
        ////console.log("selectFeature", newVal)
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
  },
  computed: {
    dataInfo() {
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
    map.un("dblclick", this.getFeatureInfoByClick);
  },
  methods: {
    reload() {
      this.reloadVal = false;
      this.$nextTick(() => {
        this.reloadVal = true;
      });
    },
    init() {
      // 行政区划
      let region = mapHandler.getRegionData();
      if (region) {
        this.$set(this.vectorDataSource, region.id, region);
      }
      // 地块上图
      //this.addAreaLayer(true);
      this.$emit("ready");
    },
    async changeFarmArea(visible) {
      ////console.log("changeFarmArea", visible, this.layer)
      if (visible) {
        if (!this.layer) {
          this.addAreaLayer(visible);
        } else {
          this.layer.setVisible(visible);
        }
      } else {
        if (this.layer) {
          this.layer.setVisible(visible);
        }
      }
    },
    //地块上图
    addAreaLayer(visible) {
      var wmsSource = new TileWMS(window.global.areaLayer2);
      this.layer = new TileLayer({
        source: wmsSource,
      });
      let map = this.$refs.mapCom.map;
      if (!map) return;
      //map.addLayer(this.layer)
      var layersArray = map.getLayers();
      ////console.log("layersArray", layersArray)
      //根据地图的图层数量决定，需要灵活配置
      if (layersArray && layersArray.getLength() > 0) {
        let groupLayer = layersArray.getArray()[0];

        if (groupLayer instanceof LayerGroup) {
          let layers = groupLayer.getLayers();
          //放在
          ////console.log("layers.insertAt")
          layers.insertAt(window.global.areaLayer2.index, this.layer);
        } else {
          ////console.log("layersArray.insertAt")
          layersArray.insertAt(window.global.areaLayer2.index, this.layer);
        }
      }
      map.on("dblclick", this.getFeatureInfoByClick);
    },
    getFeatureInfoByClick(evt) {
      ////console.log("getFeatureInfoByClick", evt);
      let map = this.$refs.mapCom.map;
      const viewResolution = map.getView().getResolution();
      const url = this.layer
        .getSource()
        .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:900913", {
          INFO_FORMAT: "application/json",
          QUERY_LAYERS: "agri_420000:agri_420000_area_2021",
        });
      //把数据下载下来展示吗？应该会很慢
      if (url) {
        this.$refs.popupPlot.show(evt.coordinate);
        this.plotVisible = true;
        this.loadInfo = true;
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            this.loadInfo = false;
            if (json.features.length) {
              this.plotInfo = json.features[0].properties;
            } else {
              this.plotInfo = null;
            }
          })
          .catch((ex) => {
            this.loadInfo = false;
          });
      }
    },
    getFeatureInfo(e) {
      let map = this.$refs.mapCom.map;
      const viewResolution = map.getView().getResolution();
      var resolution = (map.getScale() * 0.0254) / 96;
      var size = [768, 692];
      var opt_extent = new Array(4);
      var extent = this.getForViewAndSize(
        e.coordinate,
        resolution,
        0,
        size,
        opt_extent
      );
      var x = Math.floor((e.coordinate[1] - extent[0]) / resolution);
      var y = Math.floor((extent[3] - e.coordinate[0]) / resolution);
      var bbox = extent;
      var params = {
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetFeatureInfo",
        FORMAT: "image/png",
        TRANSPARENT: true,
        QUERY_LAYERS: geolayerName,
        LAYERS: geolayerName,
        INFO_FORMAT: "application/json",
        SRS: "EPSG:900913",
        X: x,
        Y: y,
        cql_filter: filterCondition,
        WIDTH: size[0],
        HEIGHT: size[1],
      };

      params["BBOX"] = bbox.join(",");
      var url =
        "http://223.75.53.178:8884/geoserver/agri_" +
        provicode +
        "0000" +
        "/wms?SERVICE=WMS";
      for (p in params) {
        url += "&" + p + "=" + params[p];
      }
      ////console.log("getFeatureInfo", url)

      fetch(url)
        .then((response) => {
          ////console.log("response", response)
          response.json();
        })
        .then((json) => {
          ////console.log(json);
          if (json.features.length) {
            this.$refs.popupPlot.show(evt.coordinate);
            this.plotInfo = json.features[0].properties;
          } else {
            this.plotInfo = null;
          }
        });
      request(url, {
        method: "POST",
        sync: false,
        handleAs: "application/json",
      }).then(
        function (data1) {
          var data = JSON.parse(data1);
          if (data["features"].length > 0) {
            showInfoWindow(
              e.mapPoint,
              e.screenPoint,
              data["features"][0].properties,
              data["features"][0].geometry,
              deleteAuthority
            );
          }
        },
        function (err) {
          ////console.log("error");
        }
      );
    },
    getMap() {
      return this.$refs.mapCom.map;
    },
    handleClick(e, feature) {
      ////console.log("handleClick", e, feature);
      if (feature) {
        this.selectFeature = feature;
        this.$refs.popup.show(e.coordinate);
      }
    },
    handleClickCluster(e, feature) {
      let that = this;
      let map = this.$refs.mapCom.map;
      //let features = map.getFeaturesAtPixel(e.pixel);
      if (feature) {
        //判断点击的是要素，还是聚合节点
        let properties = feature.getProperties();
        if (
          properties &&
          properties.dialogType &&
          properties.geometryType === "Point"
        ) {
          let layerref = this.$refs[properties.dialogType];
          if (layerref && layerref[0]) {
            layerref[0].layer.getFeatures(e.pixel).then((clickedFeatures) => {
              if (clickedFeatures && clickedFeatures.length) {
                const features = clickedFeatures[0].get("features");
                ////console.log('features', features)
                if (features && features.length > 1) {
                  const extent = boundingExtent(
                    features.map((r) => r.getGeometry().getCoordinates())
                  );
                  this.$refs.mapCom.map
                    .getView()
                    .fit(extent, {
                      duration: 2000,
                      padding: [200, 400, 200, 400],
                    });
                } else {
                  doPop(feature);
                }
              } else {
                doPop(feature);
              }
            });
          } else {
            doPop(feature);
          }
        } else {
          doPop(feature);
        }
      } else {
        doPop(feature);
      }

      function doPop(popFeature) {
        that.$bus.$emit("isClose", false);
        if (popFeature) {
          that.selectFeature = feature;
          that.$refs.popup.show(e.coordinate);
        }
      }
    },
    clearSelectFeature() {
      this.selectFeature = null;
    },

    getForViewAndSize(coodinate, resolution, rotation, size, opt_extent) {
      var dx = (resolution * size[0]) / 2;
      var dy = (resolution * size[1]) / 2;
      var cosRotation = Math.cos(rotation);
      var sinRotation = Math.sin(rotation);
      var xCos = dx * cosRotation;
      var xSin = dx * sinRotation;
      var yCos = dy * cosRotation;
      var ySin = dy * sinRotation;
      var x = coodinate[1];
      var y = coodinate[0];
      var x0 = x - xCos + ySin;
      var x1 = x - xCos - ySin;
      var x2 = x + xCos - ySin;
      var x3 = x + xCos + ySin;
      var y0 = y - xSin - yCos;
      var y1 = y - xSin + yCos;
      var y2 = y + xSin + yCos;
      var y3 = y + xSin - yCos;
      return this.createOrUpdate(
        Math.min(x0, x1, x2, x3),
        Math.min(y0, y1, y2, y3),
        Math.max(x0, x1, x2, x3),
        Math.max(y0, y1, y2, y3),
        opt_extent
      );
    },
    createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
      if (opt_extent) {
        opt_extent[0] = minX;
        opt_extent[1] = minY;
        opt_extent[2] = maxX;
        opt_extent[3] = maxY;
        return opt_extent;
      } else {
        return [minX, minY, maxX, maxY];
      }
    },
  },
};
</script>
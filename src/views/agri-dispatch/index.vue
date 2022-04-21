<template>
  <div class="dis">
    <MapDispatch
      ref="mapDis"
      class="map-con"
      @handleClick="handleClick"
    />
<!--    <div class="mapBg"></div>-->
    <LeftTab @itemHandleClick="itemHandleClick"/>
    <RightTab v-if="showRightTab"/>
    <CenterTab class="CenterTab"/>
    <Footer class="map-footer" />
  </div>
</template>

<script>
import Footer from '@/components/footer/index'
import LeftTab from './components/LeftTab'
import RightTab from './components/RightTab'
import CenterTab from './components/CenterTab'
import MapDispatch from './map/map'
import * as mapHanlder from '../../util/mapHanlder'
import {mapData, mapData2} from './map/testdata'

export default {
  components: {
    Footer,
    LeftTab,
    RightTab,
    CenterTab,
    MapDispatch,
  },
  data() {
    return {
      mapDis: null,
      showRightTab: false,
    }
  },
  mounted() {
    this.mapDis = this.$refs.mapDis;
    this.getOnemapPoint()
    this.getAnchorPoint()
  },
  methods: {
    //获取地图上的标记
    getOnemapPoint() {
      mapHanlder.addPointsOnMap({
        component: this.mapDis,
        data: mapData,
        lonKey: "longitudeNumber",
        latKey: "latitudeNumber",
        dialogType: "poi",
        icon: "img/agricul/map_point1.png",
        hoverIcon: "",
      });
    },
    getAnchorPoint() {
      let dataSource = {
        type: "1", // list
        geometryKey: "geometryType",
        data: mapData2.map((x) => {
            return {
              ...x,
              geometryType: "Point",
              coordinates: [parseFloat(x['longitudeNumber']), parseFloat(x['latitudeNumber'])],
              dialogType: 'farm',
            }
          }
        )
      }
      let item = {
        dataSource: dataSource,
        styles: [
          {
            icon: {
              src: "img/anchor_point.png"
            },
          },
        ],
      }
      this.mapDis.$set(this.mapDis.vectorDataSource, 'farm', item)
    },
    itemHandleClick(item) {
      console.log(item)
      this.showRightTab = true;
    },
    handleClick(feature) {
      if (feature.values_.dialogType == 'poi') {
        this.showRightTab = true;
      }
    }
  }

}
</script>
<style scoped lang="less">
.CenterTab {
  position: absolute;
  top: 10px;
  left: calc(50% - 425px);
}

.map-con {
  width: 100%;
  height: 100%;
}
.mapBg {
  position: fixed;
  bottom: 0;
  height: calc(100% - 79px);
  width: 100vw;
  background: url("../../assets/images/mapBg_蒙版.png") no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}
</style>
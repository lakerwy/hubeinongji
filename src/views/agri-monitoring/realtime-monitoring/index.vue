<template>
  <div class="realtime-monitoring">
    <div class="realtime-monitoring-map" id="monitorting-map">
      <my-map ref="mapCom" style="width: 100%; height: 100%" @ready="initMap">
        <MyMapVectorJson
          ref="track"
          :dataSource="dataSource"
          :styles="trackStyle"
        ></MyMapVectorJson>
      </my-map>
    </div>

    <pictureBox class="picture" />
    <videoBox class="video" />
    <div class="car">
      <img src="img/monitoring/icon-agricar-active.png" alt="" />
      <span>{{ listData.plateNumber }} 实时监控</span>
    </div>
    <workingBox class="working" />
    <quanlityBox class="quanlity" />
  </div>
</template>

<script>
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMap from "@map/components/my-map/Map";
import pictureBox from "../components/pictureBox/index";
import videoBox from "../components/videoBox/index";
import workingBox from "../components/workingBox/index";
import quanlityBox from "../components/quanlityBox/index";
import Track from "@map/js/animation/track";
import { queryOnLine } from "@/api/monitoring/index";
import { dateFormat } from "@/util/util";
export default {
  name: "agri-monitoring",
  components: {
    MyMap,
    MyMapVectorJson,
    pictureBox,
    videoBox,
    workingBox,
    quanlityBox,
  },
  data() {
    return {
      dataSource: {},
      listData: sessionStorage.getItem("currentCar")
        ? JSON.parse(sessionStorage.getItem("currentCar"))
        : {}, // 当前的农机数据
      trackStyle: {
        // 线
        stroke: {
          // color: "#2fc1b9",
          color: "rgb(0, 0, 255)",
          width: 1,
        },
        icon: {
          src: "img/monitoring/working-car.png",
        },
        // 填充色
        fill: {
          // color: "#00ff00"
          color: "rgb(0, 0, 255)",
        },
      },
      currentTime: new Date(new Date("2021-07-16").setHours(8, 41, 54, 0)), // 当前时间 new Date()
      trackInterval: null, // 轨迹数据定时器
      currentPosition: null, // 当前设备的经纬度
      positions: [], // 记录当前设备已经过的点
      trackData: {},
      index: 1,
      testId: '1000000003631', // 测试农机id
    };
  },
  methods: {
    async initMap() {
      if (this.trackInterval) {
        clearInterval(this.trackInterval);
      }
      let that = this;
      // 加载轨迹数据
      async function change() {
        let params = {
          // machineId: this.listData.machineId,
          machineId: that.testId,
        };
        let res = await queryOnLine(params);
        let { code, data, msg } = res;
        if (code == 0) {
          if(data.lon) {
            that.trackData = data;
            // 第一步：获取当前设备的位置 request
            // 第二步：赋值
            that.currentPosition = [data.lon, data.lat] // 112.778175, 31.107292
            if (
              that.currentPosition &&
              that.currentPosition != that.positions[that.positions.length - 1]
            ) {
              that.positions.push(that.currentPosition);
              if (that.positions.length > 0) {
                that.handleData();
              }
            }
            // 做测试用，更换农机id查询
            that.testId = Number(that.testId) + 1;
          }
        }
      }
      change();
      that.trackInterval = setInterval(change, 5000);
    },
    // 处理数据 上图操作
    handleData() {
      // 第三步：上图
      // 点上图
      let pointFeature = this.$refs.track.source.getFeatureById("device-point");
      if (pointFeature) {
        // 修改点
        let coordinate = this.$refs.mapCom.map.inputCoordinate(this.currentPosition);
        pointFeature.getGeometry().setCoordinates(coordinate);
      } else {
        // 生成点
        this.$refs.track.addData({
          type: "1",
          data: [
            {
              type: "Point",
              coordinates: this.currentPosition,
              id: "device-point",
            },
          ],
        });
        this.$refs.mapCom.map.home({
          center:this.currentPosition,
          zoom:18,
        });
      }
      
      // 修改方向
      pointFeature = this.$refs.track.source.getFeatureById("device-point");
      if (pointFeature) {
        let style = pointFeature.getStyle() || this.$refs.track.layer.getStyle();
        if (style) {
          let image = style.getImage();
          image && image.setRotation(this.trackData.direction * Math.PI / 180);
        }
      }

      // // 线上图
      if (this.positions.length > 2) {
        // 追加坐标
        let feature = this.$refs.track.source.getFeatureById("device-line");
        if (feature) {
          let lastCoordiante = this.positions[this.positions.length - 1];
          let coordinate = this.$refs.mapCom.map.inputCoordinate(lastCoordiante);
          feature.getGeometry().appendCoordinate(coordinate);
        }
      } else if ((this.positions.length == 2)) {
        // 生成线
        this.$refs.track.addData({
          type: "1",
          data: [
            {
              type: "LineString",
              coordinates: this.positions,
              id: "device-line",
            },
          ],
        });
      }
    },
    initTrack() {
      let feature = this.$refs.track.source.getFeatureById("track");
      if (feature) {
        this.$refs.mapCom.map
          .getView()
          .fit(feature.getGeometry(), { maxZoom: 18 });
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
            src: "img/monitoring/working-car.png",
          },
        },
        nodeStyle: {
          // 节点样式
          circle: {
            stroke: {
              color: "#fff",
              width: 2,
            },
            fill: {
              color: "rgb(0, 0, 255)",
            },
            radius: 4,
          },
        },
        callback: () => {},
      });
      this.track.setShowNode(true); // 默认显示轨迹
      // this.track.setIsTrack(true);
      this.track.start();
    },
  },
  beforeDestroy() {
    if (this.trackInterval) {
      clearInterval(this.trackInterval);
    }
  }
};
</script>

<style lang="less" scoped>
.realtime-monitoring {
  // position: relative;
  &-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .picture {
    position: absolute;
    left: 0;
    top: 10px;
  }
  .car {
    // width: 304px;
    padding: 0 35px 0 29px;
    height: 60px;
    line-height: 60px;
    background-color: rgba(12, 28, 46, 0.9);
    border-radius: 4px;
    position: absolute;
    top: 10px;
    color: #fff;
    font-size: 20px;
    // left: calc(50% - 152px);
    left: 42%;
    text-align: center;
    img {
      vertical-align: middle;
      margin-right: 18px;
    }
  }
  .working {
    position: absolute;
    top: 10px;
    right: 20px;
  }
  .video {
    position: absolute;
    left: 0;
    top: 49%;
  }
  .quanlity {
    position: absolute;
    top: 50%;
    right: 20px;
  }

  /deep/ .el-card__header {
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #0d2346;
  }
  /deep/ .el-card {
    border: 0;
  }
}
</style>
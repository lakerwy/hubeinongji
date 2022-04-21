<template>
  <div class="map-view">
    <div id="working-map">
      <my-map ref="mapCom" style="width: 100%; height: 100%" @click="mapClick">
        <!-- 作业轨迹图层 -->
        <MyMapVectorJson 
          ref="geo" 
          :dataSource="dataSource"
          :isFit="true"
          :fitOption="{padding: [200,200,200,200]}"
          :styles="trailStyle"></MyMapVectorJson>
          <!-- 深度点图层 -->
        <MyMapVectorJson 
          ref="pgeo" 
          :dataSource="pointDataSource"
          :isFit="true"
          :fitOption="{padding: [200,200,200,200]}"
          :styles="initPointStyle"></MyMapVectorJson>
          <!-- 作业面积图层 -->
        <MyMapVectorJson 
          ref="ageo" 
          :dataSource="areaDataSource"
          :isFit="true"
          :fitOption="{padding: [400,400,400,400]}"
          :styles="areaStyle"></MyMapVectorJson>
          <!-- 作业照片图层 -->
        <MyMapVectorJson 
          ref="photo" 
          :dataSource="photoDataSource"
          :isFit="true"
          :fitOption="{padding: [400,400,400,400]}"
          :styles="photoStyle"
          @click="showPhoto">
        </MyMapVectorJson>
      </my-map>
    </div>

    <tools class="tools" @handleToolClick="handleToolClick" />
    <queryBox ref="query" class="query" :query="query" @getCurrent="getCurrent" />
    <detailBox
      v-if="isShowDetail"
      class="detail"
      :data="detailData"
      @close="handleBoxStatus"
      @refreshData="refreshData"
      @handleClick="handleDetailBoxClick"
    />
    <div class="typeBox">
      <el-checkbox-group v-model="type" >
        <el-checkbox
          v-for="item in types"
          :label="item.value"
          :key="item.value"
          @change="handleChange(item)"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
      <div class="typeBox-type">
        <span><img src="img/working/success-point.png" alt="" />已达标</span>
        <span><img src="img/working/falid-point.png" alt="" />未达标</span>
        <span><img src="img/working/default-point.png" alt="" />转移中</span>
      </div>
    </div>

    <picDialog ref="picDialog" :url="picUrl"></picDialog>

    <auditDialog 
      ref="audit" 
      :ids="detailData.rowId"
      :type="'2'"
      @refreshData="refreshData" />

    <updateAreaDialog 
      ref="areaDialog" 
      :data="detailData" 
      @refreshData="refreshData" />

    <Footer class="map-footer" />
  </div>
</template>

<script>
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMap from "@map/components/my-map/Map";
import Footer from "@/components/footer/index";
import picDialog from '../dialog/picDialog'
import tools from "_com/toolsBox/index";
import queryBox from "../queryBox/index";
import detailBox from "../detailBox/index";
import auditDialog from '../dialog/auditDialog'
import updateAreaDialog from '../dialog/updateAreaDialog'
import { getLayerInfo, propertiesQuery } from "@map/js/query/query";
import { zoomIn, zoomOut, toggleFullScreen } from "@map/js/tool/baseTool.js";
import measureEvent, { clearMeasure } from "@map/js/tool/measure.js";
import { queryTrailLine, queryTerminalTrailInfo, selectAreaCheckByMap, queryDepthCriterion } from '@/api/working/index'
export default {
  name: "mapView",
  components: {
    MyMapVectorJson,
    MyMap,
    Footer,
    tools,
    queryBox,
    detailBox,
    picDialog,
    auditDialog,
    updateAreaDialog
  },
  props: {
    query: {
      type: Object,
      default: () => {},
    },
    current: {
      type: Object,
      default: () => {},
    }
  },
  watch: {
    current: function(newV) {
      if(newV) {
        this.$refs.query.initData();
        this.$refs.query.handleItemClick(newV.row, newV.index);
      }
    }
  },
  data() {
    return {
      measureList: [], // 保存画线等操作
      types: [
        { label: "轨迹", value: 1 },
        { label: "地块", value: 2 },
        { label: "深度", value: 3 },
        { label: "照片", value: 4 },
      ],
      type: [1],
      isShowDetail: false, // 是否显示详情框
      detailData: {}, // 详细数据
      detailIndex: -1,
      dataSource: {},
      pointDataSource: {},
      areaDataSource: {},
      photoDataSource: {},
      data: {},
      areaData: '', // 地块数据
      trailStyle: { // 轨迹样式
        stroke:{
          color: '#00ffff',
          width: 2
        },
      },
      areaStyle: { // 地块样式
        fill:{
          color: 'rgba(79,113,150,.6)'
        },
        stroke:{
          color: '#00ffff',
          width: 2
        },
      },
      photoStyle: { // 照片图层样式
        icon: {
          src: 'img/working/BluePin1LargeB.png'
        }
      },
      picUrl: '', // 当前点击的图片地址
      picDate: new Date('2017-10-16 12:00:00'), // 照片时间处理中间值，在此时间之前为blob数据，之后为地址
      initDeep: 0, // 深度标准数据
    };
  },
  created() {
  },
  methods: {
    mapClick(val, f) {
      console.log(val, f, 'click')
    },
    async initMap() {
      // let layerParam = window.global.xzqh;
      // let layerIndex = [window.global.xzqh.sheng, window.global.xzqh.shi] // 省
      // // 获取地图的坐标系
      // let projection = this.$refs.mapCom.map.getView().getProjection();
      // let info = await getLayerInfo(layerParam);
      // if (info) {
      //   layerIndex.map(async item => {
      //     let res = await propertiesQuery({
      //       layer: layerParam,
      //       layerId: item,
      //       layerProjection: info.projection,
      //       params: { where:[{key:"adcode", operator: "like", value: "'42%'"}] },
      //       featureProjection: projection
      //     });
      //     if (res) {
      //       this.$refs.geo.source.addFeatures(res.features);
      //     }
      //   })
      // }
    },
    handleToolClick(e) {
      switch (e.event) {
        case "area":
          this.measureList.push(
            new measureEvent({ map: this.$refs.mapCom.map, type: "Polygon" })
          );
          break;
        case "distance":
          this.measureList.push(
            new measureEvent({ map: this.$refs.mapCom.map, type: "LineString" })
          );
          break;
        case "clear":
          this.measureList.forEach((x) => {
            clearMeasure(x);
          });
          this.measureList = [];
          break;
        case "zoomIn":
          zoomIn(this.$refs.mapCom.map);
          break;
        case "zoomOut":
          zoomOut(this.$refs.mapCom.map);
          break;
        case "choose":
          // this.$refs.mapCom.map.dragging = true;
          break;
        case "change":
          break;
        case "fullScreen":
          toggleFullScreen(document.getElementById("working-map"));
          break;
        default:
          break;
      }
    },
    // 控制页面组件的显示与隐藏
    handleBoxStatus(box, value) {
      this[box] = value;
    },
    // 获取当前选择的作业
    getCurrent(val, index) {
      this.detailData = val;
      this.detailIndex = index;
      this.isShowDetail = true;
      this.initWorkingTrail();
      this.initArea();
      // 作业类型为深松 深翻时请求深度标准
      if(this.detailData.jobType == '4' || this.detailData.jobType == '9') {
        this.getDepthCriterion();
      }
    },
    // 当前作业轨迹上图
    async initWorkingTrail() {
      let params = {
        begintime: this.detailData.jobStartTime,
        endtime: this.detailData.jobEndTime,
        machineId: this.detailData.machineId
      }
      let res = await queryTrailLine(params);
      const {code, data, msg} = res;
      if(code == 0) {
        if(data.trailLine) {
          this.dataSource = {
            type: "1", // list
            geometryKey: "geometryType",
            data: [
              {
                geometryType: "Polygon",
                coordinates: JSON.parse(data.trailLine).paths,
              },
            ]
          }
        } else {
          // this.$alert('当前无轨迹数据', '提示', {
          //   confirmButtonText: '确定',
          //   type: 'warning',
          //   callback: action => {
              
          //   }
          // })
          this.$message.info('当前无轨迹数据')
        }
      } else {
        this.$message.error(msg || '轨迹查询失败')
      }
    },
    // 作业地块
    async initArea(isMap) {
      let params = {
        areaRowId: this.detailData.rowId
        // areaRowId: 236422
      }
      let res = await selectAreaCheckByMap(params);
      const {code, data} = res;
      if(code == 0) {
        this.areaData = data;
        if(isMap) {
          this.areaDataSource = {
            type: "1", // list
            geometryKey: "geometryType",
            data: [
              {
                geometryType: "Polygon",
                coordinates: JSON.parse(data.geometryStr).rings,
              },
            ]
          }
        }
      }
    },
    // 获取深度点标准 
    async getDepthCriterion() {
      let params = {
        machineType: this.detailData.machineType,
        toolType: this.detailData.toolType,
        belongGroupId: this.detailData.belongGroupId,
        areaSTime: this.detailData.jobStartTimeS
      };
      let res = await queryDepthCriterion(params);
      if(res.init_deep) {
        this.initDeep = res.init_deep;
      }
    },
    // 作业深度点
    async initDepthTrail() {
      let params = {
        begintime: this.detailData.jobStartTime,
        endtime: this.detailData.jobEndTime,
        geometryStr: this.areaData.boundary_warning,
        machineId: this.detailData.machineId
      }
      let res = await queryTerminalTrailInfo(params);
      console.log(res, 'depth')
      let dataSource = [];
      if(res) {
        res.forEach(item => {
          dataSource.push({
            geometryType: "Point",
            coordinates:[item.geometry.x, item.geometry.y],
            jobHight: item.attributes.jobHight,
            attributes: item.attributes,
          })
        })
        this.pointDataSource = {
          type: "1", // list
          geometryKey: "geometryType",
          data: dataSource
        }
      }
    },
    // 照片
    initPhoto() {
      if(this.areaData.photoPositionJSONArray && this.areaData.photoPositionJSONArray.length > 0) {
        let photoData = JSON.parse(this.areaData.photoPositionJSONArray[0]);
        console.log(photoData, 'photoData')
        let dataSource = [];
        photoData.forEach(item => {
          dataSource.push({
            geometryType: "Point",
            coordinates:[item.geometry.x, item.geometry.y],
            attributes: item.attributes
          })
        })
        this.photoDataSource = {
          type: "1", // list
          geometryKey: "geometryType",
          data: dataSource
        }
      } else {
        this.$message.error('暂无照片数据')
      }
    },
    // 深度点的样式
    initPointStyle(feature) {
      let styles = [];
      let jobHight = feature.get("jobHight")
      if(jobHight) {
        let pointStyle = {}
        if(jobHight >= this.initDeep && jobHight < 999) {
          pointStyle = {
            circle:{
              stroke:{
                color: "#00ff00",
                width: 1,
              },
              fill:{
                color: "#00ff00"
              },
              radius:5,
            },
          }
        } else if(jobHight < this.initDeep) {
          pointStyle = {
            circle:{
              stroke:{
                color: "#e30000",
                width: 1,
              },
              fill:{
                color: "#e30000"
              },
              radius:5,
            },
          }
        } else {
          pointStyle = {
            circle:{
              stroke:{
                color: "#949494",
                width: 1,
              },
              fill:{
                color: "#949494"
              },
              radius:5,
            },
          }
        }
        styles.push(pointStyle)
      }
      return styles;
    },
    // 图片点 点击展示图片
    showPhoto(e, feature) {
      let data = feature.values_;
      console.log(data.attributes)
      let time = new Date(data.attributes.time);
      if(time <= this.picDate) {
        // 在时间点之前为blob数据
        this.picUrl = `data:image/jpeg;base64,${data.attributes.mediafullpath}`
      } else {
        this.picUrl = data.attributes.mediafullpath;
      }
      this.$refs.picDialog.dialogVisible = true;
    },
    // checkbox选择项
    handleChange(val) {
      // console.log(this.type.includes(val.value), val, 'change')
      let checked = this.type.includes(val.value);
      if(checked) {
        switch(val.value) {
          case 1:
            this.initWorkingTrail();
            break;
          case 2:
            // 地块
            this.initArea(true);
            break;
          case 3:
            // 深度
            this.initDepthTrail();
            break;
          case 4:
            // 照片
            this.initPhoto();
            break;
          default:
            break;
        }
      } else {
        switch(val.value) {
          case 1:
            this.dataSource = {};
            break;
          case 2:
            // 地块
            this.areaDataSource = {};
            break;
          case 3:
            // 深度 清除，展示轨迹
            this.pointDataSource = {};
            break;
          default:
            break;
        }
      }
    },
    // 详情框点击事件
    handleDetailBoxClick(type) {
      switch(type) {
        case 'audit':
          this.$refs.audit.dialogVisible = true;
          break;
        case 'update':
          this.$refs.areaDialog.dialogVisible = true;
          break;
        default:
          break;
      }
    },
    // 更新数据
    refreshData(type) {
      if(type == 'del') {
        this.isShowDetail = false;
        this.$refs.query.initData();
      } else {
        // 更新详情数据
        this.$refs.query.initData(true);
      }
    }
  },
};
</script>

<style lang="less" scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  #working-map {
    width: 100%;
    height: 100%;
  }
  .tools {
    position: absolute;
    top: 26px;
    right: 17px;
  }
  .query {
    position: absolute;
    top: 8px;
    left: 0;
  }
  .detail {
    position: absolute;
    top: 80px;
    right: 27px;
  }
  .typeBox {
    position: absolute;
    bottom: 26px;
    left: 437px;
    background: @base-darkBlue;
    // width: 280px;
    // height: 72px;
    padding: 18px 16px 14px 16px;
    border-radius: 4px;
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
    /deep/ .el-checkbox__label {
      color: @base-fontColor;
      padding-left: 7px;
    }
    /deep/ .el-checkbox__inner {
      background: transparent;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background: #1298f8;
    }
    .el-checkbox {
      margin-right: 12px;
    }
  }
}
</style>
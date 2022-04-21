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
            @click="handleClick"
          ></MyMapVectorJson>
        </template>
      </my-map>
    </div>
    <tools class="tools" @handleToolClick="handleToolClick"/>
    <auditBox class="audit" :row="repeatRow"/>
    <div class="typeBox">
      <el-checkbox v-for="item in types" :key="item.value" :label="item.value" v-model="item.checked"
                   @change="checked=>handleCheckedChange(checked,item)">
        <div class="symbol" :style="{'background': item.bg}"></div>
        {{ item.label }}
      </el-checkbox>
    </div>

    <Footer class="map-footer"/>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import Footer from '@/components/footer/index';
import tools from '_com/toolsBox/index';
import auditBox from '../components/auditBox/index'
import {
  zoomIn,
  zoomOut,
  toggleFullScreen
} from "@map/js/tool/baseTool.js";
import measureEvent, {clearMeasure} from "@map/js/tool/measure.js";
import {selectAreaCheckByMap} from "../../../api/working/repeat";

export default {
  name: 'auditRepeatWorking',
  components: {
    MyMap,
    MyMapVectorJson,
    Footer,
    tools,
    auditBox
  },
  data() {
    return {
      measureList: [], // 保存画线等操作
      types: [
        {label: '作业地块', value: 1, bg: '#2a00ff', checked: true},
        {label: '重复作业地块', value: 2, bg: '#ff0000', checked: true},
      ],
      checkList: [],
      vectorDataSource: {},
      repeatRow: {},
    }
  },
  created() {
    console.log(this.$route.query.row);
    this.repeatRow = Object.assign({},JSON.parse(this.$route.query.row));
    // this.getAreaCheckByMap();
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.getAreaMap();
      this.getReapetAreaMap();
    },
    //获取面积图层
    async getAreaCheckByMap(id) {
      let res = await selectAreaCheckByMap({
        areaRowId: '225101'
      })
    },
    //作业地块
    async getAreaMap(){
      let res = await selectAreaCheckByMap({
        areaRowId: '225101'
      })
      debugger
      let dataSource = {
        type: "1", // list
        geometryKey: "geometryType",
        data: [
          {
            geometryType: "Polygon",
            coordinates: JSON.parse(res.geometryStr).rings,
          },
        ]
      }
      let item = {
        dataSource: dataSource,
        isFit: true,
        fitOption: {
          maxZoom: 18,
          padding: [300,300,300,150]
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
    },
    //重复作业地块
    async getReapetAreaMap(){
      let res = await selectAreaCheckByMap({
        areaRowId: '225101'
      })
      let dataSource = {
        type: "1", // list
        geometryKey: "geometryType",
        data: [
          {
            geometryType: "Polygon",
            coordinates: JSON.parse(res.geometryStr).rings,
          },
        ]
      }
      let item = {
        dataSource: dataSource,
        isFit: true,
        zindex: 999,
        fitOption: {
          maxZoom: 18,
          padding: [300,300,300,150]
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
    },
    //多选框事件
    handleCheckedChange(checked,item){
      switch (item.value){
        case 1:
          if(checked){
            this.getAreaMap();
          } else {
            this.$set(this.vectorDataSource,'workPlot','')
          }
          break;
        case 2:
          if(checked){
            this.getReapetAreaMap();
          } else {
            this.$set(this.vectorDataSource,'reapetWorkPlot','')
          }
          break;
        default:
          break;
      }
    },
    handleClick(e, feature) {
      if (feature) {
        debugger
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
    top: 30px;
    left: 18px;
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

    .el-checkbox:first-child {
      margin-bottom: 20px;
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
}
</style>
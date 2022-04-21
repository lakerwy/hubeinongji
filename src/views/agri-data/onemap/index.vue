<template>
  <div class="onemap" v-loading="loading">
    <mapCom
      ref="map2d"
      class="map-container"
    ></mapCom>
    <div class="mapBg"></div>
    <LeftTab v-if="false" :typeList="typeList" :dataTypeList="dataTypeList" :map2d="map2d"></LeftTab>
    <BtnTools @setPoint="setPoint"></BtnTools>
  </div>
</template>

<script>
import LeftTab from "./component/LeftTab.vue"
import BtnTools from "./component/BtnTools";
import mapCom from "./map/aggreMap";
import * as mapHanlder from "../../../util/mapHanlder"
import {farmData} from "./map/testData";
import {getMapPoint} from "../../../api/agridata";
import {delArrayVal} from "@/util/util"

export default {
  components: {
    mapCom,
    LeftTab,
    BtnTools
  },
  data(){
    return{
      typeList: {
        machine: {name: "农机", icon: 'img/agricul/icon-machine.png', data: []},
        '1': {name: "加油站", icon: 'img/agricul/icon-加油站.png', data: []},
        '2': {name: "维修站点", icon: 'img/agricul/icon-维修站.png', data: []},
        '3': {name: "农资信息", icon: 'img/agricul/icon-农资信息.png', data: []},
        '4': {name: "合作社", icon: 'img/agricul/icon-合作社.png', data: []},
        '5': {name: "销售站点", icon: 'img/agricul/icon-销售站点.png', data: []},
      },
      dataTypeList: [],
      map2d: null,
      loading: false,
    }
  },
  created() {
  },
  mounted() {
    this.map2d = this.$refs.map2d;
    this.dataRefreh();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    // 定时刷新数据函数
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        console.log()
      }, 1000 * 60 * 5);
    },
    clearTimer() {
      clearInterval(this.intervalId); //清除计时器
      this.intervalId = null; //设置为null
    },
    setPoint(e) {
      switch (e.type) {
        case "machiner":
          if (e.isSelect) {
            this.dataTypeList.push('machine');
            this.getMapPoint("machine")
          } else {
            this.map2d.$refs['农机'][0].clear()
            this.map2d.$set(this.map2d.vectorDataSource,'农机','');
            delArrayVal('machine',this.dataTypeList)
          }
          break;
        case "cooperative":
          if (e.isSelect) {
            this.dataTypeList.push('4');
            this.getMapPoint('4');
          } else {
            // this.map2d.$refs['合作社'][0].clear()
            this.map2d.$set(this.map2d.vectorDataSource,'合作社','');
            delArrayVal('4',this.dataTypeList)
          }
          break;
        case "pit":
          if (e.isSelect) {
            this.dataTypeList.push('2');
            this.getMapPoint('2');
          } else {
            this.map2d.$refs['维修站点'][0].clear()
            delArrayVal('2',this.dataTypeList)
          }
          break;
        case "gasstation":
          if (e.isSelect) {
            this.dataTypeList.push('1');
            this.getMapPoint('1');
          } else {
            this.map2d.$refs['加油站'][0].clear()
            delArrayVal('1',this.dataTypeList)
          }
          break;
        case "sales":
          if (e.isSelect) {
            this.dataTypeList.push('5');
            this.getMapPoint('5');
          } else {
            this.map2d.$refs['销售站点'][0].clear()
            delArrayVal('5',this.dataTypeList)
          }
          break;
        case "farming":
          if (e.isSelect) {
            this.map2d.getMachineFarmArea();
          } else {
            this.map2d.$refs.mapCom.map.removeLayer(this.map2d.layer);
          }
          break;
        case "agricul":
          if (e.isSelect) {
            this.dataTypeList.push('3');
            this.getMapPoint('3');
          } else {
            this.map2d.$set(this.map2d.vectorDataSource,'农资信息','');
            delArrayVal('3',this.dataTypeList)
          }
          break;
        case "all":
          if (e.isSelect) {
            for(let i in this.typeList){
              this.dataTypeList.push(i);
            }
            this.getOnemapPoint()
          } else {
            this.dataTypeList = [];
            for(let i in this.map2d.vectorDataSource){
              if(i != 'region'){
                this.$delete(this.map2d.vectorDataSource,i)
              }
            };
            for (let key in this.typeList){
              this.typeList[key].data=[];
            }
          }
          break;
        default:
          break;
      }
    },
    //获取地图上的标记
    async getMapPoint(type){
      let res = await getMapPoint({
        currentPage: 0,
        dataTypeList: [type],
        pageSize: 0,
        searchWord: "",
      });
      if(res.success){
        mapHanlder.addPointsOnMap({
          component: this.map2d,
          data: res.data,
          lonKey: "lon",
          latKey: "lat",
          dialogType: this.typeList[type].name,
          icon: this.typeList[type].icon,
          hoverIcon: "",
        });
      }
    },
    async getOnemapPoint() {
      this.loading = true;
      let res = await getMapPoint({
        currentPage: 0,
        dataTypeList: this.dataTypeList,
        pageSize: 0,
        searchWord: "",
      });
      if(res.success){
        res.data.forEach(item=>{
          this.typeList[item.resoucesType].data.push(item);
        })
        console.log(this.typeList)
        for(let key in this.typeList){
          if(this.typeList[key].data.length){
            mapHanlder.addPointsOnMap({
              component: this.map2d,
              data: this.typeList[key].data,
              lonKey: "lon",
              latKey: "lat",
              dialogType: this.typeList[key].name,
              icon: this.typeList[key].icon,
              hoverIcon: "",
            });
          }
        }
        this.loading = false;
      }
    },
    getFarmArea() {
      let dataSource = {
        type: "1", // list
        geometryKey: "geometryType",
        data: farmData.map((x) => {
            return {
              ...x,
              geometryType: "Polygon",
              coordinates: [
                x.farmData1
              ],
              dialogType: 'farm',
            }
          }
        )
      }
      let item = {
        dataSource: dataSource,
        styles: [
          {
            stroke: {
              color: "rgba(32, 26, 188, 1)",
              width: 3,
            },
            fill: {
              color: "rgba(45, 38, 150, 0.6)",
            },
          },
        ],
        hoverStyles: [
          {
            stroke: {
              color: "rgba(136, 208, 67, 1)",
              width: 3,
            },
            fill: {
              color: "rgba(136, 208, 67, 0.3)",
            },
          },
        ]
      }
      this.map2d.$set(this.map2d.vectorRegionDataSource, 'farm', item)
    }
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.onemap {
  height: 100%;

  .map-container {
    width: 100%;
    height: 100%;
  }

  .mapBg {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: url("../../../assets/images/mapBg_遮罩.png") no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
  }
}
/deep/ .el-loading-mask {
  background-color: rgba(3,7,11,.7);
}
</style>
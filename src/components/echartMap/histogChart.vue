<template>
  <div style="width: 100%;height: 100%;">
    <div id="mapWorkChart" class="mapChart" style="width: 100%;height: 100%"></div>
    <div class="box" v-show="showBox" ref="showBox">
      <div class="title">{{ city }}{{ title }}数量统计
        <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
      </div>
      <div id="histogChart" class="histogChart">
      </div>
    </div>
  </div>
</template>

<script>
import {initEcharts} from "../../util/chart";
import echartOption from "./js/echartOption";
import './js/hubeisheng';
import {getGroupData, getStatGroupData} from "../../api/agridata";
import {throttle} from "../../util/debounce";
import * as echarts from 'echarts';

export default {
  name: "histogMap",
  props: {
    title: {
      type: String,
      default: '农机'
    }
  },
  data(){
    return{
      showBox: false,
      city: '武汉市',
      geoJson: {
        features: []
      },
      parentInfo: [{
        cityName: "全国",
      }]
    }
  },
  mounted() {
    // let map = echarts.getMap('湖北省');
    // //console.log(map)
    this.getChartData();
    this.getMachineDataGroup('武汉市')
    // initEcharts('histogChart', echartOption.machToolOption);
  },
  destroyed() {
    document.removeEventListener('click',function (e){
      if(!document.querySelector('.box').contains(e.target)){
        this.showBox = false
      }
    })
  },
  methods: {
    getChartData(){
      let _this = this;
      // let workMap = document.getElementById('mapWorkChart');
      let mapChart = initEcharts('mapWorkChart', echartOption.mapOption);
      mapChart.off('mousemove');
      mapChart.on("mousemove", throttle(function (params) {
        params.event.event ? params.event.event.stopPropagation() : event.cancelBubble = true
        if(params.name){
          _this.city = params.name;
          if(_this.title=='农机'){
            _this.getMachineDataGroup(params.name);
          }else{
            _this.getWorkGroup(params.name);
          }
          _this.showBox = true
          if(_this.showBox) _this.fixingPositon()
        } else {
          _this.showBox = false
        }
      },300));
      document.addEventListener('click',function(e) {
        if(!document.querySelector('.box').contains(e.target)){
          _this.showBox = false
        }
      })
    },
    fixingPositon() {
      const e = event || window.event,
        top = e.offsetY, left = e.offsetX,
        boxDom = document.querySelector('.box');
      this.$nextTick(function () {
        boxDom.style.cssText = `top: ${top}px; left: ${left}px`;
      })
    },
    //农机数量统计
    async getMachineDataGroup(name) {
      let res = await getGroupData({
        city: name,
        county: "",
        province: "湖北省",
      })
      if(res.success){
        let name=[],value=[];
        res.data.forEach(item=>{
          name.push(item.key);
          value.push(item.data);
        })
        this.$set( echartOption.machToolOption.yAxis[0],'data',name);
        this.$set( echartOption.machToolOption.series[0],'data',value);
        initEcharts('histogChart', echartOption.machToolOption);
      }
    },
    //作业数量统计
    async getWorkGroup(name) {
      let res = await getStatGroupData({
        city: name,
        county: "",
        province: "湖北省",
      })
      if(res.success){
        let name=[],value=[];
        res.data.forEach(item=>{
          name.push(item.key);
          value.push(item.data);
        })
        this.$set( echartOption.machToolOption.yAxis[0],'data',name);
        this.$set( echartOption.machToolOption.series[0],'data',value);
        initEcharts('histogChart', echartOption.machToolOption);
      }
    },

    close(){
      this.showBox = false
    }

  }
}
</script>

<style scoped lang="less">

.box{
  position: absolute;
  top: 0px;
  width: 320px;
  height: 294px;
  border: 1px solid #64bfff;
  background: rgba(6,27,58,0.8);
  z-index: 99;

  .title {
    width: 320px;
    height: 41px;
    padding-left: 10px;
    font-family: SourceHanSansCN-Medium;
    background: url("../../assets/images/mapChartBg.png");
    background-size: 100% 100%;
    font-size: 16px;
    font-weight: normal;
    color: #ffffff;
    position: relative;
    line-height: 41px;
    .close-container{
      position: absolute;
      top: 0px;
      right: 20px;
      cursor: pointer;
    }
  }
  .histogChart {
    width: 320px;
    height: 253px;
    z-index: 999;
  }
}

</style>
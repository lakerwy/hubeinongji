<template>
  <div class="pbw_echartsflexbox">
    <div class="echarts" v-if="reloadVal">
      <div style="width:100%;height:100%" ref="sctterMap"></div>
      <div class="mapChoose">
        <span v-for="(item,index) in parentInfo" :key="item.code" class="titleBox">
          <span class="title" @click="chooseArea(item,index)">{{ item.cityName == '全国' ? '湖北' : item.cityName }}</span>
          <span class="icon" v-show="index+1!=parentInfo.length">></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import resize from "./mixins/resize";
import {getAreaMachine, getAreaWork,} from "../../api/agridata";
import {mapState, mapMutations, mapGetters} from "vuex";
import {dateFormat, filterDict} from "../../util/util";
import {map} from '@/util/map'

export default {
  name: "sctterMap",
  mixins: [resize],
  props: {
    title: {
      type: String,
      default: '农机'
    }
  },
  data() {
    return {
      reloadVal: true,
      workData: [
        {name: '耕整作业', value: '', prop: 'tillageAndLandPreparation'},
        {name: '种植作业', value: '', prop: 'plantingOperation'},
        {name: '深松整地', value: '', prop: 'jobTypeSubsoiling'},
        {name: '植保作业', value: '', prop: 'plantProtectionOperation'},
        {name: '油菜轮作', value: '', prop: 'jobTypeYoucai'},
        {name: '收获作业', value: '', prop: 'harvestingOperation'},
        {name: '收货后处理', value: '', prop: 'afterTreatment'},
        {name: '秸秆处理', value: '', prop: 'strawTreatment'}
      ],
      city: '武汉市',
      showBox: false,
      myCharts: null,
      geoJson: {
        features: []
      },
      parentInfo: [{
        cityName: "湖北",
        code: 420000
      }],
      isLoad: false,
    };
  },
  mounted() {
    this.init();
    // initEcharts('statisMap', echartOption.statisMapOption);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.domClick)
  },
  watch: {
    "parentInfo": {
      handler(newName, oldName) {
        let obj = {
          province: "",
          city: "",
          county: "",
        }
        let mapCode = this.globalSetting.mapCode ? this.globalSetting.mapCode : 420000;
        if(/0000$/.test(mapCode)){
          obj.province = map[mapCode];
          switch (newName.length) {
            case 1:
              this.setCityAdress(obj);
              break;
            case 2:
              obj.city= this.parentInfo[1].cityName;
              this.setCityAdress(obj);
              break;
            case 3:
              obj.city = this.parentInfo[1].cityName;
              obj.county = this.parentInfo[2].cityName;
              this.setCityAdress(obj);
              break;
            default:
              break;
          }
        }else if(/00$/.test(mapCode)){
          obj.province = map[this.globalSetting.provinceValue];
          obj.city = map[mapCode];
          switch (newName.length) {
            case 1:
              this.setCityAdress(obj);
              break;
            case 2:
              obj.county= this.parentInfo[1].cityName;
              this.setCityAdress(obj);
              break;
            default:
              break;
          }
        }else {
          obj.province = map[this.globalSetting.provinceValue];
          obj.city = map[this.globalSetting.cityValue];
          obj.county = map[mapCode];
          this.setCityAdress(obj);
        }
      },
    },
    "globalSetting.mapCode": {
      handler(newName){
        let obj = {
          province: "",
          city: "",
          county: "",
        }
        let mapCode = newName ? newName : 420000;
        if(/0000$/.test(mapCode)){
          obj.province = map[mapCode];
          this.setCityAdress(obj);
        }else if(/00$/.test(mapCode)){
          obj.province = map[this.globalSetting.provinceValue];
          obj.city = map[mapCode];
          this.setCityAdress(obj);
        }else {
          obj.province = map[this.globalSetting.provinceValue];
          obj.city = map[this.globalSetting.cityValue];
          obj.county = map[mapCode];
          this.setCityAdress(obj);
        }
        this.init();
      },
      immediate: false,
    }
  },
  computed: {
    ...mapState(["cityAdress"]),
    ...mapGetters(['globalSetting'])
  },
  methods: {
    ...mapMutations(["setCityAdress"]),
    reload() {
      this.reloadVal = false;
      this.$nextTick(() => {
        this.reloadVal = true;
      })
    },
    //根据设置mapcode获取地图数据
    init(){
      let mapCode = this.globalSetting.mapCode ? this.globalSetting.mapCode : 420000;
      let cityName = map[mapCode];
      this.parentInfo[0].code = mapCode;
      this.parentInfo[0].cityName = cityName;
      //console.log("this.globalSetting",this.globalSetting)
      this.getGeoJson(mapCode);
    },
    //获取地图Json数据
    getGeoJson(adcode) {
      let that = this;
      AMapUI.loadUI(["geo/DistrictExplorer"], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
          if (error) {
            console.error(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          let localJson = [areaNode.getParentFeature()]
          if (Json.length > 0) {
            that.geoJson.features = Json;
          } else if (Json.length === 0) {
            that.geoJson.features = localJson;
            /*that.geoJson.features = that.geoJson.features.filter(
              item => item.properties.adcode == adcode
            );*/
            if (that.geoJson.features.length === 0) return;
          }
          that.getMapData();
        });
      });
    },
    //农机统计
    async getAreaMachine(){
      this.isLoad = true;
      let res = await getAreaMachine(Object.assign({},this.cityAdress));
      let {code, data, msg} = res;
      let obj={};
      if (!code) {
        data.groupNames.forEach((item,index)=>{
          obj[item] = data.datas[index];
        })
        this.isLoad = false;
        this.$emit('getAreaData', data)
      } else {
        this.isLoad = false;
      }
      return obj;
    },
    //作业统计
    async getAreaWork(){
      this.isLoad = true;
      let startTime = new Date();
      startTime.setDate(1);
      startTime.setMonth(0);
      startTime.setHours(0,0,0,0);
      startTime = dateFormat(startTime,"yyyy-MM-dd hh:mm:ss");

      let endTime = new Date();
      endTime.setFullYear(endTime.getFullYear()+2);
      endTime.setDate(0);
      endTime.setMonth(-1);
      endTime.setHours(23,59,59,0);
      endTime = dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");
      let res = await getAreaWork(Object.assign({
        startTime: startTime,
        endTime: endTime,
/*        jobType: "4",*/
      },this.cityAdress))
      let obj={};
      if(res.result == "success"){
        if(res.mapData && res.mapData.length){
          res.mapData.forEach(item=>{
            obj[item.name] = item.value
          })
        }
        this.isLoad = false;
        this.$emit('getAreaData', res)
      } else {
        this.isLoad = false;
      }
      return obj;
    },
    //获取数据
    async getMapData() {

      let obj = {}
      if(this.title == '农机'){
        //农机统计
        obj = await this.getAreaMachine();
      } else {
        //作业统计
        obj = await this.getAreaWork();
      }
      //农机统计
      let mapData = this.geoJson.features.map(item => {
        let value = 0;
        if(obj[item.properties.name]){
          value = obj[item.properties.name]
        }
        return {
          name: item.properties.name,
          value: value,
          cityCode: item.properties.adcode
        };
      });
      mapData = mapData.sort(function (a, b) {
        return b.value - a.value;
      });
      this.initEcharts(mapData);
    },
    initEcharts(mapData) {
      var min = mapData[mapData.length - 1].value;
      var max = mapData[0].value;
      this.myChart = echarts.init(this.$refs.sctterMap);
      echarts.registerMap("Map", this.geoJson); //注册
      let mapJson = echarts.getMap('Map').geoJSON;
      let geoCoordMap = {};
      mapJson.features.forEach(item => {
        geoCoordMap[item.properties.name] = item.properties.centroid;
      })
      this.myChart.setOption({
          geo: {
            map: 'Map',
            roam: false,
            zoom: 1.1, //缩放比例
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#023677',
                borderColor: '#238fda',
                borderWidth: 2,
              },
              emphasis: {
                areaColor: '#13CCD4',
                borderWidth: 2,
              },
            },
            select: {
              label: {
                show: true,
                color: '#fff'
              },
              itemStyle: {
                areaColor: 'rgba(34,81,192,0.7)',
                borderColor: '#2ab8ff',
                borderWidth: 2,
              }
            },
            zlevel: 1,
          },
          visualMap: {
            min: min,
            max: max,
            left: "0%",
            top: "10%",
            calculable: true,
            seriesIndex: [0],
            inRange: {
              color: ['#003db8', '#00bfd0'] // 蓝绿
            },
            textStyle: {
              color: "#24CFF4"
            }
          },
          series: [
            {
              geoIndex: 0,
              name: "地图",
              type: "map",
              map: "Map",
              roam: true, //是否可缩放
              zoom: 1.2, //缩放比例
              data: mapData,
              label: {
                normal: {
                  show: true,
                  color: "rgb(249, 249, 249)", //省份标签字体颜色
                  formatter: p => {
                    return p.name;
                  }
                },
                emphasis: {
                  show: true,
                  color: "rgb(249, 249, 249)", //省份标签字体颜色
                }
              },
              itemStyle: {
                normal: {
                  areaColor: 'rgba(6,46,96,0.2)',
                  borderColor: '#',
                  shadowColor: 'rgba(25,164,243,1)',//外发光
                  shadowBlur: 20,
                  borderWidth: 2,
                },
                emphasis: {
                  areaColor: '#066e6e',
                  borderWidth: 2,
                },
              },
              select: {
                label: {
                  show: true,
                  color: '#fff'
                },
                itemStyle: {
                  areaColor: 'rgba(34,81,192,0.7)',
                  borderColor: '#2ab8ff',
                  shadowColor: 'rgba(25,164,243,1)',//外发光
                  shadowBlur: 20,
                  borderWidth: 2,
                }
              },
            },
          ]
        },
        true
      );
      let that = this;
      this.myChart.off("click");
      this.myChart.on("click", params => {
        if (
          that.parentInfo[that.parentInfo.length - 1].code ==
          params.data.cityCode
        ) {
          return;
        }
        if(this.isLoad){
          return;
        }
        let data = params.data;
        that.parentInfo.push({
          cityName: data.name,
          code: data.cityCode
        });
        that.getGeoJson(data.cityCode);
      });
    },

    //选择切换市县
    chooseArea(val, index) {
      if (this.parentInfo.length === index + 1) {
        return
      }
      this.parentInfo.splice(index + 1)
      this.getGeoJson(this.parentInfo[this.parentInfo.length - 1].code);
    },

    close() {
      this.showBox = false
    }
  }
};
</script>
<style lang="less" scoped>
.pbw_echartsflexbox{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}
.echarts {
  width:95%;
  height: 75%;
  margin-top: 50px;

  .statisMap {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
  }
}

.mapChoose {
  position: absolute;
  left: 5%;
  top: 5%;
  color: #eee;


  .titleBox {
    position: relative;
    margin-right: 30px;
  }

  .title {
    padding: 5px;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    top: -5px;
    font-family: "simsun";
    font-size: 22px;
    margin: 0 11px;
  }
}

.box {
  position: absolute;
  top: 0px;
  width: 320px;
  height: 294px;
  border: 1px solid #64bfff;
  background: rgba(6, 27, 58, 0.8);
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

    .close-container {
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
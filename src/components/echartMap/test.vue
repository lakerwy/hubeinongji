<template>
  <div class="echarts">
    <div style="width:100%;height:100%" ref="myEchart"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
//   import '../../node_modules/echarts/map/js/world.js'
import './js/china' // 引入中国地图数据
export default {
  name: "echarts",
  props: ["userJson"],
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chinaConfigure();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    chinaConfigure() {
      console.log(this.userJson)
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({ // 进行相关配置
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        dataRange: {
          show: false,
          min: 0,
          max: 1000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        series: [
          {
            geoIndex: 0,
            name: '地图',
            type: "map",
            map: "china",
            roam: true,
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
                areaColor: '#12235c',
                borderColor: '#2ab8ff',
                shadowColor: '#092f8f',//外发光
                shadowBlur: 20,
                borderWidth: 1.5,
              },
              emphasis: {
                areaColor: '#2AB8FF',
                borderWidth: 0,
              },
            },
            select: {
              label: {
                show: true,
                color: '#fff'
              },
              itemStyle: {
                areaColor: '#2AB8FF',
                borderWidth: 0,
              }
            },
          },
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
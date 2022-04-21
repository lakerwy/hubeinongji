<template>
<!-- 作业工况组件 -->
  <div class="quanlity-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div class="active" >
            <img src="img/monitoring/icon-title.png" alt="">
            <span>作业质量监控</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon_unfolded.png" alt="">
        </el-button>
      </div>

      <div class="quanlity-con" id="quanlity"></div>
    </el-card>
  </div>
</template>

<script>
import chartOptions from './chart'
import { initEcharts } from '@/util/chart.js'
import { getMachineQuality } from '@/api/monitoring/index'
export default {
  name: 'quanlityBox',
  data() {
    return {
      types: [
        {type: '发动机工作时间 ( H )', value: 35},
        {type: '转速 ( r/min )', value: 1},
        {type: '扭矩百分比 ( % )', value: 0},
        {type: '发动机故障数量', value: 9},
        {type: '油门踏板位置', value: 7},
        {type: '冷却液温度 (℃)', value: 0},
        {type: '机油压力 (Kpa)', value: 0},
        {type: '燃油率 ( L/H )', value: 5},
      ],
      listData: sessionStorage.getItem('currentCar') ? JSON.parse(sessionStorage.getItem('currentCar')) : {},
    }
  },
  created() {
  },
  mounted() {
    this.initData();
    // initEcharts('quanlity', chartOptions)
  },
  methods: {
    async initData() {
      let params = {
        // machineId: this.listData.machineId,
        machineId: '1000000003631',
        pointTime: '2021-04-08 11:36:09'
      }
      let res = await getMachineQuality(params);
      const {code, data} = res;
      if(code == 0) {
        let timeList = [];
        let dataList = [];
        if(data.length > 0) {
          data.map(item => {
            timeList.push(item.time.slice(11, -3));
            dataList.push(item.jobHeight);
          })
        }
        this.$set(chartOptions.xAxis[0], 'data', timeList);
        this.$set(chartOptions.series[0], 'data', dataList);
        initEcharts('quanlity', chartOptions)
      }
    },
    // 收起面板
    close() {

    }
  }
}
</script>

<style lang="less" scoped>
.quanlity-box {
  width: 400px;
  // height: 350px;
  height: 35%;
  .box-card {
    background: @base-darkBlue;
    height: 100%;
    .clearfix:after {
      clear: both
    }
    .search-type {
      display: inline-flex;
      line-height: 48px;
      color: @base-fontColor;
      div {
        width: 128px;
        cursor: pointer;
        img {
          vertical-align: sub;
          margin-right: 5px;
        }
      }
      .active {
        color: #2d7de9;
      }
    }
    .quanlity-con {
      height: 100%;
    }
  }
  /deep/ .el-card__body {
    padding: 0;
    height: calc(100% - 48px);
  }
}
</style>
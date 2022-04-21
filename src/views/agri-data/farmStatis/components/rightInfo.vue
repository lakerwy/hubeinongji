<template>
  <div class="rightInfo">
    <ContentBox
      class="box1"
      :headName="'区域统计'"
    >
      <section>
        <div id="areaStatis" class="areaStatis"></div>
        <div class="changeBtn">
          <div :class="currentIndex == 0?'active':''" @click="setMachiner">农机</div>
          <div :class="currentIndex == 1?'active':''" @click="setCooper">合作社</div>
        </div>
      </section>
    </ContentBox>
    <ContentBox
      class="box2"
      :headName="'安装趋势统计'"
    >
      <section>
        <div id="installTrend" class="installTrend"></div>
      </section>
    </ContentBox>
    <ContentBox
      class="box3"
      :headName="'终端品牌统计'"
    >
      <section>
        <div id="terminal" class="terminal"></div>
      </section>
    </ContentBox>
  </div>
</template>

<script>
import ContentBox from "../../../../components/contenBox";
import {initEcharts} from "../../../../util/chart"
import optionChart from "./optionChart"
import {
  getAreaCooperative,
  getAreaMachine,
  getBrand,
  getInstallTrend,
  getTerminalBrand
} from "../../../../api/agridata";
import {mapState} from "vuex";

export default {
  name: "rightInfo",
  components: {
    ContentBox
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  mounted() {
    this.initChart();
    // initEcharts('areaStatis', optionChart.areaOption);
    // initEcharts('installTrend', optionChart.installOption);
    // initEcharts('terminal', optionChart.terminalOption)
  },
  computed: {
    ...mapState(["cityAdress"]),
  },
  watch: {
    "cityAdress": {
      handler(newName, oldName) {
        this.initChart();
      },
    }
  },
  methods: {
    initChart() {
      this.getAreaMachine();
      this.getInstallTrend();
      this.getBrand();
    },
    //切换农机合作社
    setMachiner() {
      this.currentIndex = 0;
      this.getAreaMachine();
    },
    setCooper() {
      this.currentIndex = 1;
      this.getAreaCooperative();
    },
    //区域农机，合作社统计
    async getAreaMachine() {
      let res = await getAreaMachine(Object.assign({},this.cityAdress));
      if (res.success) {
        this.$set(optionChart.areaOption.series[0], 'name', "农机数量(辆)");
        this.$set(optionChart.areaOption.xAxis, 'data', res.groupNames);
        this.$set(optionChart.areaOption.series[0], 'data', res.datas);

        initEcharts('areaStatis', optionChart.areaOption);

        let obj={};
        res.groupNames.forEach((item,index)=>{
          obj[item] = res.datas[index];
        })
        return obj
      }
    },
    async getAreaCooperative() {
      let res = await getAreaCooperative(Object.assign({},this.cityAdress));
      if (res.success) {
        this.$set(optionChart.areaOption.series[0], 'name', "合作社数量");
        this.$set(optionChart.areaOption.xAxis, 'data', res.groupNames);
        this.$set(optionChart.areaOption.series[0], 'data', res.datas);

        initEcharts('areaStatis', optionChart.areaOption);
      }
    },
    //安装趋势
    async getInstallTrend() {
      let res = await getInstallTrend(Object.assign({},this.cityAdress));
      if (res.success) {
        let name = [], value = [];
        res.data.forEach(item => {
          name.push(item.key);
          value.push(item.data)
        })
        this.$set(optionChart.installOption.xAxis[0], 'data', name);
        this.$set(optionChart.installOption.series[0], 'data', value);

        initEcharts('installTrend', optionChart.installOption);
      }
    },
    ////终端品牌统计
    async getBrand() {
      let res = await getTerminalBrand(Object.assign({},this.cityAdress));
      if (res.success) {
        let yAxis1 = [], yAxis2 = [], series1 = [], series2 = [];
        let temp = res.data.map(item => {
          return {
            name: item.key,
            value: item.data,
          }
        })
        series1 = temp.slice(0,4);
        series2 = temp.slice(4);
        yAxis1 = series1.map(item=>item.name);
        yAxis2 = series2.map(item=>item.name);

        this.$set(optionChart.terminalOption.xAxis[1], 'max', series1[0].value);
        this.$set(optionChart.terminalOption.yAxis[0], 'data', yAxis1);
        this.$set(optionChart.terminalOption.yAxis[1], 'data', yAxis2);
        this.$set(optionChart.terminalOption.series[0], 'data', series1);
        this.$set(optionChart.terminalOption.series[1], 'data', series2);

        initEcharts('terminal', optionChart.terminalOption)
      }
    }

  }
}

</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.rightInfo {
  .box1 {
    height: 280 / @vh;
    position: relative;
    border: 1px solid #07335d;

    .areaStatis {
      position: absolute;
      top: 20 / @vh;
      width: 477px;
      height: 260 / @vh;
    }

    .changeBtn {
      position: absolute;
      top: 22 / @vh;
      left: 200px;
      display: flex;

      > div {
        cursor: pointer;
        width: 61px;
        height: 28 / @vh;
        margin-right: 12px;
        border: 1px solid #055A9B;
        text-align: center;
        line-height: 28 / @vh;
        color: #67c8ff  ;
        box-shadow: 0px 1px 8px #03548D inset;
      }

      .active {
        border: 1px solid #08DCDC;
        color: #08DCDC;
        box-shadow: 0px 1px 8px #08DCDC inset;
      }
    }
  }

  .box2 {
    margin-top: 10 / @vh;
    height: 280 / @vh;
    border: 1px solid #07335d;
    position: relative;

    .installTrend {
      position: absolute;
      top: 20 / @vh;
      width: 477px;
      height: 260 / @vh;
    }
  }

  .box3 {
    margin-top: 10 / @vh;
    height: 300 / @vh;
    border: 1px solid #07335d;
    position: relative;

    .terminal {
      position: absolute;
      top: 20 / @vh;
      width: 477px;
      height: 260 / @vh;
    }
  }
}
</style>
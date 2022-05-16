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
      currentIndex: 1,
    }
  },
  mounted() {
    // //console.log(this.currentIndex);
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
      // this.getAreaMachine();
      this.getInstallTrend();
      this.getBrand();
      // this.setMachiner();
      // this.getAreaCooperative();
      this.setCooper();
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
    getMachineNum(data){
      this.$set(optionChart.areaOption.series[0], 'name', "农机数量(辆)");
      this.$set(optionChart.areaOption.xAxis, 'data', data.groupNames);
      this.$set(optionChart.areaOption.series[0], 'data', data.datas);
      //initEcharts('areaStatis', optionChart.areaOption);
    },
    //区域农机，合作社统计
    async getAreaMachine() {
      let res = await getAreaMachine(Object.assign({},this.cityAdress));
      let {code, data, msg} = res;
      if (!code) {
        this.$set(optionChart.areaOption.series[0], 'name', "农机数量(辆)");
        this.$set(optionChart.areaOption.xAxis, 'data', data.groupNames);
        this.$set(optionChart.areaOption.series[0], 'data', data.datas);

        initEcharts('areaStatis', optionChart.areaOption);
      }
    },
    async getAreaCooperative() {
      let res = await getAreaCooperative(Object.assign({},this.cityAdress));
      let {code, data, msg} = res;
      if (!code) {
        this.$set(optionChart.areaOption.series[0], 'name', "合作社数量");
        this.$set(optionChart.areaOption.xAxis, 'data', data.groupNames);
        this.$set(optionChart.areaOption.series[0], 'data', data.datas);
        this.$emit("setCooperData",data.totalCooperativeCount)

        initEcharts('areaStatis', optionChart.areaOption);
      }
    },
    //安装趋势
    async getInstallTrend() {
      let res = await getInstallTrend(Object.assign({},this.cityAdress));
      let {code, data, msg} = res;
      if (!code) {
        let name = [], value = [];
        data.data.forEach(item => {
          name.push(item.key);
          value.push(item.data)
        })
        this.$set(optionChart.installOption.xAxis[0], 'data', name);
        this.$set(optionChart.installOption.series[0], 'data', value);

        initEcharts('installTrend', optionChart.installOption);
      }
      if(data.msg){
        let len = optionChart.installOption.xAxis[0].data.length;
        let value = [];
        for(let i = 0;i<len;i++){
          value.push(0);
        }
        this.$set(optionChart.installOption.series[0], 'data', value);
        initEcharts('installTrend', optionChart.installOption);
      }
    },
    ////终端品牌统计
    async getBrand() {
      let res = await getTerminalBrand(Object.assign({},this.cityAdress));
      let {code, data, msg} = res;
      if (!code) {
        let yAxis1 = [], yAxis2 = [], series1 = [], series2 = [];
        let temp = data.data.map(item => {
          return {
            name: item.key,
            value: item.data,
          }
        })
        series1 = temp.slice(0,4);
        series2 = temp.slice(4);
        yAxis1 = series1.map(item=>item.name);
        yAxis2 = series2.map(item=>item.name);

        //console.log(series2);
        if(document.body.scrollWidth < 1920){
          if(series2.length == 0){
            document.querySelector(".terminal").style.setProperty("min-width","0");
            initEcharts("terminal", optionChart.terminalOption,true);
          }else{
            document.querySelector(".terminal").style.setProperty("min-width","460px");
            initEcharts("terminal", optionChart.terminalOption,true);
          }
        }

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
@Font-size:14 / @vw;
.rightInfo {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  .box1{
    margin-top: 20px;
    box-sizing: border-box;
  }

  .box2,.box3{
    margin-top: 2%;
    box-sizing: border-box;
  }

  .box1 {
    section{
      height: 100%;
    }

    height: 33%;
    position: relative;
    border: 1px solid #07335d;

    .areaStatis {
      position: absolute;
      top: 22px;
      width: 100%;
      height: calc(99% - 22px);
    }

    .changeBtn {
      position: absolute;
      top: 22px;
      left: 45%;
      display: flex;

      > div {
        // font-size: @Font-size;
        font-size: 13px;
        cursor: pointer;
        margin-right: 12px;
        border: 1px solid #055A9B;
        text-align: center;
        padding: 5px;
        color: #67c8ff;
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
    section{
      height: 100%;
    }

    height: 28%;
    position: relative;
    border: 1px solid #07335d;

    .installTrend {
      position: absolute;
      top: 22px;
      width: 100%;
      // height: 99%;
      height: calc(99% - 22px);
    }
  }

  .box3 {
    section{
      height: calc(100% - 22px);
      width: 100%;
      overflow: scroll;
      position: absolute;
      top: 22px;
    }

    height: 32%;
    position: relative;
    border: 1px solid #07335d;

    .terminal {
      width: 100%;
      height: 95%;
    }
  }
}
</style>
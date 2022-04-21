<template>
<div class="leftInfo">
   <ContentBox class="box1" :headName="'农机状态统计'">
      <section class="dash-board-container">
        <div id="online" class="trunk-online"></div>
        <div class="detail-container">
          <div class="detail" v-for="(item,index) in details" :key="index">
            <div>{{ item.name }}</div>
            <div class="number-container">
              <span class="number">{{ item.count }}</span
              >辆
            </div>
          </div>
        </div>
        <div class="total">
          <div>农机总数</div>
          <div class="total-number">{{ allMachineCount }}</div>
          <div>辆</div>
        </div>
      </section>
    </ContentBox>
  <ContentBox
    class="box2"
    :headName="'农机分类统计'"
  >
    <section>
      <div id="agricul" class="agricul"></div>
    </section>
  </ContentBox>
  <ContentBox
    class="box3"
    :headName="'机具分类统计'"
  >
    <section>
      <div id="tools" class="tools"></div>
    </section>
  </ContentBox>
</div>
</template>

<script>
import ContentBox from "../../../../components/contenBox";
import leftChart from "./optionChart";
import { initEcharts } from "../../../../util/chart";
import {getOnlineMachine, getStaticClass, getToolsClass} from "../../../../api/agridata";
import {mapState} from "vuex";
export default {
  components: {
    ContentBox
  },
  data() {
    return {
      allMachineCount: 0,
      details: [
        {
          name: "在线农机",
          count: 0,
        },
        {
          name: "离线农机",
          count: 0,
        },
        {
          name: "报警农机",
          count: 0,
        },
      ],
    };
  },
  mounted(){
    this.initChart();
    // initEcharts("online", leftChart.LeftOption);
    // initEcharts('agricul', leftChart.agriculOption);
    // initEcharts('tools', leftChart.machToolOption);
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
    initChart(){
      this.getMachineNum();
      this.getStaticClass();
      this.getToolsClass();
    },
    //获取在线农机数
    async getMachineNum(){
      let res = await getOnlineMachine(Object.assign({},this.cityAdress));
      if(res.success){
        this.allMachineCount = res.machineAllCount;
        this.details[0].count = res.machineOnlineCount;
        this.details[1].count = res.machineLongOfflineCount;
        this.details[2].count = res.machineWarningCount;

        let value1 = this.detailNumber(res.machineOnlineCount,res.machineAllCount);
        let value2 = this.detailNumber(res.machineLongOfflineCount,res.machineAllCount);
        let value3 = this.detailNumber(res.machineWarningCount,res.machineAllCount);

        this.$set(leftChart.LeftOption.series[0].data[0],'value',value1);
        this.$set(leftChart.LeftOption.series[1].data[0],'value',value2);
        this.$set(leftChart.LeftOption.series[2].data[0],'value',value3);

        this.$emit('getInfo',res)

        initEcharts("online", leftChart.LeftOption);
      }
    },
    detailNumber(val,all){
      let num = Number((val / all)*100).toFixed(1)
      return Number(num)
    },
    //获取农机分类统计
    async getStaticClass(){
      let res = await getStaticClass(Object.assign({},this.cityAdress));
      if(res.success){
        this.$set(leftChart.agriculOption.series[0],'data',res.data)

        initEcharts('agricul', leftChart.agriculOption);
      }
    },
    //获取具分类统计
    async getToolsClass(){
      let res = await getToolsClass(Object.assign({},this.cityAdress));
      if(res.success){
        let name = [],value = [];
        res.data.forEach(item => {
          name.push(item.toolTypeName);
          value.push(item.toolNumber)
        })
        this.$set(leftChart.machToolOption.yAxis[0],'data',name);
        this.$set(leftChart.machToolOption.series[0],'data',value);

        initEcharts('tools', leftChart.machToolOption);
      }
    }

  },
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.leftInfo {
  .box1 {
    height: 280 / @vh;
    position: relative;
    border: 1px solid #07335d;
  }
  .box2 {
    margin-top: 10 / @vh;
    height: 280 / @vh;
    border: 1px solid #07335d;
    .agricul {
      height: 250 / @vh;
    }
  }
  .box3 {
    margin-top: 10 / @vh;
    height: 300 / @vh;
    border: 1px solid #07335d;
    .tools {
      height: 270 / @vh;
    }
  }
}

.dash-board-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 480px;
  margin-top: 18px;
  .trunk-online {
    width: 480px;
    height: 75 / @vh;
    margin-bottom: 8px;
  }
  .detail-container {
    font-size: 14px;
    width: 480px;
    color: #80c5ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    .detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      .number-container {
        margin-top: 8px;
        .number {
          font-size: 26px;
          color: #ffffff;
          font-style: italic;
          margin-right: 5px;
        }
      }
    }
  }
  .total {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #105188;
    height: 35 / @vh;
    width: 380px;
    margin-top: 5px;
    justify-content: center;
    font-size: 16px;
    color: #75b5ec;
    font-weight: 600;
    background-image:url("../../../../assets/images/trunk-total-background.png");
      .total-number {
      margin-left: 20px;
      margin-right: 20px;
      color: #ffffff;
      font-size: 28px;
      font-weight: 200px;
      font-style: italic;
      text-shadow: 0px 0px 10px #308cfc;
    }
  }
}
</style>
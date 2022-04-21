<template>
  <div class="rightInfo">
    <ContentBox
      class="box1"
      :headName="'区域作业统计'"
    >
      <section>
        <div id="areaWork" class="deepLoosen"></div>
      </section>
    </ContentBox>
    <ContentBox
      class="box2"
      :headName="'历史作业统计'"
    >
      <section>
        <div id="history" class="history"></div>
      </section>
    </ContentBox>
<!--    <ContentBox2-->
<!--      class="box2"-->
<!--      :headName="'区域作业统计'"-->
<!--      :headName2="'历史作业统计'"-->
<!--      :currentIndex='currentIndex'-->
<!--      @chooseIndex="chooseIndex"-->
<!--    >-->
<!--      <section>-->
<!--        <div id="areaWork" class="history areaWork" v-show="currentIndex==0"></div>-->
<!--        <div  id="history" class="history" v-show="currentIndex==1"></div>-->
<!--      </section>-->
<!--    </ContentBox2>-->
  </div>
</template>

<script>
import ContentBox from "../../../../components/contenBox";
import ContentBox2 from "../../../../components/contenBox/historyIndex";
import {initEcharts} from "../../../../util/chart"
import rightChart from "./rightChart"
import {getAreaWork, getStatJobArea, getStatSubsoilingArea} from "../../../../api/agridata";
import {valueTofixed} from "../../../../util/util";
import { mapState, mapMutations } from "vuex";

export default {
  name: "rightInfo",
  components: {
    ContentBox,
  },
  data(){
    return{
      currentIndex: 0,
    }
  },
  mounted(){
    this.initChart();
    // initEcharts('deepLoosen', rightChart.importAndexportOptions);
    // initEcharts('areaWork', rightChart.areaWorkOption);
    // initEcharts('history', rightChart.importAndexportOptions);
  },
  computed: {
    ...mapState(["cityAdress"]),
  },
  watch: {
    "cityAdress": {
      handler(newName, oldName) {
        this.getStatSubsoilingArea();
        this.getStatJobArea();
      },
    }
  },
  methods: {
    initChart(){
      // this.getStatSubsoilingArea()
      this.getStatJobArea();
      this.getAreaWork();
    },
    //区域作业统计
    async getAreaWork(){
      let res = await getAreaWork(Object.assign({
        startTime: "2021-01-01",
        endTime: "2021-10-01",
        jobType: "4",
      },this.cityAdress))
      if(res.result == "success"){
        this.$set(rightChart.areaWorkOption.yAxis[0], 'data', res.barYAxis);
        this.$set(rightChart.areaWorkOption.series[0], 'data', res.barYAxisData);

        initEcharts('areaWork', rightChart.areaWorkOption);

        let obj = {};
        res.mapData.forEach(item=>{
          obj[item.name] = item.value
        })
        return obj;
      }
    },
    //深松统计
    async getStatSubsoilingArea(){
      let res = await getStatSubsoilingArea(Object.assign({
        jobType: "",
        yearNum: 5
      },this.cityAdress));
      if(res.success){
        let name = [], value = [];
        res.data.forEach(item => {
          name.push(item.year);
          value.push(valueTofixed(item.data))
        })
        this.$set(rightChart.importAndexportOptions.xAxis[0], 'data', name);
        rightChart.importAndexportOptions.series.forEach(item=>{
          this.$set(item,'data',value)
        })

        initEcharts('deepLoosen', rightChart.importAndexportOptions);
      }
    },
    //历史作业面积
    async getStatJobArea(){
      let res = await getStatJobArea(Object.assign({
        jobType: "",
        yearNum: 5
      },this.cityAdress))
      if(res.success){
        let year=[],allData=[],successData=[];
        res.data.forEach(item => {
          year.push(item.year);
          allData.push(valueTofixed(item.allData));
          successData.push({
            name: item.successRate,
            value: valueTofixed(item.successData)
          });
        })

        this.$set(rightChart.importAndexportOptions.xAxis[0], 'data', year);
        rightChart.importAndexportOptions.series.forEach(item=>{
          this.$set(item,'data',allData)
        })

        initEcharts('history', rightChart.importAndexportOptions);
      }
    },
    chooseIndex(i){
      this.currentIndex = i;
    }
  }
}

</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.rightInfo {
  .box1 {
    //height: 354 / @vh;
    height: 526 / @vh;
    position: relative;
    border: 1px solid #07335d;

    .deepLoosen {
      height: 500 / @vh;
      //height: 330 / @vh;
      position: absolute;
      top: 20 / @vh;
      width: 477px;
    }
  }

  .box2 {
    margin-top: 10 / @vh;
    //height: 526 / @vh;
    height: 354 / @vh;
    border: 1px solid #07335d;
    position: relative;

    .history {
      //height: 500 / @vh;
      position: absolute;
      top: 20 / @vh;
      height: 330 / @vh;
      width: 477px;
    }
  }

}
</style>
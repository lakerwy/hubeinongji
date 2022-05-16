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
  </div>
</template>

<script>
import ContentBox from "../../../../components/contenBox";
import ContentBox2 from "../../../../components/contenBox/historyIndex";
import {initEcharts} from "../../../../util/chart"
import rightChart from "./rightChart"
import {getAreaWork, getStatJobArea, getStatSubsoilingArea} from "../../../../api/agridata";
import {dateFormat, valueTofixed} from "../../../../util/util";
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
      // this.getAreaWork();
    },
    getWorkNum(res){
      //console.log(res);
      // if(document.body.scrollWidth < 1920){
      //   if(res.barYAxisData.length != 0){
      //     document.querySelector(".deepLoosen").style.setProperty("min-width","500px");
      //   }else{
      //     document.querySelector(".deepLoosen").style.setProperty("min-width","0");
      //   }
      // }

      if (res.result == "success") {
        this.$set(rightChart.areaWorkOption.yAxis[0], 'data', res.barYAxis);
        this.$set(rightChart.areaWorkOption.yAxis[1], 'data', res.barYAxisData);
        this.$set(rightChart.areaWorkOption.series[0], 'data', res.barYAxisData);

        initEcharts('areaWork', rightChart.areaWorkOption,true);
      }
    },
    //区域作业统计
    async getAreaWork(){
      let year = new Date().getFullYear();
      //去当年的区域统计
      /*let startTime = dateFormat(new Date(new Date().setFullYear(year)),"yyyy-MM-dd hh:mm:ss");
      let endTime = dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss");*/
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
        jobType: "4", //不是深松，是全部
      },this.cityAdress))

      if(res.result == "success"){
        this.$set(rightChart.areaWorkOption.yAxis[0], 'data', res.barYAxis);
        this.$set(rightChart.areaWorkOption.yAxis[1], 'data', res.barYAxisData);
        this.$set(rightChart.areaWorkOption.series[0], 'data', res.barYAxisData);

        initEcharts('areaWork', rightChart.areaWorkOption);
      }
    },
    //深松统计
    async getStatSubsoilingArea(){
      let res = await getStatSubsoilingArea(Object.assign({
        jobType: "",
        yearNum: 5
      },this.cityAdress));
      let {code, data, msg} = res;
      if(!code){
        let name = [], value = [];
        data.data.forEach(item => {
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
      let {code, data, msg} = res;
      if(!code){
        let year=[],allData=[],successData=[];
        data.data.forEach(item => {
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  .box1 {
    margin-top: 20px;
    section{
      height: calc(100% - 22px);
      width: 100%;
      overflow: scroll;
      position: absolute;
      top: 22px;
    }

    height: 54%;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #07335d;

    .deepLoosen {
      height: 95%;
      width: 100%;
    }
  }

  .box2 {
    margin-top: 2%;
    section{
      height: 100%;
    }

    height: 40%;
    box-sizing: border-box;
    border: 1px solid #07335d;
    position: relative;

    .history {
      position: absolute;
      top: 22px;
      height: 95%;
      width: 98%;
    }
  }

}
</style>
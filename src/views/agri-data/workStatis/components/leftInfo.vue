<template>
  <div class="leftInfo">
    <ContentBox
      class="box1"
      :headName="'作业面积统计'"
    >
      <section>
        <div id="installTrend2" class="installTrend"></div>
      </section>
    </ContentBox>
    <ContentBox
      class="box2"
      :headName="'当年作业统计'"
    >
      <section class="work">
        <span class="unit">单位：亩</span>
        <div class="statis">
        <ul>
          <vue-seamless-scroll
            :data="workData"
            class="seamless-warp"
            :class-option="classOption"
          >
            <li v-for="(item,index) in workData" :key="index" :class="getWorkClass(index)">
              <div class="item-list">
                <div class="item-title" :style="{color: textColor[index%4]}">
                  <span style="font-family: SourceHanSansCN-Bold;">{{ item.jobTypeName }}</span></div>
                <div class="item-content">
                  <div class="item-statis">
                    <div class="num">{{ item.completedJobArea }}</div>
                    <div>累计已完成</div>
                  </div>
                  <div class="item-statis">
                    <div class="num">{{ item.yesterdayJobArea }}</div>
                    <div>昨日已完成</div>
                  </div>
                  <div class="item-statis" v-show="item.planJobArea">
                    <div class="num">{{ item.planJobArea }}</div>
<!--                    <div class="num">15000</div>-->
                    <div>作业总任务</div>
                  </div>
                  <div class="item-statis" v-show="item.planJobArea" :style="{color: textColor[index%4]}">
                    <div class="num2">{{ item.percentage }}</div>
                    <div><i>● </i>完成率</div>
                  </div>
                </div>
              </div>
            </li>
          </vue-seamless-scroll>
        </ul>
        </div>
      </section>
    </ContentBox>
  </div>
</template>

<script>
import ContentBox from "../../../../components/contenBox"
import {initEcharts} from "../../../../util/chart";
import rightChart from "./rightChart";
import {getCurrentYearJob, getJobCompleted, getStatJob,} from "../../../../api/agridata";
import {valueTofixed,dateFormat} from "../../../../util/util";
import { mapState, mapMutations } from "vuex";

export default {
  name: "leftInfo",
  components: {
    ContentBox
  },
  data() {
    return {
      workData: [
      ],
      textColor: ['#19a4ff', '#32c657', '#f5b22d', '#1debff'],
    }
  },
  created() {
    this.initData();
  },
  mounted() {
    this.initChart();
  },
  computed: {
    ...mapState(["cityAdress"]),
    classOption() {
      return {
        step: 0.3, // 数值越大速度滚动越快
        limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        // openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0 // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      };
    }
  },
  watch: {
    "cityAdress": {
      handler(newName, oldName) {
        console.log(newName);
        this.getStatJob();
        this.getCurrentYearJob();
        this.getJobCompleted();
      },
    }
  },
  methods: {
    getWorkClass(index){
      if(index%4==0){
        return 'workBg1'
      } else if(index%4==1){
        return 'workBg2'
      } else if(index%4==2){
        return 'workBg3'
      } else if(index%4==3){
        return 'workBg4'
      }
    },
    initData(){
      this.getStatJob()
    },
    initChart(){
      this.getJobCompleted()
      this.getCurrentYearJob()
    },
    //作业面积统计
    //获取当前时间戳
    getNowTime() {
      return Math.floor(new Date().getTime());
    },
    //获取当日起始时间戳
    getToday() {
      return Math.floor(new Date(new Date().setHours(0, 0, 0, 0)).getTime());
    },
    async getCurrentYearJob(){
      let endTime = dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
      let year = new Date().getFullYear();
      let startTime = dateFormat(new Date(new Date().setFullYear(year-1)),"yyyy-MM-dd hh:mm:ss");
      let res = await getCurrentYearJob(Object.assign({
        startTime: startTime,
        endTime: endTime,
        jobType: ''
      },this.cityAdress))
      if(res.success){
        let name=[],value=[];
        for(let i in res.data){
          let str=i.slice(0,4)+'-'+i.slice(4,6)+'-'+i.slice(6);
          name.push(str);
          value.push(valueTofixed(res.data[i]));
        }
        this.$set(rightChart.installOption2.xAxis[0], 'data', name);
        this.$set(rightChart.installOption2.series[0], 'data', value);

        initEcharts('installTrend2', rightChart.installOption2)
      }
    },
    //当年作业统计
    async getJobCompleted() {
      let res = await getJobCompleted(Object.assign({},this.cityAdress));
      if(res.success){
        this.workData = [];
        res.data.forEach(item=>{
          let percentage = 0;
          if(item.planJobArea){
            percentage = Number(((item.completedJobArea/item.planJobArea)*100).toFixed(0));
            // if(percentage > 100) {
            //   percentage = 100
            // }
            // item.planJobArea = valueTofixed(item.planJobArea)
          }
          // item.completedJobArea = valueTofixed(item.completedJobArea);
          // item.yesterdayJobArea = valueTofixed(item.yesterdayJobArea);
          item.percentage = percentage;
          this.workData.push(item)
        })
      }
    },

    async getStatJob(){
      let res = await getStatJob(Object.assign({},this.cityAdress));
      if(res){
        this.$emit('getCardData', res)
      }
    },
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.leftInfo {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .box1 {
    height: 282 / @vh;
    position: relative;
    border: 1px solid #07335d;

    .installTrend {
      position: absolute;
      top: 20 / @vh;
      width: 477px;
      height: 260 / @vh;
    }
  }

  .box2 {
    margin-top: 10 / @vh;
    height: 593 / @vh;
    border: 1px solid #07335d;

    .work {
      margin-top: 10 / @vh;
      margin-left: 20px;
      color: #aac2d6;
      font-size: 14px;
      position: relative;

      .unit {
        position: absolute;
        right: 40px;
        top: -40px;
      }
      .statis {
        margin-top: 20px;
        width: 100%;
        height: 510 / @vh;
        overflow: hidden;
        .seamless-warp {
          width: 102%;
          height: 510 / @vh;
          overflow: auto;
        }
      }

      .workBg1 {
        background: url("../../../../assets/images/workbg_1.png") no-repeat;
      }

      .workBg2 {
        background: url("../../../../assets/images/workbg_2.png") no-repeat;
      }

      .workBg3 {
        background: url("../../../../assets/images/workbg_3.png") no-repeat;
      }

      .workBg4 {
        background: url("../../../../assets/images/workbg_4.png") no-repeat;
      }
      li {
        width: 443px;
        display: inline-block;
        height: 96 / @vh;
        margin-top: 20px;
        color: #FFFFFF;
        display: flex;
        //border: 1px solid;
        //background: url("../../../../assets/images/workbg_1.png") no-repeat;
        background-size: 100% 100%;
        .item-chart {
          width: 77px;
          height: 100%;
          color: #aac2d6;
          font-size: 14px;
          position: relative;
          >span {
            position: absolute;
            top: 60px;
            left: 20px;
          }
        }

        .item-list {
          margin-left: 28px;
          position: relative;
          .item-title {
            position: absolute;
            top: -9px;
            left: 31px;
            height: 18px;
            font-family: SourceHanSansCN-Bold;
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 20px;
            letter-spacing: 0px;
            color: #37f255;
          }
          .item-content {
            display: flex;
            align-items: center;
            margin-top: 28 / @vh;
            margin-left: 10px;
            color: #80c5ff;
            font-size: 14px;
            .item-statis {
              width: 115px;
              .num {
                font-size: 20px;
                font-style: italic;
                margin-bottom: 6px;
                color: #ffffff;
                text-shadow: rgba(25,164,243,1) 0px 0px 20px;
              }
              .num2 {
                font-size: 20px;
                font-style: italic;
                margin-bottom: 6px;
              }
            }
            .item-statis:nth-child(1){
              margin-left: 0px;
            }
            .item-statis:nth-child(3) {
              width: 100px;
            }

          }
        }

        .title {
          padding-left: 10px;
          font-size: 16px;
          height: 38 / @vh;
          line-height: 38 / @vh;
          background: url("../../../../assets/images/bg_title.png") no-repeat;
          background-size: 100% 100%;
        }

        .content {
          text-align: center;
          font-size: 26px;
          font-style: italic;
          line-height: 64 / @vh;
          text-shadow: 0 0 20px rgba(42, 184, 255, 1);
        }
      }
    }
  }
}
/deep/ .el-progress__text {
  font-family: DINNextW1G-Italic;
  font-size: 18px !important;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
}
</style>
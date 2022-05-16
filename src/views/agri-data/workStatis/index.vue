<template>
  <div class="opera">
    <!-- <section class="left-chart leftBg">
      <LeftInfo @getCardData="getCardData"/>
    </section>
    <section class="right-chart rightBg">
      <RightInfo ref="right" />
    </section>
    <section class="center-chart">
      <SctterMap :title="'作业'" @getAreaData="getAreaData" />
    </section> -->

    <div class="flexBox">
      <section class="left-chart">
        <LeftInfo @getCardData="getCardData"/>
      </section>
      <section class="center-chart">
        <section class="topCards">
          <div class="card" v-for="(item,index) in cardData" :key="index">
            <div class="total" :style="{color: item.totalColor}">
              <span :style="{textShadow: '0 0 20px '+item.totalColor}">{{ item.number }}</span> {{ item.unit }}
            </div>
            <div class="compared">
              {{ item.title }}
            </div>
          </div>
        </section>

        <SctterMap :title="'作业'" @getAreaData="getAreaData" />
      </section>
      <section class="right-chart">
        <RightInfo ref="right" />
      </section>
    </div>
  </div>
</template>

<script>
import LeftInfo from "./components/leftInfo";
import RightInfo from "./components/rightInfo";
import {valueTofixed} from "../../../util/util";
import SctterMap from "../../../components/echartMap/sctterMap"

export default {
  name: "index",
  components: {
    LeftInfo,
    RightInfo,
    SctterMap
  },
  data() {
    return {
      cardData: [
        {number: 0, unit: '万亩', totalColor: '#B7AFFF', title: '当年作业面积'},
        // {number: 0, unit: '时', totalColor: '#3cfad3', title: '当年作业时长'},
        {number: 0, unit: '万时', totalColor: '#3cfad3', title: '当年作业时长'},
        {number: 0, unit: '亩', totalColor: '#F4B351', title: '昨日新增面积'},
        {number: 0, unit: '万亩', totalColor: '#00DCFD', title: '累计作业总面积'}
      ],
    }
  },
  mounted() {
  },
  methods: {
    //获取头部卡片信息
    getCardData(res){
      this.cardData[0].number=valueTofixed(res.currentYearJobArea);
      this.cardData[1].number=valueTofixed(res.jobDuration / 60);
      this.cardData[2].number=res.yesterdayJobArea;
      this.cardData[3].number=valueTofixed(res.totalJobArea);
    },
    getAreaData(res){
      this.$refs.right.getWorkNum(res);
    }
  }
}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.opera {
  position: relative;
  height: 100%;

  .flexBox{
    width: 100%;
    height: 100%;
    // height: calc(100% - 69px);
    // min-width: 1500px;
    // min-height: 745px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    section{
      height: 100%;
    }
  }

  .left-chart, .right-chart {
    width: 25%;
    height: calc(100vh - 69px);
  }

  .center-chart {
    box-sizing: border-box;
    padding: 0 30px;
    .topCards {
      width: 100%;
      height: 100px;
      padding-top: 20px;
      display: flex;
      justify-content: space-around;

      .card {
        width: 23%;
        border: 1px solid #1562ac;
        box-sizing: content-box;
        box-shadow: 0px 1px 19px #1562ac inset;

        .total {
          padding: 10px 0 5px 0;
          text-align: center;
          color: #B7AFFF;

          span {
            padding-right: 5px;
            font-size: 32px;
            font-style: italic;
            text-shadow: 0 0 20px #B7AFFF;
          }
        }

        .compared {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #fff;

          span {
            font-size: 14px;
            color: #70afe5;
            padding-left: 10px;

            i {
              color: #17af6e;
            }
          }
        }
      }
    }

    width: 50%;
    height: calc(100vh - 69px);
    display: flex;
    flex-direction: column;

    .mapChart {
      width: 100%;
      height: 100%;
    }
  }
}

</style>
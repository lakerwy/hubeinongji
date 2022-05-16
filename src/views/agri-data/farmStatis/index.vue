<template>
  <div class="opera">
    <!-- <section class="left-chart leftBg">
      <LeftInfo @getInfo="getInfo"/>
    </section>
    <section class="right-chart rightBg">
      <RightInfo ref="rightChart" />
    </section>
    <section class="center-chart">
      <SctterMap :title="'农机'" @getAreaData="getAreaData" />
    </section> -->


    <div class="flexBox">
      <section class="left-chart">
        <LeftInfo @getInfo="getInfo"/>
      </section>
      <section class="center-chart">
        <section class="topCards">
          <div class="card" v-for="(item,index) in cardData" :key="index">
            <div class="total" :style="{color: item.totalColor}">
              <span :style="{textShadow: '0 0 20px '+item.totalColor}">{{ item.number }}</span> {{ item.unit }}
            </div>
            <div class="compared">
              {{ item.online }}
            </div>
          </div>
        </section>

        <SctterMap :title="'农机'" @getAreaData="getAreaData" />
      </section>
      <section class="right-chart">
        <RightInfo ref="rightChart"  @setCooperData="setCooperData"/>
      </section>
    </div>
  </div>
</template>

<script>
import LeftInfo from "./components/leftInfo";
import RightInfo from "./components/rightInfo";
import SctterMap from "../../../components/echartMap/sctterMap"
import {getOnlineMachine} from "../../../api/agridata";

export default {
  components: {
    LeftInfo,
    RightInfo,
    SctterMap
  },
  data() {
    return {
      cardData: [
        {id: 1, online: '当前在线',number: 0, unit: '辆', totalColor: '#B7AFFF', cont: '5%', arrow: 'up'},
        {id: 2, online: '当日在线',number: 0, unit: '辆', totalColor: '#3cfad3', cont: '5%', arrow: 'down'},
        {id: 3, online: '长期离线',number: 0, unit: '辆', totalColor: '#F4B351', cont: '5%', arrow: 'up'},
        {id: 4, online: '合作社总数',number: 0, unit: '家', totalColor: '#00DCFD', cont: '5%', arrow: 'up'}
      ],
    }
  },
  created() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    initData(){
    },
    //获取在线农机数
    getInfo(res){
      this.cardData[0].number = res.machineOnlineCount;
      this.cardData[1].number = res.machineTodayCount;
      this.cardData[2].number = res.machineLongOfflineCount;
      //this.cardData[3].number = res.coopAllCount;
    },
    getAreaData(data){
      this.$refs.rightChart.getMachineNum(data);
    },
    setCooperData(data) {
      this.cardData[3].number = data;
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
    // min-height: 745px;
    // min-width: 1500px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    section{
      height: 100%;
    }
  }

  .left-chart, .right-chart {
    width: 25%;
    height: 100%;
    // height: calc(100vh - 69px);
  }

  .center-chart {
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    // height: calc(100vh - 69px);
    display: flex;
    flex-direction: column;
    padding: 0px 30px;

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

    .mapChart {
      width: 100%;
      height: 100%;
    }
  }
}

</style>
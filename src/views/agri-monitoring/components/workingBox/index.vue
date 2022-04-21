<template>
<!-- 作业工况组件 -->
  <div class="working-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div class="active" >
            <img src="img/monitoring/icon-title.png" alt="">
            <span>{{listData.plateNumber}} 作业工况</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon_unfolded.png" alt="">
        </el-button>
      </div>

      <div class="work-con">
        <div class="item" v-for="item in types" :key="item.type">
          <p class="num">{{item.value}}</p>
          <p class="type">{{item.type}}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'workingBox',
  data() {
    return {
      types: [
        {type: '发动机工作时间 ( H )', value: 0},
        {type: '转速 ( r/min )', value: 0},
        {type: '扭矩百分比 ( % )', value: 0},
        {type: '发动机故障数量', value: 0},
        {type: '油门踏板位置', value: 0},
        {type: '冷却液温度 (℃)', value: 0},
        {type: '机油压力 (Kpa)', value: 0},
        {type: '燃油率 ( L/H )', value: 0},
      ],
      listData: sessionStorage.getItem('currentCar') ? JSON.parse(sessionStorage.getItem('currentCar')) : {},
    }
  },
  created() {
    
  },
  methods: {
    // 收起面板
    close() {

    }
  }
}
</script>

<style lang="less" scoped>
.working-box {
  width: 400px;
  // height: 470px;
  height: 48%;
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
        // width: 128px;
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
    .work-con {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      // height: 400px;
      height: 100%;
      overflow-y: auto;
      .item {
        width: 172px;
        // height: 82px;
        height: calc(20.5% - 5px);
        padding-bottom: 5px;
        background-color: #031636;
        border: solid 1px #1c91ff;
        // margin-top: 16px;
        margin-top: 4%;
        color: @base-fontColor;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .num {
          font-size: 26px;
          // margin: 6.5% 0 5px 0;
          font-family: DINNextW1G-MediumItalic;
          color: #fff;
          text-shadow: 0 0 26px #2d7de9;
        }
        p {
          margin: 0;
        }
      }
      .item:nth-child(1), .item:nth-child(2) {
        margin-top: 0;
      }
    }
  }
  /deep/ .el-card__body {
    padding-bottom: 24px;
    padding-top: 20px;
    height: calc(100% - 92px);
    overflow-y: auto;
  }
}
</style>
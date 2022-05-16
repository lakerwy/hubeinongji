<template>
<!-- 作业面积组件 -->
  <div class="working-area-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div class="active" >
            <img src="img/monitoring/icon-title.png" alt="">
            <span>今日作业面积</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon_unfolded.png" alt="">
        </el-button>
      </div>
      <div class="area-con">
        <span>
          <!--<img src="img/working/normal-point.png" alt="">-->
          <span class="num">{{data}}</span><span class="unit">亩</span>
        </span>
        <div class="btn">
          <el-button size="mini" class="primary-btn" round @click="showDetail">详情</el-button>
          <el-button size="mini" class="primary-btn" round @click="refreshArea">刷新</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'workingArea',
  props: {
    data: {
      type: Number,
      default: 0
    }
  },
  methods: {
    close() {
    },
    showDetail() {
      this.$emit('showDetail');
    },
    refreshArea() {
      this.$emit('refreshArea');
    }
  }
}
</script>

<style lang="less" scoped>
.working-area-box {
  width: 400px;
  height: 100%;
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
    .area-con {
      color: @base-fontColor;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      img {
        margin-right: 8px;
        vertical-align: middle;
      }
      .num {
        font-size: 28px;
        line-height: 30px;
        padding-left: 20px;
        font-family: DINNextW1G-Italic;
        font-style: italic;
        color: #eaaa1b;
        text-shadow: 0 0 26px #2d7de9;
      }
      .unit {
        color: #aac2d6;
        margin-left: 12px;
      }
      .el-button {
        width: 48px;
        height: 24px;
        background-color: #14aa54;
        border-radius: 2px;
        color: #fff;
        border-color: #14aa54;
        padding: 0;
        align-self: flex-end;
      }
    }
  }
  /deep/ .el-card__body {
    padding: 5px;
    height: calc(100% - 61px);
    overflow-y: auto;
  }
}
</style>
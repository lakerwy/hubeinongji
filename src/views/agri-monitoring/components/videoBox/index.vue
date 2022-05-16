<template>
<!-- 实时视频组件 -->
  <div class="video-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div class="active" >
            <img src="img/monitoring/icon-title.png" alt="">
            <span>视频信息</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon_expand.png" alt="">
        </el-button>
      </div>

      <div class="form-con">
        <el-form label-position="right" label-width="80px" :model="form">
          <!-- <el-form-item label="监控时长:">
            <el-input class="datepicker" v-model="form.name" placeholder="请输入监控时长">
              <span slot="suffix">秒</span>
            </el-input>
            <el-checkbox v-model="form.checked">4分屏</el-checkbox>
          </el-form-item> -->
          <el-form-item label="图像来源:">
            <el-checkbox-group v-model="form.source">
              <el-checkbox v-for="item in sources" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="btns">
            <el-button round type="primary" class="primary-btn-plain" plain>监控</el-button>
            <el-button type="primary" class="primary-btn" round>停止</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="video-con" @mouseover="isShowControls = true" @mouseout="isShowControls = isPaused ? true : false">
        <video 
          ref="video" 
          width="100%" 
          height="100%" 
          src=""></video>
        <div ref="controls" class="controls" v-show="isShowControls">
          <div ref="play" class="play-btn">
            <img v-show="isShowControls && isPaused" src="img/monitoring/video-play.png" alt="" @click.stop="play">
            <img v-show="isShowControls && !isPaused" src="img/monitoring/Pause.png" alt="" @click.stop="play">
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'videoBox',
  data() {
    return {
      queryStartTime: null, // 查询 开始时间
      queryEndTime: null, // 查询 结束时间
      pickerOptions: {
        disabledDate: time => {
          let maxDate = new Date();
          // 点击此刻后的问题
          return time.getTime() >= maxDate.getTime() + 10
        },
      },
      form: {
        source: []
      },
      sources: [
        {label: '通道1', value: 1},
        {label: '通道2', value: 2},
        {label: '通道3', value: 3},
        {label: '通道4', value: 4},
      ],
      isPaused: true,
      isShowControls: true
    }
  },
  created() {
    
  },
  methods: {
    // 收起面板
    close() {

    },
    // 视频播放
    play() {
      let video = this.$refs.video;
      if(video.paused) {
        video.play();
        this.isShowControls = false;
      } else {
        video.pause();
        this.isShowControls = true;
      }
      this.isPaused = video.paused;
    },
  }
}
</script>

<style lang="less" scoped>
.video-box {
  width: 400px;
  height: 45%;
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
        width: 128px;
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
    .form-con {
      color: @base-fontColor;
      .datepicker {
        width: 200px !important;
        font-size: 12px;

        /deep/ .el-input__inner {
          background-color: transparent !important;
          border-radius: 4px;
          border: solid 1px #356e97;
          color: rgba(129, 160, 192, 1);
          height: 40px;
          line-height: 40px;
          padding: 0 0 0 30px !important;
        }
      }
      .datepicker:first-child {
        margin-right: 15px;
      }
      .el-form {
        .el-form-item {
          margin-bottom: 10px;
        }
        /deep/ .el-form-item__label {
          color: @base-fontColor;
        }
        /deep/ .el-input__inner {
          background-color: transparent;
          border: 1px solid #356e97;
          color: #ffffff;
        }
        /ddep/ .el-input__placeholder {
          color: #80c5ff;
        }
        /deep/input::-webkit-input-placeholder {
          color: rgba(128, 197, 255, .3);
        }

        /deep/input::-moz-input-placeholder {
          color: rgba(128, 197, 255, .3);
        }

        /deep/input::-ms-input-placeholder {
          color: rgba(128, 197, 255, .3);
        }
        /deep/ .el-checkbox__label {
          color: @base-fontColor;
          padding-left: 7px;
        }
        /deep/ .el-checkbox__inner {
          background: transparent;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background: #1298f8;
        }
        .el-checkbox {
          margin-right: 12px;
        }
      }
      .btns {
        text-align: right;
        margin-bottom: 14px;
        .el-button {
          width: 80px;
          height: 32px;
          padding: 0;
        }
      }
    }
    .video-con {
      // height: 238px;
      height: calc(100% - 105px);
      position: relative;
      background: #000;
      .controls {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: rgba(0,0,0,.01);
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
        .play-btn {
          width: 40px;
          height: 40px;
          cursor: pointer;
          img {
            vertical-align: middle;
          }
        }
      }
    }
  }
  /deep/ .el-card__body {
    padding: 16px 16px 24px 16px;
    height: calc(100% - 89px);
    overflow-y: auto;
  }
}
</style>
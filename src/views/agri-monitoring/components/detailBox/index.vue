<template>
<!-- 详细信息 -->
  <div class="detail-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="car-code">
          <img src="img/monitoring/icon-agricar.png" alt="">
          <span>{{detail.plateNumber || '无'}}</span>
          <el-button type="primary" plain class="primary-btn-plain" :class="detail.additional == '在线' ? 'online' : 'outline'">{{detail.additional}}</el-button>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon-close.png" alt="">
        </el-button>
      </div>

      <div class="form-con">
        <el-form label-position="right">
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carNo.png" alt="">
            <span>{{detail.terminalCode}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carType.png" alt="">
            <span>{{detail.jobType}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carType.png" alt="">
            <span>{{detail.groupNameFullPath}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carUser.png" alt="">
            <span>{{detail.ownerName}}-{{detail.ownerPhone || '暂无'}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carLocation.png" alt="">
            <span>{{detail.location}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carDate.png" alt="">
            <span>{{detail.time}}</span>
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carLon.png" alt="">
            <span>{{detail.x}},{{detail.y}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="working-detail">
        <div>
          <div class="type">作业宽幅</div>
          <span>{{detail.toolWidth}}m</span>
        </div>
        <div>
          <div class="type">速度</div>
          <span>{{detail.velocity}}公里/h</span>
        </div>
        <div>
          <div class="type">深度</div>
          <span>{{detail.jobHeight}}cm</span>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" class="primary-btn" round @click="showHistoryTrack">历史轨迹</el-button>
        <el-button round type="primary" class="primary-btn-plain" plain @click="goRealtimeMonitoring">实时监控</el-button>
        <el-button round type="primary" class="primary-btn-plain" plain @click="goWorkingManagement">作业查询</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDetailByMachinId } from '@/api/monitoring/index'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  watch: {
    data: {
      handler: function(newV, oldV) {
        this.initData();
        return newV
      },
      immediate: true
    }
  },
  data() {
    return {
      detail: {}
    }
  },
  methods: {
    // 查询详情数据
    async initData() {
      let params = {
        machinId: this.data.machineId
      }
      let res = await getDetailByMachinId(params);
      let {code, data} = res;
      if(code == 0) {
        this.detail = data;
      }
    },
    // 历史轨迹
    showHistoryTrack() {
      this.$emit('showTrack', 'isShowTrack', true);
    },
    // 实时监控
    goRealtimeMonitoring() {
      // 保存当前操作的农机数据
      sessionStorage.setItem('currentCar', JSON.stringify(this.data));
      this.$router.push({path: '/realtime-monitoring'})
    },
    // 作业查询
    goWorkingManagement() {
      // 保存当前操作的农机数据
      sessionStorage.setItem('currentCar', JSON.stringify(this.data));
      this.$router.push({path: '/working-management'})
    },
    // 关闭组件
    close() {
      this.$emit('close', 'isShowDetail', false)
    }
  }
}
</script>

<style lang="less" scoped>
.detail-box {
  width: 362px;
  .box-card {
    background: @base-darkBlue;
    /deep/ .el-card__body {
      padding-top: 16px;
    }
    .car-code {
      color: #2d7de9;
      display: inline-block;
      img {
        margin-right: 8px;
        vertical-align: middle;
      }
      .el-button {
        width: 46px;
        margin-left: 10px;
        padding: 0;
        height: 22px;
        font-family: SourceHanSansCN-Regular;
        font-size: 14px;
        border-radius: 4px;
      }
      .online {
        color: #07d9ae !important;
        border: solid 1px rgba(10, 181, 147,.3) !important;
      }
      .outline {
        color: #aac2d6 !important;
        border: solid 1px rgba(67, 110, 149,.3) !important;
      }
    }
  }
  .form-con {
    .el-form {
      color: @base-fontColor;
      border-bottom: 1px dashed #0d2c5a;
    }
    .form-icon {
      vertical-align: revert;
      margin-right: 8px;
      margin-top: 4px;
    }
    .el-form-item {
      margin-bottom: 8px;
    }
    /deep/ .el-form-item__content {
      line-height: 24px;
      display: flex;
      align-items: flex-start;
    }
  }
  .working-detail {
    padding: 20px 5px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #0d2c5a;
    color: @base-fontColor;
    text-align: center;
    .type {
      width: 88px;
      height: 28px;
      line-height: 28px;
      background: #112441;
      font-size: 14px;
      margin-bottom: 14px;
    }
  }
  .btns {
    text-align: right;
    padding-top: 20px;
    .el-button {
      width: 84px;
      padding: 0;
      height: 32px;
    }
    .primary-btn-plain {
      border: solid 1px #194260 !important;
      color: #80c5ff !important;
    }
  }
}
</style>
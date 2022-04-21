<template>
<!-- 详细信息 -->
  <div class="detail-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="car-code">
          <span>农机终端信息</span>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon-close.png" alt="">
        </el-button>
      </div>

      <div class="form-con">
        <el-form label-position="right">
          <el-form-item label="农机分组：">
            <span>{{data.groupFullName}}</span>
          </el-form-item>
          <el-form-item label="车牌号码：">
            <span>{{data.plateNumber}}</span>
          </el-form-item>
          <el-form-item label="机手姓名：">
            <span>{{data.ownerName}}</span>
          </el-form-item>
          <el-form-item label="设备时间：">
            <span>{{data.Time}}</span>
          </el-form-item>
          <el-form-item label="位置：">
            <span>{{data.XCoord}},{{data.YCoord}}</span>
          </el-form-item>
          <el-form-item label="深度：">
            <span>{{data.jobHight}}（厘米）</span>
          </el-form-item>
          <el-form-item label="农机状态：">
            <span>{{data.additional}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
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
        return newV
      },
      immediate: true
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    // 关闭组件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.detail-box {
  width: 334px;
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
        color: #07d9ae !important;
        font-family: SourceHanSansCN-Regular;
        font-size: 14px;
        border-radius: 4px;
        border: solid 1px rgba(10, 181, 147,.3) !important;
      }
    }
  }
  .form-con {
    .el-form {
      color: @base-fontColor;
    }
    .form-icon {
      vertical-align: revert;
      margin-right: 8px;
      margin-top: 4px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__label {
      line-height: 24px;
      color: @base-fontColor;
    }
    /deep/ .el-form-item__content {
      line-height: 24px;
    }
  }
}
</style>
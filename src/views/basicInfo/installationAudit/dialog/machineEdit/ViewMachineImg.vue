<template>
  <div>
    <el-dialog
      class="my-dialog pic-dialog"
      title="查看图片"
      :visible.sync="viewVisible"
      width="600px"
      top="20vh">
      <div v-if="!url" class="tishi">暂无图片</div>
      <div v-if="url">
        <el-image
          v-if="url"
          style="width:100%;height:100%;"
          :src="url"
          fit="cover"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewVisible: false,
    }
  },
  props: {
    url: {
      type: String,
      // default: "http://223.75.53.178:8817/machinephotos/ComServerHB/202109/1000000032064/1000000032064.1632539989005.91963.jpg"
      default: ""
    }
  }
}
</script>

<style lang="less" scoped>
.pic-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
    height: 400px;
    text-align: center;
  }
  /deep/ .el-image__error, /deep/ .el-image__placeholder {
    background: transparent;
  }
}
.tishi {
  line-height: 400px;
}
</style>
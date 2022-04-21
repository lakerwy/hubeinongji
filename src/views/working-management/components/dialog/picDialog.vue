<template>
  <el-dialog
    class="my-dialog pic-dialog"
    title="查看图片"
    :visible.sync="dialogVisible"
    width="45%"
    top="20vh">
    <el-image
      style="width:100%;height:100%;"
      :src="url"
      fit="cover"></el-image>
  </el-dialog>
</template>

<script>
export default {
  name: 'picDialog',
  data() {
    return {
      dialogVisible: false,
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
    height: 600px;
    text-align: center;
  }
  /deep/ .el-image__error, /deep/ .el-image__placeholder {
    background: transparent;
  }
}
</style>
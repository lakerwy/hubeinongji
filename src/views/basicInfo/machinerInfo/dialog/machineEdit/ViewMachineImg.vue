<template>
  <div>
    <el-dialog
      class="my-dialog pic-dialog"
      title="查看图片"
      :visible.sync="viewVisible"
      width="600px"
      destroy-on-close
      top="20vh">
      <div v-if="!url" class="tishi">暂无图片</div>
      <div v-if="url" class="img">
        <img :src="url" />
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
      default: ""
    }
  }
}
</script>

<style lang="less" scoped>
.pic-dialog {
  /deep/ .el-dialog__body {
    padding: 0;
    //height: 400px;
    text-align: center;
  }
  /deep/ .el-image__error, /deep/ .el-image__placeholder {
    background: transparent;
  }
}
.tishi {
  line-height: 400px;
}
.img{
  margin-top: 50px;
  margin-bottom: 50px;
  img{
    width: 200px;
    //height: 200px;
  }
}
</style>
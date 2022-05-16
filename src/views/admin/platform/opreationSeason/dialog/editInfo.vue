<template>

</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "机具信息新增"
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        region: ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
  margin-left: 10px;
  .el-form-item {
    margin-right: 40px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
  .el-input, .el-select {
    width: 100%;
  }
  .datepicker {
    width: 40%;
  }
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}

</style>
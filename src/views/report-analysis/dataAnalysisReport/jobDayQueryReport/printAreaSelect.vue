<template>
  <el-dialog
    class="dialog"
    title="选择打印区域"
    :visible.sync="dialogVisible"
    top="30vh"
    width="300px"
    :before-close="cancel"
    height="500px"
  >
    <div class="content">
      <el-radio v-model="radio" :label="1">日报表</el-radio>
      <el-radio v-model="radio" :label="2">详细报表</el-radio>
      <el-radio v-model="radio" :label="3">日报表+详细报表</el-radio>
      <el-radio v-model="radio" :label="4">图片</el-radio>
      <el-radio v-model="radio" :label="5">全部</el-radio>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="print" round
        >打 印</el-button
      >
      <el-button type="primary" class="shadow-btn" @click="cancel" round
        >取 消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return{
      radio:5,
      dialogVisible:false,
    } 
  },
  methods:{
    print(){
      this.$emit("print",this.radio)
    },
    cancel(){
      this.dialogVisible = false
      this.radio = 5
    }
  }
}
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  margin-top: 20px;
  margin-left: 10px;
  /deep/.el-radio{
    margin-bottom: 15px;
  }
  .el-form-item {
    margin-right: 40px;
  }
  /deep/ .el-form-item__label {
    //padding: 0;
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}
</style>
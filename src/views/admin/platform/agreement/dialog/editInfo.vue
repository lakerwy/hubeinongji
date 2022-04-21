<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="60%"
    top="20vh"
  >
    <div class="content">
      <el-form class="my-form" label-position="right" label-width="120px" :model="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="协议名称：" >
              <el-input v-model="form.region" placeholder="请输入协议名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务器IP：" >
              <el-input v-model="form.region" placeholder="请输入服务器IP">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通信端口：" >
              <el-input v-model="form.region" placeholder="请输入通信端口"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="协议描述：" >
              <el-input v-model="form.region" placeholder="请输入协议名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备用服务器IP：" >
              <el-input v-model="form.region" placeholder="请输入服务器IP">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备用通信端口：" >
              <el-input v-model="form.region" placeholder="请输入通信端口"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>保 存</el-button>
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>返 回</el-button>
    </div>
  </el-dialog>
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
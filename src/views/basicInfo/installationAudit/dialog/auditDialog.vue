<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="25%"
    top="20vh"
  >
    <div class="content">
      <el-form class="my-form" label-position="right" label-width="120px" :model="form">
        <el-form-item label="审核状态：">
          <el-select v-model="form.region" placeholder="请选择审核状态">
            <el-option label="通过" value="shanghai"></el-option>
            <el-option label="不通过" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核原因：">
          <el-input v-model="form.region" placeholder="不通过必须填原因">
          </el-input>
        </el-form-item>
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
      default: "审核"
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
  margin-left: -10px;

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
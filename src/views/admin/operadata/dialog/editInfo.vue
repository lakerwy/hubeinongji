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
            <el-form-item label="农机分组：" >
              <el-input v-model="form.region" placeholder="请选择农机分组">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提出人：" >
              <el-input v-model="form.region" placeholder="请输入提出人">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事件类型：" >
              <el-select v-model="form.region" placeholder="请选择事件类型">
                <el-option label="label" value="value"></el-option>
                <el-option label="label" value="value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="事件描述：" >
              <el-input v-model="form.region" placeholder="请输入事件描述">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂商：" >
              <el-select v-model="form.region" placeholder="请选择设备厂商">
                <el-option label="label" value="value"></el-option>
                <el-option label="label" value="value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提出时间：" >
              <el-date-picker
                class="datepicker"
                v-model="form.region"
                type="datetime"
                :clearable="false"
                prefix-icon="el-icon-date"
                placeholder="选择提出时间"
                :picker-options="endTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件：" >
              <el-button type="primary" class="shadow-btn" round>上 传</el-button>
<!--              <el-button type="primary" class="shadow-btn" round>查 看</el-button>-->
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
  .datepicker {
    width: 100% !important;
  }
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
  .shadow-btn {
    height: 36px
  }
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}

</style>
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
            <el-form-item label="分组名称：" >
              <el-select v-model="form.region" placeholder="请选择分组名称">
                <el-option label="农机车" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业季名称：" >
              <el-input v-model="form.region" placeholder="请输入作业季名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业类型：" >
              <el-select v-model="form.region" placeholder="请选择作业类型">
                <el-option label="农机车" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="自动审核：">
              <el-select v-model="form.region" placeholder="请选择自动审核">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核深度(公分)：" >
              <el-input v-model="form.region" placeholder="请输入审核深度"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="深度合格率(%)：" >
              <el-input v-model="form.region" placeholder="请输入深度合格率"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="补贴标准(元/亩)：" >
              <el-input v-model="form.region" placeholder="请输入补贴标准"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核类型：">
              <el-select v-model="form.region" placeholder="请选择审核类型">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截取深度(公分)：" >
              <el-input v-model="form.region" placeholder="请输入截取深度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业时间：">
              <el-date-picker
                class="datepicker"
                v-model="form.queryStartTime"
                type="datetime"
                :clearable="false"
                prefix-icon="el-icon-date"
                placeholder="开始时间"
              ></el-date-picker>
              <span style="diaplay:inline-block;width:12px;"> — </span>
              <el-date-picker
                class="datepicker"
                v-model="form.queryEndTime"
                type="datetime"
                :clearable="false"
                prefix-icon="el-icon-date"
                placeholder="结束时间"
              ></el-date-picker>
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
    width: 45%;
  }
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}

</style>
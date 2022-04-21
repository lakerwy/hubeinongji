<template>
  <el-dialog
    class="dialog"
    :title="editTitle"
    :visible.sync="dialogVisible"
    width="60%"
    top="20vh"
  >
    <!-- <div class="content"> -->

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
            <el-form-item label="作业年份：">
              <el-select v-model="form.region" placeholder="请选择作业年份">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业季名：" >
              <el-select v-model="form.region" placeholder="请选择作业季名">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="作业类型：" >
              <el-select v-model="form.region" placeholder="请选择作业季名">
                <el-option label="是" value="shanghai"></el-option>
                <el-option label="否" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称：" >
              <el-input v-model="form.region" placeholder="请输入任务名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配面积（亩）：">
              <el-input v-model="form.region" placeholder="请输入任务名称"></el-input>
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
      <el-button
        type="primary"
        class="shadow-btn"
        @click="dialogVisible = false"
        round
        >返回</el-button>
        <el-button
        type="primary"
        class="shadow-btn"
        @click="dialogVisible = false"
        round
        >保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        queryStartTime: "",
        queryEndTime: "",
      },
    };
  },

  props:{
    editTitle:String,
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {},
};
</script>
<style lang='less' scoped>
.content {
  margin-top: 40px;
  margin-left: 10px;
  .el-form-item {
    margin-right: 40px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
  .el-input,
  .el-select {
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
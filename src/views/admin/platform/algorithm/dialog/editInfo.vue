<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="25%"
    top="20vh"
  >
    <div class="content">
      <el-form
        class="my-form"
        label-position="right"
        label-width="120px"
        :model="form"
        rules="rules"
      >
        <el-form-item label="分组名称：">
          <el-select
            v-model="form.region"
            placeholder="请选择分组名称"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="农机类型：">
          <el-select
            v-model="form.region"
            placeholder="请选择农机类型"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机具类型：">
          <el-select
            v-model="form.region"
            placeholder="请选择机具类型"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="算法类型：">
          <el-select
            v-model="form.region"
            placeholder="请选择算法类型"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认算法：">
          <el-select
            v-model="form.region"
            placeholder="请选择是否默认算法"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过滤标志：">
          <el-select
            v-model="form.region"
            placeholder="请选择过滤标志"
            prop="region"
          >
            <el-option label="农机车" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="shadow-btn"
        @click="dialogVisible = false"
        round
        >保 存</el-button
      >
      <el-button
        type="primary"
        class="shadow-btn"
        @click="dialogVisible = false"
        round
        >返 回</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "机具信息新增",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        region: "",
      },
      rules: {
        region: [
          { required: true, message: "请选择选项", trigger: "change" },
        ],
      },
    };
  },
};
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

  .el-input,
  .el-select {
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
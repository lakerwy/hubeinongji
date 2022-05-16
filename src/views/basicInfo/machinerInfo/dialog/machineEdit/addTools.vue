<template>
  <div>
    <el-dialog
      class="dialog"
      :title="'添加机具'"
      :visible.sync="toolsVisible"
      :width="'900px'"
      top="20vh"
      destroy-on-close
    >
      <div class="content">
        <el-form ref="form" :rules="rules" :model="form" label-width="150px" :inline="true">
          <el-form-item label="机具类型:" prop="toolType">
            <el-select v-model="form.toolType" placeholder="请选择机具类型">
              <el-option v-for="i in this.toolTypeSelect" :key="i.id" :label="i.itemName" :value="i.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机具识别码:" prop="toolIfa">
            <el-input v-model="form.toolIfa" placeholder="请输入机具识别码" ></el-input>
          </el-form-item>
          <el-form-item label="机具名称:">
            <el-input v-model="form.toolName" placeholder="请输入机具识别码"></el-input>
          </el-form-item>
          <el-form-item label="机具高度(米):" prop="toolHeight">
            <el-input v-model="form.toolHeight" placeholder="请输入机具高度"></el-input>
          </el-form-item>
          <el-form-item label="机具宽度(米):" prop="toolWidth">
            <el-input v-model="form.toolWidth" placeholder="请输入机具宽度"></el-input>
          </el-form-item>
          <el-form-item label="机具备注:">
            <el-input v-model="form.remark" placeholder="请输入机具备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="commit">
        <el-button type="primary" class="shadow-btn" @click="toolsVisible = false">取消</el-button>
        <el-button type="primary" class="shadow-btn" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  // inject: ['app'],
  data() {
    return {
      toolsVisible: false,
      toolTypeSelect: [],
      form: {},
      rules: {
        toolType: [
          {required: true, message: '请选择机具类型', trigger: 'change'},
        ],
        toolIfa: [
          {required: true, message: '请输入机具识别码', trigger: 'blur'},
        ],
        toolHeight: [
          {required: true, message: '请输入机具高度', trigger: 'blur'},
        ],
        toolWidth: [
          {required: true, message: '请输入机具宽度', trigger: 'blur'},
        ]

      },
      model: ''
    }
  },
  methods: {
    save(){

    }
  }
}
</script>

<style lang="less" scoped>
.content {
  margin-top: 30px;
  position: relative;

  .search {
    position: absolute;
    top: 71px;
    left: 30px;
  }
  /deep/ .el-input__inner {
    width: 185px;
  }
}

/deep/ .el-button {
  width: 72px;
}

/deep/ .shadow-btn {
  border-radius: 20px;
  height: 35px;
  margin-left: 6px;
}

.commit {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 50px;
  margin-bottom: 20px;
}
</style>
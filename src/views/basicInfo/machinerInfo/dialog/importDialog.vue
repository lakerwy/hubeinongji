<template>
  <el-dialog
    class="dialog"
    title="导入文件"
    :visible.sync="dialogVisible"
    width="30%"
    top="30vh"
  >
    <div class="content">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
      >
        <span>选择文件：</span>
        <el-button size="small" type="primary" class="shadow-btn">选择文件</el-button>
        <span slot="tip"> 未选择任何文件</span>
      </el-upload>
      <a class="upload" :href="url" :download="url" style="text-decoration:none;">下载模板</a>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "importDialog",
  data(){
    return{
      dialogVisible: false,
      url: `${window.globalUrl.HOME_API}agri-web/cd/machine/importTemplate?templateType=machineFile`,
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.content {
  margin-left: 20px;
  margin-top: 20px;
  .upload-demo {
    color: #9BB2C7;
    .shadow-btn {
      margin-left: 10px;
      margin-right: 20px;
    }
  }
  .upload {
    display: block;
    margin-top: 20px;
    color: #54A6D8;
  }
}

.dialog-footer {
  height: 30px;
  padding-right: 25px;
}
</style>
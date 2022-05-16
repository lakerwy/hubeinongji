<template>
  <el-dialog
    class="dialog"
    title="导入文件"
    :visible.sync="dialogVisible"
    width="30%"
    top="30vh"
    :before-close="beforeColse"
  >
    <div class="content">
      <el-upload
        ref="upload"
        class="upload-demo"
        :headers="headers"
        :action="uploadUrl"
        multiple
        :data="uploadData"
        accept=".xls"
        :before-upload="beforeUpload"
        :show-file-list="true"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :file-list="chooseFilelist"
        :auto-upload="false"
      >
        <span>选择文件：</span>
        <el-button size="small" type="primary" class="shadow-btn"
          >选择文件</el-button
        >
        <span slot="tip" v-if="!fileList.length"> 未选择任何文件</span>
      </el-upload>
      <a class="upload" @click="downloadTemplate" style="text-decoration: none"
        >下载模板</a
      >
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="save" round
        >导入</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { handTemplateDown } from "@/util/util";
import store from "@/store";

export default {
  data() {
    return {
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogVisible: false,
      templateUrl: `${window.globalUrl.HOME_API}agri-web/cd/machine/importTemplate?templateType=machineFile`,
      uploadVisible: false,
      uploadData: {},
      chooseFilelist: [],
      uploadUrl:
        window.globalUrl.HOME_API +
        "agri-web/cd/productResources/productResourcesImport",
      fileList: [],
    };
  },
  methods: {
    //下载模板
    downloadTemplate() {
      let url = this.templateUrl;
      let title = "农机管理导入模板";
      handTemplateDown(url, title);
    },
    beforeColse() {
      this.$refs.upload.clearFiles();
      this.dialogVisible = false;
      this.$parent.importVisible = false;
    },
    handleChange(file) {
      this.fileList.push(file);
    },
    handleRemove() {
      this.fileList.pop();
    },
    handleSuccess(res) {
      const { success, obj, msg } = res;
      if (success == true) {
        this.$message.success(msg);
        this.$parent.search()
        this.beforeColse();
        this.dialogVisible = false;
      } else {
        this.$message.error("上传失败");
      }
    },
    handleError(err) {
      let res = JSON.parse(err.message);
      this.$message.error("上传失败");
    },
    save() {
      this.$refs.upload.submit();
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["xls","xlsx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传文件只能是xls,xlsx格式");
        return false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.content {
  margin-left: 20px;
  margin-top: 20px;
  .upload-demo {
    color: #9bb2c7;
    .shadow-btn {
      margin-left: 10px;
      margin-right: 20px;
    }
  }
  .upload {
    display: block;
    margin-top: 20px;
    color: #54a6d8;
  }
}

.dialog-footer {
  height: 30px;
  padding-right: 25px;
}
</style>
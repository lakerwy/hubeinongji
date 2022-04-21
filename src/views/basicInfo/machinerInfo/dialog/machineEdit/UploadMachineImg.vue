<template>
  <el-dialog
    class="dialog"
    title="上传图片"
    :visible.sync="uploadVisible"
    width="600px"
    top="30vh"
  >
    <div class="content">
      <div class="imgBox">
        <img :src="url" alt="">
      </div>
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        multiple
        :data="uploadData"
        accept=".jpg,.jpeg,.png"
        :show-file-list="false"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="chooseFilelist"
      >
        <span>选择文件：</span>
        <el-button size="small" type="primary" class="shadow-btn">选择文件</el-button>
        <span slot="tip"> 未选择任何文件</span>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="save" round>导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    uploadUrl:{
      type: String,
      default: window.globalUrl.HOME_API + 'agri-web/cd/machine/pictureImport',
    }
  },
  name: "UploadMachineImg",
  data(){
    return {
      uploadVisible: false,
      uploadData: {},
      url: '',
      chooseFilelist: [],
    }
  },
  methods: {
    save(){
      if(this.url){
        this.$parent.form.machineImage = this.url;
      }
      this.uploadVisible = false;
    },
    handleChange(file,fileList){
      if(fileList.length>1){
        fileList.splice(0,1);
      }
    },
    handleSuccess(res){
      const {code, data, msg} = res;
      if(!code) {
        this.url='';
        this.url = data;
      } else {
        this.$message.error(msg || '上传失败')
      }
    },
    handleError(err){
      let res = JSON.parse(err.message);
      this.$message.error(res.msg || '上传失败')
    },
  }
}
</script>

<style scoped lang="less">
.content {
  margin-left: 20px;
  margin-top: 20px;

  .imgBox {
    margin-left: 200px;
    margin-bottom: 20px;
    width: 100px;
    height: 100px;
    border: 1px dotted;
  }

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
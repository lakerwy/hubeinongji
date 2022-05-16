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
        <img :src="localViewUrl" v-if="localViewUrl">
      </div>
      <el-upload
        ref="upload"
        class="upload-demo"
        :headers="headers"
        :action="uploadUrl"
        multiple
        :data="uploadData"
        accept=".jpg,.jpeg,.png"
        :show-file-list="false"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="chooseFilelist"
        :auto-upload="false"
      >
        <span>选择文件：</span>
        <el-button size="small" type="primary" class="shadow-btn">选择文件</el-button>
        <span slot="tip" v-show="!localViewUrl"> 未选择任何文件</span>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="save" round>导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import store from '@/store'

export default {
  props: ['uploadTag'],
  name: "UploadMachineImg",
  data(){
    return {
      uploadVisible: false,
      uploadData: {},
      url: '',
      chooseFilelist: [],
      uploadUrl: window.globalUrl.HOME_API + 'agri-web/cd/machine/pictureImport',
      localViewUrl: '',
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token
      }
    }
  },
  methods: {
    save(){
      this.$refs.upload.submit();
    },
    handleChange(file,fileList){
      let URL = window.URL || window.webkitURL;
      let modelURL = URL.createObjectURL(file.raw);
      this.localViewUrl = modelURL;
      if(fileList.length>1){
        fileList.splice(0,1);
      }
    },
    handleSuccess(res){
      const {code, data, msg} = res;
      if(!code) {
        this.url='';
        this.url = data;
        this.$message.success('导入成功')
        if(this.uploadTag == 1){
          this.$parent.form.machineImage = this.url;
        } else {
          this.$parent.form.drivingImage = this.url;
        }
        this.uploadVisible = false;
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
    img {
      width: 100px;
      height: 100px;
    }
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
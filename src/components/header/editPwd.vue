<template>
  <el-dialog 
    class="my-dialog pwd-dialog" 
    title="修改密码" 
    :visible.sync="dialogVisible"
    top="30vh"
    width="438px">
    <el-form class="pwd-form" ref="form" :model="form" label-width="85px">
      <el-form-item label="登录账号：">
        <el-input v-model="form.username" readonly placeholder="请输入登录账号"></el-input>
      </el-form-item>
      <el-form-item label="原始密码：">
        <el-input v-model="form.oldPwd" readonly placeholder="请输入原始密码"></el-input>
      </el-form-item>
      <el-form-item label="新设密码：" class="special">
        <el-input v-model="form.newPwd" readonly placeholder="请输入新设密码"></el-input>
      </el-form-item>
      <el-form-item label="重复密码：">
        <el-input v-model="form.newPwd2" readonly placeholder="请再次输入密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="shadow-btn" plain round @click="close">取消</el-button>
      <el-button type="primary" class="shadow-btn" plain round @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {username: ''}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.form.username = this.userInfo.username;
  },
  methods: {
    // 修改密码
    save() {

    },
    close() {
      this.form = {};
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.pwd-dialog {
  /deep/ .el-dialog__body {
    padding-bottom: 0;
  }
  /deep/ .el-dialog__footer {
    padding-bottom: 10px;
  }
}
.pwd-form {
  width: 90%;
  margin: 0 auto;
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>
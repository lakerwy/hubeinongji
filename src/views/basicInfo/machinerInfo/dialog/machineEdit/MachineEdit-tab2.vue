<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" :inline="true">
      <el-form-item label="机主姓名:" prop="ownerName">
        <el-input v-model.trim="form.ownerName" maxlength="50" placeholder="请输入机主姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="ownerPhone">
        <el-input v-model.trim="form.ownerPhone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="短信推送标志:" prop="smsNotify">
        <el-select v-model.trim="form.smsNotify" placeholder="请选择短信推送标志">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系地址:">
        <el-input v-model.trim="form.ownerAddr" maxlength="60" placeholder="请输入联系地址"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:" prop="ownerIDCardNum">
        <el-input v-model.trim="form.ownerIDCardNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="行驶证照片:">
        <el-button type="primary" class="shadow-btn" @click="uploadMachine" style="margin: 0">上传</el-button>
        <el-button type="primary" class="shadow-btn" @click="viewMachine">查看</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "MachineEditTab2",
  props: ['form'],
  data() {
    return {
      rules: {
        ownerName: [
          {required: true, message: '请输入机主姓名', trigger: 'blur'},
        ],
        ownerPhone: [
          {required: true,pattern:/^((0\d{2,3}-\d{7,8})|1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8})$/, message: '请输入正确的联系电话', trigger: 'blur'},
        ],
        smsNotify: [
          {required: true, message: '请选择短信推送标志', trigger: 'change'},
        ],
        ownerIDCardNum:[
          {required:false,pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
          message:'请输入正确的身份证号码',
          trigger:'blur',
          max:18,
          }
        ]
      }
    }
  },
  methods: {
    uploadMachine(){
      this.$emit('uploadMachine', 2)
    },
    viewMachine(){
      this.$emit('viewMachine', 2)
    }
  }
}
</script>

<style>

</style>
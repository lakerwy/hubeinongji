<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" :inline="true">
      <el-form-item label="机主姓名:" prop="ownerName">
        <el-input v-model="form.ownerName" placeholder="请输入机主姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="ownerPhone">
        <el-input v-model="form.ownerPhone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="短信推送标志：" prop="smsNotify">
        <el-select v-model="form.smsNotify" placeholder="请选择短信推送标志">
          <el-option label="是" value="Y"></el-option>
          <el-option label="是" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="form.ownerAddr" placeholder="请输入联系地址"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.ownerIDCardNum" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="行驶证照片">
        <el-button type="primary" class="shadow-btn" @click="uploadMachine">上传</el-button>
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
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        ownerPhone: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        smsNotify: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
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
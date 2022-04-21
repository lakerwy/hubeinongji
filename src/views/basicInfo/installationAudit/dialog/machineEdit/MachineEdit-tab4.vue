<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" :inline="true">
      <el-form-item label="机具类型：" prop="defaultToolType">
        <el-select v-model="form.defaultToolType" placeholder="请选择机具类型">
            <el-option v-for="item in app.toolTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机具识别码：" prop="toolIfa">
        <el-input v-model="form.toolIfa" placeholder="请输入机具识别码"></el-input>
      </el-form-item>
      <el-form-item label="作业宽幅(米)：" prop="defaultToolWidth">
        <el-input v-model="form.defaultToolWidth" placeholder="请输入作业宽幅"></el-input>
      </el-form-item>
      <el-form-item label="机具高度：" prop="toolHeight">
        <el-input v-model="form.toolHeight" placeholder="请输入机具高度"></el-input>
      </el-form-item>
      <el-form-item label="补偿深度(厘米)：">
        <el-input v-model="form.compenDepth" placeholder="请输入补偿深度"></el-input>
      </el-form-item>
      <el-form-item label="机具臂长：" prop="armLength">
        <el-input v-model="form.armLength" placeholder="请输入机具臂长"></el-input>
      </el-form-item>
      <el-form-item label="机具宽度(米)：" prop="armLength">
        <el-input v-model="form.toolWidth" placeholder="请输入机具宽度"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: ['form'],
  inject: ['app'],
  data() {
    return {
      rules: {
        terminalCode: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        defaultToolType: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        toolIfa: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        defaultToolWidth: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        toolHeight: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        armLength: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ]
      },

    }
  },
  methods: {

  }
}
</script>

<style>

</style>
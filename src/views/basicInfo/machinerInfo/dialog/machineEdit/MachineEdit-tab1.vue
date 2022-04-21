<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="154px" :inline="true" label-position="right">
      <el-form-item label="农机车牌：" prop="plateNumber">
        <el-input v-model="form.plateNumber" placeholder="请输入农机车牌"></el-input>
      </el-form-item>
      <el-form-item label="农机型号：">
        <el-input v-model="form.machineModel" placeholder="请输入农机型号"></el-input>
      </el-form-item>
      <el-form-item label="出厂编号：">
        <el-input v-model="form.factoryNumber" placeholder="请输入出厂编号"></el-input>
      </el-form-item>
      <el-form-item label="农机功率(千瓦)：">
        <el-input v-model="form.machinePower"  placeholder="请输入农机功率"></el-input>
      </el-form-item>
      <el-form-item label="农机品牌：">
        <el-select v-model="form.brandId" placeholder="请选择农机品牌">
          <el-option v-for="(item,index) in app.allBrand" :key="index" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购置时间：">
        <el-date-picker v-model="form.purchaseTime" type="date" placeholder="请选择购置时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="农机类型：" prop="machineType">
        <el-select v-model="form.machineType" clearable placeholder="请选择农机类型">
          <el-option v-for="item in app.machineTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机具类型：">
        <el-select v-model="form.defaultToolType" placeholder="请选择机具类型">
          <el-option v-for="item in app.toolTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选装件类型：">
        <el-select v-model="form.optionalTypeArray" multiple collapse-tags placeholder="请选择选装件类型">
          <el-option label="摄像头" value="1"></el-option>
          <el-option label="超声波传感器" value="2"></el-option>
          <el-option label="角度传感器" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始偏移(角度)：" prop="initOffSet">
        <el-input v-model="form.initOffSet"  placeholder="请输入初始偏移角度"></el-input>
      </el-form-item>
      <el-form-item label="初始高度(cm)：" prop="initHeight">
        <el-input v-model="form.initHeight" placeholder="请输入初始高度"></el-input>
      </el-form-item>
      <el-form-item label="下臂杆长/臂长(cm)：" prop="armLength">
        <el-input v-model="form.armLength" placeholder="请输入下臂杆长/臂长"></el-input>
      </el-form-item>
      <el-form-item label="补偿深度(cm)：">
        <el-input v-model="form.compenDepth" placeholder="请输入补偿深度(cm)"></el-input>
      </el-form-item>
      <el-form-item label="作业宽幅(米)：" prop="defaultToolWidth">
        <el-input v-model="form.defaultToolWidth" placeholder="请输入作业宽幅"></el-input>
      </el-form-item>
      <el-form-item label="安装日期：" prop="installTime">
        <el-date-picker v-model="form.installTime" type="date" placeholder="请选择安装日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="服务截至日期：">
        <el-date-picker v-model="form.serveOverTime" type="date" placeholder="请选择服务截至日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="农机照片：" label-width="105px">
        <div style="width:189px">
          <el-button class="shadow-btn" type="primary" @click="uploadMachine">上传</el-button>
          <el-button class="shadow-btn" type="primary" @click="viewMachine">查看</el-button>
        </div>
      </el-form-item>
      <el-form-item label="农机属性：">
        <el-select v-model="form.originApp" placeholder="请选择农机属性">
          <el-option label="工况" value="1"></el-option>
          <el-option label="自动驾驶" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="农机作业类型：" prop="optionalJobTypeArray">
        <el-select v-model="form.optionalJobTypeArray" multiple collapse-tags placeholder="请选择农机作业类型">
          <el-option v-for="item in app.machineWorkType" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补贴状态：">
        <el-select v-model="form.allowanceStatus" clearable placeholder="请选择补贴状态">
          <el-option label="未发放" value="0"></el-option>
          <el-option label="已发放" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补贴额度：">
        <el-input v-model="form.allowance"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

export default {
  name:"MachineEditTab1",
  props: ['form'],
  inject: ['app'],
  data() {
    return {
      uploadVisible: false,
      rules: {
        plateNumber: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        machineType: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        initOffSet: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        initHeight: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        armLength: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        defaultToolWidth: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        installTime: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        optionalJobTypeArray: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
  },
  methods: {
    uploadMachine(){
      this.$emit('uploadMachine', 1)
    },
    viewMachine(){
      this.$emit('viewMachine', 1)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-select .el-tag {
  max-width: 80px;
}
</style>
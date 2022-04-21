<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" :inline="true">
      <el-form-item label="终端编号：" prop="terminalCode">
        <el-input v-model="form.terminalCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="是否包含SIM卡：" prop="containSim">
        <el-select v-model="form.containSim" placeholder="请选择是否包含SIM卡">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SIM卡卡号：" prop="simNumber">
        <el-input v-model="form.simNumber" placeholder="请选择SIM卡卡号"></el-input>
      </el-form-item>
      <el-form-item label="通讯协议：" prop="protocolId">
        <el-select v-model="form.protocolId" placeholder="请选择通讯协议">
          <el-option  v-for="item in app.protocolSelect" :key="item.rowId" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动计算标志：" prop="autoCalFalg">
        <el-select v-model="form.autoCalFalg" placeholder="请选择自动计算标志">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SIM卡结束时间：" prop="simOvertime">
        <el-date-picker v-model="form.simOvertime" type="date" placeholder="请输入SIM卡结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="终端型号：" prop="terminalModel">
        <el-select v-model="form.terminalModel" clearable placeholder="请选择终端型号">
          <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产厂商">
        <el-input v-model="form.manufacturer" placeholder="请输入生产厂商"></el-input>
      </el-form-item>
      <el-form-item label="终端类型：">
        <el-select v-model="form.terminalType" placeholder="请选择终端类型">
          <el-option label="高精度终端" value="H"></el-option>
          <el-option label="普通终端" value="G"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line" v-if="form.terminalType=='H'"></div>
    <el-form v-if="form.terminalType=='H'" ref="form2" :model="form" :rules="rules2" label-width="150px"
             :inline="true">
      <el-form-item label="版本号：" prop="cversion">
        <el-input v-model="form.cversion" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="通信服务器IP：" prop="serverIp">
        <el-input v-model="form.serverIp" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="通信端口：" prop="serverPort">
        <el-input v-model="form.serverPort" placeholder="请输入端口号"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="口令：" prop="userPass">
        <el-input v-model="form.userPass" placeholder="请输入口令"></el-input>
      </el-form-item>
      <el-form-item label="数据源：" prop="mountPoint">
        <el-input v-model="form.mountPoint" placeholder="请输入数据源"></el-input>
      </el-form-item>
      <el-form-item label="是否有效：" prop="enableStatus">
        <el-select v-model="form.enableStatus" placeholder="请选择是否有效">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.cDesc" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "MachineEditTab3",
  props: ['form'],
  inject: ['app'],
  data() {
    return {
      rules: {
        terminalCode: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        containSim: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        simNumber: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        protocolId: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        autoCalFalg: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        simOvertime: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ],
        terminalModel: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'},
        ]
      },
      rules2: {
        cversion: [
          {required: true, message: '请输入版本号', trigger: 'blur'},
        ],
        serverIp: [
          {required: true, message: '请输入IP地址', trigger: 'blur'},
        ],
        serverPort: [
          {required: true, message: '请输入端口号', trigger: 'blur'},
        ],
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        userPass: [
          {required: true, message: '请输入口令', trigger: 'blur'},
        ],
        mountPoint: [
          {required: true, message: '请输入数据源', trigger: 'blur'},
        ],
        enableStatus: [
          {required: true, message: '请选择是否有效', trigger: 'change'},
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
.line {
  width: 100%;
  height: 1px;
  margin-bottom: 30px;
  background: linear-gradient(90deg,
  #061d28 0%,
  #1a92cb 50%,
  #061d28 100%,);
  opacity: 0.5;
}

</style>
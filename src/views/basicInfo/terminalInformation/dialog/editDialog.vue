<template>
  <div>
    <el-dialog
      class="dialog"
      title="终端信息编辑"
      :visible.sync="dialogVisible"
      destroy-on-close
      width="1100px"
      top="15vh"
    >
      <div class="content" v-show="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" :inline="true">
          <el-form-item label="终端编号:" prop="terminalCode">
            <el-input v-model="form.terminalCode" placeholder="输入终端编号" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="第三方终端编号:">
            <el-input v-model="form.terminalCodeThird" placeholder="输入第三方终端编号"></el-input>
          </el-form-item>
          <el-form-item label="终端真实型号:" prop="terminalModelReal">
            <el-select v-model="form.terminalModelReal" placeholder="请选择终端真实型号">
              <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否包含SIM卡:" prop="containSim">
            <el-select v-model="form.containSim" placeholder="请选择是否包含SIM卡">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
            
          </el-form-item>
          <el-form-item v-if="form.containSim == 'Y'" label="SIM卡号码:" prop='simNumber'  
          :rules="{required: true, maxlength:11, pattern:/^[0-9]{1,18}$/, message:'请输入18位以内SIM卡号码',trigger:'blur'}">
            <el-input v-model="form.simNumber" oninput = "value=value.replace(/[^\d]/g,'')" placeholder="请输入SIM卡号码"></el-input>
          </el-form-item>
          <el-form-item v-else label="SIM卡号码:">
            <el-input v-model="form.simNumber" placeholder="请输入SIM卡号码" disabled></el-input>
          </el-form-item>
          <el-form-item label="SIM卡结束时间:">
            <el-date-picker v-model="form.simOvertime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="通信协议:" prop="protocolId">
            <el-select v-model="form.protocolId" placeholder="请选择通信协议" >
              <el-option v-for="(item,index) in app.protocolData" :key="index" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂商:" prop="manufacturer">
            <el-select v-model="form.manufacturer" clearable placeholder="请选择生产厂商">
              <el-option v-for="item in app.manufacturerData" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端型号:">
            <el-select v-model="form.terminalModel" placeholder="请选择终端型号">
              <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端类型:" prop="terminalType">
            <el-select v-model="form.terminalType" placeholder="请选择终端类型">
              <el-option label="高精度终端" value="H"></el-option>
              <el-option label="普通终端" value="G"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端代理商:" prop="agentFacturerId">
            <el-select v-model="form.agentFacturerId" placeholder="请选择终端代理商" clearable>
              <el-option v-for="(item,index) in app.terminalAgent" :key="index" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <div class="line"></div>
        </el-form>
        <el-form v-if="form.terminalType=='H'" ref="form2" :model="form" :rules="rules2" label-width="150px"
                 :inline="true">
          <el-form-item label="版本号:" prop="cdCorsSettingEntity.cversion">
            <el-input v-model="form.cdCorsSettingEntity.cversion" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="通信服务器IP:" prop="cdCorsSettingEntity.serverIp">
            <el-input v-model="form.cdCorsSettingEntity.serverIp" placeholder="请输入IP地址"></el-input>
          </el-form-item>
          <el-form-item label="通信端口:" prop="cdCorsSettingEntity.serverPort">
            <el-input v-model="form.cdCorsSettingEntity.serverPort" placeholder="请输入端口号"></el-input>
          </el-form-item>
          <el-form-item label="用户名:" prop="cdCorsSettingEntity.userName">
            <el-input v-model="form.cdCorsSettingEntity.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="口令:" prop="cdCorsSettingEntity.userPass">
            <el-input v-model="form.cdCorsSettingEntity.userPass" placeholder="请输入口令"></el-input>
          </el-form-item>
          <el-form-item label="数据源:" prop="cdCorsSettingEntity.mountPoint">
            <el-input v-model="form.cdCorsSettingEntity.mountPoint" placeholder="请输入数据源"></el-input>
          </el-form-item>
          <el-form-item label="是否有效:" prop="cdCorsSettingEntity.enableStatus">
            <el-select v-model="form.cdCorsSettingEntity.enableStatus" placeholder="请选择是否有效">
              <el-option label="是" value="1"></el-option>
              <el-option label="是" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.cdCorsSettingEntity.cDesc" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>返回</el-button>
        <el-button type="primary" class="shadow-btn" @click="save" round>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {updateTerminal} from "../../../../api/basic";
import {getMachineDict} from "../../../../api/basic/machine";
import {getTerminalDetail} from "@/api/basic/index"
export default {
  inject: ['app'],
  data() {
    return {
      dialogVisible: false,
      form: {},
      rowId:"",
      terminalModelSelect: [],
      rules: {
        terminalCode: [
          {required: true, message: '输入终端编号', trigger: 'blur'},
        ],
        terminalModelReal: [
          {required: true, message: '请选择终端真实型号', trigger: 'blur'},
        ],
        containSim: [
          {required: true, message: '请选择是否包含SIM卡', trigger: 'blur'},
        ],        
        manufacturer: [
          {required: true, message: '请选择生产厂商', trigger: 'change'},
        ],
        protocolId: [
          {required: true, message: '请选择通信协议', trigger: 'blur'},
        ],
        terminalType: [
          {required: true, message: '请选择终端类型', trigger: 'change'},
        ],
        agentFacturerId: [
          {required: true, message: '请选择终端代理商', trigger: 'change'},
        ]
      },
      rules2: {
        'cdCorsSettingEntity.cversion': [
          {required: true, message: '请输入版本号', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.serverIp': [
          {required: true, message: '请输入IP地址', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.serverPort': [
          {required: true, message: '请输入端口号', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.userName': [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.userPass': [
          {required: true, message: '请输入口令', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.mountPoint': [
          {required: true, message: '请输入数据源', trigger: 'blur'},
        ],
        'cdCorsSettingEntity.enableStatus': [
          {required: true, message: '请选择是否有效', trigger: 'change'},
        ]
      }
    }
  },
  watch:{
    'form.containSim'(newVal,oldVal){
      if(newVal == 'N'){
        this.form.simNumber = ''
      }
    },
    rowId(newVal,oldVal){
      if(newVal){
        this.getDetailById(newVal)
      }
    },
    dialogVisible(newVal,oldVal){
      if(!newVal){
        this.form = {}
        this.rowId = ""
      }
    }
  },
  methods: {
    save() {
      if(this.form.terminalType=='H'){
        this.$refs["form"].validate((valid)=>{
          if (valid) {
            this.$refs["form2"].validate((val) =>{
              if (val) {
                this.updateTerminal();
              } else {
                return false;
              }
            })
          } else {
            return false;
          }
        })
      } else {
        this.$refs["form"].validate((valid)=>{
          if (valid) {
            this.updateTerminal();
          } else {
            return false;
          }
        })
      }
    },
    //编辑更新
    async updateTerminal() {
      for(let i = 0;i<this.app.manufacturerData.length;i++){
        if(this.form.manufacturer == this.app.manufacturerData[i].itemName){
          this.form.manufacturerId = this.app.manufacturerData[i].itemCode;
        }
      }
      let params = Object.assign({}, this.form)
      let res = await updateTerminal(params);
      if (res) {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        });
        this.dialogVisible = false;
        this.$parent.initData();
      }
    },    
    async getDetailById(rowId){
      let res = await getTerminalDetail(rowId)
      //console.log(res);
      if(!res.code){
        res.data.protocolId +=''
        this.form = res.data 
        if(res.data.terminalType=='H' && !res.data.cdCorsSettingEntity){
          this.form.cdCorsSettingEntity={};
        }
        // debugger;

        for(let i = 0;i<this.app.manufacturerData.length;i++){
          if(this.form.manufacturerId == this.app.manufacturerData[i].itemCode){
            this.form.manufacturer = this.app.manufacturerData[i].itemName;
          }
        }
      }else{
        this.$message.error(res.msg)
      }
    }

  },
}
</script>

<style lang="less" scoped>

.content {
  padding-top: 40px;

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
}

/deep/ .el-input__inner {
  width: 185px;
}

/deep/ .el-button {
  width: 72px;
}

/deep/ .shadow-btn {
  border-radius: 20px;
  height: 35px;
  margin-left: 6px;
}
/deep/ .el-input__prefix {
  left: 152px;
}

</style>
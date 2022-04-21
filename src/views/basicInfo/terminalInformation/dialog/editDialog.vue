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
          <el-form-item label="终端编号：" prop="terminalCode">
            <el-input v-model="form.terminalCode" placeholder="输入终端编号" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="第三方终端编号：">
            <el-input v-model="form.originApp" placeholder="输入第三方终端编号"></el-input>
          </el-form-item>
          <el-form-item label="终端真实型号：" prop="terminalModelReal">
            <el-select v-model="form.terminalModelReal" placeholder="请选择终端真实型号">
              <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否包含SIM卡：" prop="containSim">
            <el-select v-model="form.containSim" placeholder="请选择是否包含SIM卡">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SIM卡号码：">
            <el-input v-model="form.simNumber" placeholder="请输入SIM卡号码"></el-input>
          </el-form-item>
          <el-form-item label="SIM卡结束时间：">
            <el-date-picker v-model="form.simOvertime" type="date" value-format="yyyy-MM-dd" placeholder="请选择安装日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="通信协议：" prop="protocolId">
            <el-select v-model="form.protocolId" placeholder="请选择通信协议">
              <el-option v-for="(item,index) in app.protocolData" :key="index" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂商：">
            <el-input v-model="form.manufacturer" placeholder="请选择生产厂商">
            </el-input>
          </el-form-item>
          <el-form-item label="终端型号：">
            <el-select v-model="form.terminalModel" placeholder="请选择终端型号">
              <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端类型：">
            <el-select v-model="form.terminalType" placeholder="请选择终端类型">
              <el-option label="高精度终端" value="H"></el-option>
              <el-option label="普通终端" value="G"></el-option>
            </el-select>
          </el-form-item>
          <div class="line"></div>
        </el-form>
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
              <el-option label="是" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.cDesc" placeholder="请输入备注"></el-input>
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

export default {
  inject: ['app'],
  data() {
    return {
      dialogVisible: false,
      form: {},
      terminalModelSelect: [],
      rules: {
        terminalCode: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        terminalModelReal: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        containSim: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        protocolId: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
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
  },
  methods: {
    save() {
      this.$refs["form"].validate((valid) => {
        if(this.form.terminalType=='H'){
          this.$refs["form2"].validate((valid) =>{
            if (valid) {
              this.updateTerminal();
            } else {
              return false;
            }
          })
        } else {
          if (valid) {
            this.updateTerminal();
          } else {
            return false;
          }
        }
      });
    },
    async updateTerminal() {
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
  }
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
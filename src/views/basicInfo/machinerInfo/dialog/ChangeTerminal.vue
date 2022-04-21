<template>
  <div>
    <el-dialog
      class="dialog"
      :title="'更换终端'"
      :visible.sync="dialogVisible"
      :width="'1080px'"
      top="15vh"
      destroy-on-close
    >
      <div class="content">
        <el-form ref="form" :model="newForm" :rules="rules" label-width="150px" :inline="true">
          <el-form-item label="原终端:">
            <el-input v-model="form.terminalCode" placeholder="请输入原终端"  disabled></el-input>
          </el-form-item>
          <el-form-item label="是否包含SIM卡:">
            <el-input v-model="form.containSim" disabled></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号码:">
            <el-input v-model="form.simNumber" placeholder="请输入SIM卡号码" disabled></el-input>
          </el-form-item>
          <div class="search">
            <img src="@/assets/images/one-picture-search.png" alt="" @click="searchTerminal" />
          </div>
          <el-form-item label="新终端：" prop="newTerminalCode">
            <el-input v-model="newForm.newTerminalCode" placeholder="请输入新终端："></el-input>
          </el-form-item>
          <el-form-item label="是否包含SIM卡：">
            <el-select v-model="newForm.newContainSim" placeholder="请选择是否包含SIM卡：">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SIM卡号码：">
            <el-input v-model="newForm.newSimNumber" placeholder="请输入SIM卡号码："></el-input>
          </el-form-item>
          <el-form-item label="终端型号：" prop="newTerminalModel">
            <el-select v-model="newForm.newTerminalModel" placeholder="请输入终端型号">
              <el-option v-for="item in app.terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commit">
        <el-button type="primary" class="shadow-btn" @click="cancel">取消</el-button>
        <el-button type="primary" class="shadow-btn" @click="save">保存</el-button>
      </div>
    </el-dialog>

    <SearchTerminal ref="searchDialog" @getNewTerminalForm="getNewTerminalForm"></SearchTerminal>
  </div>
</template>

<script>
import SearchTerminal from "./SearchTerminal";
import {changeTerminal} from "../../../../api/basic/machine";

const newForm = {
  newTerminalCode: '',
  newContainSim: '',
  newSimNumber: '',
  newTerminalModel: '',
}

export default {
  components: {
    SearchTerminal,
  },
  inject: ['app'],
  data() {
    return {
      dialogVisible: false,
      form: {},
      newForm: Object.assign({},newForm),
      rules: {
        newTerminalCode: [
          {required: true, message: '请输入新终端', trigger: 'blur'},
        ],
        newTerminalModel: [
          {required: true, message: '请输入终端型号', trigger: 'change'},
        ]
      },
      model: ''
    }
  },
  methods: {
    reFreshNewForm(){
      this.newForm = Object.assign({},newForm)
    },
    cancel() {
      this.dialogVisible = false;
    },
    searchTerminal(){
      this.$refs.searchDialog.searchVisible = true;
    },
    getNewTerminalForm(val){
      this.newForm.newTerminalCode = val.terminalCode;
      this.newForm.newContainSim = val.containSim;
      this.newForm.newSimNumber = val.simNumber;
      this.newForm = Object.assign(this.newForm,val)
    },
    save() {
      this.$refs["form"].validate((valid)=>{
        if(valid){
          this.changeTerminal()
        }else {
          return false;
        }
      })
    },
    async changeTerminal(){
      console.log(this.newForm)
      let params = {
        machineId: this.form.machineId ? this.form.machineId : this.form.rowId,
        terminalId: this.form.terminalId ?this.form.terminalId: this.form.rowId,
        terminalCode: this.form.terminalCode,
        containSim: this.form.containSim,
        simNumber: this.form.simNumber,
        newTerminalId: this.newForm.rowId,
        newMachineId: this.newForm.machineId,
        newSimOverTime: this.newForm.simOvertime,
        newTerminalCode: this.newForm.newTerminalCode,
        newContainSim: this.newForm.newContainSim,
        newSimNumber: this.newForm.newSimNumber,
        newTerminalModel: this.newForm.newTerminalModel,
      }
      debugger
      let res = await changeTerminal(params);
      if(res){
        this.$message.success(res.msg);
        this.$parent.searchMachineList();
        this.dialogVisible = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  margin-top: 30px;
  position: relative;

  .search {
    position: absolute;
    top: 71px;
    left: 30px;
  }
  /deep/ .el-input__inner {
    width: 185px;
  }
}

/deep/ .el-button {
  width: 72px;
}

/deep/ .shadow-btn {
  border-radius: 20px;
  height: 35px;
  margin-left: 6px;
}

.commit {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 50px;
  margin-bottom: 20px;
}
</style>
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
        <el-form
          ref="form"
          :model="newForm"
          :rules="rules"
          label-width="150px"
          :inline="true"
        >
          <el-form-item label="原终端:">
            <el-input
              v-model="form.terminalCode"
              placeholder="请输入原终端"
              disabled
              >}</el-input
            >
          </el-form-item>
          <el-form-item label="是否包含SIM卡:">
            <el-input v-model="yesOrNo[form.containSim]" disabled></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号码:">
            <el-input
              v-model="form.simNumber"
              placeholder="请输入SIM卡号码"
              disabled
            ></el-input>
          </el-form-item>
          <div class="search">
            <img
              src="@/assets/images/one-picture-search.png"
              alt=""
              @click="searchTerminal"
            />
          </div>
          
          <el-form-item label="新终端:" prop="newTerminalCode">
            <!-- <el-input
              v-model="newForm.newTerminalCode"
              placeholder="请输入新终端"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              onafterpaste="this.value=this.value.replace(/\D/g,'')"
            ></el-input> -->
            <el-select
              v-model="newForm.newTerminalCode"
              filterable
              remote
              reserve-keyword
              placeholder="请输入终端编号"
              @blur="terminalCodeBlur"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.terminalCode"
                :label="item.terminalCode"
                :value="item.terminalCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否包含SIM卡:" >
            <el-select
              v-model="newForm.newContainSim"
              placeholder="请选择是否包含SIM卡"
              :disabled="isOriginTerminal"
            >
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item
            v-if="newForm.newContainSim == 'Y'"
            label="SIM卡号码:"
            prop="newSimNumber"
            :rules="{
              required: true,
              pattern: /^[0-9]{1,18}$/,
              message: '请输入18位以内SIM卡号码',
              trigger: 'blur',
              }"
          >
            <el-input
              v-model.trim="newForm.newSimNumber"
              placeholder="请输入SIM卡号码"
              :disabled="isOriginTerminal"
            ></el-input>
          </el-form-item>
          <el-form-item v-else label="SIM卡号码:">
            <el-input
              v-model.trim="newForm.newSimNumber"
              placeholder="请输入SIM卡号码"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="生产厂商:">
            <el-select v-model="newForm.newManufacturerId" clearable placeholder="请选择生产厂商" 
              :disabled="isOriginTerminal">
              <el-option
                v-for="item in machineDict.manufacturerData"
                :key="item.id"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端代理商:">
            <el-select v-model="newForm.newAgentFacturerId" placeholder="请选择终端代理商" clearable
              :disabled="isOriginTerminal">
              <el-option
                v-for="item in machineDict.terminalAgent"
                :key="item.id"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>            
              </el-select>
          </el-form-item>
          <el-form-item label="终端型号:">
            <el-select
              v-model="newForm.newTerminalModel"
              placeholder="请输入终端型号"
              :disabled="isOriginTerminal"
            >
              <el-option
                v-for="item in machineDict.terminalModelSelect"
                :key="item.id"
                :label="item.itemName"
                :value="item.itemName"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="SIM卡结束时间:">
              <el-date-picker
                class="datepicker"
                v-model="newForm.newSimOverTime"
                type="date"
                :disabled="isOriginTerminal"
                :clearable="true"
                placeholder="SIM卡结束时间"
              ></el-date-picker>
            </el-form-item>
        </el-form>
      </div>
      <div class="commit">
        <el-button type="primary" class="shadow-btn" @click="cancel"
          >取消</el-button
        >
        <el-button type="primary" class="shadow-btn" @click="save"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <SearchTerminal
      ref="searchDialog"
      @getNewTerminalForm="getNewTerminalForm"
    ></SearchTerminal>
  </div>
</template>

<script>
import SearchTerminal from "./SearchTerminal";
import { changeTerminal } from "../../../../api/basic/machine";
import {getInquireTerminal} from "../../../../api/basic/machine";
import {dateFormat} from '@/util/util';

const newForm = {
  newTerminalCode: "",
  newContainSim: "",
  newSimNumber: "",
  newTerminalModel: "",
  newManufacturerId:"",
  newAgentFacturerId:"",
  newSimOverTime:""
};

export default {
  components: {
    SearchTerminal,
  },
  props: ["machineDict"],
  data() {
    return {
      dialogVisible: false,
      form: {},
      newForm: Object.assign({}, newForm),
      rules: {
        newTerminalCode: [
          { required: true, message: "请输入新终端", trigger: "blur" },
        ],
        newTerminalModel: [
          { required: true, message: "请输入终端型号", trigger: "change" },
        ],
      },
      model: "",
      yesOrNo: {
        Y: "是",
        N: "否",
        undefined: "",
        null: "",
      },
      loading:false,
      options:[],
      isOriginTerminal:false,
    };
  },
  watch:{
    "newForm.newTerminalCode"(val,oldVal){
      if(val){
        let res = this.options.filter(item=>{
          return item.terminalCode == val
        })
        // console.log('res',res)
        if(res.length == 1){
          this.isOriginTerminal = true
          this.getNewTerminalForm(res[0])
        }else{
          this.isOriginTerminal = false
          this.getNewTerminalForm({
            terminalCode:val
          })
        }
      }else{
        this.isOriginTerminal = false
      }
    }
  },
  methods: {
    reFreshNewForm() {
      this.newForm = Object.assign({}, newForm);
    },
    cancel() {
      this.dialogVisible = false;
    },
    searchTerminal() {
      this.$refs.searchDialog.searchVisible = true;
    },
    getNewTerminalForm(val) {
      this.newForm.newTerminalCode = val.terminalCode;
      this.newForm.newContainSim = val.containSim;
      this.newForm.newSimNumber = val.simNumber;
      
      this.newForm.newTerminalModel = val.terminalModel
      this.newForm.newSimOverTime = val.simOvertime
      this.newForm.newAgentFacturerId = val.agentFacturerId ;
      this.newForm.newManufacturerId = val.manufacturerId ;
      this.newForm = Object.assign(this.newForm, val);
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.changeTerminal();
        } else {
          return false;
        }
      });
    },
    //检查是否是有选中的
    // check(){
      
    // },
    //终端编号失去焦点事件
    terminalCodeBlur(e){
      this.newForm.newTerminalCode = e.target.value      
    },
    //选择框输入时间
    remoteMethod(query){
        if (query !== '') {
          this.loading = true;
          this.inquireTerminal(query)
        } else {
          this.options = [];
        }
    },
    async inquireTerminal(terminalCode){
        let res = await getInquireTerminal({
          terminalCode:terminalCode,
          page:-1,
          rows:-1
        })
        if(!res.code){
          this.loading = false
          this.options = res.list
        }
    },
    async changeTerminal() {
      let params = {
        machineId: this.form.machineId ? this.form.machineId : this.form.rowId,
        terminalId: this.form.terminalId
          ? this.form.terminalId
          : this.form.rowId,
        terminalCode: this.form.terminalCode,
        containSim: this.form.containSim,
        simNumber: this.form.simNumber,
        newTerminalId: this.newForm.rowId,
        newMachineId: this.newForm.machineId,
        newTerminalCode: this.newForm.newTerminalCode,
        newContainSim: this.newForm.newContainSim,
        newSimNumber: this.newForm.newSimNumber,
        newTerminalModel: this.newForm.newTerminalModel,
        newSimOverTime:dateFormat(this.newForm.newSimOverTime) ,
        newAgentFacturerId:this.newForm.newAgentFacturerId,
        newManufacturerId:this.newForm.newManufacturerId
      };
      // debugger

      let res = await changeTerminal(params);
      if (res.code == 0) {
        this.$message.success(res.msg);
        this.$parent.searchMachineList();
        this.dialogVisible = false;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
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

/deep/ .el-input__prefix {
  left: 152px;
}

.commit {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 50px;
  margin-bottom: 20px;
}
</style>
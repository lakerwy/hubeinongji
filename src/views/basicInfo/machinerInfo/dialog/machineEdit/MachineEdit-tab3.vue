<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="150px"
      :inline="true"
    >
      <el-form-item label="终端编号:" prop="terminalCode">
        <el-input
          v-model.trim="form.terminalCode"
          maxlength="16"
          placeholder="请输入终端编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否包含SIM卡:" prop="containSim">
        <el-select v-model.trim="form.containSim" placeholder="请选择是否包含SIM卡">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        v-if="form.containSim == 'Y'"
        label="SIM卡号码:"
        prop="simNumber"
        :rules="{
          required: true,
          pattern: /^[0-9]{1,18}$/,
          message: '请输入18位以内SIM卡号码',
          trigger: 'blur',
          validator: theRules2 }"  ===> 会报错
      > -->
      <el-form-item
        v-if="form.containSim == 'Y'"
        label="SIM卡号码:"
        prop="simNumber"
        :rules="{
          required: true,
          pattern: /^[0-9]{1,18}$/,
          message: '请输入18位以内SIM卡号码',
          trigger: 'blur'}"
      >
        <el-input
          v-model.trim="form.simNumber"
          placeholder="请输入SIM卡号码"
        ></el-input>
      </el-form-item>
      <el-form-item v-else label="SIM卡号码:">
        <el-input
          v-model.trim="form.simNumber"
          placeholder="请输入SIM卡号码"
          disabled
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="SIM卡卡号:" prop="simNumber">
        <el-input v-model.trim="form.simNumber" placeholder="请选择SIM卡卡号"></el-input>
      </el-form-item> -->
      <el-form-item label="通讯协议:" prop="protocolId">
        <el-select v-model.trim="form.protocolId" placeholder="请选择通讯协议">
          <el-option
            v-for="item in machineDict.protocolSelect"
            :key="item.rowId"
            :label="item.itemName"
            :value="item.itemCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动计算标志:" prop="autoCalFalg">
        <el-select v-model.trim="form.autoCalFalg" placeholder="请选择自动计算标志">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.containSim == 'Y'"
        label="SIM卡结束时间:"
        prop="simOvertime"
        :rules="{
          required: true,
          message: '请选择SIM卡结束时间',
          trigger: 'change',
        }"
      >
        <el-date-picker
          v-model.trim="form.simOvertime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="请输入SIM卡结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item v-else label="SIM卡结束时间:" prop="simOvertime">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="请输入SIM卡结束时间"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="终端型号:" prop="terminalModel">
        <el-select
          v-model.trim="form.terminalModel"
          clearable
          placeholder="请选择终端型号"
        >
          <el-option
            v-for="item in machineDict.terminalModelSelect"
            :key="item.id"
            :label="item.itemName"
            :value="item.itemName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端真实型号:" prop="terminalModelReal">
        <el-select
          v-model.trim="form.terminalModelReal"
          clearable
          placeholder="请选择终端型号"
        >
          <el-option
            v-for="item in machineDict.terminalModelSelect"
            :key="item.id"
            :label="item.itemName"
            :value="item.itemName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产厂商:" prop="manufacturerId">
        <el-select
          v-model.trim="form.manufacturerId"
          clearable
          placeholder="请选择生产厂商"
        >
          <el-option
            v-for="item in machineDict.manufacturerData"
            :key="item.id"
            :label="item.itemName"
            :value="item.itemCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端代理商:" prop="agentFacturerId">
        <el-select
          v-model.trim="form.agentFacturerId"
          placeholder="请选择终端代理商"
        >
          <el-option
            v-for="(item, index) in machineDict.terminalAgent"
            :key="index"
            :label="item.itemName"
            :value="item.itemCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端类型:" prop="terminalType">
        <el-select v-model.trim="form.terminalType" placeholder="请选择终端类型">
          <el-option label="高精度终端" value="H"></el-option>
          <el-option label="普通终端" value="G"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="line" v-if="form.terminalType == 'H'"></div>
    <el-form
      v-if="form.terminalType == 'H'"
      ref="form2"
      :model="form"
      :rules="rules2"
      label-width="150px"
      :inline="true"
    >
      <el-form-item label="版本号:" prop="cversion">
        <el-input v-model.trim="form.cversion" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="通信服务器IP:" prop="serverIp">
        <el-input v-model.trim="form.serverIp" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="通信端口:" prop="serverPort">
        <el-input
          v-model.trim="form.serverPort"
          placeholder="请输入端口号"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model.trim="form.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="口令:" prop="userPass">
        <el-input v-model.trim="form.userPass" placeholder="请输入口令"></el-input>
      </el-form-item>
      <el-form-item label="数据源:" prop="mountPoint">
        <el-input
          v-model.trim="form.mountPoint"
          placeholder="请输入数据源"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否有效:" prop="enableStatus">
        <el-select v-model.trim="form.enableStatus" placeholder="请选择是否有效">
          <el-option label="是" value="Y"></el-option>
          <el-option label="否" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model.trim="form.cdesc" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { rule } from "@/util/rule";

export default {
  name: "MachineEditTab3",
  props: ["form", "machineDict"],
  data() {
    let theRules = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } 
    };
    return {
      rules: {
        terminalCode: [
          {
            required: true,
            pattern: /^[0-9]{1,16}$/,
            message: "请输入终端编号",
            trigger: "blur",
          },
        ],
        containSim: [
          { required: true, message: "请选择是否有SIM卡", trigger: "change" },
        ],
        simNumber: [
          { required: true, message: "请输入SIM卡卡号", trigger: "blur" },
          { pattern: /^[0-9]{3}$/, message: "33333", trigger: "blur" },
        ],
        protocolId: [
          { required: true, message: "请选择通讯协议", trigger: "change" },
        ],
        autoCalFalg: [
          { required: true, message: "请选择自动计算标志", trigger: "change" },
        ],
        // simOvertime: [
        //   { required: true, message: "请选择SIM卡结束时间", trigger: "change" },
        // ],
        terminalModel: [
          { required: true, message: "请选择终端型号", trigger: "change" },
        ],
        terminalModelReal: [
          { required: true, message: "请选择终端真实型号", trigger: "change" },
        ],
        manufacturerId: [
          { required: true, message: "请选择生产厂商", trigger: "change" },
        ],
        agentFacturerId: [
          { required: true, message: "请选择终端代理商", trigger: "change" },
        ],
        terminalType: [
          { required: true, message: "请选择终端类型", trigger: "change" },
        ],
      },
      rules2: {
        cversion: [
          { required: true, message: "请输入版本号", trigger: "blur" },
        ],
        serverIp: [
          {
            required: true,
            pattern:
              /^((2(5[0-5]|[0-4]\d))|1\d{2}|[1-9]?\d)(\.((2(5[0-5]|[0-4]\d))|1\d{2}|[1-9]?\d)){3}$/,
            message: "请输入正确的IP地址",
            trigger: "blur",
          },
        ],
        serverPort: [
          { required: true, message: "请输入端口号", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        userPass: [{ required: true, message: "请输入口令", trigger: "blur" }],
        mountPoint: [
          { required: true, message: "请输入数据源", trigger: "blur" },
        ],
        enableStatus: [
          { required: true, message: "请选择是否有效", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    "form.containSim"(newVal, oldVal) {
      ``;
      if (newVal == "N") {
        this.form.simNumber = "";
        this.form.simOvertime = "";
      }
    },
  },
};
</script>

<style scoped lang="less">
.line {
  width: 100%;
  height: 1px;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #061d28 0%, #1a92cb 50%, #061d28 100%);
  opacity: 0.5;
}
</style>
<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="154px"
      :inline="true"
      label-position="right"
    >
      <el-form-item label="农机车牌:" prop="plateNumber">
        <el-input
          v-model.trim="form.plateNumber"
          placeholder="请输入农机车牌"
        ></el-input>
      </el-form-item>
      <el-form-item label="农机型号:">
        <el-input
          v-model.trim="form.machineModel"
          placeholder="请输入农机型号"
        ></el-input>
      </el-form-item>
      <el-form-item label="出厂编号:">
        <el-input
          v-model.trim="form.factoryNumber"
          placeholder="请输入出厂编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="农机功率(千瓦):" prop="machinePower">
        <el-input
          v-model.trim="form.machinePower"
          placeholder="请输入农机功率"
        ></el-input>
      </el-form-item>
      <el-form-item label="农机品牌:">
        <el-select
          v-model.trim="form.brandId"
          @change="getBrand"
          placeholder="请选择农机品牌"
        >
          <el-option
            v-for="(item, index) in machineDict.allBrand"
            :key="index"
            :label="item.itemName"
            :value="item.itemCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购置时间:">
        <el-date-picker
          v-model.trim="form.purchaseTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择购置时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="农机类型:" prop="machineType">
        <el-select
          v-model.trim="form.machineType"
          clearable
          placeholder="请选择农机类型"
        >
          <el-option
            v-for="item in machineDict.machineTypeSelect"
            :key="item.id"
            :label="item.itemName"
            :value="item.itemCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机具类型:" prop="defaultToolType">
        <el-select
          v-model.trim="form.defaultToolType"
          placeholder="请选择机具类型"
        >
          <el-option
            v-for="item in getByMachineDict.toolTypeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选装件类型:" prop="optionalTypeArray">
        <el-select
          v-model.trim="form.optionalTypeArray"
          multiple
          collapse-tags
          @change="selectOptionalTypeArray"
          placeholder="请选择选装件类型"
        >
          <el-option label="摄像头" value="1"></el-option>
          <el-option label="超声波传感器" value="2"></el-option>
          <el-option label="角度传感器" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始偏移(角度):" prop="initOffSet">
        <el-input
          v-model.trim="form.initOffSet"
          placeholder="请输入初始偏移角度"
        ></el-input>
      </el-form-item>
      <el-form-item label="初始高度(cm):" prop="initHeight">
        <el-input
          v-model.trim="form.initHeight"
          placeholder="请输入初始高度"
        ></el-input>
      </el-form-item>
      <el-form-item label="下臂杆长/臂长(cm):" prop="armLength">
        <el-input
          v-model.trim="form.armLength"
          placeholder="请输入下臂杆长/臂长"
        ></el-input>
      </el-form-item>
      <el-form-item label="补偿深度(cm):" prop="compenDepth">
        <el-input
          v-model.trim="form.compenDepth"
          placeholder="请输入补偿深度(cm)"
        ></el-input>
      </el-form-item>
      <el-form-item label="作业宽幅(米):" prop="defaultToolWidth">
        <el-input
          v-model.trim="form.defaultToolWidth"
          maxlength="10"
          placeholder="请输入作业宽幅"
        ></el-input>
      </el-form-item>
      <el-form-item label="安装日期:">
        <el-date-picker
          v-model.trim="form.installTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择安装日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="服务截至日期:">
        <el-date-picker
          style="width:100%"
          v-model.trim="form.serveOverTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择服务截至日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="农机照片:">
        <div style="width: 180px">
          <el-button class="shadow-btn" type="primary" @click="uploadMachine"
            >上传</el-button
          >
          <el-button class="shadow-btn" type="primary" @click="viewMachine"
            >查看</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="农机属性:">
        <el-select
          v-model.trim="form.originAppArray"
          multiple
          collapse-tags
          @change="$forceUpdate()"
          placeholder="请选择农机属性"
        >
          <el-option label="工况" value="1"></el-option>
          <el-option label="自动驾驶" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="农机作业类型:" prop="optionalJobTypeArray">
        <el-select
          v-model.trim="form.optionalJobTypeArray"
          multiple
          collapse-tags
          @change="$forceUpdate()"
          placeholder="请选择农机作业类型"
        >
          <el-option
            v-for="item in getByMachineDict.machineJobList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补贴状态:">
        <el-select
          v-model.trim="form.allowanceStatus"
          clearable
          placeholder="请选择补贴状态"
        >
          <el-option label="未发放" value="0"></el-option>
          <el-option label="已发放" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补贴额度:" prop="allowance">
        <el-input v-model.trim="form.allowance"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getJobType, getToolType } from "../../../../../api/basic/machine";

export default {
  name: "MachineEditTab1",
  props: ["form", "machineDict", "getByMachineDict"],
  data() {
    let theRules = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (value) {
          if (value < 0 || value > 5000) {
            callback(new Error("请输入范围(0,5000)的数字"));
          } else {
            callback();
          }
        }
      }
    };
    let theRules2 = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (value) {
          if (value < 0 || value > 20) {
            callback(new Error("作业宽幅的范围是(0,20]"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      uploadVisible: false,
      rules: {
        plateNumber: [
          { required: true, message: "请输入农机车牌", trigger: "blur" },
        ],
        machinePower: [
          { required: true, message: "请输入农机功率", trigger: "blur" },
          { validator: theRules, trigger: "blur" },
        ],
        machineType: [
          { required: true, message: "请选择农机类型", trigger: "change" },
        ],
        defaultToolType: [
          { required: true, message: "请选择机具类型", trigger: "change" },
        ],
        optionalTypeArray: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个选装件",
            trigger: "change",
          },
        ],
        compenDepth: [
          {
            required: true,
            message: "请输入补偿深度",
            trigger: "blur",
            validator: theRules,
          },
        ],
        initOffSet: [
          {
            required: true,
            message: "请输入初始偏移角度",
            validator: theRules,
            trigger: "blur",
          },
        ],
        initHeight: [
          {
            required: true,
            message: "请输入初始高度",
            validator: theRules,
            trigger: "blur",
          },
        ],
        armLength: [
          {
            required: true,
            message: "请输入初始下臂杆长/臂长",
            validator: theRules,
            trigger: "blur",
          },
        ],
        defaultToolWidth: [
          {
            required: true,
            message: "请输入作业宽幅",
            validator: theRules2,
            trigger: "blur",
          },
        ],
        optionalJobTypeArray: [
          {
            type: "array",
            required: true,
            message: "请选择农机作业类型",
            trigger: "change",
          },
        ],
        allowance: [
          {
            required: false,
            min: 1,
            max: 5,
            message: "补贴额度的范围是(0,100000)",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    selectOptionalTypeArray(){
      this.$forceUpdate();
      this.$nextTick(function(){
        // console.log(this.form.optionalTypeArray.length);
        if(this.form.optionalTypeArray.length > 0){
          this.$refs.form.clearValidate("optionalTypeArray");
        }
      })
    },
    getBrand(val) {
      this.machineDict.allBrand.forEach((element) => {
        if (element.itemCode == val) {
          this.form.brand = element.itemName;
        }
      });
      this.$emit("Brand", this.form.brand);
      console.log(this.form.brand);
    },
    uploadMachine() {
      this.$emit("uploadMachine", 1);
    },
    viewMachine() {
      this.$emit("viewMachine", 1);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-select .el-tag {
  //max-width: 80px;
}
</style>
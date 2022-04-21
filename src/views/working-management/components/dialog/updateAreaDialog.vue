<template>
<!-- 修改面积 -->
  <el-dialog 
    class="my-dialog area-dialog" 
    title="修改地块面积" 
    :visible.sync="dialogVisible"
    width="55%"
    top="30vh"
    @close="close">
    <el-form class="add-form" ref="form" :model="form" label-width="150px" inline>
      <el-form-item label="机具类型：">
        <el-select v-model="form.ToolTypeUpdate" placeholder="请选择机具类型" @change="toolChange">
          <el-option v-for="item in toolTypes" :key="item.text" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作业类型：" prop="JobTypeChanged">
        <el-select v-model="form.JobTypeChanged" disabled placeholder="请选择作业类型">
          <el-option v-for="item in jobTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平均深度：" prop="avgDepth">
        <el-input type="number" v-model.number="form.avgDepth" placeholder="请输入平均深度"></el-input>
      </el-form-item>
      <el-form-item label="深度合格率：" prop="depthRate">
        <el-input type="number" v-model.number="form.depthRate" placeholder="输入深度合格率"></el-input>
      </el-form-item>
      <el-form-item label="计算面积：">
        <el-input type="number" v-model.number="form.computeAreaUpdate" readonly placeholder="请输入计算面积">
          <template slot="suffix">
            <el-divider direction="vertical"></el-divider>
            <span class="unit">亩</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="修改面积：">
        <el-input type="number" v-model.number="form.modifyArea" placeholder="请输入修改面积">
          <template slot="suffix">
            <el-divider direction="vertical"></el-divider>
            <span class="unit">亩</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="作业区域：" class="region">
        <el-row>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.provinceId" @change="handleProvinceChange" placeholder="请选择省">
              <el-option v-for="item in province" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.cityId" @change="handleCityChange" placeholder="请选择市">
              <el-option v-for="item in city" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.countryId" @change="handleCountryChange" placeholder="请选择县">
              <el-option v-for="item in country" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.townId" placeholder="请选择街道/镇">
              <el-option v-for="item in street" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业地址：" prop="address">
        <el-input style="width: 400px;" v-model="form.address" placeholder="请输入作业地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" plain round @click="submit">保存</el-button>
      <el-button class="shadow-btn" plain round @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { selectToolTypeChange, selectProvince, selectJobTypeChange, updateJobArea } from '@/api/working/index'
import{ getDictByListType } from '@/api/basic/index'
import { filterDict } from '@/util/util.js'
export default {
  name: 'updateAreaDialog',
  data() {
    return {
      dialogVisible: false,
      form: {
        provinceId: '',
        cityId: '',
        countryId: '',
        townId: '',
        avgDepth: '',
        depthRate: '',
        modifyArea: '',
        address: ''
      },
      toolTypes: [],
      jobTypes: [],
      province: [], // 省
      city: [], // 市
      country: [], // 县
      street: [], // 街道
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dialogVisible(newV) {
      // 通过监听dialog状态来初始化请求
      if(newV) {
        this.initData();
        this.initJobTypes();
        this.initToolTypes();
        this.initProvince(0, 'province')
      }
    }
  },
  created() {
    
  },
  methods: {
    initData() {
      this.form.avgDepth = this.data.avgDepth;
      this.form.depthRate = this.data.depthRate;
      this.form.modifyArea = this.data.modifyArea;
      this.form.address = this.data.address;
      this.form.ToolTypeUpdate = this.data.toolType;
      if(this.form.ToolTypeUpdate) {
        this.toolChange(this.form.ToolTypeUpdate);
      }
      this.form.computeAreaUpdate = this.data.computeArea;
      this.form.initMachineType = this.data.machineType;
      this.form.rowId = this.data.rowId;
    },
    // 根据农机类型获取机具列表
    async initToolTypes() {
      let params = {
        machineType: this.data.machineType
      }
      let res = await selectToolTypeChange(params);
      if(res) {
        this.toolTypes = res;
      }
    },
    async initJobTypes() {
      let params = {
        listType: 'job_type'
      }
      let res = await getDictByListType(params);
      let {code, data} = res;
      if(code == 0) {
        this.jobTypes = data;
      }
    },
    // 机具类型改变
    async toolChange(val) {
      let params = {
        toolType: val
      }
      let res = await selectJobTypeChange(params);
      if(res.jobType) {
        this.$set(this.form, 'JobTypeChanged', res.jobTypeName);
        this.$set(this.form, 'updateJobType', res.jobType);
      }
    },
    async initProvince(id = 0, t = 'province') {
      let params = {
        groupPId: id
      }
      let res = await selectProvince(params);
      const {code, data} = res;
      if(code == 0) {
        this[t] = data;
      }
    },
    // 省数据选择
    handleProvinceChange(val) {
      this.initProvince(val, 'city');
      this.form.cityId = '';
      this.form.countryId = '';
      this.form.townId = '';
    },
    handleCityChange(val) {
      this.initProvince(val, 'country');
      this.form.countryId = '';
      this.form.townId = '';
    },
    handleCountryChange(val) {
      this.initProvince(val, 'street');
      this.form.townId = '';
    },
    nameFilter(value, list) {
      return filterDict(value, { labelKey: 'domainName', valueKey: 'rowId' }, list)
    },
    // 提交
    async submit() {
      this.form.province = this.nameFilter(this.form.provinceId, this.province);
      this.form.city = this.nameFilter(this.form.cityId, this.city);
      this.form.country = this.nameFilter(this.form.countryId, this.country);
      this.form.town = this.nameFilter(this.form.townId, this.street);
      this.form.updateToolType = this.form.ToolTypeUpdate;
      // let params = {
      //   atArea: this.form
      // };
      let res = await updateJobArea(this.form);
      const {code, msg} = res;
      if(code == 0) {
        this.$message.success('修改地块面积成功');
        this.$refs.form.resetFields();
        this.dialogVisible = false;
        this.$emit('refreshData');
      } else {
        this.$message.error(msg || '修改地块面积失败')
      }
    },
    close() {
      // this.form = {};
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.area-dialog {
  /deep/ .el-input {
    width: 218px;
  }
  /deep/ .el-input__suffix {
    color: #80c5ff;
    opacity: 0.6;
    font-family: SourceHanSansCN-Regular;
    font-size: 14px;
    .unit {
      margin-right: 5px;
    }
  }
  .el-divider {
    background-color: #55adff;
    height: 20px;
    opacity: 0.17;
  }
  .line {
    width: 26px;
    text-align: center;
    color: #356e97;
    font-size: 12px;
  }
  .region {
    /deep/ .el-input {
      width: 100%;
    }
  }
  .el-col-5 {
    width: 186px;
  }
}
</style>
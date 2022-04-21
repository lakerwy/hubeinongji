<template>
<!-- 作业上报 深度上报 -->
  <el-dialog 
    class="my-dialog" 
    :title="type == 0 ? '作业上报' : '深度上报'" 
    :visible.sync="dialogVisible"
    top="30vh"
    width="40%"
    @close="close">
    <el-form class="report-form" ref="form" :model="form" label-width="150px">
      <el-form-item label="农机车牌" v-if="groupData.ids && groupData.ids.length == 1">
        <el-input v-model="form.plateNumber" readonly placeholder="请输入农机车牌"></el-input>
      </el-form-item>
      <el-form-item label="分组名称" v-else>
        <el-input v-model="form.name" readonly placeholder="请选择农机分组"></el-input>
      </el-form-item>
      <el-form-item label="上报方式" class="special">
        <el-input v-model="form.apperType" readonly placeholder="请输入上报方式"></el-input>
      </el-form-item>
      <el-form-item label="上报类型">
        <el-select v-model="form.jobType" placeholder="请选择上报类型">
          <el-option :label="item.label" :value="item.value" v-for="item in types" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" prefix-icon="el-icon-date" :clearable="false" v-model="form.appearBeginTime" style="width: 100%;" @change="startChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" prefix-icon="el-icon-date" :clearable="false" v-model="form.appearEndTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" plain round @click="save">保存</el-button>
      <el-button class="shadow-btn" plain round @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { insertApperJobArea, insertApperJobDepth, getDetailByMachinId } from '@/api/working/index'
import { dateFormat } from "@/util/util";
export default {
  props: {
    type: {
      type: Number,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        apperType: '', 
        plateNumber: '',
        jobType: '101',
        appearBeginTime: '',
        appearEndTime: '',
      },
      workingTypes: [
        {value: '-1', label: '自动计算'},
        {value: '100', label: '密度算法-基础算法'},
        {value: '101', label: '密度算法-小宽幅补偿'},
        {value: '102', label: '密度算法-大宽幅补偿'},
        {value: '103', label: '密度算法-大宽幅长宽计算'},
        {value: '104', label: '密度算法-无速度限制'},
        {value: '105', label: '密度算法-外轮廓地块'},
        {value: '200', label: '深度算法-基础算法>9'},
        {value: '201', label: '深度算法-基础算法>20'},
        {value: '202', label: '深度算法-无速度下限>9'},
        {value: '203', label: '深度算法-长宽计算>9'},
        {value: '204', label: '深度算法-有细长地块>20'},
        {value: '300', label: '深度密度算法-基础算法>9'},
        {value: '301', label: '深度密度算法-基础算法>20'},
        {value: '106', label: '密度算法-无速度下限'},
        {value: '205', label: '深度算法-基础算法>0'},
        {value: '000', label: '计算-栅格面积计算'},
        {value: '001', label: '计算-小宽幅栅格计算'},
        {value: '002', label: '计算-缓冲区面积计算'},
        {value: '003', label: '计算-长宽面积计算'},
        {value: '107', label: '密度算法-速度6'},
        {value: '302', label: '深度密度算法-合肥插秧>0速度<6'},
      ],
      depthTypes: [
        {value: '0', label: '缺省上报'},
        {value: '1', label: '深松整地'},
        {value: '2', label: '秸杆还田'},
      ],
      types: []
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  watch: {
    dialogVisible(newV) {
      // 通过监听dialog状态来初始化请求
      if(newV) {
        this.$set(this.form, 'appearBeginTime', new Date((new Date()).setHours(0,0,0,0)))
        this.$set(this.form, 'appearEndTime', new Date((new Date()).setHours(23,59,59,999)))
        if(this.groupData.ids && this.groupData.ids.length == 1) {
          this.types = this.workingTypes;
          this.initData();
        } else {
          this.types = this.depthTypes;
        }
      }
    }
  },
  created() {
  },
  methods: {
    // 页面部分数据回显
    async initData() {
      let params = {
        machinId: this.groupData.ids[0]
      }
      let res = await getDetailByMachinId(params);
      const {code, data} = res;
      if(code == 0) {
        // this.form.plateNumber = data.plateNumber;
        this.$set(this.form, 'plateNumber', data.plateNumber)
      }
    },
    startChange(val) {
      // 给结束时间默认值
      this.form.appearEndTime = new Date(val.getTime() + 24*60*60*1000 - 1);
    },
    save() {
      if(this.type == '0') {
        this.reportWorking();
      } else if(this.type == '1') {
        this.reportDepth();
      }
    },
    async reportWorking() {
      let params = {
        jobType: this.form.jobType,
        appearBeginTime: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
        appearEndTime: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),
        machineIdList: this.groupData.ids && this.groupData.ids.join(',')
      }
      let res = await insertApperJobArea(params);
      const {code, data, msg} = res;
      if(code == 0) {
        this.$message.success('作业上报提交成功');
        this.dialogVisible = false;
      } else {
        this.$message.error(msg || '作业上报提交失败')
      }
    },
    async reportDepth() {
      let params = {
        jobType: this.form.jobType,
        appearBeginTime: dateFormat(this.form.appearBeginTime, 'yyyy-MM-dd hh:mm:ss'),
        appearEndTime: dateFormat(this.form.appearEndTime, 'yyyy-MM-dd hh:mm:ss'),
        machineIdList: this.groupData.ids && this.groupData.ids.join(',')
      }
      let res = await insertApperJobDepth(params);
      const {code, data, msg} = res;
      if(code == 0) {
        this.$message.success('深度上报提交成功');
        this.dialogVisible = false;
      } else {
        this.$message.error(msg || '深度上报提交失败')
      }
    },
    close() {
      this.form = {};
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.report-form {
  width: 60%;
  margin: 0 auto;
  .el-select {
    width: 100%;
  }
  .datepicker {
    width: 100% !important;
  }
}
</style>
<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="25%"
    top="20vh"
    :modal="isModal"
  >
    <div class="content">
      <el-form class="my-form" label-position="right" label-width="120px" :model="form">
        <el-form-item label="审核状态:">
          <el-select v-model="form.inproveStatus" placeholder="请选择审核状态">
            <el-option label="通过" :value="2"></el-option>
            <el-option label="不通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核原因:" v-if="form.inproveStatus == 3">
          <el-input v-model="form.approval_remark" placeholder="不通过必须填原因">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="save" round>保 存</el-button>
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" round>返 回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {auditInstall} from '_api/basic/install';

export default {
  props: {
    title: {
      type: String,
      default: "审核"
    },
    isModal:{
      type: Boolean,
      default:true
    }
      // type: Object,
      // default: () => ({})
  },
  data() {
    return {
      dialogVisible: false,
      form: {}
    }
  },
  watch:{
    dialogVisible(newVal,oldVal){
      if(!newVal){
        this.form = {
        machineId:"",
        approval_remark:"",
        inproveStatus:'',
      }
      }
    }
  },
  methods:{
    async audit(){
      if(this.form.inproveStatus ==  2  ){
        this.form.approval_remark = "审核通过"
      }
      let res = await auditInstall(this.form)
      if(!res.code){
        res.data.approveMachineList.forEach(item => {
          setTimeout(() => {
          if(item.approveStatus == "审核成功"){
            this.$message.success(`${item.plateNumber}审核成功：${item.msg}`)
          }else{
            this.$message.error(`${item.plateNumber}审核失败: ${item.msg}`)
          }
          }, 0);
        });
        this.dialogVisible = false
        this.$emit('flash')
      }else{
        this.$message.error(res.msg)
      }
    },
    save(){
      this.audit()
    }
  }
}
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
  margin-left: -10px;

  .el-form-item {
    margin-right: 40px;
  }

  /deep/ .el-form-item__label {
    //padding: 0;
  }

  .el-input, .el-select {
    width: 100%;
  }

  .datepicker {
    width: 40%;
  }
}

.dialog-footer {
  height: 30px;
  padding-right: 25px;
}

</style>
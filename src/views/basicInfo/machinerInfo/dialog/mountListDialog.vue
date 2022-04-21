<template>
  <el-dialog
    class="dialog"
    title="电子安装单详情"
    :visible.sync="dialogVisible"
    width="60%"
    top="15vh"
  >
    <div class="header">
      <el-button type="primary" class="shadow-btn" @click="getPrint">打印</el-button>
            <h2 class="title">农机终端设备安装/验收单</h2>
    </div>
    <div class="content" id="mountList">
      <el-descriptions class="my-descrip" title="机主信息" :column="2" border>
        <el-descriptions-item label="机主姓名">{{ form.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="电话号码">{{ form.ownerPhone }}</el-descriptions-item>
        <el-descriptions-item label="所属分组">{{ form.groupName }}</el-descriptions-item>
        <el-descriptions-item label="机主地址">{{ form.ownerAddr }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="农机信息" :column="3" border>
        <el-descriptions-item label="车牌号码">{{ form.plateNumber }}</el-descriptions-item>
        <el-descriptions-item label="农机类型">{{ form.machineType }}</el-descriptions-item>
        <el-descriptions-item label="农机品牌">{{ form.machineBrand }}</el-descriptions-item>
        <el-descriptions-item label="农机型号">{{ form.machineModel }}</el-descriptions-item>
        <el-descriptions-item label="农机功率">{{ form.machinePower }}</el-descriptions-item>
        <el-descriptions-item label="出厂编号">{{ form.factoryNumber }}</el-descriptions-item>
        <el-descriptions-item label="农机购置时间">{{ form.purchaseTime }}</el-descriptions-item>
        <el-descriptions-item label="选装件">{{ form.optionType }}</el-descriptions-item>
        <el-descriptions-item label="默认机具类型">{{ form.defualtToolType }}</el-descriptions-item>
        <el-descriptions-item label="默认宽幅">{{ form.defaulToolWidth }}</el-descriptions-item>
        <el-descriptions-item label="可作业类型">{{ form.optionalJobType }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="终端信息" :column="2" border>
        <el-descriptions-item label="终端号码">{{ form.terminalCode }}</el-descriptions-item>
        <el-descriptions-item label="终端型号">{{ form.terminalModel }}</el-descriptions-item>
        <el-descriptions-item label="终端安装时间">{{ form.installTime }}</el-descriptions-item>
        <el-descriptions-item label="SIM卡号">{{ form.simNumber }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="机具信息" :column="3" border>
        <el-descriptions-item label="机具号码">{{ form.toolCode1 }}</el-descriptions-item>
        <el-descriptions-item label="机具类型">{{ form.toolType1 }}</el-descriptions-item>
        <el-descriptions-item label="机具宽幅（米）">{{ form.toolWidth1 }}</el-descriptions-item>
        <el-descriptions-item label="机具号码">{{ form.toolCode1 }}</el-descriptions-item>
        <el-descriptions-item label="机具类型">{{ form.toolType1 }}</el-descriptions-item>
        <el-descriptions-item label="机具宽幅（米）">{{ form.toolWidth1 }}</el-descriptions-item>
      </el-descriptions>
      <table class="table-border">
        <tbody>
        <tr>
          <td><div class="block">
            <img :src="form.photo1" alt="">
          </div></td>
          <td><div class="block">
            <img :src="form.photo2" alt="">
          </div></td>
          <td><div class="block">
            <img :src="form.photo3" alt="">
          </div></td>
          <td><div class="block">
            <img :src="form.photo4" alt="">
          </div></td>
          <td><div class="block">
            <img :src="form.photo5" alt="">
          </div></td>
        </tr>
        </tbody>
      </table>
    </div>
  </el-dialog>
</template>

<script>
import {queryMachineDetailInfo} from "../../../../api/basic/machine";

export default {
  props: ["mountQueryId"],
  data(){
    return{
      dialogVisible: false,
      form: {},
    }
  },
  watch: {
    "mountQueryId": {
      handler(newName, oldName) {
        if(newName) {
          debugger
          this.getMountList(newName);
        }
      },
      // immediate: true
    }
  },
  methods: {
    getPrint(){
      window.print()
      this.dialogVisible = false;
    },
    async getMountList(newName){
      this.form= {};
      let res = await queryMachineDetailInfo({
        terminalCode: newName
      })
      if(!res.code){
        this.form = Object.assign({},res.data);
      }
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  align-items: center;
  height: 54px;
  padding-left:20px;
  padding-right: 85px;
  .shadow-btn {
    height: 30px;
    width: 64px;
  }
  .title{
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: center;
    width: 100%;
    color: #67c8ff !important;
    font-family: "SourceHanSansCN ReguLar";
    font-weight: 500;
}
  // border-bottom: 1px solid #aac2d6;
}
.content {
  height: 500px;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
  // border-bottom: 1px #0d4f90 solid;
  .my-descrip:nth-child(1){
    /deep/ .el-descriptions__header {
      border-top: 1px solid #0d4f90;
    }
  }
  .my-descrip {
    // margin-bottom: 20px;
      border-left: none;
    border-right: 1px solid #0d4f90;
    /deep/ .el-descriptions__header {
      margin: 0;
      padding: 10px;
      border-left: 1px solid #0d4f90;
      background-color: rgba(4,100,189,0.35);
      .el-descriptions__title {
        font-size: 14px;
        color: #1494f7;
        font-weight: normal;
      }
    }
    /deep/.el-descriptions__body {
      background: transparent;
      border-bottom: 1px solid #0d4f90;
      .el-descriptions-item__label,.el-descriptions-item__content {
        background: transparent;
        font-size: 14px;
        color: #aac2d6;
        font-weight: normal;
        border:none;
        // border-bottom: 1px #0d4f90 solid;
        border-top: 1px #0d4f90 solid;
      }
      .el-descriptions-item__label {
        border-left: 1px solid #0d4f90;
        padding-left: 30px;
      }
      .el-descriptions-item__content{
        color:#ffffff;
      }
      .el-descriptions-item__content::before{
        height: 20px;
        width: 1px;
        content: '';
        display: inline-block;
        margin-bottom: -6px;
        align-items: center;
        background-color: #0d4f90;
        margin-right: 15px;
      }
    }

  }
  .table-border {
    width: 100%;
    border:solid 1px #0d4f90;
    border-top: none;
    border-spacing: 0;
    border-collapse: collapse;
    margin-bottom: 20px;
    td {
      padding: 6px;
      // border: 1px solid #aac2d6;
      vertical-align: top;
      .block{
        width: 206px;
        //height: 193px;
        background-color: black;
      }
    }
  }
    //   /deep/.el-descriptions .is-bordered{
    //   td,th{
    //     border:none;
    //     height: 30px;
    //     // border-right: 1px solid #0d4f90;
    //     border-bottom: 1px solid #0d4f90;
    //   }
    // }
}

</style>
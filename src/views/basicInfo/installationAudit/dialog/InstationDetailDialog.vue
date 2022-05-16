<template>
  <el-dialog
    class="dialog"
    title="安装审核详情"
    :visible.sync="dialogVisible"
    width="1080px"
    top="15vh"
  >
    <div class="header">
<!--      <el-button type="primary" class="shadow-btn" @click="getPrint">打印</el-button>-->
            <h2 class="title">农机安装详情</h2>
    </div>
    <div class="content" id="mountList">
      <el-descriptions class="my-descrip" title="安装信息" :column="2" border>
        <el-descriptions-item label="安装人员">{{ form.installUserName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ form.machineInfo.createdDate }}</el-descriptions-item>
        <el-descriptions-item label="审核人员">{{ form.approveUserName}}</el-descriptions-item>
        <el-descriptions-item label="审核时间" :labelStyle="{'width':'180px'}">{{ form.machineInfo.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="审核意见" :labelStyle="{'width':'180px'}">{{ form.machineInfo.approvalRemark }}</el-descriptions-item>
        <el-descriptions-item  v-if="btnPermis.btnAudit && form.machineInfo.approvalStatus == 1" label="操作"><template>
          <el-button type="primary" class="shadow-btn" round @click="approvalClick">审核</el-button>
        </template>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="机主信息" :column="2" border>
        <el-descriptions-item label="机主姓名">{{ form.machineInfo.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ form.machineInfo.ownerIdcardnum }}</el-descriptions-item>
        <el-descriptions-item style="width:100px" label="手机号码">{{ form.machineInfo.ownerPhone }}</el-descriptions-item>
        <el-descriptions-item label="是否推送短信">{{yesOrNo[form.machineInfo.smsNotify]}}</el-descriptions-item>
        <el-descriptions-item label="联系地址">{{ form.machineInfo.ownerAddr }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="农机信息" :column="3" border>
        <el-descriptions-item label="所属分组">{{ form.machineInfo.belongGroupFullPath }}</el-descriptions-item>
        <el-descriptions-item label="农机类型">{{ getValue(form.machineInfo.machineType,machineTypeSelect) }}</el-descriptions-item>
        <el-descriptions-item label="车牌号码">{{ form.machineInfo.plateNumber }}</el-descriptions-item>
        <el-descriptions-item label="农机品牌">{{ form.machineInfo.brand }}</el-descriptions-item>
        <el-descriptions-item label="农机型号">{{ form.machineInfo.machineModel }}</el-descriptions-item>
        <el-descriptions-item label="出厂编号">{{ form.machineInfo.factoryNumber }}</el-descriptions-item>
        <el-descriptions-item label="农机功率">{{ form.machineInfo.machinePower + "千瓦"}}</el-descriptions-item>
        <el-descriptions-item label="默认机具">{{ getValue(form.machineInfo.defaultToolType,toolTypeSelect)}}</el-descriptions-item>
        <el-descriptions-item label="作业宽幅">{{ form.machineInfo.defaultToolWidth+ "米" }}</el-descriptions-item>
        <el-descriptions-item label="机具臂长">{{ form.machineInfo.armLength + "厘米"}}</el-descriptions-item>
        <el-descriptions-item label="初始高度">{{ form.machineInfo.initHeight + "厘米"}}</el-descriptions-item>
        <el-descriptions-item label="初始偏移">{{ form.machineInfo.initOffset + "厘米"}}</el-descriptions-item>
        <el-descriptions-item label="补偿深度">{{ form.machineInfo.compenDepth + "厘米"}}</el-descriptions-item>
        <el-descriptions-item label="购置日期">{{ dateFilter(form.machineInfo.purchaseTime) }}</el-descriptions-item>
        <el-descriptions-item label="安装日期">{{ dateFilter(form.machineInfo.installTime) }}</el-descriptions-item>
        <el-descriptions-item label="自动面积计算">{{ yesOrNo[form.machineInfo.autoCalFalg] }}</el-descriptions-item>
        <el-descriptions-item label="选装件">{{ getValue(form.machineInfo.optionalType,optionalTypeSelect) }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="终端信息" :column="2" border>
        <el-descriptions-item label="厂商编号">{{ form.terminalInfo.terminalCodeThird }}</el-descriptions-item>
        <el-descriptions-item label="终端编号">{{ form.terminalInfo.terminalCode }}</el-descriptions-item>
        <el-descriptions-item label="代理厂商">{{ form.terminalInfo.agentfacturer }}</el-descriptions-item>
        <el-descriptions-item label="生产厂商">{{ form.terminalInfo.manufacturer }}</el-descriptions-item>
        <el-descriptions-item label="终端型号">{{ form.terminalInfo.terminalModel }}</el-descriptions-item>
        <el-descriptions-item label="终端类型">{{ getValue(form.terminalInfo.terminalType,terminalTypeSelect) }}</el-descriptions-item>
        <el-descriptions-item label="通信协议">{{ getValue(form.terminalInfo.protocolId,protocolTypeSelect) }}</el-descriptions-item>
        <el-descriptions-item label="是否包含SIM卡">{{ yesOrNo[form.terminalInfo.containSim] }}</el-descriptions-item>
        <el-descriptions-item label="SIM卡号">{{ form.terminalInfo.simNumber }}</el-descriptions-item>
        <el-descriptions-item label="到期时间">{{ dateFilter(form.terminalInfo.simOvertime) }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="my-descrip" title="机具信息" :column="3" border>
        <template v-for="item in form.toolList">
          <el-descriptions-item label="机具类型">{{ item.toolTypeName}}</el-descriptions-item>
          <el-descriptions-item label="识别卡号">{{ item.toolIfa }}</el-descriptions-item>
          <el-descriptions-item label="作业宽幅">{{ item.toolWidth + '米'}}</el-descriptions-item>
        </template>
      </el-descriptions>
      <table class="table-border">
        <tr>
          <td>
            <div class="block" v-for="(item,index) in srcList">
            <el-image style="width: 202px; height: 202px" fit="cover" :preview-src-list="srcList" :src="item" ></el-image>
          </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
      <AuditDialog ref="audit" @flash="flash" :isModal="false"></AuditDialog>
  </el-dialog>
</template>

<script>
import {getMachineDict} from "@/api/basic/machine";
import AuditDialog from './auditDialog'

export default {
  data(){
    return{
      dialogVisible: false,
      form: {
        photo1: 'img/icon1.png'
      },
      // machine_type 农机类型
      machineTypeSelect:[],
      // tool_type 机具类型
      toolTypeSelect:[],
      // optional_type 选装件类型
      optionalTypeSelect:[],
       // terminal_type 终端类型
       terminalTypeSelect:[],
       //通讯协议字典
       protocolTypeSelect:[],
      //是否开启短信通知
      yesOrNo:{
        Y:"是",
        N:"否"
      }
    }
  },
  props:{
    approveStatusSelection:Array,
    btnPermis:Object,
  },
  components:{
    AuditDialog
  },
  created(){
    // this.form.machineInfo.installTime
    this.getTerminalTypeSelect()
    this.getMachineTypeSelect()
    this.getToolTypeSelect()
    this.getOptionalTypeSelect()
    this.getProtocolTypeSelect()
  },
  methods: {
    getValue(itemCode,arr){
      let code =  itemCode.toString().split(",")
      let data = arr.filter(item=>{
        return code.indexOf(item.itemCode) != -1
      }).map(item=>{
        return item.itemName
      }).join(',')
      return data
    },
    dateFilter(date){
      if(date){
        return date.split(' ')[0]
      }
    },
    //获取农机类型
    async getMachineTypeSelect(){
      let res = await getMachineDict({
        listType: 'machine_type'
      })
      if(!res.code){
        this.machineTypeSelect = res.data 
      }
    },
    //获取机具类型
      async getToolTypeSelect(){
      let res = await getMachineDict({
        listType: 'tool_type'
      })
      if(!res.code){
        this.toolTypeSelect = res.data 
      }
    },
      //获取通讯协议
      async getProtocolTypeSelect(){
      let res = await getMachineDict({
        listType: 'protocol_type'
      })
      if(!res.code){
        this.protocolTypeSelect = res.data 
      }
    },
    approvalClick(){
      this.$refs.audit.dialogVisible = true
      this.$refs.audit.form.machineId = this.form.machineInfo.rowId
    },
    //获取选装件类型    
    async getOptionalTypeSelect(){
      let res = await getMachineDict({
        listType: 'optional_type'
      })
      if(!res.code){
        this.optionalTypeSelect = res.data 
      }
    },
    //获取终端类型    
    async getTerminalTypeSelect(){
      let res = await getMachineDict({
        listType: 'terminal_type'
      })
      if(!res.code){
        this.terminalTypeSelect = res.data 
      }
    },
    flash(){
      this.$emit("flash",{rowId:this.form.machineInfo.rowId})
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
        // border:none;
        border: 1px #0d4f90 solid;
        border-bottom: none;

        // border-bottom: 1px #0d4f90 solid;
        border-top: 1px #0d4f90 solid;
      }
      .el-descriptions-item__label {
        border-left: 1px solid #0d4f90;
        // padding-left: 30px;
        text-align: center;
        // width: 120px;
      }
      .el-descriptions-item__content{
        color:#ffffff;
        text-align: center;
      }
      // .el-descriptions-item__content::before{
      //   height: 20px;
      //   width: 1px;
      //   content: '';
      //   display: inline-block;
      //   margin-bottom: -6px;
      //   align-items: center;
      //   background-color: #0d4f90;
      //   margin-right: 15px;
      // }
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
      display: flex;
      align-items: center;
      justify-content: space-around;
      .block{
        display: block;
        width: 202px;
        height: 202px;
        // width: 202px;
        // height: 202px;
        // background-color: black;
      }
    }
  }
  .shadow-btn{
    height: 20px;
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
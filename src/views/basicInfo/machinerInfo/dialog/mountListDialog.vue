<template>
  <el-dialog
    class="dialog show"
    title="电子安装单详情"
    :visible.sync="dialogVisible"
    width="1150px"
    top="15vh"
    id="print"
  > 
    <div class="dia" id="print" ref="print">
          <div class="header">
        <el-button type="primary" class="shadow-btn no-print" @click="printContext" >打印</el-button>
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
          <el-descriptions-item label="农机功率">{{ addUnit(form.machinePower,"千瓦")}}</el-descriptions-item>
          <el-descriptions-item label="出厂编号">{{ form.factoryNumber }}</el-descriptions-item>
          <el-descriptions-item label="农机购置日期">{{ dateFilter(form.purchaseTime) }}</el-descriptions-item>
          <el-descriptions-item label="选装件">{{ form.optionType }}</el-descriptions-item>
          <el-descriptions-item label="默认机具类型">{{ form.defualtToolType }}</el-descriptions-item>
          <el-descriptions-item label="默认宽幅">{{ addUnit(form.defaulToolWidth,"米") }}</el-descriptions-item>
          <el-descriptions-item label="可作业类型">{{ form.optionalJobType }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="my-descrip" title="终端信息" :column="2" border>
          <el-descriptions-item label="终端号码">{{ form.terminalCode }}</el-descriptions-item>
          <el-descriptions-item label="终端型号">{{ form.terminalModel }}</el-descriptions-item>
          <el-descriptions-item label="终端安装日期">{{ dateFilter(form.installTime) }}</el-descriptions-item>
          <el-descriptions-item label="SIM卡号">{{ form.simNumber }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="my-descrip" title="机具信息" :column="3" border>
          <template v-for="(item,index) in form.tools">
            <el-descriptions-item :key="item.toolIfa" label="机具号码">{{ item.toolIfa }}</el-descriptions-item>
            <el-descriptions-item :key="item.toolType" label="机具类型">{{ getToolTypeNameById(item.toolType) }}</el-descriptions-item>
            <el-descriptions-item :key="item.toolWidth" label="机具宽幅（米）">{{ item.toolWidth }}</el-descriptions-item>
          </template>
        </el-descriptions>
          <table class="table-border">
              <tr>
                <td>
                  <div class="block" v-for="(item,index) in srcList"  v-if="srcList.length != 0">
                    <el-image style="width: 202px; height: 202px" fit="cover" :preview-src-list="srcList" :src="item" ></el-image>
                  </div>
                </td>
              </tr>
          </table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {queryMachineDetailInfo} from "../../../../api/basic/machine";
import { filterDict } from "@/util/util.js";

export default {
  props: ["mountQueryId","toolTypeSelect"],
  data(){
    return{
      dialogVisible: false,
      form: {},
      srcList:[],
    }
  },
  watch: {
    "mountQueryId": {
      handler(newName, oldName) {
        if(newName) {
          this.getMountList(newName);
        }
      },
    }
  },
  methods: {
    //打印
    printContext () {
      this.$print(this.$refs.print)
    },
    //格式化日期
    dateFilter(date){
      if(date){
        return date.split(' ')[0]
      }
    },
    //加单位
    addUnit(data,unit){
      if(data){
        return `${data} ${unit}`
      }
    },
    //机具类型回显
    getToolTypeNameById(itemCode){
      return  filterDict(itemCode,{labelKey:'itemName',valueKey:'itemCode'},this.toolTypeSelect)
    },
    async getMountList(newName){
      this.form = {};
      this.srcList = [];
      let res = await queryMachineDetailInfo({
        terminalCode: newName
      })
      if(!res.code){
        this.form = Object.assign({},res.data);
        for(let i = 1 ; i <= 5 ; i++){
          let param = 'photo' + i
          if(res.data[param]){
            this.isShowPhotoTab = true
            this.srcList.push(res.data[param])
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.dia{
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
      .my-descrip:nth-of-type(1){
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
          height: 206px;
          vertical-align: top;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .block{
            display: block;
            width: 202px;
            height: 202px;
            background: #FFF;
            // width: 202px;
            // height: 202px;
            // background-color: black;
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
}

@media print {
.dia{
  width: 1095px;
    .header {
      .title{
        font-size: 36px;
        color: #000 !important;
        font-weight: 900;
        margin-bottom: 30px;
    }
      // border-bottom: 1px solid #aac2d6;
    }
    .content {
      height: auto;
      padding-left: 20px;
      padding-right: 20px;
      // border-bottom: 1px #0d4f90 solid;

      .my-descrip {
        // margin-bottom: 20px;
          border-left: none;
        border-right: 1px solid #000;
        /deep/ .el-descriptions__header {
          background-color: rgba(4,100,189,0.2);
          .el-descriptions__title {
            color: #000;
            font-weight: 900;
          }
        }
        /deep/.el-descriptions__body {
          background: transparent;
          border-bottom: 1px solid #000;
          .el-descriptions-item__label,.el-descriptions-item__content {
            background: transparent;
            font-size: 14px;
            color: #000;
            font-weight: normal;
            border:none;
            // border-bottom: 1px #0d4f90 solid;
            border-top: 1px #000 solid;
          }
          .el-descriptions-item__label {
            border-left: 1px solid #000;
            padding-left: 30px;
          }
          .el-descriptions-item__content{
            color:#000;
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
        border:solid 1px #000;
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
    
}
.no-print{
  display: none;
}
/deep/.el-image__error{
  display: none;
}
}




</style>
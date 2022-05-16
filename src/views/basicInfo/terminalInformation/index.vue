<template>
  <div class="machiner">
    <TitleBox class="title" :headName="'终端信息'"/>
    <div class="content">
      <div class="contTable">
        <div class="searchBox">
          <el-form class="my-form" label-position="right" label-width="80px" :model="form">
            <div class="formItem">
              <el-form-item label="农机分组:">
                <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
              </el-form-item>
              <el-form-item label="终端编号:" >
                <el-input v-model="form.terminalCode" placeholder="请输入终端编号"></el-input>
              </el-form-item>
              <el-form-item label="包含SIM卡:" label-width="85px">
                <el-select v-model="form.containSim" clearable placeholder="请选择是否包含SIM卡">
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="SIM卡号码:" label-width="85px">
                <el-input v-model="form.simNumber" placeholder="请输入SIM卡号码"></el-input>
              </el-form-item>
              <el-form-item label="通信协议:">
                <el-select v-model="form.protocolId" clearable placeholder="请选择通信协议">
                  <el-option v-for="item in protocolData" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="formItem">
              <el-form-item label="生产厂商:" >
                <el-select v-model="form.manufacturerId" clearable placeholder="请选择生产厂商">
                  <el-option v-for="item in manufacturerData" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终端类型:" >
                <el-select v-model="form.terminalType" clearable  placeholder="请选择终端类型">
                  <el-option v-for="item in terminalData" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终端代理商:" label-width="90px">
                <el-select v-model="form.agentFacturer" clearable  placeholder="请选择终端代理商">
                  <el-option v-for="item in terminalAgent" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <div class="btn">
                <el-button type="primary" class="shadow-btn" round @click="query" v-if="btnPermis.btnView">查询</el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table">
          <div class="table_btns">
            <div class="btn-left">
              <el-button type="primary" class="shadow-btn" round @click="delColumnInfo" v-if="btnPermis.btnDelete">删除</el-button>
              <el-button type="primary" class="shadow-btn" round @click="getHistory" v-if="btnPermis.btnHistory">历史记录</el-button>
              <el-button type="primary" class="shadow-btn" round @click="exportTerminalInfo" v-if="btnPermis.btnExport">报表导出</el-button>
            </div>
          </div>
          <div class="my-table">
            <el-table
              :data="tableData"
              style="width: 100%"
              height="100%"
              border
              @selection-change="handleSelectChange"
            >
              <el-table-column
                type="selection"
                label="全选"
                width="55"
                fixed="left">
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                width="80"
                fixed="left"
                :index="indexMethod"
              >
              </el-table-column>
              <el-table-column width="180" prop="terminalCode" label="终端编号">
                <template slot-scope="scope">
                  <el-button v-if="btnPermis.btnEdit" type="text" class="table-text-btn"  @click="editInfo(scope.row)">{{ scope.row.terminalCode }}</el-button>
                  <span v-else>{{ scope.row.terminalCode }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="myPage">
          <myPagination
            :currentPage="page.currentPage"
            :pageSize="page.pageSize"
            :pageSizes="page.pageSizes"
            :total="page.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
        </div>

        <ChangeHistory ref="changeHistroy" :selectId="historyId"></ChangeHistory>
        <EditDialog ref="edit" :terminalModelSelect="terminalModelSelect"></EditDialog>
      </div>
    </div>
  </div>
</template>


<script>
import TitleBox from "../../../components/contenBox/titleBox";
import ChangeHistory from "./dialog/changeHistory"
import EditDialog from "./dialog/editDialog"
import myPagination from '_com/myPagination/index'
import { mapGetters, mapMutations } from 'vuex'
import { queryTerminalPage, getDictByListType } from '@/api/basic/index'
import { filterDict } from '@/util/util.js'
import {getMachineDict} from "../../../api/basic/machine";
import {downloadPost, getSelectionIds, handBlobDown} from "../../../util/util";
import {delCdTerminal, terminalInfoExcelPort} from "../../../api/basic";

export default {
  name: "contTable",
  components: {
    TitleBox,
    ChangeHistory,
    EditDialog,
    myPagination
  },
  provide: function () {
    return {
      app: this,
    };
  },
  data(){
    return{
      form: {},
      tableData: [],
      columns: [
        {prop: 'containSim', label: '是否有SIM卡', width: '150px', formatter: this.simFormatter},
        {prop: 'simNumber', label: 'SIM卡号码', width: '180px'},
        {prop: 'protocolId', label: '通讯协议', width: '160px', formatter: this.protocolFormatter},
        {prop: 'simOvertime', label: 'SIM卡结束时间', width: '160px'},
        {prop: 'terminalType', label: '终端类型', width: '160px', formatter: this.terminalFormatter},
        {prop: 'agentFacturer', label: '终端代理商', width: '300px'},
        {prop: 'manufacturer', label: '生产厂商', width: '300px' },
        {prop: 'terminalModel', label: '终端型号', width: ''},
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10,20,30,40,50,100]
      },
      manufacturerData: [], // 终端厂商
      terminalData: [], // 终端类型
      protocolData: [], // 通信协议
      terminalModelSelect: [],//终端型号
      terminalAgent: [], // 终端代理商
      selection: [],
      historyId: '',
      btnPermis: {  //按钮权限
        btnView: true,
        btnEdit: true,
        btnDelete: true,
        btnExport: true,
        btnHistory: true,
      }
    }
  },
  computed: {
    ...mapGetters(['groupData','permissions'])
  },
  created() {
    this.getBtnPermis();
    this.initDict();
    this.initData();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      setGroupCheckBox: 'setGroupCheckBox'
    }),
    // 打开农机分组框
    open() {
      this.setGroupCheckBox(false);
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.terminalView];
      this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.terminalEdit];
      this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.terminalDelete];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.terminalExport];
      this.btnPermis.btnHistory = this.permissions[window.global.buttonPremission.terminalHistory];
      //console.log('this.btnPermis',this.btnPermis)
    },
    initDict(){
      this.getManufacturer();
      this.getTerminalSelect();
      this.getTerminalAgent();
      this.getTerminal();
      this.getProtocol();
    },
    // 终端厂商字典数据
    async getManufacturer() {
      let params = {
        listType: 'ternimal_manufacturer'
      };
      let res = await getDictByListType(params);
      const {code, data} = res;
      //console.log(data);
      if(code == 0) {
        this.manufacturerData = data;
      }
    },
    //终端代理商
    async getTerminalAgent(){
      let params = {
        listType: 'terminal_agent'
      };
      let res = await getDictByListType(params);
      const {code, data} = res;
      if(code == 0) {
        this.terminalAgent = data;
        // debugger;
      }
    },
    //终端型号
    async getTerminalSelect(){
      let res = await getMachineDict({
        listType: 'terminal_model'
      });
      if(!res.code){
        this.terminalModelSelect = res.data;
      }
    },
    // 终端类型数据
    async getTerminal() {
      let params = {
        listType: 'terminal_type'
      };
      let res = await getDictByListType(params);
      const {code, data} = res;
      if(code == 0) {
        this.terminalData = data;
      }
    },
    // 通信协议数据
    async getProtocol() {
      let params = {
        listType: 'protocol_type'
      };
      let res = await getDictByListType(params);
      const {code, data} = res;
      if(code == 0) {
        this.protocolData = data;
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 初始化数据
    async initData() {
      let ids = this.groupData.ids || [];
      let params = Object.assign({
        groupId: ids.join(','),
        page: this.page.currentPage,
        limit: this.page.pageSize}, this.form)
      let res = await queryTerminalPage(params);
      const {code, data, msg} = res;
      if(code == 0) {
        this.tableData = data.list;
        this.page.total = data.totalCount;
      } else {
        this.$message.error(msg || '查询失败')
      }
    },
    simFormatter(row) {
      return row.containSim === 'Y' ? "是" : "否"
    },
    protocolFormatter(row) {
      return filterDict(row.protocolId, { labelKey: 'itemName', valueKey: 'itemCode' }, this.protocolData);
    },
    terminalFormatter(row) {
      return filterDict(row.terminalType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.terminalData);
    },
    agentFormatter(row) {
      return filterDict(row.agentFacturer, { labelKey: 'itemName', valueKey: 'itemCode' }, this.terminalAgent);
    },
    facturerFormatter(row) {
      return filterDict(row.manufacturer, { labelKey: 'itemName', valueKey: 'itemCode' }, this.manufacturerData);
    },
    query() {
      // 查询重置
      this.page.currentPage = 1;
      this.initData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    //删除
    delColumnInfo(){
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要删除的终端');
        return;
      }
      this.$confirm('此操作将永久删除该终端, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delTermainlById();
      }).catch(() => {
       /* this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
      });
    },
    async delTermainlById(){
      let ids = getSelectionIds(this.selection,'rowId');
      let res = await delCdTerminal({
        ids: ids
      })
      if(!res.code){
        let errMsg = ""
        if(res.data && res.data.length > 0){
          res.data.forEach((item,index) => {
            index + 1 == res.data.length ? errMsg += `${item.msg}。` : errMsg += `${item.msg},`
          })
        }
        console.log(errMsg)
        this.$message.success(`${res.msg}:${errMsg}`)
        // this.$message({
        //   type: 'success',
        //   message: `${res.msg}${errMsg}`
        // });
        // if(res.data && res.data.length > 0){
          // res.data.forEach(item =>{
          //   setTimeout(() => {
          //     this.$message.success(item.msg)
          //   }, 0);
          // })
        // }
        this.initData();
      }
    },
    //历史记录
    getHistory(){
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的终端');
        return;
      } else if(this.selection.length > 1){
        this.$message.info('请选择一个查询的终端');
        return;
      }
      this.historyId = this.selection[0].rowId;
      this.$refs.changeHistroy.dialogVisible = true;
    },
    editInfo(val){
      this.$refs.edit.dialogVisible = true;
      this.$refs.edit.rowId = val.rowId;
      // debugger
      // val.protocolId = val.protocolId + '';
      // this.$refs.edit.form = Object.assign({},val);
    },

    //报表导出
    async exportTerminalInfo(){
      let groupid = this.groupData.ids || [];
      let
        containSim=this.form.containSim,
        groupId=groupid.join(','),
        jobType= this.form.jobType,
        key= this.form.key,
        page= this.page.currentPage,
        limit= this.page.pageSize,
        manufacturerId= this.form.manufacturerId,
        protocolId= this.form.protocolId,
        simNumber= this.form.simNumber,
        terminalCode= this.form.terminalCode,
        terminalType= this.form.terminalType,
        agentFacturer= this.form.agentFacturer;
      let res = await terminalInfoExcelPort(containSim,groupId,jobType,key,page,limit,manufacturerId,protocolId,simNumber,terminalCode,terminalType,agentFacturer);
      if(res.success){
        let obj = res.obj;
        let title = '终端基础信息报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
        // let obj = encodeURIComponent(res.obj);
        // let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel?filePath='+obj;
        // downloadPost(url)
      }
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1
    }
  }
}
</script>

<style scoped lang="less">
@vw: 19.2vw;
@vh: 10.8vh;
.machiner {
  position: absolute;
  top: 0;
  right: 0;
  width: 100% ;
  height: 100%;

  .title {
    //width: 1631px;
    width: calc(100% - 62px);
    margin-left: 40px;
    margin-top: 10px;
  }
  .content {
    margin-top: 20px;
    margin-left: 40px;
    width: calc(100% - 62px);
    height: calc(100% - 160px);
    border: 1px solid #133460;
  }
}
.contTable {
  margin-top: 20px;
  // margin-left: 27px;
  height: 100%;
  .searchBox {
    //width: 1583px;
    width: calc(100% - 27px);
    padding-left: 27px;
    height: 100px;
    position: relative;
    border-bottom: 1px solid #133460;

    .formItem {
      width: 100%;
      display: flex;
      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 19%;
        .el-input,.el-select {
          width: 100%;
        }
        /deep/ .el-form-item__label{
          //padding: 0;
        }
      }
    }
    .btn {
      margin: 0;
      height: 36px;
    }
  }
  .table {
    height: calc(100% - 130px);
    padding-right: 24px;
    padding-left: 27px;
    .table_btns {
      margin: 15px 0;
      height: 31px;
      .btn-left {
        height: 31px;
        display: flex;
      }
    }
    .my-table {
      height: calc(100% - 71px);
    }
  }
  .myPage {
    margin-top: 15px;
  }
}
</style>
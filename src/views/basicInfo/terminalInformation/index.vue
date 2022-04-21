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
                <el-select v-model="form.containSim" clearable placeholder="请选择SIM卡">
                  <el-option label="是" value="Y"></el-option>
                  <el-option label="否" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="SIM卡号码:" v-if="form.containSim === 'Y'" label-width="85px">
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
                <el-select v-model="form.manufacture" clearable placeholder="请选择生产厂商">
                  <el-option v-for="item in manufacturerData" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终端类型:" >
                <el-select v-model="form.terminalType" clearable placeholder="请选择终端类型">
                  <el-option v-for="item in terminalData" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <div class="btn">
                <el-button type="primary" class="shadow-btn" round @click="query">查询</el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table">
          <div class="table_btns">
            <div class="btn-left">
              <el-button type="primary" class="shadow-btn" round @click="delColumnInfo">删除</el-button>
              <el-button type="primary" class="shadow-btn" round @click="getHistory">历史记录</el-button>
              <el-button type="primary" class="shadow-btn" round>报表导出</el-button>
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
                width="60"
                fixed="left">
              </el-table-column>
              <el-table-column prop="terminalCode" label="终端编号">
                <template slot-scope="scope">
                  <el-button type="text" class="table-text-btn"  @click="editInfo(scope.row)">{{ scope.row.terminalCode }}</el-button>
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
        {prop: 'manufacturer', label: '生产厂商', width: '300px' },
        {prop: 'terminalModel', label: '终端型号', width: ''},
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10,20,30,40,50,100]
      },
      manufacturerData: [], // 终端厂商
      terminalData: [], // 终端类型
      protocolData: [], // 通信协议
      terminalModelSelect: [],//终端型号
      selection: [],
      historyId: '',
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created() {
    this.getManufacturer();
    this.getTerminal();
    this.getProtocol();
    this.getTerminalSelect();
    this.initData();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      setGroupCheckBox: 'setGroupCheckBox'
    }),
    // 打开农机分组框
    open() {
      this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    // 终端厂商字典数据
    async getManufacturer() {
      let params = {
        listType: 'ternimal_manufacturer'
      };
      let res = await getDictByListType(params);
      const {code, data} = res;
      if(code == 0) {
        this.manufacturerData = data;
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
        this.$message.info('请选择需要删除的分组');
        return;
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delTermainlById();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async delTermainlById(){

    },
    //历史记录
    getHistory(){
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      } else if(this.selection.length > 1){
        this.$message.info('请选择一个查询的分组');
        return;
      }
      this.historyId = this.selection[0].rowId;
      this.$refs.changeHistroy.dialogVisible = true;
    },
    editInfo(val){
      this.$refs.edit.dialogVisible = true;
      val.protocolId = val.protocolId + '';
      this.$refs.edit.form = Object.assign({},val);
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
  width: calc(100% - 227px);
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
          padding: 0;
        }
      }
    }
    .btn {
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
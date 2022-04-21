<template>
  <div class="machiner">
    <TitleBox class="title" :headName="'农机信息'"/>
    <div class="content">
      <div class="contTable">
        <div class="searchBox">
          <el-form class="my-form" label-position="right" label-width="80px" :model="form">
            <div class="formItem">
              <el-form-item label="农机分组：">
                <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="open"></el-input>
              </el-form-item>
              <el-form-item label="农机车牌：">
                <el-input v-model="form.plateNumber" placeholder="请输入农机车牌"></el-input>
              </el-form-item>
              <el-form-item label="终端型号：">
                <el-select v-model="form.terminalModel" clearable placeholder="请选择终端型号">
                  <el-option v-for="item in terminalModelSelect" :key="item.id" :label="item.itemName" :value="item.itemName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="农机类型：">
                <el-select v-model="form.machineType" clearable placeholder="请选择农机类型">
                  <el-option v-for="item in machineTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机具类型："  label-width="90px">
                <el-select v-model="form.toolType" clearable placeholder="请选择机具类型">
                  <el-option v-for="item in toolTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="formItem">
              <el-form-item label="机主姓名：">
                <el-input v-model="form.ownerName" placeholder="请输入机主姓名"></el-input>
              </el-form-item>
              <el-form-item label="机主电话：">
                <el-input v-model="form.ownerPhone" placeholder="请输入机主电话"></el-input>
              </el-form-item>
              <el-form-item label="终端编号：">
                <el-input v-model="form.terminalCode" placeholder="请输入终端编号">
                </el-input>
              </el-form-item>
              <el-form-item label="面积状态：">
                <el-select v-model="form.autoCalFalg" clearable placeholder="请选择面积状态">
                  <el-option label="开启" value="Y"></el-option>
                  <el-option label="关闭" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机具识别码：" label-width="90px">
                <el-input v-model="form.toolIfa" placeholder="请输入机具识别码"></el-input>
              </el-form-item>
            </div>
            <div class="formItem">
              <el-form-item label="农机状态：">
                <el-select v-model="form.activeFlag" clearable placeholder="请选择农机状态">
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="失效" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="补贴状态：">
                <el-select v-model="form.allowanceStatus" clearable placeholder="请选择补贴状态">
                  <el-option label="已发放" value="1"></el-option>
                  <el-option label="未发放" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item-data" label="安装时间：">
                <el-date-picker
                  class="datepicker"
                  v-model="form.installStartTime"
                  type="datetime"
                  :clearable="false"
                  prefix-icon="el-icon-date"
                  placeholder="开始时间"
                ></el-date-picker>
                <span style="diaplay:inline-block;width:12px;"> — </span>
                <el-date-picker
                  class="datepicker"
                  v-model="form.installEndTime"
                  type="datetime"
                  :clearable="false"
                  prefix-icon="el-icon-date"
                  placeholder="结束时间"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="安装账号：">
                <el-select v-model="form.installer" clearable placeholder="请选择安装账号">
                  <el-option v-for="(item,index) in installerSelect" :key="index" :label="item.text" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <div class="btn">
                <el-button type="primary" class="shadow-btn" round @click="searchMachineList()">查询</el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table">
          <div class="table_btns">
            <div class="btn-left">
              <el-button type="primary" class="shadow-btn" round @click="addMachine">新增</el-button>
              <el-button type="primary" class="shadow-btn" round @click="changeTerminalClick">更换终端</el-button>
              <el-button type="primary" class="shadow-btn" round @click="ChangeClick">历史查询</el-button>
              <el-button type="primary" class="shadow-btn" round @click="EditClick">电子安装单</el-button>
              <el-button type="primary" class="shadow-btn" round @click="toggleArea(true)">开启面积计算</el-button>
              <el-button type="primary" class="shadow-btn" round @click="toggleArea(false)">关闭面积计算</el-button>
              <el-button type="primary" class="shadow-btn" round @click="toggleNotepush(true)">开启短信发送</el-button>
              <el-button type="primary" class="shadow-btn" round @click="toggleNotepush(false)">关闭短信发送</el-button>
            </div>
            <div class="btn-right">
              <el-dropdown @command="handleCommand">
                <div class="tableTool">
                  <img src="img/table_tool1.png" alt="">
                  <span>批量操作 <i class="el-icon-arrow-down el-icon--right"></i></span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown">
                    <el-dropdown-item command="a" class="dropdown-item">激活</el-dropdown-item>
                    <el-dropdown-item command="b" class="dropdown-item">失效</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div class="vertical"></div>
              <div class="tableTool" @click="handleClick('import')">
                <img src="img/table_tool2.png" alt="">
                <span>报表导入</span>
              </div>
              <div class="vertical"></div>
              <div class="tableTool" @click="handleClick('export')">
                <img src="img/table_tool3.png" alt="">
                <span>报表导出</span>
              </div>
              <div class="vertical"></div>
              <div class="tableTool" @click="handleClick('del')">
                <img src="img/table_tool4.png" alt="">
                <span>删除</span>
              </div>
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
                fixed="left"
              >
              </el-table-column>
              <el-table-column prop="plateNumber" label="农机车牌">
                <template slot-scope="scope">
                  <el-button type="text" class="table-text-btn"  @click="changeMachine(scope.row)">{{ scope.row.plateNumber }}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="myPage">
          <myPagination
            :currentPage="page.currentPage"
            :pageSize="page.pageSize"
            :total="page.total"
            @current-change="currentChange"
          />
        </div>

        <ChangeQuery ref="machineChange" :selectId="historyId" />
        <MachineEdit ref="machineEdit" :title="title"/>
        <MountList ref="mountList" :mountQueryId="mountQueryId"></MountList>
        <ImportDialog ref="importDiaolog"></ImportDialog>
        <ChangeTerminal ref="changeTerminal"/>
      </div>
    </div>
  </div>
</template>




<script>
import TitleBox from "../../../components/contenBox/titleBox";
import ChangeQuery from './dialog/ChangeQuery';
import MachineEdit from './dialog/machineEdit/MachineEdit'
import MountList from "./dialog/mountListDialog"
import ImportDialog from "./dialog/importDialog"
import ChangeTerminal from './dialog/ChangeTerminal'
import myPagination from '_com/myPagination/index'
import {mapGetters, mapMutations} from "vuex";
import {
  activeMachine,
  closeComputeArea, closePushMessage, delMachineById, getAllBrand,
  getInstallsheet,
  getMachineDict,
  getMachineInfo,
  openComputeArea, openPushMessage, unEffectCdMachine
} from "../../../api/basic/machine";
import {machineForm} from "./js/index"
import { filterDict } from '@/util/util.js'
import {getSelectionIds} from "../../../util/util";


export default {
  name: "contTable",
  components: {
    TitleBox,
    ChangeQuery,
    MachineEdit,
    MountList,
    ImportDialog,
    ChangeTerminal,
    myPagination
  },
  provide: function () {
    return {
      app: this,
    };
  },
  data() {
    return {
      form: Object.assign({},machineForm),
      tableData: [
        // {start: '1234351', startTime: '11'},
      ],
      columns: [
        {prop: 'groupNameFullPath', label: '农机分组', width: '300px'},
        {prop: 'machineType', label: '农机类型', width: '160px', formatter: row=>{
            return filterDict(row.machineType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.machineTypeSelect);
          }},
        {prop: 'machineModel', label: '农机型号', width: '160px'},
        {prop: 'terminalCode', label: '终端编号', width: '160px'},
        {prop: 'terminalModel', label: '终端型号', width: '160px'},
        {prop: 'toolIfa', label: '机具识别码', width: '160px'},
        {prop: 'ownerName', label: '机主姓名', width: '160px'},
        {prop: 'simNumber', label: 'SIM卡号码', width: '160px'},
        {prop: 'defaultToolWidth', label: '作业宽幅', width: '160px'},
        {prop: 'optionalType', label: '选装件', width: '160px'},
        {prop: 'activeFlag', label: '农机状态', width: '160px', formatter: row=>{
            return row.activeFlag == '1' ? "有效" : "失效"
          }, },
        {prop: 'allowance', label: '补贴额度', width: '160px'},
        {prop: 'allowanceStatus', label: '补贴状态', width: '160px', formatter: row=>{
            if(row.allowanceStatus === '1') {
              return "已发放"
            } else if (row.allowanceStatus === '0'){
              return "未发放"
            } else {
              return ''
            }
          }},
        {prop: 'autoCalFalg', label: '面积计算状态', width: '160px', formatter: row=>{
            return row.autoCalFalg == 'Y' ? "开启" : "关闭"
          }},
        {prop: 'smsNotify', label: '短信发送状态', width: '160px', formatter: row=>{
            return row.smsNotify == 'Y' ? "开启" : "关闭"
          }},
      ],
      value1: true,
      value2: false,
      title: "",
      selection: [],
      historyId: '',
      mountQueryId: '',
      terminalModelSelect: [],//终端型号
      machineTypeSelect: [],//农机类型
      toolTypeSelect: [],//机具类型
      installerSelect: [], //安装账号
      protocolSelect: [], //通信协议
      allBrand: [], //农机品牌
      machineWorkType: [], // 农机作业类型
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      }
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created() {
    this.init();
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
    init(){
      this.getTerminalSelect();
      this.getMachineTypeSelect();
      this.getToolTypeSelect();
      this.getInstallsheet();
      this.getProtocolSelect();
      this.getAllBrand();
      this.getMachineWorkType();
      this.searchMachineList();
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
    //农机类型
    async getMachineTypeSelect(){
      let res = await getMachineDict({
        listType: 'machine_type'
      });
      if(!res.code){
        this.machineTypeSelect = res.data;
      }
    },
    //机具类型
    async getToolTypeSelect(){
      let res = await getMachineDict({
        listType: 'tool_type'
      });
      if(!res.code){
        this.toolTypeSelect = res.data;
      }
    },
    //通信协议
    async getProtocolSelect(){
      let res = await getMachineDict({
        listType: 'protocol_type'
      });
      if(!res.code){
        this.protocolSelect = res.data;
      }
    },
    //农机作业类型
    async getMachineWorkType(){
      let res = await getMachineDict({
        listType: 'job_type'
      });
      if(!res.code){
        this.machineWorkType = res.data;
      }
    },
    //安装账号
    async getInstallsheet(){
      let res = await getInstallsheet();
      if(!res.code){
        this.installerSelect = res.data;
      }
    },
    //农机品牌
    async getAllBrand(){
      let res = await getAllBrand();
      if(res.length){
        this.allBrand = res;
      }
    },

    //列表查询
    async searchMachineList(){
      // let groupId = this.groupData.ids || [];
      let groupIds = [], gAttrs = [], groupId = []; // groupIds所有的分组id集合 gAttrs所有的groupAttribute集合 groupId最外层的分组
      this.groupData.data && this.groupData.data.map(item => {
        // 第一次循环获取所有分组id集合，获取分组groupAttribute集合
        if(item.groupAttribute !== 6) {
          // 所有的分组id集合
          groupIds.push(item.id);
        }
        if(!gAttrs.includes(item.groupAttribute)) {
          // 保存groupAttribute
          gAttrs.push(item.groupAttribute);
        }
      })
      this.groupData.data && this.groupData.data.map(item => {
        // 第二次循环筛选最外层分组id
        if(item.groupAttribute !== 6) {
          // 当前选择的排除农机的数据中，如果该项的pid在id集合中则表示不是最外层，否则时最外层就添加进去
          if(!groupIds.includes(item.pId)) {
            groupId.push(item.id);
          }
        } else {
          // 当前选择只有农机时添加pId为最外层分组groupId，这里条件是避免重复在groupId添加push（注意：并不是groupIds）
          if(!groupId.includes(item.pId)) {
            groupId.push(item.pId)
          }
        }
      })
      let res = await getMachineInfo(Object.assign({
        groupId: groupId.join(','),
        page: this.page.currentPage,
        limit: this.page.pageSize
      }, this.form))
      if(!res.code){
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      } else {
        this.$message.error('查询失败')
      }
    },
    currentChange(current){
      this.page.currentPage = current;
      this.searchMachineList();
    },
    //历史查询
    ChangeClick() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      } else if(this.selection.length > 1){
        this.$message.info('请选择一个查询的分组');
        return;
      }
      this.historyId = this.selection[0].rowId;
      this.$refs.machineChange.dialogVisible = true;
    },
    //电子安装单详情
    EditClick() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      } else if(this.selection.length > 1){
        this.$message.info('只能勾选一个进行修改!');
        return;
      }
      this.mountQueryId = this.selection[0].terminalCode;
      this.$refs.mountList.dialogVisible = true;
    },
    //新增
    addMachine(){
      this.$refs.machineEdit.dialogVisible = true;
      this.$refs.machineEdit.form = {};
      this.title = "农机信息新增"
    },
    //编辑
    changeMachine(val) {
      // console.log(this.$refs.machineEdit)
      this.$refs.machineEdit.dialogVisible = true;
      this.$refs.machineEdit.form = Object.assign({
        optionalTypeArray: val.optionalType ? val.optionalType.split(",") : []
      },val);
      this.title = "农机信息编辑"
    },
    changeTerminalClick() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      } else if(this.selection.length > 1){
        this.$message.info('只能勾选一个进行修改!');
        return;
      }
      this.$refs.changeTerminal.dialogVisible = true;
      this.$refs.changeTerminal.form = this.selection[0];
      this.$refs.changeTerminal.reFreshNewForm();

    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    handleClick(type) {
      switch (type) {
        case 'import':
          this.$refs.importDiaolog.dialogVisible = true;
          break;
        case 'export':

          break;
        case 'del':
          if (this.selection.length <= 0) {
            this.$message.info('请选择需要删除的分组');
            return;
          }
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.delMachineById()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          break;
        default:
          break;
      }
    },
    //删除农机信息
    async delMachineById(){
      let ids = getSelectionIds(this.selection,'rowId');
      let res = await delMachineById({
        rowIds: ids
      });
      if(!res.code){
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.searchMachineList();
      }
    },
    //开启关闭面积计算
    async toggleArea(val){
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      }
      let ids = getSelectionIds(this.selection,'rowId');
      let params = {rowIds: ids};
      if(val){
        let res = await openComputeArea(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await closeComputeArea(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },
    //开启关闭短信发送
    async toggleNotepush(val){
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查询的分组');
        return;
      }
      let ids = getSelectionIds(this.selection,'rowId');
      let params = {rowIds: ids}
      if(val){
        let res = await openPushMessage(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await closePushMessage(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },
    //激活失效农机
    async handleCommand(command) {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要激活的分组');
        return;
      }
      let ids = getSelectionIds(this.selection,'rowId');
      let params = {rowIds: ids};
      if(command == 'a'){
        let res = await activeMachine(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await unEffectCdMachine(params);
        if(!res.code){
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },

  }
}
</script>

<style scoped lang="less">
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

  .myPage {
    margin-left: 30px;
    margin-top: 15px;
  }
}
.contTable {
  margin-top: 20px;
  margin-left: 27px;
  height: 100%;

  .searchBox {
    //width: 1583px;
    width: calc(100% - 27px);
    height: 154px;
    position: relative;
    border-bottom: 1px solid #133460;

    .formItem {
      width: 100%;
      display: flex;

      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 19%;

        /deep/ .el-form-item__label {
          padding: 0;
        }

        .el-input, .el-select {
          width: 100%;
        }
      }

      .item-data {
        width: 29%;

        .datepicker {
          width: 45% !important;
        }
      }
    }

    .btn {
      height: 36px;
    }
  }

  .table {
    height: calc(100% - 175px);
    padding-right: 24px;

    .table_btns {
      margin: 15px 0;
      height: 31px;
      position: relative;

      .btn-left {
        height: 31px;
        display: flex;
      }

      .btn-right {
        position: absolute;
        height: 31px;
        top: 5px;
        right: 20px;
        display: flex;
        align-items: center;

        /deep/ .el-switch.is-checked .el-switch__core {
          background-color: #2265a4;
          border-color: #2265a4;
        }

        .vertical {
          height: 16px;
          width: 1px;
          border-right: 1px solid #294166;
          margin-left: 14px;
          margin-right: 14px;
        }

        .tableTool {
          display: flex;
          align-items: center;
          color: #aac2d6;
          font-size: 14px;
          cursor: pointer;

          img {
            margin-right: 5px;
          }
        }
      }
    }

    .my-table {
      height: calc(100% - 71px);
    }
  }

  .myPage {
    margin-left: -28px;
    margin-top: 5px;
  }

  /deep/ .el-switch__label {
    color: #aac2d6;
  }
}
</style>
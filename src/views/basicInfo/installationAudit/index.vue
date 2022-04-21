<template>
  <div class="installationAudit">
    <TitleBox class="title" :headName="'安装审核'"/>
    <div class="content">
      <div class="searchBox">
        <el-form ref="form" class="my-form" :model="form" label-width="85px">
          <div class="formItem">
            <el-form-item label="农机分组：">
              <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="setGroupBoxStatus(true)"></el-input>
            </el-form-item>
            <el-form-item label="安装日期：">
              <el-date-picker
                class="datepicker"
                v-model="form.installEndTime"
                type="date"
                :clearable="true"
                prefix-icon="el-icon-date"
                placeholder="安装日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="终端号码：">
              <el-input v-model="form.terminalCode" placeholder="请选择终端号码">
              </el-input>
            </el-form-item>
            <el-form-item label="车牌号码：">
              <el-input v-model="form.plateNumber" placeholder="请输入车牌号码">
              </el-input>
            </el-form-item>
            <el-form-item label="机具识别卡：">
              <el-input v-model="form.toolIfa" placeholder="请输入机具识别卡"></el-input>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="机手姓名：">
              <el-input v-model="form.ownerName" placeholder="请输入机手姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="安装状态：">
              <el-select v-model="form.approvalStatus" placeholder="请选择安装状态" :clearable="true">
                <el-option label="待审批" value="1"></el-option>
                <el-option label="审批通过" value="2"></el-option>
                <el-option label="审批未通过" value="3"></el-option>
                <el-option label="已经重新提交" value="4"></el-option>
                <el-option label="已经作废" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="安装人员：">
              <el-input v-model="form.installer" placeholder="请输入安装人员">
              </el-input>
            </el-form-item>
            <div class="btn">
              <el-button type="primary" class="shadow-btn" round @click="searchInstallList">查询</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div class="table">
        <div class="table_btns">
          <div class="btn-left">
            <el-button type="primary" class="shadow-btn" round @click="auditInfo">审核</el-button>
            <el-button type="primary" class="shadow-btn" round @click="detailClick">详情查看</el-button>
            <el-button type="primary" class="shadow-btn" round @click="deletetClick">删除</el-button>
            <el-button type="primary" class="shadow-btn" round>导出</el-button>
          </div>
        </div>
        <div class="my-table">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="100%"
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
            <el-table-column prop="plateNumber" label="农机车牌">
              <template slot-scope="scope">
                {{ scope.row.plateNumber }}
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
          @size-change="sizeChange"
          />
      </div>

      <AuditDialog ref="audit"></AuditDialog>
      <Detail ref="detail" :title="title"></Detail>
    </div>
  </div>
</template>

<script>
import TitleBox from "../../../components/contenBox/titleBox";
import {mapGetters, mapMutations} from "vuex";
import AuditDialog from './dialog/auditDialog'
import Detail from '@/views/basicInfo/machinerInfo/dialog/machineEdit/MachineEdit'
import myPagination from '_com/myPagination/index'
import {getInstallList,deleteInstall} from "../../../api/basic/install";
import {filterDict,getSelectionIds} from '@/util/util.js'
import {getMachineDict} from "../../../api/basic/machine";


export default {
  components: {
    TitleBox,
    AuditDialog,
    Detail,
    myPagination
  },
  data() {
    return {
      form: {},
      tableData: [],
      columns: [
        {prop: 'groupNameFullPath', label: '农机分组', width: '300px'},
        {
          prop: 'machineType', label: '农机类型', width: '160px', formatter: row => {
            return filterDict(row.machineType, {labelKey: 'itemName', valueKey: 'itemCode'}, this.machineTypeSelect);
          }
        },
        {prop: 'machineTypeName', label: '农机型号', width: '160px'},
        {prop: 'terminalCode', label: '终端编号', width: '160px'},
        {prop: 'terminalModel', label: '终端型号', width: '160px'},
        {prop: 'ownerName', label: '机主姓名', width: '160px'},
        {prop: 'simNumber', label: 'SIM卡号码', width: '160px'},
        {prop: 'defaultToolWidth', label: '作业宽幅', width: '160px'},
        {prop: 'startTime', label: '选装件', width: '160px'},
        {prop: 'activeFlag', label: '农机状态', width: '160px'},
        {prop: 'allowance', label: '补贴额度', width: '160px'},
        {prop: 'allowanceStatus', label: '补贴状态', width: '160px'},
        {prop: 'autoCalFalg', label: '面积计算状态', width: '160px'},
        {prop: 'smsNotify', label: '短信发送状态', width: '160px'},
      ],
      model: '',
      selection: [], // 选择的数据
      machineTypeSelect: [],//农机类型
      title: '',
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
    this.getMachineTypeSelect();
    this.searchInstallList();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //农机类型
    async getMachineTypeSelect() {
      let res = await getMachineDict({
        listType: 'machine_type'
      });
      if (!res.code) {
        this.machineTypeSelect = res.data;
      }
    },
    //查询
    async searchInstallList() {
      let res = await getInstallList(Object.assign({
        page: this.page.currentPage,
        limit: this.page.pageSize
      }, this.form))
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      }
    },
    //翻页
    currentChange(currentPage){
      this.page.currentPage = currentPage;
      this.searchInstallList();
    },
    //改变页大小
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
      this.searchInstallList();
    },
    //详情查看
    detailClick() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要查看的分组');
        return;
      }
      this.$refs.detail.dialogVisible = true;
      this.title = "安装详情"
    },
    //删除
     async delInfo(){
      let ids = getSelectionIds(this.selection,'rowId').slice(0,-1);
      let res = await deleteInstall({
        rowIds: ids
      });
      if(!res.code){
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.getInstallList();
      }
    },
    //删除点击事件
    deletetClick() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要删除的分组');
        return;
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delInfo()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    editClick() {
    },
    auditInfo() {
      this.$refs.audit.dialogVisible = true;
    },
  },
}
</script>

<style scoped lang="less">
.installationAudit {
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
    width: calc(100% - 89px);
    height: calc(100% - 160px);
    border: 1px solid #133460;
    padding: 20px 0 0 27px;

    .searchBox {
      //width: 1583px;
      width: calc(100% - 27px);
      padding-bottom: 5px;
      position: relative;
      border-bottom: 1px solid #133460;

      .formItem {
        width: 100%;
        display: flex;
      }

      /deep/ .el-form-item__label {
        padding: 0;
      }

      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 19%;
      }

      .el-input, .el-select {
        width: 100%;
      }

      .btn {
        margin-left: 10px;
        height: 36px;
      }
    }

    .table {
      height: calc(100% - 138px);
      padding-right: 24px;

      .table_btns {
        margin: 15px 0;
        height: 31px;
        position: relative;

        .btn-left {
          height: 31px;
          display: flex;
        }

      }

      .my-table {
        height: calc(100% - 58px);
      }
    }

    .myPage {
      margin-top: 35px;
      margin-left: -28px;
    }
  }
}


</style>

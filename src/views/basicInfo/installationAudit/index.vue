<template>
  <div class="installationAudit">
    <TitleBox class="title" :headName="'安装审核'" />
    <div class="content">
      <div class="searchBox">
        <el-form ref="form" class="my-form" :model="form" label-width="85px">
          <div class="formItem">
            <el-form-item label="农机分组:">
              <el-input
                v-model="groupData.name"
                placeholder="请选择农机分组"
                @focus="open"
              ></el-input>
            </el-form-item>
            <el-form-item label="安装日期:">
              <el-date-picker
                class="datepicker"
                v-model="form.installEndTime"
                type="date"
                :clearable="true"
                prefix-icon="el-icon-date"
                placeholder="安装日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="终端编号:">
              <el-input
                v-model="form.terminalCode"
                placeholder="请输入终端编号"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="农机车牌:">
              <el-input v-model="form.plateNumber" placeholder="请输入车牌号码">
              </el-input>
            </el-form-item>
            <el-form-item label="机具识别卡:" label-width="90px">
              <el-input
                v-model="form.toolIfa"
                placeholder="请输入机具识别卡"
              ></el-input>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="机主姓名:">
              <el-input v-model="form.ownerName" placeholder="请输入机手姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="审核状态:">
              <el-select
                v-model="form.approvalStatus"
                placeholder="请选择审核状态"
                :clearable="true"
              >
                <el-option
                  v-for="item in approveStatusSelection"
                  :label="item.label"
                  :value="item.flag"
                  :key="item.flag"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="安装人员:">
              <el-input v-model="form.installer" placeholder="请输入安装人员">
              </el-input>
            </el-form-item>
            <div class="btn">
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="query"
                v-if="btnPermis.btnView"
                >查询</el-button
              >
            </div>
          </div>
        </el-form>
      </div>
      <div class="table">
        <div class="table_btns">
          <div class="btn-left">
            <el-button
              type="primary"
              class="shadow-btn"
              round
              @click="auditInfo"
              v-if="btnPermis.btnAudit"
              >审核</el-button
            >
            <el-button
              type="primary"
              class="shadow-btn"
              round
              @click="deletetClick"
              v-if="btnPermis.btnDelete"
              >删除</el-button
            >
            <el-button
              type="primary"
              class="shadow-btn"
              round
              @click="exportInfo"
              v-if="btnPermis.btnExport"
              >导出</el-button
            >
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
              fixed="left"
            >
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="80"
              fixed="left"
              :index="indexMethod"
            >
            </el-table-column>
            <!-- <el-table-column prop="plateNumber" label="农机车牌">
              <template slot-scope="scope">
                <el-button type="text" @click="detailClick(scope.row)">{{ scope.row.plateNumber }}</el-button>
              </template>
            </el-table-column> -->
            <el-table-column
              v-for="item in columns"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
              :formatter="item.formatter"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="item.prop == 'plateNumber'"
                  type="text"
                  @click="detailClick(scope.row)"
                  >{{ scope.row[item.prop] }}</el-button
                >
                <span v-else-if="item.prop == 'defaultToolWidth'">{{
                  scope.row[item.prop] + "米"
                }}</span>
                <span v-else-if="item.prop == 'smsNotify'">{{
                  scope.row[item.prop] == "Y" ? "是" : "否"
                }}</span>
                <span v-else-if="item.prop == 'approvalStatus'">{{
                  approveStatusSelection[scope.row.approvalStatus - 1].label
                }}</span>
                <span v-else-if="item.prop == 'machineType'">{{
                  getSelectionValue(scope.row.machineType, machineTypeSelect)
                }}</span>
                <span v-else-if="item.prop == 'autoCalFalg'">{{
                  scope.row[item.prop] == "Y" ? "是" : "否"
                }}</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
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

      <AuditDialog ref="audit" @flash="searchInstallList"></AuditDialog>
      <Detail
        ref="detail"
        :title="title"
        :btnPermis="btnPermis"
        @flash="detailClick"
        :approveStatusSelection="approveStatusSelection"
      ></Detail>
    </div>
  </div>
</template>
<script>
import TitleBox from "../../../components/contenBox/titleBox";
import { mapGetters, mapMutations } from "vuex";
import AuditDialog from "./dialog/auditDialog";
import Detail from "./dialog/InstationDetailDialog";
import myPagination from "_com/myPagination/index";
import {
  getInstallList,
  deleteInstall,
  getInstallInfo,
  exportExcel,
} from "../../../api/basic/install";
import {
  filterDict,
  getSelectionIds,
  handBlobDown,
  getSelectionValue,
} from "@/util/util.js";
import { getMachineDict } from "../../../api/basic/machine";

export default {
  components: {
    TitleBox,
    AuditDialog,
    Detail,
    myPagination,
  },
  data() {
    return {
      form: {},
      tableData: [],
      columns: [
        { prop: "plateNumber", label: "农机车牌", width: "160px" },
        { prop: "groupNameFullPath", label: "农机分组", width: "300px" },
        { prop: "machineType", label: "农机类型", width: "160px" },
        { prop: "machineModel", label: "农机型号", width: "160px" },
        { prop: "terminalCode", label: "终端编号", width: "160px" },
        { prop: "terminalModel", label: "终端型号", width: "160px" },
        { prop: "installTime", label: "安装日期", width: "160px" },
        { prop: "installer", label: "安装人员", width: "160px" },
        { prop: "toolIfa", label: "机具识别卡", width: "160px" },
        { prop: "ownerName", label: "机主姓名", width: "160px" },
        { prop: "simNumber", label: "SIM卡号码", width: "160px" },
        { prop: "defaultToolWidth", label: "作业宽幅", width: "160px" },
        { prop: "approvalStatus", label: "审核状态", width: "160px" },
        { prop: "autoCalFalg", label: "面积计算状态", width: "160px" },
        { prop: "smsNotify", label: "短信发送状态", width: "160px" },
      ],
      selection: [], // 选择的数据
      machineTypeSelect: [], //农机类型
      title: "",
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      btnPermis: {
        //按钮权限
        btnView: true,
        btnAudit: true,
        btnDetails: true,
        btnDelete: true,
        btnExport: true,
      },
      approveStatusSelection: [
        {
          flag: 1,
          label: "待审核",
        },
        {
          flag: 2,
          label: "审核通过",
        },
        {
          flag: 3,
          label: "审核未通过",
        },
        {
          flag: 4,
          label: "已重新提交",
        },
        {
          flag: 5,
          label: "已作废",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["groupData", "permissions"]),
  },
  created() {
    this.getBtnPermis();
    this.getMachineTypeSelect();
    this.searchInstallList();
  },
  methods: {
    getSelectionValue,
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
    }),

    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.installView];
      this.btnPermis.btnAudit =
        this.permissions[window.global.buttonPremission.installAudit];
      this.btnPermis.btnDetails =
        this.permissions[window.global.buttonPremission.installDetails];
      this.btnPermis.btnDelete =
        this.permissions[window.global.buttonPremission.installDelete];
      this.btnPermis.btnExport =
        this.permissions[window.global.buttonPremission.installExport];
      console.log("this.btnPermis", this.btnPermis);
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //农机类型
    async getMachineTypeSelect() {
      let res = await getMachineDict({
        listType: "machine_type",
      });
      if (!res.code) {
        this.machineTypeSelect = res.data;
      }
    },
    query() {
      // 查询重置
      this.page.currentPage = 1;
      this.searchInstallList();
    },
    //查询
    async searchInstallList() {
      let res = await getInstallList(
        Object.assign(
          {
            groupId: this.groupData.ids.toString(),
            page: this.page.currentPage,
            limit: this.page.pageSize,
          },
          this.form
        )
      );
      // debugger;
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      }
    },
    //翻页
    currentChange(currentPage) {
      //console.log(currentPage);
      this.page.currentPage = currentPage;
      this.searchInstallList();
    },
    //改变页大小
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.searchInstallList();
    },
    //详情查看
    async detailClick(param) {
      let res = await getInstallInfo({
        machineId: param.rowId,
      });
      if (res.code == 0) {
        this.$refs.detail.dialogVisible = true;
        this.$refs.detail.form = res.data;
        this.$refs.detail.srcList = [
          res.data.installPhotos.machinePeoplePhoto,
          res.data.installPhotos.sensorPhoto,
          res.data.installPhotos.signPhoto,
          res.data.installPhotos.terminalPeoplePhoto,
          res.data.installPhotos.terminalPhoto,
        ];
      } else {
        this.$message.error(res.msg);
      }
      //console.log(res.code)
    },
    //删除
    async delInfo() {
      let ids = getSelectionIds(this.selection, "rowId");
      let res = await deleteInstall({
        rowIds: ids,
      });
      if (!res.code) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.searchInstallList();
      }
    },
    //删除点击事件
    deletetClick() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要删除的农机安装单");
        return;
      }
      this.$confirm("是否确定删除选择的数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delInfo();
        })
        .catch(() => {
          /* this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
        });
    },
    auditInfo() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要审核的农机安装单");
        return;
      }
      let arr = [];
      let plateArr = [];
      this.selection.forEach((item) => {
        if (item.approvalStatus == 1) {
          arr.push(item.rowId);
          plateArr.push(item.plateNumber);
        }
        // else{
        // setTimeout(() => {
        //   this.$message.error(`${item.plateNumber}不能被审核`)
        // }, 0);
        // }
      });
      if (arr.length == 0) {
        // this.$message.error("没有选中的数据可以被审核")
        this.$confirm("只能对待审核的安装单进行审核操作!", "提示");
        return;
      } else if (arr.length < this.selection.length) {
        this.$confirm(`是否审核${plateArr.join(",")}？`, "提示").then((val) => {
          this.$refs.audit.form.machineId = arr.toString();
          this.$refs.audit.dialogVisible = true;
        });
      } else {
        this.$refs.audit.form.machineId = arr.toString();
        this.$refs.audit.dialogVisible = true;
      }
    },

    //导出
    async exportInfo() {
      // let ids = [];
      // this.tableData.forEach((item) => {
      //   ids.push(item.rowId);
      // });
      let groupid = this.groupData.ids || [];
      let params = {
        approvalStatus: this.form.approvalStatus,
        title: "农机安装审核",
        installEndTime: this.form.installEndTime,
        groupId: groupid.join(","),
        installer: this.form.installer,
        ownerName: this.form.ownerName,
        plateNumber: this.form.plateNumber,
        terminalCode: this.form.terminalCode,
        toolIfa: this.form.toolIfa,
      };

      let res = await exportExcel(params);
      if (res.success) {
        let obj = res.obj;
        let title = "农机安装审核报表";
        let url =
          window.globalUrl.HOME_API + "agri-web/cd/machine/downloadExcel";
        handBlobDown(url, obj, title);
      }
    },

    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
};
</script>

<style scoped lang="less">
.installationAudit {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
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
    padding: 20px 0 0 0;

    .searchBox {
      padding-left: 27px;
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
        //padding: 0;
      }

      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 19%;
      }

      .el-input,
      .el-select {
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
      padding-left: 27px;

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
      margin-left: -2px;
    }
  }
}
</style>

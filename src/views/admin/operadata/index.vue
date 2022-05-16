<template>
  <div class="opreationSeason">
    <titleBox class="titlebox" :headName="'运维资料管理'" />
    <basic-container class="basic-con">
      <el-form
        ref="form"
        class="my-form"
        :model="form"
        label-width="80px"
        :inline="true"
      >
        <el-form-item label="事件类型:">
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option
              v-for="item in eventTypeSelect"
              :label="item.itemName"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂商:">
          <el-select v-model="form.manufacturerId" placeholder="请选择设备厂商">
            <el-option
              v-for="item in manufacturerSelect"
              :label="item.itemName"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件描述:">
          <el-input
            v-model="form.eventDesc"
            placeholder="请输入事件描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="提出人:">
          <el-input
            v-model="form.proposer"
            placeholder="请输入提出人"
          ></el-input>
        </el-form-item>
        <el-form-item label="解决状态:">
          <el-select
            v-model="form.resolutionStatus"
            placeholder="请选择解决状态"
          >
            <el-option
              v-for="(item, index) in resolutionSelect"
              :label="item"
              :value="index"
            ></el-option
            >>
          </el-select>
        </el-form-item>
        <el-button
          class="shadow-btn"
          round
          v-if="btnPermis.btnView"
          @click="handleSearch"
          >查询</el-button
        >
        <!--            <el-button class="shadow-btn" type="primary" round @click="search(1)" v-if="manager_btn_view">查询</el-button>-->
      </el-form>

      <div class="my-table">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button
              class="shadow-btn"
              round
              size="mini"
              @click="handleCreate"
              v-if="btnPermis.btnAdd"
              >新增</el-button
            >
            <el-button
              class="shadow-btn"
              round
              size="mini"
              @click="handleDelete"
              v-if="btnPermis.btnDelete"
              >删除</el-button
            >
            <!--            <el-button class="shadow-btn" round size="mini" @click="handleDelete">下载</el-button>-->
            <el-button
              class="shadow-btn"
              round
              size="mini"
              @click="handleExport"
              v-if="btnPermis.btnExport"
              >导出</el-button
            >
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="calc(100% - 50px)"
          @selection-change="handleSelectChange"
        >
          <el-table-column
            type="selection"
            label="全选"
            width="60"
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
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                v-if="item.prop == 'eventDesc'"
                type="text"
                @click="editToolsInfo(scope.row.rowId)"
                >{{ scope.row[item.prop] }}
              </el-button>
              <el-button v-else-if="item.prop == 'attachmentList'" type="text"
                >查看</el-button
              >
              <span v-else-if="item.prop == 'eventType'">{{
                eventTypeSelect[scope.row.eventType].itemName
              }}</span>
              <span v-else-if="item.prop == 'manufacturerId'">{{
                manufacturerSelect[scope.row.manufacturerId].itemName
              }}</span>
              <span v-else-if="item.prop == 'resolutionStatus'">
                <span
                  v-if="scope.row.resolutionStatus == 1"
                  @click="handlesolve(scope.row.rowId)"
                  >已解决</span
                >
                <el-button
                  v-else
                  type="primary"
                  class="shadow-btn"
                  round
                  style="height: 30px"
                  @click="handlesolve(scope.row.rowId)"
                >
                  解决</el-button
                >
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      class="myPagination"
      :currentPage="page.currentPage"
      style="margin-top: 10px"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
    <!-- <myPagination
            :currentPage="page.currentPage"
            :pageSize="page.pageSize"
            :total="page.total"
            @current-change="currentChange"
            @size-change="sizeChange"
          /> -->
    <EditInfoDialog
      ref="editInfo"
      :title="editTitle"
      @updateTable="handleSearch"
      :manufacturerSelect="manufacturerSelect.slice(1)"
      :eventTypeSelect="eventTypeSelect.slice(1)"
    ></EditInfoDialog>
  </div>
</template>

<script>
import EditInfoDialog from "./dialog/editInfo";
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index.vue";
import { mapGetters, mapMutations } from "vuex";
import { query, detail, delet, exportExcel } from "_api/admin/operadata";
import { getDictByListType } from "@/api/basic/index";
import { getSelectionIds, handBlobDown } from "@/util/util";

export default {
  components: {
    titleBox,
    myPagination,
    EditInfoDialog,
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { prop: "proposer", label: "提出人", width: 160 },
        { prop: "eventType", label: "事件类型", width: 160 },
        { prop: "eventDesc", label: "事件描述", width: 160 },
        { prop: "manufacturerId", label: "设备厂商", width: 160 },
        { prop: "proposalTime", label: "提出时间", width: 160 },
        { prop: "resolutionStatus", label: "解决状态", width: 160 },
        { prop: "resolutionTime", label: "解决时间", width: 160 },
        { prop: "solverName", label: "解决人", width: 160 },
        { prop: "remark", label: "备注", width: 300 },
      ],
      tableData: [],
      selection: [], // 选择的数据
      editTitle: "",
      form: {
        resolutionStatus: "",
        eventType: "",
        manufacturerId: "",
        eventDesc: "",
        remark: "",
        proposer: "",
      },
      manufacturerSelect: [
        {
          itemName: "全部",
          itemCode: "",
        },
      ],
      eventTypeSelect: [
        {
          itemName: "全部",
          itemCode: "",
        },
      ],
      btnPermis: {
        //按钮权限
        btnView: true,
        btnAdd: true,
        btnEdit: true,
        btnDelete: true,
        btnExport: true,
      },
      resolutionSelect: ["未解决", "已解决"],
      rules: {
        jobYear: [
          { required: true, message: "请选择作业年度", trigger: "change" },
        ],
        jobType: [
          { required: true, message: "请选择作业类型", trigger: "change" },
        ],
        seasonName: [
          { required: true, message: "请输入作业季名称", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择作业时间", trigger: "change" },
          { validator: this.checkTime, trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.getEventTypeSelect();
    this.getManufacturerSelect();
    this.initData();
    // this.getBtnPermis();
  },
  methods: {
    // getBtnPermis() {
    //   this.btnPermis.btnView = this.permissions[window.global.buttonPremission.operationdataView];
    //   this.btnPermis.btnAdd = this.permissions[window.global.buttonPremission.operationdataAdd];
    //   this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.operationdataEdit];
    //   this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.operationdataDelete];
    //   this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.operationdataExport];
    //   //console.log('this.btnPermis',this.btnPermis)
    //   //console.log('this.permissions',this.permissions)
    // },
    //获取列表数据
    async initData() {
      let res = await query(
        Object.assign(
          {
            pageIndex: this.page.currentPage,
            pageSize: this.page.pageSize,
          },
          this.form
        )
      );
      if (!res.code) {
        this.tableData = res.data.records;
        this.page.total = res.data.total;
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate() {
      this.editTitle = "运维资料管理新增";
      this.$refs.editInfo.dialogVisible = true;
    },
    //解决
    async handlesolve(param) {
      this.editTitle = "运维资料管理解决状态变更";
      let res = await detail(param);
      if (!res.code) {
        this.$refs.editInfo.dialogVisible = true;
        if (res.data.attachmentList) {
          let arr = [];
          res.data.attachmentList.forEach((item) => {
            if (item.isReview == 1) {
              arr.push({
                attachmentName: item.attachmentName,
                name: item.originName,
                url: item.attachmentUrl,
                size: item.attachmentSize,
                status: item.lastUpdDate.split(" ")[0],
                rowId: item.rowId,
                type: item.attachmentType.toLowerCase(),
              });
            } else {
            }
          });
          this.$refs.editInfo.tableData = arr;
        }
        console.log(res.data);
        // res.data.attachmentList = [];
        this.$refs.editInfo.form = res.data;
      }
    },
    // 编辑
    async editToolsInfo(param) {
      this.editTitle = "运维资料管理编辑";
      let res = await detail(param);
      debugger;
      if (!res.code) {
        this.$refs.editInfo.dialogVisible = true;
        if (res.data.attachmentList) {
          let arr = [];
          res.data.attachmentList.forEach((item) => {
            if (item.isReview == 0) {
              arr.push({
                attachmentName: item.attachmentName,
                name: item.originName,
                url: item.attachmentUrl,
                size: item.attachmentSize,
                status: item.lastUpdDate.split(" ")[0],
                rowId: item.rowId,
                type: item.attachmentType.toLowerCase(),
              });
            } else {
            }
          });
          this.$refs.editInfo.tableData = arr;
        }
        this.$refs.editInfo.form = res.data;
      }
    },
    // 删除
    handleDelete() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要删除的数据");
        return;
      }
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteOperaData();
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          /* this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
        });
    },
    async deleteOperaData() {
      let ids = getSelectionIds(this.selection, "rowId");
      ids = ids.split(",");
      let res = await delet(ids);
      if (!res.code) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.initData();
      }
    },
    //获取设备厂商
    async getManufacturerSelect() {
      let res = await getDictByListType({
        listType: "ternimal_manufacturer",
      });
      if (!res.code) {
        this.manufacturerSelect = this.manufacturerSelect.concat(res.data);
      }
    },
    //获取事件类型
    async getEventTypeSelect() {
      let res = await getDictByListType({
        listType: "event_type",
      });
      if (!res.code) {
        this.eventTypeSelect = this.eventTypeSelect.concat(res.data);
      }
    },
    //处理导出事件
    async handleExport() {
      let res = await exportExcel(
        Object.assign(
          {
            pageIndex: this.page.currentPage,
            pageSize: this.page.pageSize,
          },
          this.form
        )
      );
      if (res.data.success) {
        let obj = res.data.obj;
        let title = "运维资料管理报表";
        let url =
          window.globalUrl.HOME_API + "agri-web/rp/statistics/downloadExcel";
        handBlobDown(url, obj, title);
      } else {
        this.$message.error(msg || "导出失败");
      }
    },

    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    handleSearch() {
      this.page.currentPage = 1;
      this.initData();
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
};
</script>

<style lang="less" scoped>
.opreationSeason {
  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    height: 100%;

    .el-card__body {
      padding-top: 0;
    }

    .my-form {
      border-bottom: #133460 1px solid;
    }
  }

  .titlebox {
    width: calc(100% - 62px);
    margin: 10px 40px 0;
  }
  .myPagination {
    margin: 0px 40px;
  }

  .basic-con {
    margin: 10px 40px;
    .self-box {
      position: unset;
      background: transparent;
      height: 100%;
      padding-right: 20px;
      margin-right: 20px;
      border-right: 1px solid #133460;
      div {
        position: unset;
      }
      height: 100%;
    }

    .my-form {
      border-bottom: #133460 1px solid;

      .el-form-item {
        margin-bottom: 18px;
        margin-right: 20px;
      }

      /deep/ .el-form-item__label {
        line-height: 36px;
      }

      .shadow-btn {
        height: 36px !important;
      }
    }

    .my-table {
      margin-top: 10px;
      height: calc(100% - 130px);
      /deep/ .el-table__body-wrapper {
        overflow: scroll !important;
      }

      /deep/ .el-form {
        height: 440px;
        width: 100%;
      }
    }
  }

  .content {
    margin-top: 20px;
    margin-left: 10px;

    .el-form-item {
      margin-right: 40px;
    }

    /deep/ .el-form-item__label {
      padding: 0;
    }

    .el-input,
    .el-select {
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
}
</style>
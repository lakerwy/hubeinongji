<template>
  <!-- 监测面积统计报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'监测面积统计报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          ref="form"
          class="my-form"
          :model="form"
          label-width="85px"
          :inline="true"
        >
          <el-form-item label="区域选择:">
            <el-input
              v-model="groupData.name"
              placeholder="请选择农机分组"
              @focus="open"
            ></el-input>
          </el-form-item>
          <el-form-item label="作业类型:">
            <el-select
              v-model="jobType"
              placeholder="请选择作业类型"
              :disabled="globalSetting.jobType != ''"
              :clearable="true"
            >
              <el-option
                v-for="item in jobTypeSelect"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份选择:	">
            <el-date-picker
              class="datepicker"
              v-model="form.queryYear"
              type="year"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="项目属性:">
            <el-select v-model="model" placeholder="请选择项目属性">
              <el-option label="label" value="value">全部</el-option>
            </el-select>
          </el-form-item> -->
          <el-button
            type="primary"
            class="shadow-btn"
            plain
            round
            v-if="btnPermis.btnView"
            @click="handleClick('search')"
            >查询</el-button
          >
          <div
            class="tableTool"
            @click="handleClick('export')"
            v-if="btnPermis.btnExport"
          >
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </el-form>
      </div>
      <div class="my-table">
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
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
            width="120"
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
            :formatter="item.formatter"
          >
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top: 22px"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import { dateFormat, downloadPost, filterDict } from "@/util/util";
import { mapGetters, mapMutations } from "vuex";
import { getMachineDict } from "@/api/basic/machine";
import {
  queryDetectionAreaTable,
  exportMonitoringAreaReport,
} from "_api/report/dataAnalysis";
export default {
  name: "department",

  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 4,
      },
      columns: [
        { prop: "groupNameFullPath", label: "分组名称" },
        { prop: "year", label: "年份" },
        {
          prop: "jobType",
          label: "作业类型",
          formatter: this.jobTypeFormatter,
        },
        {
          prop: "taskArea",
          label: "任务面积（亩）",
          formatter: (row, column) => {
            return (row.taskArea*1).toFixed(2);
          },
        },
        {
          prop: "successArea",
          label: "已完成面积（亩）",
          formatter: (row, column) => {
            return (row.successArea*1).toFixed(2);
          },
        },
        {
          prop: "passArea",
          label: "审核通过面积（亩）",
          formatter: (row, column) => {
            return (row.passArea*1).toFixed(2) ;
          },
        },
        {
          prop: "notPassArea",
          label: "审核未通过面积（亩）",
          formatter: (row, column) => {
            return (row.notPassArea*1).toFixed(2);
          },
        },
      ],
      tableData: [],
      jobTypeSelect: [],
      selection: [], // 选择的数据
      form: {
        jobType: "",
        queryYear: new Date(),
      },
      btnPermis: {
        //按钮权限
        btnView: true,
        btnExport: true,
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["groupData", "permissions", "globalSetting"]),
    jobType: {
      get: function () {
        if (this.globalSetting.jobType) {
          this.form.jobType = this.globalSetting.jobType;
        }
        return this.form.jobType;
        // return this.globalSetting.jobType ? this.globalSetting.jobType : this.form.jobType
      },
      set: function (val) {
        this.form.jobType = val;
      },
    },
  },
  created() {
    this.setGroupTreeIsArea(true);
    this.getJobTypeSelection();
    this.getBtnPermis();
  },
  destroyed() {
    this.setGroupTreeIsArea(false);
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupCheckBox: "setGroupCheckBox",
      setGroupTreeIsArea:"setGroupTreeIsArea",
    }),
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[
          window.global.buttonPremission.detectionAreaReportView
        ];
      this.btnPermis.btnExport =
        this.permissions[
          window.global.buttonPremission.detectionAreaReportExport
        ];
      //console.log('this.btnPermis',this.btnPermis)
    },
    open() {
      this.setGroupBoxStatus(true);
    },
    //生成
    initData() {
      this.queryTable();
    },
    async queryTable() {
      this.loading = true;
      let res = await queryDetectionAreaTable({
        jobType: this.jobType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        groupId: this.groupData.ids.toString(),
        year: this.form.queryYear.getFullYear(),
      });
      this.loading = false;
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.total;
      }else{
        this.$message.warning(res.msg)
      }
    },
    //导出Excel
    async exportExcel() {
      if (this.groupData.ids.length <= 0) {
        this.$message.info("请先选择分组或者农机");
        return;
      }
      let params = {
        jobType: this.jobType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        groupId: this.groupData.ids.toString(),
        year: this.form.queryYear.getFullYear(),
      };
      if (params) {
        params.title =
          this.groupData.name +
          "监测面积统计报表" +
          dateFormat(new Date()) +
          ".xls";
      }
      this.isloading = true;
      let res = await exportMonitoringAreaReport(params);
      this.isloading = false;
    },

    //查询农机类型
    async getJobTypeSelection() {
      let res = await getMachineDict({
        listType: "job_type",
      });
      if (!res.code) {
        this.jobTypeSelect = this.jobTypeSelect.concat(res.data);
      }
    },

    // 查询
    searchChange() {},
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    //处理序号问题
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
    //作业类型回显
    jobTypeFormatter(row) {
      return filterDict(
        row.jobType,
        { labelKey: "itemName", valueKey: "itemCode" },
        this.jobTypeSelect
      );
    },
    //处理点击事件。
    handleClick(param) {
      if(this.groupData.ids && this.groupData.ids.length > 0 ){
        if (param === "search") {
          this.initData();
        }else if(param === 'export'){
          this.exportExcel()
        }
      }else{
        this.$message.warning("请选择区域分组")
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.opreationSeason {
  .basic-con {
    .my-form {
      .el-form-item {
        margin-bottom: 20px;
        margin-right: 20px;
        /deep/.el-input {
          width: 215px;
        }
      }

      /deep/ .el-form-item__label {
        line-height: 36px;
      }

      .shadow-btn {
        height: 36px !important;
      }
    }

    .my-table {
      margin-top: 20px;
      height: calc(100% - 155px);

      /deep/ .el-table {
        height: calc(100% - 54px);
      }
    }
  }

  .searchline {
    padding-bottom: 18px;
    border-bottom: 1px solid #133460;
    margin-bottom: 5px;
    .tableTool {
      display: flex;
      align-items: center;
      color: #aac2d6;
      font-size: 14px;
      cursor: pointer;
      height: 36px;
      float: right;
      img {
        margin-right: 5px;
      }
    }
  }
}
</style>
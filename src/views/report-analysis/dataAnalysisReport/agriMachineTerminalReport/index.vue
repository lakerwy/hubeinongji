<template>
  <!-- 农机终端面积统计报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'农机终端面积统计报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          ref="form"
          class="my-form"
          :model="form"
          label-width="85px"
          :inline="true"
        >
          <el-form-item label="农机类型:">
            <el-select
              v-model="form.machineType"
              placeholder="请选择农机类型"
              :clearable="true"
            >
              <el-option
                v-for="item in machineTypeSelect"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计日期:">
            <el-date-picker
              class="datepicker"
              v-model="form.bTimeEx"
              type="date"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
              :picker-options="startTime"
            ></el-date-picker>
            <span style="diaplay: inline-block; width: 12px; color: #448dd5">
              —
            </span>
            <el-date-picker
              class="datepicker"
              v-model="form.eTimeEx"
              type="date"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
              :picker-options="endTime"
            ></el-date-picker>
          </el-form-item>
          <el-button
            type="primary"
            class="shadow-btn"
            plain
            round
            @click="handleClick('search')"
            v-if="btnPermis.btnView"
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
      <div class="echarts">
        <div class="switch">
          <div
            :class="{ active: echartType == 'type', type: true }"
            @click="changeEchartType('type')"
          >
            类型
          </div>
          <div
            :class="{ active: echartType == 'time', time: true }"
            @click="changeEchartType('time')"
          >
            时间
          </div>
        </div>
        <div
          id="todayInstall"
          v-loading="todayInstallLoading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
        ></div>
        <div
          id="cumulativeArea"
          v-loading="cumulativeAreaLoading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
        ></div>
      </div>
      <div class="my-table">
        <el-table
          :data="tableData"
          v-loading="tableLoading"
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
import options from "./optionChart";
import { initEcharts } from "../../../../util/chart";
import { dateFormat, downloadPost ,filterDict} from "@/util/util";
import { mapGetters, mapMutations } from "vuex";
import { getMachineDict } from "@/api/basic/machine";
import {
  queryTodayInstallsChart,
  queryGrandTotalWorkAreaTimeTab,
  queryGrandTotalWorkAreaTypeTab,
  getAgriTerminalTableData,
  excelGrandTotalWorkArea,
} from "_api/report/dataAnalysis";

export default {
  name: "agriMachineTerminalReport",

  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      form: {
        bTimeEx: new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
        eTimeEx: new Date(),
        machineType: "",
      },
      model: "",
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 4,
      },
      startTime: {
        disabledDate: (time) => {
          let endDateVal = this.form.eTimeEx;
          if (endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {},
      },
      endTime: {
        disabledDate: (time) => {
          let startDateVal = this.form.bTimeEx;
          if (startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {},
      },
      machineTypeSelect: [
        {
          itemCode: "",
          itemName: "全部",
        },
      ],
      columns: [
        { prop: "machineType", label: "农机类型",formatter: (row) => {
            return filterDict(
              row.machineType,
              {
                labelKey: "itemName",
                valueKey: "itemCode",
              },
              this.machineTypeSelect
            );
          },},
        { prop: "queryDate", label: "统计日期" },
        {
          prop: "totalTaskArea",
          label: "作业面积（亩）",
        },
        // {
        //   prop: "totalInstallCount",
        //   label: "累计安装数（台）",
        // },
        {
          prop: "todayInstallCount",
          label: "当日新增安装数（台）",
        },
        {
          prop: "todayOnlineCount",
          label: "当日上线数（台）",
        },
        // {
        //   prop: "monthOnlineCount",
        //   label: "月累计上线数（台）",
        // },
      ],
      tableData: [],
      selection: [], // 选择的数据
      btnPermis: {
        //按钮权限
        btnView: true,
        btnExport: true,
      },
      tableLoading: false,
      cumulativeAreaLoading: false,
      todayInstallLoading: false,
      echartType: "type",
    };
  },
  computed: {
    ...mapGetters(["permissions", "globalSetting"]),
    // jobType:{
    //   get:function(){
    //     if(this.globalSetting.jobType){
    //       this.form.jobType = this.globalSetting.jobType
    //     }
    //     return this.form.jobType
    //     // return this.globalSetting.jobType ? this.globalSetting.jobType : this.form.jobType
    //   },
    //   set:function(val){
    //     this.form.jobType = val
    //   }
    // }
  },
  watch: {
    "globalSetting.bTime": {
      handler(newVal, oldVal) {
        this.form.bTimeEx = newVal ? newVal : this.form.bTimeEx;
      },
      immediate: true,
    },
    "globalSetting.eTime": {
      handler(newVal, oldVal) {
        this.form.eTimeEx = newVal ? newVal : this.form.eTimeEx;
      },
      immediate: true,
    },
  },
  created() {
    this.initData();
    this.getBtnPermis();
    this.getMachineTypeSelection();
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[
          window.global.buttonPremission.agriMachineTerminalReportView
        ];
      this.btnPermis.btnExport =
        this.permissions[
          window.global.buttonPremission.agriMachineTerminalReportExport
        ];
      //console.log('this.btnPermis',this.btnPermis)
    },
    initData() {
      this.queryDayInstall();
      this.queryTableData();
      if (this.echartType == "time") {
        this.queryGrandTotalWorkAreaTime();
      } else if (this.echartType == "type") {
        this.queryGrandTotalWorkAreaType();
      }
    },
    // 查询
    searchChange() {},
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate() {
      this.editTitle = "机具信息新增";
      this.$refs.editInfo.dialogVisible = true;
    },
    editToolsInfo() {
      this.editTitle = "机具信息编辑";
      this.$refs.editInfo.dialogVisible = true;
    },
    //查询作业类型
    async getMachineTypeSelection() {
      let res = await getMachineDict({
        listType: "machine_type",
      });
      if (!res.code) {
        this.machineTypeSelect = this.machineTypeSelect.concat(res.data);
      }
    },
    // 删除
    // handleDelete() {
    //   if (this.selection.length <= 0) {
    //     this.$message.info("请选择需要删除的分组");
    //     return;
    //   }
    //   this.$confirm("是否确认删除选中的数据?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     this.getList(this.page);
    //     this.$notify.success("删除成功");
    //   });
    // },

    // 保存
    save() {},
    // 取消关闭
    cancal() {
      this.form = {};
      this.dialogVisible = false;
    },
    //请求当日新增安装量echart表
    async queryDayInstall() {
      this.todayInstallLoading = true;
      let res = await queryTodayInstallsChart({
        endDate: dateFormat(this.form.eTimeEx),
        machineType: this.form.machineType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        startDate: dateFormat(this.form.bTimeEx),
      });
      if (!res.code) {
        if (res.data.days.length != 0) {
          let echartDays = res.data.days.map((item) => {
            item = item.split("-");
            item.shift();
            item = item.join("-");
            return item;
          });
          this.$set(options.todayInstall.xAxis, "data", echartDays);
          this.$set(options.todayInstall.series[0], "data", res.data.amount);
        }
      }
      this.todayInstallLoading = false;
      initEcharts("todayInstall", options.todayInstall);
    },
    // import {queryTodayInstallsChart,queryGrandTotalWorkAreaTimeTab,queryGrandTotalWorkAreaTypeTab} from "_api/report/dataAnalysis"
    //请求类型tab的累计作业面积
    async queryGrandTotalWorkAreaType() {
      this.cumulativeAreaLoading = true;
      let res = await queryGrandTotalWorkAreaTypeTab({
        endDate: dateFormat(this.form.eTimeEx),
        machineType: this.form.machineType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        startDate: dateFormat(this.form.bTimeEx),
      });
      if (!res.code) {
        this.$set(options.cumulativeArea.xAxis.axisLabel, "rotate", 0);
        this.$set(options.cumulativeArea.xAxis.axisLabel, "interval", 0);
        this.$set(
          options.cumulativeArea.xAxis,
          "data",
          res.data.machineTypeNames
        );
        this.$set(options.cumulativeArea.series[0], "data", res.data.area);
        this.$set(options.cumulativeArea, "dataZoom", []);
      } else {
        this.echartType = "time";
        this.$message.error("请求失败");
      }
      this.cumulativeAreaLoading = false;
      initEcharts("cumulativeArea", options.cumulativeArea);
    },
    //请求时间ab的累计作业面积
    async queryGrandTotalWorkAreaTime() {
      this.cumulativeAreaLoading = true;
      let res = await queryGrandTotalWorkAreaTimeTab({
        endDate: dateFormat(this.form.eTimeEx),
        machineType: this.form.machineType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        startDate: dateFormat(this.form.bTimeEx),
      });
      if (!res.code) {
        if (res.data.jobTimeList.length != 0) {
          let echartDays = res.data.jobTimeList.map((item) => {
            item = item.split("-");
            item.shift();
            item = item.join("-");
            return item;
          });
          this.$set(options.cumulativeArea.xAxis, "data", echartDays);
          this.$set(options.cumulativeArea.series[0], "data", res.data.area);
          this.$set(options.cumulativeArea.xAxis.axisLabel, "rotate", 60);
          this.$set(options.cumulativeArea.xAxis.axisLabel, "interval", 2);
          this.$set(options.cumulativeArea, "dataZoom", [
            {
              type: "inside",
              // disabled:true,
              xAxisIndex: [0],
              start: 90,
              end: 100,
            },
          ]);
        }
      } else {
        this.echartType = "type";
        this.$message.error("请求失败");
      }
      this.cumulativeAreaLoading = false;
      initEcharts("cumulativeArea", options.cumulativeArea);
    },
    //获取列表分页数据
    async queryTableData() {
      let res = await getAgriTerminalTableData({
        endDate: dateFormat(this.form.eTimeEx),
        machineType: this.form.machineType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        startDate: dateFormat(this.form.bTimeEx),
      });
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.total;
      }
    },
    //转换右侧echart宝额数据维度
    changeEchartType(target) {
      if (target === "type") {
        this.echartType = "type";
        this.queryGrandTotalWorkAreaType();
      } else {
        this.echartType = "time";
        this.queryGrandTotalWorkAreaTime();
      }
    },
    //导出excel报表
    async exportExcel() {
      let params = {
        endDate: dateFormat(this.form.eTimeEx),
        machineType: this.form.machineType,
        pageIndex: this.page.currentPage,
        pageSize: this.page.pageSize,
        startDate: dateFormat(this.form.bTimeEx),
      };
      if (params) {
        params.title = "农机终端面积统计报表" + dateFormat(new Date()) + ".xls";
      }
      this.isloading = true;
      let res = await excelGrandTotalWorkArea(params);
      this.isloading = false;
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
    handleClick(param) {
      if (param == "search") {
        this.initData();
      } else if (param == "export") {
        this.exportExcel();
      }
    },
  },
  mounted() {
    initEcharts("todayInstall", options.todayInstall);
    initEcharts("cumulativeArea", options.cumulativeArea);
  },
};
</script>

<style lang="less" scoped>
.opreationSeason {
  .basic-con {
    .my-form {
      .el-form-item {
        margin-bottom: 0;
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
      height: calc(100% - 370px);

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
  .echarts {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .switch {
      z-index: 999;
      position: absolute;
      right: 70px;
      top: 190px;
      height: 32px;
      display: flex;
      width: 110px;
      border-radius: 4px;
      color: #67c8ff;
      border: #2266aa 1px solid;
      .type,
      .time {
        width: 55px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
      .active {
        background-color: #2877c1;
        color: #ffffff;
      }
      .type {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .time {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    div {
      width: 800px;
      height: 275px;
      // background-color: red;
    }
  }
}
</style>
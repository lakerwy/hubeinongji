<template>
  <!-- 农机上月上线统计报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'农机上月上线统计报表'" />
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
            <el-select v-model="form.machineType" placeholder="请选择农机类型">
              <el-option
                v-for="item in machineTypeSelect"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域选择:">
            <el-input
              v-model="groupData.name"
              placeholder="请选择农机分组"
              @focus="open"
            ></el-input>
          </el-form-item>
          <el-form-item label="统计日期:">
            <el-date-picker
              class="datepicker"
              v-model="form.startTime"
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
              v-model="form.endTime"
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
            v-if="btnPermis.btnView"
            @click="handleClick('search')"
          >
            查询
          </el-button>
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
      <div class="switch">
        <div
          :class="{ active: echartType == 'month', type: true }"
          @click="changeEchartType('month')"
        >
          月表
        </div>
        <div
          :class="{ active: echartType == 'day', time: true }"
          @click="changeEchartType('day')"
        >
          日表
        </div>
      </div>
      <div
        id="monthOnline"
        class="monthOnline"
        v-loading="echartLoading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
      ></div>
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
import { dateFormat ,filterDict } from "@/util/util";
import { mapGetters, mapMutations } from "vuex";
import {
  queryMonthHistogram,
  queryDayHistogram,
  queryTable,
  exportOnlineStatistics,
} from "_api/report/dataAnalysis";
import { getMachineDict } from "@/api/basic/machine";

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
        { prop: "machineType", label: "农机类型",formatter:(row,column) =>{
          return filterDict(row.machineType, {labelKey: 'itemName', valueKey: 'itemCode'}, this.machineTypeSelect)
        }},
        { prop: "pushDate", label: "统计日期" },
        { prop: "machineNumber", label: "总数" },
        { prop: "onlineNumber", label: "在线" },
        { prop: "offlineNumber", label: "离线" },
      ],
      machineTypeSelect: [
        {
          itemName: "全部",
        },
      ],
      tableData: [],
      selection: [], // 选择的数据
      form: {
        startTime: new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
        endTime: new Date(),
      },
      startTime: {
        disabledDate: (time) => {
          let endDateVal = this.form.endTime;
          if (endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {},
      },
      endTime: {
        disabledDate: (time) => {
          let startDateVal = this.form.startTime;
          if (startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {},
      },
      btnPermis: {
        //按钮权限
        btnView: true,
        btnExport: true,
      },
      // loading:false
      echartLoading: false,
      tableLoading: false,
      echartType: "month",
    };
  },
  computed: {
    ...mapGetters([
      "groupData",
      "permissions",
      "globalSetting",
      "groupTreeIsArea",
    ]),
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
    this.setGroupTreeIsArea(true);
    this.getMachineTypeSelection();
    this.getBtnPermis();
  },
  destroyed() {
    console.log("destroyed");
    this.resetEchats()
    this.setGroupTreeIsArea(false);
  },

  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupCheckBox: "setGroupCheckBox",
      setGroupTreeIsArea: "setGroupTreeIsArea",
    }),
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[
          window.global.buttonPremission.agriMonthOnlineReportView
        ];
      this.btnPermis.btnExport =
        this.permissions[
          window.global.buttonPremission.agriMonthOnlineReportView
        ];
      //console.log('this.btnPermis',this.btnPermis)
    },
    initData() {
      if (this.echartType == "month") {
        this.queryMonthEchartData();
      } else if (this.echartType == "day") {
        this.queryDayEchartData();
      }
      this.queryTableData();
    },
    //跳转页面时重置eCharts
    resetEchats(){
        this.$set(options.monthOnline.xAxis, "data", []);
        this.$set(options.monthOnline.series[0], "data", []);
    },
    // 查询
    searchChange() {},
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.queryTableData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.queryTableData();
    },
    //查询农机类型
    async getMachineTypeSelection() {
      let res = await getMachineDict({
        listType: "machine_type",
      });
      if (!res.code) {
        this.machineTypeSelect = this.machineTypeSelect.concat(res.data);
      }
    },
    //转换右侧echart宝额数据维度
    changeEchartType(target) {
        if (target === "month") {
          this.echartType = "month";
          this.queryMonthEchartData();
        } else {
          this.echartType = "day";
          this.queryDayEchartData();
        }
    },
    //请求echart数据
    async queryMonthEchartData() {
      this.echartLoading = true;
      let res = await queryMonthHistogram(
        Object.assign({
          groupId: this.check() ? this.groupData.ids.toString() : "",
          startTime: dateFormat(this.form.startTime,'yyyy-MM-dd'),
          endTime: dateFormat(this.form.endTime,'yyyy-MM-dd'),
          machineType: this.form.machineType,
          jobType: this.globalSetting.jobType,
        })
      );
      this.echartLoading = false;
      if (!res.code) {
        if (res.data.days.length != 0) {
          // let echartDays =  res.data.days.map(item => {
          //   item = item.split('-')
          //   item.shift()
          //   item = item.join("-")
          //   return item
          // });
          this.$set(options.monthOnline.xAxis, "data", res.data.days);
          this.$set(options.monthOnline.series[0], "data", res.data.amount);
          this.$set(options.monthOnline.yAxis, "name", "月上线数");
        }
      }
      initEcharts("monthOnline", options.monthOnline);
    },
    async queryDayEchartData() {
      this.echartLoading = true;
      let res = await queryDayHistogram(
        Object.assign({
          groupId: this.check() ? this.groupData.ids.toString() : "",
          startTime: dateFormat(this.form.startTime,'yyyy-MM-dd'),
          endTime: dateFormat(this.form.endTime,'yyyy-MM-dd'),
          machineType: this.form.machineType,
          jobType: this.globalSetting.jobType,
        })
      );
      this.echartLoading = false;
      if (!res.code) {
        if (res.data.days.length != 0) {
          let echartDays = res.data.days.map((item) => {
            item = item.split("-");
            item.shift();
            item = item.join("-");
            return item;
          });
          this.$set(options.monthOnline.xAxis, "data", echartDays);
          this.$set(options.monthOnline.series[0], "data", res.data.amount);
          this.$set(options.monthOnline.yAxis, "name", "日上线数");
        }
      }
      initEcharts("monthOnline", options.monthOnline);
    },
    //导出报表

    async exportExcel() {
      let params = {
        groupId: this.check() ? this.groupData.ids.toString() : "",
        startTime: dateFormat(this.form.startTime,'yyyy-MM-dd'),
        endTime: dateFormat(this.form.endTime,'yyyy-MM-dd'),
        machineType: this.form.machineType,
        jobType: this.globalSetting.jobType,
      };
      if (params) {
        let name = this.groupData.name ? this.groupData.name : ""
        params.title =
          name +
          "月上线报表" +
          dateFormat(new Date()) +
          ".xls";
      }
      this.isloading = true;
      let res = await exportOnlineStatistics(params);
      this.isloading = false;
    },
    //请求列表数据
    async queryTableData() {
      this.tableLoading = true;
      let res = await queryTable(
        Object.assign({
          groupId: this.check() ? this.groupData.ids.toString() : "",
          startTime: dateFormat(this.form.startTime,'yyyy-MM-dd'),
          endTime: dateFormat(this.form.endTime,'yyyy-MM-dd'),
          machineType: this.form.machineType,
          jobType: this.globalSetting.jobType,
          pageIndex: this.page.currentPage,
          pageSize: this.page.pageSize
        })
      );
      this.tableLoading = false;
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.total;
      }
    },
    //判断是不是选择了区域
    check(){
      let arr = Object.keys(this.groupData);
      if (arr.length == 0) {
        // this.$message.warning("请选择区域");
        return false
      }else{
        return true
      }
    },
    handleClick(param) {
      //判断是不是空对象
      // var arr = Object.keys(this.groupData);
      // if (arr.length == 0) {
        // this.$message.error("请选择区域");
      // } else {
      // if(this.check()){
        if (param === "search") {
          this.initData();
        } else if (param === "export") {
          this.exportExcel();
        }
      // }
      // }
    },
    //处理序号问题
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
  mounted() {
    initEcharts("monthOnline", options.monthOnline);
  },
};
</script>

<style lang="less" scoped>
.opreationSeason {
  // overflow: hidden;
  .basic-con {
    // overflow: hidden;
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
    padding-bottom: 18px;
    border-bottom: 1px solid #133460;
    margin-bottom: 5px;
  }

  .switch {
    z-index: 999;
    position: absolute;
    right: 50px;
    top: 170px;
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
  .monthOnline {
    margin-top: 15px;
    width: 100%;
    height: 275px;
    // background-color: red;
  }
}
</style>
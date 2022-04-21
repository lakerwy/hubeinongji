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
          <el-form-item label="作业类型:">
            <el-select v-model="model" placeholder="请选择作业类型">
              <el-option label="label" value="value">全部</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务时间:">
            <el-date-picker
              class="datepicker"
              v-model="form.queryStartTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
            <span style="diaplay: inline-block; width: 12px; color: #448dd5">
              —
            </span>
            <el-date-picker
              class="datepicker"
              v-model="form.queryEndTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round
            >查询</el-button
          >
          <div class="tableTool" @click="handleClick('export')">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </el-form>
      </div>
      <div class="echarts">
        <div class="switch">
          <div :class="{active:!echartType,type:true}"  @click="changeEchartType('type')">
            类型
          </div>
          <div :class="{active:echartType,time:true}"  @click="changeEchartType('time')">
            时间
          </div>
        </div>
        <div id="todayInstall"></div>
        <div id="cumulativeArea">
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
          <el-table-column type="index" label="序号" width="120" fixed="left">
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top: 32px"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import options from "./optionChart";
import { initEcharts } from "../../../../util/chart";

export default {
  name: "department",

  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      searchForm: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
      columns: [
        { prop: "sesonName", label: "农机类别" },
        { prop: "groupName", label: "统计日期" },
        { prop: "type", label: "累计作业面积" },
        { prop: "startTime", label: "累计安装数" },
        { prop: "sesonName", label: "当日新增安装数" },
        { prop: "sesonName", label: "当日上线数" },
        { prop: "sesonName", label: "月累计上线数" },
      ],
      tableData: [
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市公安县合作社",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市公安县合作社",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市公安县合作社",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市公安县合作社",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
      ],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {},
      model: "",
      showMaps: false,
      editTitle: "",
      echartType:true,

    };
  },
  methods: {
    initData() {},
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
    // 删除
    // handleDelete() {
    //   if (this.selection.length <= 0) {
    //     this.$message.info("请选择需要删除的分组");
    //     return;
    //   }
    //   this.$confirm("是否确认删除选中的数据?", "警告", {
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


    //转换右侧echart宝额数据维度
    changeEchartType(target){
      if(target === 'type'){
        this.echartType = false
      }
      else{
        this.echartType = true
      }
  },
    currentChange() {},
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
      height: calc(100% - 81px);

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
      .switch{
        z-index: 999;
        position: absolute;
        right: 70px;
        top: 190px;
        height: 32px;
        display: flex;
        width: 110px;
        border-radius: 4px;
        color: #67c8ff;
        border:#2266aa 1px solid;
        .type,.time{
          width: 55px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          cursor: pointer;
        }
        .active{
          background-color: #2877c1;
          color: #ffffff;
        }
        .type{
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        .time{
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    div {
      width: 777px;
      height: 275px;
      // background-color: red;
    }
  }
}
</style>
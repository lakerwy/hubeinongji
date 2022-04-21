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
            <el-select v-model="model" placeholder="请选择作业类型">
              <el-option label="label" value="value">全部</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业类型:">
            <el-select v-model="model" placeholder="请选择作业类型">
              <el-option label="label" value="value">全部</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份选择:	">
            <el-date-picker
              class="datepicker"
              v-model="form.queryStartTime"
              type="year"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="项目属性:">
            <el-select v-model="model" placeholder="请选择项目属性">
              <el-option label="label" value="value">全部</el-option>
            </el-select>
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
        { prop: "sesonName", label: "省" },
        { prop: "groupName", label: "市" },
        { prop: "type", label: "区县" },
        { prop: "startTime", label: "年份" },
        { prop: "sesonName", label: "作业类型" },
        { prop: "sesonName", label: "任务面积" },
        { prop: "sesonName", label: "已完成面积" },
        { prop: "sesonName", label: "审核通过面积" },
        { prop: "sesonName", label: "审核未通过面积" },
        { prop: "sesonName", label: "城市累计作业面积" },
      ],
      tableData: [
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
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
    currentChange() {},
  },
  mounted() {
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

}
</style>